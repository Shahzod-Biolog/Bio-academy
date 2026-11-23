import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { saveCourse } from "./actions";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const [{ data: courses }, { count: students }] = await Promise.all([
    supabase.from("courses").select("id, title, description, position").order("position"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-2xl font-bold">Kurslar</h1>
        <p className="text-sm text-slate-500">Ro&apos;yxatdan o&apos;tgan o&apos;quvchilar: <b>{students ?? 0}</b></p>
        {(courses ?? []).map((c) => (
          <Link key={c.id} href={`/admin/courses/${c.id}`} className="card block hover:border-brand-500">
            <p className="font-semibold">{c.position}. {c.title}</p>
            <p className="text-sm text-slate-500">{c.description}</p>
          </Link>
        ))}
        {courses?.length === 0 && <p className="card text-slate-500">Birinchi kursni o&apos;ng tomondagi forma orqali qo&apos;shing.</p>}
      </div>
      <form action={saveCourse} className="card h-fit space-y-3">
        <h2 className="font-bold">➕ Yangi kurs</h2>
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
