"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/app/auth/actions";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Menyu" onClick={() => setOpen(!open)} className="rounded-lg p-2 text-2xl leading-none hover:bg-slate-100">
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-slate-200 bg-white px-4 py-3 shadow-lg">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100">
              {l.label}
            </Link>
          ))}
          <form action={signOut}>
            <button className="block w-full rounded-lg px-3 py-3 text-left font-medium text-slate-500 hover:bg-slate-100">Chiqish</button>
          </form>
        </div>
      )}
    </>
  );
}
