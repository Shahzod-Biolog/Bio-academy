import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/Illustrations";

const body = Manrope({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-body", display: "swap" });
const heading = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-heading", display: "swap", axes: ["opsz"] });

export const metadata: Metadata = {
  title: "Bio Academy — Biologiya onlayn platformasi",
  description: "Biologiya video darslari, jonli darslar, AI yordamchi va testlar",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f3eee3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${body.variable} ${heading.variable}`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
        <footer className="mt-16 border-t border-ink-900 bg-ink-900 text-brand-300">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6">
            <span className="flex items-center gap-2.5 font-display text-lg font-semibold text-slate-50">
              <LogoMark size={26} inverted /> Bio Academy
            </span>
            <span>© {new Date().getFullYear()} · Hayot ilmini chuqur o&apos;rganing</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
