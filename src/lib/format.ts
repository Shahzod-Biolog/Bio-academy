const TZ = "Asia/Tashkent";

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("uz-UZ", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** <input type="datetime-local"> qiymatini (Toshkent vaqti) ISO formatga o'tkazadi. */
export function tashkentLocalToIso(local: string) {
  // Toshkent UTC+5, yozgi vaqt yo'q
  return new Date(`${local}:00+05:00`).toISOString();
}

export function isoToTashkentLocal(iso: string) {
  const d = new Date(new Date(iso).getTime() + 5 * 3600 * 1000);
  return d.toISOString().slice(0, 16);
}
