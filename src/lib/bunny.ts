import { createHash } from "node:crypto";

/**
 * Bunny Stream sozlamalari (Vercel → Settings → Environment Variables):
 *  - NEXT_PUBLIC_BUNNY_LIBRARY_ID — Video Library ID (raqam)
 *  - BUNNY_STREAM_API_KEY          — kutubxonaning API Key (faqat serverda, sir!)
 *  - BUNNY_TOKEN_KEY               — Security → Token Authentication Key (ixtiyoriy, himoyalangan ko'rish uchun)
 */
export function bunnyLibraryId() {
  return (process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || "").trim();
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Bunny video ID (GUID) — havola joylansa ham faqat ID ni oladi. */
export function bunnyVideoId(ref: string) {
  return ref.trim().split("/").filter(Boolean).pop()?.split("?")[0] ?? "";
}

/** Bunny iframe manzili. Token kaliti bo'lsa, 6 soat amal qiladigan imzo qo'shiladi. */
export function bunnyEmbedUrl(ref: string): string | null {
  const library = bunnyLibraryId();
  const id = bunnyVideoId(ref);
  if (!library || !id) return null;
  const params = new URLSearchParams({ autoplay: "false", preload: "true", responsive: "true" });
  const tokenKey = process.env.BUNNY_TOKEN_KEY?.trim();
  if (tokenKey) {
    const expires = Math.floor(Date.now() / 1000) + 6 * 3600;
    params.set("token", sha256(tokenKey + id + expires));
    params.set("expires", String(expires));
  }
  return `https://iframe.mediadelivery.net/embed/${library}/${id}?${params}`;
}

/** Bunny'da bo'sh video yaratadi va brauzerdan to'g'ridan-to'g'ri (TUS) yuklash uchun imzo qaytaradi. */
export async function createBunnyUpload(title: string) {
  const library = bunnyLibraryId();
  const apiKey = process.env.BUNNY_STREAM_API_KEY?.trim();
  if (!library || !apiKey) throw new Error("Bunny sozlanmagan: NEXT_PUBLIC_BUNNY_LIBRARY_ID va BUNNY_STREAM_API_KEY ni Vercel'ga qo'shing.");

  const res = await fetch(`https://video.bunnycdn.com/library/${library}/videos`, {
    method: "POST",
    headers: { AccessKey: apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ title: title || "Dars videosi" }),
  });
  if (!res.ok) {
    throw new Error(res.status === 401 ? "Bunny API Key noto'g'ri." : `Bunny xatosi (${res.status}).`);
  }
  const video = (await res.json()) as { guid: string };
  const expires = Math.floor(Date.now() / 1000) + 24 * 3600;
  return {
    videoId: video.guid,
    libraryId: library,
    expires,
    signature: sha256(library + apiKey + expires + video.guid),
  };
}
