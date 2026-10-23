"use client";

import Link from "next/link";
import {
  ArrowSquareOut,
  BookOpen,
  CaretRight,
  CheckCircle,
  Fire,
  GraduationCap,
  Lightning,
  Sparkle,
  Trophy,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import type { Band } from "@/lib/progress";
import type { LearningTrackStats } from "@/lib/learning-track";
import { GROW_COPY } from "./content";

export function LearningTrackCard({
  stats,
  band,
  onOpenStandardSwitcher,
}: {
  stats: LearningTrackStats;
  band: Band;
  onOpenStandardSwitcher: () => void;
}) {
  const { locale } = useLocale();
  const c = GROW_COPY[locale];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-5 sm:p-7">
      {/* Background ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--violet)_18%,transparent),transparent_70%)]"
      />

      {/* Header with Title and Standard Switcher */}
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-violet/20 text-violet">
              <GraduationCap size={20} weight="fill" />
            </span>
            <h2 className="font-display text-xl sm:text-2xl tracking-[-0.02em]">
              {c.learningTrackTitle}
            </h2>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted max-w-2xl">
            {c.learningTrackSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenStandardSwitcher}
          className="inline-flex self-start items-center gap-2 rounded-full border border-violet/40 bg-violet-deep/40 px-4 py-2 font-mono text-xs text-violet-ink transition-all hover:border-violet hover:bg-violet-deep/60 sm:self-auto"
        >
          <span className="size-2 rounded-full bg-violet" />
          <span>{c.standardLabel(stats.standard)}</span>
          <span className="text-[11px] underline opacity-80 ml-1">{c.changeStandard}</span>
        </button>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="relative mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Metric 1: Curriculum Completion */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {c.curriculumMastery}
            </span>
            <Trophy size={16} className="text-amber" />
          </div>
          <div className="mt-2">
            <p className="font-display text-2xl font-bold">
              {stats.completedChaptersInStandard}
              <span className="font-mono text-xs text-muted font-normal">
                /{stats.totalChaptersInStandard}
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet to-emerald transition-all duration-700"
                style={{ width: `${Math.min(100, stats.standardPercentage)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-mono text-emerald">
              {stats.standardPercentage}% {c.statusCompleted}
            </p>
          </div>
        </div>

        {/* Metric 2: Total Lessons Mastered & Level */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {c.lessonsMastered}
            </span>
            <CheckCircle size={16} className="text-emerald" />
          </div>
          <div className="mt-2">
            <p className="font-display text-2xl font-bold">
              {stats.totalLessonsDoneOverall}
              <span className="font-mono text-xs text-muted font-normal">
                {" "}
                {stats.totalLessonsDoneOverall === 1 ? "lesson" : "lessons"}
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-amber transition-all duration-700"
                style={{ width: `${(stats.level.into / stats.level.span) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-mono text-amber">
              Level {stats.level.level} · {stats.xp} XP
            </p>
          </div>
        </div>

        {/* Metric 3: Quiz High Score */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {c.quizPerformance}
            </span>
            <Lightning size={16} className="text-yellow-400" />
          </div>
          <div className="mt-2">
            <p className="font-display text-2xl font-bold">
              {stats.quizBest}%
            </p>
            <p className="mt-2 text-[11.5px] text-muted">
              {stats.quizBest >= 80 ? (
                <span className="text-amber font-mono">★ Quiz Star Active</span>
              ) : (
                <span className="font-mono text-[11px] opacity-75">Target: 80%+</span>
              )}
            </p>
          </div>
        </div>

        {/* Metric 4: Study Streak */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {c.studyStreak}
            </span>
            <Fire size={16} className="text-orange-400" />
          </div>
          <div className="mt-2">
            <p className="font-display text-2xl font-bold">
              {stats.streakDays}
              <span className="font-mono text-xs text-muted font-normal">
                {" "}
                {stats.streakDays === 1 ? "day" : "days"}
              </span>
            </p>
            <p className="mt-2 text-[11.5px] text-muted font-mono">
              {stats.streakDays >= 3 ? (
                <span className="text-orange-400">🔥 On Fire Badge</span>
              ) : (
                <span className="font-mono text-[11px] opacity-75">3 days for Fire</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended / Last Accessed Chapter Banner */}
      {(stats.lastAccessed || stats.nextRecommendedChapter) && (
        <div className="relative mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line-strong bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-deep text-violet-ink">
              <BookOpen size={20} weight="duotone" />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {stats.lastAccessed ? c.continueLearning : c.resumeLesson}
              </p>
              <h3 className="text-[15px] font-semibold text-text">
                {stats.lastAccessed
                  ? stats.lastAccessed.chapterTitle[locale]
                  : stats.nextRecommendedChapter?.chapterTitle[locale]}
              </h3>
              <p className="text-[12px] text-muted">
                {stats.lastAccessed
                  ? stats.lastAccessed.subjectName[locale]
                  : stats.nextRecommendedChapter?.subjectName[locale]}
              </p>
            </div>
          </div>

          <Link
            href="/m/learn"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-deep px-4 py-2.5 font-mono text-xs text-violet-ink transition-all hover:translate-x-0.5"
          >
            <span>{stats.lastAccessed ? c.resumeLesson : c.startLearning}</span>
            <CaretRight size={14} weight="bold" />
          </Link>
        </div>
      )}

      {/* Subject-Wise Mastery Breakdown */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-semibold tracking-tight">
            {c.subjectProgress}
          </h3>
          <Link
            href="/m/learn"
            className="flex items-center gap-1 font-mono text-[11.5px] text-violet hover:underline"
          >
            <span>{c.viewInModule1}</span>
            <ArrowSquareOut size={13} />
          </Link>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.subjects.map((sub) => {
            return (
              <div
                key={sub.id}
                style={{ "--subj": sub.accent } as React.CSSProperties}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-surface-2/70 p-3.5 transition-all hover:border-[var(--subj)] hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-text group-hover:text-[var(--subj)]">
                      {sub.name[locale]}
                    </p>
                    <p className="font-mono text-[11.5px] text-muted">
                      {c.chaptersCompleted(sub.completedChapters, sub.totalChapters)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      sub.isComplete
                        ? "border border-emerald/40 bg-emerald/10 text-emerald"
                        : sub.completedChapters > 0
                          ? "border border-violet/40 bg-violet/10 text-violet"
                          : "border border-line bg-white/[0.02] text-muted"
                    }`}
                  >
                    {sub.isComplete
                      ? c.statusCompleted
                      : sub.completedChapters > 0
                        ? `${sub.percentage}%`
                        : c.statusNotStarted}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${sub.percentage}%`,
                        backgroundColor: sub.accent,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holistic Synergy Note */}
      <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-line bg-white/[0.02] p-4 text-[12.5px] text-muted">
        <Sparkle size={18} weight="fill" className="text-violet shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {c.academicsContributionHint}
        </p>
      </div>
    </section>
  );
}
