/**
 * Plain fixed background behind the whole page (decorative): soft violet and
 * fuchsia glows only, no rings, so the foreground stays the focus.
 */
export function ChromeWaves() {
  return (
    <div aria-hidden className="page-glows pointer-events-none fixed inset-0 z-0 overflow-hidden">
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

      {/* Subtle edge vignette (soft, non-darkening, ensures foreground contrast without making the scene dim) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(8_4_16/0.4)_92%)]" />
      <div className="grain absolute inset-0 opacity-10" />
    </div>
  );
}
