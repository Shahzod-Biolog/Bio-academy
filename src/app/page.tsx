import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  { icon: "🎬", title: "Video darslar", text: "Barcha mavzular bo'yicha video darslarni istalgan vaqtda ko'ring." },
  { icon: "🔴", title: "Jonli darslar", text: "Ustoz bilan jonli darslarda qatnashing, yozuvlarini keyin ko'ring." },
  { icon: "🤖", title: "AI yordamchi", text: "Har dars ostida tushunmagan savolingizni bering — darhol javob oling." },
  { icon: "📝", title: "Testlar", text: "Mavzu bo'yicha vaqtli testlar, avtomatik baholash va natijalar tarixi." },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-14 text-white sm:px-12 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-100">Biologiya onlayn platformasi</p>
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
          Biologiyani tushunib o&apos;rganing — video, jonli dars va AI yordamchi bilan
        </h1>
        <p className="mt-4 max-w-xl text-brand-100">
          Darslarni ko&apos;ring, savollaringizga darhol javob oling va bilimingizni testlarda sinang.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn bg-white text-brand-700 hover:bg-brand-50">Bepul boshlash</Link>
          <Link href="/login" className="btn-outline border-white/40 bg-transparent text-white hover:bg-white/10">Kirish</Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="card">
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="mb-1 font-bold">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
