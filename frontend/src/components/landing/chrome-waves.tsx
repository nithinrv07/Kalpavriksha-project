const RINGS = Array.from({ length: 30 }, (_, i) => i);

/**
 * Fixed chrome spiral behind the whole page (decorative, pure SVG).
 * Delicate, luminous liquid-chrome ribbons with vibrant atmospheric violet & fuchsia glows.
 * Tuned with high vibrancy and luminous nebulae so the entire page is bright and radiant.
 */
export function ChromeWaves() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Radiant atmospheric violet and fuchsia nebula drifts */}
      <div className="glow-drift absolute -right-[10vmax] -top-[15vmax] size-[85vmax] rounded-full bg-[radial-gradient(closest-side,rgb(168_85_247/0.42),rgb(124_58_237/0.22),transparent)]" />
      <div
        className="glow-drift absolute -bottom-[20vmax] -left-[10vmax] size-[90vmax] rounded-full bg-[radial-gradient(closest-side,rgb(217_70_239/0.38),rgb(147_51_234/0.25),transparent)]"
        style={{ animationDelay: "-12s", animationDuration: "34s" }}
      />
      {/* Central ambient glow behind the sphere & tree */}
      <div className="absolute left-1/3 top-1/2 size-[90vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(192_132_252/0.32),rgb(147_51_234/0.18),rgb(99_102_241/0.1),transparent_70%)]" />

      {/* Right side ambient luminescence for hero typography */}
      <div className="absolute right-[10%] top-[40%] size-[60vmax] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(168_85_247/0.28),rgb(217_70_239/0.15),transparent_70%)]" />

      <div className="waves-scroll will-change-transform absolute left-1/2 top-1/2 size-[170vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="spin-slow will-change-transform size-full" style={{ animationDuration: "160s" }}>
          <svg viewBox="-1100 -1100 2200 2200" className="size-full">
            <defs>
              <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.3" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="0.48" stopColor="#d8b4fe" stopOpacity="0.45" />
                <stop offset="0.66" stopColor="#fff" stopOpacity="0.75" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chrome-glow" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e879f9" stopOpacity="0" />
                <stop offset="0.4" stopColor="#c084fc" stopOpacity="0.85" />
                <stop offset="0.7" stopColor="#a855f7" stopOpacity="0.65" />
                <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
              <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>
            <g transform="rotate(-22)">
              {/* Radiant violet-fuchsia halo behind the brightest ribbons */}
              <g filter="url(#soft-glow)" opacity="0.85">
                {RINGS.filter((i) => i % 4 === 0).map((i) => (
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
                  strokeWidth={i % 5 === 0 ? 5.5 : i % 2 === 0 ? 2 : 1}
                  strokeOpacity={0.45 + (i % 4) * 0.12}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Subtle edge vignette (soft, non-darkening, ensures foreground contrast without making the scene dim) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(8_4_16/0.4)_92%)]" />
      <div className="grain absolute inset-0 opacity-10" />
    </div>
  );
}
