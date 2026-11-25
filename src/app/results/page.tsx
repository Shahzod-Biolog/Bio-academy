import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { EmptyState, ScoreBadge } from "@/components/CourseCard";
import { ArrowRightIcon, ChartIcon, ClipboardIcon } from "@/components/Icons";

export default async function ResultsPage() {
  const { supabase, user } = await requireUser();
  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("id, score, total, finished_at, tests(title)")
    .eq("user_id", user.id)
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <span className="eyebrow"><ChartIcon size={15} /> Statistika</span>
        <h1 className="page-title mt-2">Natijalarim</h1>
      </div>
      {attempts && attempts.length > 0 ? (
        <div className="card divide-y divide-slate-100 p-0">
          {attempts.map((a) => {
            return (
              <Link key={a.id} href={`/results/${a.id}`} className="group flex items-center gap-4 px-5 py-4 transition first:rounded-t-3xl last:rounded-b-3xl hover:bg-brand-50/50">
                <span className="icon-bubble hidden h-10 w-10 rounded-xl bg-sun-100 text-sun-700 sm:flex"><ClipboardIcon size={20} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{(a.tests as unknown as { title: string } | null)?.title}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(a.finished_at!)}</p>
                </div>
                <ScoreBadge score={a.score} total={a.total} />
                <ArrowRightIcon size={16} className="hidden text-slate-300 transition group-hover:text-brand-600 sm:block" />
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<ClipboardIcon />}>Siz hali test topshirmagansiz.</EmptyState>
      )}
    </div>
  );
}
