import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold uppercase text-white">Admin</span>
        <Link href="/admin" className="btn-outline py-1.5">📚 Kurslar va darslar</Link>
        <Link href="/admin/live" className="btn-outline py-1.5">🔴 Jonli darslar</Link>
      </div>
      {children}
    </div>
  );
}
