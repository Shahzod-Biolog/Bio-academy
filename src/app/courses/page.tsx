import Link from "next/link";
import { requireUser } from "@/lib/auth";

export default async function CoursesPage() {
  const { supabase } = await requireUser();
  const { data: courses } = await supabase.from("courses").select("id, title, description").order("position");
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kurslar</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c) => (
          <Link key={c.id} href={`/courses/${c.id}`} className="card transition hover:border-brand-500 hover:shadow-md">
            <p className="text-lg font-semibold">{c.title}</p>
            <p className="mt-1 text-sm text-slate-500">{c.description}</p>
          </Link>
        ))}
        {courses?.length === 0 && <p className="text-slate-500">Hozircha kurslar yo&apos;q.</p>}
      </div>
    </div>
  );
}
