const RINGS = Array.from({ length: 30 }, (_, i) => i);

/**
 * Fixed chrome spiral behind the whole page (decorative, pure SVG).
 * The SVG itself is static; rotation happens on GPU-composited wrappers:
 * a slow perpetual spin plus an extra turn driven by page scroll (`--scroll`).
 */
export function ChromeWaves() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Drifting violet glows. */}
      <div className="glow-drift absolute -right-[20vmax] -top-[25vmax] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.28),transparent)]" />
      <div
        className="glow-drift absolute -bottom-[30vmax] -left-[20vmax] size-[80vmax] rounded-full bg-[radial-gradient(closest-side,rgb(76_29_149/0.35),transparent)]"
        style={{ animationDelay: "-12s", animationDuration: "34s" }}
      />

      <div className="waves-scroll absolute left-1/2 top-1/2 will-change-transform size-[170vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="spin-slow size-full will-change-transform" style={{ animationDuration: "160s" }}>
          <svg viewBox="-1100 -1100 2200 2200" className="size-full">
            <defs>
              <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.3" stopColor="#fff" stopOpacity="0.6" />
                <stop offset="0.48" stopColor="#56545f" stopOpacity="0.15" />
                <stop offset="0.66" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chrome-glow" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c084fc" stopOpacity="0" />
                <stop offset="0.4" stopColor="#a78bfa" />
                <stop offset="0.7" stopColor="#7c3aed" stopOpacity="0.6" />
                <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
              <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>
            <g transform="rotate(-22)">
              {/* Violet halo behind the brightest ribbons. */}
              <g filter="url(#soft-glow)" opacity="0.55">
                {RINGS.filter((i) => i % 5 === 0).map((i) => (
                  <ellipse
                    key={i}
                    rx={200 + i * 30}
                    ry={92 + i * 17}
                    fill="none"
                    stroke="url(#chrome-glow)"
                    strokeWidth="14"
                  />
                ))}
              </g>
              {RINGS.map((i) => (
                <ellipse
                  key={i}
                  rx={200 + i * 30}
                  ry={92 + i * 17}
                  fill="none"
                  stroke="url(#chrome)"
                  strokeWidth={i % 5 === 0 ? 7 : i % 2 === 0 ? 1.8 : 0.9}
                  strokeOpacity={0.35 + (i % 4) * 0.15}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Vignette keeps text readable over the ribbons. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(5_5_7/0.85)_90%)]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
