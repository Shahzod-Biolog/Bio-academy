import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CellIllustration, DnaHelix } from "@/components/Illustrations";
import { ArrowRightIcon, ClipboardIcon, LeafIcon, LiveIcon, PlayIcon, SparkIcon, TONE_CLASSES, type Tone } from "@/components/Icons";

const FEATURES: { Icon: typeof PlayIcon; tone: Tone; title: string; text: string }[] = [
  { Icon: PlayIcon, tone: "leaf", title: "Video darslar", text: "Barcha mavzular bo'yicha video darslarni istalgan vaqtda ko'ring." },
  { Icon: LiveIcon, tone: "rose", title: "Jonli darslar", text: "Ustoz bilan jonli darslarda qatnashing, yozuvlarini keyin ko'ring." },
  { Icon: SparkIcon, tone: "teal", title: "AI yordamchi", text: "Har dars ostida tushunmagan savolingizni bering — darhol javob oling." },
  { Icon: ClipboardIcon, tone: "sun", title: "Testlar", text: "Mavzu bo'yicha vaqtli testlar, avtomatik baholash va natijalar tarixi." },
];

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
    <div className="space-y-16 sm:space-y-24">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-800 via-brand-700 to-teal-600 px-6 py-12 text-white shadow-lift sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-sun-300/20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-50 ring-1 ring-white/25">
              <LeafIcon size={15} /> Biologiya onlayn platformasi
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Hayot ilmini <span className="italic text-sun-300">tushunib</span> o&apos;rganing
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-50/90">
              Video darslar, jonli mashg&apos;ulotlar va AI yordamchi — hujayradan ekotizimgacha, hammasi bir joyda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn bg-white px-6 text-base text-brand-800 shadow-none hover:bg-brand-50">
                Bepul boshlash <ArrowRightIcon size={18} />
              </Link>
              <Link href="/login" className="btn-outline border-white/40 bg-white/5 px-6 text-base text-white hover:border-white hover:bg-white/15 hover:text-white">
                Kirish
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <CellIllustration className="w-full animate-float drop-shadow-2xl" />
            <DnaHelix className="absolute -left-6 top-6 hidden h-48 rotate-[18deg] opacity-90 sm:block" />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <span className="eyebrow">Imkoniyatlar</span>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">O&apos;rganish uchun hamma narsa</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <div className={"icon-bubble mb-4 h-12 w-12 " + TONE_CLASSES[f.tone].bubble}>
                <f.Icon size={24} />
              </div>
              <h3 className="mb-1.5 text-lg font-bold">{f.title}</h3>
              <p className="text-[15px] leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1fr_2fr]">
          <div className="bg-brand-50 p-8">
            <span className="eyebrow">Qanday ishlaydi</span>
            <h2 className="mt-2 font-display text-3xl font-semibold">To&apos;rt oddiy qadam</h2>
            <p className="mt-3 text-slate-600">Xuddi hujayra bo&apos;linishi kabi — bosqichma-bosqich, tartib bilan.</p>
          </div>
          <ol className="grid gap-px bg-slate-100 sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-white p-6">
                <span className="font-display text-3xl font-semibold text-brand-300">{s.n}</span>
                <p className="mt-2 font-bold text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-500">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="text-center">
        <h2 className="font-display text-3xl font-semibold">Bugun boshlang</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-500">Ro&apos;yxatdan o&apos;tish bepul va bir daqiqa vaqt oladi.</p>
        <Link href="/signup" className="btn mt-6 px-7 text-base">
          Hisob ochish <ArrowRightIcon size={18} />
        </Link>
      </section>
    </div>
  );
}
