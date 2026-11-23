import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export default async function Dashboard() {
  const { supabase, profile } = await requireUser();

  const [{ data: courses }, { data: upcoming }, { data: attempts }] = await Promise.all([
    supabase.from("courses").select("id, title, description").order("position"),
    supabase
      .from("live_sessions")
      .select("id, title, starts_at, meeting_url")
      .gte("starts_at", new Date(Date.now() - 2 * 3600 * 1000).toISOString())
      .order("starts_at")
      .limit(3),
    supabase
      .from("test_attempts")
      .select("id, score, total, finished_at, tests(title)")
      .eq("user_id", profile.id)
      .not("finished_at", "is", null)
      .order("finished_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Salom, {profile.full_name || "o'quvchi"}! 👋</h1>
        <p className="text-slate-500">Bugun nimani o&apos;rganamiz?</p>
      </div>

      {upcoming && upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">🔴 Yaqin jonli darslar</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {upcoming.map((s) => (
              <div key={s.id} className="card">
                <p className="font-semibold">{s.title}</p>
                <p className="mb-3 text-sm text-slate-500">{formatDateTime(s.starts_at)}</p>
                {s.meeting_url && (
                  <a href={s.meeting_url} target="_blank" rel="noreferrer" className="btn w-full">Darsga qo&apos;shilish</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold">📚 Kurslar</h2>
        {courses && courses.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="card transition hover:border-brand-500 hover:shadow-md">
                <p className="text-lg font-semibold">{c.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="card text-slate-500">Hozircha kurslar yo&apos;q.</p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">📝 Oxirgi test natijalari</h2>
          <Link href="/results" className="text-sm font-semibold text-brand-700">Barchasi →</Link>
        </div>
        {attempts && attempts.length > 0 ? (
          <div className="card divide-y divide-slate-100 p-0">
            {attempts.map((a) => (
              <Link key={a.id} href={`/results/${a.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                <span>{(a.tests as unknown as { title: string } | null)?.title}</span>
                <span className="font-semibold text-brand-700">{a.score}/{a.total}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="card text-slate-500">Siz hali test topshirmagansiz.</p>
        )}
      </section>
    </div>
  );
}
