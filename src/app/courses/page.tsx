import { requireUser } from "@/lib/auth";
import { CourseCard, EmptyState } from "@/components/CourseCard";
import { BookIcon } from "@/components/Icons";

export default async function CoursesPage() {
  const { supabase } = await requireUser();
  const { data: courses } = await supabase.from("courses").select("id, title, description").order("position");
  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow"><BookIcon size={15} /> Kutubxona</span>
        <h1 className="page-title mt-2">Kurslar</h1>
        <p className="mt-1 text-slate-500">O&apos;zingizga kerakli bo&apos;limni tanlang va o&apos;rganishni boshlang.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c, i) => (
          <CourseCard key={c.id} course={c} index={i} />
        ))}
      </div>
      {courses?.length === 0 && <EmptyState icon={<BookIcon />}>Hozircha kurslar yo&apos;q.</EmptyState>}
    </div>
  );
}
