import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";

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
      <div className="card p-6 text-center">
        <p className="text-slate-500">{(attempt.tests as unknown as { title: string } | null)?.title}</p>
        <p className="my-2 text-5xl font-extrabold text-brand-700">{attempt.score}/{attempt.total}</p>
        <p className="text-lg font-semibold">{pct}% {pct >= 70 ? "— Ajoyib! 🎉" : pct >= 40 ? "— Yaxshi, yana mashq qiling 💪" : "— Mavzuni qayta ko'rib chiqing 📚"}</p>
        <Link href={`/tests/${attempt.test_id}`} className="btn-outline mt-4">Qayta topshirish</Link>
      </div>

      {questions?.map((q, qi) => {
        const key = keyMap.get(q.id);
        const chosen = answers[q.id];
        const correct = key && chosen === key.correct_index;
        return (
          <div key={q.id} className={"card border-l-4 " + (correct ? "border-l-brand-500" : "border-l-red-400")}>
            <p className="mb-3 font-semibold">{qi + 1}. {q.text}</p>
            <ul className="space-y-1.5">
              {(q.options as string[]).map((opt, oi) => {
                const isCorrect = key?.correct_index === oi;
                const isChosen = chosen === oi;
                return (
                  <li
                    key={oi}
                    className={
                      "rounded-lg px-3 py-2 text-sm " +
                      (isCorrect ? "bg-brand-50 font-medium text-brand-900" : isChosen ? "bg-red-50 text-red-800" : "text-slate-600")
                    }
                  >
                    {LETTERS[oi]}) {opt} {isCorrect && "✓"} {isChosen && !isCorrect && "✗ (sizning javobingiz)"}
                  </li>
                );
              })}
            </ul>
            {chosen === undefined && <p className="mt-2 text-sm text-slate-500">Javob berilmagan</p>}
            {key?.explanation && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">💡 {key.explanation}</p>}
          </div>
        );
      })}
    </div>
  );
}
