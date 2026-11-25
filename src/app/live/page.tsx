import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { VideoPlayer } from "@/components/VideoPlayer";
import type { VideoProvider } from "@/lib/video";
import { EmptyState } from "@/components/CourseCard";
import { CalendarIcon, LiveIcon, PlayIcon } from "@/components/Icons";

export default async function LivePage() {
  const { supabase } = await requireUser();
  const cutoff = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase.from("live_sessions").select("*").gte("starts_at", cutoff).order("starts_at"),
    supabase.from("live_sessions").select("*").lt("starts_at", cutoff).order("starts_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-6">
          <span className="eyebrow text-rose-600"><LiveIcon size={15} /> Efir</span>
          <h1 className="page-title mt-2">Jonli darslar jadvali</h1>
        </div>
        {upcoming && upcoming.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((s) => {
              const started = new Date(s.starts_at).getTime() <= Date.now();
              return (
                <div key={s.id} className={"card flex flex-col " + (started ? "ring-2 ring-rose-200" : "")}>
                  {started && <span className="chip mb-3 w-fit bg-rose-100 text-rose-700"><span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> HOZIR EFIRDA</span>}
                  <p className="font-display text-xl font-bold text-slate-900">{s.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><CalendarIcon size={15} /> {formatDateTime(s.starts_at)} (Toshkent vaqti)</p>
                  {s.description && <p className="mb-4 mt-2 text-sm text-slate-600">{s.description}</p>}
                  {s.meeting_url ? (
                    <a href={s.meeting_url} target="_blank" rel="noreferrer" className="btn mt-auto w-full">Darsga qo&apos;shilish</a>
                  ) : (
                    <p className="mt-auto pt-4 text-sm text-slate-400">Havola dars oldidan joylanadi</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<CalendarIcon />}>Yaqin kunlarda jonli dars rejalashtirilmagan.</EmptyState>
        )}
      </section>

      <section>
        <h2 className="section-title mb-4"><span className="icon-bubble h-9 w-9 rounded-xl bg-teal-100 text-teal-600"><PlayIcon size={18} /></span> O&apos;tgan darslar arxivi</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {past?.map((s) => (
            <div key={s.id} className="card space-y-3">
              <div>
                <p className="font-bold text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-500">{formatDateTime(s.starts_at)}</p>
              </div>
              {s.recording_ref ? (
                <VideoPlayer provider={s.recording_provider as VideoProvider} videoRef={s.recording_ref} title={s.title} />
              ) : (
                <p className="text-sm text-slate-400">Yozuv hali joylanmagan</p>
              )}
            </div>
          ))}
          {past?.length === 0 && <p className="text-slate-500">Arxiv hozircha bo&apos;sh.</p>}
        </div>
      </section>
    </div>
  );
}
