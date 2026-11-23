import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { VideoPlayer } from "@/components/VideoPlayer";
import type { VideoProvider } from "@/lib/video";

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
        <h1 className="mb-4 text-2xl font-bold">🔴 Jonli darslar jadvali</h1>
        {upcoming && upcoming.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((s) => {
              const started = new Date(s.starts_at).getTime() <= Date.now();
              return (
                <div key={s.id} className="card">
                  {started && <span className="mb-2 inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">● HOZIR EFIRDA</span>}
                  <p className="text-lg font-semibold">{s.title}</p>
                  <p className="text-sm text-slate-500">{formatDateTime(s.starts_at)} (Toshkent vaqti)</p>
                  {s.description && <p className="mt-2 text-sm text-slate-600">{s.description}</p>}
                  {s.meeting_url ? (
                    <a href={s.meeting_url} target="_blank" rel="noreferrer" className="btn mt-4 w-full">Darsga qo&apos;shilish</a>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">Havola dars oldidan joylanadi</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="card text-slate-500">Yaqin kunlarda jonli dars rejalashtirilmagan.</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">📼 O&apos;tgan darslar arxivi</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {past?.map((s) => (
            <div key={s.id} className="card space-y-3">
              <div>
                <p className="font-semibold">{s.title}</p>
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
