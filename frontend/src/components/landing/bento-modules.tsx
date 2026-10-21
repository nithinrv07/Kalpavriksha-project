"use client";

import { ArrowUpRight, Play, Plus, Sparkle } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useLocale } from "@/components/locale-provider";
import { RevealWords } from "@/components/scroll-fx";
import type { ShapeName } from "@/lib/shapes";
import { MODULES, type KalpaModule } from "@/modules/registry";
import { MovableImage } from "./movable-image";

const FOOTPRINT: Record<KalpaModule["tile"], string> = {
  feature: "md:col-span-2 lg:col-span-2",
  tall: "lg:row-span-2",
  standard: "",
};

const WAVE = Array.from({ length: 72 }, (_, i) => 0.3 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37)) * 0.7);

function Waveform() {
  return (
    <div className="flex items-center gap-5">
      <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-strong bg-white/[0.06] text-text backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
        <Play size={20} weight="fill" />
      </span>
      <div className="flex h-20 flex-1 items-center justify-between gap-[3px] overflow-hidden">
        {WAVE.map((h, i) => (
          <span
            key={i}
            className="max-w-[4px] min-w-[2px] flex-1 rounded-full bg-gradient-to-t from-glow-a to-glow-b"
            style={{ height: `${Math.round(h * 100)}%`, animation: `wave 1.8s ${i * 70}ms ease-in-out infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Fixed precision so server and browser render identical SVG attributes. */
const round = (n: number) => Math.round(n * 100) / 100;

const RADAR_VALUES = [0.92, 0.7, 0.84, 0.58, 0.9, 0.74] as const;
const radarPoint = (i: number, r: number): readonly [number, number] => {
  const a = (Math.PI * 2 * i) / RADAR_VALUES.length - Math.PI / 2;
  return [round(100 + Math.cos(a) * r * 80), round(100 + Math.sin(a) * r * 80)];
};
const polygon = (radii: readonly number[]) => radii.map((r, i) => radarPoint(i, r).join(",")).join(" ");

function Radar() {
  const rings = [0.33, 0.66, 1];
  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto w-full max-w-[260px] transition-transform duration-500 group-hover:scale-[1.04]"
    >
      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--glow-b)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--glow-a)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {rings.map((r) => (
        <polygon key={r} points={polygon(RADAR_VALUES.map(() => r))} fill="none" stroke="var(--line-strong)" />
      ))}
      {RADAR_VALUES.map((_, i) => {
        const [x, y] = radarPoint(i, 1);
        return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="var(--line)" />;
      })}
      <polygon points={polygon(RADAR_VALUES)} fill="url(#radar-fill)" stroke="var(--violet)" strokeWidth="1.5" />
      {RADAR_VALUES.map((v, i) => {
        const [x, y] = radarPoint(i, v);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--violet-ink)" />;
      })}
    </svg>
  );
}

function Chakra() {
  return (
    <svg viewBox="0 0 200 200" className="spin-slow mx-auto w-full max-w-[150px]" style={{ animationDuration: "40s" }}>
      <circle cx="100" cy="100" r="88" fill="none" stroke="var(--violet)" strokeWidth="3" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="var(--line-strong)" />
      <circle cx="100" cy="100" r="12" fill="var(--violet)" />
      {Array.from({ length: 24 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="100"
          x2={round(100 + Math.cos((i * Math.PI) / 12) * 78)}
          y2={round(100 + Math.sin((i * Math.PI) / 12) * 78)}
          stroke="var(--violet)"
          strokeOpacity="0.7"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}

/** Visual keyed by particle shape so future modules pick one without touching this file's logic. */
const VISUALS: Partial<Record<ShapeName, () => ReactNode>> = { play: Waveform, bars: Radar, chakra: Chakra };

export function BentoModules() {
  const { t, locale } = useLocale();
  const gridRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const grid = gridRef.current;
      if (!grid) return;
      grid.style.setProperty("--glow-o", "1");
      for (const tile of grid.querySelectorAll<HTMLElement>(".glow-tile")) {
        const r = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", `${clientX - r.left}px`);
        tile.style.setProperty("--my", `${clientY - r.top}px`);
      }
    });
  };

  return (
    <section id="modules" className="mx-auto w-full max-w-[1320px] scroll-mt-8 px-4 py-24 sm:px-6 lg:py-36">
      <div className="mb-12 grid items-end gap-6 lg:mb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <RevealWords
          text={t.modulesTitle}
          className="font-display text-[clamp(38px,5.4vw,80px)] leading-[0.95] tracking-[-0.045em] text-balance"
        />
        <p data-reveal="up" className="max-w-md text-[15px] leading-relaxed text-muted lg:justify-self-end">
          {t.modulesLead}
        </p>
      </div>

      <div
        ref={gridRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => gridRef.current?.style.setProperty("--glow-o", "0")}
        className="grid gap-3 md:grid-cols-2 lg:auto-rows-[minmax(280px,auto)] lg:grid-cols-3"
      >
        {MODULES.map((m) => {
          const Icon = m.icon;
          const Visual = VISUALS[m.shape];
          const isLearn = m.slug === "learn";

          if (isLearn) {
            return (
              <Link
                key={m.id}
                href={`/m/${m.slug}`}
                data-reveal="scale"
                className={`glow-tile group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-line-strong lg:p-8 ${FOOTPRINT[m.tile]}`}
              >
                {/* 2-column layout matching media_1792597319844_5fe2b8b9.png */}
                <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-[1.05fr_1.15fr] lg:gap-8">
                  {/* Left Column: 01, Waveform, Title + Subtitle */}
                  <div className="flex flex-col justify-between gap-6">
                    <span className="font-mono text-[12px] text-violet">{m.index}</span>

                    <div className="my-auto py-2">
                      <Waveform />
                    </div>

                    <div>
                      <h3 className="font-display text-[clamp(24px,2.4vw,34px)] leading-tight tracking-[-0.03em] text-text">
                        {m.title[locale]}
                      </h3>
                      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">
                        {m.summary[locale]}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Book Icon, Movable Image in exact ratio, Arrow button */}
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex justify-end">
                      <span className="grid size-10 place-items-center rounded-xl bg-violet-deep/60 text-violet-ink">
                        <Icon size={20} weight="duotone" />
                      </span>
                    </div>

                    <div className="my-auto flex items-center justify-center py-1">
                      <MovableImage
                        src="/images/modules/digital-learning.png"
                        alt={m.title[locale]}
                      />
                    </div>

                    <div className="flex justify-end">
                      <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-violet/40 bg-violet-deep text-violet-ink shadow-[0_0_20px_-3px_rgba(124,58,237,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:border-violet group-hover:shadow-[0_0_25px_0_rgba(124,58,237,0.7)]">
                        <Sparkle size={13} weight="fill" className="absolute -left-1 -top-1 text-violet-ink/90 animate-pulse" />
                        <ArrowUpRight size={18} aria-label={t.open} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={m.id}
              href={`/m/${m.slug}`}
              data-reveal="scale"
              className={`glow-tile group flex flex-col justify-between gap-10 overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-line-strong lg:p-8 ${FOOTPRINT[m.tile]}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-violet">{m.index}</span>
                <span className="grid size-10 place-items-center rounded-xl bg-violet-deep/60 text-violet-ink">
                  <Icon size={20} weight="duotone" />
                </span>
              </div>
              {m.slug === "grow" ? (
                <div className="my-auto flex items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.2),rgba(45,212,191,0.08),transparent_70%)] blur-2xl"
                    />
                    <Image
                      src="/images/modules/tree-growth.png"
                      alt={m.title[locale]}
                      width={399}
                      height={416}
                      draggable={false}
                      className="relative z-10 h-auto w-full max-w-[200px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105 sm:max-w-[240px] lg:max-w-[260px]"
                    />
                  </div>
                </div>
              ) : m.slug === "gk-songs" ? (
                <div className="my-auto flex items-center justify-center py-2">
                  <div className="relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7),0_0_25px_-5px_rgba(124,58,237,0.25)] transition-all duration-300 group-hover:border-violet/40 group-hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(251,191,36,0.2)]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.14),rgba(124,58,237,0.18),transparent_70%)] blur-xl"
                    />
                    <Image
                      src="/images/modules/gk-songs.jpg"
                      alt={m.title[locale]}
                      width={848}
                      height={480}
                      draggable={false}
                      className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Subtle highlight sheen */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent"
                    />
                  </div>
                </div>
              ) : (
                Visual && <Visual />
              )}
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h3 className="font-display text-[clamp(22px,2.2vw,32px)] leading-tight tracking-[-0.03em]">
                    {m.title[locale]}
                  </h3>
                  <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">{m.summary[locale]}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-violet/50 group-hover:bg-violet-deep group-hover:text-violet-ink">
                  <ArrowUpRight size={16} aria-label={t.open} />
                </span>
              </div>
            </Link>
          );
        })}

        {/* Placeholder that shows the app is built to grow. */}
        <div
          data-reveal="scale"
          className="glow-tile relative flex flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-surface/40 p-6 lg:p-8"
        >
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
            <rect
              width="100%"
              height="100%"
              rx="24"
              fill="none"
              stroke="var(--line-strong)"
              strokeWidth="2"
              strokeDasharray="6 6"
              style={{ animation: "dash-flow 1.6s linear infinite" }}
            />
          </svg>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] text-muted">04</span>
            <span className="grid size-10 place-items-center rounded-xl border border-dashed border-line-strong text-muted">
              <Plus size={18} />
            </span>
          </div>
          <span
            aria-hidden
            className="font-display text-[clamp(72px,8vw,120px)] leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)]"
          >
            04
          </span>
          <div>
            <h3 className="font-display text-[clamp(20px,2vw,26px)] leading-tight tracking-[-0.03em]">{t.soonTitle}</h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">{t.soonBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
