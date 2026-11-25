"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/auth/actions";
import { Fern, LogoMark } from "./Illustrations";
import { CheckIcon } from "./Icons";

const PERKS = ["Video va jonli darslar", "Har dars uchun AI yordamchi", "Vaqtli testlar va natijalar"];

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? signIn : signUp, undefined);
  const isLogin = mode === "login";

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-ink-900 bg-brand-200 p-10 lg:block">
        <h2 className="relative font-display text-5xl font-normal leading-none text-ink-900">
          Biologiya — <em className="text-clay-500">hayotning tili</em>
        </h2>
        <ul className="relative mt-6 space-y-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-3 font-semibold text-ink-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-slate-50"><CheckIcon size={14} /></span>
              {p}
            </li>
          ))}
        </ul>
        <Fern className="absolute -bottom-24 -right-16 h-[80%] w-[110%] max-w-none" />
      </div>

      <div className="p-6 sm:p-10">
        <LogoMark size={44} />
        <h1 className="mt-5 font-display text-4xl font-normal sm:text-5xl">{isLogin ? "Xush kelibsiz!" : "Hisob yarating"}</h1>
        <p className="mb-7 mt-1 text-slate-500">
          {isLogin ? "Darslaringizni davom ettirish uchun tizimga kiring" : "Bepul ro'yxatdan o'ting va o'qishni boshlang"}
        </p>
        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next ?? ""} />
          {!isLogin && (
            <div>
              <label className="label" htmlFor="full_name">Ism va familiya</label>
              <input id="full_name" name="full_name" className="input" required autoComplete="name" placeholder="Masalan: Aziza Karimova" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" required autoComplete="email" placeholder="siz@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="password">Parol</label>
            <input id="password" name="password" type="password" className="input" required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"} placeholder="Kamida 6 ta belgi" />
          </div>
          {state?.error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
          {state?.message && <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-700">{state.message}</p>}
          <button className="btn-accent w-full py-3 text-base" disabled={pending}>
            {pending ? "Kuting..." : isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? (
            <>Hisobingiz yo&apos;qmi? <Link href="/signup" className="font-semibold text-brand-700 hover:underline">Ro&apos;yxatdan o&apos;ting</Link></>
          ) : (
            <>Hisobingiz bormi? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Kirish</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
