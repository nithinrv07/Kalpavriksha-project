"use client";

import { ArrowLeft, ArrowRight, Fire, PencilSimple, ShieldCheck, Trash } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LangSelect } from "@/components/landing/lang-select";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { LOCALE_LABEL } from "@/lib/i18n";
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
            {profile.email && (
              <p className="truncate font-mono text-[11px] text-muted">{profile.email}</p>
            )}
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
        <div className="mt-6 flex items-center justify-between font-mono text-[12px] text-muted">
          <span className="tracking-[0.16em]">{profile.studentId}</span>
          {profile.preferredLanguage && (
            <span className="text-[11px] uppercase tracking-wider text-violet">
              {LOCALE_LABEL[profile.preferredLanguage]?.native ?? profile.preferredLanguage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SignInScreenContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/m/learn";
  const { t, locale } = useLocale();
  const { profile } = useProgress();
  const hydrated = useHydrated();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const c = SETUP_COPY[locale];

  const continueHref =
    profile?.lastAccessed
      ? `/m/learn?subject=${profile.lastAccessed.subjectId}&chapter=${profile.lastAccessed.chapterId}`
      : redirectTarget;

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
              <LearnerSetup
                existing={profile}
                redirectTo={redirectTarget}
                onDone={() => setEditing(false)}
              />
            </div>
          ) : (
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
              <div className="fade-up">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet-deep/20 px-3 py-1 font-mono text-[11px] text-violet-ink">
                  <ShieldCheck size={14} weight="fill" />
                  Mock Authentication (School Standard Profile Active)
                </div>
                <p className="font-mono text-[13px] text-violet">{t.myCard}</p>
                <h1 className="mt-2 font-display text-[clamp(36px,5.5vw,72px)] leading-[0.95] tracking-[-0.05em]">
                  {c.hello(profile.name)}
                </h1>
                <p className="mt-3 text-[16px] text-text font-medium">
                  {c.classWord} {profile.grade} Student · {BAND_INFO[bandOf(profile.grade)].name[locale]}
                </p>
                <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-muted">
                  {BAND_INFO[bandOf(profile.grade)].tagline[locale]}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={continueHref}
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

export function SignInScreen() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl border border-line bg-surface/60" />}>
      <SignInScreenContent />
    </Suspense>
  );
}
