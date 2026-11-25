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

/**
 * Aylanayotgan DNK spirali — nuqtalar va bog'lar faqat CSS animatsiya bilan harakatlanadi.
 * Server komponenti, JavaScript talab qilmaydi.
 */
export function HelixAnimation({ rungs = 16, className = "" }: { rungs?: number; className?: string }) {
  const period = 4.8;
  return (
    <div className={"helix " + className} aria-hidden>
      {Array.from({ length: rungs }, (_, i) => {
        const delay = `${-(i / rungs) * period * 1.6}s`;
        return (
          <div key={i} className="helix-rung" style={{ ["--d" as string]: delay }}>
            <span className="helix-bond" />
            <span className="helix-dot helix-dot-a" />
            <span className="helix-dot helix-dot-b" />
          </div>
        );
      })}
    </div>
  );
}

/** To'q bo'limlar uchun laboratoriya daftari to'ri va tolalar naqshi. */
export function LabGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 240">
      <defs>
        <pattern id="lab-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0v24" fill="none" stroke="#7fe0bf" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <radialGradient id="lab-fade" cx="70%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="lab-mask">
          <rect width="400" height="240" fill="url(#lab-fade)" />
        </mask>
      </defs>
      <g mask="url(#lab-mask)">
        <rect width="400" height="240" fill="url(#lab-grid)" />
        <g fill="none" stroke="#3ddc97" strokeOpacity="0.18" strokeWidth="1.2">
          <path d="M-10 190C60 150 110 210 180 170s120-60 230-20" />
          <path d="M-10 205C60 165 110 225 180 185s120-60 230-20" strokeOpacity="0.1" />
        </g>
      </g>
    </svg>
  );
}
