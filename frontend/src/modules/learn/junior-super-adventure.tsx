"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  CaretRight,
  Compass,
  Gift,
  GraduationCap,
  Heart,
  PencilSimple,
  Play,
  Rocket,
  Sparkle,
  Star,
  Trophy,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import type { CurriculumChapter, CurriculumSubject } from "@/lib/curriculum";

interface JuniorSuperAdventureProps {
  currentStandard: number;
  subjects: readonly CurriculumSubject[];
  allFlatChapters: Array<{ subject: CurriculumSubject; chapter: CurriculumChapter }>;
  filter: string;
  setFilter: (f: string) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenStandardSwitcher: () => void;
  onSelectStandard?: (std: number) => void;
  continueRecord: {
    subject: CurriculumSubject;
    chapter: CurriculumChapter;
    isStarter: boolean;
  } | null;
  totalChapters: number;
  completedChaptersCount: number;
}

export function JuniorSuperAdventure({
  currentStandard,
  subjects,
  allFlatChapters,
  filter,
  setFilter,
  onOpenChapter,
  onOpenStandardSwitcher,
  onSelectStandard,
  continueRecord,
  totalChapters,
  completedChaptersCount,
}: JuniorSuperAdventureProps) {
  const { locale } = useLocale();

  // Active category filter: "all" | "favourites" | "recent" | subjectId
  const [activeTab, setActiveTab] = useState<string>("all");

  // Subject matching helpers for the 3 Journey Quest cards
  const scienceSubject = useMemo(
    () => subjects.find((s) => s.id.includes("science") || s.id.includes("evs") || s.name.en.toLowerCase().includes("science")),
    [subjects]
  );
  const mathSubject = useMemo(
    () => subjects.find((s) => s.id.includes("math") || s.name.en.toLowerCase().includes("math")),
    [subjects]
  );
  const tamilSubject = useMemo(
    () => subjects.find((s) => s.id.includes("tamil")),
    [subjects]
  );
  const englishSubject = useMemo(
    () => subjects.find((s) => s.id.includes("english")),
    [subjects]
  );

  // Filtered chapters list for display
  const displayedChapters = useMemo(() => {
    if (activeTab === "all") {
      return allFlatChapters;
    }
    if (activeTab === "favourites") {
      // First 8 engaging starter chapters
      return allFlatChapters.slice(0, 8);
    }
    if (activeTab === "recent") {
      return allFlatChapters.slice(0, Math.max(completedChaptersCount, 3));
    }
    // Specific subject
    return allFlatChapters.filter((item) => item.subject.id === activeTab);
  }, [activeTab, allFlatChapters, completedChaptersCount]);

  // Selected subject or category display title
  const activeSubjectObject = subjects.find((s) => s.id === activeTab);

  // Quest progress (up to 3 daily stars)
  const questProgress = Math.min(completedChaptersCount, 3);
  const questPercent = Math.round((questProgress / 3) * 100);

  // Journey milestones calculation (Start -> Explore -> Learn -> Grow)
  const journeyStep = completedChaptersCount === 0 ? 1 : completedChaptersCount < 3 ? 2 : completedChaptersCount < 7 ? 3 : 4;

  const handleLaunchContinue = () => {
    if (continueRecord) {
      onOpenChapter(continueRecord.chapter.id);
    } else if (allFlatChapters[0]) {
      onOpenChapter(allFlatChapters[0].chapter.id);
    }
  };

  const handleExploreSubject = (sub?: CurriculumSubject) => {
    if (sub) {
      setActiveTab(sub.id);
      if (sub.chapters[0]) {
        onOpenChapter(sub.chapters[0].id);
      }
    } else if (allFlatChapters[0]) {
      onOpenChapter(allFlatChapters[0].chapter.id);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 sm:gap-8 pb-16 text-white select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR                                                         */}
      {/* ========================================================================= */}
      <header className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-1">
        {/* Left: Learner Profile Badge + Direct Class 1-3 switcher */}
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-pink-300/80 bg-gradient-to-tr from-purple-600 to-pink-400 p-0.5 shadow-[0_0_20px_rgba(244,114,182,0.6)]">
            <Image
              src="/images/junior/learner-avatar.png"
              alt="Learner Avatar"
              width={56}
              height={56}
              className="h-full w-full rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
                Hi, Learner!
              </span>
              {/* Direct Class 1-3 Segmented Tabs */}
              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-0.5 backdrop-blur-md">
                {[1, 2, 3].map((std) => (
                  <button
                    key={std}
                    type="button"
                    onClick={() => onSelectStandard ? onSelectStandard(std) : onOpenStandardSwitcher()}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold transition-all ${
                      currentStandard === std
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_10px_rgba(244,114,182,0.6)] scale-105"
                        : "text-purple-200 hover:text-white"
                    }`}
                  >
                    Class {std}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onOpenStandardSwitcher}
                  className="rounded-full px-2 py-0.5 font-mono text-[10.5px] font-medium text-purple-200 hover:text-white transition-colors"
                  title="Switch to Class 4 to 12"
                >
                  4-12 ▾
                </button>
              </div>
            </div>
            <p className="font-display text-xs sm:text-[13px] font-semibold text-purple-200 drop-shadow-sm flex items-center gap-1">
              <span>Keep going, you&apos;re doing great!</span>
              <span className="text-amber-300">⭐</span>
            </p>
          </div>
        </div>

        {/* Center: 3D Bubble Title "Super Learning Adventure!" */}
        <div className="flex items-center justify-center my-1 lg:my-0">
          <div className="relative group">
            <Image
              src="/images/junior/super-learning-title-soft.png"
              alt="Super Learning Adventure!"
              width={340}
              height={115}
              priority
              className="w-auto h-16 sm:h-20 lg:h-22 object-contain drop-shadow-[0_8px_25px_rgba(168,85,247,0.7)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: "Your Learning Journey" Milestone Tracker Card */}
        <div className="flex items-center justify-start lg:justify-end">
          <div className="flex flex-col gap-1.5 rounded-2xl border border-white/20 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 px-4 py-2.5 shadow-[0_8px_32px_rgba(30,27,75,0.4)] backdrop-blur-xl">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-purple-200/90 font-bold">
              Your Learning Journey
            </span>

            {/* Glowing Milestone Trail */}
            <div className="relative flex items-center justify-between gap-3 sm:gap-4 pt-1">
              {/* Connecting Glow Line */}
              <div className="absolute top-[13px] inset-x-2 h-1 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-all duration-500"
                  style={{ width: `${(journeyStep / 4) * 100}%` }}
                />
              </div>

              {/* Node 1: Start */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span
                  className={`grid size-7 place-items-center rounded-full border-2 transition-all ${
                    journeyStep >= 1
                      ? "border-amber-300 bg-amber-400 text-amber-950 shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110"
                      : "border-white/20 bg-white/10 text-white/50"
                  }`}
                >
                  <Star size={13} weight="fill" />
                </span>
                <span className="font-mono text-[9px] font-semibold text-purple-100">Start</span>
              </div>

              {/* Node 2: Explore */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span
                  className={`grid size-7 place-items-center rounded-full border-2 transition-all ${
                    journeyStep >= 2
                      ? "border-purple-300 bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)] scale-110"
                      : "border-white/20 bg-white/10 text-white/50"
                  }`}
                >
                  <BookOpen size={13} weight="fill" />
                </span>
                <span className="font-mono text-[9px] font-semibold text-purple-100">Explore</span>
              </div>

              {/* Node 3: Learn */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span
                  className={`grid size-7 place-items-center rounded-full border-2 transition-all ${
                    journeyStep >= 3
                      ? "border-blue-300 bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-110"
                      : "border-white/20 bg-white/10 text-white/50"
                  }`}
                >
                  <Trophy size={13} weight="fill" />
                </span>
                <span className="font-mono text-[9px] font-semibold text-purple-100">Learn</span>
              </div>

              {/* Node 4: Grow */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span
                  className={`grid size-7 place-items-center rounded-full border-2 transition-all ${
                    journeyStep >= 4
                      ? "border-cyan-300 bg-cyan-400 text-cyan-950 shadow-[0_0_12px_rgba(34,211,238,0.9)] scale-110"
                      : "border-white/20 bg-white/10 text-white/50"
                  }`}
                >
                  <Rocket size={13} weight="fill" />
                </span>
                <span className="font-mono text-[9px] font-semibold text-purple-100">Grow</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN ROW: DAILY QUEST + MY BOOK SPACE (FROSTED GLASS HERO CARDS)        */}
      {/* ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* --------------------------------------------------------------------- */}
        {/* CARD A: DAILY QUEST (Left Hero Card, 6.5 cols)                        */}
        {/* --------------------------------------------------------------------- */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-3xl border-2 border-white/25 bg-gradient-to-br from-blue-600/35 via-indigo-700/40 to-purple-800/40 p-5 sm:p-7 shadow-[0_20px_50px_rgba(20,10,50,0.55),inset_0_1px_20px_rgba(255,255,255,0.2)] backdrop-blur-2xl flex flex-col justify-between min-h-[300px]">
          {/* Ambient Card Glows & Floating Sparkles */}
          <div className="pointer-events-none absolute -top-10 -left-10 size-48 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-pink-500/20 blur-3xl" />
          <span className="pointer-events-none absolute top-4 right-1/2 text-yellow-300 text-sm animate-pulse">✦</span>
          <span className="pointer-events-none absolute bottom-12 left-1/3 text-pink-300 text-xs animate-ping">✨</span>

          <div>
            {/* Header: Star in Bubble + Title */}
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl border border-amber-300/60 bg-amber-400/25 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                <Star size={22} weight="fill" />
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                Daily Quest
              </h2>
            </div>
            <p className="mt-2 max-w-[280px] sm:max-w-[320px] font-display text-xs sm:text-sm font-medium text-purple-100 leading-snug drop-shadow-sm">
              Complete your daily tasks, earn stars and unlock new adventures!
            </p>

            {/* Progress Bar Row */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-300/40">
                <Star size={13} weight="fill" />
                <span>{questProgress}/3</span>
              </div>
              <div className="relative h-3 w-36 sm:w-48 overflow-hidden rounded-full border border-white/20 bg-black/30 backdrop-blur-md">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.85)] transition-all duration-700"
                  style={{ width: `${questPercent}%` }}
                />
              </div>
            </div>

            {/* Today's Reward Chip */}
            <div className="mt-4 inline-flex items-center gap-2.5 rounded-2xl border border-purple-300/30 bg-purple-900/40 px-3.5 py-2 backdrop-blur-md shadow-inner">
              <span className="grid size-7 place-items-center rounded-xl bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.7)]">
                <Gift size={16} weight="fill" />
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-purple-200">
                  Today&apos;s Reward
                </span>
                <span className="font-display text-xs sm:text-sm font-black text-amber-300">
                  + 50 Stars
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: Big Glossy Pill Button + Mascots on Cloud */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            {/* Glossy Purple Pill "▶ Start Play!" Button */}
            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group relative z-10 inline-flex items-center gap-2.5 rounded-full border-2 border-pink-300/80 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-6 sm:px-8 py-3.5 font-display text-sm sm:text-base font-black text-white shadow-[0_0_25px_rgba(217,70,239,0.75)] hover:shadow-[0_0_35px_rgba(217,70,239,1)] hover:scale-105 active:scale-95 transition-all"
            >
              <span className="grid size-6 place-items-center rounded-full bg-white text-purple-700 shadow-sm transition-transform group-hover:scale-110">
                <Play size={12} weight="fill" className="ml-0.5" />
              </span>
              <span>Start Play!</span>
            </button>

            {/* Mascots on Cloud (Tiger cub, Blue elephant, Kid astronaut) */}
            <div className="relative shrink-0 w-52 sm:w-60 lg:w-64 max-w-full self-end sm:self-auto">
              <Image
                src="/images/junior/daily-mascots-soft.png"
                alt="Tiger, Elephant, and Astronaut kid mascots"
                width={264}
                height={243}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* CARD B: MY BOOK SPACE (Right Hero Card, 5.5 cols)                     */}
        {/* --------------------------------------------------------------------- */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border-2 border-white/25 bg-gradient-to-br from-blue-600/35 via-indigo-700/40 to-purple-800/40 p-5 sm:p-7 shadow-[0_20px_50px_rgba(20,10,50,0.55),inset_0_1px_20px_rgba(255,255,255,0.2)] backdrop-blur-2xl flex flex-col justify-between min-h-[300px]">
          {/* Header: Book Icon + Title + Chevron */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl border border-cyan-300/60 bg-cyan-400/25 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <BookOpen size={22} weight="fill" />
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                My Book Space
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="View all books"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
          <p className="mt-2 font-display text-xs sm:text-sm font-medium text-purple-100 leading-snug drop-shadow-sm">
            Your favourite books, always with you!
          </p>

          {/* 3 Bubble Pedestals with Cute Animal Mascots */}
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3.5 items-end justify-center pt-1">
            {/* 1. Puppy: My Books */}
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`group relative flex flex-col items-center text-center transition-all duration-300 hover:scale-105 active:scale-95 p-1 ${
                activeTab === "all"
                  ? "scale-105 drop-shadow-[0_0_20px_rgba(56,189,248,0.85)]"
                  : "opacity-85 hover:opacity-100"
              }`}
              title="My Books (All chapters)"
            >
              <div className="relative w-20 sm:w-24 md:w-26 transition-transform group-hover:-translate-y-1">
                <Image
                  src="/images/junior/book-puppy-soft.png"
                  alt="My Books - Puppy mascot"
                  width={102}
                  height={190}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                />
              </div>
            </button>

            {/* 2. Bear: My Favourites */}
            <button
              type="button"
              onClick={() => setActiveTab("favourites")}
              className={`group relative flex flex-col items-center text-center transition-all duration-300 hover:scale-105 active:scale-95 p-1 ${
                activeTab === "favourites"
                  ? "scale-105 drop-shadow-[0_0_20px_rgba(244,114,182,0.85)]"
                  : "opacity-85 hover:opacity-100"
              }`}
              title="My Favourites"
            >
              <div className="relative w-20 sm:w-24 md:w-26 transition-transform group-hover:-translate-y-1">
                <Image
                  src="/images/junior/book-bear-soft.png"
                  alt="My Favourites - Bear mascot"
                  width={102}
                  height={190}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                />
              </div>
            </button>

            {/* 3. Kitty: Recently Read */}
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`group relative flex flex-col items-center text-center transition-all duration-300 hover:scale-105 active:scale-95 p-1 ${
                activeTab === "recent"
                  ? "scale-105 drop-shadow-[0_0_20px_rgba(56,189,248,0.85)]"
                  : "opacity-85 hover:opacity-100"
              }`}
              title="Recently Read"
            >
              <div className="relative w-20 sm:w-24 md:w-26 transition-transform group-hover:-translate-y-1">
                <Image
                  src="/images/junior/book-kitty-soft.png"
                  alt="Recently Read - Kitten mascot"
                  width={102}
                  height={190}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MIDDLE SECTION: "PICK A JOURNEY" (ENCLOSING FROSTED GLASS CONTAINER)   */}
      {/* ========================================================================= */}
      <section className="relative z-10 overflow-hidden rounded-3xl border-2 border-white/25 bg-gradient-to-br from-blue-600/35 via-indigo-700/40 to-purple-800/40 p-5 sm:p-7 shadow-[0_20px_50px_rgba(20,10,50,0.55),inset_0_1px_20px_rgba(255,255,255,0.2)] backdrop-blur-2xl flex flex-col gap-5">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl border border-cyan-300/60 bg-cyan-400/25 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <Compass size={22} weight="fill" />
            </span>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                Pick a Journey
              </h2>
              <p className="mt-0.5 font-display text-xs sm:text-sm font-medium text-purple-100 leading-snug drop-shadow-sm">
                Choose your adventure and learn something new!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Explore all journeys"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>

        {/* 3 Frosted Adventure Cards Inside Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Science Quest (Rocket flying) */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-blue-600/30 via-indigo-700/35 to-purple-800/35 p-5 shadow-[0_10px_25px_rgba(20,10,45,0.4)] backdrop-blur-xl flex flex-col justify-between min-h-[175px] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
                  Science Quest
                </h3>
                <p className="mt-1 font-display text-xs font-medium text-cyan-200 drop-shadow-sm">
                  Explore, discover, be curious!
                </p>
              </div>
              {/* 3D Flying Rocket Artwork */}
              <div className="relative -mt-1 -mr-2 w-24 sm:w-28 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/junior/journey-rocket-soft.png"
                  alt="Rocket ship flying with planet"
                  width={125}
                  height={130}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <div className="mt-4 pt-1">
              <button
                type="button"
                onClick={() => handleExploreSubject(scienceSubject)}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/80 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 font-display text-xs font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explore</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>

          {/* Card 2: Math Maze (Treasure chest with math symbols) */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-blue-600/30 via-indigo-700/35 to-purple-800/35 p-5 shadow-[0_10px_25px_rgba(20,10,45,0.4)] backdrop-blur-xl flex flex-col justify-between min-h-[175px] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
                  Math Maze
                </h3>
                <p className="mt-1 font-display text-xs font-medium text-pink-200 drop-shadow-sm">
                  Think, solve, be a math hero!
                </p>
              </div>
              {/* 3D Treasure Chest Artwork */}
              <div className="relative -mt-1 -mr-2 w-22 sm:w-26 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/junior/journey-chest-soft.png"
                  alt="Treasure chest with math symbols"
                  width={110}
                  height={130}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <div className="mt-4 pt-1">
              <button
                type="button"
                onClick={() => handleExploreSubject(mathSubject)}
                className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/80 bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-1.5 font-display text-xs font-black text-white shadow-[0_0_15px_rgba(217,70,239,0.7)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explore</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>

          {/* Card 3: Craft & Sports (Soccer ball, basketball, paint palette) */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-blue-600/30 via-indigo-700/35 to-purple-800/35 p-5 shadow-[0_10px_25px_rgba(20,10,45,0.4)] backdrop-blur-xl flex flex-col justify-between min-h-[175px] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
                  Craft & Sports
                </h3>
                <p className="mt-1 font-display text-xs font-medium text-emerald-200 drop-shadow-sm">
                  Create, build, stay active!
                </p>
              </div>
              {/* 3D Sports & Craft Artwork */}
              <div className="relative -mt-1 -mr-2 w-24 sm:w-28 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/junior/journey-sports-soft.png"
                  alt="Soccer ball, basketball, and paint palette"
                  width={125}
                  height={130}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <div className="mt-4 pt-1">
              <button
                type="button"
                onClick={() => handleExploreSubject(tamilSubject ?? englishSubject)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 font-display text-xs font-black text-white shadow-[0_0_15px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explore</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BOTTOM FLOATING SUBJECT DOCK (MATCHING SCREENSHOT NAVIGATION)           */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-2">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto p-2 sm:p-2.5 rounded-full border-2 border-white/25 bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 shadow-[0_15px_40px_rgba(15,10,40,0.6)] backdrop-blur-2xl max-w-full [scrollbar-width:none]">
            {/* 1. பொதுத்தமிழ் (Tamil) */}
            <button
              type="button"
              onClick={() => setActiveTab(tamilSubject ? tamilSubject.id : "all")}
              className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 font-display text-xs sm:text-sm font-black transition-all ${
                activeTab === (tamilSubject ? tamilSubject.id : "")
                  ? "border border-cyan-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.85)] scale-105"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              <BookOpen size={16} weight="fill" />
              <span>பொதுத்தமிழ்</span>
            </button>

            {/* 2. English */}
            <button
              type="button"
              onClick={() => setActiveTab(englishSubject ? englishSubject.id : "all")}
              className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 font-display text-xs sm:text-sm font-black transition-all ${
                activeTab === (englishSubject ? englishSubject.id : "")
                  ? "border border-cyan-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.85)] scale-105"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              <BookOpen size={16} weight="fill" />
              <span>English</span>
            </button>

            {/* 3. Mathematics */}
            <button
              type="button"
              onClick={() => setActiveTab(mathSubject ? mathSubject.id : "all")}
              className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 font-display text-xs sm:text-sm font-black transition-all ${
                activeTab === (mathSubject ? mathSubject.id : "")
                  ? "border border-cyan-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.85)] scale-105"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-sm">🧮</span>
              <span>Mathematics</span>
            </button>

            {/* 4. Science */}
            <button
              type="button"
              onClick={() => setActiveTab(scienceSubject ? scienceSubject.id : "all")}
              className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 font-display text-xs sm:text-sm font-black transition-all ${
                activeTab === (scienceSubject ? scienceSubject.id : "")
                  ? "border border-cyan-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.85)] scale-105"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-sm">🔬</span>
              <span>Science</span>
            </button>

            {/* 5. Social Science / EVS */}
            <button
              type="button"
              onClick={() => {
                const soc = subjects.find((s) => s.id.includes("social") || s.id.includes("evs"));
                setActiveTab(soc ? soc.id : "all");
              }}
              className="flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 font-display text-xs sm:text-sm font-black text-purple-200 hover:text-white hover:bg-white/10 transition-all"
            >
              <span className="text-sm">🌍</span>
              <span>Social Science</span>
            </button>

            {/* 6. Others */}
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 font-display text-xs sm:text-sm font-black transition-all ${
                activeTab === "all"
                  ? "border border-cyan-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.85)] scale-105"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              <Star size={16} weight="fill" className="text-amber-300" />
              <span>Others</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CHAPTER SHOWCASE & LESSON LAUNCHER                                     */}
      {/* ========================================================================= */}
      <section className="relative z-10 mt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} weight="fill" className="text-pink-400" />
            <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
              {activeSubjectObject
                ? `${activeSubjectObject.name[locale]} Lessons`
                : activeTab === "favourites"
                ? "Favourite Star Lessons ⭐"
                : activeTab === "recent"
                ? "Recently Practised Lessons 🔖"
                : `Class ${currentStandard} Adventure Lessons 🌟`}
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            {displayedChapters.length} Lessons Available
          </span>
        </div>

        {/* Chapters Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedChapters.slice(0, 16).map(({ subject, chapter }, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={chapter.id}
                onClick={() => onOpenChapter(chapter.id)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-blue-700/30 via-indigo-800/40 to-purple-900/40 p-4 shadow-[0_10px_25px_rgba(15,10,35,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-300/80 hover:shadow-[0_15px_35px_rgba(236,72,153,0.4)] flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider text-pink-300 bg-pink-500/25 px-2 py-0.5 rounded-full border border-pink-400/40">
                      Chapter {chapter.chapterNumber}
                    </span>
                    <span className="font-mono text-[10px] text-purple-200 flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{chapter.estimatedMinutes}m</span>
                    </span>
                  </div>

                  <h4 className="mt-2.5 font-display text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-pink-200 transition-colors">
                    {chapter.title[locale]}
                  </h4>

                  <p className="mt-1 font-display text-xs text-purple-200 line-clamp-2 leading-relaxed">
                    {chapter.summary[locale]}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-cyan-300">
                    {subject.name[locale]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChapter(chapter.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 font-display text-[11px] font-black text-white shadow-[0_0_10px_rgba(236,72,153,0.6)] group-hover:scale-105 transition-transform"
                  >
                    <span>Play</span>
                    <Play size={10} weight="fill" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
