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
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
      >
        {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 top-16 z-20 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-3 top-[4.5rem] z-30 space-y-1 rounded-3xl border border-slate-200 bg-white p-3 shadow-lift">
            <NavLinks links={links} vertical onNavigate={() => setOpen(false)} />
            <form action={signOut} className="border-t border-slate-100 pt-1">
              <button className="flex w-full items-center gap-2 rounded-full px-4 py-3 text-left text-base font-semibold text-slate-500 hover:bg-slate-100">
                <LogoutIcon size={20} /> Chiqish
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
