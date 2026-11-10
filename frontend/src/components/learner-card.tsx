"use client";

import { ArrowLeft, ArrowRight, CheckCircle, PencilSimple, Trash } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LivingTree } from "@/components/landing/living-tree";
import { CosmicParticleLayer } from "@/components/cosmic-particle-layer";
import { LangSelect } from "@/components/landing/lang-select";
import { GrowthStage, LearnerSetup, useHydrated } from "@/components/learner-setup";
import { LiquidGlassSurface } from "@/components/liquid-glass-surface";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCompletedChaptersList } from "@/lib/learning-track";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { BAND_INFO, boardName, SETUP_COPY } from "@/lib/bands";
import { SENIOR_GROUPS } from "@/lib/curriculum";
import { LOCALE_LABEL, type Locale } from "@/lib/i18n";
import { bandOf, levelOf, localDay, setProfile, streak, type Profile } from "@/lib/progress";

/** The seven local days ending today, for the streak dots. */
function lastSevenDays(today: string, locale: Locale) {
  const formatter = new Intl.DateTimeFormat(locale === "ta" ? "ta-IN" : "en-GB", { weekday: "narrow" });
  const base = new Date(`${today}T12:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(base);
    date.setDate(date.getDate() - (6 - i));
    return { key: localDay(date), weekday: formatter.format(date), isToday: i === 6 };
  });
}

/** The year a profile was created, read from its student code. */
function joinedYear(studentId: string): number | null {
  const match = studentId.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

type CardProps = {
  readonly profile: Profile;
  readonly confirming: boolean;
  readonly onRemove: () => void;
  readonly onBlurRemove: () => void;
};

/** The learner's progress card: growth stage, level, streak — one surface in the canopy. */
function Card({ profile, confirming, onRemove, onBlurRemove }: CardProps) {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const band = bandOf(profile.grade);
  const info = BAND_INFO[band];
  const { level, into, span } = levelOf(progress.xp);
  const c = SETUP_COPY[locale];
  const today = localDay();
  const dayStreak = streak(progress.activeDays, today);
  const activeDays = new Set(progress.activeDays);
  const week = lastSevenDays(today, locale);
  const since = joinedYear(profile.studentId);
  const xpLine = c.xpProgress(into, span, level + 1);

  return (
    <div
      style={{ "--band": info.accent } as React.CSSProperties}
      className="learner-card mx-auto w-full max-w-[420px] p-6 sm:p-7"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-display text-[15px] tracking-tight">
            <BrandMark className="size-5 text-violet" />
            Kalpavriksha
          </span>
          <span className="text-[11.5px] text-muted">{c.cardTitle}</span>
        </div>

        {/* The growth stage is the hero: one mascot, sized by band. */}
        <div className="mt-6 grid place-items-center">
          <div className="relative grid size-28 place-items-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 62%, color-mix(in srgb, var(--band) 26%, transparent), transparent 70%)",
              }}
            />
            <GrowthStage band={band} className="relative size-28" />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
            <p className="font-display text-[20px] leading-none tracking-tight">
              {t.level} {level}
            </p>
            <p className="text-[11.5px] text-muted">{xpLine}</p>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={span}
            aria-valuenow={into}
            aria-label={xpLine}
            className="mt-3 h-1.5 overflow-hidden rounded-full"
            style={{ background: "color-mix(in srgb, var(--band) 16%, transparent)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${Math.round((into / span) * 100)}%`, background: "var(--band)" }}
            />
          </div>
        </div>

        {/* Streak as the last seven days, not a competing stat tile. */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line/70 pt-4">
          <div className="flex items-end gap-1.5">
            {week.map((day) => {
              const on = activeDays.has(day.key);
              return (
                <div key={day.key} className="flex w-[22px] flex-col items-center gap-1.5">
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{
                      background: on ? "var(--band)" : "transparent",
                      border: `1px solid ${on ? "var(--band)" : "var(--line-strong)"}`,
                    }}
                  />
                  <span className={`text-[9px] ${day.isToday ? "text-text" : "text-muted/70"}`}>
                    {day.weekday}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="ml-auto shrink-0 text-[12.5px] text-muted">
            {dayStreak > 0 ? c.streakDays(dayStreak) : c.noStreak}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-[11.5px] text-muted">
          <span>{since ? c.learningSince(since) : ""}</span>
          {profile.preferredLanguage && (
            <span className="text-violet">
              {LOCALE_LABEL[profile.preferredLanguage]?.native ?? profile.preferredLanguage}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line/70 pt-4">
          <button
            type="button"
            onClick={onRemove}
            onBlur={onBlurRemove}
            className={`inline-flex items-center gap-2 text-[12.5px] transition-colors ${
              confirming ? "text-danger" : "text-muted hover:text-text"
            }`}
          >
            <Trash size={14} />
            {confirming ? c.confirmRemove : c.remove}
          </button>
          <p className="ml-auto max-w-[52%] text-right text-[11px] leading-snug text-muted/80">
            {c.deviceNote}
          </p>
        </div>
      </div>
    </div>
  );
}

function SignInScreenContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/m/learn";
  const { t, locale } = useLocale();
  const progress = useProgress();
  const { profile } = progress;
  const hydrated = useHydrated();
  const [editing, setEditing] = useState(() => searchParams?.get("edit") === "true");
  const [confirming, setConfirming] = useState(false);
  const c = SETUP_COPY[locale];
  const band = profile ? bandOf(profile.grade) : "middle";
  const seniorGroup =
    profile && profile.grade >= 11 && profile.seniorGroup
      ? SENIOR_GROUPS.find((g) => g.id === profile.seniorGroup)
      : undefined;

  const completedChapters = useMemo(
    () => (profile ? getCompletedChaptersList(progress.lessonsDone, profile.grade) : []),
    [progress.lessonsDone, profile],
  );

  const continueHref =
    profile?.lastAccessed
      ? `/m/learn?subject=${profile.lastAccessed.subjectId}&chapter=${profile.lastAccessed.chapterId}`
      : redirectTarget;

  return (
    <div className="relative isolate min-h-[100dvh] w-full overflow-hidden">
      <ChromeWaves />

      {/* Veiled wishing tree: the page's living backdrop, cleared behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden h-full w-[52vw] min-w-[300px] max-w-[700px] overflow-hidden opacity-80 lg:block"
        style={{
          maskImage: "linear-gradient(to right, #000 82%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, #000 82%, transparent 100%)",
        }}
      >
        <LivingTree />
      </div>

      {/* Veil clears the canopy just behind the learner card. The setup panel
          is its own glass, so it does not need clearing. */}
      {profile && !editing && (
        <div aria-hidden className="signin-veil pointer-events-none fixed inset-0 z-[1]" />
      )}

      {/* Header band: clears the canopy under the top buttons. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-32"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 88%, transparent) 0%, color-mix(in srgb, var(--bg) 45%, transparent) 48%, transparent 100%)",
        }}
      />

      {/* Cosmic Particles & Interactive Petal Bursts Layer (under the card) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
        <CosmicParticleLayer moduleSlug="learn" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-4 pb-24 sm:px-6">
        <header className="flex items-center justify-between gap-3 py-4 sm:py-6">
          <Link
            href="/"
            className="group flex h-11 items-center gap-2 rounded-xl border border-line bg-surface/65 px-3 text-sm backdrop-blur-xl transition-colors duration-200 hover:bg-surface/85"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <BrandMark className="size-5 text-violet" />
            <span>{t.home}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangSelect />
          </div>
        </header>

        <main className="mt-6 sm:mt-10">
          {!hydrated ? (
            <div aria-hidden className="mx-auto h-96 w-full max-w-[520px] animate-pulse rounded-3xl border border-line bg-surface/60" />
          ) : !profile || editing ? (
            <LiquidGlassSurface
              radius={28}
              className="border border-line p-5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] sm:p-10"
            >
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
            </LiquidGlassSurface>
          ) : (
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Unboxed greeting rail on the left. */}
              <div className="mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-[520px] lg:pt-6">
                <h1 className="font-display text-[clamp(32px,4vw,46px)] leading-[1.02] tracking-[-0.045em]">
                  {c.hello(profile.name)}
                </h1>
                <p className="mt-4 text-[15px] font-medium">
                  {c.classWord} {profile.grade} · {BAND_INFO[band].name[locale].split(" (")[0]}
                  {seniorGroup && <span className="text-violet"> · {seniorGroup.name[locale]}</span>}
                </p>
                <p className="mt-2 text-[14px] text-muted">{boardName(profile.board, locale)}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">
                  {BAND_INFO[band].tagline[locale]}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={continueHref}
                    className="theme-signin group inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full border px-6 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {c.continueLearning}
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-line px-5 text-sm transition-colors hover:bg-violet/10"
                  >
                    <PencilSimple size={16} />
                    {c.edit}
                  </button>
                </div>

                {completedChapters.length > 0 && (
                  <div className="mt-8 border-t border-line/70 pt-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-muted">
                        <CheckCircle size={15} weight="fill" className="text-emerald-500" />
                        {locale === "ta" ? "நிறைவு செய்த பாடங்கள்" : "Completed Chapters"} ({completedChapters.length})
                      </span>
                      <Link
                        href="/m/learn"
                        className="text-xs text-violet hover:underline"
                      >
                        {locale === "ta" ? "அனைத்தும்" : "View all"}
                      </Link>
                    </div>
                    <div className="mt-3 flex max-h-44 flex-col gap-2 overflow-y-auto pr-1">
                      {completedChapters.map((item) => (
                        <div
                          key={item.chapterId}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/50 px-3 py-2 backdrop-blur-md"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-text">
                              {item.chapterNumber
                                ? `${locale === "ta" ? "அத்தியாயம்" : "Ch."} ${item.chapterNumber}: `
                                : ""}
                              {locale === "ta" ? item.chapterTitle.ta : item.chapterTitle.en}
                            </p>
                            <p className="truncate text-[11px] text-muted">
                              {locale === "ta" ? item.subjectName.ta : item.subjectName.en} · {c.classWord}{" "}
                              {item.standard}
                            </p>
                          </div>
                          <Link
                            href={item.reviewHref}
                            className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:bg-violet/10 hover:text-text"
                          >
                            {locale === "ta" ? "மீண்டும் படிக்க" : "Review"}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* The learner card sits on the right. */}
              <Card
                profile={profile}
                confirming={confirming}
                onRemove={() => {
                  if (!confirming) return setConfirming(true);
                  updateProgress((p) => setProfile(p, null));
                  setConfirming(false);
                }}
                onBlurRemove={() => setConfirming(false)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function SignInScreen() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl border border-line bg-surface/60" />}>
      <SignInScreenContent />
    </Suspense>
  );
}
