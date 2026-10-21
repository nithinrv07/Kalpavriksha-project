/** Fixed precision so server and browser render identical style strings. */
const round = (n: number) => Math.round(n * 10) / 10;

const COLORS = ["var(--glow-b)", "var(--amber)", "var(--teal)", "var(--pink)", "var(--violet-ink)"];
const SPARKS = Array.from({ length: 18 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 18;
  const dist = 46 + (i % 3) * 18;
  return { dx: round(Math.cos(angle) * dist), dy: round(Math.sin(angle) * dist), color: COLORS[i % COLORS.length] };
});

/**
 * Confetti-style spark ring. Remount it (change `key`) to replay.
 * Purely decorative; reduced-motion users get the global animation kill-switch.
 */
export function Burst({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute left-1/2 top-1/2 ${className}`}>
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="burst-spark absolute size-2 rounded-full"
          style={
            {
              background: s.color,
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
              animationDelay: `${(i % 4) * 25}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
