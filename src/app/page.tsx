import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Fern } from "@/components/Illustrations";
import { ArrowRightIcon, ClipboardIcon, LiveIcon, PlayIcon, SparkIcon } from "@/components/Icons";

const FEATURES = [
  { n: "01", Icon: PlayIcon, title: "Video darslar", text: "Har bir mavzu qisqa, tushunarli videolarga bo'lingan. Istalgan vaqtda, istalgan qurilmada ko'ring." },
  { n: "02", Icon: LiveIcon, title: "Jonli efirlar", text: "Ustoz bilan jonli darslarda savol bering. Yozuvlari arxivda saqlanadi." },
  { n: "03", Icon: SparkIcon, title: "AI ustoz", text: "Har dars ostida tushunmagan savolingizni bering va darhol javob oling." },
  { n: "04", Icon: ClipboardIcon, title: "Vaqtli testlar", text: "10 tadan 50 tagacha savol tanlang, natija va izohlarni darhol ko'ring." },
];

const TOPICS = ["Botanika", "Zoologiya", "Sitologiya", "Genetika", "Anatomiya", "Ekologiya", "Evolyutsiya"];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="-mt-6 sm:-mt-10">
      {/* Muqova */}
      <section className="ml-[calc(50%-50vw)] grid w-screen border-b border-ink-900 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col justify-between gap-10 px-5 py-8 sm:px-10 sm:py-10 lg:border-r lg:border-ink-900">
          <div className="flex flex-wrap justify-between gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 sm:text-xs">
            <span>№ 01 — Biologiya</span>
            <span>DTM · Olimpiada · Maktab</span>
          </div>
          <h1 className="font-display text-[64px] font-normal leading-[0.88] tracking-[-0.03em] text-ink-900 sm:text-[110px] xl:text-[132px]">
            Tirik <em className="text-clay-500">dunyo</em>
            <br />
            sirlari.
            <span className="mt-4 block text-3xl italic tracking-tight text-brand-700 sm:text-5xl">— tushunib o&apos;rganiladigan fan</span>
          </h1>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <p className="max-w-sm text-[17px] leading-relaxed text-slate-700">
              Hujayradan ekotizimgacha: video darslar, jonli efirlar va savolingizga darhol javob beradigan AI ustoz. Hammasi bitta joyda.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="btn-accent whitespace-nowrap px-7 py-4 text-base">
                Bepul boshlash <ArrowRightIcon size={18} />
              </Link>
              <Link href="/login" className="btn-outline whitespace-nowrap px-7 py-4 text-base">Kirish</Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-brand-200 sm:min-h-[520px]">
          <Fern className="absolute -left-8 -top-4 h-[112%] w-[115%] max-w-none object-cover object-left-top" />
          <div className="absolute right-6 top-6 flex h-32 w-32 rotate-[-12deg] items-center justify-center rounded-full bg-sun-300 text-center font-display text-base font-semibold leading-tight text-ink-900 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.35)] sm:h-36 sm:w-36 sm:text-lg">
            Yangi
            <br />
            mavzular
            <br />
            har hafta
          </div>
          <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2 sm:inset-x-6 sm:bottom-6 sm:gap-3">
            {[
              ["01", "Video", "darslar"],
              ["02", "Jonli", "efirlar"],
              ["03", "AI", "ustoz 24/7"],
            ].map(([n, b, t]) => (
              <div key={n} className="rounded-2xl border border-ink-900 bg-slate-50 p-3 sm:p-4">
                <span className="font-mono text-xs text-clay-500">{n}</span>
                <b className="block font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{b}</b>
                <span className="text-xs font-semibold text-slate-600">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mundarija lentasi */}
      <section className="ml-[calc(50%-50vw)] w-screen overflow-hidden border-b border-ink-900 bg-ink-900 py-4 text-slate-50">
        <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-10 pr-10">
          {[...TOPICS, ...TOPICS].map((t, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-2xl italic">
              {t} <span className="text-sun-300">✻</span>
            </span>
          ))}
        </div>
      </section>

      {/* Mundarija */}
      <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <span className="eyebrow">Mundarija</span>
          <h2 className="mt-3 font-display text-5xl font-normal leading-none">
            Bu sonda <em className="text-clay-500">nimalar</em> bor
          </h2>
          <p className="mt-4 max-w-xs text-slate-600">O&apos;rganish uchun kerak bo&apos;lgan hamma narsa bitta platformada.</p>
        </div>
        <ol className="border-t border-ink-900">
          {FEATURES.map((f) => (
            <li key={f.n} className="group grid grid-cols-[3rem_1fr] items-start gap-4 border-b border-ink-900 py-6 sm:grid-cols-[4rem_1fr_auto]">
              <span className="font-mono text-sm text-clay-500">{f.n}</span>
              <div>
                <h3 className="font-display text-3xl font-normal">{f.title}</h3>
                <p className="mt-1 max-w-lg text-slate-600">{f.text}</p>
              </div>
              <span className="icon-bubble hidden h-14 w-14 border border-ink-900 text-ink-900 transition group-hover:bg-ink-900 group-hover:text-slate-50 sm:flex">
                <f.Icon size={24} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Iqtibos */}
      <section className="panel-sage mt-14 grid overflow-hidden md:grid-cols-[1fr_1.2fr]">
        <div className="relative min-h-56 border-b border-ink-900 md:border-b-0 md:border-r">
          <Fern className="absolute -bottom-10 -left-10 h-[130%] w-[130%] max-w-none rotate-12 opacity-90" />
        </div>
        <div className="p-8 sm:p-12">
          <p className="font-display text-3xl leading-snug text-ink-900 sm:text-4xl">
            “Biologiya — bu hayotning o&apos;zi haqidagi fan. Uni <em className="text-clay-600">yodlamang</em>, tushuning.”
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-brand-800">— Bio Academy tamoyili</p>
          <Link href="/signup" className="btn mt-8 px-7 py-3.5 text-base">
            Hisob ochish <ArrowRightIcon size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
