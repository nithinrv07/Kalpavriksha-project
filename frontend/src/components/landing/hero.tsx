"use client";

import { ArrowDown, ArrowsClockwise, DotsNine } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

import { useLocale } from "@/components/locale-provider";
import { ParticleCanvas } from "@/components/particle-canvas";
import { FlipCard } from "@/components/flip-card";
import { SparkleButton } from "@/components/sparkle-button";
import type { ShapeName } from "@/lib/shapes";
import { MODULES } from "@/modules/registry";
import { accentOf } from "@/modules/accents";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/lib/theme";
import { LangSelect } from "./lang-select";
import { MenuSheet } from "./menu-sheet";
import { LiquidGlassSurface } from "@/components/liquid-glass-surface";

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

function HomeBookArtwork() {
  return (
    <svg viewBox="55 65 530 400" className="h-full w-full overflow-visible" role="img" aria-label="A glowing open book surrounded by a ring of light">
      <defs>
        <linearGradient id="book-page-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff5ff" />
          <stop offset="0.55" stopColor="#efd5ff" />
          <stop offset="1" stopColor="#bf91e8" />
        </linearGradient>
        <linearGradient id="book-page-right" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7ff" />
          <stop offset="0.55" stopColor="#ead1ff" />
          <stop offset="1" stopColor="#b884e4" />
        </linearGradient>
        <linearGradient id="book-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8eaff" />
          <stop offset="1" stopColor="#9a67cf" />
        </linearGradient>
        <linearGradient id="orbit-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8c8ff" stopOpacity="0.05" />
          <stop offset="0.48" stopColor="#fff4ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#d78cff" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="book-aura">
          <stop offset="0" stopColor="#efb5ff" stopOpacity="0.44" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <filter id="book-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <ellipse cx="320" cy="265" rx="232" ry="195" fill="url(#book-aura)" />
      <path d="M145 290 C164 115 250 77 320 77 C390 77 476 115 495 290" fill="none" stroke="url(#orbit-line)" strokeWidth="1.8" strokeDasharray="1 10" strokeLinecap="round" filter="url(#book-glow)" />
      <path d="M151 291 C170 124 252 87 320 87 C388 87 470 124 489 291" fill="none" stroke="#f6dfff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 14" />

      {/* orbit glints */}
      <g fill="#fff7ff" filter="url(#book-glow)">
        <circle cx="187" cy="163" r="3" /><circle cx="208" cy="139" r="2" />
        <circle cx="238" cy="119" r="2.5" /><circle cx="275" cy="108" r="1.8" />
        <circle cx="318" cy="106" r="2.4" /><circle cx="364" cy="116" r="1.7" />
        <circle cx="404" cy="135" r="2.5" /><circle cx="438" cy="163" r="2" />
        <circle cx="458" cy="195" r="3" /><circle cx="168" cy="204" r="1.8" />
      </g>

      {/* layered page edges */}
      <g transform="translate(38 -80) scale(0.88 1.25)" stroke="url(#book-edge)" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M320 373 C255 350 184 334 126 318 L126 332 C190 359 257 385 320 405 C383 385 450 359 514 332 L514 318 C456 334 385 350 320 373Z" fill="#b794d7" fillOpacity="0.28" />
        <path d="M320 383 C253 362 185 345 137 329 L137 340 C199 367 260 390 320 407 C380 390 441 367 503 340 L503 329 C455 345 387 362 320 383Z" fill="#d3b6ec" fillOpacity="0.2" />
      </g>

      {/* open book */}
      <g transform="translate(38 -80) scale(0.88 1.25)" filter="url(#book-glow)" stroke="#fff2ff" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M320 324 C263 281 195 267 111 290 C151 334 222 370 320 405Z" fill="none" />
        <path d="M320 324 C377 281 445 267 529 290 C489 334 418 370 320 405Z" fill="none" />
        <path d="M320 324 C316 350 317 379 320 405" fill="none" stroke="#fffaff" strokeWidth="2.5" />
        <path d="M128 296 C194 284 253 301 308 333 M145 311 C205 301 258 315 304 343 M164 326 C216 319 263 331 306 353" fill="none" stroke="#ead6ff" strokeOpacity="0.58" strokeWidth="1.2" />
        <path d="M512 296 C446 284 387 301 332 333 M495 311 C435 301 382 315 336 343 M476 326 C424 319 377 331 334 353" fill="none" stroke="#ead6ff" strokeOpacity="0.58" strokeWidth="1.2" />
        <g fill="none" stroke="#e7c4ff" strokeOpacity="0.32" strokeWidth="0.85">
          <path d="M320 324 L267 292 L211 278 L157 281 L111 290 M320 342 L276 319 L220 300 L166 296 L128 302 M320 359 L275 346 L221 329 L171 318 L137 316 M320 377 L277 367 L229 350 L180 339 L147 333 M320 397 L279 384 L234 368 L188 356 L160 347" />
          <path d="M267 292 L276 319 L275 346 L277 367 L279 384 M211 278 L220 300 L221 329 L229 350 L234 368 M157 281 L166 296 L171 318 L180 339 L188 356 M111 290 L128 302 L137 316 L147 333 L160 347" />
          <path d="M320 324 L373 292 L429 278 L483 281 L529 290 M320 342 L364 319 L420 300 L474 296 L512 302 M320 359 L365 346 L419 329 L469 318 L503 316 M320 377 L363 367 L411 350 L460 339 L493 333 M320 397 L361 384 L406 368 L452 356 L480 347" />
          <path d="M373 292 L364 319 L365 346 L363 367 L361 384 M429 278 L420 300 L419 329 L411 350 L406 368 M483 281 L474 296 L469 318 L460 339 L452 356 M529 290 L512 302 L503 316 L493 333 L480 347" />
        </g>
        <path d="M121 352 C183 374 257 396 320 405 C256 392 172 371 121 362Z" fill="url(#book-page-left)" fillOpacity="0.56" stroke="none" />
        <path d="M519 352 C457 374 383 396 320 405 C384 392 468 371 519 362Z" fill="url(#book-page-right)" fillOpacity="0.56" stroke="none" />
      </g>

      {/* small symbols of learning */}
      <g fill="none" stroke="#fbeaff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <ellipse cx="320" cy="193" rx="18" ry="7" />
        <ellipse cx="320" cy="193" rx="18" ry="7" transform="rotate(60 320 193)" />
        <ellipse cx="320" cy="193" rx="18" ry="7" transform="rotate(120 320 193)" />
        <circle cx="320" cy="193" r="2.5" fill="#fbeaff" stroke="none" />
        <path d="M397 213 V188 L417 182 V207" />
        <ellipse cx="392" cy="214" rx="5" ry="3" transform="rotate(-25 392 214)" fill="#fbeaff" stroke="none" />
      </g>
      <path d="M220 222 L225 232 L235 236 L225 240 L220 250 L216 240 L206 236 L216 232Z" fill="#fff6ff" filter="url(#book-glow)" />
      <path d="M445 245 L449 253 L457 256 L449 259 L445 267 L442 259 L434 256 L442 253Z" fill="#e9b8ff" />

      <ellipse cx="320" cy="431" rx="135" ry="9" fill="#d9a9ff" opacity="0.14" />
    </svg>
  );
}

interface HeroProps {
  scrollProgress?: number;
}

export function Hero({ scrollProgress = 0 }: HeroProps) {
  const { t, locale } = useLocale();
  const { isDark } = useTheme();
  const [introDone, setIntroDone] = useState(false);
  const [slot, setSlot] = useState<Slot>(-1);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const id = window.setTimeout(() => setIntroDone(true), prefersReducedMotion() ? 0 : INTRO_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Auto-cycle particle shapes while active on the tree view (isFlipped === true)
  useEffect(() => {
    if (!introDone || hovering || !isFlipped || prefersReducedMotion()) return;
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

  // Keep hero content perfectly crisp: no opacity/scale fade on the frame.
  // Sub-pixel scaling was making body text look soft, and the hero starts at
  // scrollProgress=1 (centered) which dimmed it to 70% opacity on load.

  // Mouse parallax for depth
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  return (
    <section
      data-hero
      onMouseMove={handleMouseMove}
      className="relative isolate flex min-h-[100dvh] h-[100dvh] w-full items-center justify-center overflow-hidden p-0"
    >
      {/* Scroll-driven ambient shift */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          transform: `translate3d(0, ${scrollProgress * -50}px, ${scrollProgress * -100}px) scale(${1 + scrollProgress * 0.1})`,
          opacity: 1 - scrollProgress * 0.2,
          transition: "none",
          background: `
            radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(168,85,247,${0.08 * (1 - scrollProgress)}) 0%, transparent 50%),
            radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(45,212,191,${0.05 * (1 - scrollProgress)}) 0%, transparent 50%)
          `,
        }}
      />
      <div className="hero-frame fade-up relative h-full w-full">
        <FlipCard
          flipped={isFlipped}
          onFlip={setIsFlipped}
          width="100%"
          height="100%"
          radius={0}
          background="transparent"
          shadow={false}
          className="h-full w-full"
          ariaLabel="Kalpavriksha hero frame"
          front={
            /* DEFAULT FRONTPAGE: Glowing open-book illustration */
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-transparent lg:block">

              {/* Top bar — flows on mobile, pinned on desktop (no-flip zone: stops propagation to FlipCard) */}
              <div
                className="z-30 flex items-center justify-between gap-3 px-5 py-4 sm:p-6 lg:absolute lg:right-8 xl:right-12 lg:top-8 lg:p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex items-center gap-2 font-headline font-semibold text-lg tracking-tight lg:hidden">
                  <BrandMark className="size-6 text-amber-400" strokeWidth={1.8} />
                  <SparkleButton
                    as="span"
                    text={t.appName ?? "Kalpavriksha"}
                    fontSize={locale === "ta" ? "clamp(20px, 2.8vw, 28px)" : "clamp(22px, 3vw, 30px)"}
                    fontWeight={700}
                    lineHeight={1.1}
                    letterSpacing="-0.02em"
                    textColor={isDark ? "#F4EEFF" : "#1a0833"}
                    shadowColor={isDark ? "#1E0028" : "rgba(124, 58, 237, 0.25)"}
                    glareColor={isDark ? "#4A105DBF" : "rgba(124, 58, 237, 0.55)"}
                    className="select-none"
                  />
                </span>
                <div className="flex items-center gap-2">
                  <LangSelect data-no-flip />
                  <ThemeToggle data-no-flip />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="flex min-w-[44px] h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.06] px-4 font-mono text-[14px] text-text transition-colors duration-200 hover:border-violet/40 hover:bg-violet-deep hover:text-violet-ink active:scale-[0.98]"
                    title="Explore Particle Tree View"
                    data-no-flip
                  >
                    <ArrowsClockwise size={15} />
                    <span className="hidden sm:inline">Tree View</span>
                  </button>
                  <Link
                    href="/sign-in"
                    className="hidden min-w-[44px] h-11 items-center justify-center rounded-xl border px-5 font-mono text-[14px] transition-colors duration-200 active:scale-[0.98] sm:flex theme-signin"
                    data-no-flip
                  >
                    {t.signIn}
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(true);
                    }}
                    aria-label={t.menu}
                    className="grid size-11 place-items-center rounded-xl border border-white/15 bg-surface/90 text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-amber-400/50 hover:bg-surface-2 hover:text-amber-200 lg:hidden"
                    data-no-flip
                  >
                    <DotsNine size={18} />
                  </button>
                </div>
              </div>

              {/* Desktop rail: menu pill + vertical wordmark */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(true);
                }}
                aria-label={t.menu}
                className="group absolute left-6 xl:left-8 top-6 xl:top-8 z-30 hidden flex-col items-center gap-3 rounded-2xl border border-white/15 bg-surface/90 backdrop-blur-xl p-2 pb-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400/50 hover:bg-surface-2 hover:shadow-[0_10px_35px_rgba(251,191,36,0.18)] lg:flex min-h-[44px] min-w-[44px]"
                data-no-flip
              >
                <span className="grid size-10 place-items-center rounded-xl border border-amber-400/35 bg-amber-400/15 text-amber-300 shadow-[0_0_16px_-2px_rgba(251,191,36,0.45)] transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 group-hover:bg-amber-400/25 group-hover:text-amber-200 group-hover:shadow-[0_0_22px_rgba(251,191,36,0.65)]">
                  <BrandMark className="size-5" strokeWidth={1.8} />
                </span>
                {locale === "en" && (
                  <span aria-hidden className="font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-white/90 transition-colors group-hover:text-amber-200 [writing-mode:vertical-rl]">
                    {t.menu}
                  </span>
                )}
                <DotsNine size={14} className="text-amber-400/80 transition-colors group-hover:text-amber-300" aria-hidden />
              </button>

              {/* Horizontal brand title centered directly above the book */}
              <div
                aria-hidden
                className="pointer-events-none select-none absolute top-[5.5vh] inset-x-0 z-20 hidden justify-center lg:flex"
              >
                <SparkleButton
                  as="h1"
                  text={t.appName ?? "Kalpavriksha"}
                  fontSize={locale === "ta" ? "clamp(48px, 6.4vw, 92px)" : "clamp(60px, 8vw, 116px)"}
                  fontWeight={isDark ? 700 : 600}
                  lineHeight={0.95}
                  letterSpacing="-0.005em"
                  textColor={isDark ? "#FFFFFF" : "#110826"}
                  shadowColor={isDark ? "#1E0028" : "rgba(124, 58, 237, 0.25)"}
                  glareColor={isDark ? "#4A105DBF" : "rgba(124, 58, 237, 0.55)"}
                  className={`font-title pointer-events-auto ${
                    isDark
                      ? "drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                      : "drop-shadow-[0_2px_10px_rgba(124,58,237,0.1)]"
                  }`}
                />
              </div>

              {/* Clear open-book focal art replaces the rotating image sphere. */}
              <div
                data-no-flip="true"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible will-change-transform contain-strict"
              >
                <div className="absolute left-1/2 top-[54%] h-[min(58vh,520px)] w-[min(62vw,760px)] -translate-x-1/2 -translate-y-1/2">
                  <HomeBookArtwork />
                </div>
              </div>

              {/* Right-side content column: harmoniously proportioned, cohesive right rail */}
              <div
                data-no-flip="true"
                className="pointer-events-auto absolute right-4 top-20 bottom-6 z-20 flex w-full max-w-[340px] flex-col items-center justify-center gap-5 text-center sm:right-8 sm:top-24 sm:bottom-8 sm:max-w-[380px] sm:gap-6 lg:right-8 lg:top-24 lg:bottom-8 lg:max-w-[400px] lg:gap-7 xl:right-12 xl:max-w-[420px]"
              >
                {/* 1. Crystal Glow "Rooted to Rise" headline */}
                <div className="flex w-full justify-center">
                  <SparkleButton
                    as="h2"
                    lines={[line1, line2]}
                    align="center"
                    fontSize={
                      locale === "en"
                        ? "clamp(36px, 4.2vw, 70px)"
                        : "clamp(28px, 3.4vw, 56px)"
                    }
                    fontFamily="var(--font-fraunces), var(--font-anek-tamil), var(--font-anek-deva), Georgia, serif"
                    fontWeight={600}
                    letterSpacing={locale === "en" ? "-0.015em" : "-0.005em"}
                    lineHeight={locale === "en" ? 0.98 : 1.1}
                    textColor={isDark ? "#F4EEFF" : "#1a0833"}
                    shadowColor={isDark ? "#1E0028" : "rgba(124, 58, 237, 0.25)"}
                    glareColor={isDark ? "#4A105DBF" : "rgba(124, 58, 237, 0.55)"}
                    className="w-full"
                  />
                </div>

                {/* 2. Middle interactive showcase: cards span the rail, contents centred */}
                <div className="hidden w-full flex-col items-center gap-3 sm:flex">
                  {/* Tagline / Subtitle */}
                  <p className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.18em] text-violet-ink text-center">
                    {t.tagline[0]} — {t.tagline[1]}
                  </p>

                  {/* Quick module access cards with custom icons */}
                  <div className="flex flex-col items-center gap-2.5 w-full">
                    {MODULES.map((m) => {
                      const Icon = m.icon;
                      const accent = accentOf(m.accent);
                      return (
                        <LiquidGlassSurface
                          key={m.id}
                          radius={16}
                          className="group relative z-10 w-full border border-white/10 shadow-[0_12px_40px_-20px_rgb(0_0_0/0.8)]"
                        >
                          <Link
                            href={`/m/${m.slug}`}
                            className="relative z-10 group flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-center transition-all duration-300 hover:-translate-y-0.5"
                          >
                            <span className={`w-8 shrink-0 text-center font-mono text-[11px] font-semibold ${accent.text} transition-colors`}>
                              {m.index}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-text group-hover:text-violet-ink transition-colors">
                              {m.title[locale]}
                            </span>
                            <span
                              className={`grid size-8 shrink-0 place-items-center overflow-hidden rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
                                isDark
                                  ? `border-white/10 bg-surface-2 shadow-sm ${accent.text}`
                                  : "border-violet/20 bg-white shadow-[0_1px_3px_rgba(76,29,149,0.14)] " + accent.text
                              }`}
                            >
                              {/* The raster module art is drawn light-on-violet, so it
                                  disappears on a pearl card. Light mode uses the
                                  matching duotone glyph instead. */}
                              {isDark && m.iconImage ? (
                                <Image
                                  src={m.iconImage}
                                  alt={m.title[locale]}
                                  width={32}
                                  height={32}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <Icon size={17} weight="duotone" />
                              )}
                            </span>
                          </Link>
                        </LiquidGlassSurface>
                      );
                    })}
                  </div>

                  {/* Key statistics row: neatly bounded to card width */}
                  <div className="flex w-full flex-wrap items-center justify-center gap-1.5 pt-0.5">
                    {t.stats.map((stat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[11.5px] text-text/75 backdrop-blur-md shadow-sm transition-colors hover:border-white/20"
                      >
                        <strong className="font-semibold text-amber-300">{stat.value}</strong>
                        <span className="text-text/80">{stat.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Bottom copy & explore link */}
                <div className="flex w-full flex-col items-center text-center">
                  <p className="w-full font-sans text-[15px] leading-relaxed text-text/90">{t.lead}</p>
                  <a
                    href="#modules"
                    className="group mt-3.5 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2 font-mono text-[13px] font-medium transition-all duration-300 active:scale-[0.98] theme-explore"
                  >
                    <span>{t.explore}</span>
                    <ArrowDown size={13} className="transition-transform duration-200 group-hover:translate-y-0.5 text-amber-300" />
                  </a>
                </div>
              </div>
            </div>
          }
          back={
            /* FLIP SIDE: Particle Tree View */
            <div className="relative flex h-full w-full flex-col overflow-y-auto bg-transparent lg:block lg:overflow-hidden scrollbar-glass">

              {/* Top bar — flows on mobile, pinned on desktop (no-flip zone: stops propagation to FlipCard) */}
              <div
                className="z-30 flex items-center justify-between gap-3 px-5 py-4 sm:p-6 lg:absolute lg:right-8 xl:right-12 lg:top-8 lg:p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex items-center gap-2 font-headline font-semibold text-lg tracking-tight lg:hidden">
                  <BrandMark className="size-6 text-amber-400" strokeWidth={1.8} />
                  <SparkleButton
                    as="span"
                    text={t.appName ?? "Kalpavriksha"}
                    fontSize={locale === "ta" ? "clamp(20px, 2.8vw, 28px)" : "clamp(22px, 3vw, 30px)"}
                    fontWeight={700}
                    lineHeight={1.1}
                    letterSpacing="-0.02em"
                    textColor={isDark ? "#F4EEFF" : "#1a0833"}
                    shadowColor={isDark ? "#1E0028" : "rgba(124, 58, 237, 0.25)"}
                    glareColor={isDark ? "#4A105DBF" : "rgba(124, 58, 237, 0.55)"}
                    className="select-none"
                  />
                </span>
                <div className="flex items-center gap-2">
                  <LangSelect data-no-flip />
                  <ThemeToggle data-no-flip />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="flex min-w-[44px] h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.06] px-4 font-mono text-[14px] text-text transition-colors duration-200 hover:border-violet/40 hover:bg-violet-deep hover:text-violet-ink active:scale-[0.98]"
                    title="Return to Home Page"
                    data-no-flip
                  >
                    <ArrowsClockwise size={15} />
                    <span className="hidden sm:inline">Home</span>
                  </button>
                  <Link
                    href="/sign-in"
                    className="hidden min-w-[44px] h-11 items-center justify-center rounded-xl border px-5 font-mono text-[14px] transition-colors duration-200 active:scale-[0.98] sm:flex theme-signin"
                    data-no-flip
                  >
                    {t.signIn}
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(true);
                    }}
                    aria-label={t.menu}
                    className="grid size-11 place-items-center rounded-xl border border-white/15 bg-surface/90 text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-amber-400/50 hover:bg-surface-2 hover:text-amber-200 lg:hidden"
                    data-no-flip
                  >
                    <DotsNine size={18} />
                  </button>
                </div>
              </div>

              {/* Desktop rail: menu pill + vertical wordmark */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(true);
                }}
                aria-label={t.menu}
                className="group absolute left-6 xl:left-8 top-6 xl:top-8 z-30 hidden flex-col items-center gap-3 rounded-2xl border border-white/15 bg-surface/90 backdrop-blur-xl p-2 pb-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400/50 hover:bg-surface-2 hover:shadow-[0_10px_35px_rgba(251,191,36,0.18)] lg:flex min-h-[44px] min-w-[44px]"
                data-no-flip
              >
                <span className="grid size-10 place-items-center rounded-xl border border-amber-400/35 bg-amber-400/15 text-amber-300 shadow-[0_0_16px_-2px_rgba(251,191,36,0.45)] transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 group-hover:bg-amber-400/25 group-hover:text-amber-200 group-hover:shadow-[0_0_22px_rgba(251,191,36,0.65)]">
                  <BrandMark className="size-5" strokeWidth={1.8} />
                </span>
                {locale === "en" && (
                  <span aria-hidden className="font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-white/90 transition-colors group-hover:text-amber-200 [writing-mode:vertical-rl]">
                    {t.menu}
                  </span>
                )}
                <DotsNine size={14} className="text-amber-400/80 transition-colors group-hover:text-amber-300" aria-hidden />
              </button>
              {/* Horizontal brand title centered directly above particle tree with dual-tone SparkleButton (hover glare animation) */}
              <div
                aria-hidden
                className="pointer-events-none select-none absolute top-[5.5vh] inset-x-0 z-20 hidden justify-center lg:flex"
              >
                <SparkleButton
                  as="h1"
                  text={t.appName ?? "Kalpavriksha"}
                  fontSize={locale === "ta" ? "clamp(48px, 6.4vw, 92px)" : "clamp(60px, 8vw, 116px)"}
                  fontWeight={isDark ? 700 : 600}
                  lineHeight={0.95}
                  letterSpacing="-0.005em"
                  textColor={isDark ? "#FFFFFF" : "#110826"}
                  shadowColor={isDark ? "#1E0028" : "rgba(124, 58, 237, 0.25)"}
                  glareColor={isDark ? "#4A105DBF" : "rgba(124, 58, 237, 0.55)"}
                  className={`font-title pointer-events-auto ${
                    isDark
                      ? "drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                      : "drop-shadow-[0_2px_10px_rgba(124,58,237,0.1)]"
                  }`}
                />
              </div>

              {/* Particle stage — centered towards viewport middle */}
              <div className="hero-stage relative mx-auto aspect-square w-full max-w-[560px] shrink-0 translate-y-6 sm:translate-y-8 lg:translate-y-6 lg:absolute lg:inset-x-0 lg:bottom-16 lg:top-8 lg:mx-auto lg:aspect-auto lg:w-full lg:max-w-[760px] xl:max-w-[860px] 2xl:max-w-[960px] lg:left-1/2 lg:-translate-x-1/2 will-change-transform contain-strict">
                <ParticleCanvas shape={shape} className="absolute inset-0 h-full w-full pointer-events-none will-change-transform contain-strict" active={isFlipped} />
                {t.stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`fade-up absolute ${STAT_POSITIONS[i] ?? ""} text-center pointer-events-auto`}
                    style={{ animationDelay: `${900 + i * 120}ms` }}
                  >
                    <span className="block font-mono text-[14px] text-text">{stat.value}</span>
                    <span className="block max-w-[9rem] font-mono text-[11px] leading-tight text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Eyebrow, left of the cloud (desktop) */}
              <p
                className="fade-up absolute left-6 xl:left-8 top-[20%] z-10 hidden max-w-[210px] text-left text-[13px] leading-snug text-violet lg:block"
                style={{ animationDelay: "700ms" }}
              >
                {t.eyebrow}
              </p>

              {/* Copy block */}
              <div className="hero-copy pointer-events-auto relative z-10 shrink-0 px-5 pb-2 sm:px-8 lg:absolute lg:right-8 xl:right-12 lg:top-[27%] lg:w-[38%] xl:w-[34%] lg:p-0 lg:text-right [container-type:inline-size]">
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
                    fontFamily="var(--font-fraunces), var(--font-anek-tamil), var(--font-anek-deva), Georgia, serif"
                    fontWeight={600}
                    letterSpacing={locale === "en" ? "-0.025em" : "-0.01em"}
                    lineHeight={locale === "en" ? 0.92 : 1.08}
                    textColor={isDark ? "#FFFFFF" : "#1a0833"}
                    shadowColor={isDark ? "#3b0764" : "rgba(124, 58, 237, 0.25)"}
                    glareColor={isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(124, 58, 237, 0.55)"}
                    className="w-full text-right"
                  />
                </div>
              </div>

              <div
                className="fade-up relative z-10 shrink-0 px-5 pt-5 sm:px-8 lg:absolute lg:bottom-10 lg:right-8 xl:right-12 lg:max-w-[380px] lg:p-0 lg:text-right"
                style={{ animationDelay: "1100ms" }}
              >
                <p className="font-mono text-[13.5px] leading-relaxed text-muted">{t.lead}</p>
                <a
                  href="#modules"
                  className="group mt-4 inline-flex items-center gap-2 text-sm text-text underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-violet"
                >
                  {t.explore}
                  <ArrowDown size={14} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>
              </div>

              {/* Module chips: hover/focus previews the module's particle shape */}
              <nav
                aria-label={t.explore}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => {
                  setHovering(false);
                  setSlot(-1);
                }}
                className="relative z-10 flex shrink-0 touch-auto gap-2 overflow-x-auto px-5 pb-5 pt-6 [scrollbar-width:none] sm:px-8 lg:absolute lg:bottom-8 lg:left-6 xl:left-8 lg:max-w-[42%] lg:flex-wrap lg:overflow-visible lg:p-0 scrollbar-thin scrollbar-violet"
              >
                {MODULES.map((m, i) => {
                  const active = slot === i;
                  const accent = accentOf(m.accent);
                  return (
                    <LiquidGlassSurface
                      key={m.id}
                      radius={9999}
                      className="group relative z-10 shrink-0 border border-white/10 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)]"
                    >
                      <Link
                        href={`/m/${m.slug}`}
                        onMouseEnter={() => setSlot(i)}
                        onFocus={() => {
                          setHovering(true);
                          setSlot(i);
                        }}
                        onBlur={() => setHovering(false)}
                        aria-current={active ? "true" : undefined}
                        className={`relative flex min-h-11 shrink-0 items-center gap-2.5 overflow-hidden rounded-full border py-2.5 pl-2 pr-5 text-[14px] transition-colors duration-300 ${
                          active ? "border-line-strong bg-white/[0.08] text-text" : "border-line text-muted hover:text-text"
                        }`}
                      >
                        <span
                          className={`grid size-8 place-items-center rounded-full font-mono text-[10.5px] transition-colors duration-300 ${
                            active ? accent.solid : `bg-white/[0.06] text-muted`
                          }`}
                        >
                          {m.index}
                        </span>
                        <span className="whitespace-nowrap">{m.title[locale]}</span>
                        {active && !hovering && (
                          <span
                            aria-hidden
                            className={`absolute inset-x-3 bottom-0 h-px origin-left ${accent.bar}`}
                            style={{ animation: `chip-progress ${CYCLE_MS}ms linear both` }}
                          />
                        )}
                      </Link>
                    </LiquidGlassSurface>
                  );
                })}
              </nav>
            </div>
          }
        />
      </div>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}
