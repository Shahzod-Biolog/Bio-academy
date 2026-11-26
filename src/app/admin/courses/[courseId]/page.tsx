import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ConfirmButton } from "@/components/ConfirmButton";
import { SECTIONS, sectionOf } from "@/lib/sections";
import { deleteCourse, deleteLesson, deleteTopic, saveCourse, saveTest, saveTopic } from "../../actions";

type Topic = {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: { id: string; title: string; position: number; video_ref: string; notes: string }[];
  tests: { id: string; title: string; time_limit_minutes: number }[];
};

export default async function AdminCourse({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { courseId } = await params;
  const { saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: course } = await supabase.from("courses").select("*").eq("id", courseId).single();
  if (!course) notFound();
  const { data } = await supabase
    .from("topics")
    .select("id, title, description, position, lessons(id, title, position, video_ref, notes), tests(id, title, time_limit_minutes)")
    .eq("course_id", courseId)
    .order("position");
  const topics = (data ?? []) as Topic[];

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-slate-500">← Barcha kurslar</Link>
      {saved && <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-700">✓ Dars saqlandi</p>}

      <details className="card">
        <summary className="cursor-pointer text-xl font-bold">{course.title} <span className="text-sm font-normal text-slate-400">(tahrirlash)</span></summary>
        <form action={saveCourse} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={course.id} />
          <div><label className="label">Nomi</label><input name="title" className="input" defaultValue={course.title} required /></div>
          <div><label className="label">Tartib raqami</label><input name="position" type="number" className="input" defaultValue={course.position} /></div>
          <div>
            <label className="label">Bo&apos;lim</label>
            <select name="section" className="input" defaultValue={sectionOf(course)}>
              {SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><label className="label">Tavsif</label><textarea name="description" className="input" rows={2} defaultValue={course.description} /></div>
          <button className="btn">Saqlash</button>
        </form>
        <form action={deleteCourse} className="mt-3">
          <input type="hidden" name="id" value={course.id} />
          <ConfirmButton message="Kurs va undagi BARCHA mavzu, dars va testlar o'chiriladi. Ishonchingiz komilmi?">Kursni o&apos;chirish</ConfirmButton>
        </form>
      </details>

      {topics.map((t) => (
        <section key={t.id} className="card space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-lg font-bold">{t.position}. {t.title}</h2>
            <form action={deleteTopic}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="course_id" value={courseId} />
              <ConfirmButton message="Mavzu va undagi darslar, testlar o'chiriladi. Davom etasizmi?">Mavzuni o&apos;chirish</ConfirmButton>
            </form>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase text-slate-400">Darslar</h3>
            <ul className="space-y-2">
              {[...t.lessons].sort((a, b) => a.position - b.position).map((l) => (
                <li key={l.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                  <span className="font-medium">{l.position}. {l.title}</span>
                  {!l.video_ref && <span className="rounded bg-amber-100 px-1.5 text-xs text-amber-700">video yo&apos;q</span>}
                  {!l.notes && <span className="rounded bg-amber-100 px-1.5 text-xs text-amber-700">konspekt yo&apos;q</span>}
                  <span className="ml-auto flex gap-1">
                    <Link href={`/lessons/${l.id}`} className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100">Ko&apos;rish</Link>
                    <Link href={`/admin/lessons/${l.id}`} className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50">Tahrirlash</Link>
                    <form action={deleteLesson}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="course_id" value={courseId} />
                      <ConfirmButton message="Darsni o'chirasizmi?">O&apos;chirish</ConfirmButton>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
            <Link href={`/admin/lessons/new?topic=${t.id}`} className="btn-outline mt-2 py-1.5">➕ Dars qo&apos;shish</Link>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase text-slate-400">Testlar</h3>
            <ul className="space-y-2">
              {t.tests.map((test) => (
                <li key={test.id}>
                  <Link href={`/admin/tests/${test.id}`} className="flex justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 hover:border-amber-400">
                    <span className="font-medium">📝 {test.title}</span>
                    <span className="text-sm text-amber-700">{test.time_limit_minutes} daq · savollarni tahrirlash →</span>
                  </Link>
                </li>
              ))}
            </ul>
            <form action={saveTest} className="mt-2 flex flex-wrap gap-2">
              <input type="hidden" name="topic_id" value={t.id} />
              <input name="title" className="input max-w-xs" placeholder="Test nomi" required />
              <input name="time_limit_minutes" type="number" min={1} className="input w-28" defaultValue={20} title="Vaqt (daqiqa)" />
              <button className="btn-outline py-1.5">➕ Test qo&apos;shish</button>
            </form>
          </div>
        </section>
      ))}

      <form action={saveTopic} className="card space-y-3">
        <h2 className="font-bold">➕ Yangi mavzu</h2>
        <input type="hidden" name="course_id" value={courseId} />
        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <input name="title" className="input" placeholder="Mavzu nomi, masalan: Hujayra tuzilishi" required />
          <input name="position" type="number" className="input" defaultValue={topics.length + 1} title="Tartib raqami" />
        </div>
        <textarea name="description" className="input" rows={2} placeholder="Qisqacha tavsif (ixtiyoriy)" />
        <button className="btn">Mavzu qo&apos;shish</button>
      </form>
    </div>
  );
}
