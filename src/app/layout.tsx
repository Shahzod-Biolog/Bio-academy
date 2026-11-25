import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/Illustrations";

const body = Manrope({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-body", display: "swap" });
const heading = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-heading", display: "swap" });
const code = JetBrains_Mono({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-code", display: "swap" });

export const metadata: Metadata = {
  title: "Bio Academy — Biologiya onlayn platformasi",
  description: "Biologiya video darslari, jonli darslar, AI yordamchi va testlar",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06100d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${body.variable} ${heading.variable} ${code.variable}`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
        <footer className="mt-16 border-t border-line bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
            <span className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900">
              <LogoMark size={26} /> Bio <span className="-ml-1.5 text-brand-400">Academy</span>
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-slate-500">© {new Date().getFullYear()} · Ko&apos;zga ko&apos;rinmas dunyoni kashf eting</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
