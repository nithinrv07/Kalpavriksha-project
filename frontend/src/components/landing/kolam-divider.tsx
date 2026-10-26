"use client";

/**
 * Quiet cultural touches between the module cards and the shared-profile
 * section: a kolam lattice drawn from interlocking rings and dotted grid,
 * with a small Pongal pot and a sugarcane-and-parrot pair as harvest cameos.
 * Purely decorative, so the whole band is hidden from assistive tech.
 */

const CLAY = "#e2a06a";

/** Eight-petal kolam rosette, drawn once in the middle of the band. */
function KolamRosette() {
  return (
    <g transform="translate(600 80)">
      <circle r="62" fill="url(#kolam-glow)" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-29"
          rx="5.5"
          ry="12"
          transform={`rotate(${i * 45})`}
          fill="var(--violet)"
          fillOpacity="0.09"
          stroke="var(--violet)"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
      ))}
      <circle r="40" fill="none" stroke="var(--violet)" strokeOpacity="0.28" strokeDasharray="2 6" />
      <circle r="18" fill="none" stroke="var(--violet)" strokeOpacity="0.42" />
      <circle r="9" fill="var(--violet-deep)" fillOpacity="0.5" />
      <circle r="2.6" fill="var(--amber)" fillOpacity="0.8" />
      {[
        [0, -51],
        [51, 0],
        [0, 51],
        [-51, 0],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill="var(--amber)" fillOpacity="0.5" />
      ))}
    </g>
  );
}

/** Clay pot with pongal bubbling over, the harvest marker of the frieze. */
function PongalPot() {
  return (
    <g transform="translate(170 98)">
      {[
        "M-11 -4 C-17 -12, -5 -16, -11 -28",
        "M0 -6 C-6 -14, 6 -18, 0 -30",
        "M11 -4 C5 -12, 17 -16, 11 -28",
      ].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={CLAY}
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      {[
        [-14, -2],
        [0, -4],
        [14, -2],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill={CLAY} fillOpacity="0.45" />
      ))}
      <path
        d="M-26 0 C-26 20, -18 36, 0 36 C18 36, 26 20, 26 0 Z"
        fill={CLAY}
        fillOpacity="0.08"
        stroke={CLAY}
        strokeOpacity="0.55"
        strokeWidth="1.6"
      />
      <path d="M-22.5 11 C-14 16, 14 16, 22.5 11" fill="none" stroke={CLAY} strokeOpacity="0.3" strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="26" ry="4.5" fill="none" stroke={CLAY} strokeOpacity="0.55" strokeWidth="1.6" />
      <ellipse cx="0" cy="0" rx="19" ry="3" fill="none" stroke={CLAY} strokeOpacity="0.28" strokeWidth="1" />
      <path d="M-10 36 L10 36" stroke={CLAY} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** Parrot resting on a cane leaf. Feet sit at the local origin. */
function Parrot({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? " scale(-0.92 0.92)" : ""}`}>
      {/* tail feathers hanging behind the perch */}
      <path
        d="M-4 1 C-9 6, -11 11, -8 16"
        fill="none"
        stroke="var(--teal)"
        strokeOpacity="0.55"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M-1 1 C-2 7, 0 11, 4 14"
        fill="none"
        stroke="var(--teal)"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* body and head */}
      <path
        d="M-5 1 C-8 -5, -6 -12, 0 -15 C7 -18, 12 -13, 12 -7 C12 -2, 8 2, 3 2 Z"
        fill="var(--teal)"
        fillOpacity="0.2"
        stroke="var(--teal)"
        strokeOpacity="0.65"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="-18"
        r="4.6"
        fill="var(--teal)"
        fillOpacity="0.22"
        stroke="var(--teal)"
        strokeOpacity="0.65"
        strokeWidth="1.2"
      />
      <path d="M12 -19.5 C16 -19, 16 -15, 12 -14.5 Z" fill="var(--amber)" fillOpacity="0.65" />
      <circle cx="9.3" cy="-19.2" r="0.9" fill="var(--amber)" />
      {/* wing */}
      <path
        d="M-2 -10 C3 -11, 6 -6, 3 -2 C0 -5, -2 -7, -2 -10 Z"
        fill="var(--teal)"
        fillOpacity="0.28"
      />
      {/* feet gripping the leaf */}
      <path
        d="M-1 2 L-1 0 M3 2 L3 0"
        stroke="var(--teal)"
        strokeOpacity="0.6"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}

/** One cane blade: a lens shape rooted at the stalk, rotated outward. */
function Leaf({ x, y, angle, length, width }: { x: number; y: number; angle: number; length: number; width: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${length / 34} ${width / 12})`}>
      <path
        d="M0 0 C9 -6, 26 -6, 34 0 C26 6, 9 6, 0 0 Z"
        fill="var(--teal)"
        fillOpacity="0.14"
        stroke="var(--teal)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M2 0 L31 0" stroke="var(--teal)" strokeOpacity="0.26" strokeWidth="0.8" />
    </g>
  );
}

/** Two canes with arching blades and a pair of parrots perched at the tips. */
function Sugarcane() {
  return (
    <g transform="translate(1030 136)">
      {[
        "M-16 0 C-20 -30, -26 -58, -34 -86",
        "M8 0 C10 -30, 16 -58, 26 -84",
      ].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="var(--teal)"
          strokeOpacity="0.5"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      {[
        "M-17.5 -22 L-12.4 -23.2",
        "M-21 -44 L-15.8 -45.2",
        "M-25 -62 L-19.8 -63.2",
        "M9.5 -22 L14.6 -23.2",
        "M13 -44 L18.2 -45.2",
        "M17 -62 L22.2 -63.2",
      ].map((d) => (
        <path key={d} d={d} stroke="var(--teal)" strokeOpacity="0.35" strokeWidth="1.1" strokeLinecap="round" />
      ))}
      {/* Blades arch out and droop along each cane. */}
      <Leaf x={-20} y={-40} angle={150} length={27} width={10} />
      <Leaf x={-26} y={-60} angle={166} length={31} width={11} />
      <Leaf x={-32} y={-78} angle={206} length={28} width={10} />
      <Leaf x={-18} y={-52} angle={-25} length={24} width={9} />
      <Leaf x={14} y={-40} angle={30} length={27} width={10} />
      <Leaf x={20} y={-60} angle={14} length={31} width={11} />
      <Leaf x={26} y={-78} angle={-26} length={28} width={10} />
      <Leaf x={8} y={-52} angle={205} length={24} width={9} />
      <Parrot x={-33} y={-86} />
      <Parrot x={25} y={-84} flip />
    </g>
  );
}

export function KolamDivider() {
  return (
    <div aria-hidden className="relative mx-auto -mt-8 mb-2 w-full max-w-[1360px] px-4 sm:-mt-12 sm:mb-4 sm:px-6 lg:-mt-16 lg:px-8">
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        className="h-[96px] w-full sm:h-[112px] lg:h-[132px]"
      >
        <defs>
          <pattern id="kolam-tile" width="64" height="64" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="var(--violet)" strokeOpacity="0.1" strokeWidth="1.1">
              <circle cx="16" cy="16" r="15" />
              <circle cx="48" cy="16" r="15" />
              <circle cx="16" cy="48" r="15" />
              <circle cx="48" cy="48" r="15" />
            </g>
            {[
              [16, 16],
              [48, 16],
              [16, 48],
              [48, 48],
              [32, 32],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i === 4 ? 1.1 : 1.5} fill="var(--amber)" fillOpacity={i === 4 ? 0.22 : 0.32} />
            ))}
          </pattern>
          <linearGradient id="kolam-fade" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.16" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.84" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="kolam-mask">
            <rect width="1200" height="160" fill="url(#kolam-fade)" />
          </mask>
          <radialGradient id="kolam-glow">
            <stop offset="0" stopColor="var(--violet)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--violet)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g mask="url(#kolam-mask)">
          <rect width="1200" height="160" fill="url(#kolam-tile)" />
        </g>

        <KolamRosette />
        {/* Side cameos only where there is room; phones keep the rosette. */}
        <g className="hidden lg:block">
          <PongalPot />
          <Sugarcane />
        </g>
      </svg>
    </div>
  );
}
