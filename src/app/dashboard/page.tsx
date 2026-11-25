import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { CourseCard, EmptyState, ScoreBadge } from "@/components/CourseCard";
import { Lens } from "@/components/Illustrations";
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
    { label: "Jonli darslar", value: upcoming?.length ?? 0, Icon: LiveIcon, cls: "bg-clay-100 text-clay-500" },
    { label: "O'rtacha natija", value: avg === null ? "—" : `${avg}%`, Icon: ChartIcon, cls: "bg-sun-100 text-sun-700" },
  ];

  return (
    <div className="space-y-10">
      <section className="panel-sage grid md:grid-cols-[1.6fr_1fr]">
        <div className="relative p-6 sm:p-10">
          <p className="eyebrow"><span className="h-2 w-2 rounded-full bg-brand-400 shadow-glow" /> Shaxsiy kabinet</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-[-0.03em] sm:text-7xl">
            Salom, <span className="text-brand-400">{firstName}</span>!
          </h1>
          <p className="mt-4 max-w-md text-[17px] text-slate-600">Bugun nimani o&apos;rganamiz? Har bir mavzu sizni maqsadga bir qadam yaqinlashtiradi.</p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            {stats.map((s) => (
              <div key={s.label} className="readout p-3 sm:p-4">
                <div className={"icon-bubble mb-3 h-9 w-9 " + s.cls}><s.Icon size={18} /></div>
                <p className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{s.value}</p>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden items-center justify-center p-10 md:flex">
          <Lens className="w-full max-w-64" />
          <span className="absolute bottom-5 right-6 font-mono text-[11px] text-brand-700">DNK · ×400</span>
        </div>
      </section>

      {upcoming && upcoming.length > 0 && (
        <section>
          <h2 className="section-title mb-4"><span className="icon-bubble h-9 w-9 bg-clay-100 text-clay-500"><LiveIcon size={18} /></span> Yaqin jonli darslar</h2>
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
          <h2 className="section-title"><span className="icon-bubble h-9 w-9 bg-brand-100 text-brand-700"><BookIcon size={18} /></span> Kurslar</h2>
          <Link href="/courses" className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand-300 hover:text-brand-400">Barchasi <ArrowRightIcon size={15} /></Link>
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
          <h2 className="section-title"><span className="icon-bubble h-9 w-9 bg-sun-100 text-sun-700"><ClipboardIcon size={18} /></span> Oxirgi test natijalari</h2>
          <Link href="/results" className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand-300 hover:text-brand-400">Barchasi <ArrowRightIcon size={15} /></Link>
        </div>
        {attempts && attempts.length > 0 ? (
          <div className="card divide-y divide-line p-0">
            {attempts.map((a) => (
              <Link key={a.id} href={`/results/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition first:rounded-t-2xl last:rounded-b-2xl hover:bg-brand-50/50">
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
