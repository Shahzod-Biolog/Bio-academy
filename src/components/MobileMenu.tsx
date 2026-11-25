"use client";

import { useState } from "react";
import { signOut } from "@/app/auth/actions";
import { LogoutIcon, MenuIcon, XIcon } from "./Icons";
import { NavLinks, type NavItem } from "./NavLinks";

export function MobileMenu({ links }: { links: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Menyu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900 text-ink-900 transition hover:bg-ink-900 hover:text-slate-50"
      >
        {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 top-16 z-20 bg-ink-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-3 top-[4.5rem] z-30 space-y-1 rounded-2xl border border-ink-900 bg-paper p-3 shadow-lift">
            <NavLinks links={links} vertical onNavigate={() => setOpen(false)} />
            <form action={signOut} className="border-t border-ink-900/15 pt-1">
              <button className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-semibold text-slate-500 hover:bg-slate-100">
                <LogoutIcon size={20} /> Chiqish
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
