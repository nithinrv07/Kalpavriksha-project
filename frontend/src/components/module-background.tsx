import type { AccentKey } from "@/modules/accents";

interface ModuleBackgroundProps {
  accent: AccentKey;
}

/**
 * Module-Specific Cosmic Aura Background.
 * Renders an adaptive, living chromatic nebula tailored to each module:
 * - Violet / Indigo: Digital Learning
 * - Emerald / Teal: Holistic Growth
 * - Sacred Amber / Rose: GK & Patriotic Songs
 *
 * Fully supports both Dark Mode (deep cosmic obsidian) and Light Mode (luminous pearl & pastel aura).
 */
export function ModuleBackground({ accent }: ModuleBackgroundProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict] transform-gpu"
    >
      {/* ========================================================================= */}
      {/* 1. Base Gradient Canvas per Module                                        */}
      {/* ========================================================================= */}
      {accent === "violet" && (
        <>
          {/* Dark Mode Base */}
          <div className="module-dark-shade absolute inset-0 bg-[#06020e] bg-[radial-gradient(circle_at_50%_0%,#16062f_0%,#090315_42%,#040108_75%,#000000_100%)]" />
          {/* Light Mode Base */}
          <div className="module-light-shade absolute inset-0 bg-[#f8f5fd] bg-[radial-gradient(circle_at_50%_0%,#ede3fb_0%,#f6f1fc_38%,#faf7fe_70%,#ffffff_100%)]" />

          {/* Living Drifting Auroras — Cosmic Violet & Lavender */}
          <div className="aurora-drift-1 absolute -right-[12vmax] -top-[16vmax] size-[86vmax] rounded-full bg-[radial-gradient(closest-side,rgb(168_85_247/0.32),rgb(99_102_241/0.18),transparent)] dark:opacity-100 opacity-60" />
          <div
            className="aurora-drift-2 absolute -left-[14vmax] top-[10vmax] size-[82vmax] rounded-full bg-[radial-gradient(closest-side,rgb(192_132_252/0.24),rgb(147_51_234/0.14),transparent)] dark:opacity-100 opacity-60"
            style={{ animationDelay: "-8s" }}
          />
          <div
            className="aurora-drift-3 absolute -bottom-[20vmax] left-[20%] size-[88vmax] rounded-full bg-[radial-gradient(closest-side,rgb(236_72_153/0.18),rgb(124_58_237/0.12),transparent)] dark:opacity-100 opacity-50"
            style={{ animationDelay: "-14s" }}
          />
        </>
      )}

      {accent === "teal" && (
        <>
          {/* Dark Mode Base */}
          <div className="module-dark-shade absolute inset-0 bg-[#010908] bg-[radial-gradient(circle_at_50%_0%,#031c18_0%,#010e0b_42%,#010504_75%,#000000_100%)]" />
          {/* Light Mode Base */}
          <div className="module-light-shade absolute inset-0 bg-[#f4fcf9] bg-[radial-gradient(circle_at_50%_0%,#e1f7f0_0%,#f1faf6_38%,#f8fdfb_70%,#ffffff_100%)]" />

          {/* Living Drifting Auroras — Emerald Jade & Celestial Seafoam */}
          <div className="aurora-drift-1 absolute -right-[12vmax] -top-[16vmax] size-[86vmax] rounded-full bg-[radial-gradient(closest-side,rgb(20_184_166/0.30),rgb(16_185_129/0.18),transparent)] dark:opacity-100 opacity-65" />
          <div
            className="aurora-drift-2 absolute -left-[14vmax] top-[10vmax] size-[82vmax] rounded-full bg-[radial-gradient(closest-side,rgb(6_182_212/0.22),rgb(45_212_191/0.14),transparent)] dark:opacity-100 opacity-60"
            style={{ animationDelay: "-8s" }}
          />
          <div
            className="aurora-drift-3 absolute -bottom-[20vmax] left-[20%] size-[88vmax] rounded-full bg-[radial-gradient(closest-side,rgb(52_211_153/0.20),rgb(13_148_136/0.12),transparent)] dark:opacity-100 opacity-50"
            style={{ animationDelay: "-14s" }}
          />
        </>
      )}

      {accent === "amber" && (
        <>
          {/* Dark Mode Base */}
          <div className="module-dark-shade absolute inset-0 bg-[#090403] bg-[radial-gradient(circle_at_50%_0%,#1e0d06_0%,#0d0502_42%,#040101_75%,#000000_100%)]" />
          {/* Light Mode Base */}
          <div className="module-light-shade absolute inset-0 bg-[#fefaf4] bg-[radial-gradient(circle_at_50%_0%,#fcedd8_0%,#fbf5ec_38%,#fdfaf5_70%,#ffffff_100%)]" />

          {/* Living Drifting Auroras — Sacred Saffron Gold & Dawn Coral */}
          <div className="aurora-drift-1 absolute -right-[12vmax] -top-[16vmax] size-[86vmax] rounded-full bg-[radial-gradient(closest-side,rgb(245_158_11/0.28),rgb(234_88_12/0.16),transparent)] dark:opacity-100 opacity-65" />
          <div
            className="aurora-drift-2 absolute -left-[14vmax] top-[10vmax] size-[82vmax] rounded-full bg-[radial-gradient(closest-side,rgb(251_191_36/0.22),rgb(244_63_94/0.12),transparent)] dark:opacity-100 opacity-60"
            style={{ animationDelay: "-8s" }}
          />
          <div
            className="aurora-drift-3 absolute -bottom-[20vmax] left-[20%] size-[88vmax] rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.18),rgb(180_83_9/0.12),transparent)] dark:opacity-100 opacity-50"
            style={{ animationDelay: "-14s" }}
          />
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. Atmospheric Depth & Shading Layers                                      */}
      {/* ========================================================================= */}
      {/* Dark Mode Atmospheric Vignette */}
      <div className="module-dark-shade absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.92)_100%)]" />
      <div className="module-dark-shade absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      <div className="module-dark-shade absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/75 to-transparent" />

      {/* Light Mode Soft Pearl Ambient Veil */}
      <div className="module-light-shade absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      <div className="module-light-shade absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/70" />
    </div>
  );
}
