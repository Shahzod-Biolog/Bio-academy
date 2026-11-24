import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
// Vercel Hobby: bitta so'rov 300 soniyagacha. Brauzer PDF'ni 4 sahifalik bo'laklarga bo'lib yuboradi,
// shuning uchun har bir so'rov odatda 30–90 soniyada tugaydi.
export const maxDuration = 300;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
// Vercel so'rov hajmi chegarasi ~4.5 MB; base64 ~33% kattaroq
const MAX_BASE64_CHARS = 4_200_000;

export type ExtractedQuestion = {
  number: number | null;
  text: string;
  options: string[];
  correct: number; // -1 = PDF'da ko'rsatilmagan
  ai_answer: boolean; // to'g'ri javobni AI taklif qildi (PDF'da yo'q edi)
  explanation: string;
  ai_explanation: boolean;
};
export type ExtractResult = { questions: ExtractedQuestion[]; answer_key: { number: number; letter: string }[] };

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["questions", "answer_key"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "text", "options", "correct", "ai_answer", "explanation", "ai_explanation"],
        properties: {
          number: { type: ["integer", "null"], description: "Savolning PDF'dagi tartib raqami" },
          text: { type: "string" },
          options: { type: "array", items: { type: "string" }, description: "Variantlar matni, harfsiz (A), B) olib tashlangan)" },
          correct: { type: "integer", description: "To'g'ri variant indeksi (0 = A). Noma'lum bo'lsa -1" },
          ai_answer: { type: "boolean" },
          explanation: { type: "string" },
          ai_explanation: { type: "boolean" },
        },
      },
    },
    answer_key: {
      type: "array",
      description: "PDF'dagi alohida javoblar jadvali (masalan '1-B, 2-C'), bo'lsa",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "letter"],
        properties: { number: { type: "integer" }, letter: { type: "string" } },
      },
    },
  },
} as const;

function prompt(o: { pageFrom: number; pageTo: number; totalPages: number; suggestAnswers: boolean; writeExplanations: boolean }) {
  return `Bu biologiya test savollari to'plamining ${o.pageFrom}–${o.pageTo}-sahifalari (jami ${o.totalPages} sahifa).
Vazifa: shu sahifalardagi barcha test savollarini aniq, so'zma-so'z ajratib ol.

Qoidalar:
- Savol va variantlar matnini o'zgartirma, tarjima qilma, qisqartirma. Faqat raqam ("12.") va harflarni ("A)", "B.") olib tashla. Imlo xatolarini tuzatmasdan, PDF'dagidek qoldir. Formulalar va indekslarni oddiy matnda yoz (masalan H2O, CO2, ATF).
- Faqat shu sahifalarda TO'LIQ ko'rinib turgan savollarni ol. Sahifa boshida o'rtasidan boshlanib qolgan yoki oxirida tugamay qolgan savolni tashlab ket (u qo'shni bo'lakda to'liq keladi).
- To'g'ri javob PDF'da belgilangan bo'lsa (yulduzcha *, qalin/rangli/tagiga chizilgan variant, "Javob: B", savol yonidagi belgi) — "correct" ga shu indeksni yoz, "ai_answer": false.
- Agar sahifalarda javoblar jadvali bo'lsa (masalan "1-B 2-A 3-D" yoki jadval) — uni "answer_key" ga yoz. Bunday holda shu jadvaldagi savollar uchun "correct" ni ham to'ldir.
- ${
    o.suggestAnswers
      ? `To'g'ri javob PDF'da umuman ko'rsatilmagan bo'lsa, biologiya bilimingga tayanib to'g'ri javobni aniqla, "ai_answer": true qil. Ishonching komil bo'lmasa ham eng to'g'ri variantni tanla.`
      : `To'g'ri javob PDF'da ko'rsatilmagan bo'lsa "correct": -1, "ai_answer": false.`
  }
- ${
    o.writeExplanations
      ? `PDF'da izoh/yechim bo'lsa, uni "explanation" ga yoz ("ai_explanation": false). Bo'lmasa, nima uchun to'g'ri javob to'g'ri ekanini o'zbek tilida (lotin) 1–2 gapda qisqa tushuntir ("ai_explanation": true).`
      : `PDF'da izoh/yechim bo'lsa "explanation" ga yoz, bo'lmasa bo'sh qoldir. "ai_explanation": false.`
  }
- Rasm yoki sxemaga tayangan savollarni ham ol, lekin matn boshiga "[Rasmli savol] " deb qo'sh.
- Test savoli bo'lmagan matnni (sarlavha, kirish, reklama) e'tiborsiz qoldir. Savol topilmasa bo'sh ro'yxat qaytar.`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "ANTHROPIC_API_KEY sozlanmagan." }, { status: 503 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Avval tizimga kiring." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return Response.json({ error: "Faqat admin uchun." }, { status: 403 });

  let body: { pdf?: string; pageFrom?: number; pageTo?: number; totalPages?: number; suggestAnswers?: boolean; writeExplanations?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }
  if (!body.pdf || typeof body.pdf !== "string") return Response.json({ error: "PDF topilmadi." }, { status: 400 });
  if (body.pdf.length > MAX_BASE64_CHARS) return Response.json({ error: "Bu bo'lak juda katta." }, { status: 413 });

  const client = new Anthropic();
  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA as unknown as Record<string, unknown> } },
      messages: [
        {
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: body.pdf } },
            {
              type: "text",
              text: prompt({
                pageFrom: Number(body.pageFrom) || 1,
                pageTo: Number(body.pageTo) || 1,
                totalPages: Number(body.totalPages) || 1,
                suggestAnswers: body.suggestAnswers !== false,
                writeExplanations: body.writeExplanations !== false,
              }),
            },
          ],
        },
      ],
    });
    const msg = await stream.finalMessage();
    if (msg.stop_reason === "refusal") return Response.json({ error: "AI bu sahifalarni o'qishdan bosh tortdi." }, { status: 422 });
    if (msg.stop_reason === "max_tokens") return Response.json({ error: "Sahifalarda savol juda ko'p, javob sig'madi." }, { status: 422 });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = JSON.parse(text) as ExtractResult;
    return Response.json(parsed);
  } catch (err) {
    console.error("parse-pdf error", err);
    if (err instanceof Anthropic.RateLimitError) return Response.json({ error: "AI band, birozdan keyin urinib ko'ring." }, { status: 429 });
    if (err instanceof Anthropic.APIError) return Response.json({ error: `AI xatosi: ${err.message}` }, { status: 502 });
    return Response.json({ error: "PDF'ni o'qishda xatolik." }, { status: 500 });
  }
}
