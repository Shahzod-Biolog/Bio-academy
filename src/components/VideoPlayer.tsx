import { embedUrl, type VideoProvider } from "@/lib/video";

export function VideoPlayer({ provider, videoRef, title }: { provider: VideoProvider; videoRef: string; title: string }) {
  const src = embedUrl(provider, videoRef);
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
        Video hali joylanmagan
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow">
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
