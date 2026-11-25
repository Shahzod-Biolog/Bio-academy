import { PlayIcon } from "./Icons";
import { embedUrl, type VideoProvider } from "@/lib/video";

export function VideoPlayer({ provider, videoRef, title }: { provider: VideoProvider; videoRef: string; title: string }) {
  const src = embedUrl(provider, videoRef);
  if (!src) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl bg-panel text-slate-400">
        <PlayIcon size={44} className="text-brand-400" />
        Video hali joylanmagan
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-brand-950 shadow-lift ring-1 ring-line">
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
