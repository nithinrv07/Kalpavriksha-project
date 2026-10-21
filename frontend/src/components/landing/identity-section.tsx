"use client";

import { Plus, UserCircle } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { RevealWords } from "@/components/scroll-fx";
import { MODULES } from "@/modules/registry";

/** Node positions in a 100×100 space; the student profile sits at the centre. */
const NODES = [
  { x: 16, y: 18, cx: 30, cy: 46 },
  { x: 84, y: 20, cx: 70, cy: 44 },
  { x: 18, y: 84, cx: 34, cy: 56 },
  { x: 84, y: 82, cx: 66, cy: 58 },
] as const;

/**
 * "Enter once, use everywhere": beams of light travel from each module into
 * the shared student profile. Adapted from 21st.dev's Animated Beam, CSS-only.
 */
export function IdentitySection() {
  const { t, locale } = useLocale();
  const items = [
    ...MODULES.map((m) => ({ key: m.id, label: m.title[locale], Icon: m.icon, future: false })),
    { key: "future", label: t.soonTitle, Icon: Plus, future: true },
  ];

  return (
    <section className="mx-auto grid w-full max-w-[1320px] items-center gap-14 border-t border-line px-4 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-14 lg:grid-cols-[0.85fr_1.15fr] lg:pt-28 lg:pb-16">
      <div>
        <p data-reveal="up" className="font-mono text-[12px] text-violet">
          — {t.identityCenter}
        </p>
        <RevealWords
          text={t.identityTitle}
          className="mt-5 font-display text-[clamp(36px,4.8vw,72px)] leading-[0.95] tracking-[-0.045em] text-balance"
        />
        <p data-reveal="up" className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
          {t.identityBody}
        </p>
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          data-reveal="up"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--glow-a)" stopOpacity="0" />
              <stop offset="0.5" stopColor="var(--glow-b)" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
          </defs>
          {NODES.map((n, i) => {
            const d = `M ${n.x} ${n.y} Q ${n.cx} ${n.cy} 50 50`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path
                  d={d}
                  fill="none"
                  stroke={i === 3 ? "var(--line-strong)" : "url(#beam)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="16 84"
                  style={{ animation: `beam-travel 3.2s ${i * 0.8}s cubic-bezier(0.16,1,0.3,1) infinite` }}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span
            data-reveal="pop"
            className="relative grid size-24 place-items-center rounded-full border border-violet/40 bg-violet-deep text-violet-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_0_0_10px_rgb(59_7_100/0.25)] sm:size-28"
          >
            <UserCircle size={44} weight="duotone" />
          </span>
          <span className="whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] text-text">
            {t.identityCenter}
          </span>
        </div>

        {items.map(({ key, label, Icon, future }, i) => {
          const n = NODES[i];
          if (!n) return null;
          return (
            <div
              key={key}
              className={`absolute flex max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center sm:max-w-[11rem] ${future ? "text-muted" : "text-text"}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span
                data-reveal="pop"
                className={`grid size-12 place-items-center rounded-2xl sm:size-14 ${
                  future
                    ? "border border-dashed border-line-strong bg-surface"
                    : "border border-line-strong bg-surface-2 text-violet-ink"
                }`}
              >
                <Icon size={22} weight="duotone" />
              </span>
              <span className="text-[12px] leading-snug sm:text-[13px]">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
