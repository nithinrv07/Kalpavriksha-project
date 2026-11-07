"use client";

import { ArrowLeft, ArrowSquareOut, FilePdf, Fire, IdentificationCard } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { LangSelect } from "@/components/landing/lang-select";
import { useLocale } from "@/components/locale-provider";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { useProgress } from "@/components/progress-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { SoundToggle } from "@/components/sound-toggle";
import { BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { PROFILE_TEXTBOOK_LINKS } from "@/lib/textbook-links";
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
        className="hidden h-11 items-center gap-3 rounded-xl border border-line bg-ink/[0.04] px-3.5 sm:flex"
        title={`${progress.xp} XP`}
      >
        <span className="font-mono text-[12px] text-muted">
          {t.level} <span className="text-text">{level}</span>
        </span>
        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink/[0.08]">
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
      {progress.profile ? (
        <ProfileMenu profile={progress.profile} />
      ) : (
        <Link
          href="/sign-in"
          aria-label={t.makeCard}
          className="grid size-11 place-items-center rounded-xl border border-line bg-ink/[0.04] transition-colors duration-200 hover:bg-ink/[0.1]"
        >
          <IdentificationCard size={20} className="text-violet" />
        </Link>
      )}
    </div>
  );
}

/** Avatar button that opens a small panel with the student's class, growth stage and progress. */
function ProfileMenu({ profile }: { profile: Profile }) {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const band = bandOf(profile.grade);
  const { level } = levelOf(progress.xp);
  const days = streak(progress.activeDays, localDay());

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${t.myCard}: ${profile.name}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-xl border border-line bg-ink/[0.04] transition-colors duration-200 hover:bg-ink/[0.1] aria-expanded:border-violet/50 aria-expanded:bg-ink/[0.1]"
      >
        <Avatar id={profile.avatar} className="size-8" iconSize={18} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={t.myCard}
          style={{ "--band": BAND_INFO[band].accent } as React.CSSProperties}
          className="pop-in absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-surface p-4 text-left shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]"
        >
          <div className="flex items-center gap-3">
            <Avatar id={profile.avatar} className="size-12" iconSize={26} />
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-tight text-text">{profile.name}</p>
              <p className="font-mono text-[11px] text-muted">{profile.studentId}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--band)_40%,transparent)] bg-[color-mix(in_srgb,var(--band)_10%,transparent)] px-2 py-1.5 text-[13px] text-[var(--band)]">
            <GrowthStage band={band} className="size-6 shrink-0" />
            <span>
              {SETUP_COPY[locale].classWord} {profile.grade} · {BAND_INFO[band].name[locale]}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-ink/[0.05] p-2">
              <p className="font-mono text-base text-text">{level}</p>
              <p className="font-mono text-[10px] text-muted">{t.level}</p>
            </div>
            <div className="rounded-xl bg-ink/[0.05] p-2">
              <p className="font-mono text-base text-violet">{progress.xp}</p>
              <p className="font-mono text-[10px] text-muted">XP</p>
            </div>
            <div className="rounded-xl bg-ink/[0.05] p-2">
              <p className="flex items-center justify-center gap-1 font-mono text-base text-amber">
                <Fire size={14} weight="fill" aria-hidden />
                {days}
              </p>
              <p className="font-mono text-[10px] text-muted">{t.streak}</p>
            </div>
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
              <FilePdf size={14} weight="duotone" className="text-violet" aria-hidden />
              Official TN Textbooks
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {PROFILE_TEXTBOOK_LINKS.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px] text-text transition-colors hover:bg-ink/[0.06]"
                  >
                    {link.label}
                    <ArrowSquareOut size={13} className="shrink-0 text-muted" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/sign-in"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border border-line text-[13px] text-text transition-colors hover:bg-ink/[0.06]"
          >
            <IdentificationCard size={16} aria-hidden />
            {t.myCard}
          </Link>
        </div>
      )}
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
  const isJuniorLearn = module.slug === "learn" && profile && profile.grade >= 1 && profile.grade <= 3;

  return (
    <div className="relative isolate min-h-[100dvh] w-full">
      {/* Full-screen module layout: the panel fills the window edge to edge. */}
      <div
        data-band={band ?? undefined}
        // The Class 1–3 cosmic Learn screen is a night-sky scene in both themes.
        data-theme={isJuniorLearn ? "dark" : undefined}
        style={band ? ({ "--band": BAND_INFO[band].accent } as React.CSSProperties) : undefined}
        className={`fade-up relative z-10 flex min-h-[100dvh] w-full flex-col ${isJuniorLearn ? "bg-gradient-to-b from-[#130722] via-[#090314] to-[#04010a]" : "bg-bg"} px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8`}
      >
        {/* Content keeps a readable width on very wide screens. */}
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
          {/* 1. Header: Back to home, module switcher tabs, XP pill & language selector */}
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.08] pb-4 sm:pb-6">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="group flex h-11 items-center gap-2 rounded-xl border border-line bg-ink/[0.04] px-3 text-sm transition-colors duration-200 hover:bg-ink/[0.1]"
              >
                <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                <BrandMark className="size-5 text-violet" />
                <span className="sr-only sm:not-sr-only">{t.home}</span>
              </Link>
              <nav aria-label={t.modulesTitle} className="flex gap-1 rounded-xl border border-line bg-ink/[0.03] p-1">
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
                        active ? tabAccent.tabActive : "text-muted hover:bg-ink/[0.06] hover:text-text"
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

          {/* 2. Module Banner: Icon, Title, Summary & Grade Badge */}
          {!isJuniorLearn && (
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
            </div>
          </div>
          )}

          {/* 3. Main Content: Everything inside this black layout */}
          <main className={`${module.slug === "learn" ? "mt-5 sm:mt-6" : "mt-8 sm:mt-10"} flex-1`}>
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
