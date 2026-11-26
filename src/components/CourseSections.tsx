import { groupBySection } from "@/lib/sections";
import { CourseCard, EmptyState } from "./CourseCard";
import { BookIcon, FlaskIcon } from "./Icons";

type Course = { id: string; title: string; description: string | null; section?: string | null };

export function CourseSections({ courses }: { courses: Course[] }) {
  const groups = groupBySection(courses);
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.key} className="space-y-4">
          <div>
            <h2 className="section-title">
              <span className={"icon-bubble h-9 w-9 " + (g.key === "nazariy" ? "bg-brand-100 text-brand-700" : "bg-sun-100 text-sun-700")}>
                {g.key === "nazariy" ? <BookIcon size={18} /> : <FlaskIcon size={18} />}
              </span>
              {g.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{g.hint}</p>
          </div>
          {g.courses.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.courses.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<BookIcon />}>Bu bo&apos;limda hozircha kurslar yo&apos;q.</EmptyState>
          )}
        </section>
      ))}
    </div>
  );
}
