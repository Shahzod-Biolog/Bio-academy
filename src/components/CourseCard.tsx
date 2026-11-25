import Link from "next/link";
import { OrganicPattern } from "./Illustrations";
import { ArrowRightIcon, TONE_CLASSES, topicTheme } from "./Icons";

export function CourseCard({ course, index }: { course: { id: string; title: string; description: string | null }; index: number }) {
  const { Icon, tone } = topicTheme(course.title, index);
  const t = TONE_CLASSES[tone];
  return (
    <Link href={`/courses/${course.id}`} className="card card-hover group flex flex-col overflow-hidden p-0">
      <div className={"relative h-28 bg-gradient-to-br " + t.cover}>
        <OrganicPattern className="absolute inset-0 h-full w-full" />
        <div className="absolute bottom-0 left-5 flex h-14 w-14 translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-soft">
          <Icon size={28} className={t.text} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-10">
        <p className="font-display text-xl font-semibold text-slate-900">{course.title}</p>
        {course.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          Kursni ochish <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function EmptyState({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card flex items-center gap-4 border-dashed bg-white/60 text-slate-500">
      {icon && <div className="icon-bubble h-11 w-11 bg-slate-100 text-slate-400">{icon}</div>}
      <div>{children}</div>
    </div>
  );
}

export function ScoreBadge({ score, total }: { score: number | null; total: number | null }) {
  const pct = total ? Math.round(((score ?? 0) / total) * 100) : 0;
  const cls = pct >= 70 ? "bg-brand-50 text-brand-700 ring-brand-200" : pct >= 40 ? "bg-sun-50 text-sun-700 ring-sun-100" : "bg-red-50 text-red-700 ring-red-100";
  return (
    <span className={"chip shrink-0 px-3 py-1 text-sm ring-1 " + cls}>
      {score}/{total} · {pct}%
    </span>
  );
}
