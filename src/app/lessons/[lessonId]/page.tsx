import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonChat } from "@/components/LessonChat";
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
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          {topic && (
            <Link href={`/courses/${topic.course_id}`} className="text-sm text-slate-500">
              ← {topic.courses?.title} / {topic.title}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1>
        </div>
        <VideoPlayer provider={lesson.video_provider as VideoProvider} videoRef={lesson.video_ref} title={lesson.title} />
        {lesson.description && <p className="text-slate-600">{lesson.description}</p>}

        <LessonChat lessonId={lesson.id} />

        {lesson.notes && (
          <details className="card" open>
            <summary className="cursor-pointer font-bold">📄 Dars konspekti</summary>
            <div className="prose-notes mt-3">{lesson.notes}</div>
          </details>
        )}
      </div>

      <aside className="space-y-4">
        <div className="card">
          <h2 className="mb-3 font-bold">Mavzu darslari</h2>
          <ul className="space-y-1">
            {siblings?.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/lessons/${s.id}`}
                  className={"block rounded-lg px-3 py-2 text-sm " + (s.id === lesson.id ? "bg-brand-50 font-semibold text-brand-700" : "hover:bg-slate-100")}
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {nextLesson && (
          <Link href={`/lessons/${nextLesson.id}`} className="btn w-full">Keyingi dars →</Link>
        )}
        {tests?.map((t) => (
          <Link key={t.id} href={`/tests/${t.id}`} className="btn-outline w-full">📝 {t.title}</Link>
        ))}
      </aside>
    </div>
  );
}
