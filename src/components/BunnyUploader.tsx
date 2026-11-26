"use client";

import { useRef, useState } from "react";
import { Upload } from "tus-js-client";

/**
 * Videoni brauzerdan to'g'ridan-to'g'ri Bunny Stream'ga yuklaydi (katta fayllar ham, uzilsa davom etadi).
 * Tugagach, formadagi "video_ref" maydoniga Video ID ni yozadi va "Bunny Stream" ni tanlaydi.
 */
export function BunnyUploader({ refInputId, providerSelectId, titleInputName = "title" }: { refInputId: string; providerSelectId: string; titleInputName?: string }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);
  const uploadRef = useRef<Upload | null>(null);

  async function start(file: File) {
    setStatus(null);
    setProgress(0);
    const form = document.getElementById(refInputId)?.closest("form");
    const title = (form?.querySelector(`[name="${titleInputName}"]`) as HTMLInputElement | null)?.value || file.name;

    const res = await fetch("/api/admin/bunny-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json().catch(() => ({ error: "Server javob bermadi." }));
    if (!res.ok) {
      setProgress(null);
      setStatus({ kind: "err", text: data.error || "Xatolik." });
      return;
    }

    const upload = new Upload(file, {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
      chunkSize: 50 * 1024 * 1024,
      headers: {
        AuthorizationSignature: data.signature,
        AuthorizationExpire: String(data.expires),
        VideoId: data.videoId,
        LibraryId: String(data.libraryId),
      },
      metadata: { filetype: file.type, title },
      onProgress: (sent, total) => setProgress(Math.round((sent / total) * 100)),
      onError: (err) => {
        setProgress(null);
        setStatus({ kind: "err", text: "Yuklashda xatolik: " + err.message });
      },
      onSuccess: () => {
        setProgress(null);
        const input = document.getElementById(refInputId) as HTMLInputElement | null;
        const select = document.getElementById(providerSelectId) as HTMLSelectElement | null;
        if (input) input.value = data.videoId;
        if (select) select.value = "bunny";
        setStatus({
          kind: "ok",
          text: "✅ Video yuklandi! Endi pastdagi \"Saqlash\" tugmasini bosing. Bunny videoni 5–15 daqiqada tayyorlaydi, shundan keyin u o'quvchilarga ko'rinadi.",
        });
      },
    });
    uploadRef.current = upload;
    const previous = await upload.findPreviousUploads();
    if (previous.length) upload.resumeFromPreviousUpload(previous[0]);
    upload.start();
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-3">
      <label className="label">📤 Videoni kompyuter/iPad'dan Bunny'ga yuklash</label>
      <input
        type="file"
        accept="video/*"
        className="block w-full text-sm"
        disabled={progress !== null}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) start(f);
        }}
      />
      {progress !== null && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Yuklanmoqda… {progress}% (sahifani yopmang)</span>
            <button type="button" className="underline" onClick={() => { uploadRef.current?.abort(); setProgress(null); setStatus({ kind: "info", text: "To'xtatildi. Faylni qayta tanlasangiz, davom etadi." }); }}>
              To&apos;xtatish
            </button>
          </div>
        </div>
      )}
      {status && (
        <p className={`mt-2 text-sm ${status.kind === "err" ? "text-red-600" : status.kind === "ok" ? "text-brand-700" : "text-slate-500"}`}>{status.text}</p>
      )}
    </div>
  );
}
