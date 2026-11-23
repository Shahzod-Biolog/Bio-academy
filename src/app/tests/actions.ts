"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function startTest(formData: FormData) {
  const testId = String(formData.get("test_id"));
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("start_test", { p_test_id: testId });
  if (error || !data) throw new Error("Testni boshlab bo'lmadi");
  redirect(`/tests/${testId}?attempt=${data}`);
}

export async function submitTest(attemptId: string, answers: Record<string, number>) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_test", { p_attempt_id: attemptId, p_answers: answers });
  if (error && !error.message.includes("already submitted")) {
    return { error: "Javoblarni yuborishda xatolik. Qayta urinib ko'ring." };
  }
  redirect(`/results/${attemptId}`);
}
