"use client";

import { ArrowLeft, Fire, IdentificationCard } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LivingTree } from "@/components/landing/living-tree";
import { CosmicParticleLayer } from "@/components/cosmic-particle-layer";
import { LangSelect } from "@/components/landing/lang-select";
import { useLocale } from "@/components/locale-provider";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { useProgress } from "@/components/progress-store";
import { SoundToggle } from "@/components/sound-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { BAND_INFO } from "@/lib/bands";
import { authService } from "@/lib/auth-service";
import { bandOf, localDay, streak, type Band, type Profile } from "@/lib/progress";
import { MODULES, type KalpaModule } from "@/modules/registry";
import { accentOf } from "@/modules/accents";

/** Streak and profile avatar: the shared student profile, visible on every module. */
function ProgressPill() {
  const { t } = useLocale();
  const progress = useProgress();
  const days = streak(progress.activeDays, localDay());

  return (
    <div className="flex items-center gap-2" data-xp-pill>
      {days > 0 && (
        <span
          className="flex h-11 items-center gap-1.5 rounded-xl border border-amber/25 bg-amber/10 px-3 font-mono text-[12px] text-amber"
          title={`${days} ${t.streak}`}
        >
          <Fire size={16} weight="fill" aria-hidden />
          {days}
          <span className="sr-only">{t.streak}</span>
        </span>
      )}
      <Link
        href="/sign-in"
        aria-label={progress.profile ? `${t.myCard}: ${progress.profile.name}` : t.makeCard}
        className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.04] transition-colors duration-200 hover:bg-white/[0.1]"
      >
        {progress.profile ? (
          <Avatar id={progress.profile.avatar} className="size-8" iconSize={18} />
        ) : (
          <IdentificationCard size={20} className="text-violet" />
        )}
      </Link>
    </div>
  );
}

/**
 * Full-screen edge-to-edge layout shared by every module screen.
 * Houses the top navigation header, module banner, and entire module content
 * without artificial bounding boxes or borders.
 */
export function ModuleShell({
  module,
  children,
}: {
  module: KalpaModule;
  children: (band: Band, profile: Profile) => ReactNode;
}) {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const hydrated = useHydrated();
  const Icon = module.icon;
  const accent = accentOf(module.accent);
  const profile = progress.profile;
  const band = profile ? bandOf(profile.grade) : null;

  useEffect(() => {
    authService.syncWithServer();
  }, []);

  return (
    <div
      data-band={band ?? undefined}
      style={band ? ({ "--band": BAND_INFO[band].accent } as React.CSSProperties) : undefined}
      className="relative isolate min-h-[100dvh] w-full"
    >
      {/* Consistent Cosmic Purple & LivingTree Blossom Atmosphere across all modules */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f8f6fc] dark:bg-[#080312]">
        {/* 1. Underlying Signature Chrome Waves */}
        <ChromeWaves />

        {/* 2. Harmonious Plum & Cosmic Purple Mixup */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.2),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(236,72,153,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.14),transparent_60%)]" />

        {/* 3. Blooming Wishing Tree with drifting petals hugging the left side */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden sm:block h-full w-[36vw] min-w-[240px] max-w-[500px] overflow-hidden opacity-75 transform-gpu"
          style={{
            maskImage: "linear-gradient(to right, #000 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, #000 60%, transparent 100%)",
          }}
        >
          <LivingTree />
        </div>

        {/* 4. Soft Vignette Edge Shadow for Content Contrast & Space Depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(4,1,8,0.35)_75%,rgba(2,0,5,0.75)_100%)]" />
      </div>

      {/* Cosmic Particles & Interactive Petal Bursts Layer (Across All 3 Modules) */}
      <CosmicParticleLayer moduleSlug={module.slug} />

      {/* Main Full-Screen Content Layer */}
      <div className={`relative z-10 flex min-h-[100dvh] w-full flex-col ${module.slug === "learn" ? "px-3 py-3 sm:px-6 sm:py-5 md:px-8 lg:px-10" : "px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10 xl:px-14"}`}>
        {/* 1. Header: Back to home, module switcher tabs, XP pill & language selector */}
        {(!profile || module.slug !== "learn") && (
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 dark:border-white/[0.08] pb-4 sm:pb-5">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="group flex h-11 items-center gap-2 rounded-xl border border-line bg-white/[0.04] px-3 text-sm transition-colors duration-200 hover:bg-white/[0.1]"
              >
                <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                <BrandMark className="size-5 text-violet" />
                <span className="sr-only sm:not-sr-only">{t.home}</span>
              </Link>
              <nav aria-label={t.modulesTitle} className="flex gap-1 rounded-xl border border-line bg-white/[0.03] p-1">
                {MODULES.map((m) => {
                  const ModIcon = m.icon;
                  const active = m.slug === module.slug;
                  const tabAccent = accentOf(m.accent);
                  return (
                    <Link
                      key={m.id}
                      href={`/m/${m.slug}`}
                      aria-current={active ? "page" : undefined}
                      title={m.title[locale]}
                      className={`grid size-10 place-items-center rounded-lg transition-colors duration-200 ${
                        active ? tabAccent.tabActive : "text-muted hover:bg-white/[0.06] hover:text-text"
                      }`}
                    >
                      <ModIcon size={18} weight={active ? "fill" : "regular"} aria-hidden />
                      <span className="sr-only">{m.title[locale]}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ProgressPill />
              <SoundToggle />
              <ThemeToggle />
              <LangSelect />
            </div>
          </header>
        )}

        {/* 2. Module Banner: Styled hero matching Module 1 exactly */}
        {module.slug !== "learn" && (
          <section className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-3xl border border-purple-800/30 bg-gradient-to-r from-[#170a2c]/80 via-[#210e3f]/60 to-[#120724]/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(10,4,20,0.5)]">
            {/* Left: Titles matching 1st module */}
            <div className="lg:col-span-6 flex flex-col gap-2.5">
              <h1 className="module-hero-title font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_18px_rgba(168,85,247,0.35)]">
                {module.title[locale]}
              </h1>
              <p className="font-display text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-300 bg-clip-text text-transparent">
                {locale === "en" ? "Explore. Discover. Grow." : "ஆராய்க. வளர்க. உயர்க."}
              </p>
              <p className="font-headline text-sm sm:text-base text-purple-200/70 max-w-md">
                {locale === "en"
                  ? "Your learning journey, beautifully connected."
                  : "உங்கள் கற்றல் பயணம், அழகாக இணைக்கப்பட்டுள்ளது."}
              </p>
            </div>

            {/* Right: 3D Scene */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] aspect-[780/324] cosmic-prop-float transition-transform duration-500 hover:scale-[1.03]">
                <Image
                  src={module.slug === "grow" ? "/images/modules/tree-growth.png" : "/images/modules/gk-songs-raw.png"}
                  alt={module.title[locale]}
                  fill
                  priority
                  className="object-contain drop-shadow-[0_10px_35px_rgba(168,85,247,0.4)]"
                />
              </div>
            </div>
          </section>
        )}

        {/* 3. Main Content: Full Screen Width across all modules */}
        <main className={`${module.slug === "learn" ? "mt-2 sm:mt-3" : "mt-8 sm:mt-10"} flex-1 w-full pb-8 sm:pb-12`}>
          {!hydrated ? (
            <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-line bg-surface/60" />
          ) : profile && band ? (
            children(band, profile)
          ) : (
            <div className="mx-auto max-w-4xl rounded-[28px] border border-line bg-surface/80 p-5 backdrop-blur-sm sm:p-10">
              <LearnerSetup redirectTo={module.slug === "learn" ? "/m/learn" : undefined} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
