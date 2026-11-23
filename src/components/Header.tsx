import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { MobileMenu } from "./MobileMenu";

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

  const links = user
    ? [
        { href: "/dashboard", label: "Kabinet" },
        { href: "/courses", label: "Kurslar" },
        { href: "/live", label: "Jonli darslar" },
        { href: "/results", label: "Natijalarim" },
        ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-brand-700">
          <span className="text-2xl">🧬</span>
          <span className="text-lg">Bio Academy</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              {l.label}
            </Link>
          ))}
          {user ? (
            <form action={signOut}>
              <button className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">Chiqish</button>
            </form>
          ) : (
            <>
              <Link href="/login" className="btn-outline">Kirish</Link>
              <Link href="/signup" className="btn ml-2">Ro&apos;yxatdan o&apos;tish</Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          {user ? (
            <MobileMenu links={links} />
          ) : (
            <Link href="/login" className="btn">Kirish</Link>
          )}
        </div>
      </div>
    </header>
  );
}
