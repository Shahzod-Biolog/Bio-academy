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
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-slate-900 transition hover:border-brand-400 hover:bg-brand-400 hover:text-night"
      >
        {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 top-16 z-20 bg-night/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-3 top-[4.5rem] z-30 space-y-1 rounded-2xl border border-line bg-paper p-3 shadow-lift">
            <NavLinks links={links} vertical onNavigate={() => setOpen(false)} />
            <form action={signOut} className="border-t border-line pt-1">
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
