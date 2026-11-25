import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { EmptyState } from "@/components/CourseCard";
import { Fern } from "@/components/Illustrations";
import { ArrowLeftIcon, ArrowRightIcon, ClipboardIcon, ClockIcon, LeafIcon, PlayIcon, topicTheme } from "@/components/Icons";

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
  const { Icon } = topicTheme(course.title);
  const lessonCount = topics.reduce((s, t) => s + t.lessons.length, 0);
  const testCount = topics.reduce((s, t) => s + t.tests.length, 0);

  return (
    <div className="space-y-8">
      <Link href="/courses" className="back-link"><ArrowLeftIcon size={16} /> Kurslar</Link>

      <section className="panel-sage grid md:grid-cols-[1.6fr_1fr]">
        <div className="p-6 sm:p-10">
          <span className="icon-bubble h-14 w-14 border border-ink-900 bg-slate-50 text-ink-900"><Icon size={26} /></span>
          <h1 className="mt-5 font-display text-5xl font-normal leading-none sm:text-7xl">{course.title}</h1>
          {course.description && <p className="mt-4 max-w-2xl text-[17px] text-ink-800">{course.description}</p>}
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="chip border border-ink-900 bg-slate-50 text-ink-900"><LeafIcon size={14} /> {topics.length} ta mavzu</span>
            <span className="chip border border-ink-900 bg-slate-50 text-ink-900"><PlayIcon size={14} /> {lessonCount} ta dars</span>
            <span className="chip border border-ink-900 bg-slate-50 text-ink-900"><ClipboardIcon size={14} /> {testCount} ta test</span>
          </div>
        </div>
        <div className="relative hidden overflow-hidden border-l border-ink-900 md:block">
          <Fern className="absolute -bottom-6 -left-4 h-[120%] w-[125%] max-w-none" />
        </div>
      </section>

      <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-[1.35rem] before:top-6 before:w-px before:bg-ink-900 sm:before:left-[1.65rem]">
        {topics.map((t, i) => (
          <li key={t.id} className="relative flex gap-3 sm:gap-5">
            <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-900 bg-sun-300 font-display text-lg font-semibold text-ink-900 sm:h-14 sm:w-14 sm:text-xl">
              {i + 1}
            </span>
            <section className="card min-w-0 flex-1">
              <p className="eyebrow">{i + 1}-mavzu</p>
              <h2 className="mt-1 text-2xl font-semibold">{t.title}</h2>
              {t.description && <p className="mt-1 text-sm text-slate-500">{t.description}</p>}
              <ul className="mt-4 space-y-2">
                {[...t.lessons].sort((a, b) => a.position - b.position).map((l) => (
                  <li key={l.id}>
                    <Link href={`/lessons/${l.id}`} className="group flex items-center gap-3 rounded-xl border border-ink-900/15 bg-slate-50 px-4 py-3 transition hover:border-ink-900">
                      <span className="icon-bubble h-9 w-9 bg-brand-200 text-ink-900 transition group-hover:bg-ink-900 group-hover:text-slate-50"><PlayIcon size={18} /></span>
                      <span className="min-w-0 flex-1 font-medium">{l.title}</span>
                      <ArrowRightIcon size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-ink-900" />
                    </Link>
                  </li>
                ))}
                {t.tests.map((test) => (
                  <li key={test.id}>
                    <Link href={`/tests/${test.id}`} className="group flex items-center gap-3 rounded-xl border border-sun-100 bg-sun-50 px-4 py-3 transition hover:border-sun-300">
                      <span className="icon-bubble h-9 w-9 bg-sun-100 text-sun-700"><ClipboardIcon size={18} /></span>
                      <span className="min-w-0 flex-1 font-medium">{test.title}</span>
                      <span className="chip shrink-0 bg-slate-50 text-sun-700"><ClockIcon size={13} /> {test.time_limit_minutes} daq</span>
                    </Link>
                  </li>
                ))}
                {t.lessons.length === 0 && t.tests.length === 0 && (
                  <li className="text-sm text-slate-400">Darslar tez orada qo&apos;shiladi</li>
                )}
              </ul>
            </section>
          </li>
        ))}
      </ol>
      {topics.length === 0 && <EmptyState icon={<LeafIcon />}>Bu kursda hali mavzular yo&apos;q.</EmptyState>}
    </div>
  );
}
