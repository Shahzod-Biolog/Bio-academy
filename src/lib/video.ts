export type VideoProvider = "bunny" | "youtube" | "none";

/** YouTube havolasidan (yoki to'g'ridan-to'g'ri ID dan) video ID ni ajratib oladi. */
export function youtubeId(ref: string): string | null {
  const s = ref.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const url = new URL(s);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1, 12) || null;
    const v = url.searchParams.get("v");
    if (v) return v;
    const m = url.pathname.match(/\/(?:embed|live|shorts)\/([\w-]{11})/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** Video uchun iframe manzili. Topilmasa null. */
export function embedUrl(provider: VideoProvider, ref: string): string | null {
  if (!ref.trim() || provider === "none") return null;
  if (provider === "youtube") {
    const id = youtubeId(ref);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
  }
  const library = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
  if (!library) return null;
  // Bunny Stream havolasi joylansa ham, faqat video ID ni olamiz
  const id = ref.trim().split("/").filter(Boolean).pop()!.split("?")[0];
  return `https://iframe.mediadelivery.net/embed/${library}/${id}?autoplay=false&preload=true&responsive=true`;
}
