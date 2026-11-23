import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Bio Academy — Biologiya onlayn platformasi",
  description: "Biologiya video darslari, jonli darslar, AI yordamchi va testlar",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
