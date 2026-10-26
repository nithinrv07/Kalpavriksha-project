"use client";

import { ArrowLeft, Fire, IdentificationCard } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LangSelect } from "@/components/landing/lang-select";
import { useLocale } from "@/components/locale-provider";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { PulsatingBorder } from "@/components/pulsating-border";
import { useProgress } from "@/components/progress-store";
import { SoundToggle } from "@/components/sound-toggle";
import { BAND_INFO } from "@/lib/bands";
import { bandOf, levelOf, localDay, streak, type Band, type Profile } from "@/lib/progress";
import { MODULES, type KalpaModule } from "@/modules/registry";
import { accentOf } from "@/modules/accents";

/** XP, level and streak: the shared student profile, visible on every module. */
function ProgressPill() {
  const { t } = useLocale();
  const progress = useProgress();
  const { level, into, span } = levelOf(progress.xp);
  const days = streak(progress.activeDays, localDay());

  return (
    <div className="flex items-center gap-2" data-xp-pill>
      <div
        className="hidden h-11 items-center gap-3 rounded-xl border border-line bg-white/[0.04] px-3.5 sm:flex"
        title={`${progress.xp} XP`}
      >
        <span className="font-mono text-[12px] text-muted">
          {t.level} <span className="text-text">{level}</span>
        </span>
        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-glow-a to-glow-b transition-[width] duration-700"
            style={{ width: `${Math.round((into / span) * 100)}%` }}
          />
        </span>
        <span className="font-mono text-[12px] text-violet-ink">{progress.xp} XP</span>
      </div>
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
 * Page frame shared by every module screen:
 * Encased in a dedicated solid black layout frame with pulsating structural border glow,
 * housing the header, module title banner, and entire module content.
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

  return (
    <div className="relative isolate min-h-[100dvh] w-full px-2 py-3 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <ChromeWaves />

      {/* Main Module Layout Frame */}
      <div
        data-band={band ?? undefined}
        style={band ? ({ "--band": BAND_INFO[band].accent } as React.CSSProperties) : undefined}
        className="hero-frame fade-up relative z-10 mx-auto w-full max-w-[1280px]"
      >
        {/* Pulsating border glow around the module frame boundaries */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
          <PulsatingBorder colors={["#000000", "#ffffff", accent.hex]} thickness={0.35} />
        </div>

        {/* Solid deep black layout container */}
        <div className="relative z-10 flex min-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden rounded-[22px] border border-line bg-black p-4 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.95),0_0_90px_-25px_rgb(124_58_237/0.35),inset_0_1px_0_rgb(255_255_255/0.06)] sm:p-7 lg:rounded-[28px] lg:p-9">
          {/* 1. Header: Back to home, module switcher tabs, XP pill & language selector */}
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 sm:pb-6">
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
              <LangSelect />
            </div>
          </header>

          {/* 2. Module Banner: Icon, Title, Summary & Grade Badge */}
          <div className="fade-up mt-6 flex items-start gap-4 sm:mt-8 sm:items-center">
            <span className={`hidden size-14 shrink-0 place-items-center overflow-hidden rounded-2xl sm:grid ${accent.banner}`}>
              {module.iconImage ? (
                <Image
                  src={module.iconImage}
                  alt={module.title[locale]}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Icon size={28} weight="duotone" />
              )}
            </span>
            <div>
              <p className={`font-mono text-[12px] ${accent.text}`}>{module.index}</p>
              <h1
                className={`font-display text-text ${
                  locale === "en"
                    ? "text-[clamp(36px,5.5vw,68px)] leading-[0.95] tracking-[-0.05em]"
                    : "text-[clamp(28px,4.4vw,54px)] leading-[1.1] tracking-[-0.01em]"
                }`}
              >
                {module.title[locale]}
              </h1>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{module.summary[locale]}</p>
              {band && (
                <Link
                  href="/sign-in"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--band)_40%,transparent)] bg-[color-mix(in_srgb,var(--band)_10%,transparent)] py-1 pl-1 pr-3 text-[12.5px] text-[var(--band)] transition-colors hover:bg-[color-mix(in_srgb,var(--band)_18%,transparent)]"
                >
                  <GrowthStage band={band} className="size-6" />
                  {BAND_INFO[band].name[locale]} · {BAND_INFO[band].classes[locale]}
                </Link>
              )}
            </div>
          </div>

          {/* 3. Main Content: Everything inside this black layout */}
          <main className="mt-8 flex-1 sm:mt-10">
            {!hydrated ? (
              <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-line bg-surface/60" />
            ) : profile && band ? (
              children(band, profile)
            ) : (
              <div className="rounded-[28px] border border-line bg-surface/80 p-5 backdrop-blur-sm sm:p-10">
                <LearnerSetup />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
