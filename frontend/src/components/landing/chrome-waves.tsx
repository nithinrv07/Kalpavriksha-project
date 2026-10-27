const RINGS = Array.from({ length: 30 }, (_, i) => i);

/**
 * Dynamic Living Chromatic Nebula & Chrome Waves.
 * A rich, shifting blend of cosmic violet, emerald teal, warm gold, and celestial cyan
 * that smoothly evolves and breathes behind the scene, encased in deep black atmospheric shading.
 */
export function ChromeWaves() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:strict] transform-gpu">
      {/* 1. Top Right: Celestial Violet → Indigo → Cyan drift */}
      <div className="aurora-drift-1 pointer-events-none absolute -right-[12vmax] -top-[16vmax] size-[88vmax] rounded-full bg-[radial-gradient(closest-side,rgb(168_85_247/0.38),rgb(99_102_241/0.22),rgb(6_182_212/0.16),transparent)]" />

      {/* 2. Left Stage: Blooming Tree Life Aura — Emerald Teal → Jade → Golden Amber */}
      <div
        className="aurora-drift-2 pointer-events-none absolute -left-[14vmax] top-[8vmax] size-[84vmax] rounded-full bg-[radial-gradient(closest-side,rgb(20_184_166/0.32),rgb(16_185_129/0.2),rgb(245_158_11/0.16),transparent)]"
        style={{ animationDelay: "-8s" }}
      />

      {/* 3. Bottom Ambrosia Drift: Warm Kalpavriksha Gold → Rose Fuchsia → Amethyst */}
      <div
        className="aurora-drift-3 pointer-events-none absolute -bottom-[22vmax] left-[15%] size-[92vmax] rounded-full bg-[radial-gradient(closest-side,rgb(245_158_11/0.26),rgb(236_72_153/0.22),rgb(147_51_234/0.18),transparent)]"
        style={{ animationDelay: "-14s" }}
      />

      {/* 4. Central Sacred Luminescence: Ethereal Lavender & Indigo behind Sphere */}
      <div
        className="aurora-drift-1 pointer-events-none absolute left-1/3 top-1/2 size-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(192_132_252/0.26),rgb(147_51_234/0.16),rgb(56_189_248/0.1),transparent_72%)]"
        style={{ animationDelay: "-18s", animationDuration: "36s" }}
      />

      {/* 5. Right Rail Luminescence: Warm Sunset Fuchsia & Peach for Typography */}
      <div
        className="aurora-drift-2 pointer-events-none absolute right-[8%] top-[38%] size-[58vmax] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(244_114_182/0.22),rgb(168_85_247/0.16),rgb(245_158_11/0.12),transparent_70%)]"
        style={{ animationDelay: "-6s" }}
      />

      {/* 6. Sacred Chrome Spiral Ribbons */}
      <div className="waves-scroll pointer-events-none absolute left-1/2 top-1/2 size-[130vmax] -translate-x-1/2 -translate-y-1/2 transform-gpu">
        <div className="spin-slow size-full transform-gpu" style={{ animationDuration: "160s" }}>
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
                <stop offset="0" stopColor="#c084fc" stopOpacity="0" />
                <stop offset="0.5" stopColor="#ec4899" stopOpacity="0.35" />
                <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="origin-center rotate-[-22deg]">
              {/* Outer soft aura rings */}
              <g stroke="url(#chrome-glow)" fill="none" opacity="0.6">
                {RINGS.filter((i) => i % 4 === 0).map((i) => (
                  <ellipse
                    key={`glow-${i}`}
                    rx={230 + i * 32}
                    ry={105 + i * 18}
                    strokeWidth={14}
                    strokeOpacity={0.12}
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

      {/* 7. Deep Black Shading Layers for High Contrast & Obsidian Space Depth */}
      {/* A. Deep black radial vignette from center outwards */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,1,8,0.45)_58%,rgba(0,0,0,0.85)_95%)]" />

      {/* B. Vertical black shading veil from top and bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* C. Bottom floor deep black shadow fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/60 to-transparent" />
    </div>
  );
}
