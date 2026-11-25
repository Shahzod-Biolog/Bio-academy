import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const DnaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 3c0 6 10 6 10 12s-10 6-10 6" />
    <path d="M17 3c0 6-10 6-10 12s10 6 10 6" />
    <path d="M8.5 6.5h7M8.5 17.5h7M10 9.5h4M10 14.5h4" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 19c0-8.5 5.5-14 15-15-1 9.5-6.5 15-15 15z" />
    <path d="M5 19c3-4 6-6.5 10-8.5" />
  </svg>
);

export const CellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3c5 0 9 3.6 9 8.5S17.5 21 12 21 3 17 3 12s4-9 9-9z" />
    <circle cx="11" cy="11" r="3" />
    <path d="M15.5 15.5c1-.4 1.8-.2 2.2.6M6.5 15c.6.9 1.5 1.3 2.5 1.2M16 7.5l.01" />
  </svg>
);

export const MicroscopeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 21h12M9 17h6" />
    <path d="M14 17a5 5 0 0 0 4-8" />
    <path d="M9.5 4.5l3-1.5 3.5 7-3 1.5z" />
    <path d="M10.5 12.5L8 14" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
    <path d="M7.5 12h2.5l1.2-2 1.6 4 1.2-2h2.5" />
  </svg>
);

export const BugIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="14" rx="5" ry="6" />
    <path d="M12 8v12M9 5.5L10 8M15 5.5L14 8M7 12H4M7 16H4.5M17 12h3M17 16h2.5" />
  </svg>
);

export const FlaskIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
    <path d="M7 15h10" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5v7l5.5-3.5z" fill="currentColor" />
  </svg>
);

export const LiveIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    <path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14" />
  </svg>
);

export const SparkIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
  </svg>
);

export const ClipboardIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4.5V3.5h6v1M8.5 11l1.5 1.5L13 9.5M8.5 16.5h7" />
  </svg>
);

export const ChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20h16M7 16v-4M12 16V7M17 16v-6" />
  </svg>
);

export const BookIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />
  </svg>
);

export const NotesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const LogoutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
  </svg>
);

export const SendIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12l16-8-6 17-3-7z" />
    <path d="M11 14l9-10" />
  </svg>
);

export const LightbulbIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l7.5 3v6c0 4.5-3.2 8-7.5 9-4.3-1-7.5-4.5-7.5-9V6z" />
  </svg>
);

export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** Kurs nomidan mos biologik belgi va rang tanlaydi. */
const THEMES = [
  { keys: ["botan", "o'simlik", "o‘simlik", "barg", "plant"], Icon: LeafIcon, tone: "leaf" },
  { keys: ["zoolog", "hayvon", "hasharot"], Icon: BugIcon, tone: "sun" },
  { keys: ["anatom", "odam", "fiziolog", "inson"], Icon: HeartIcon, tone: "rose" },
  { keys: ["genet", "irsiyat", "dnk", "dna", "evolyu"], Icon: DnaIcon, tone: "teal" },
  { keys: ["sitolog", "hujayra", "mikro"], Icon: CellIcon, tone: "teal" },
  { keys: ["kimyo", "bioxim", "ekolog"], Icon: FlaskIcon, tone: "leaf" },
] as const;

const FALLBACK = [
  { Icon: CellIcon, tone: "teal" },
  { Icon: LeafIcon, tone: "leaf" },
  { Icon: DnaIcon, tone: "sun" },
  { Icon: MicroscopeIcon, tone: "rose" },
] as const;

export type Tone = "leaf" | "teal" | "sun" | "rose";

export function topicTheme(title: string, index = 0): { Icon: (p: IconProps) => React.ReactElement; tone: Tone } {
  const t = title.toLowerCase();
  const hit = THEMES.find((th) => th.keys.some((k) => t.includes(k)));
  if (hit) return { Icon: hit.Icon, tone: hit.tone };
  const fb = FALLBACK[index % FALLBACK.length];
  return { Icon: fb.Icon, tone: fb.tone };
}

export const TONE_CLASSES: Record<Tone, { bubble: string; cover: string; text: string }> = {
  leaf: { bubble: "bg-brand-100 text-brand-700", cover: "from-brand-500 to-brand-800", text: "text-brand-700" },
  teal: { bubble: "bg-teal-100 text-teal-600", cover: "from-teal-400 to-brand-700", text: "text-teal-600" },
  sun: { bubble: "bg-sun-100 text-sun-700", cover: "from-sun-300 to-brand-600", text: "text-sun-700" },
  rose: { bubble: "bg-rose-100 text-rose-600", cover: "from-rose-300 to-teal-600", text: "text-rose-600" },
};
