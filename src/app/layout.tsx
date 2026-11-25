import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/Illustrations";

const body = Manrope({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-body", display: "swap" });
const heading = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-heading", display: "swap", axes: ["SOFT", "opsz"] });

export const metadata: Metadata = {
  title: "Bio Academy — Biologiya onlayn platformasi",
  description: "Biologiya video darslari, jonli darslar, AI yordamchi va testlar",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#167a52" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${body.variable} ${heading.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
        <footer className="border-t border-slate-200/70 bg-white/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
            <span className="flex items-center gap-2 font-semibold text-slate-600">
              <LogoMark size={22} /> Bio Academy
            </span>
            <span>Hayot ilmini birga o&apos;rganamiz 🌿</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
