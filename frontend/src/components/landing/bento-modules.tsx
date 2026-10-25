"use client";

import { ArrowUpRight, Flag, Play, Plus, Sparkle } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import { NeonBorder } from "@/components/neon-border";
import { RevealWords } from "@/components/scroll-fx";
import { MODULES } from "@/modules/registry";

export function BentoModules() {
  const { t, locale } = useLocale();

  const m1 = MODULES[0]!; // Digital Learning (01)
  const m2 = MODULES[1]!; // Holistic Growth (02)
  const m3 = MODULES[2]!; // GK & Patriotic Songs (03)

  return (
    <section id="modules" className="relative mx-auto w-full max-w-[1360px] scroll-mt-12 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Section Header */}
      <div className="mb-14 grid items-end gap-6 lg:mb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <RevealWords
          text={t.modulesTitle}
          className="font-display text-[clamp(36px,5vw,72px)] leading-[0.98] tracking-[-0.04em] text-balance text-text"
        />
        <p data-reveal="up" className="max-w-md text-[15px] leading-relaxed text-muted lg:justify-self-end">
          {t.modulesLead}
        </p>
      </div>

      {/* 3 Modules — Editorial Cards with Originkit Animated Neon Border */}
      <div className="flex flex-col gap-8 sm:gap-10">
        {/* ========================================================================= */}
        {/* MODULE 01: DIGITAL LEARNING (with Originkit Neon Border)                   */}
        {/* ========================================================================= */}
        <div
          data-reveal="up"
          className="relative w-full overflow-visible rounded-3xl transition-transform duration-300 hover:-translate-y-1"
        >
          {/* Animated Neon Border */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
            <NeonBorder
              color="#D0A2F4"
              rounded={24}
              thickness={4}
              glow={95}
              speed={16}
              borderSize={50}
              movement="continuous"
            />
          </div>

          <Link
            href={`/m/${m1.slug}`}
            className="group relative z-10 grid grid-cols-1 items-center gap-6 rounded-3xl border border-white/15 bg-[#120a24]/92 px-6 py-8 shadow-[0_16px_50px_-5px_rgba(0,0,0,0.85),0_0_30px_rgba(147,51,234,0.18)] backdrop-blur-2xl transition-all duration-300 hover:bg-[#1a0e33] hover:shadow-[0_20px_60px_-5px_rgba(0,0,0,0.95),0_0_45px_rgba(168,85,247,0.35)] sm:px-8 sm:py-10 md:grid-cols-[120px_1fr_1.2fr] lg:grid-cols-[160px_1.05fr_1.2fr] lg:gap-10 lg:px-12 lg:py-12"
          >
            {/* Left: Big Number 01 */}
            <div className="flex items-center justify-between md:justify-start">
              <span className="font-display text-[clamp(60px,7.5vw,118px)] font-light leading-none tracking-tight text-white/50 transition-colors duration-300 group-hover:text-white">
                01
              </span>
              <span className="grid size-10 place-items-center rounded-full border border-line bg-white/[0.04] text-muted transition-all duration-300 group-hover:border-violet group-hover:bg-violet-deep group-hover:text-violet-ink md:hidden">
                <ArrowUpRight size={18} />
              </span>
            </div>

            {/* Middle: Media Preview Container */}
            <div className="flex items-center justify-center">
              <div className="relative aspect-[16/10] w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/15 bg-surface/90 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-[1.03] group-hover:border-violet/40 group-hover:shadow-[0_20px_50px_-10px_rgba(124,58,237,0.3)]">
                <Image
                  src="/images/modules/digital-learning.png"
                  alt={m1.title[locale]}
                  width={400}
                  height={250}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Pill badge */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-1 backdrop-blur-md">
                  <Play size={11} weight="fill" className="text-violet animate-pulse" />
                  <span className="font-mono text-[10.5px] tracking-wide text-white/90">Interactive Lessons</span>
                </div>

                {/* Top-right icon badge */}
                <div className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg border border-white/10 bg-black/65 text-violet-ink backdrop-blur-md shadow-sm">
                  <m1.icon size={15} weight="duotone" />
                </div>
              </div>
            </div>

            {/* Right: Title & Description */}
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-[clamp(26px,2.6vw,40px)] font-semibold leading-tight tracking-[-0.03em] text-text transition-colors duration-300 group-hover:text-violet-ink">
                {m1.title[locale]}
              </h3>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
                {m1.summary[locale]}
              </p>
              <div className="mt-5 hidden items-center gap-2 font-mono text-[12.5px] font-medium text-violet transition-colors duration-200 group-hover:text-violet-ink md:inline-flex">
                <span>{t.open ?? "Explore module"}</span>
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* MODULE 02: HOLISTIC GROWTH (with Originkit Neon Border - Alternated)       */}
        {/* ========================================================================= */}
        <div
          data-reveal="up"
          className="relative w-full overflow-visible rounded-3xl transition-transform duration-300 hover:-translate-y-1"
        >
          {/* Animated Neon Border */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
            <NeonBorder
              color="#D0A2F4"
              rounded={24}
              thickness={4}
              glow={95}
              speed={16}
              borderSize={50}
              movement="continuous"
            />
          </div>

          <Link
            href={`/m/${m2.slug}`}
            className="group relative z-10 grid grid-cols-1 items-center gap-6 rounded-3xl border border-white/15 bg-[#120a24]/92 px-6 py-8 shadow-[0_16px_50px_-5px_rgba(0,0,0,0.85),0_0_30px_rgba(147,51,234,0.18)] backdrop-blur-2xl transition-all duration-300 hover:bg-[#1a0e33] hover:shadow-[0_20px_60px_-5px_rgba(0,0,0,0.95),0_0_45px_rgba(168,85,247,0.35)] sm:px-8 sm:py-10 md:grid-cols-[1.2fr_1.05fr_120px] lg:grid-cols-[1.2fr_1.05fr_160px] lg:gap-10 lg:px-12 lg:py-12"
          >
            {/* Mobile Header: Number 02 shows at top on small screens */}
            <div className="flex items-center justify-between md:hidden">
              <span className="font-display text-[clamp(60px,7.5vw,118px)] font-light leading-none tracking-tight text-white/50 transition-colors duration-300 group-hover:text-white">
                02
              </span>
              <span className="grid size-10 place-items-center rounded-full border border-line bg-white/[0.04] text-muted transition-all duration-300 group-hover:border-violet group-hover:bg-violet-deep group-hover:text-violet-ink">
                <ArrowUpRight size={18} />
              </span>
            </div>

            {/* Left Column on Desktop: Title & Description */}
            <div className="order-3 flex flex-col justify-center md:order-1">
              <h3 className="font-display text-[clamp(26px,2.6vw,40px)] font-semibold leading-tight tracking-[-0.03em] text-text transition-colors duration-300 group-hover:text-violet-ink">
                {m2.title[locale]}
              </h3>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
                {m2.summary[locale]}
              </p>
              <div className="mt-5 hidden items-center gap-2 font-mono text-[12.5px] font-medium text-violet transition-colors duration-200 group-hover:text-violet-ink md:inline-flex">
                <span>{t.open ?? "Explore module"}</span>
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Middle Column: 3 Vertical Frames (matching Image 1 Row 2) */}
            <div className="order-2 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
                {/* Vertical Card 1: Academics */}
                <div className="relative flex h-[160px] w-[80px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-surface/90 p-2.5 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-violet/40 sm:h-[190px] sm:w-[94px]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] text-violet">01</span>
                    <span className="size-2 rounded-full bg-violet animate-pulse" />
                  </div>
                  <div className="my-auto text-center">
                    <span className="block font-mono text-[13px] font-bold text-text">98%</span>
                    <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-wider text-muted">Academic</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[85%] rounded-full bg-violet" />
                  </div>
                </div>

                {/* Vertical Card 2 (Centerpiece): Tree of Growth */}
                <div className="relative flex h-[178px] w-[94px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-violet/40 bg-surface-2 p-2.5 shadow-[0_10px_30px_-5px_rgba(124,58,237,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-violet group-hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.5)] sm:h-[210px] sm:w-[110px]">
                  <div className="z-10 flex w-full items-center justify-between">
                    <span className="font-mono text-[9px] text-violet-ink">Tree</span>
                    <Sparkle size={10} weight="fill" className="text-violet-ink animate-pulse" />
                  </div>
                  <div className="relative my-auto flex items-center justify-center">
                    <div className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.4),transparent_70%)] blur-md" />
                    <Image
                      src="/images/modules/tree-growth.png"
                      alt="Tree of growth"
                      width={80}
                      height={90}
                      style={{ width: "auto", height: "auto" }}
                      className="relative z-10 max-h-[85px] max-w-[70px] object-contain sm:max-w-[80px]"
                    />
                  </div>
                  <span className="z-10 rounded-full border border-violet/30 bg-violet-deep/80 px-2 py-0.5 font-mono text-[8.5px] text-violet-ink">
                    Holistic
                  </span>
                </div>

                {/* Vertical Card 3: Skills & Character */}
                <div className="relative flex h-[160px] w-[80px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-surface/90 p-2.5 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-teal/40 sm:h-[190px] sm:w-[94px]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] text-teal">03</span>
                    <span className="size-2 rounded-full bg-teal animate-pulse" />
                  </div>
                  <div className="my-auto text-center">
                    <span className="block font-mono text-[13px] font-bold text-text">12+</span>
                    <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-wider text-muted">Skills</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[90%] rounded-full bg-teal" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column on Desktop: Big Number 02 */}
            <div className="hidden items-center justify-end md:flex md:order-3">
              <span className="font-display text-[clamp(60px,7.5vw,118px)] font-light leading-none tracking-tight text-white/50 transition-colors duration-300 group-hover:text-white">
                02
              </span>
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* MODULE 03: GK & PATRIOTIC SONGS (with Originkit Neon Border)               */}
        {/* ========================================================================= */}
        <div
          data-reveal="up"
          className="relative w-full overflow-visible rounded-3xl transition-transform duration-300 hover:-translate-y-1"
        >
          {/* Animated Neon Border */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
            <NeonBorder
              color="#D0A2F4"
              rounded={24}
              thickness={4}
              glow={95}
              speed={16}
              borderSize={50}
              movement="continuous"
            />
          </div>

          <Link
            href={`/m/${m3.slug}`}
            className="group relative z-10 grid grid-cols-1 items-center gap-6 rounded-3xl border border-white/15 bg-[#120a24]/92 px-6 py-8 shadow-[0_16px_50px_-5px_rgba(0,0,0,0.85),0_0_30px_rgba(147,51,234,0.18)] backdrop-blur-2xl transition-all duration-300 hover:bg-[#1a0e33] hover:shadow-[0_20px_60px_-5px_rgba(0,0,0,0.95),0_0_45px_rgba(168,85,247,0.35)] sm:px-8 sm:py-10 md:grid-cols-[120px_1fr_1.2fr] lg:grid-cols-[160px_1.05fr_1.2fr] lg:gap-10 lg:px-12 lg:py-12"
          >
            {/* Left: Big Number 03 */}
            <div className="flex items-center justify-between md:justify-start">
              <span className="font-display text-[clamp(60px,7.5vw,118px)] font-light leading-none tracking-tight text-white/50 transition-colors duration-300 group-hover:text-white">
                03
              </span>
              <span className="grid size-10 place-items-center rounded-full border border-line bg-white/[0.04] text-muted transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300 md:hidden">
                <ArrowUpRight size={18} />
              </span>
            </div>

            {/* Middle: Media Preview Container */}
            <div className="flex items-center justify-center">
              <div className="relative aspect-[16/10] w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/15 bg-surface/90 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-[1.03] group-hover:border-amber-400/40 group-hover:shadow-[0_20px_50px_-10px_rgba(251,191,36,0.25)]">
                <Image
                  src="/images/modules/gk-songs.jpg"
                  alt={m3.title[locale]}
                  width={400}
                  height={250}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Pill badge */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-1 backdrop-blur-md">
                  <Flag size={11} weight="fill" className="text-amber-400" />
                  <span className="font-mono text-[10.5px] tracking-wide text-white/90">3-Level Quiz & Heritage</span>
                </div>

                {/* Top-right icon badge */}
                <div className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg border border-white/10 bg-black/65 text-amber-300 backdrop-blur-md shadow-sm">
                  <m3.icon size={15} weight="duotone" />
                </div>
              </div>
            </div>

            {/* Right: Title & Description */}
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-[clamp(26px,2.6vw,40px)] font-semibold leading-tight tracking-[-0.03em] text-text transition-colors duration-300 group-hover:text-amber-300">
                {m3.title[locale]}
              </h3>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
                {m3.summary[locale]}
              </p>
              <div className="mt-5 hidden items-center gap-2 font-mono text-[12.5px] font-medium text-amber-400 transition-colors duration-200 group-hover:text-amber-300 md:inline-flex">
                <span>{t.open ?? "Explore module"}</span>
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Subtle Future Extension Banner */}
      <div data-reveal="up" className="mt-10 flex items-center justify-between rounded-2xl border border-dashed border-white/15 bg-[#120a24]/60 px-6 py-4 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-7 place-items-center rounded-lg border border-white/15 bg-white/[0.04] text-muted">
            <Plus size={14} />
          </span>
          <p className="text-[13px] text-muted">
            <strong className="font-medium text-text">{t.soonTitle}</strong> — {t.soonBody}
          </p>
        </div>
        <span className="hidden font-mono text-[11px] text-muted/60 sm:inline">
          Module 04+ In Pipeline
        </span>
      </div>
    </section>
  );
}
