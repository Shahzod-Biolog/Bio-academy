import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { TestRunner } from "@/components/TestRunner";
import { ScoreBadge } from "@/components/CourseCard";
import { ArrowLeftIcon, ClipboardIcon, ClockIcon, LightbulbIcon } from "@/components/Icons";
import { startTest } from "../actions";

const COUNT_CHOICES = [10, 20, 30, 40, 50];

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
      .select("id, started_at, finished_at, user_id, question_ids, time_limit_minutes")
      .eq("id", attemptId)
      .single();
    if (!attempt || attempt.user_id !== user.id) notFound();
    if (attempt.finished_at) redirect(`/results/${attempt.id}`);
    const minutes = attempt.time_limit_minutes ?? test.time_limit_minutes;
    const deadline = new Date(attempt.started_at).getTime() + minutes * 60 * 1000;
    const chosen = attempt.question_ids as string[] | null;
    const attemptQuestions = chosen ? (questions ?? []).filter((q) => chosen.includes(q.id)) : (questions ?? []);
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="page-title mb-4 text-2xl sm:text-3xl">{test.title}</h1>
        <TestRunner
          attemptId={attempt.id}
          deadline={deadline}
          questions={attemptQuestions.map((q) => ({ id: q.id, text: q.text, options: q.options as string[] }))}
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

  const { data: openAttempts } = await supabase
    .from("test_attempts")
    .select("id, started_at, time_limit_minutes, question_ids")
    .eq("test_id", testId)
    .eq("user_id", user.id)
    .is("finished_at", null)
    .order("started_at", { ascending: false })
    .limit(1);
  const open = openAttempts?.[0];
  const openActive =
    open && new Date(open.started_at).getTime() + (open.time_limit_minutes ?? test.time_limit_minutes) * 60 * 1000 > Date.now();

  const pool = questions?.length ?? 0;
  const countOptions = COUNT_CHOICES.filter((n) => n < pool);
  const minutesFor = (n: number) => Math.max(1, Math.ceil((test.time_limit_minutes * n) / pool));

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {topic && <Link href={`/courses/${topic.course_id}`} className="back-link"><ArrowLeftIcon size={16} /> {topic.title}</Link>}
      <div className="card space-y-6 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="icon-bubble h-14 w-14 bg-panel text-sun-300"><ClipboardIcon size={28} /></span>
          <div>
            <p className="eyebrow text-sun-700">Test</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{test.title}</h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-display text-3xl font-bold text-slate-900">{pool}</p>
            <p className="text-sm text-slate-500">ta savol</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-1.5 font-display text-3xl font-bold text-slate-900"><ClockIcon size={20} className="text-brand-600" />{test.time_limit_minutes}</p>
            <p className="text-sm text-slate-500">daqiqa (barcha savollarga)</p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm text-slate-500"><LightbulbIcon size={16} className="shrink-0 text-sun-600" /> Vaqt tugaganda test avtomatik yakunlanadi.</p>
        {pool > 0 && openActive ? (
          <div className="space-y-3">
            <p className="rounded-2xl bg-sun-50 p-4 text-sm text-sun-700 ring-1 ring-sun-100">
              Sizda boshlangan, lekin yakunlanmagan test bor
              {open.question_ids ? ` (${(open.question_ids as string[]).length} ta savol)` : ""}.
            </p>
            <Link href={`/tests/${test.id}?attempt=${open.id}`} className="btn w-full py-3 text-base">
              Testni davom ettirish
            </Link>
          </div>
        ) : pool > 0 ? (
          <form action={startTest} className="space-y-4">
            <input type="hidden" name="test_id" value={test.id} />
            {countOptions.length > 0 && (
              <fieldset>
                <legend className="mb-3 font-display text-lg font-bold text-slate-900">Nechta savol yechasiz?</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {countOptions.map((n) => (
                    <label key={n} className="cursor-pointer">
                      <input type="radio" name="count" value={n} className="peer sr-only" />
                      <span className="block rounded-xl border border-slate-200 bg-paper px-3 py-3.5 text-center transition peer-checked:border-brand-400 peer-checked:bg-brand-400 peer-checked:text-night peer-checked:[&_span]:text-night/70 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300 hover:border-brand-300">
                        <b className="block text-lg">{n} ta</b>
                        <span className="text-xs text-slate-500">{minutesFor(n)} daqiqa</span>
                      </span>
                    </label>
                  ))}
                  <label className="cursor-pointer">
                    <input type="radio" name="count" value="all" defaultChecked className="peer sr-only" />
                    <span className="block rounded-xl border border-slate-200 bg-paper px-3 py-3.5 text-center transition peer-checked:border-brand-400 peer-checked:bg-brand-400 peer-checked:text-night peer-checked:[&_span]:text-night/70 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300 hover:border-brand-300">
                      <b className="block text-lg">Barchasi</b>
                      <span className="text-xs text-slate-500">{pool} ta · {test.time_limit_minutes} daqiqa</span>
                    </span>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-500">Savollar testdan tasodifiy tanlanadi, har safar har xil bo&apos;ladi.</p>
              </fieldset>
            )}
            <button className="btn-accent w-full py-3 text-base">Testni boshlash</button>
          </form>
        ) : (
          <p className="text-slate-500">Bu testga hali savollar qo&apos;shilmagan.</p>
        )}
      </div>

      {attempts && attempts.length > 0 && (
        <div className="card">
          <h2 className="mb-2 font-display text-lg font-bold">Oldingi urinishlaringiz</h2>
          <ul className="divide-y divide-slate-100">
            {attempts.map((a) => (
              <li key={a.id}>
                <Link href={`/results/${a.id}`} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-brand-700">
                  <span>{formatDateTime(a.finished_at!)}</span>
                  <ScoreBadge score={a.score} total={a.total} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
