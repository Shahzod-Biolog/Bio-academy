import { PlayIcon } from "./Icons";
import { embedUrl, type VideoProvider } from "@/lib/video";

export function VideoPlayer({ provider, videoRef, title }: { provider: VideoProvider; videoRef: string; title: string }) {
  const src = embedUrl(provider, videoRef);
  if (!src) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-100 to-brand-50 text-slate-500">
        <PlayIcon size={40} className="text-brand-300" />
        Video hali joylanmagan
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-brand-950 shadow-lift ring-1 ring-slate-900/5">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
