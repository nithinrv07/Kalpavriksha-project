"use client";

import { ArrowDown, ArrowsClockwise, DotsNine } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { DepthText } from "@/components/depth-text";
import { useLocale } from "@/components/locale-provider";
import { ParticleCanvas } from "@/components/particle-canvas";
import { FlipCard } from "@/components/flip-card";
import { SparkleButton } from "@/components/sparkle-button";
import { SphereGallery3D } from "@/components/sphere-gallery-3d";
import type { ShapeName } from "@/lib/shapes";
import { MODULES } from "@/modules/registry";
import { accentOf } from "@/modules/accents";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [slot, setSlot] = useState<Slot>(-1);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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

  return (
    <section
      data-hero
      className="relative isolate flex min-h-[100dvh] h-[100dvh] w-full items-center justify-center overflow-hidden p-0"
    >
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
            /* DEFAULT FRONTPAGE: Luminous 3D Sphere Gallery View */
            <div className="relative flex min-h-full h-full w-full flex-col justify-between overflow-y-auto lg:overflow-hidden bg-transparent lg:block">

              {/* Top bar — flows on mobile, pinned on desktop */}
              <div className="z-20 flex shrink-0 items-center justify-between gap-3 px-5 py-4 sm:p-6 lg:absolute lg:right-8 xl:right-12 lg:top-8 lg:p-0">
                <span className="flex items-center gap-2 font-headline font-semibold text-lg tracking-tight lg:hidden">
                  <BrandMark className="size-6 text-amber-400" strokeWidth={1.8} />
                  {t.appName ?? "Kalpavriksha"}
                </span>
                <div className="flex items-center gap-2">
                  <LangSelect />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white/[0.06] px-3.5 font-mono text-[14px] text-text transition-colors duration-200 hover:border-violet/40 hover:bg-violet-deep hover:text-violet-ink active:scale-[0.98]"
                    title="Explore Particle Tree View"
                  >
                    <ArrowsClockwise size={15} />
                    <span className="hidden sm:inline">Tree View</span>
                  </button>
                  <Link
                    href="/sign-in"
                    className="hidden h-11 items-center rounded-xl border border-violet/25 bg-violet-deep px-5 font-mono text-[14px] text-violet-ink transition-colors duration-200 hover:bg-[#4c1d95] active:scale-[0.98] sm:flex"
                  >
                    {t.signIn}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label={t.menu}
                    className="grid size-11 place-items-center rounded-xl border border-white/15 bg-surface/90 text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-amber-400/50 hover:bg-surface-2 hover:text-amber-200 lg:hidden"
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
                className="group absolute left-6 xl:left-8 top-6 xl:top-8 z-20 hidden flex-col items-center gap-3 rounded-2xl border border-white/15 bg-surface/90 backdrop-blur-xl p-1.5 pb-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400/50 hover:bg-surface-2 hover:shadow-[0_10px_35px_rgba(251,191,36,0.18)] lg:flex"
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

              {/* Horizontal brand title centered directly above 3D Sphere with 3D DepthText */}
              <div
                aria-hidden
                className="pointer-events-none select-none absolute top-[8vh] inset-x-0 z-20 hidden justify-center -translate-x-4 sm:-translate-x-8 lg:-translate-x-16 xl:-translate-x-16 2xl:-translate-x-8 lg:flex"
              >
                <DepthText
                  text={t.appName ?? "Kalpavriksha"}
                  fontSize={locale === "ta" ? "clamp(34px, 4.4vw, 64px)" : "clamp(40px, 5.15vw, 74px)"}
                  fontWeight={400}
                  faceColor="#FFFFFF"
                  depthColor="#6d28d9"
                  layers={17}
                  depth={3.2}
                  tilt={8}
                  perspective={1000}
                  autoOrbit={true}
                  orbitSpeed={0.3}
                  float={true}
                  pointerTracking={true}
                  shadow={true}
                  active={!isFlipped}
                  className="font-title [--depth-text-letter-spacing:-0.005em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.32)]"
                />
              </div>

              {/* MOBILE ONLY: Clean headline above sphere with zero overlap */}
              <div className="z-20 flex shrink-0 flex-col items-center text-center px-4 pt-2 pb-1 lg:hidden">
                <SparkleButton
                  as="h2"
                  lines={[line1, line2]}
                  align="center"
                  fontSize={locale === "en" ? "clamp(26px, 7vw, 36px)" : "clamp(24px, 6.2vw, 32px)"}
                  fontFamily="var(--font-fraunces), var(--font-anek-tamil), var(--font-anek-deva), Georgia, serif"
                  fontWeight={600}
                  letterSpacing={locale === "en" ? "-0.015em" : "-0.005em"}
                  lineHeight={locale === "en" ? 1.05 : 1.15}
                  textColor="#C3AFD4"
                  shadowColor="#1E0028"
                  glareColor="#4A105DBF"
                  className="w-full"
                />
                <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-ink/80 text-center">
                  {t.tagline[0]} — {t.tagline[1]}
                </p>
              </div>

              {/* 3D Sphere Gallery canvas — dedicated stage on mobile, full-span on desktop */}
              <div
                data-no-flip="true"
                className="relative z-10 my-auto h-[46vh] min-h-[290px] max-h-[380px] w-full shrink-0 flex items-center justify-center lg:absolute lg:inset-0 lg:my-0 lg:h-full lg:w-full lg:right-[420px] xl:right-[460px] lg:w-auto lg:translate-x-0 lg:translate-y-24"
              >
                <SphereGallery3D
                  scale={isMobile ? 52 : 68}
                  size={isMobile ? 24 : 28}
                  background="transparent"
                  active={!isFlipped}
                  style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}
                />
              </div>

              {/* MOBILE ONLY: Clean bottom action & lead copy below sphere with zero overlap */}
              <div className="z-20 flex shrink-0 flex-col items-center text-center px-4 pb-6 gap-2.5 lg:hidden">
                <p className="font-sans text-[13px] leading-relaxed text-muted/90 max-w-[340px] text-center">
                  {t.lead}
                </p>
                <a
                  href="#modules"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-violet/30 bg-violet/15 px-6 py-2.5 font-mono text-[13px] font-medium text-violet-ink backdrop-blur-md shadow-[0_4px_16px_rgba(147,51,234,0.25)] transition-all active:scale-[0.98]"
                >
                  <span>{t.explore}</span>
                  <ArrowDown size={13} className="text-amber-300" />
                </a>
              </div>

              {/* DESKTOP ONLY: Right-side content column (harmoniously proportioned, cohesive right rail) */}
              <div
                data-no-flip="true"
                className="pointer-events-auto hidden lg:flex absolute lg:right-8 lg:top-24 lg:bottom-8 lg:max-w-[400px] xl:right-12 xl:max-w-[420px] z-20 flex-col items-center justify-center gap-7 text-center"
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
                    textColor="#C3AFD4"
                    shadowColor="#1E0028"
                    glareColor="#4A105DBF"
                    className="w-full"
                  />
                </div>

                {/* 2. Middle interactive showcase: cards span the rail, contents centred */}
                <div className="flex w-full flex-col items-center gap-3">
                  {/* Tagline / Subtitle */}
                  <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-violet-ink/80 text-center">
                    {t.tagline[0]} — {t.tagline[1]}
                  </p>

                  {/* Quick module access cards with custom icons */}
                  <div className="flex flex-col items-center gap-2.5 w-full">
                    {MODULES.map((m) => {
                      const Icon = m.icon;
                      const accent = accentOf(m.accent);
                      return (
                        <Link
                          key={m.id}
                          href={`/m/${m.slug}`}
                          className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-white/12 bg-[#140d28]/90 px-3.5 py-3 text-center shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/50 hover:bg-[#1e133c] hover:shadow-[0_12px_28px_-4px_rgba(147,51,234,0.3)]"
                        >
                          <span className={`w-8 shrink-0 text-center font-mono text-[11px] font-semibold ${accent.text} transition-colors`}>
                            {m.index}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-text group-hover:text-violet-ink transition-colors">
                            {m.title[locale]}
                          </span>
                          <span className={`grid size-8 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-surface-2 ${accent.text} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                            {m.iconImage ? (
                              <Image
                                src={m.iconImage}
                                alt={m.title[locale]}
                                width={32}
                                height={32}
                                className="size-full object-cover"
                              />
                            ) : (
                              <Icon size={16} weight="duotone" />
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Key statistics row: neatly bounded to card width */}
                  <div className="flex w-full flex-wrap items-center justify-center gap-1.5 pt-0.5">
                    {t.stats.map((stat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[11.5px] text-muted backdrop-blur-md shadow-sm transition-colors hover:border-white/20"
                      >
                        <strong className="font-semibold text-amber-300">{stat.value}</strong>
                        <span className="text-muted/90">{stat.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Bottom copy & explore link */}
                <div className="flex w-full flex-col items-center text-center">
                  <p className="w-full font-sans text-[14px] leading-relaxed text-muted/90">{t.lead}</p>
                  <a
                    href="#modules"
                    className="group mt-3.5 inline-flex min-h-11 items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 font-mono text-[13px] font-medium text-violet-ink backdrop-blur-md shadow-[0_4px_16px_rgba(147,51,234,0.2)] transition-all duration-300 hover:border-violet/60 hover:bg-violet-deep hover:text-white hover:shadow-[0_6px_25px_rgba(168,85,247,0.35)] active:scale-[0.98]"
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
            <div className="relative flex h-full w-full flex-col overflow-y-auto bg-transparent lg:block lg:overflow-hidden">

              {/* Top bar — flows on mobile, pinned on desktop */}
              <div className="z-20 flex items-center justify-between gap-3 px-5 py-4 sm:p-6 lg:absolute lg:right-8 xl:right-12 lg:top-8 lg:p-0">
                <span className="flex items-center gap-2 font-headline font-semibold text-lg tracking-tight lg:hidden">
                  <BrandMark className="size-6 text-amber-400" strokeWidth={1.8} />
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
                    className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white/[0.06] px-3.5 font-mono text-[14px] text-text transition-colors duration-200 hover:border-violet/40 hover:bg-violet-deep hover:text-violet-ink active:scale-[0.98]"
                    title="Return to 3D Sphere Gallery"
                  >
                    <ArrowsClockwise size={15} />
                    <span className="hidden sm:inline">3D Gallery</span>
                  </button>
                  <Link
                    href="/sign-in"
                    className="hidden h-11 items-center rounded-xl border border-violet/25 bg-violet-deep px-5 font-mono text-[14px] text-violet-ink transition-colors duration-200 hover:bg-[#4c1d95] active:scale-[0.98] sm:flex"
                  >
                    {t.signIn}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label={t.menu}
                    className="grid size-11 place-items-center rounded-xl border border-white/15 bg-surface/90 text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-amber-400/50 hover:bg-surface-2 hover:text-amber-200 lg:hidden"
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
                className="group absolute left-6 xl:left-8 top-6 xl:top-8 z-20 hidden flex-col items-center gap-3 rounded-2xl border border-white/15 bg-surface/90 backdrop-blur-xl p-1.5 pb-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400/50 hover:bg-surface-2 hover:shadow-[0_10px_35px_rgba(251,191,36,0.18)] lg:flex"
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
              {/* Horizontal brand title centered directly above 3D Sphere with 3D DepthText */}
              <div
                aria-hidden
                className="pointer-events-none select-none absolute top-[8vh] inset-x-0 z-20 hidden justify-center -translate-x-4 sm:-translate-x-8 lg:-translate-x-16 xl:-translate-x-16 2xl:-translate-x-8 lg:flex"
              >
                <DepthText
                  text="Kalpavriksha"
                  fontSize="clamp(40px, 5.15vw, 74px)"
                  fontWeight={400}
                  faceColor="#FFFFFF"
                  depthColor="#6d28d9"
                  layers={17}
                  depth={3.2}
                  tilt={8}
                  perspective={1000}
                  autoOrbit={true}
                  orbitSpeed={0.3}
                  float={true}
                  pointerTracking={true}
                  shadow={true}
                  active={isFlipped}
                  className="font-title [--depth-text-letter-spacing:-0.005em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.32)]"
                />
              </div>

              {/* Particle stage — shifted down for harmonious breathing room */}
              <div className="hero-stage relative mx-auto aspect-square w-full max-w-[560px] shrink-0 translate-y-6 sm:translate-y-8 lg:translate-y-10 lg:absolute lg:bottom-28 lg:left-[9%] lg:top-0 lg:aspect-auto lg:w-[54%] lg:max-w-none">
                <ParticleCanvas shape={shape} className="absolute inset-0 h-full w-full" active={isFlipped} />
                {t.stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`fade-up absolute ${STAT_POSITIONS[i] ?? ""} text-center`}
                    style={{ animationDelay: `${900 + i * 120}ms` }}
                  >
                    <span className="block font-mono text-[14px] text-text">{stat.value}</span>
                    <span className="block max-w-[9rem] font-mono text-[11px] leading-tight text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Eyebrow, left of the cloud (desktop) */}
              <p
                className="fade-up absolute left-[10%] top-[20%] z-10 hidden max-w-[210px] text-right text-[13px] leading-snug text-violet lg:block"
                style={{ animationDelay: "700ms" }}
              >
                {t.eyebrow}
              </p>

              {/* Copy block */}
              <div className="hero-copy relative z-10 shrink-0 px-5 pb-2 sm:px-8 lg:absolute lg:right-8 xl:right-12 lg:top-[27%] lg:w-[44%] lg:p-0 lg:text-right [container-type:inline-size]">
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
                    textColor="#FFFFFF"
                    shadowColor="#3b0764"
                    glareColor="rgba(255, 255, 255, 0.85)"
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
                className="relative z-10 flex shrink-0 touch-auto gap-2 overflow-x-auto px-5 pb-5 pt-6 [scrollbar-width:none] sm:px-8 lg:absolute lg:bottom-10 lg:left-[112px] xl:left-[128px] lg:max-w-[52%] lg:flex-wrap lg:overflow-visible lg:p-0"
              >
                {MODULES.map((m, i) => {
                  const active = slot === i;
                  const accent = accentOf(m.accent);
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
