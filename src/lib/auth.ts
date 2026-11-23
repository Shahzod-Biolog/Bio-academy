import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = { id: string; full_name: string; role: "student" | "admin" };

/** Tizimga kirgan foydalanuvchi va profilini qaytaradi, aks holda /login ga yuboradi. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single<Profile>();
  return {
    supabase,
    user,
    profile: profile ?? { id: user.id, full_name: "", role: "student" as const },
  };
}

export async function requireAdmin() {
  const ctx = await requireUser();
  if (ctx.profile.role !== "admin") redirect("/dashboard");
  return ctx;
}
