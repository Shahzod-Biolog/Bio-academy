import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { EmptyState } from "@/components/CourseCard";
import { LabGrid } from "@/components/Illustrations";
import { ArrowLeftIcon, ArrowRightIcon, ClipboardIcon, ClockIcon, LeafIcon, PlayIcon, TONE_CLASSES, topicTheme } from "@/components/Icons";

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
  const { Icon, tone } = topicTheme(course.title);
  const lessonCount = topics.reduce((s, t) => s + t.lessons.length, 0);
  const testCount = topics.reduce((s, t) => s + t.tests.length, 0);

  return (
    <div className="space-y-8">
      <Link href="/courses" className="back-link"><ArrowLeftIcon size={16} /> Kurslar</Link>

      <section className="panel-dark p-6 sm:p-10">
        <LabGrid className="absolute inset-0 h-full w-full" />
        <div className={"pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl " + TONE_CLASSES[tone].glow} />
        <Icon size={220} strokeWidth={0.8} className={"pointer-events-none absolute -bottom-12 right-4 opacity-25 " + TONE_CLASSES[tone].accent} />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className={"icon-bubble h-16 w-16 border border-white/10 bg-white/5 " + TONE_CLASSES[tone].accent}>
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold sm:text-5xl">{course.title}</h1>
            {course.description && <p className="mt-2 max-w-2xl text-slate-400">{course.description}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="chip mono border border-white/10 bg-white/5 text-slate-300"><LeafIcon size={14} /> {topics.length} ta mavzu</span>
              <span className="chip mono border border-white/10 bg-white/5 text-slate-300"><PlayIcon size={14} /> {lessonCount} ta dars</span>
              <span className="chip mono border border-white/10 bg-white/5 text-slate-300"><ClipboardIcon size={14} /> {testCount} ta test</span>
            </div>
          </div>
        </div>
      </section>

      <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-[1.35rem] before:top-6 before:w-0.5 before:bg-gradient-to-b before:from-ink-900 before:to-slate-200 sm:before:left-[1.65rem]">
        {topics.map((t, i) => (
          <li key={t.id} className="relative flex gap-3 sm:gap-5">
            <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-slate-50 bg-ink-900 font-display text-lg font-bold text-brand-400 shadow-soft sm:h-14 sm:w-14 sm:text-xl">
              {i + 1}
            </span>
            <section className="card min-w-0 flex-1">
              <p className="eyebrow">{i + 1}-mavzu</p>
              <h2 className="mt-1 text-xl font-bold">{t.title}</h2>
              {t.description && <p className="mt-1 text-sm text-slate-500">{t.description}</p>}
              <ul className="mt-4 space-y-2">
                {[...t.lessons].sort((a, b) => a.position - b.position).map((l) => (
                  <li key={l.id}>
                    <Link href={`/lessons/${l.id}`} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-ink-900 hover:shadow-soft">
                      <span className="icon-bubble h-9 w-9 bg-brand-50 text-brand-700 transition group-hover:bg-ink-900 group-hover:text-brand-400"><PlayIcon size={18} /></span>
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
                      <span className="chip shrink-0 bg-white text-sun-700"><ClockIcon size={13} /> {test.time_limit_minutes} daq</span>
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
