/** Bio Academy logotipi: olti burchakli molekula ichida barg. */
export function LogoMark({ size = 36 }: { size?: number; inverted?: boolean }) {
  const frame = "#0c7a4c";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 8l36 21v42L50 92 14 71V29z" fill="none" stroke={frame} strokeWidth="7" strokeLinejoin="round" />
      <path d="M50 27c-13 10-16 27-4 44 14-6 21-19 17-36-4-3-8-6-13-8z" fill="#1fbf78" />
      <path d="M46.5 70c2-13 6-23 13-32" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g fill={frame}>
        <circle cx="50" cy="8" r="7" />
        <circle cx="86" cy="71" r="7" />
        <circle cx="14" cy="71" r="7" />
      </g>
    </svg>
  );
}

/**
 * Mikroskop linzasi: dumaloq ko'rish maydonida aylanayotgan DNK qo'sh spirali,
 * nishon chiziqlari va (ixtiyoriy) belgilangan obyekt halqasi.
 * tilt — spiral burchagi, hue — rangni o'zgartirish (har xil kurs uchun).
 */
export function Lens({
  className = "",
  hue = 0,
  tilt = 32,
  speed = 9,
  marker = true,
  ring = true,
}: {
  className?: string;
  hue?: number;
  tilt?: number;
  speed?: number;
  marker?: boolean;
  ring?: boolean;
}) {
  return (
    <div className={"relative aspect-square " + className} aria-hidden>
      {ring && <div className="absolute -inset-[11%] rounded-full border border-dashed border-brand-300/40" />}
      <div className="lens-glass lens-bg absolute inset-0 overflow-hidden rounded-full" style={hue ? { filter: `hue-rotate(${hue}deg)` } : undefined}>
        <div className="absolute left-1/2 top-1/2 h-[175%] w-[62%]" style={{ transform: `translate(-50%, -50%) rotate(${tilt}deg)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dna.svg" alt="" className="dna-scroll block w-full" style={{ animationDuration: `${speed}s` }} />
        </div>
        <div className="lens-vignette absolute inset-0 rounded-full" />
        <div className="absolute inset-x-0 top-1/2 h-px animate-[scan_7s_ease-in-out_infinite] bg-brand-200/60 shadow-[0_0_12px_2px_rgb(61_220_151/0.6)]" />
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <g stroke="#b4e9cc" strokeOpacity=".6" fill="none" strokeWidth=".35">
          <path d="M50 4v14M50 82v14M4 50h14M82 50h14" />
          <circle cx="50" cy="50" r="7.5" />
        </g>
        {marker && <circle cx="69" cy="33" r="5.5" fill="none" stroke="#f2b632" strokeWidth=".6" strokeOpacity=".95" />}
      </svg>
    </div>
  );
}
