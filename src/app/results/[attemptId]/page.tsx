import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { CheckIcon, LightbulbIcon, XIcon } from "@/components/Icons";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default async function ResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const { supabase } = await requireUser();
  const { data: attempt } = await supabase
    .from("test_attempts")
    .select("id, test_id, score, total, answers, finished_at, question_ids, tests(title)")
    .eq("id", attemptId)
    .single();
  if (!attempt || !attempt.finished_at) notFound();

  const [{ data: allQuestions }, { data: keys }] = await Promise.all([
    supabase.from("questions").select("id, text, options, position").eq("test_id", attempt.test_id).order("position"),
    supabase.rpc("attempt_review", { p_attempt_id: attempt.id }),
  ]);
  const picked = attempt.question_ids as string[] | null;
  const questions = picked ? (allQuestions ?? []).filter((q) => picked.includes(q.id)) : allQuestions;
  const keyMap = new Map((keys as { question_id: string; correct_index: number; explanation: string }[] | null ?? []).map((k) => [k.question_id, k]));
  const answers = (attempt.answers ?? {}) as Record<string, number>;
  const pct = attempt.total ? Math.round(((attempt.score ?? 0) / attempt.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card relative overflow-hidden p-6 text-center sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-50/70 to-transparent" />
        <p className="relative font-medium text-slate-500">{(attempt.tests as unknown as { title: string } | null)?.title}</p>
        <div
          className="relative mx-auto my-5 flex h-40 w-40 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${pct >= 70 ? "#14b886" : pct >= 40 ? "#f7ad2a" : "#ef4444"} ${pct * 3.6}deg, #ebf0ec 0deg)` }}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
            <span className="font-display text-4xl font-bold text-slate-900">{pct}%</span>
            <span className="text-sm font-semibold text-slate-500">{attempt.score}/{attempt.total}</span>
          </div>
        </div>
        <p className="relative text-lg font-semibold text-slate-800">{pct >= 70 ? "Ajoyib natija! 🎉" : pct >= 40 ? "Yaxshi, yana mashq qiling 💪" : "Mavzuni qayta ko'rib chiqing 📚"}</p>
        <Link href={`/tests/${attempt.test_id}`} className="btn-outline relative mt-5">Qayta topshirish</Link>
      </div>

      {questions?.map((q, qi) => {
        const key = keyMap.get(q.id);
        const chosen = answers[q.id];
        const correct = key && chosen === key.correct_index;
        return (
          <div key={q.id} className="card">
            <p className="mb-4 flex gap-3 font-semibold leading-relaxed text-slate-900">
              <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white " + (correct ? "bg-brand-500" : "bg-red-400")}>
                {correct ? <CheckIcon size={15} /> : <XIcon size={15} />}
              </span>
              <span>{qi + 1}. {q.text}</span>
            </p>
            <ul className="space-y-1.5">
              {(q.options as string[]).map((opt, oi) => {
                const isCorrect = key?.correct_index === oi;
                const isChosen = chosen === oi;
                return (
                  <li
                    key={oi}
                    className={
                      "rounded-2xl px-4 py-2.5 text-sm " +
                      (isCorrect ? "bg-brand-50 font-medium text-brand-900 ring-1 ring-brand-200" : isChosen ? "bg-red-50 text-red-800 ring-1 ring-red-100" : "text-slate-600")
                    }
                  >
                    {LETTERS[oi]}) {opt} {isCorrect && "✓"} {isChosen && !isCorrect && "✗ (sizning javobingiz)"}
                  </li>
                );
              })}
            </ul>
            {chosen === undefined && <p className="mt-2 text-sm text-slate-500">Javob berilmagan</p>}
            {key?.explanation && <p className="mt-4 flex gap-2.5 rounded-2xl bg-sun-50 p-4 text-sm leading-relaxed text-slate-700"><LightbulbIcon size={18} className="mt-0.5 shrink-0 text-sun-600" /> {key.explanation}</p>}
          </div>
        );
      })}
    </div>
  );
}
