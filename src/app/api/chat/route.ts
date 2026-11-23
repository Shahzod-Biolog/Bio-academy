import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 50);
const MAX_HISTORY = 20;
const MAX_QUESTION_CHARS = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function systemPrompt(lesson: { title: string; description: string; notes: string; topic: string; course: string }) {
  return `Sen "Bio Academy" biologiya onlayn platformasidagi o'quvchilarga yordam beruvchi AI ustozsan.
O'quvchi hozir "${lesson.course}" kursi, "${lesson.topic}" mavzusidagi "${lesson.title}" darsini ko'rib chiqdi va tushunmagan savollarini beradi.

Qoidalar:
- Har doim o'zbek tilida (lotin yozuvida) javob ber, agar o'quvchi boshqa tilda yozmasa.
- Javobni avvalo quyidagi dars konspektiga asoslan. Konspektda bo'lmagan, lekin biologiyaga oid savollarga ham javob ber, ammo "bu darsda bunday aytilmagan, lekin..." deb aniq ajratib ko'rsat.
- Sodda, maktab o'quvchisi tushunadigan tilda tushuntir. Kerak bo'lsa hayotiy misol keltir. Javobni qisqa va aniq qil (odatda 3–8 gap yoki qisqa ro'yxat).
- O'quvchi xato tushungan bo'lsa, muloyimlik bilan to'g'irla.
- Agar savol biologiya va o'qishga mutlaqo aloqasiz bo'lsa, muloyimlik bilan darsga qaytishni taklif qil.
- Uy vazifasi yoki test javobini shunchaki aytib berma — fikrlashga yordam beradigan qadamlar bilan tushuntir.
- Bilmagan yoki ishonchsiz narsangni to'qima: "aniq bilmayman, ustozingizdan so'rang" de.

<dars_konspekti>
Dars nomi: ${lesson.title}
${lesson.description ? `Qisqacha: ${lesson.description}\n` : ""}
${lesson.notes || "(Bu dars uchun konspekt hali kiritilmagan. Umumiy biologiya bilimingga tayan.)"}
</dars_konspekti>`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("AI yordamchi hali sozlanmagan (ANTHROPIC_API_KEY yo'q).", { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Avval tizimga kiring.", { status: 401 });

  let body: { lessonId?: string; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response("Noto'g'ri so'rov.", { status: 400 });
  }
  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_HISTORY);
  // Suhbat foydalanuvchi xabari bilan boshlanishi va tugashi kerak
  while (history.length && history[0].role !== "user") history.shift();
  const last = history.at(-1);
  if (!body.lessonId || !last || last.role !== "user") return new Response("Savol topilmadi.", { status: 400 });
  if (last.content.length > MAX_QUESTION_CHARS) return new Response("Savol juda uzun.", { status: 400 });

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, description, notes, topics(title, courses(title))")
    .eq("id", body.lessonId)
    .single();
  if (!lesson) return new Response("Dars topilmadi.", { status: 404 });

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await supabase
    .from("ai_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_LIMIT) {
    return new Response(`Bugungi savollar limiti (${DAILY_LIMIT} ta) tugadi. Ertaga yana urinib ko'ring.`, { status: 429 });
  }
  await supabase.from("ai_messages").insert({ user_id: user.id, lesson_id: lesson.id, question: last.content });

  const topic = lesson.topics as unknown as { title: string; courses: { title: string } | null } | null;
  const system = systemPrompt({
    title: lesson.title,
    description: lesson.description,
    notes: lesson.notes,
    topic: topic?.title ?? "",
    course: topic?.courses?.title ?? "",
  });

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    // Konspekt har savolda bir xil — keshlash narxni kamaytiradi
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nKechirasiz, bu savolga javob bera olmayman. Savolni boshqacha ifodalab ko'ring."));
        }
      } catch (err) {
        console.error("AI chat error", err);
        controller.enqueue(encoder.encode("\n\n⚠️ Javob olishda xatolik yuz berdi. Birozdan keyin qayta urinib ko'ring."));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
