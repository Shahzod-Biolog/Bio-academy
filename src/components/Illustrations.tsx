/** Bio Academy logotipi: olti burchakli molekula ichida barg. */
export function LogoMark({ size = 36 }: { size?: number; inverted?: boolean }) {
  const frame = "#7fe0bf";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 8l36 21v42L50 92 14 71V29z" fill="none" stroke={frame} strokeWidth="7" strokeLinejoin="round" />
      <path d="M50 27c-13 10-16 27-4 44 14-6 21-19 17-36-4-3-8-6-13-8z" fill="#3ddc97" />
      <path d="M46.5 70c2-13 6-23 13-32" stroke="#04130d" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g fill={frame}>
        <circle cx="50" cy="8" r="7" />
        <circle cx="86" cy="71" r="7" />
        <circle cx="14" cy="71" r="7" />
      </g>
    </svg>
  );
}

/**
 * Mikroskop linzasi: dumaloq ko'rish maydonida hujayralar surati,
 * nishon chiziqlari va (ixtiyoriy) belgilangan obyekt halqasi.
 * hue — rangni o'zgartirish (har xil kurs uchun har xil "preparat").
 */
export function Lens({
  className = "",
  hue = 0,
  zoom = 1.5,
  focus = "50% 50%",
  marker = true,
  ring = true,
}: {
  className?: string;
  hue?: number;
  zoom?: number;
  focus?: string;
  marker?: boolean;
  ring?: boolean;
}) {
  return (
    <div className={"relative aspect-square " + className} aria-hidden>
      {ring && <div className="absolute -inset-[11%] rounded-full border border-dashed border-brand-300/30" />}
      <div className="lens-glass absolute inset-0 overflow-hidden rounded-full bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/micro.jpg"
          alt=""
          className="h-full w-full object-cover"
          style={{
            objectPosition: focus,
            transform: `scale(${zoom})`,
            filter: `saturate(1.3) contrast(1.1) hue-rotate(${hue}deg)`,
          }}
        />
        <div className="lens-vignette absolute inset-0 rounded-full" />
        <div className="absolute inset-x-0 top-1/2 h-px animate-[scan_7s_ease-in-out_infinite] bg-brand-300/50 shadow-[0_0_12px_2px_rgb(61_220_151/0.5)]" />
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <g stroke="#7fe0bf" strokeOpacity=".55" fill="none" strokeWidth=".35">
          <path d="M50 4v16M50 80v16M4 50h16M80 50h16" />
          <circle cx="50" cy="50" r="7.5" />
        </g>
        {marker && <circle cx="70" cy="35" r="5" fill="none" stroke="#e8b64c" strokeWidth=".5" strokeOpacity=".9" />}
      </svg>
    </div>
  );
}
