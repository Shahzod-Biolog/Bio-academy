import Link from "next/link";
import { MicroscopeIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <div className="icon-bubble mx-auto h-16 w-16 bg-brand-200 text-slate-900">
        <MicroscopeIcon size={32} />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Sahifa topilmadi</h1>
      <p className="mt-1 text-slate-500">Hatto mikroskop ostida ham bu sahifani topa olmadik.</p>
      <Link href="/dashboard" className="btn mt-6">Bosh sahifaga</Link>
    </div>
  );
}
