import { requireAdmin } from "@/lib/auth";
import { formatDateTime, isoToTashkentLocal } from "@/lib/format";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteLive, saveLive } from "../actions";
import { BunnyUploader } from "@/components/BunnyUploader";

type Live = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  meeting_url: string;
  recording_ref: string;
  recording_provider: string;
};

function LiveForm({ s }: { s?: Live }) {
  const key = s?.id ?? "new";
  return (
    <form action={saveLive} className="grid gap-3 sm:grid-cols-2">
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="sm:col-span-2"><label className="label">Mavzu</label><input name="title" className="input" required defaultValue={s?.title} /></div>
      <div><label className="label">Boshlanish vaqti (Toshkent)</label><input name="starts_at" type="datetime-local" className="input" required defaultValue={s ? isoToTashkentLocal(s.starts_at) : undefined} /></div>
      <div><label className="label">Zoom / Meet havolasi</label><input name="meeting_url" type="url" className="input" defaultValue={s?.meeting_url} placeholder="https://meet.google.com/..." /></div>
      <div className="sm:col-span-2"><label className="label">Tavsif</label><textarea name="description" className="input" rows={2} defaultValue={s?.description} /></div>
      <div>
        <label className="label">Dars yozuvi qayerda</label>
        <select id={`rec_provider_${key}`} name="recording_provider" className="input" defaultValue={s?.recording_provider ?? "youtube"}>
          <option value="youtube">YouTube</option>
          <option value="bunny">Bunny Stream</option>
        </select>
      </div>
      <div><label className="label">Yozuv havolasi / ID (darsdan keyin)</label><input id={`rec_ref_${key}`} name="recording_ref" className="input" defaultValue={s?.recording_ref} /></div>
      <div className="sm:col-span-2"><BunnyUploader refInputId={`rec_ref_${key}`} providerSelectId={`rec_provider_${key}`} /></div>
      <button className="btn sm:col-span-2">{s ? "Saqlash" : "Jadvalga qo'shish"}</button>
    </form>
  );
}

export default async function AdminLive() {
  const { supabase } = await requireAdmin();
  const { data: sessions } = await supabase.from("live_sessions").select("*").order("starts_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card">
        <h1 className="mb-4 text-xl font-bold">➕ Yangi jonli dars</h1>
        <LiveForm />
      </div>
      <h2 className="text-lg font-bold">Barcha jonli darslar</h2>
      {(sessions as Live[] | null)?.map((s) => (
        <details key={s.id} className="card">
          <summary className="cursor-pointer">
            <span className="font-semibold">{s.title}</span>
            <span className="ml-2 text-sm text-slate-500">{formatDateTime(s.starts_at)}</span>
            {!s.recording_ref && new Date(s.starts_at) < new Date() && <span className="ml-2 rounded bg-amber-100 px-1.5 text-xs text-amber-700">yozuv yo&apos;q</span>}
          </summary>
          <div className="mt-4 space-y-3">
            <LiveForm s={s} />
            <form action={deleteLive}>
              <input type="hidden" name="id" value={s.id} />
              <ConfirmButton message="Jonli darsni o'chirasizmi?">O&apos;chirish</ConfirmButton>
            </form>
          </div>
        </details>
      ))}
    </div>
  );
}
