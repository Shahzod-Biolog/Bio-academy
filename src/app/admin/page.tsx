import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { saveCourse } from "./actions";
import { groupBySection, SECTIONS } from "@/lib/sections";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const [{ data: courses }, { count: students }] = await Promise.all([
    supabase.from("courses").select("*").order("position"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-2xl font-bold">Kurslar</h1>
        <p className="text-sm text-slate-500">Ro&apos;yxatdan o&apos;tgan o&apos;quvchilar: <b>{students ?? 0}</b></p>
        {groupBySection(courses ?? []).map((g) => (
          <div key={g.key} className="space-y-3 pt-2">
            <h2 className="text-lg font-bold">{g.title} <span className="text-sm font-normal text-slate-400">({g.courses.length})</span></h2>
            {g.courses.map((c) => (
              <Link key={c.id} href={`/admin/courses/${c.id}`} className="card block hover:border-brand-500">
                <p className="font-semibold">{c.position}. {c.title}</p>
                <p className="text-sm text-slate-500">{c.description}</p>
              </Link>
            ))}
          </div>
        ))}
        {courses?.length === 0 && <p className="card text-slate-500">Birinchi kursni o&apos;ng tomondagi forma orqali qo&apos;shing.</p>}
      </div>
      <form action={saveCourse} className="card h-fit space-y-3">
        <h2 className="font-bold">➕ Yangi kurs</h2>
        <div>
          <label className="label">Bo&apos;lim</label>
          <select name="section" className="input" defaultValue="nazariy">
            {SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Nomi</label>
          <input name="title" className="input" required placeholder="Masalan: Botanika" />
        </div>
        <div>
          <label className="label">Tavsif</label>
          <textarea name="description" className="input" rows={3} />
        </div>
        <div>
          <label className="label">Tartib raqami</label>
          <input name="position" type="number" className="input" defaultValue={(courses?.length ?? 0) + 1} />
        </div>
        <button className="btn w-full">Qo&apos;shish</button>
      </form>
    </div>
  );
}
