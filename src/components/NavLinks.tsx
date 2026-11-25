"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, CellIcon, ChartIcon, LiveIcon, ShieldIcon } from "./Icons";

export type NavItem = { href: string; label: string; icon: "home" | "book" | "live" | "chart" | "shield" };

const ICONS = { home: CellIcon, book: BookIcon, live: LiveIcon, chart: ChartIcon, shield: ShieldIcon };

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavLinks({ links, vertical = false, onNavigate }: { links: NavItem[]; vertical?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((l) => {
        const Icon = ICONS[l.icon];
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={
              "flex items-center gap-2 font-semibold transition " +
              (vertical ? "px-4 py-3 text-base " : "mx-2 py-1.5 ") +
              (vertical
                ? "rounded-xl " + (active ? "bg-brand-200 text-ink-900" : "text-ink-900 hover:bg-slate-100")
                : "border-b-2 uppercase tracking-[0.1em] text-[13px] " +
                  (active ? "border-clay-500 text-ink-900" : "border-transparent text-slate-600 hover:text-ink-900"))
            }
          >
            {vertical && <Icon size={20} />}
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
