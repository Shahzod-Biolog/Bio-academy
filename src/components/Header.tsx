import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { LogoMark } from "./Illustrations";
import { LogoutIcon } from "./Icons";
import { MobileMenu } from "./MobileMenu";
import { NavLinks, type NavItem } from "./NavLinks";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = data?.role === "admin";
  }

  const links: NavItem[] = user
    ? [
        { href: "/dashboard", label: "Kabinet", icon: "home" },
        { href: "/courses", label: "Kurslar", icon: "book" },
        { href: "/live", label: "Jonli darslar", icon: "live" },
        { href: "/results", label: "Natijalarim", icon: "chart" },
        ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: "shield" as const }] : []),
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-900 bg-slate-50/95 text-ink-900 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <LogoMark size={34} />
          <span className="font-display text-[22px] font-semibold tracking-tight text-ink-900">Bio Academy</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLinks links={links} />
          {user ? (
            <form action={signOut}>
              <button className="ml-2 inline-flex items-center gap-2 rounded-full border border-ink-900 px-4 py-2 text-sm font-bold text-ink-900 transition hover:bg-ink-900 hover:text-slate-50" title="Chiqish">
                <LogoutIcon size={18} /> <span className="sr-only lg:not-sr-only">Chiqish</span>
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-ink-900 transition hover:text-clay-600">Kirish</Link>
              <Link href="/signup" className="btn ml-1">Ro&apos;yxatdan o&apos;tish</Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          {user ? <MobileMenu links={links} /> : <Link href="/login" className="btn">Kirish</Link>}
        </div>
      </div>
    </header>
  );
}
