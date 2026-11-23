import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";

type Topic = {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: { id: string; title: string; position: number }[];
  tests: { id: string; title: string; time_limit_minutes: number }[];
};

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const { supabase } = await requireUser();
  const { data: course } = await supabase.from("courses").select("id, title, description").eq("id", courseId).single();
  if (!course) notFound();

  const { data } = await supabase
    .from("topics")
    .select("id, title, description, position, lessons(id, title, position), tests(id, title, time_limit_minutes)")
    .eq("course_id", courseId)
    .order("position");
  const topics = (data ?? []) as Topic[];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/courses" className="text-sm text-slate-500">← Kurslar</Link>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{course.title}</h1>
        <p className="text-slate-500">{course.description}</p>
      </div>

      {topics.map((t, i) => (
        <section key={t.id} className="card">
          <h2 className="text-lg font-bold">
            {i + 1}-mavzu. {t.title}
          </h2>
          {t.description && <p className="mt-1 text-sm text-slate-500">{t.description}</p>}
          <ul className="mt-4 space-y-2">
            {[...t.lessons].sort((a, b) => a.position - b.position).map((l) => (
              <li key={l.id}>
                <Link href={`/lessons/${l.id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:border-brand-500 hover:bg-brand-50">
                  <span className="text-xl">▶️</span>
                  <span className="font-medium">{l.title}</span>
                </Link>
              </li>
            ))}
            {t.tests.map((test) => (
              <li key={test.id}>
                <Link href={`/tests/${test.id}`} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:border-amber-400">
                  <span className="text-xl">📝</span>
                  <span className="font-medium">{test.title}</span>
                  <span className="ml-auto text-sm text-amber-700">{test.time_limit_minutes} daqiqa</span>
                </Link>
              </li>
            ))}
            {t.lessons.length === 0 && t.tests.length === 0 && (
              <li className="text-sm text-slate-400">Darslar tez orada qo&apos;shiladi</li>
            )}
          </ul>
        </section>
      ))}
      {topics.length === 0 && <p className="card text-slate-500">Bu kursda hali mavzular yo&apos;q.</p>}
    </div>
  );
}
