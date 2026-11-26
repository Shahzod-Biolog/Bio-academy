"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { tashkentLocalToIso } from "@/lib/format";
import { parseQuestions } from "@/lib/parseQuestions";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string, d = 0) => {
  const n = Number(f.get(k));
  return Number.isFinite(n) ? n : d;
};

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

// ---------- Kurslar ----------
export async function saveCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const row = {
    title: str(formData, "title"),
    description: str(formData, "description"),
    position: num(formData, "position"),
    section: str(formData, "section") === "nazariy" ? "nazariy" : "masala",
  };
  if (id) check((await supabase.from("courses").update(row).eq("id", id)).error);
  else check((await supabase.from("courses").insert(row)).error);
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/courses/${id}`);
}

export async function deleteCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  check((await supabase.from("courses").delete().eq("id", str(formData, "id"))).error);
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- Mavzular ----------
export async function saveTopic(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const courseId = str(formData, "course_id");
  const row = { title: str(formData, "title"), description: str(formData, "description"), position: num(formData, "position") };
  if (id) check((await supabase.from("topics").update(row).eq("id", id)).error);
  else check((await supabase.from("topics").insert({ ...row, course_id: courseId })).error);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteTopic(formData: FormData) {
  const { supabase } = await requireAdmin();
  check((await supabase.from("topics").delete().eq("id", str(formData, "id"))).error);
  revalidatePath(`/admin/courses/${str(formData, "course_id")}`);
}

// ---------- Darslar ----------
export async function saveLesson(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const row = {
    topic_id: str(formData, "topic_id"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    video_provider: str(formData, "video_provider") || "bunny",
    video_ref: str(formData, "video_ref"),
    notes: str(formData, "notes"),
    position: num(formData, "position"),
  };
  let lessonId = id;
  if (id) check((await supabase.from("lessons").update(row).eq("id", id)).error);
  else {
    const { data, error } = await supabase.from("lessons").insert(row).select("id").single();
    check(error);
    lessonId = data!.id;
  }
  revalidatePath(`/lessons/${lessonId}`);
  redirect(`/admin/courses/${str(formData, "course_id")}?saved=1`);
}

export async function deleteLesson(formData: FormData) {
  const { supabase } = await requireAdmin();
  check((await supabase.from("lessons").delete().eq("id", str(formData, "id"))).error);
  revalidatePath(`/admin/courses/${str(formData, "course_id")}`);
}

// ---------- Testlar ----------
export async function saveTest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const row = { title: str(formData, "title"), time_limit_minutes: Math.max(1, num(formData, "time_limit_minutes", 20)) };
  if (id) {
    // Testni boshqa mavzuga ko'chirish (admin "Mavzu" ro'yxatidan tanlaydi)
    const topicId = str(formData, "topic_id");
    check((await supabase.from("tests").update(topicId ? { ...row, topic_id: topicId } : row).eq("id", id)).error);
    revalidatePath(`/admin/tests/${id}`);
  } else {
    const { data, error } = await supabase.from("tests").insert({ ...row, topic_id: str(formData, "topic_id") }).select("id").single();
    check(error);
    redirect(`/admin/tests/${data!.id}`);
  }
}

export async function deleteTest(formData: FormData) {
  const { supabase } = await requireAdmin();
  check((await supabase.from("tests").delete().eq("id", str(formData, "id"))).error);
  redirect(`/admin/courses/${str(formData, "course_id")}`);
}

async function insertQuestion(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  testId: string,
  q: { text: string; options: string[]; correct: number; explanation: string },
  position: number,
) {
  const { data, error } = await supabase
    .from("questions")
    .insert({ test_id: testId, text: q.text, options: q.options, position })
    .select("id")
    .single();
  check(error);
  check((await supabase.from("question_keys").insert({ question_id: data!.id, correct_index: q.correct, explanation: q.explanation })).error);
}

async function nextPosition(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], testId: string) {
  const { data } = await supabase.from("questions").select("position").eq("test_id", testId).order("position", { ascending: false }).limit(1);
  return (data?.[0]?.position ?? 0) + 1;
}

export async function addQuestion(formData: FormData) {
  const { supabase } = await requireAdmin();
  const testId = str(formData, "test_id");
  const filled = [0, 1, 2, 3, 4].map((i) => ({ i, text: str(formData, `option_${i}`) })).filter((o) => o.text);
  const options = filled.map((o) => o.text);
  const correct = filled.findIndex((o) => o.i === num(formData, "correct", -1));
  if (!str(formData, "text") || options.length < 2 || correct < 0 || correct >= options.length) {
    redirect(`/admin/tests/${testId}?error=` + encodeURIComponent("Savol matni, kamida 2 ta variant va to'g'ri javobni belgilang."));
  }
  await insertQuestion(supabase, testId, { text: str(formData, "text"), options, correct, explanation: str(formData, "explanation") }, await nextPosition(supabase, testId));
  revalidatePath(`/admin/tests/${testId}`);
}

export async function importQuestions(formData: FormData) {
  const { supabase } = await requireAdmin();
  const testId = str(formData, "test_id");
  const { questions, errors } = parseQuestions(String(formData.get("bulk") ?? ""));
  if (errors.length) redirect(`/admin/tests/${testId}?error=` + encodeURIComponent(errors.join("; ")));
  let pos = await nextPosition(supabase, testId);
  for (const q of questions) await insertQuestion(supabase, testId, q, pos++);
  revalidatePath(`/admin/tests/${testId}`);
  redirect(`/admin/tests/${testId}?imported=${questions.length}`);
}

/** PDF'dan olingan (admin tekshirgan) savollarni bir yo'la saqlaydi. */
export async function saveImportedQuestions(
  testId: string,
  items: { text: string; options: string[]; correct: number; explanation: string }[],
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  const clean = items
    .map((q) => ({
      text: String(q.text ?? "").trim(),
      options: (q.options ?? []).map((o) => String(o ?? "").trim()).slice(0, 6),
      correct: Number(q.correct),
      explanation: String(q.explanation ?? "").trim(),
    }))
    .filter((q) => q.text);
  const bad = clean.findIndex((q) => q.options.length < 2 || q.options.some((o) => !o) || !(q.correct >= 0 && q.correct < q.options.length));
  if (bad >= 0) return { ok: false, error: `${bad + 1}-savolda variantlar yoki to'g'ri javob to'liq emas.` };
  if (!clean.length) return { ok: false, error: "Saqlash uchun savol yo'q." };

  const start = await nextPosition(supabase, testId);
  const { data, error } = await supabase
    .from("questions")
    .insert(clean.map((q, i) => ({ test_id: testId, text: q.text, options: q.options, position: start + i })))
    .select("id, position");
  if (error || !data) return { ok: false, error: error?.message ?? "Saqlashda xatolik" };
  const byPos = new Map(data.map((r) => [r.position as number, r.id as string]));
  const keys = clean.map((q, i) => ({ question_id: byPos.get(start + i)!, correct_index: q.correct, explanation: q.explanation }));
  const { error: keyErr } = await supabase.from("question_keys").insert(keys);
  if (keyErr) {
    await supabase.from("questions").delete().in("id", data.map((r) => r.id));
    return { ok: false, error: keyErr.message };
  }
  revalidatePath(`/admin/tests/${testId}`);
  return { ok: true, count: clean.length };
}

export async function deleteQuestion(formData: FormData) {
  const { supabase } = await requireAdmin();
  check((await supabase.from("questions").delete().eq("id", str(formData, "id"))).error);
  revalidatePath(`/admin/tests/${str(formData, "test_id")}`);
}

// ---------- Jonli darslar ----------
export async function saveLive(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const row = {
    title: str(formData, "title"),
    description: str(formData, "description"),
    starts_at: tashkentLocalToIso(str(formData, "starts_at")),
    meeting_url: str(formData, "meeting_url"),
    recording_provider: str(formData, "recording_provider") || "youtube",
    recording_ref: str(formData, "recording_ref"),
  };
  if (id) check((await supabase.from("live_sessions").update(row).eq("id", id)).error);
  else check((await supabase.from("live_sessions").insert(row)).error);
  revalidatePath("/admin/live");
  revalidatePath("/live");
  redirect("/admin/live");
}

export async function deleteLive(formData: FormData) {
  const { supabase } = await requireAdmin();
  check((await supabase.from("live_sessions").delete().eq("id", str(formData, "id"))).error);
  revalidatePath("/admin/live");
}
