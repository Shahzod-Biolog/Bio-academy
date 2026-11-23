import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { TestRunner } from "@/components/TestRunner";
import { startTest } from "../actions";

export default async function TestPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { testId } = await params;
  const { attempt: attemptId } = await searchParams;
  const { supabase, user } = await requireUser();

  const { data: test } = await supabase
    .from("tests")
    .select("id, title, time_limit_minutes, topic_id, topics(title, course_id)")
    .eq("id", testId)
    .single();
  if (!test) notFound();
  const topic = test.topics as unknown as { title: string; course_id: string } | null;

  const { data: questions } = await supabase
    .from("questions")
    .select("id, text, options, position")
    .eq("test_id", testId)
    .order("position");

  if (attemptId) {
    const { data: attempt } = await supabase
      .from("test_attempts")
      .select("id, started_at, finished_at, user_id")
      .eq("id", attemptId)
      .single();
    if (!attempt || attempt.user_id !== user.id) notFound();
    if (attempt.finished_at) redirect(`/results/${attempt.id}`);
    const deadline = new Date(attempt.started_at).getTime() + test.time_limit_minutes * 60 * 1000;
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-bold">{test.title}</h1>
        <TestRunner
          attemptId={attempt.id}
          deadline={deadline}
          questions={(questions ?? []).map((q) => ({ id: q.id, text: q.text, options: q.options as string[] }))}
        />
      </div>
    );
  }

  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("id, score, total, finished_at")
    .eq("test_id", testId)
    .eq("user_id", user.id)
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {topic && <Link href={`/courses/${topic.course_id}`} className="text-sm text-slate-500">← {topic.title}</Link>}
      <div className="card space-y-4 p-6">
        <h1 className="text-2xl font-bold">📝 {test.title}</h1>
        <ul className="space-y-1 text-slate-600">
          <li>Savollar soni: <b>{questions?.length ?? 0}</b></li>
          <li>Vaqt: <b>{test.time_limit_minutes} daqiqa</b></li>
          <li>Vaqt tugaganda test avtomatik yakunlanadi.</li>
        </ul>
        {(questions?.length ?? 0) > 0 ? (
          <form action={startTest}>
            <input type="hidden" name="test_id" value={test.id} />
            <button className="btn w-full py-3 text-base">Testni boshlash</button>
          </form>
        ) : (
          <p className="text-slate-500">Bu testga hali savollar qo&apos;shilmagan.</p>
        )}
      </div>

      {attempts && attempts.length > 0 && (
        <div className="card">
          <h2 className="mb-2 font-bold">Oldingi urinishlaringiz</h2>
          <ul className="divide-y divide-slate-100">
            {attempts.map((a) => (
              <li key={a.id}>
                <Link href={`/results/${a.id}`} className="flex justify-between py-2 text-sm hover:text-brand-700">
                  <span>{formatDateTime(a.finished_at!)}</span>
                  <b>{a.score}/{a.total}</b>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
