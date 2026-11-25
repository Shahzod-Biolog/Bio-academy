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
              "flex items-center gap-2 rounded-xl font-semibold transition " +
              (vertical ? "px-4 py-3 text-base " : "px-3.5 py-2 text-sm ") +
              (vertical
                ? active
                  ? "bg-brand-400/15 text-brand-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                : active
                  ? "bg-white/10 text-brand-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white")
            }
          >
            <Icon size={vertical ? 20 : 17} />
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
