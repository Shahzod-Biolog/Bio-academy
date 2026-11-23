"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) {
    if (error.message.includes("Email not confirmed"))
      return { error: "Email hali tasdiqlanmagan. Pochtangizdagi havolani bosing." };
    return { error: "Email yoki parol noto'g'ri." };
  }
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (fullName.length < 2) return { error: "Ism va familiyangizni kiriting." };
  if (password.length < 6) return { error: "Parol kamida 6 ta belgidan iborat bo'lsin." };

  const supabase = await createClient();
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName }, emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    if (error.message.toLowerCase().includes("already"))
      return { error: "Bu email bilan allaqachon ro'yxatdan o'tilgan. Kirish sahifasidan foydalaning." };
    return { error: "Ro'yxatdan o'tishda xatolik: " + error.message };
  }
  if (!data.session) {
    return { message: "Tasdiqlash havolasi emailingizga yuborildi. Uni bosib, so'ng tizimga kiring." };
  }
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
