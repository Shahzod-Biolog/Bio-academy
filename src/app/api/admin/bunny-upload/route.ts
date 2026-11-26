import { createClient } from "@/lib/supabase/server";
import { createBunnyUpload } from "@/lib/bunny";

export const runtime = "nodejs";

/** Admin uchun: Bunny'da yangi video yaratib, brauzerdan yuklash imzosini beradi. API kalit brauzerga chiqmaydi. */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Avval tizimga kiring." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return Response.json({ error: "Faqat admin uchun." }, { status: 403 });

  let title = "";
  try {
    title = String(((await req.json()) as { title?: unknown }).title ?? "").slice(0, 200);
  } catch {}
  try {
    return Response.json(await createBunnyUpload(title));
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Bunny xatosi." }, { status: 500 });
  }
}
