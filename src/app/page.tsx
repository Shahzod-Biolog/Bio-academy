import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lens } from "@/components/Illustrations";
import { ArrowRightIcon, ClipboardIcon, LiveIcon, PlayIcon, SparkIcon } from "@/components/Icons";

const FEATURES = [
  { n: "01", Icon: PlayIcon, title: "Video darslar", text: "Har bir mavzu qisqa, tushunarli videolarga bo'lingan. Istalgan vaqtda, istalgan qurilmada ko'ring.", tag: "×100" },
  { n: "02", Icon: LiveIcon, title: "Jonli efirlar", text: "Ustoz bilan jonli darslarda savol bering. Yozuvlari arxivda saqlanadi.", tag: "×200" },
  { n: "03", Icon: SparkIcon, title: "AI ustoz", text: "Har dars ostida tushunmagan savolingizni bering va darhol javob oling.", tag: "×400" },
  { n: "04", Icon: ClipboardIcon, title: "Vaqtli testlar", text: "10 tadan 50 tagacha savol tanlang, natija va izohlarni darhol ko'ring.", tag: "×1000" },
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
      {/* Mikroskop ostidagi muqova */}
      <section className="relative grid items-center gap-12 py-10 sm:py-14 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1fr_1.05fr] lg:py-6">
        <div className="relative z-10">
          <p className="eyebrow"><span className="h-2 w-2 rounded-full bg-brand-400 shadow-glow" /> Namuna: DNK qo&apos;sh spirali</p>
          <h1 className="mt-5 font-display text-[52px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-7xl xl:text-[84px]">
            Ko&apos;zga ko&apos;rinmas dunyoni <span className="text-brand-400">kashf eting</span>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-slate-600">
            Hujayradan DNKgacha — har bir dars yangi kashfiyot. Video, jonli efir va AI ustoz bilan biologiyani chuqur o&apos;rganing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-accent whitespace-nowrap px-7 py-4 text-base">
              Tadqiqotni boshlash <ArrowRightIcon size={18} />
            </Link>
            <Link href="/login" className="btn-outline whitespace-nowrap px-7 py-4 text-base">Kirish</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] px-8 py-10 sm:px-14">
          <Lens className="w-full" />
          <div className="readout absolute right-0 top-[18%] min-w-40 sm:right-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-300">Obyekt</span>
            <b className="mt-0.5 block font-display text-xl text-slate-900">DNK</b>
            <span className="text-xs text-slate-500">irsiyat kaliti</span>
          </div>
          <div className="readout absolute bottom-[12%] left-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-300">Fanlar</span>
            <b className="mt-0.5 block font-display text-xl text-slate-900">7 bo&apos;lim</b>
          </div>
          <div className="readout absolute bottom-[4%] right-[6%]">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-300">AI ustoz</span>
            <b className="mt-0.5 block font-display text-xl text-slate-900">Onlayn · 24/7</b>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-4 right-0 hidden text-right font-mono text-xs text-brand-300 lg:block">
          <div className="mb-1.5 ml-auto h-1 w-28 rounded bg-brand-400" />50 µm
        </div>
      </section>

      {/* Fanlar lentasi */}
      <section className="ml-[calc(50%-50vw)] w-screen overflow-hidden border-y border-line bg-panel py-4">
        <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-10 pr-10">
          {[...TOPICS, ...TOPICS].map((t, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-lg uppercase tracking-[0.2em] text-brand-100">
              {t} <span className="text-sun-300">◉</span>
            </span>
          ))}
        </div>
      </section>

      {/* Imkoniyatlar: obyektiv kattalashtirish bosqichlari */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Preparatlar</span>
            <h2 className="mt-3 font-display text-4xl font-bold leading-none sm:text-5xl">
              Har bir <span className="text-brand-400">kattalashtirishda</span> yangi bilim
            </h2>
          </div>
          <p className="max-w-xs text-slate-500">O&apos;rganish uchun kerak bo&apos;lgan hamma narsa bitta platformada.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.n} className="card card-hover group relative overflow-hidden">
              <div className="flex items-center justify-between font-mono text-xs text-slate-500">
                <span>{f.n}</span>
                <span className="text-brand-700">{f.tag}</span>
              </div>
              <span className="icon-bubble mt-6 h-14 w-14 border border-brand-300/30 bg-brand-100 text-brand-700 transition group-hover:bg-brand-400 group-hover:text-night">
                <f.Icon size={26} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chaqiruv */}
      <section className="panel-sage mt-16 grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="eyebrow">Laboratoriya jurnali</span>
          <p className="mt-4 font-display text-3xl font-bold leading-snug text-slate-900 sm:text-4xl">
            “Biologiyani <span className="text-brand-400">yodlamang</span> — uni mikroskop ostida ko&apos;ring va tushuning.”
          </p>
          <Link href="/signup" className="btn mt-8 px-7 py-3.5 text-base">
            Hisob ochish <ArrowRightIcon size={18} />
          </Link>
        </div>
        <Lens className="mx-auto hidden w-56 md:block" hue={40} ring={false} />
      </section>
    </div>
  );
}
