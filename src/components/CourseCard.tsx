import Link from "next/link";
import { LabGrid } from "./Illustrations";
import { ArrowRightIcon, TONE_CLASSES, topicTheme } from "./Icons";

export function CourseCard({ course, index }: { course: { id: string; title: string; description: string | null }; index: number }) {
  const { Icon, tone } = topicTheme(course.title, index);
  const t = TONE_CLASSES[tone];
  return (
    <Link href={`/courses/${course.id}`} className="card card-hover group flex flex-col overflow-hidden p-0">
      <div className="relative h-36 overflow-hidden bg-ink-900">
        <LabGrid className="absolute inset-0 h-full w-full" />
        <div className={"absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl " + t.glow} />
        <Icon size={120} strokeWidth={1} className={"absolute -bottom-6 -right-4 opacity-40 transition duration-500 group-hover:rotate-6 group-hover:scale-110 " + t.accent} />
        <span className="mono absolute left-5 top-4 text-xs font-semibold text-slate-500">{String(index + 1).padStart(2, "0")}</span>
        <span className={"absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur " + t.accent}>
          <Icon size={22} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xl font-bold text-slate-900">{course.title}</p>
        {course.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-slate-900">
          Kursni ochish <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function EmptyState({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card flex items-center gap-4 border-dashed bg-white/70 text-slate-500 shadow-none">
      {icon && <div className="icon-bubble h-11 w-11 bg-slate-100 text-slate-400">{icon}</div>}
      <div>{children}</div>
    </div>
  );
}

export function ScoreBadge({ score, total }: { score: number | null; total: number | null }) {
  const pct = total ? Math.round(((score ?? 0) / total) * 100) : 0;
  const cls = pct >= 70 ? "bg-brand-50 text-brand-700 ring-brand-200" : pct >= 40 ? "bg-sun-50 text-sun-700 ring-sun-100" : "bg-red-50 text-red-700 ring-red-100";
  return (
    <span className={"chip mono shrink-0 px-3 py-1 text-sm ring-1 " + cls}>
      {score}/{total} · {pct}%
    </span>
  );
}
