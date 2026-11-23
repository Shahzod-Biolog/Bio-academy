export type ParsedQuestion = { text: string; options: string[]; correct: number; explanation: string };

/**
 * Savollarni matndan o'qiydi. Format:
 *
 * 1. Hujayraning energiya markazi qaysi?
 * A) Yadro
 * *B) Mitoxondriya
 * C) Ribosoma
 * D) Lizosoma
 * Izoh: Mitoxondriyada ATF sintezlanadi.
 *
 * To'g'ri javob oldiga * qo'yiladi. Savollar orasida bo'sh qator bo'lsin.
 */
export function parseQuestions(raw: string): { questions: ParsedQuestion[]; errors: string[] } {
  const blocks = raw.replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const questions: ParsedQuestion[] = [];
  const errors: string[] = [];

  blocks.forEach((block, bi) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    let text = "";
    const options: string[] = [];
    let correct = -1;
    let explanation = "";
    for (const line of lines) {
      const opt = line.match(/^(\*?)\s*([A-Fa-f])\s*[\).]\s*(.+)$/);
      const exp = line.match(/^izoh\s*:\s*(.+)$/i);
      if (exp) explanation = exp[1];
      else if (opt) {
        if (opt[1] === "*") correct = options.length;
        options.push(opt[3].replace(/\s*\*$/, ""));
      } else if (options.length === 0) text += (text ? " " : "") + line.replace(/^\d+\s*[\).]\s*/, "");
    }
    const n = bi + 1;
    if (!text) errors.push(`${n}-savol: savol matni topilmadi`);
    else if (options.length < 2) errors.push(`${n}-savol: kamida 2 ta variant kerak`);
    else if (correct < 0) errors.push(`${n}-savol: to'g'ri javob oldiga * qo'ying`);
    else questions.push({ text, options, correct, explanation });
  });

  return { questions, errors };
}
