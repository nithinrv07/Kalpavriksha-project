"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarBlank,
  Check,
  CheckCircle,
  Clock,
  Flag,
  Flame,
  Globe,
  GraduationCap,
  PencilSimple,
  Plant,
  Play,
  Star,
  Trash,
  Trophy,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LivingTree } from "@/components/landing/living-tree";
import { CosmicParticleLayer } from "@/components/cosmic-particle-layer";
import { LangSelect } from "@/components/landing/lang-select";
import { LearnerSetup, useHydrated } from "@/components/learner-setup";
import { LiquidGlassSurface } from "@/components/liquid-glass-surface";
import { FullScreenToggle } from "@/components/fullscreen-toggle";
import { enterFullscreen } from "@/lib/fullscreen";
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

type ProfileIdentityCardProps = {
  readonly profile: Profile;
  readonly confirming: boolean;
  readonly onRemove: () => void;
  readonly onBlurRemove: () => void;
};

/** Left Card: Student Avatar, Level, XP, Streak, Badges & Achievements */
function ProfileIdentityCard({ profile, confirming, onRemove, onBlurRemove }: ProfileIdentityCardProps) {
  const { locale } = useLocale();
  const progress = useProgress();
  const { level, into, span } = levelOf(progress.xp);
  const c = SETUP_COPY[locale];
  const today = localDay();
  const dayStreak = streak(progress.activeDays, today);
  const activeDays = new Set(progress.activeDays);
  const week = lastSevenDays(today, locale);
  const since = joinedYear(profile.studentId) ?? 2026;

  // Streak count: real streak or demo count
  const streakCount = dayStreak > 0 ? dayStreak : 3;

  return (
    <div className="rounded-3xl border border-purple-500/40 bg-[#0d0720]/80 p-5 sm:p-6 backdrop-blur-xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6),0_0_35px_rgba(168,85,247,0.22)] flex flex-col justify-between gap-5 transition-all duration-300 hover:border-purple-400/60">
      {/* 1. Avatar & Student Details */}
      <div className="flex items-center gap-4">
        {/* Glowing Tree Avatar */}
        <div className="relative shrink-0">
          <div className="relative grid size-20 sm:size-24 place-items-center rounded-full border border-purple-400/60 bg-gradient-to-br from-purple-800/50 via-purple-950/80 to-[#120826] p-1 shadow-[0_0_25px_rgba(168,85,247,0.45)]">
            <div className="relative size-full overflow-hidden rounded-full">
              <Image
                src="/images/profile-tree-avatar.png"
                alt="Student Profile Avatar"
                width={96}
                height={96}
                className="size-full object-cover"
                priority
              />
            </div>
          </div>
          {/* Level Star Badge on Bottom-Right */}
          <div className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-lg border border-purple-300/80 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)]">
            <Star size={14} weight="fill" className="text-amber-300" />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2 className="font-display text-2xl sm:text-[26px] font-bold text-white tracking-tight truncate">
            {profile.name || "Madu"}
          </h2>

          <p className="font-mono text-[10px] sm:text-[11px] text-purple-200/75 tracking-wider font-medium">
            Grow • Learn • Create • Lead
          </p>

          <div className="mt-0.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/20 px-2.5 py-0.5 font-mono text-xs text-purple-200">
              <GraduationCap size={13} weight="fill" className="text-purple-300" />
              <span>Learner</span>
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="flex items-center gap-1 font-display text-sm font-bold text-white">
              <Plant size={15} weight="fill" className="text-emerald-400" />
              <span>Level {level}</span>
            </span>
            <span className="font-mono text-[11px] text-purple-300/80">
              {into} of {span} XP • {span - into} XP to Level {level + 1}
            </span>
          </div>
        </div>
      </div>

      {/* 2. XP Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-purple-950/80 border border-purple-800/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-pink-400 shadow-[0_0_12px_rgba(168,85,247,0.7)] transition-all duration-500"
          style={{ width: `${Math.max(10, Math.round((into / span) * 100))}%` }}
        />
      </div>

      {/* 3. Weekly Learning Streak */}
      <div className="rounded-2xl border border-purple-800/40 bg-purple-950/25 p-3.5 sm:p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-bold text-white">
            <Flame size={16} weight="fill" className="text-orange-400" />
            <span>Weekly Learning Streak</span>
          </span>
          <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1">
            {streakCount} days <Flame size={14} weight="fill" className="text-orange-400" />
          </span>
        </div>

        {/* 7 Days tracker row */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {week.map((day, idx) => {
            const isCompleted = activeDays.has(day.key) || idx < 3; // 3 days in user mockup
            return (
              <div key={day.key} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`grid size-7 sm:size-8 place-items-center rounded-full transition-all ${
                    isCompleted
                      ? "border border-purple-400 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      : "border border-purple-800/50 bg-purple-950/40 text-purple-400/60"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={13} weight="bold" />
                  ) : (
                    <span className="text-[10px] font-mono">{idx === 6 ? "M" : ""}</span>
                  )}
                </div>
                <span className={`text-[10px] font-mono ${isCompleted ? "text-purple-200 font-bold" : "text-purple-400/60"}`}>
                  {day.weekday}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Info Tiles: Learning Since & Preferred Language */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-3 flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-purple-700/40 bg-purple-900/30 text-purple-300">
            <CalendarBlank size={18} weight="bold" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-purple-300/80 font-mono">Learning since</span>
            <span className="font-display text-sm font-bold text-white">{since}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-3 flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-purple-700/40 bg-purple-900/30 text-purple-300">
            <Globe size={18} weight="bold" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-purple-300/80 font-mono">Preferred Language</span>
            <span className="font-display text-sm font-bold text-white">
              {profile.preferredLanguage ? (LOCALE_LABEL[profile.preferredLanguage]?.native ?? "English") : "English"}
            </span>
          </div>
        </div>

        <div className="col-span-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-emerald-500/40 bg-emerald-900/30 text-emerald-400">
              <CheckCircle size={18} weight="fill" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-emerald-300/80 font-mono uppercase tracking-wider">
                {locale === "ta" ? "பாடங்கள் நிறைவு நிலை" : "Chapters Completed"}
              </span>
              <span className="font-display text-sm font-bold text-white">
                {progress.lessonsDone.length > 0
                  ? `${progress.lessonsDone.length} ${progress.lessonsDone.length === 1 ? "Chapter" : "Chapters"} Finished`
                  : (locale === "ta" ? "இன்னும் பாடங்கள் முடியவில்லை" : "No chapters finished yet")}
              </span>
            </div>
          </div>
          {progress.lessonsDone.length > 0 && (
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* 5. My Achievements Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-xs sm:text-sm font-bold text-white">
            My Achievements
          </span>
          <Link
            href="/m/learn"
            className="group inline-flex items-center gap-1 font-mono text-[11px] text-purple-300 hover:text-white transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Badge 1: First Login */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-purple-800/35 bg-purple-950/25 p-2 sm:p-2.5 transition-transform hover:scale-105">
            <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-800/30 text-emerald-400 mb-1.5 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              <Plant size={18} weight="fill" />
            </div>
            <span className="font-display text-[11px] font-bold text-white leading-tight">First Login</span>
            <span className="font-mono text-[9px] text-purple-300/70 mt-0.5">Oct 10, 2026</span>
          </div>

          {/* Badge 2: Chapters Completed */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-purple-800/35 bg-purple-950/25 p-2 sm:p-2.5 transition-transform hover:scale-105">
            <div
              className={`grid size-9 sm:size-10 place-items-center rounded-xl border mb-1.5 ${
                progress.lessonsDone.length > 0
                  ? "border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-emerald-800/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                  : "border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-800/30 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              }`}
            >
              <BookOpen size={18} weight="fill" />
            </div>
            <span className="font-display text-[11px] font-bold text-white leading-tight">
              {progress.lessonsDone.length > 0 ? `${progress.lessonsDone.length} Done` : "First Chapter"}
            </span>
            <span className="font-mono text-[9px] text-purple-300/70 mt-0.5">
              {progress.lessonsDone.length > 0 ? "Completed" : "In Progress"}
            </span>
          </div>

          {/* Badge 3: 3 Day Streak */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-purple-800/35 bg-purple-950/25 p-2 sm:p-2.5 transition-transform hover:scale-105">
            <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-800/30 text-amber-400 mb-1.5 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <Flame size={18} weight="fill" />
            </div>
            <span className="font-display text-[11px] font-bold text-white leading-tight">3 Day Streak</span>
            <span className="font-mono text-[9px] text-purple-300/70 mt-0.5">Keep going!</span>
          </div>

          {/* Badge 4: Explorer */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-purple-800/35 bg-purple-950/25 p-2 sm:p-2.5 transition-transform hover:scale-105">
            <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-800/30 text-pink-400 mb-1.5 shadow-[0_0_10px_rgba(244,114,182,0.2)]">
              <Star size={18} weight="fill" />
            </div>
            <span className="font-display text-[11px] font-bold text-white leading-tight">Explorer</span>
            <span className="font-mono text-[9px] text-purple-300/70 mt-0.5">Level {level}</span>
          </div>
        </div>
      </div>

      {/* Subtle Remove Device Option */}
      <div className="mt-1 flex items-center justify-between pt-2 border-t border-purple-900/30 text-[11px] text-purple-400/60">
        <button
          type="button"
          onClick={onRemove}
          onBlur={onBlurRemove}
          className={`inline-flex items-center gap-1.5 transition-colors ${
            confirming ? "text-rose-400 font-semibold" : "hover:text-purple-200"
          }`}
        >
          <Trash size={13} />
          <span>{confirming ? c.confirmRemove : c.remove}</span>
        </button>
        <span className="font-mono text-[10px] text-purple-400/50">Synced to student profile</span>
      </div>
    </div>
  );
}

type DashboardHubCardProps = {
  readonly profile: Profile;
  readonly continueHref: string;
  readonly onEdit: () => void;
};

/** Right Card: Greeting, Tree Art, Continue Learning, 4 Metrics, Learning Journey & Completed Chapters */
function DashboardHubCard({ profile, continueHref, onEdit }: DashboardHubCardProps) {
  const { locale } = useLocale();
  const progress = useProgress();
  const today = localDay();
  const dayStreak = streak(progress.activeDays, today);
  const streakCount = dayStreak;
  const lessonsCount = progress.lessonsDone.length;

  const completedChapters = useMemo(
    () => getCompletedChaptersList(progress.lessonsDone, profile.grade),
    [progress.lessonsDone, profile.grade],
  );

  const targetMilestone =
    lessonsCount < 5 ? 5 : Math.ceil((lessonsCount + 1) / 5) * 5;
  const remainingForMilestone = Math.max(1, targetMilestone - lessonsCount);

  return (
    <div className="rounded-3xl border border-purple-500/40 bg-[#0d0720]/80 p-5 sm:p-6 backdrop-blur-xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6),0_0_35px_rgba(168,85,247,0.22)] flex flex-col justify-between gap-5 transition-all duration-300 hover:border-purple-400/60">
      {/* 1. Header with Welcome Text & Tree Illustration */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[11px] text-purple-300/80 tracking-wide">
            Welcome to GSX Kalpavriksha
          </span>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
            Hi, {profile.name || "Madu"}! <span className="text-pink-400">🪻</span>
          </h1>

          {/* Metadata Chips: Class, Subject, Board */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-mono text-purple-200">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-900/40 border border-purple-700/40 px-2.5 py-1 text-purple-200">
              <GraduationCap size={13} className="text-purple-300" />
              Class {profile.grade || 6}
            </span>
            <span className="text-purple-400/40">|</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-900/40 border border-purple-700/40 px-2.5 py-1 text-purple-200">
              <BookOpen size={13} className="text-purple-300" />
              {profile.preferredLanguage === "ta" ? "தமிழ்" : "Tamil"}
            </span>
            <span className="text-purple-400/40">|</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-900/40 border border-purple-700/40 px-2.5 py-1 text-purple-200">
              🏛️ {boardName(profile.board, locale)}
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-[13px] text-purple-200/80 leading-relaxed max-w-lg">
            Every chapter you learn today builds a brighter tomorrow.
            <br />
            Keep going! You&apos;re doing great on your learning journey.
          </p>
        </div>

        {/* Tree Illustration on Meadow */}
        <div className="relative shrink-0 hidden sm:block">
          <div className="relative w-36 h-28 overflow-hidden rounded-2xl border border-purple-500/25 bg-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Image
              src="/images/profile-tree-art.png"
              alt="Kalpavriksha Wishing Tree"
              fill
              className="object-cover object-center drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>
      </div>

      {/* 2. Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={continueHref}
          onClick={() => {
            enterFullscreen();
          }}
          className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(168,85,247,0.7)]"
        >
          <div className="grid size-5 place-items-center rounded-full bg-white text-purple-700">
            <Play size={10} weight="fill" className="translate-x-[1px]" />
          </div>
          <span>Continue Learning</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-purple-400/35 bg-purple-950/40 px-5 py-2.5 text-sm font-medium text-purple-200 transition-all hover:border-purple-300 hover:bg-purple-900/50 hover:text-white"
        >
          <PencilSimple size={15} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 3. Four Metric Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: Chapters Completed */}
        <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-3 flex flex-col gap-1 transition-transform hover:scale-[1.02]">
          <BookOpen size={18} weight="fill" className="text-purple-400 mb-1" />
          <span className="font-display text-xl sm:text-2xl font-bold text-white leading-none">
            {lessonsCount}
          </span>
          <span className="text-[11px] text-purple-200/80 font-medium">Chapters Done</span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold mt-0.5">
            {lessonsCount > 0 ? `${lessonsCount} completed` : "Ready to learn"}
          </span>
        </div>

        {/* Metric 2: Hours Learned */}
        <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-3 flex flex-col gap-1 transition-transform hover:scale-[1.02]">
          <Clock size={18} weight="fill" className="text-purple-400 mb-1" />
          <span className="font-display text-xl sm:text-2xl font-bold text-white leading-none">
            {lessonsCount > 0 ? (lessonsCount * 0.5).toFixed(1) : "0.0"}
          </span>
          <span className="text-[11px] text-purple-200/80 font-medium">Hours Learned</span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold mt-0.5">
            {lessonsCount > 0 ? `+${(lessonsCount * 0.25).toFixed(1)} this week` : "Start today"}
          </span>
        </div>

        {/* Metric 3: Day Streak */}
        <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-3 flex flex-col gap-1 transition-transform hover:scale-[1.02]">
          <Flame size={18} weight="fill" className="text-orange-400 mb-1" />
          <span className="font-display text-xl sm:text-2xl font-bold text-white leading-none">
            {streakCount}
          </span>
          <span className="text-[11px] text-purple-200/80 font-medium">Day Streak</span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold mt-0.5">
            {streakCount > 0 ? "Keep it up!" : "Daily streak"}
          </span>
        </div>

        {/* Metric 4: Achievements */}
        <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-3 flex flex-col gap-1 transition-transform hover:scale-[1.02]">
          <Trophy size={18} weight="fill" className="text-amber-400 mb-1" />
          <span className="font-display text-xl sm:text-2xl font-bold text-white leading-none">
            {lessonsCount >= 1 ? 2 : 1}
          </span>
          <span className="text-[11px] text-purple-200/80 font-medium">Achievements</span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold mt-0.5">
            {lessonsCount >= 1 ? "Level 1 Achieved" : "First badge"}
          </span>
        </div>
      </div>

      {/* 4. Your Learning Journey Section */}
      <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-bold text-white">
            <Flag size={16} weight="fill" className="text-purple-400" />
            <span>Your Learning Journey</span>
          </span>
          <Link
            href="/m/learn"
            className="group inline-flex items-center gap-1 font-mono text-[11px] text-purple-300 hover:text-white transition-colors"
          >
            <span>View Progress</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          {/* 3 Step Connected Track */}
          <div className="flex-1 w-full flex items-center justify-between relative px-2">
            {/* Connecting Track Line */}
            <div className="absolute left-6 right-6 top-3.5 h-[2px] bg-purple-900/60 -z-0" />
            <div
              className="absolute left-6 top-3.5 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 -z-0 transition-all duration-500"
              style={{ width: lessonsCount > 0 ? "50%" : "15%" }}
            />

            {/* Step 1: Start */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="grid size-7 place-items-center rounded-full border border-purple-400 bg-purple-600 text-white shadow-sm">
                <Check size={13} weight="bold" />
              </div>
              <div className="text-center">
                <span className="block font-display text-[10px] font-bold text-white">Start</span>
                <span className="block font-mono text-[9px] text-purple-300/70">Profile Ready</span>
              </div>
            </div>

            {/* Step 2: Current */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`grid size-8 place-items-center rounded-full border-2 text-white transition-all ${
                  lessonsCount > 0
                    ? "border-emerald-400 bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    : "border-white bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                }`}
              >
                {lessonsCount > 0 ? <Check size={14} weight="bold" /> : <BookOpen size={14} weight="fill" />}
              </div>
              <div className="text-center">
                <span className="block font-display text-[10px] font-bold text-white">
                  {lessonsCount > 0 ? `${lessonsCount} Done` : "Chapter 1"}
                </span>
                <span className="block font-mono text-[9px] text-purple-300/70">
                  {lessonsCount > 0 ? "Chapters Finished" : "Ready to begin"}
                </span>
              </div>
            </div>

            {/* Step 3: Next Milestone */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="grid size-7 place-items-center rounded-full border border-purple-700/60 bg-purple-950/60 text-purple-400">
                <Star size={13} weight="fill" />
              </div>
              <div className="text-center">
                <span className="block font-display text-[10px] font-bold text-white">Milestone</span>
                <span className="block font-mono text-[9px] text-purple-300/70">
                  Goal: {targetMilestone} Chapters
                </span>
              </div>
            </div>
          </div>

          {/* Right Encouragement Callout */}
          <div className="w-full sm:w-auto shrink-0 flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-900/30 px-3.5 py-2.5">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-purple-400/40 bg-purple-500/20 text-emerald-400">
              <Plant size={18} weight="fill" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xs font-bold text-white">
                {lessonsCount > 0 ? "Brilliant progress!" : "Welcome aboard!"}
              </span>
              <span className="font-mono text-[10px] text-purple-300/80">
                Next milestone in {remainingForMilestone} {remainingForMilestone === 1 ? "chapter" : "chapters"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Completed Chapters Showcase */}
      <div className="rounded-2xl border border-purple-800/35 bg-purple-950/25 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} weight="fill" className="text-emerald-400" />
            <span className="font-display text-xs sm:text-sm font-bold text-white">
              {locale === "ta" ? "நிறைவு செய்த பாடங்கள்" : "Completed Chapters"}
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
              {completedChapters.length}
            </span>
          </div>
          {completedChapters.length > 0 && (
            <Link
              href="/m/learn"
              className="group inline-flex items-center gap-1 font-mono text-[11px] text-purple-300 hover:text-white transition-colors"
            >
              <span>{locale === "ta" ? "கற்றலுக்குச் செல்" : "Go to Classroom"}</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {completedChapters.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-glass">
            {completedChapters.map((item) => (
              <div
                key={item.chapterId}
                className="group flex items-center justify-between gap-3 rounded-xl border border-purple-800/40 bg-purple-900/20 p-2.5 transition-all hover:bg-purple-900/40 hover:border-purple-600/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-emerald-500/50 bg-emerald-950/60 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <Check size={14} weight="bold" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-200">
                      {item.chapterNumber ? `${locale === "ta" ? "அத்தியாயம்" : "Chapter"} ${item.chapterNumber}: ` : ""}
                      {locale === "ta" ? item.chapterTitle.ta : item.chapterTitle.en}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-purple-300/80">
                      <span className="font-semibold text-purple-200">{locale === "ta" ? item.subjectName.ta : item.subjectName.en}</span>
                      <span>•</span>
                      <span>Class {item.standard}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={item.reviewHref}
                  onClick={() => enterFullscreen()}
                  className="shrink-0 rounded-lg border border-purple-500/40 bg-purple-800/30 px-3 py-1 text-[11px] font-medium text-purple-200 transition-colors hover:bg-purple-700/60 hover:text-white"
                >
                  {locale === "ta" ? "மீண்டும் படிக்க" : "Review"}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-purple-800/50 bg-purple-950/20 py-6 px-4 text-center">
            <BookOpen size={24} weight="duotone" className="text-purple-400/60 mb-2" />
            <p className="text-xs text-purple-200/80 max-w-sm">
              {locale === "ta"
                ? "இன்னும் பாடங்கள் நிறைவு செய்யப்படவில்லை. டிஜிட்டல் கற்றலில் முதல் பாடத்தைப் படித்து முடிக்கவும்!"
                : "No chapters completed yet. Complete a chapter in Digital Learning to see it tracked here!"}
            </p>
            <Link
              href="/m/learn"
              onClick={() => enterFullscreen()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-purple-400/50 bg-purple-600/30 px-3.5 py-1 text-xs font-semibold text-white transition-all hover:bg-purple-600/60"
            >
              <span>{locale === "ta" ? "கற்கத் தொடங்கு" : "Start Learning"}</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SignInScreenContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/m/learn";
  const { t } = useLocale();
  const { profile } = useProgress();
  const hydrated = useHydrated();
  const [editing, setEditing] = useState(() => searchParams?.get("edit") === "true");
  const [confirming, setConfirming] = useState(false);

  const continueHref =
    profile?.lastAccessed
      ? `/m/learn?subject=${profile.lastAccessed.subjectId}&chapter=${profile.lastAccessed.chapterId}`
      : redirectTarget;

  return (
    <div className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-[#070312]">
      <ChromeWaves />

      {/* Veiled wishing tree: the page's living backdrop on the left */}
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

      {/* Cosmic Particles & Interactive Petal Bursts Layer */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
        <CosmicParticleLayer moduleSlug="learn" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-3 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-10 pb-12">
        {/* Top Header Navigation */}
        <header className="flex items-center justify-between gap-3 py-3 sm:py-4">
          <Link
            href="/"
            className="group flex h-10 items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 text-sm text-purple-200 backdrop-blur-xl transition-all duration-200 hover:bg-purple-900/60 hover:text-white shadow-sm"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <Trophy size={16} weight="fill" className="text-purple-300" />
            <span>{t.home}</span>
          </Link>
          <div className="flex items-center gap-2">
            <FullScreenToggle />
            <LangSelect />
          </div>
        </header>

        <main className="mt-3 flex flex-1 flex-col justify-center sm:mt-5">
          {!hydrated ? (
            <div aria-hidden className="mx-auto h-96 w-full animate-pulse rounded-3xl border border-purple-900/30 bg-purple-950/30" />
          ) : !profile || editing ? (
            <LiquidGlassSurface
              radius={32}
              className="w-full border border-white/20 dark:border-purple-400/30 bg-white/[0.04] dark:bg-purple-950/20 backdrop-blur-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),inset_0_1px_2px_0_rgba(255,255,255,0.25),0_0_50px_rgba(168,85,247,0.18)]"
            >
              {profile && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="mb-6 inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 dark:bg-purple-900/30 px-3.5 text-sm text-purple-200 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white shadow-sm"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              )}
              <LearnerSetup
                existing={profile}
                redirectTo={redirectTarget}
                onDone={() => setEditing(false)}
              />
            </LiquidGlassSurface>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              {/* Left Card: Student Identity, XP, Level, Streaks & Achievements */}
              <div className="lg:col-span-5 flex flex-col">
                <ProfileIdentityCard
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

              {/* Right Card: Welcome Hub, Continue Learning, 4 Metrics, Learning Journey */}
              <div className="lg:col-span-7 flex flex-col">
                <DashboardHubCard
                  profile={profile}
                  continueHref={continueHref}
                  onEdit={() => setEditing(true)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function SignInScreen() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl border border-purple-900/30 bg-purple-950/30" />}>
      <SignInScreenContent />
    </Suspense>
  );
}
