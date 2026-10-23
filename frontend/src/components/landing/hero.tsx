"use client";

import { ArrowDown, ArrowsClockwise, DotsNine } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { ParticleCanvas } from "@/components/particle-canvas";
import { FlipCard } from "@/components/flip-card";
import { PulsatingBorder } from "@/components/pulsating-border";
import { SparkleButton } from "@/components/sparkle-button";
import { SphereGallery3D } from "@/components/sphere-gallery-3d";
import type { ShapeName } from "@/lib/shapes";
import { MODULES } from "@/modules/registry";
import { LangSelect } from "./lang-select";
import { MenuSheet } from "./menu-sheet";

const CYCLE_MS = 5200;
const INTRO_MS = 1100;
/** -1 = home state (the Kalpavriksha tree); 0..n = module index. */
type Slot = number;

const STAT_POSITIONS = [
  "left-[8%] top-[10%]",
  "right-[6%] top-[16%]",
  "left-[4%] bottom-[14%]",
  "right-[10%] bottom-[8%]",
] as const;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero() {
  const { t, locale } = useLocale();
  const [introDone, setIntroDone] = useState(false);
  const [slot, setSlot] = useState<Slot>(-1);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setIntroDone(true), prefersReducedMotion() ? 0 : INTRO_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Auto-cycle home → module 1 → 2 → 3 → home while nobody is interacting.
  useEffect(() => {
    if (!introDone || hovering || isFlipped || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setSlot((s) => (s + 1 >= MODULES.length ? -1 : s + 1)), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [introDone, hovering, slot, isFlipped]);

  useEffect(() => {
    if (!isFlipped) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFlipped(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFlipped]);

  const shape: ShapeName = !introDone ? "ring" : slot < 0 ? "tree" : (MODULES[slot]?.shape ?? "tree");
  const [line1, line2] = t.headline;

  return (
    <section
      data-hero
      className="relative isolate flex min-h-[100dvh] items-center px-2 py-2 sm:px-4 sm:py-4 lg:px-12 lg:py-10"
    >
      <div className="hero-frame fade-up relative mx-auto w-full max-w-[1240px] min-h-[720px] sm:min-h-[700px] lg:h-[min(820px,calc(100dvh-5rem))] lg:min-h-[640px]">
        <FlipCard
          flipped={isFlipped}
          onFlip={setIsFlipped}
          width="100%"
          
          height="100%"
          radius={28}
          background="transparent"
          shadow={false}
          className="h-full w-full"
          ariaLabel="Kalpavriksha hero frame"
          front={
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface/95 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.85),0_0_90px_-25px_rgb(124_58_237/0.45),inset_0_1px_0_rgb(255_255_255/0.05)] lg:block lg:rounded-[28px]">
              {/* Pulsating border glow around the hero frame */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
                <PulsatingBorder colors={["#000000", "#ffffff", "#a855f7"]} thickness={0.35} />
              </div>
        {/* Top bar — flows on mobile, pinned on desktop. */}
        <div className="z-20 flex items-center justify-between gap-3 p-3 sm:p-4 lg:absolute lg:inset-x-6 lg:top-6 lg:justify-end lg:p-0">
          <span className="flex items-center gap-2 font-display text-lg tracking-tight lg:hidden">
            <BrandMark className="size-6 text-violet" />
            Kalpavriksha
          </span>
          <div className="flex items-center gap-2">
            <LangSelect />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white/[0.06] px-3.5 font-mono text-[13px] text-text transition-colors duration-200 hover:border-violet/40 hover:bg-violet-deep hover:text-violet-ink active:scale-[0.98]"
              title="Explore 3D Sphere Gallery"
            >
              <ArrowsClockwise size={15} />
              <span className="hidden sm:inline">3D Gallery</span>
            </button>
            <Link
              href="/sign-in"
              className="hidden h-11 items-center rounded-xl border border-violet/25 bg-violet-deep px-5 font-mono text-[13px] text-violet-ink transition-colors duration-200 hover:bg-[#4c1d95] active:scale-[0.98] sm:flex"
            >
              {t.signIn}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.menu}
              className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.06] lg:hidden"
            >
              <DotsNine size={18} />
            </button>
          </div>
        </div>

        {/* Desktop rail: menu pill + vertical wordmark. */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t.menu}
          className="group absolute left-6 top-6 z-20 hidden flex-col items-center gap-3 rounded-2xl border border-line bg-white/[0.04] p-1.5 pb-3 transition-colors duration-200 hover:bg-white/[0.08] lg:flex"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-white/[0.08] text-text transition-colors duration-200 group-hover:text-violet">
            <BrandMark className="size-5" />
          </span>
          {/* Sideways text only reads well in Latin script; other locales rely on the icon + aria-label. */}
          {locale === "en" && (
            <span aria-hidden className="font-mono text-[11px] tracking-wide text-muted [writing-mode:vertical-rl]">
              {t.menu}
            </span>
          )}
          <DotsNine size={14} className="text-muted" aria-hidden />
        </button>
        <p
          aria-hidden
          className="absolute bottom-8 left-5 z-10 hidden rotate-180 font-display text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.04em] text-text/85 [writing-mode:vertical-rl] lg:block"
        >
          Kalpavriksha
        </p>

        {/* Particle stage. */}
        <div className="hero-stage relative mx-auto aspect-square w-full max-w-[560px] lg:absolute lg:bottom-28 lg:left-[9%] lg:top-0 lg:aspect-auto lg:w-[54%] lg:max-w-none">
          <ParticleCanvas shape={shape} className="absolute inset-0 h-full w-full" />
          {t.stats.map((stat, i) => (
            <div
              key={i}
              className={`fade-up absolute ${STAT_POSITIONS[i] ?? ""} text-center`}
              style={{ animationDelay: `${900 + i * 120}ms` }}
            >
              <span className="block font-mono text-[13px] text-text">{stat.value}</span>
              <span className="block max-w-[9rem] font-mono text-[10px] leading-tight text-muted">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Eyebrow, left of the cloud (desktop). */}
        <p
          className="fade-up absolute left-[10%] top-[20%] z-10 hidden max-w-[210px] text-right text-[13px] leading-snug text-violet lg:block"
          style={{ animationDelay: "700ms" }}
        >
          {t.eyebrow}
        </p>

        {/* Copy block. */}
        <div className="hero-copy relative z-10 px-5 pb-2 sm:px-8 lg:absolute lg:right-10 lg:top-[27%] lg:w-[44%] lg:p-0 lg:text-right [container-type:inline-size]">
          <p className="fade-up font-mono text-[13px] leading-relaxed text-violet" style={{ animationDelay: "500ms" }}>
            {t.tagline[0]}
            <br />
            {t.tagline[1]}
          </p>
          <div className="mt-4 flex justify-end">
            <SparkleButton
              as="h1"
              lines={[line1, line2]}
              align="right"
              fontSize={
                locale === "en"
                  ? "clamp(56px, 26cqi, 136px)"
                  : "clamp(40px, 17cqi, 104px)"
              }
              fontFamily="var(--font-display), var(--font-geist), sans-serif"
              fontWeight={700}
              letterSpacing={locale === "en" ? "-0.055em" : "-0.01em"}
              lineHeight={locale === "en" ? 0.9 : 1.08}
              textColor="#FFFFFF"
              shadowColor="#3b0764"
              glareColor="rgba(255, 255, 255, 0.85)"
              className="w-full text-right"
            />
          </div>
        </div>

        <div
          className="fade-up relative z-10 px-5 pt-5 sm:px-8 lg:absolute lg:bottom-9 lg:right-10 lg:max-w-[380px] lg:p-0 lg:text-right"
          style={{ animationDelay: "1100ms" }}
        >
          <p className="font-mono text-[12.5px] leading-relaxed text-muted">{t.lead}</p>
          <a
            href="#modules"
            className="group mt-4 inline-flex items-center gap-2 text-sm text-text underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-violet"
          >
            {t.explore}
            <ArrowDown size={14} className="transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* Module chips: hover/focus previews the module's particle shape. */}
        <nav
          aria-label={t.explore}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => {
            setHovering(false);
            setSlot(-1);
          }}
          className="relative z-10 flex gap-2 overflow-x-auto px-5 pb-5 pt-6 [scrollbar-width:none] sm:px-8 lg:absolute lg:bottom-8 lg:left-[112px] lg:max-w-[52%] lg:flex-wrap lg:overflow-visible lg:p-0"
        >
          {MODULES.map((m, i) => {
            const active = slot === i;
            return (
              <Link
                key={m.id}
                href={`/m/${m.slug}`}
                onMouseEnter={() => setSlot(i)}
                onFocus={() => {
                  setHovering(true);
                  setSlot(i);
                }}
                onBlur={() => setHovering(false)}
                aria-current={active ? "true" : undefined}
                className={`relative flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full border py-2 pl-2 pr-4 text-[13px] transition-colors duration-300 ${
                  active ? "border-line-strong bg-white/[0.08] text-text" : "border-line text-muted hover:text-text"
                }`}
              >
                <span
                  className={`grid size-7 place-items-center rounded-full font-mono text-[10px] transition-colors duration-300 ${
                    active ? "bg-violet text-bg" : "bg-white/[0.06] text-muted"
                  }`}
                >
                  {m.index}
                </span>
                <span className="whitespace-nowrap">{m.title[locale]}</span>
                {active && !hovering && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-0 h-px origin-left bg-violet"
                    style={{ animation: `chip-progress ${CYCLE_MS}ms linear both` }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
            </div>
          }
          back={
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface/95 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.85),0_0_90px_-25px_rgb(124_58_237/0.45),inset_0_1px_0_rgb(255_255_255/0.05)] lg:block lg:rounded-[28px]">
              {/* Pulsating border glow around the hero frame */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
                <PulsatingBorder colors={["#000000", "#ffffff", "#a855f7"]} thickness={0.35} />
              </div>

              {/* Top bar — flows on mobile, pinned on desktop */}
              <div className="z-20 flex items-center justify-between gap-3 p-3 sm:p-4 lg:absolute lg:inset-x-6 lg:top-6 lg:justify-end lg:p-0">
                <span className="flex items-center gap-2 font-display text-lg tracking-tight lg:hidden">
                  <BrandMark className="size-6 text-violet" />
                  Kalpavriksha
                </span>
                <div className="flex items-center gap-2">
                  <LangSelect />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white/[0.06] px-3.5 font-mono text-[13px] text-text transition-colors duration-200 hover:border-violet/40 hover:bg-violet-deep hover:text-violet-ink active:scale-[0.98]"
                    title="Return to Particle Tree"
                  >
                    <ArrowsClockwise size={15} />
                    <span className="hidden sm:inline">Tree View</span>
                  </button>
                  <Link
                    href="/sign-in"
                    className="hidden h-11 items-center rounded-xl border border-violet/25 bg-violet-deep px-5 font-mono text-[13px] text-violet-ink transition-colors duration-200 hover:bg-[#4c1d95] active:scale-[0.98] sm:flex"
                  >
                    {t.signIn}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label={t.menu}
                    className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.06] lg:hidden"
                  >
                    <DotsNine size={18} />
                  </button>
                </div>
              </div>

              {/* Desktop rail: menu pill + vertical wordmark */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t.menu}
                className="group absolute left-6 top-6 z-20 hidden flex-col items-center gap-3 rounded-2xl border border-line bg-white/[0.04] p-1.5 pb-3 transition-colors duration-200 hover:bg-white/[0.08] lg:flex"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-white/[0.08] text-text transition-colors duration-200 group-hover:text-violet">
                  <BrandMark className="size-5" />
                </span>
                {locale === "en" && (
                  <span aria-hidden className="font-mono text-[11px] tracking-wide text-muted [writing-mode:vertical-rl]">
                    {t.menu}
                  </span>
                )}
                <DotsNine size={14} className="text-muted" aria-hidden />
              </button>
              <p
                aria-hidden
                className="pointer-events-none select-none absolute bottom-8 left-5 z-20 hidden rotate-180 font-display text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.04em] text-text/85 [writing-mode:vertical-rl] lg:block"
              >
                Kalpavriksha
              </p>

              {/* 3D Sphere Gallery canvas */}
              <div
                data-no-flip="true"
                className="absolute inset-0 z-10 h-full w-full -translate-x-8 sm:-translate-x-16 lg:-translate-x-48 xl:-translate-x-56"
              >
                <SphereGallery3D
                  background="transparent"
                  style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}
                  onBackgroundClick={() => setIsFlipped(false)}
                />
              </div>

              {/* Crystal Glow "Rooted To Rise" headline */}
              <div
                data-no-flip="true"
                className="pointer-events-auto absolute right-4 top-[12%] z-20 flex items-center justify-end sm:right-8 sm:top-[14%] lg:right-10 lg:top-[16%]"
              >
                <SparkleButton
                  as="h2"
                  lines={[line1, line2]}
                  align="right"
                  fontSize={
                    locale === "en"
                      ? "clamp(48px, 8vw, 132px)"
                      : "clamp(36px, 5.8vw, 96px)"
                  }
                  fontFamily="var(--font-display), var(--font-geist), sans-serif"
                  fontWeight={800}
                  letterSpacing={locale === "en" ? "-0.055em" : "-0.01em"}
                  lineHeight={0.92}
                  textColor="#C3AFD4"
                  shadowColor="#1E0028"
                  glareColor="#4A105DBF"
                />
              </div>

              {/* Exact bottom-right copy & explore link kept in same place */}
              <div
                data-no-flip="true"
                className="pointer-events-auto absolute bottom-6 right-5 z-20 max-w-[340px] text-right sm:bottom-9 sm:right-8 sm:max-w-[380px] lg:bottom-9 lg:right-10 lg:max-w-[380px] lg:p-0 lg:text-right"
              >
                <p className="font-mono text-[12.5px] leading-relaxed text-muted">{t.lead}</p>
                <a
                  href="#modules"
                  className="group mt-4 inline-flex items-center gap-2 text-sm text-text underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-violet"
                >
                  {t.explore}
                  <ArrowDown size={14} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          }
        />
      </div>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}
