import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md text-center">
      <p className="text-5xl">🔬</p>
      <h1 className="mt-3 text-xl font-bold">Sahifa topilmadi</h1>
      <Link href="/dashboard" className="btn mt-4">Bosh sahifaga</Link>
    </div>
  );
}
