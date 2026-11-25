import Link from "next/link";
import { Fern } from "./Illustrations";

const COVERS = ["bg-brand-200", "bg-sun-100", "bg-clay-100", "bg-teal-100"];
import { ArrowRightIcon, topicTheme } from "./Icons";

export function CourseCard({ course, index }: { course: { id: string; title: string; description: string | null }; index: number }) {
  const { Icon } = topicTheme(course.title, index);
  return (
    <Link href={`/courses/${course.id}`} className="card card-hover group flex flex-col overflow-hidden p-0">
      <div className={"relative h-40 overflow-hidden border-b border-ink-900/15 " + COVERS[index % COVERS.length]}>
        <Fern className="absolute -right-10 -top-6 h-[170%] w-[90%] max-w-none rotate-[18deg] opacity-80 transition duration-700 group-hover:rotate-[24deg] group-hover:scale-105" />
        <span className="absolute left-5 top-4 font-mono text-xs font-semibold text-ink-900/70">№ {String(index + 1).padStart(2, "0")}</span>
        <span className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-ink-900 bg-slate-50 text-ink-900">
          <Icon size={22} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-2xl font-semibold text-slate-900">{course.title}</p>
        {course.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold uppercase tracking-[0.1em] text-clay-600">
          Kursni ochish <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function EmptyState({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card flex items-center gap-4 border-dashed text-slate-500">
      {icon && <div className="icon-bubble h-11 w-11 bg-slate-100 text-slate-400">{icon}</div>}
      <div>{children}</div>
    </div>
  );
}

export function ScoreBadge({ score, total }: { score: number | null; total: number | null }) {
  const pct = total ? Math.round(((score ?? 0) / total) * 100) : 0;
  const cls = pct >= 70 ? "bg-brand-100 text-brand-800 ring-brand-300" : pct >= 40 ? "bg-sun-100 text-sun-700 ring-sun-300/60" : "bg-clay-50 text-clay-700 ring-clay-100";
  return (
    <span className={"chip mono shrink-0 px-3 py-1 text-sm ring-1 " + cls}>
      {score}/{total} · {pct}%
    </span>
  );
}
