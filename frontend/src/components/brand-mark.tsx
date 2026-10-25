/** Kalpavriksha tree glyph. Decorative: pair with visible or sr-only text. */
export function BrandMark({ className, strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="8.2" r="4.4" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="7.4" cy="11" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="16.6" cy="11" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 12.5V21M12 16.5l-3-2.5M12 15l2.6-2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8.5 21h7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
