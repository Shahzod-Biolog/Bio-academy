import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { CourseCard, EmptyState, ScoreBadge } from "@/components/CourseCard";
import { DnaHelix } from "@/components/Illustrations";
import { ArrowRightIcon, BookIcon, CalendarIcon, ChartIcon, ClipboardIcon, LiveIcon } from "@/components/Icons";

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

  const avg =
    attempts && attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + (a.total ? ((a.score ?? 0) / a.total) * 100 : 0), 0) / attempts.length)
      : null;
  const firstName = (profile.full_name || "").split(" ")[0] || "o'quvchi";

  const stats = [
    { label: "Kurslar", value: courses?.length ?? 0, Icon: BookIcon, cls: "bg-brand-100 text-brand-700" },
    { label: "Jonli darslar", value: upcoming?.length ?? 0, Icon: LiveIcon, cls: "bg-rose-100 text-rose-600" },
    { label: "O'rtacha natija", value: avg === null ? "—" : `${avg}%`, Icon: ChartIcon, cls: "bg-sun-100 text-sun-700" },
  ];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-teal-500 p-6 text-white shadow-lift sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <DnaHelix className="pointer-events-none absolute -bottom-10 right-6 hidden h-56 rotate-[25deg] opacity-40 sm:block" />
        <p className="text-sm font-semibold text-brand-50/80">Shaxsiy kabinet</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">Salom, {firstName}! 🌱</h1>
        <p className="mt-2 max-w-md text-brand-50/90">Bugun nimani o&apos;rganamiz? Har bir yangi mavzu — bilim daraxtingizga yangi barg.</p>
        <div className="relative mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/95 p-3 text-slate-800 shadow-soft sm:p-4">
              <div className={"icon-bubble mb-2 h-9 w-9 rounded-xl " + s.cls}><s.Icon size={18} /></div>
              <p className="text-xl font-extrabold sm:text-2xl">{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {upcoming && upcoming.length > 0 && (
        <section>
          <h2 className="section-title mb-4"><span className="icon-bubble h-9 w-9 rounded-xl bg-rose-100 text-rose-600"><LiveIcon size={18} /></span> Yaqin jonli darslar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((s) => (
              <div key={s.id} className="card flex flex-col">
                <p className="font-bold text-slate-900">{s.title}</p>
                <p className="mb-4 mt-1 flex items-center gap-1.5 text-sm text-slate-500"><CalendarIcon size={15} /> {formatDateTime(s.starts_at)}</p>
                {s.meeting_url && (
                  <a href={s.meeting_url} target="_blank" rel="noreferrer" className="btn mt-auto w-full">Darsga qo&apos;shilish</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title"><span className="icon-bubble h-9 w-9 rounded-xl bg-brand-100 text-brand-700"><BookIcon size={18} /></span> Kurslar</h2>
          <Link href="/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">Barchasi <ArrowRightIcon size={15} /></Link>
        </div>
        {courses && courses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        ) : (
          <EmptyState icon={<BookIcon />}>Hozircha kurslar yo&apos;q.</EmptyState>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title"><span className="icon-bubble h-9 w-9 rounded-xl bg-sun-100 text-sun-700"><ClipboardIcon size={18} /></span> Oxirgi test natijalari</h2>
          <Link href="/results" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">Barchasi <ArrowRightIcon size={15} /></Link>
        </div>
        {attempts && attempts.length > 0 ? (
          <div className="card divide-y divide-slate-100 p-0">
            {attempts.map((a) => (
              <Link key={a.id} href={`/results/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition first:rounded-t-3xl last:rounded-b-3xl hover:bg-brand-50/50">
                <span className="min-w-0 truncate font-medium">{(a.tests as unknown as { title: string } | null)?.title}</span>
                <ScoreBadge score={a.score} total={a.total} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={<ClipboardIcon />}>Siz hali test topshirmagansiz.</EmptyState>
        )}
      </section>
    </div>
  );
}
