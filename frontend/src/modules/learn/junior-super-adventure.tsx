"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CaretRight,
  Check,
  Compass,
  DownloadSimple,
  FileText,
  LightbulbFilament,
  Lightning,
  PencilSimple,
  Play,
  Sparkle,
  Star,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { BrandMark } from "@/components/brand-mark";
import { SoundToggle } from "@/components/sound-toggle";
import { LangSelect } from "@/components/landing/lang-select";
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
  const { locale, t } = useLocale();

  // Active category filter: "all" | subjectId
  const [activeSubject, setActiveSubject] = useState<string>("all");

  // Filtered chapters list for display
  const displayedChapters = useMemo(() => {
    if (activeSubject === "all") {
      return allFlatChapters;
    }
    return allFlatChapters.filter((item) => item.subject.id === activeSubject);
  }, [activeSubject, allFlatChapters]);

  // Subject matching helpers
  const tamilSubject = useMemo(
    () => subjects.find((s) => s.id.includes("tamil")),
    [subjects]
  );
  const englishSubject = useMemo(
    () => subjects.find((s) => s.id.includes("english")),
    [subjects]
  );
  const mathSubject = useMemo(
    () => subjects.find((s) => s.id.includes("math") || s.name.en.toLowerCase().includes("math")),
    [subjects]
  );
  const scienceSubject = useMemo(
    () => subjects.find((s) => s.id.includes("science") || s.id.includes("evs") || s.name.en.toLowerCase().includes("science")),
    [subjects]
  );
  const socialSubject = useMemo(
    () => subjects.find((s) => s.id.includes("social")),
    [subjects]
  );

  const handleLaunchContinue = () => {
    if (continueRecord) {
      onOpenChapter(continueRecord.chapter.id);
    } else if (allFlatChapters[0]) {
      onOpenChapter(allFlatChapters[0].chapter.id);
    }
  };

  const handleSelectSubject = (sub?: CurriculumSubject) => {
    if (sub) {
      setActiveSubject(sub.id === activeSubject ? "all" : sub.id);
      if (sub.chapters[0]) {
        onOpenChapter(sub.chapters[0].id);
      }
    } else if (allFlatChapters[0]) {
      onOpenChapter(allFlatChapters[0].chapter.id);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 sm:gap-8 pb-20 select-none text-slate-800">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR: BRAND LOGO + 3D TITLE + GIRL WITH BUNNY + LEARNER CHIP */}
      {/* ========================================================================= */}
      <header className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 pt-1 sm:pt-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/80 px-3.5 py-2 shadow-[0_4px_16px_rgba(30,58,138,0.08)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white"
            title="Back to Home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm">
              <BrandMark className="size-5" strokeWidth={2} />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-black tracking-tight text-blue-900 leading-none">
                GSX
              </span>
              <span className="font-headline text-[13px] font-bold text-slate-700 leading-tight">
                Kalpavriksha
              </span>
            </div>
          </Link>
        </div>

        {/* Center: 3D "Digital Learning: Explore ⭐ Learn ⭐ Grow" + Girl Reading */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 my-1 lg:my-0">
          <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src="/images/junior/fairytale-title.png"
              alt="Digital Learning - Explore Learn Grow"
              width={390}
              height={110}
              priority
              className="w-auto h-16 sm:h-20 lg:h-24 object-contain drop-shadow-[0_8px_20px_rgba(59,130,246,0.25)]"
            />
          </div>
          <div className="relative hidden sm:block shrink-0 transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/junior/fairytale-girl.png"
              alt="Little girl reading with bunny"
              width={90}
              height={90}
              className="size-16 sm:size-20 lg:size-22 rounded-2xl object-cover shadow-[0_8px_20px_rgba(59,130,246,0.2)] border-2 border-white/80"
            />
          </div>
        </div>

        {/* Right: Controls & Learner Profile Chip */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 rounded-2xl border border-white/80 bg-white/80 p-1 shadow-[0_4px_16px_rgba(30,58,138,0.06)] backdrop-blur-xl">
            <SoundToggle />
            <LangSelect />
          </div>
          <Link
            href="/sign-in"
            className="group flex items-center gap-3 rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-[0_4px_16px_rgba(30,58,138,0.1)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white"
            title="Learner Profile"
          >
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-pink-400 bg-pink-100 p-0.5 shadow-sm">
              <Image
                src="/images/junior/learner-avatar.png"
                alt="Learner Avatar"
                width={36}
                height={36}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Hello, Deebiga!
              </span>
              <span className="font-display text-[10.5px] font-semibold text-purple-600 flex items-center gap-1">
                Keep going, you&apos;re amazing! <span className="text-pink-500">💜</span>
              </span>
            </div>
            <CaretRight size={14} weight="bold" className="text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN GRID: LEFT MAIN CONTENT (8 cols) + RIGHT SIDEBAR (4 cols)*/}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
        {/* ===================================================================== */}
        {/* LEFT MAIN CARD: SELECT CLASS + POPULAR SUBJECTS                       */}
        {/* ===================================================================== */}
        <main className="lg:col-span-8 flex flex-col gap-6 rounded-3xl border border-white/90 bg-white/90 p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(30,58,138,0.12)] backdrop-blur-2xl">
          {/* ----------------------------------------------------------------- */}
          {/* A. SELECT YOUR CLASS SECTION                                      */}
          {/* ----------------------------------------------------------------- */}
          <section>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl text-amber-400 drop-shadow-sm">⭐</span>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-black text-[#1e293b] leading-tight">
                    Select Your Class
                  </h2>
                  <p className="font-display text-xs text-[#64748b]">
                    Choose your class to start your learning journey
                  </p>
                </div>
              </div>

              {/* "Small steps Big dreams" Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 px-3 py-1 font-display text-[11px] font-bold text-purple-700 shadow-sm">
                <span>⭐</span>
                <span>Small steps Big dreams</span>
                <span className="text-purple-500">💜</span>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
              {/* Class 1 (Blue Backpack) */}
              <button
                type="button"
                onClick={() => onSelectStandard ? onSelectStandard(1) : onOpenStandardSwitcher()}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 transition-all duration-300 ${
                  currentStandard === 1
                    ? "border-2 border-blue-500 bg-blue-50/90 shadow-[0_8px_25px_rgba(59,130,246,0.25)] scale-[1.03]"
                    : "border border-blue-100 bg-white/80 hover:bg-blue-50/40 hover:border-blue-300 hover:scale-[1.01]"
                }`}
              >
                {currentStandard === 1 && (
                  <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-blue-600 text-white shadow-sm">
                    <Check size={12} weight="bold" />
                  </span>
                )}
                <div className="size-14 sm:size-16 relative flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/junior/class-backpack-blue.png"
                    alt="Class 1 Blue Backpack"
                    width={56}
                    height={56}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <span className={`font-display text-sm font-black ${currentStandard === 1 ? "text-blue-700" : "text-slate-700"}`}>
                  Class 1
                </span>
              </button>

              {/* Class 2 (Yellow Backpack) */}
              <button
                type="button"
                onClick={() => onSelectStandard ? onSelectStandard(2) : onOpenStandardSwitcher()}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 transition-all duration-300 ${
                  currentStandard === 2
                    ? "border-2 border-amber-500 bg-amber-50/90 shadow-[0_8px_25px_rgba(245,158,11,0.25)] scale-[1.03]"
                    : "border border-amber-100 bg-white/80 hover:bg-amber-50/40 hover:border-amber-300 hover:scale-[1.01]"
                }`}
              >
                {currentStandard === 2 && (
                  <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-amber-500 text-white shadow-sm">
                    <Check size={12} weight="bold" />
                  </span>
                )}
                <div className="size-14 sm:size-16 relative flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/junior/class-backpack-yellow.png"
                    alt="Class 2 Yellow Backpack"
                    width={56}
                    height={56}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <span className={`font-display text-sm font-black ${currentStandard === 2 ? "text-amber-700" : "text-slate-700"}`}>
                  Class 2
                </span>
              </button>

              {/* Class 3 (Globe) */}
              <button
                type="button"
                onClick={() => onSelectStandard ? onSelectStandard(3) : onOpenStandardSwitcher()}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 transition-all duration-300 ${
                  currentStandard === 3
                    ? "border-2 border-emerald-500 bg-emerald-50/90 shadow-[0_8px_25px_rgba(16,185,129,0.25)] scale-[1.03]"
                    : "border border-emerald-100 bg-white/80 hover:bg-emerald-50/40 hover:border-emerald-300 hover:scale-[1.01]"
                }`}
              >
                {currentStandard === 3 && (
                  <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-emerald-600 text-white shadow-sm">
                    <Check size={12} weight="bold" />
                  </span>
                )}
                <div className="size-14 sm:size-16 relative flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/junior/class-globe.png"
                    alt="Class 3 Globe"
                    width={56}
                    height={56}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <span className={`font-display text-sm font-black ${currentStandard === 3 ? "text-emerald-700" : "text-slate-700"}`}>
                  Class 3
                </span>
              </button>

              {/* Class 4-12 ▾ (Telescope) */}
              <button
                type="button"
                onClick={onOpenStandardSwitcher}
                className="group relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-purple-200/80 bg-gradient-to-b from-purple-50/60 to-indigo-50/60 p-3.5 shadow-sm transition-all duration-300 hover:bg-purple-100/50 hover:scale-[1.01]"
                title="Explore Classes 4 to 12"
              >
                <div className="size-14 sm:size-16 relative flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/junior/class-telescope.png"
                    alt="Class 4 to 12 Telescope"
                    width={56}
                    height={56}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <span className="font-display text-sm font-black text-purple-800 flex items-center gap-1">
                  Class 4-12 <span className="text-xs">▾</span>
                </span>
              </button>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* B. POPULAR SUBJECTS SECTION                                       */}
          {/* ----------------------------------------------------------------- */}
          <section className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl text-amber-400 drop-shadow-sm">⭐</span>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-black text-[#1e293b] leading-tight">
                    Popular Subjects
                  </h2>
                  <p className="font-display text-xs text-[#64748b]">
                    Explore subjects based on your class
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Cards Grid with 3D Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {/* 1. Tamil / தமிழ் */}
              <button
                type="button"
                onClick={() => handleSelectSubject(tamilSubject)}
                className={`group flex items-center justify-between gap-3 rounded-2xl border border-pink-200/90 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100/70 p-3.5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(244,114,182,0.2)] ${
                  activeSubject === tamilSubject?.id ? "ring-2 ring-pink-400 bg-pink-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-13 shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src="/images/junior/subject-tamil-3d.png"
                      alt="Tamil 3D Book"
                      width={52}
                      height={52}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-[15px] font-black text-pink-900 leading-tight">
                      தமிழ் <span className="text-xs font-semibold text-pink-700">Tamil</span>
                    </h3>
                    <p className="font-display text-[11px] font-semibold text-pink-700/90 leading-snug">
                      Language & Literature
                    </p>
                  </div>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-pink-500 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
                  <CaretRight size={13} weight="bold" />
                </span>
              </button>

              {/* 2. English */}
              <button
                type="button"
                onClick={() => handleSelectSubject(englishSubject)}
                className={`group flex items-center justify-between gap-3 rounded-2xl border border-sky-200/90 bg-gradient-to-r from-sky-50 via-blue-50 to-sky-100/70 p-3.5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(56,189,248,0.2)] ${
                  activeSubject === englishSubject?.id ? "ring-2 ring-sky-400 bg-sky-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-13 shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src="/images/junior/subject-english-3d.png"
                      alt="English 3D ABC block"
                      width={52}
                      height={52}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-[15px] font-black text-sky-900 leading-tight">
                      English
                    </h3>
                    <p className="font-display text-[11px] font-semibold text-sky-700/90 leading-snug">
                      Language & Communication
                    </p>
                  </div>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-sky-500 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
                  <CaretRight size={13} weight="bold" />
                </span>
              </button>

              {/* 3. Mathematics */}
              <button
                type="button"
                onClick={() => handleSelectSubject(mathSubject)}
                className={`group flex items-center justify-between gap-3 rounded-2xl border border-purple-200/90 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100/70 p-3.5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(168,85,247,0.2)] ${
                  activeSubject === mathSubject?.id ? "ring-2 ring-purple-400 bg-purple-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-13 shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src="/images/junior/subject-math-3d.png"
                      alt="Mathematics 3D calculator"
                      width={52}
                      height={52}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-[15px] font-black text-purple-900 leading-tight">
                      Mathematics
                    </h3>
                    <p className="font-display text-[11px] font-semibold text-purple-700/90 leading-snug">
                      Logic & Problem Solving
                    </p>
                  </div>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-purple-600 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
                  <CaretRight size={13} weight="bold" />
                </span>
              </button>

              {/* 4. Science */}
              <button
                type="button"
                onClick={() => handleSelectSubject(scienceSubject)}
                className={`group flex items-center justify-between gap-3 rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 p-3.5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] ${
                  activeSubject === scienceSubject?.id ? "ring-2 ring-emerald-400 bg-emerald-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-13 shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src="/images/junior/subject-science-3d.png"
                      alt="Science 3D microscope"
                      width={52}
                      height={52}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-[15px] font-black text-emerald-900 leading-tight">
                      Science
                    </h3>
                    <p className="font-display text-[11px] font-semibold text-emerald-700/90 leading-snug">
                      Explore the Nature
                    </p>
                  </div>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-emerald-600 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
                  <CaretRight size={13} weight="bold" />
                </span>
              </button>

              {/* 5. Social Science */}
              <button
                type="button"
                onClick={() => handleSelectSubject(socialSubject)}
                className={`group flex items-center justify-between gap-3 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100/70 p-3.5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(245,158,11,0.2)] ${
                  activeSubject === socialSubject?.id ? "ring-2 ring-amber-400 bg-amber-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-13 shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src="/images/junior/subject-social-3d.png"
                      alt="Social Science 3D globe"
                      width={52}
                      height={52}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-[15px] font-black text-amber-900 leading-tight">
                      Social Science
                    </h3>
                    <p className="font-display text-[11px] font-semibold text-amber-700/90 leading-snug">
                      Our World & Society
                    </p>
                  </div>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-amber-500 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
                  <CaretRight size={13} weight="bold" />
                </span>
              </button>

              {/* 6. Feature Scene Tile: "Learn Today Build Tomorrow" */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/70 to-orange-50/60 p-2 shadow-sm flex items-center justify-center">
                <Image
                  src="/images/junior/fairytale-sign.png"
                  alt="Learn Today Build Tomorrow sign with globe and books"
                  width={220}
                  height={130}
                  className="w-full h-24 object-contain rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* C. INTERACTIVE CHAPTER EXPLORER ACCORDION                         */}
          {/* ----------------------------------------------------------------- */}
          <section className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-sm font-black text-slate-800 flex items-center gap-1.5">
                <BookOpen size={16} weight="fill" className="text-blue-600" />
                <span>
                  {activeSubject === "all" ? "All Chapters" : subjects.find((s) => s.id === activeSubject)?.name[locale]}
                </span>
                <span className="font-mono text-xs text-slate-500 font-normal">
                  ({displayedChapters.length} lessons)
                </span>
              </span>
              {activeSubject !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveSubject("all")}
                  className="font-mono text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Show all subjects
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {displayedChapters.slice(0, 10).map((item, idx) => (
                <button
                  key={item.chapter.id}
                  type="button"
                  onClick={() => onOpenChapter(item.chapter.id)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/60 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-blue-100 font-mono text-[11px] font-bold text-blue-700">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-blue-600">
                        {item.chapter.title[locale]}
                      </p>
                      <p className="truncate font-mono text-[10.5px] text-slate-500">
                        {item.subject.name[locale]} • {item.chapter.summary[locale]}
                      </p>
                    </div>
                  </div>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Play size={10} weight="fill" className="ml-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>

        {/* ===================================================================== */}
        {/* RIGHT SIDEBAR: 3 FROSTED GLASS CARDS                                  */}
        {/* ===================================================================== */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          {/* ----------------------------------------------------------------- */}
          {/* CARD 1: YOUR LEARNING PATH                                        */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_16px_40px_rgba(30,58,138,0.1)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="size-11 shrink-0 transition-transform hover:rotate-12 duration-300">
                <Image
                  src="/images/junior/path-compass.png"
                  alt="3D Golden Compass"
                  width={44}
                  height={44}
                  className="size-full object-contain drop-shadow-sm"
                />
              </div>
              <h3 className="font-display text-base font-black text-slate-900 leading-tight">
                Your Learning Path
              </h3>
            </div>

            {/* Breadcrumb Path */}
            <p className="font-mono text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-blue-700 font-bold">Class {currentStandard}</span>
              <span>→</span>
              <span>Term 1</span>
              <span>→</span>
              <span className="text-purple-700 font-bold">Chapter 1</span>
            </p>

            {/* Progress Bar Row */}
            <div className="flex items-center gap-3">
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
                  style={{ width: `${Math.max(15, Math.round((completedChaptersCount / Math.max(totalChapters, 1)) * 100))}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-slate-600">
                {completedChaptersCount}/{totalChapters}
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 2: CONTINUE LEARNING                                         */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_16px_40px_rgba(30,58,138,0.1)] backdrop-blur-2xl">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="grid size-7 place-items-center rounded-full bg-purple-600 text-white shadow-sm">
                <Play size={12} weight="fill" className="ml-0.5" />
              </span>
              <h3 className="font-display text-base font-black text-slate-900 leading-tight">
                Continue Learning
              </h3>
            </div>

            {/* Active Lesson Tile */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/80 to-indigo-50/70 p-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 shrink-0 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src="/images/junior/continue-math-3d.png"
                    alt="Math Symbols"
                    width={48}
                    height={48}
                    className="size-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-sm font-black text-slate-900 leading-tight truncate">
                    {continueRecord ? continueRecord.subject.name[locale] : "Mathematics"}
                  </h4>
                  <p className="font-display text-xs font-bold text-purple-700 leading-snug truncate">
                    {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 1: Integers & Logic"}
                  </p>
                  <p className="font-mono text-[10.5px] text-slate-500 mt-0.5">
                    Lesson 2 • 12 min
                  </p>
                </div>
              </div>

              {/* Purple "Continue >" Pill Button */}
              <button
                type="button"
                onClick={handleLaunchContinue}
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 font-display text-xs font-black text-white shadow-[0_4px_14px_rgba(147,51,234,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_18px_rgba(147,51,234,0.55)] active:scale-95"
              >
                <span>Continue</span>
                <CaretRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 3: QUICK ACCESS (NOTES, PRACTICE, DOWNLOADS + MASCOT OWL)    */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_16px_40px_rgba(30,58,138,0.1)] backdrop-blur-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">
                <Lightning size={18} weight="fill" />
              </span>
              <h3 className="font-display text-base font-black text-slate-900 leading-tight">
                Quick Access
              </h3>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleLaunchContinue}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-left transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
              >
                <span className="grid size-8 place-items-center rounded-xl bg-blue-100 text-blue-600">
                  <FileText size={18} weight="fill" />
                </span>
                <span className="font-display text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-blue-700">
                  My Notes
                </span>
              </button>

              <button
                type="button"
                onClick={handleLaunchContinue}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-left transition-all duration-200 hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-sm"
              >
                <span className="grid size-8 place-items-center rounded-xl bg-purple-100 text-purple-600">
                  <PencilSimple size={18} weight="fill" />
                </span>
                <span className="font-display text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-purple-700">
                  Practice Questions
                </span>
              </button>

              <button
                type="button"
                onClick={handleLaunchContinue}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-left transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm"
              >
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                  <DownloadSimple size={18} weight="bold" />
                </span>
                <span className="font-display text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-emerald-700">
                  Download PDFs
                </span>
              </button>
            </div>

            {/* Mascot Owl Quote Card */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="rounded-2xl border border-purple-200/80 bg-purple-50/70 p-3 shadow-inner">
                <p className="font-display text-xs font-bold text-purple-900 leading-snug">
                  Small progress every day leads to big results! <span className="text-pink-500">💜</span>
                </p>
              </div>
              <div className="size-16 shrink-0 transition-transform hover:scale-105 duration-300">
                <Image
                  src="/images/junior/fairytale-owl.png"
                  alt="Cute 3D Blue Owl on Books"
                  width={64}
                  height={64}
                  className="size-full object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
