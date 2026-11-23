"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/auth/actions";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? signIn : signUp, undefined);
  const isLogin = mode === "login";

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6 sm:p-8">
        <h1 className="mb-1 text-2xl font-bold">{isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"}</h1>
        <p className="mb-6 text-sm text-slate-500">
          {isLogin ? "Darslaringizni davom ettiring" : "Bepul hisob yarating va o'qishni boshlang"}
        </p>
        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next ?? ""} />
          {!isLogin && (
            <div>
              <label className="label" htmlFor="full_name">Ism va familiya</label>
              <input id="full_name" name="full_name" className="input" required autoComplete="name" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" required autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Parol</label>
            <input id="password" name="password" type="password" className="input" required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"} />
          </div>
          {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
          {state?.message && <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-700">{state.message}</p>}
          <button className="btn w-full" disabled={pending}>
            {pending ? "Kuting..." : isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? (
            <>Hisobingiz yo&apos;qmi? <Link href="/signup" className="font-semibold text-brand-700">Ro&apos;yxatdan o&apos;ting</Link></>
          ) : (
            <>Hisobingiz bormi? <Link href="/login" className="font-semibold text-brand-700">Kirish</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
