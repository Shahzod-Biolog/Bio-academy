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
                ? "rounded-xl " + (active ? "bg-brand-200 text-brand-400" : "text-slate-900 hover:bg-slate-100")
                : "border-b-2 font-mono uppercase tracking-[0.14em] text-xs " +
                  (active ? "border-brand-400 text-brand-400" : "border-transparent text-brand-300/80 hover:text-brand-400"))
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
