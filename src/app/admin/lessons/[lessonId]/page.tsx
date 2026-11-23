import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { saveLesson } from "../../actions";

export default async function AdminLesson({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { lessonId } = await params;
  const { topic: topicParam } = await searchParams;
  const { supabase } = await requireAdmin();
  const isNew = lessonId === "new";

  const { data: lesson } = isNew
    ? { data: null }
    : await supabase.from("lessons").select("*").eq("id", lessonId).single();
  if (!isNew && !lesson) notFound();

  const topicId = lesson?.topic_id ?? topicParam;
  const { data: topic } = await supabase.from("topics").select("id, title, course_id, lessons(count)").eq("id", topicId ?? "").single();
  if (!topic) notFound();
  const lessonCount = (topic.lessons as unknown as { count: number }[])?.[0]?.count ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href={`/admin/courses/${topic.course_id}`} className="text-sm text-slate-500">← {topic.title}</Link>
      <h1 className="text-2xl font-bold">{isNew ? "Yangi dars" : "Darsni tahrirlash"}</h1>
      <form action={saveLesson} className="card space-y-4">
        {lesson && <input type="hidden" name="id" value={lesson.id} />}
        <input type="hidden" name="topic_id" value={topic.id} />
        <input type="hidden" name="course_id" value={topic.course_id} />

        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <div><label className="label">Dars nomi</label><input name="title" className="input" required defaultValue={lesson?.title} /></div>
          <div><label className="label">Tartib raqami</label><input name="position" type="number" className="input" defaultValue={lesson?.position ?? lessonCount + 1} /></div>
        </div>
        <div><label className="label">Qisqacha tavsif</label><input name="description" className="input" defaultValue={lesson?.description} /></div>

        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">🎬 Video</legend>
          <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
            <div>
              <label className="label">Qayerda joylangan</label>
              <select name="video_provider" className="input" defaultValue={lesson?.video_provider ?? "bunny"}>
                <option value="bunny">Bunny Stream</option>
                <option value="youtube">YouTube</option>
                <option value="none">Videosiz</option>
              </select>
            </div>
            <div>
              <label className="label">Video ID yoki havola</label>
              <input name="video_ref" className="input" defaultValue={lesson?.video_ref} placeholder="Bunny: Video ID (GUID) · YouTube: havola" />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Bunny Stream: videoni bunny.net → Stream → kutubxonangizga yuklang, so&apos;ng video ustiga bosib &quot;Video ID&quot; ni nusxalang.
            YouTube: videoni &quot;Unlisted&quot; (ro&apos;yxatda yo&apos;q) qilib yuklang va havolasini joylang.
          </p>
        </fieldset>

        <div>
          <label className="label">📄 Dars konspekti (AI yordamchi shu matn asosida javob beradi)</label>
          <textarea
            name="notes"
            className="input font-mono"
            rows={16}
            defaultValue={lesson?.notes}
            placeholder="Darsda aytiladigan asosiy ma'lumotlar, ta'riflar, misollar. Qanchalik to'liq yozsangiz, AI shunchalik aniq javob beradi."
          />
        </div>
        <button className="btn w-full py-3">Saqlash</button>
      </form>
    </div>
  );
}
