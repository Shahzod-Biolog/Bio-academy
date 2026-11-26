import { requireUser } from "@/lib/auth";
import { EmptyState } from "@/components/CourseCard";
import { CourseSections } from "@/components/CourseSections";
import { BookIcon } from "@/components/Icons";

export default async function CoursesPage() {
  const { supabase } = await requireUser();
  const { data: courses } = await supabase.from("courses").select("*").order("position");
  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow"><BookIcon size={15} /> Kutubxona</span>
        <h1 className="page-title mt-2">Kurslar</h1>
        <p className="mt-1 text-slate-500">O&apos;zingizga kerakli bo&apos;limni tanlang va o&apos;rganishni boshlang.</p>
      </div>
      {courses && courses.length > 0 && <CourseSections courses={courses} />}
      {courses?.length === 0 && <EmptyState icon={<BookIcon />}>Hozircha kurslar yo&apos;q.</EmptyState>}
    </div>
  );
}
