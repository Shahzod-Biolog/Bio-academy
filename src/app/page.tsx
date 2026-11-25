import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LabGrid } from "@/components/Illustrations";
import { ArrowRightIcon, ClipboardIcon, ClockIcon, LeafIcon, LiveIcon, MicroscopeIcon, PlayIcon, SparkIcon } from "@/components/Icons";

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
      {/* Hero: mikroskop ostidagi barg hujayralari fonida */}
      <section className="relative -mt-6 ml-[calc(50%-50vw)] w-screen overflow-hidden sm:-mt-10">
        <div className="absolute inset-0 scale-105 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-brand-950/60 to-ink-950/85" />
        <div className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_40%,rgb(61_220_151/0.12),transparent_70%)]" />
        <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="mono inline-flex items-center gap-2 rounded-full border border-sun-300/40 bg-sun-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sun-300">
            <LeafIcon size={14} /> Biologiya onlayn akademiyasi
          </span>
          <h1 className="mt-7 text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Hayot sirlarini
            <br />
            <span className="text-sun-300">ilm bilan</span> kashf eting
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200/90 sm:text-xl">
            Video darslar, jonli mashg&apos;ulotlar, sun&apos;iy intellekt yordamchisi va vaqtli testlar. DTM va olimpiadaga tayyorgarlik uchun bitta platforma.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {["Istalgan vaqtda, istalgan qurilmada", "Savolingizga darhol javob"].map((t, i) => (
              <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                {i === 0 ? <ClockIcon size={16} className="text-sun-300" /> : <SparkIcon size={16} className="text-sun-300" />} {t}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sun-400 px-7 py-3 text-base font-bold text-ink-950 shadow-[0_10px_30px_-10px_rgb(247_173_42/0.7)] transition hover:bg-sun-300 active:scale-[0.98]">
              Bepul boshlash <ArrowRightIcon size={18} />
            </Link>
            <Link href="/login" className="inline-flex min-h-12 items-center rounded-xl border-2 border-white/30 px-7 py-3 text-base font-bold text-white transition hover:border-white hover:bg-white/10">
              Kirish
            </Link>
          </div>
          <div className="mt-12 grid w-full max-w-3xl grid-cols-3 gap-3 sm:gap-5">
            {[
              { Icon: PlayIcon, v: "Video", l: "darslar" },
              { Icon: SparkIcon, v: "24/7", l: "AI yordamchi" },
              { Icon: ClipboardIcon, v: "10–50", l: "savolli testlar" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-5 backdrop-blur-md sm:px-4">
                <s.Icon size={26} className="mx-auto text-sun-300" />
                <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{s.v}</p>
                <p className="text-xs text-slate-300 sm:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
          <span className="mt-12 hidden h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2 sm:flex" aria-hidden>
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
          </span>
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
