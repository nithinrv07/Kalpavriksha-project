"use client";

import { ArrowLeft, ArrowRight, Fire, PencilSimple, Trash } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LangSelect } from "@/components/landing/lang-select";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { bandOf, levelOf, localDay, setProfile, streak, type Profile } from "@/lib/progress";

/** The student's ID card: avatar, class band and progress at a glance. */
function Card({ profile }: { profile: Profile }) {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const band = bandOf(profile.grade);
  const info = BAND_INFO[band];
  const { level, into, span } = levelOf(progress.xp);
  const c = SETUP_COPY[locale];

  return (
    <div
      style={{ "--band": info.accent } as React.CSSProperties}
      className="pop-in relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] border border-line-strong bg-surface-2 p-6 shadow-[0_30px_90px_-20px_rgb(0_0_0/0.9),0_0_80px_-30px_var(--band)]"
    >
      {/* Holographic sheen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_var(--beam-angle),transparent_0_60%,color-mix(in_srgb,var(--band)_35%,transparent)_75%,transparent_90%)] opacity-60 [animation:beam_9s_linear_infinite]"
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-display text-[15px] tracking-tight">
            <BrandMark className="size-5 text-violet" />
            Kalpavriksha
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.cardTitle}</span>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Avatar id={profile.avatar} className="size-20 shadow-[0_0_40px_-6px_var(--band)]" iconSize={44} />
          <div className="min-w-0">
            <p className="truncate font-display text-3xl tracking-[-0.03em]">{profile.name}</p>
            <p className="mt-1 font-mono text-[12px] text-[var(--band)]">
              {c.classWord} {profile.grade} · {info.name[locale]}
            </p>
          </div>
          <GrowthStage band={band} className="ml-auto size-16 shrink-0" />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/[0.04] p-3">
            <p className="font-mono text-xl text-text">{level}</p>
            <p className="font-mono text-[10.5px] text-muted">{t.level}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.04] p-3">
            <p className="font-mono text-xl text-violet-ink">{progress.xp}</p>
            <p className="font-mono text-[10.5px] text-muted">XP</p>
          </div>
          <div className="rounded-2xl bg-white/[0.04] p-3">
            <p className="flex items-center justify-center gap-1 font-mono text-xl text-amber">
              <Fire size={18} weight="fill" aria-hidden />
              {streak(progress.activeDays, localDay())}
            </p>
            <p className="font-mono text-[10.5px] text-muted">{t.streak}</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-glow-a to-[var(--band)]"
            style={{ width: `${Math.round((into / span) * 100)}%` }}
          />
        </div>
        <p className="mt-6 font-mono text-[12px] tracking-[0.2em] text-muted">{profile.studentId}</p>
      </div>
    </div>
  );
}

export function SignInScreen() {
  const { t, locale } = useLocale();
  const { profile } = useProgress();
  const hydrated = useHydrated();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const c = SETUP_COPY[locale];

  return (
    <>
      <ChromeWaves />
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-4 pb-24 sm:px-6">
        <header className="flex items-center justify-between gap-3 py-4 sm:py-6">
          <Link
            href="/"
            className="group flex h-11 items-center gap-2 rounded-xl border border-line bg-white/[0.04] px-3 text-sm transition-colors duration-200 hover:bg-white/[0.1]"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <BrandMark className="size-5 text-violet" />
            <span>{t.home}</span>
          </Link>
          <LangSelect />
        </header>

        <main className="mt-6 sm:mt-10">
          {!hydrated ? (
            <div aria-hidden className="h-96 animate-pulse rounded-3xl border border-line bg-surface/60" />
          ) : !profile || editing ? (
            <div className="rounded-[28px] border border-line bg-surface/80 p-5 backdrop-blur-sm sm:p-10">
              {profile && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="mb-6 inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition-colors hover:text-text"
                >
                  <ArrowLeft size={14} />
                  {c.back}
                </button>
              )}
              <LearnerSetup existing={profile} onDone={() => setEditing(false)} />
            </div>
          ) : (
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
              <div className="fade-up">
                <p className="font-mono text-[13px] text-violet">{t.myCard}</p>
                <h1 className="mt-3 font-display text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-0.05em]">
                  {c.hello(profile.name)}
                </h1>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                  {BAND_INFO[bandOf(profile.grade)].tagline[locale]}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/m/learn"
                    className="beam-border group inline-flex h-14 items-center gap-3 rounded-full bg-violet-deep px-7 font-mono text-sm text-violet-ink transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {c.continueLearning}
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex h-14 items-center gap-2 rounded-full border border-line px-6 text-sm transition-colors hover:bg-white/[0.06]"
                  >
                    <PencilSimple size={16} />
                    {c.edit}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirming) return setConfirming(true);
                    updateProgress((p) => setProfile(p, null));
                    setConfirming(false);
                  }}
                  onBlur={() => setConfirming(false)}
                  className={`mt-6 inline-flex items-center gap-2 text-[13px] transition-colors ${
                    confirming ? "text-danger" : "text-muted hover:text-text"
                  }`}
                >
                  <Trash size={14} />
                  {confirming ? c.confirmRemove : c.remove}
                </button>
                <p className="mt-6 max-w-md text-[12.5px] text-muted/80">{c.deviceNote}</p>
              </div>
              <Card profile={profile} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
