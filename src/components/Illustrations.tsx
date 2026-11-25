/** Bio Academy logotipi: barg ichidagi DNK spirali. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#48b284" />
          <stop offset="1" stopColor="#0c8279" />
        </linearGradient>
      </defs>
      <path d="M20 2C31 6 38 13 38 22c0 9-8 16-18 16S2 31 2 22C2 13 9 6 20 2z" fill="url(#logo-g)" />
      <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <path d="M14 11c0 6 12 6 12 12s-12 6-12 6" opacity="0.95" />
        <path d="M26 11c0 6-12 6-12 12s12 6 12 6" opacity="0.6" />
        <path d="M16 15h8M16 26h8" strokeWidth="1.6" opacity="0.8" />
      </g>
    </svg>
  );
}

/** Bosh sahifa uchun katta hujayra rasmi (yadro, mitoxondriya, ribosomalar). */
export function CellIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 420" className={className} aria-hidden>
      <defs>
        <radialGradient id="cyto" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#ecfbfa" />
          <stop offset="0.7" stopColor="#cff4f1" />
          <stop offset="1" stopColor="#9fe3d8" />
        </radialGradient>
        <radialGradient id="nuc" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#b0e3c9" />
          <stop offset="1" stopColor="#229766" />
        </radialGradient>
        <linearGradient id="mito" x1="0" x2="1">
          <stop offset="0" stopColor="#fbc456" />
          <stop offset="1" stopColor="#f7ad2a" />
        </linearGradient>
      </defs>

      {/* hujayra membranasi */}
      <path
        d="M210 22c96 0 182 62 186 176 4 112-78 200-190 200S20 322 24 206C28 92 116 22 210 22z"
        fill="url(#cyto)"
        stroke="#13a397"
        strokeWidth="6"
      />
      <path
        d="M210 40c84 0 164 56 168 158 3 100-70 182-172 182S42 310 44 206C47 104 126 40 210 40z"
        fill="none"
        stroke="#2bbfb3"
        strokeWidth="1.5"
        strokeDasharray="2 9"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* endoplazmatik to'r */}
      <g fill="none" stroke="#48b284" strokeWidth="4" strokeLinecap="round" opacity="0.55">
        <path d="M120 250c20-12 40 10 60-2s34 14 54 4" />
        <path d="M112 274c24-12 44 12 66 0s36 14 58 2" />
        <path d="M124 298c20-10 38 10 56 0s30 12 48 4" />
      </g>

      {/* yadro */}
      <circle cx="232" cy="168" r="70" fill="url(#nuc)" />
      <circle cx="232" cy="168" r="70" fill="none" stroke="#126244" strokeWidth="3" strokeDasharray="10 6" opacity="0.5" />
      <circle cx="250" cy="150" r="20" fill="#126244" opacity="0.85" />
      <g fill="none" stroke="#effaf4" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        <path d="M196 180c10-8 20 8 30 0s20 8 30 0" />
        <path d="M204 200c8-6 16 6 24 0s16 6 24 0" />
      </g>

      {/* mitoxondriyalar */}
      <g transform="rotate(-25 110 150)">
        <rect x="70" y="130" width="84" height="40" rx="20" fill="url(#mito)" />
        <path d="M82 150c6-12 10 12 16 0s10 12 16 0 10 12 16 0 8 10 12 0" fill="none" stroke="#9c5208" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </g>
      <g transform="rotate(30 310 300)">
        <rect x="274" y="282" width="72" height="34" rx="17" fill="url(#mito)" />
        <path d="M284 299c5-10 9 10 14 0s9 10 14 0 9 10 14 0" fill="none" stroke="#9c5208" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* vakuola va ribosomalar */}
      <ellipse cx="320" cy="214" rx="26" ry="20" fill="#fff" opacity="0.7" stroke="#2bbfb3" strokeWidth="2" />
      <g fill="#126244" opacity="0.55">
        <circle cx="150" cy="210" r="4" />
        <circle cx="168" cy="96" r="3.5" />
        <circle cx="300" cy="110" r="4" />
        <circle cx="330" cy="150" r="3" />
        <circle cx="200" cy="330" r="4" />
        <circle cx="250" cy="300" r="3" />
        <circle cx="96" cy="220" r="3" />
        <circle cx="260" cy="350" r="3.5" />
        <circle cx="140" cy="330" r="3" />
      </g>
    </svg>
  );
}

/** Suzib yuruvchi DNK spirali (bezak). */
export function DnaHelix({ className = "" }: { className?: string }) {
  const rungs = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg viewBox="0 0 80 240" className={className} aria-hidden>
      <g fill="none" strokeLinecap="round">
        <path d="M14 0c0 40 52 40 52 80s-52 40-52 80 52 40 52 80" stroke="#48b284" strokeWidth="6" />
        <path d="M66 0c0 40-52 40-52 80s52 40 52 80-52 40-52 80" stroke="#2bbfb3" strokeWidth="6" opacity="0.8" />
        {rungs.map((i) => {
          const y = 14 + i * 26;
          const phase = Math.cos(((y % 80) / 80) * Math.PI * 2);
          const half = Math.abs(phase) * 22;
          return <path key={i} d={`M${40 - half} ${y}h${half * 2}`} stroke="#f7ad2a" strokeWidth="3.5" opacity="0.75" />;
        })}
      </g>
    </svg>
  );
}

/** Kurs muqovalari uchun yengil organik naqsh. */
export function OrganicPattern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.5">
        <circle cx="160" cy="20" r="34" />
        <circle cx="160" cy="20" r="14" />
        <circle cx="30" cy="110" r="26" />
        <path d="M0 60c30-16 60 16 90 0s60 16 110 0" />
        <path d="M0 78c30-16 60 16 90 0s60 16 110 0" strokeOpacity="0.16" />
      </g>
      <g fill="#fff" fillOpacity="0.35">
        <circle cx="110" cy="30" r="3" />
        <circle cx="70" cy="100" r="2.5" />
        <circle cx="185" cy="95" r="2" />
      </g>
    </svg>
  );
}
