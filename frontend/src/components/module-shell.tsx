"use client";

import { ArrowLeft, Fire, IdentificationCard } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LivingTree } from "@/components/landing/living-tree";
import { LangSelect } from "@/components/landing/lang-select";
import { useLocale } from "@/components/locale-provider";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { useProgress } from "@/components/progress-store";
import { SoundToggle } from "@/components/sound-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { BAND_INFO } from "@/lib/bands";
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

  return (
    <div
      data-band={band ?? undefined}
      style={band ? ({ "--band": BAND_INFO[band].accent } as React.CSSProperties) : undefined}
      className="relative isolate min-h-[100dvh] w-full"
    >
      {module.slug === "learn" ? (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07020d]">
          {/* 1. Underlying Signature Chrome Waves (chromatic nebula + spiral orbit rings) */}
          <ChromeWaves />

          {/* 2. Harmonized Plum & Cosmic Purple Mixup matching landing page palette */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1328]/85 via-[#4e2f58]/45 to-[#06020c]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.28),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_35%,rgba(236,72,153,0.22),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.18),transparent_60%)]" />

          {/* 3. Blooming Wishing Tree with drifting petals on left side */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden sm:block h-full w-[45vw] min-w-[280px] max-w-[600px] overflow-hidden opacity-55 transform-gpu"
            style={{
              maskImage: "linear-gradient(to right, #000 75%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, #000 75%, transparent 100%)",
            }}
          >
            <LivingTree />
          </div>

          {/* 4. Ethereal cherry blossom branches framing top corners */}
          <div
            className="absolute top-0 left-0 w-44 h-56 bg-contain bg-no-repeat opacity-60 pointer-events-none"
            style={{ backgroundImage: `url('/images/learn/cherry-branch-left.png')` }}
          />
          <div
            className="absolute top-0 right-0 w-44 h-56 bg-contain bg-no-repeat bg-right-top opacity-50 pointer-events-none"
            style={{ backgroundImage: `url('/images/learn/cherry-branch-right.png')` }}
          />
        </div>
      ) : (
        <ChromeWaves />
      )}

      {/* Main Full-Screen Content Layer */}
      <div className={`relative z-10 flex min-h-[100dvh] w-full flex-col ${module.slug === "learn" ? "px-3 py-3 sm:px-6 sm:py-5 md:px-8 lg:px-10" : "px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10 xl:px-14"}`}>
        {/* 1. Header: Back to home, module switcher tabs, XP pill & language selector */}
        {module.slug !== "learn" && (
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 sm:pb-5">
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

        {/* 2. Module Banner: Icon, Title, Summary & Grade Badge */}
        {module.slug !== "learn" && (
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
        )}

        {/* 3. Main Content: Full Screen Width across all modules */}
        <main className={`${module.slug === "learn" ? "mt-2 sm:mt-3" : "mt-8 sm:mt-10"} flex-1 w-full pb-8 sm:pb-12`}>
          {profile && band ? (
            children(band, profile)
          ) : module.slug === "learn" ? (
            children("middle", {
              name: "Kavin",
              grade: 8,
              avatar: "cat",
              studentId: "KV-0008",
            })
          ) : !hydrated ? (
            <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-line bg-surface/60" />
          ) : (
            <div className="mx-auto max-w-4xl rounded-[28px] border border-line bg-surface/80 p-5 backdrop-blur-sm sm:p-10">
              <LearnerSetup />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
