import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonChat } from "@/components/LessonChat";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClipboardIcon, NotesIcon, PlayIcon } from "@/components/Icons";
import type { VideoProvider } from "@/lib/video";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const { supabase } = await requireUser();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, description, video_provider, video_ref, notes, topic_id, topics(id, title, course_id, courses(id, title))")
    .eq("id", lessonId)
    .single();
  if (!lesson) notFound();

  const topic = lesson.topics as unknown as { id: string; title: string; course_id: string; courses: { id: string; title: string } } | null;
  const [{ data: siblings }, { data: tests }] = await Promise.all([
    supabase.from("lessons").select("id, title, position").eq("topic_id", lesson.topic_id).order("position"),
    supabase.from("tests").select("id, title").eq("topic_id", lesson.topic_id),
  ]);
  const idx = siblings?.findIndex((s) => s.id === lesson.id) ?? -1;
  const nextLesson = idx >= 0 ? siblings?.[idx + 1] : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="min-w-0 space-y-6 lg:col-span-2">
        <div>
          {topic && (
            <Link href={`/courses/${topic.course_id}`} className="back-link">
              <ArrowLeftIcon size={16} /> {topic.courses?.title} / {topic.title}
            </Link>
          )}
          <h1 className="page-title mt-2 text-2xl sm:text-3xl">{lesson.title}</h1>
        </div>
        <VideoPlayer provider={lesson.video_provider as VideoProvider} videoRef={lesson.video_ref} title={lesson.title} />
        {lesson.description && <p className="text-[16px] leading-relaxed text-slate-600">{lesson.description}</p>}

        <LessonChat lessonId={lesson.id} />

        {lesson.notes && (
          <details className="card group p-0" open>
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4">
              <span className="icon-bubble h-10 w-10 bg-ink-900 text-brand-400"><NotesIcon size={20} /></span>
              <span className="flex-1 font-display text-lg font-bold">Dars konspekti</span>
              <ArrowRightIcon size={18} className="text-slate-400 transition group-open:rotate-90" />
            </summary>
            <div className="prose-notes border-t border-slate-100 px-5 py-5">{lesson.notes}</div>
          </details>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card">
          <h2 className="mb-3 font-display text-lg font-bold">Mavzu darslari</h2>
          <ol className="space-y-1">
            {siblings?.map((s, i) => {
              const current = s.id === lesson.id;
              const done = idx >= 0 && i < idx;
              return (
                <li key={s.id}>
                  <Link
                    href={`/lessons/${s.id}`}
                    className={
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition " +
                      (current ? "bg-ink-900 font-semibold text-white" : "text-slate-600 hover:bg-slate-100")
                    }
                  >
                    <span
                      className={
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                        (current ? "bg-brand-400 text-ink-950" : done ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500")
                      }
                    >
                      {current ? <PlayIcon size={14} /> : done ? <CheckIcon size={14} /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">{s.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
        {nextLesson && (
          <Link href={`/lessons/${nextLesson.id}`} className="btn-accent w-full py-3">Keyingi dars <ArrowRightIcon size={18} /></Link>
        )}
        {tests?.map((t) => (
          <Link key={t.id} href={`/tests/${t.id}`} className="btn-outline w-full border-sun-300 bg-sun-50 text-sun-700 hover:border-sun-400 hover:bg-sun-100 hover:text-sun-700">
            <ClipboardIcon size={18} /> {t.title}
          </Link>
        ))}
      </aside>
    </div>
  );
}
