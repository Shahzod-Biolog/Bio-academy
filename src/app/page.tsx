import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HelixAnimation, LabGrid } from "@/components/Illustrations";
import { ArrowRightIcon, ClipboardIcon, LiveIcon, MicroscopeIcon, PlayIcon, SparkIcon } from "@/components/Icons";

const TOPICS = ["Botanika", "Zoologiya", "Sitologiya", "Genetika", "Anatomiya", "Ekologiya", "Evolyutsiya", "Fiziologiya"];

const STEPS = [
  { n: "01", title: "Ro'yxatdan o'ting", text: "Bir daqiqada bepul hisob oching." },
  { n: "02", title: "Darsni ko'ring", text: "Video va konspekt bilan mavzuni o'rganing." },
  { n: "03", title: "Savol bering", text: "AI yordamchi tushunmagan joyingizni izohlaydi." },
  { n: "04", title: "Test yeching", text: "Bilimingizni sinab, natijangizni kuzating." },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <section className="panel-dark px-6 py-12 sm:px-12 sm:py-16">
        <LabGrid className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="mono inline-flex items-center gap-2 rounded-lg border border-brand-400/30 bg-brand-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" /> Biologiya onlayn akademiyasi
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              Hayot kodini <br className="hidden sm:block" />
              <span className="text-gradient">o&apos;qishni</span> o&apos;rganing.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Video darslar, jonli mashg&apos;ulotlar, sun&apos;iy intellekt yordamchisi va vaqtli testlar. DTM va olimpiadaga tayyorgarlik uchun bitta platforma.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-accent px-6 py-3 text-base">
                Bepul boshlash <ArrowRightIcon size={18} />
              </Link>
              <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                Kirish
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden h-80 items-center justify-center sm:flex">
            <div className="absolute inset-0 rounded-full bg-brand-400/10 blur-2xl" />
            <HelixAnimation rungs={18} className="relative rotate-[20deg]" />
          </div>
        </div>
      </section>

      {/* Fanlar lentasi */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white py-4">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-8 pr-8">
          {[...TOPICS, ...TOPICS].map((t, i) => (
            <span key={i} className="flex items-center gap-8 font-display text-xl font-bold text-slate-300">
              {t} <span className="h-2 w-2 rotate-45 bg-brand-400" />
            </span>
          ))}
        </div>
      </section>

      {/* Bento */}
      <section className="grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-6">
        <div className="card card-hover flex flex-col justify-between md:col-span-4">
          <div className="flex items-start justify-between">
            <span className="icon-bubble h-12 w-12 bg-ink-900 text-brand-400"><PlayIcon size={24} /></span>
            <span className="mono text-xs font-semibold text-slate-400">01 / VIDEO</span>
          </div>
          <div>
            <h3 className="mt-6 text-2xl font-bold">Video darslar</h3>
            <p className="mt-1 max-w-md text-slate-500">Har bir mavzu qisqa, tushunarli videolarga bo&apos;lingan. Istalgan vaqtda, istalgan qurilmada ko&apos;ring.</p>
          </div>
        </div>
        <div className="panel-dark card-hover flex flex-col justify-between p-5 md:col-span-2">
          <div className="flex items-start justify-between">
            <span className="icon-bubble h-12 w-12 bg-brand-400 text-ink-950"><SparkIcon size={24} /></span>
            <span className="mono text-xs font-semibold text-slate-500">02 / AI</span>
          </div>
          <div>
            <h3 className="mt-6 text-2xl font-bold">AI yordamchi</h3>
            <p className="mt-1 text-slate-400">Har dars ostida savolingizga darhol javob.</p>
          </div>
        </div>
        <div className="card card-hover flex flex-col justify-between md:col-span-2">
          <div className="flex items-start justify-between">
            <span className="icon-bubble h-12 w-12 bg-rose-50 text-rose-600"><LiveIcon size={24} /></span>
            <span className="mono text-xs font-semibold text-slate-400">03 / LIVE</span>
          </div>
          <div>
            <h3 className="mt-6 text-2xl font-bold">Jonli darslar</h3>
            <p className="mt-1 text-slate-500">Ustoz bilan efirda, yozuvlari arxivda.</p>
          </div>
        </div>
        <div className="card card-hover relative flex flex-col justify-between overflow-hidden md:col-span-4">
          <div className="flex items-start justify-between">
            <span className="icon-bubble h-12 w-12 bg-sun-100 text-sun-700"><ClipboardIcon size={24} /></span>
            <span className="mono text-xs font-semibold text-slate-400">04 / TEST</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="mt-6 text-2xl font-bold">Vaqtli testlar</h3>
              <p className="mt-1 max-w-md text-slate-500">10 tadan 50 tagacha savol tanlang, natija va izohlarni darhol ko&apos;ring.</p>
            </div>
            <div className="flex items-end gap-1.5" aria-hidden>
              {[40, 62, 48, 78, 90].map((h, i) => (
                <span key={i} className="w-5 rounded-t-md bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: h }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Qadamlar */}
      <section className="panel-dark p-6 sm:p-10">
        <LabGrid className="absolute inset-0 h-full w-full" />
        <div className="relative">
          <span className="mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Qanday ishlaydi</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">To&apos;rt bosqich — bitta natija</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="mono text-sm font-bold text-brand-400">{s.n}</span>
                <p className="mt-3 text-lg font-bold text-white">{s.title}</p>
                <p className="mt-1 text-sm text-slate-400">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-10">
        <div className="flex items-center gap-4">
          <span className="icon-bubble h-14 w-14 bg-brand-100 text-brand-800"><MicroscopeIcon size={28} /></span>
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Bugun boshlang</h2>
            <p className="text-slate-500">Ro&apos;yxatdan o&apos;tish bepul va bir daqiqa vaqt oladi.</p>
          </div>
        </div>
        <Link href="/signup" className="btn px-7 py-3 text-base">
          Hisob ochish <ArrowRightIcon size={18} />
        </Link>
      </section>
    </div>
  );
}
