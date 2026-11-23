import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

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
      <h1 className="mb-6 text-2xl font-bold">Natijalarim</h1>
      {attempts && attempts.length > 0 ? (
        <div className="card divide-y divide-slate-100 p-0">
          {attempts.map((a) => {
            const pct = a.total ? Math.round(((a.score ?? 0) / a.total) * 100) : 0;
            return (
              <Link key={a.id} href={`/results/${a.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{(a.tests as unknown as { title: string } | null)?.title}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(a.finished_at!)}</p>
                </div>
                <span className={"rounded-lg px-2.5 py-1 text-sm font-bold " + (pct >= 70 ? "bg-brand-50 text-brand-700" : pct >= 40 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>
                  {a.score}/{a.total} · {pct}%
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="card text-slate-500">Siz hali test topshirmagansiz.</p>
      )}
    </div>
  );
}
