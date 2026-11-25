"use client";

import { useEffect, useRef, useState } from "react";
import { SendIcon, SparkIcon } from "./Icons";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["Shu darsni qisqacha tushuntirib ber", "Asosiy atamalar nima?", "Menga misol keltir"];

export function LessonChat({ lessonId }: { lessonId: string }) {
  const storageKey = `chat:${lessonId}`;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, storageKey]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, messages: next }),
      });
      if (!res.ok || !res.body) {
        const errText = await res.text();
        setMessages([...next, { role: "assistant", content: "⚠️ " + (errText || "Xatolik yuz berdi.") }]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: answer }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "⚠️ Internet bilan aloqa uzildi. Qayta urinib ko'ring." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card flex flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-ink-900 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="icon-bubble h-10 w-10 bg-brand-400 text-ink-950"><SparkIcon size={20} /></span>
          <div>
            <h2 className="font-display text-lg font-bold leading-tight text-white">AI yordamchi</h2>
            <p className="text-xs text-slate-400">Dars bo&apos;yicha tushunmagan savolingizni bering</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="rounded-full px-3 py-1 text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white" disabled={loading}>
            Tozalash
          </button>
        )}
      </div>

      <div className="max-h-[28rem] min-h-40 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-ink-900 hover:text-ink-900">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-6 " +
                (m.role === "user" ? "rounded-br-md bg-ink-900 text-white" : "rounded-bl-md bg-brand-50 text-slate-800 ring-1 ring-brand-100")
              }
            >
              {m.content || <span className="animate-pulse text-slate-400">Yozmoqda...</span>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-slate-100 bg-slate-50/60 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yozing..."
          className="input"
          maxLength={2000}
          disabled={loading}
        />
        <button className="btn shrink-0 px-4" disabled={loading || !input.trim()} aria-label="Yuborish">
          <SendIcon size={18} /> <span className="hidden sm:inline">Yuborish</span>
        </button>
      </form>
    </section>
  );
}
