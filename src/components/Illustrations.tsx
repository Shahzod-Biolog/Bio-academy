/** Bio Academy logotipi: olti burchakli molekula ichida barg. */
export function LogoMark({ size = 36, inverted = false }: { size?: number; inverted?: boolean }) {
  const frame = inverted ? "#7fe0bf" : "#0b4d3a";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 8l36 21v42L50 92 14 71V29z" fill="none" stroke={frame} strokeWidth="7" strokeLinejoin="round" />
      <path d="M50 27c-13 10-16 27-4 44 14-6 21-19 17-36-4-3-8-6-13-8z" fill="#10a37f" />
      <path d="M46.5 70c2-13 6-23 13-32" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g fill={frame}>
        <circle cx="50" cy="8" r="7" />
        <circle cx="86" cy="71" r="7" />
        <circle cx="14" cy="71" r="7" />
      </g>
    </svg>
  );
}

/** Katta paporotnik bargi (oldindan chizilgan SVG, /public ichida). */
export function Fern({ light = false, className = "" }: { light?: boolean; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={light ? "/fern-light.svg" : "/fern.svg"} alt="" aria-hidden className={className} />;
}
