import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BookIcon, LiveIcon, ShieldIcon } from "@/components/Icons";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-paper/80 p-2 shadow-soft">
        <span className="chip mr-1 bg-brand-400 px-3 py-2 text-night"><ShieldIcon size={14} /> Admin panel</span>
        <Link href="/admin" className="btn-ghost"><BookIcon size={17} /> Kurslar va darslar</Link>
        <Link href="/admin/live" className="btn-ghost"><LiveIcon size={17} /> Jonli darslar</Link>
      </div>
      {children}
    </div>
  );
}
