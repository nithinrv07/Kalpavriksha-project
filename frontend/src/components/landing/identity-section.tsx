"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import { RevealWords } from "@/components/scroll-fx";
import { MODULES } from "@/modules/registry";

/**
 * Node positions in a 100×100 space for the 3 learning modules:
 * - Module 1: Digital Learning (Top-Left)
 * - Module 2: Holistic Growth (Top-Right)
 * - Module 3: GK & Patriotic Songs (Bottom-Center)
 */
const THREE_NODES = [
  { x: 18, y: 22, cx: 32, cy: 42, moduleSlug: "learn" },
  { x: 82, y: 22, cx: 68, cy: 42, moduleSlug: "grow" },
  { x: 50, y: 85, cx: 54, cy: 68, moduleSlug: "gk-songs" },
] as const;

interface IdentitySectionProps {
  scrollProgress?: number;
}

export function IdentitySection({ scrollProgress }: IdentitySectionProps) {
  const { t, locale } = useLocale();

  return (
    <section className="mx-auto grid w-full max-w-[1320px] items-center gap-14 px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-[0.85fr_1.15fr] lg:pt-24 lg:pb-24">
      <div>
        <p className="font-mono text-[12px] font-semibold text-violet">
          — {t.identityCenter}
        </p>
        <RevealWords
          text={t.identityTitle}
          className="mt-5 font-display text-[clamp(36px,4.8vw,72px)] leading-[0.95] tracking-[-0.045em] text-balance text-text"
        />
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
          {t.identityBody}
        </p>
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px]">
        {/* Animated Light Beams SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full pointer-events-none"
        >
          <defs>
            <linearGradient id="beam-pulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {THREE_NODES.map((n, i) => {
            const d = `M ${n.x} ${n.y} Q ${n.cx} ${n.cy} 50 50`;
            return (
              <g key={i}>
                {/* Base track line */}
                <path
                  d={d}
                  fill="none"
                  stroke="var(--line-strong)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                  className="opacity-70"
                />
                {/* Traveling beam of light */}
                <path
                  d={d}
                  fill="none"
                  stroke="url(#beam-pulse)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="20 80"
                  style={{ animation: `beam-travel 3.2s ${i * 0.9}s cubic-bezier(0.16,1,0.3,1) infinite` }}
                />
              </g>
            );
          })}
        </svg>

        {/* Center Student Avatar Profile */}
        <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <Link
            href="/sign-in"
            className="group relative grid size-24 sm:size-28 place-items-center overflow-hidden rounded-full border-2 border-purple-400/60 bg-gradient-to-br from-purple-900/60 via-purple-950/80 to-[#120824] shadow-[0_0_30px_rgba(168,85,247,0.35)] transition-transform duration-300 hover:scale-105"
            title="View Student Profile"
          >
            <Image
              src="/images/student-avatar.png"
              alt={t.identityCenter}
              width={600}
              height={945}
              priority
              className="h-full w-full object-contain p-2.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110 sm:p-3"
            />
          </Link>
          <span className="whitespace-nowrap rounded-full border border-purple-400/30 bg-surface/90 px-3.5 py-1 font-mono text-[11px] font-semibold text-text shadow-md backdrop-blur-md">
            {t.identityCenter}
          </span>
        </div>

        {/* Three Branching Modules */}
        {MODULES.map((m, i) => {
          const n = THREE_NODES[i];
          if (!n) return null;
          const ModIcon = m.icon;
          return (
            <Link
              key={m.id}
              href={`/m/${m.slug}`}
              className="group absolute z-30 flex max-w-[10rem] sm:max-w-[12rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center transition-all duration-300 hover:scale-105"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              title={`Enter ${m.title[locale]}`}
            >
              {/* Module Icon Card */}
              <div className="relative grid size-14 sm:size-16 place-items-center rounded-2xl border-2 border-purple-400/40 bg-surface-2/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.4)]">
                {m.iconImage ? (
                  <Image
                    src={m.iconImage}
                    alt={m.title[locale]}
                    width={56}
                    height={56}
                    className="h-full w-full rounded-xl object-contain drop-shadow-sm"
                  />
                ) : (
                  <ModIcon size={26} weight="duotone" className="text-purple-400" />
                )}
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-purple-600 px-1.5 py-0.2 font-mono text-[9px] font-bold text-white shadow-sm">
                  {m.index}
                </span>
              </div>

              {/* Module Name */}
              <div className="flex flex-col items-center">
                <span className="font-display text-[12.5px] sm:text-[14px] font-bold text-text leading-tight group-hover:text-purple-400 transition-colors drop-shadow-sm">
                  {m.title[locale]}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  Module {m.index}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
