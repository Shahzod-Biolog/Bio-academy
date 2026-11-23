"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { submitTest } from "@/app/tests/actions";

type Question = { id: string; text: string; options: string[] };

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function TestRunner({ attemptId, questions, deadline }: { attemptId: string; questions: Question[]; deadline: number }) {
  const storageKey = `answers:${attemptId}`;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [left, setLeft] = useState(() => Math.max(0, deadline - Date.now()));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const submitted = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const submit = useCallback(
    (current: Record<string, number>) => {
      if (submitted.current) return;
      submitted.current = true;
      startTransition(async () => {
        const res = await submitTest(attemptId, current);
        if (res?.error) {
          submitted.current = false;
          setError(res.error);
        } else {
          try {
            localStorage.removeItem(storageKey);
          } catch {}
        }
      });
    },
    [attemptId, storageKey],
  );

  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    const t = setInterval(() => {
      const ms = Math.max(0, deadline - Date.now());
      setLeft(ms);
      if (ms === 0) {
        clearInterval(t);
        submit(answersRef.current);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [deadline, submit]);

  function choose(qid: string, idx: number) {
    const next = { ...answers, [qid]: idx };
    setAnswers(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  }

  const mins = Math.floor(left / 60000);
  const secs = Math.floor((left % 60000) / 1000);
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-20 -mx-4 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <span className="text-sm text-slate-600">
          Javob berildi: <b>{answered}</b> / {questions.length}
        </span>
        <span className={"rounded-lg px-3 py-1 font-mono text-lg font-bold " + (left < 60000 ? "bg-red-100 text-red-700" : "bg-brand-50 text-brand-700")}>
          ⏱ {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>

      {questions.map((q, qi) => (
        <div key={q.id} className="card">
          <p className="mb-3 font-semibold">
            {qi + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const active = answers[q.id] === oi;
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => choose(q.id, oi)}
                  disabled={pending}
                  className={
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition " +
                    (active ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-slate-400")
                  }
                >
                  <span className={"flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " + (active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600")}>
                    {LETTERS[oi]}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button
        className="btn w-full py-3 text-base"
        disabled={pending}
        onClick={() => {
          if (answered < questions.length && !confirm(`${questions.length - answered} ta savolga javob bermadingiz. Baribir yakunlaysizmi?`)) return;
          submit(answers);
        }}
      >
        {pending ? "Yuborilmoqda..." : "Testni yakunlash"}
      </button>
    </div>
  );
}
