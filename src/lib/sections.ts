/** Kurslar ikki bo'limga ajratiladi: nazariy darslar va masala darslari. */
export const SECTIONS = [
  { key: "nazariy", title: "Nazariy darslar", hint: "Sinflar bo'yicha nazariy mavzular" },
  { key: "masala", title: "Masala darslari", hint: "Masala yechish va amaliy mashqlar" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

/** SQL hali ishga tushirilmagan bo'lsa ham ishlashi uchun: bo'limi yo'q kurs = masala. */
export function sectionOf(c: { section?: string | null }): SectionKey {
  return c.section === "nazariy" ? "nazariy" : "masala";
}

export function groupBySection<T extends { section?: string | null }>(courses: T[]) {
  return SECTIONS.map((s) => ({ ...s, courses: courses.filter((c) => sectionOf(c) === s.key) }));
}
