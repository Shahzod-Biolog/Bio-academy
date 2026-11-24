"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveImportedQuestions } from "@/app/admin/actions";
import type { ExtractResult, ExtractedQuestion } from "@/app/api/admin/parse-pdf/route";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const PAGES_PER_CHUNK = 4; // qo'shni bo'laklar 1 sahifa ustma-ust keladi
const MAX_CHUNK_BASE64 = 4_000_000; // Vercel so'rov chegarasi (~4.5 MB) ichida
const PARALLEL = 3;
const MAX_FILE_MB = 60;

type Chunk = { from: number; to: number; base64: string };
type Item = ExtractedQuestion & { key: string };

function toBase64(bytes: Uint8Array) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "").slice(0, 140);

async function splitPdf(file: File): Promise<{ chunks: Chunk[]; total: number }> {
  const { PDFDocument } = await import("pdf-lib");
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const total = src.getPageCount();
  const build = async (start: number, size: number) => {
    const doc = await PDFDocument.create();
    const idx = Array.from({ length: Math.min(size, total - start) }, (_, i) => start + i);
    (await doc.copyPages(src, idx)).forEach((p) => doc.addPage(p));
    return toBase64(await doc.save());
  };
  const chunks: Chunk[] = [];
  let s = 0;
  while (s < total) {
    let size = PAGES_PER_CHUNK;
    let b64 = await build(s, size);
    while (b64.length > MAX_CHUNK_BASE64 && size > 1) {
      size = Math.max(1, Math.floor(size / 2));
      b64 = await build(s, size);
    }
    if (b64.length > MAX_CHUNK_BASE64) throw new Error(`${s + 1}-sahifa juda og'ir (rasm sifati yuqori). PDF'ni siqib (compress) qayta yuklang.`);
    const to = Math.min(s + size, total);
    chunks.push({ from: s + 1, to, base64: b64 });
    if (to >= total) break;
    s = size > 1 ? to - 1 : to;
  }
  return { chunks, total };
}

function merge(results: ExtractResult[]): Item[] {
  const seen = new Map<string, Item>();
  const key: Record<number, string> = {};
  results.forEach((r) => r.answer_key?.forEach((a) => (key[a.number] = a.letter.trim().toUpperCase().charAt(0))));
  let n = 0;
  for (const r of results) {
    for (const q of r.questions ?? []) {
      const options = (q.options ?? []).map((o) => o.trim()).filter(Boolean).slice(0, 6);
      if (!q.text?.trim() || options.length < 2) continue;
      const item: Item = { ...q, text: q.text.trim(), options, key: `q${n++}` };
      if (item.correct >= options.length) item.correct = -1;
      const fromKey = item.number != null ? LETTERS.indexOf(key[item.number] ?? "") : -1;
      if (fromKey >= 0 && fromKey < options.length) {
        item.correct = fromKey;
        item.ai_answer = false;
      }
      const k = norm(item.text);
      const prev = seen.get(k);
      // Ustma-ust sahifalarda bir savol ikki marta kelishi mumkin — yaxshirog'ini qoldiramiz
      if (!prev || (prev.ai_answer && !item.ai_answer) || prev.options.length < item.options.length) seen.set(k, prev ? { ...item, key: prev.key } : item);
    }
  }
  return [...seen.values()];
}

export function PdfImporter({ testId }: { testId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [suggestAnswers, setSuggestAnswers] = useState(true);
  const [writeExplanations, setWriteExplanations] = useState(true);
  const [status, setStatus] = useState<"idle" | "reading" | "review" | "saving">("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [failed, setFailed] = useState<Chunk[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState<ExtractResult[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [onlyCheck, setOnlyCheck] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  async function runChunks(chunks: Chunk[], total: number, prevResults: ExtractResult[]) {
    setStatus("reading");
    setProgress({ done: 0, total: chunks.length });
    const out: (ExtractResult | undefined)[] = new Array(chunks.length);
    const bad: Chunk[] = [];
    let next = 0;
    let done = 0;
    let lastError = "";
    const worker = async () => {
      while (next < chunks.length) {
        const ci = next++;
        const c = chunks[ci];
        try {
          const res = await fetch("/api/admin/parse-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdf: c.base64, pageFrom: c.from, pageTo: c.to, totalPages: total, suggestAnswers, writeExplanations }),
          });
          const data = await res.json().catch(() => ({ error: `Server xatosi (${res.status})` }));
          if (!res.ok || data.error) throw new Error(data.error || `Xatolik ${res.status}`);
          out[ci] = data as ExtractResult;
        } catch (e) {
          lastError = e instanceof Error ? e.message : String(e);
          bad.push(c);
        }
        setProgress({ done: ++done, total: chunks.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(PARALLEL, chunks.length) }, worker));
    // Sahifa tartibini saqlash uchun natijalarni bo'lak tartibida joylaymiz
    const ordered = [...prevResults, ...out.filter((r): r is ExtractResult => !!r)];
    setResults(ordered);
    setItems(merge(ordered));
    setFailed(bad.sort((a, b) => a.from - b.from));
    setStatus("review");
    if (bad.length) setMessage({ kind: "error", text: `${bad.length} ta bo'lak o'qilmadi: ${lastError}` });
  }

  async function start() {
    const file = fileRef.current?.files?.[0];
    setMessage(null);
    if (!file) return setMessage({ kind: "error", text: "Avval PDF faylni tanlang." });
    if (file.size > MAX_FILE_MB * 1024 * 1024) return setMessage({ kind: "error", text: `Fayl ${MAX_FILE_MB} MB dan katta.` });
    try {
      setStatus("reading");
      const { chunks, total } = await splitPdf(file);
      setTotalPages(total);
      await runChunks(chunks, total, []);
    } catch (e) {
      setStatus("idle");
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "PDF ochilmadi." });
    }
  }

  const update = (k: string, patch: Partial<Item>) => setItems((xs) => xs.map((x) => (x.key === k ? { ...x, ...patch } : x)));
  const needsCheck = (q: Item) => q.correct < 0 || q.ai_answer;
  const shown = onlyCheck ? items.filter(needsCheck) : items;
  const missing = items.filter((q) => q.correct < 0).length;
  const aiCount = items.filter((q) => q.ai_answer).length;

  async function save() {
    setMessage(null);
    if (missing) return setMessage({ kind: "error", text: `${missing} ta savolda to'g'ri javob belgilanmagan.` });
    setStatus("saving");
    const res = await saveImportedQuestions(
      testId,
      items.map((q) => ({ text: q.text, options: q.options, correct: q.correct, explanation: q.explanation })),
    );
    if (!res.ok) {
      setStatus("review");
      return setMessage({ kind: "error", text: res.error });
    }
    setItems([]);
    setResults([]);
    setFailed([]);
    setStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
    setMessage({ kind: "ok", text: `✓ ${res.count} ta savol testga qo'shildi.` });
    router.refresh();
  }

  return (
    <div className="card space-y-4">
      <div>
        <h2 className="font-bold">📄 PDF fayldan savollarni yuklash</h2>
        <p className="mt-1 text-sm text-slate-500">
          Test savollari bor PDF'ni tanlang. AI savollarni, variantlarni va to&apos;g&apos;ri javoblarni o&apos;qib chiqadi. Saqlashdan oldin hammasini
          tekshirib, kerak bo&apos;lsa tuzatasiz.
        </p>
      </div>

      {message && (
        <p className={`rounded-lg p-3 text-sm ${message.kind === "error" ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"}`}>{message.text}</p>
      )}

      {(status === "idle" || status === "reading") && (
        <div className="space-y-3">
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="input" disabled={status === "reading"} />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={suggestAnswers} onChange={(e) => setSuggestAnswers(e.target.checked)} />
            <span>PDF&apos;da javobi ko&apos;rsatilmagan savollarga AI to&apos;g&apos;ri javobni taklif qilsin (sariq rangda belgilanadi — albatta tekshiring)</span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={writeExplanations} onChange={(e) => setWriteExplanations(e.target.checked)} />
            <span>Izohi yo&apos;q savollarga AI qisqa izoh yozsin (o&apos;quvchi natijada ko&apos;radi)</span>
          </label>
          <button type="button" className="btn" onClick={start} disabled={status === "reading"}>
            {status === "reading" ? "O'qilmoqda..." : "PDF'ni o'qish"}
          </button>
          {status === "reading" && (
            <div className="space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 5}%` }} />
              </div>
              <p className="text-xs text-slate-500">
                {progress.total ? `${progress.done} / ${progress.total} bo'lak tayyor.` : "PDF tayyorlanmoqda..."} 100 ta savol odatda 1–3 daqiqa oladi. Sahifani
                yopmang.
              </p>
            </div>
          )}
        </div>
      )}

      {(status === "review" || status === "saving") && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p>
              <b>{items.length}</b> ta savol topildi ({totalPages} sahifa).
              {aiCount > 0 && <> <span className="rounded bg-amber-100 px-1.5 text-amber-800">{aiCount} tasida javobni AI tanladi</span></>}
              {missing > 0 && <> <span className="rounded bg-red-100 px-1.5 text-red-700">{missing} tasida javob yo&apos;q</span></>}
            </p>
            <label className="mt-2 flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={onlyCheck} onChange={(e) => setOnlyCheck(e.target.checked)} />
              Faqat tekshirish kerak bo&apos;lganlarini ko&apos;rsatish
            </label>
            {failed.length > 0 && (
              <button type="button" className="btn-outline mt-2" onClick={() => runChunks(failed, totalPages, results)}>
                O&apos;qilmagan sahifalarni qayta o&apos;qish ({failed.map((c) => `${c.from}–${c.to}`).join(", ")})
              </button>
            )}
          </div>

          {shown.map((q) => {
            const i = items.indexOf(q);
            return (
              <div key={q.key} className={`space-y-2 rounded-xl border p-3 ${q.correct < 0 ? "border-red-300 bg-red-50/40" : q.ai_answer ? "border-amber-300 bg-amber-50/40" : "border-slate-200"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">
                    {i + 1}-savol {q.number != null && <span className="font-normal text-slate-400">(PDF&apos;da №{q.number})</span>}
                  </span>
                  <button type="button" className="btn-danger" onClick={() => setItems((xs) => xs.filter((x) => x.key !== q.key))}>
                    O&apos;chirish
                  </button>
                </div>
                <textarea className="input" rows={2} value={q.text} onChange={(e) => update(q.key, { text: e.target.value })} />
                {q.options.map((o, oi) => (
                  <label key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`c_${q.key}`}
                      className="h-4 w-4 accent-brand-600"
                      checked={q.correct === oi}
                      onChange={() => update(q.key, { correct: oi, ai_answer: false })}
                    />
                    <span className="w-5 font-bold">{LETTERS[oi]})</span>
                    <input
                      className="input"
                      value={o}
                      onChange={(e) => update(q.key, { options: q.options.map((x, xi) => (xi === oi ? e.target.value : x)) })}
                    />
                  </label>
                ))}
                {q.ai_answer && <p className="text-xs text-amber-700">⚠️ Bu javobni AI tanladi. To&apos;g&apos;ri bo&apos;lsa, doirachani bir marta bosib tasdiqlang.</p>}
                {q.correct < 0 && <p className="text-xs text-red-700">To&apos;g&apos;ri javob yonidagi doirachani belgilang.</p>}
                <input
                  className="input text-sm"
                  placeholder="Izoh (ixtiyoriy)"
                  value={q.explanation}
                  onChange={(e) => update(q.key, { explanation: e.target.value, ai_explanation: false })}
                />
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={save} disabled={status === "saving" || !items.length}>
              {status === "saving" ? "Saqlanmoqda..." : `${items.length} ta savolni testga qo'shish`}
            </button>
            <button
              type="button"
              className="btn-outline"
              disabled={status === "saving"}
              onClick={() => {
                setItems([]);
                setResults([]);
                setFailed([]);
                setStatus("idle");
                setMessage(null);
              }}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
