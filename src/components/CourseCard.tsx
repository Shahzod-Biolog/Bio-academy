import Link from "next/link";
import { Lens } from "./Illustrations";
import { ArrowRightIcon, topicTheme } from "./Icons";

/** Har bir kurs uchun boshqa "preparat" rangi va spiral burchagi. */
const SLIDES = [
  { hue: 0, tilt: 32 },
  { hue: -40, tilt: -28 },
  { hue: 60, tilt: 18 },
  { hue: 140, tilt: -40 },
];

/** Kurs nomiga qarab linza ichidagi haqiqiy surat (manbalar: /rasmlar-manbasi). Mos kelmasa — DNK spirali. */
const SPECIMENS: [RegExp, string][] = [
  [/\bDNK\b|nuklein/i, "/specimens/dnk.jpg"],
  [/\bATF\b|energiya/i, "/specimens/atf.jpg"],
  [/botanika|o['‘’`]?simlik/i, "/specimens/botanika.jpg"],
  [/zoologiya|hayvon/i, "/specimens/zoologiya.jpg"],
  [/odam|salomatlik|anatomiya/i, "/specimens/odam.jpg"],
  [/sitologiya|hujayra/i, "/specimens/hujayra.jpg"],
  [/umumiy biologiya/i, "/specimens/umumiy.jpg"],
  [/11-sinf|ekosistema|ekologiya/i, "/specimens/ekosistema.jpg"],
];

export function specimenFor(title: string) {
  return SPECIMENS.find(([re]) => re.test(title))?.[1];
}

export function CourseCard({ course, index }: { course: { id: string; title: string; description: string | null }; index: number }) {
  const { Icon } = topicTheme(course.title, index);
  const slide = SLIDES[index % SLIDES.length];
  return (
    <Link href={`/courses/${course.id}`} className="card card-hover group flex flex-col overflow-hidden p-0">
      <div className="panel-sage relative h-44 rounded-none border-0 border-b border-line">
        <div className="absolute -right-4 top-1/2 w-40 -translate-y-1/2 transition duration-700 group-hover:scale-105">
          <Lens className="w-full" hue={slide.hue} tilt={slide.tilt} ring={false} marker={false} image={specimenFor(course.title)} />
        </div>
        <span className="absolute left-5 top-4 z-10 font-mono text-xs font-semibold text-brand-300">PREPARAT № {String(index + 1).padStart(2, "0")}</span>
        <span className="absolute bottom-4 left-5 z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-brand-300/30 bg-white/90 text-brand-700">
          <Icon size={22} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-2xl font-bold text-slate-900">{course.title}</p>
        {course.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-brand-400">
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
  const cls = pct >= 70 ? "bg-brand-100 text-brand-700 ring-brand-400/40" : pct >= 40 ? "bg-sun-100 text-sun-700 ring-sun-300/50" : "bg-clay-50 text-clay-600 ring-clay-300/60";
  return (
    <span className={"chip mono shrink-0 px-3 py-1 text-sm ring-1 " + cls}>
      {score}/{total} · {pct}%
    </span>
  );
}
