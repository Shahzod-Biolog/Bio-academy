import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ConfirmButton } from "@/components/ConfirmButton";
import { addQuestion, deleteQuestion, deleteTest, importQuestions, saveTest } from "../../actions";

const LETTERS = ["A", "B", "C", "D", "E"];
const SAMPLE = `1. Hujayraning energiya markazi qaysi organoid?
A) Yadro
*B) Mitoxondriya
C) Ribosoma
D) Lizosoma
Izoh: Mitoxondriyada ATF sintezlanadi.

2. Fotosintez qayerda boradi?
*A) Xloroplastda
B) Yadroda
C) Vakuolada
D) Golji apparatida`;

export default async function AdminTest({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ error?: string; imported?: string }>;
}) {
  const { testId } = await params;
  const { error, imported } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: test } = await supabase.from("tests").select("*, topics(title, course_id)").eq("id", testId).single();
  if (!test) notFound();
  const topic = test.topics as { title: string; course_id: string };
  const { data: questions } = await supabase
    .from("questions")
    .select("id, text, options, position, question_keys(correct_index, explanation)")
    .eq("test_id", testId)
    .order("position");
  const { count: attempts } = await supabase.from("test_attempts").select("id", { count: "exact", head: true }).eq("test_id", testId).not("finished_at", "is", null);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href={`/admin/courses/${topic.course_id}`} className="text-sm text-slate-500">← {topic.title}</Link>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {imported && <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-700">✓ {imported} ta savol qo&apos;shildi</p>}

      <form action={saveTest} className="card grid gap-3 sm:grid-cols-[1fr_9rem_auto] sm:items-end">
        <input type="hidden" name="id" value={test.id} />
        <div><label className="label">Test nomi</label><input name="title" className="input" defaultValue={test.title} required /></div>
        <div><label className="label">Vaqt (daqiqa)</label><input name="time_limit_minutes" type="number" min={1} className="input" defaultValue={test.time_limit_minutes} /></div>
        <button className="btn">Saqlash</button>
      </form>
      <p className="text-sm text-slate-500">Topshirilgan urinishlar: <b>{attempts ?? 0}</b></p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Savollar ({questions?.length ?? 0})</h2>
        {questions?.map((q, qi) => {
          const key = (q.question_keys as unknown as { correct_index: number; explanation: string } | null);
          return (
            <div key={q.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{qi + 1}. {q.text}</p>
                <form action={deleteQuestion}>
                  <input type="hidden" name="id" value={q.id} />
                  <input type="hidden" name="test_id" value={test.id} />
                  <ConfirmButton message="Savolni o'chirasizmi?">O&apos;chirish</ConfirmButton>
                </form>
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {(q.options as string[]).map((o, oi) => (
                  <li key={oi} className={key?.correct_index === oi ? "font-semibold text-brand-700" : "text-slate-600"}>
                    {LETTERS[oi]}) {o} {key?.correct_index === oi && "✓"}
                  </li>
                ))}
              </ul>
              {key?.explanation && <p className="mt-2 text-sm text-slate-500">💡 {key.explanation}</p>}
            </div>
          );
        })}
      </section>

      <form action={addQuestion} className="card space-y-3">
        <h2 className="font-bold">➕ Bitta savol qo&apos;shish</h2>
        <input type="hidden" name="test_id" value={test.id} />
        <textarea name="text" className="input" rows={2} placeholder="Savol matni" required />
        {LETTERS.map((l, i) => (
          <label key={l} className="flex items-center gap-2">
            <input type="radio" name="correct" value={i} required className="h-4 w-4 accent-brand-600" title="To'g'ri javob" />
            <span className="w-5 font-bold">{l})</span>
            <input name={`option_${i}`} className="input" placeholder={i < 2 ? "Variant (majburiy)" : "Variant (ixtiyoriy)"} required={i < 2} />
          </label>
        ))}
        <p className="text-xs text-slate-500">To&apos;g&apos;ri javob yonidagi doirachani belgilang.</p>
        <input name="explanation" className="input" placeholder="Izoh (natijada ko'rsatiladi, ixtiyoriy)" />
        <button className="btn">Savolni qo&apos;shish</button>
      </form>

      <form action={importQuestions} className="card space-y-3">
        <h2 className="font-bold">📋 Ko&apos;p savolni birdaniga qo&apos;shish</h2>
        <p className="text-sm text-slate-500">
          Savollarni quyidagi formatda joylang: to&apos;g&apos;ri javob oldiga <b>*</b> qo&apos;ying, savollar orasida bo&apos;sh qator qoldiring.
        </p>
        <input type="hidden" name="test_id" value={test.id} />
        <textarea name="bulk" className="input font-mono text-sm" rows={12} placeholder={SAMPLE} required />
        <button className="btn">Import qilish</button>
      </form>

      <form action={deleteTest}>
        <input type="hidden" name="id" value={test.id} />
        <input type="hidden" name="course_id" value={topic.course_id} />
        <ConfirmButton message="Test, uning savollari va barcha natijalar o'chiriladi. Davom etasizmi?">Testni o&apos;chirish</ConfirmButton>
      </form>
    </div>
  );
}
