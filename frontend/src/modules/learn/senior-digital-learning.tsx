"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CaretLeft,
  CaretRight,
  Check,
  Compass,
  DownloadSimple,
  FileText,
  GraduationCap,
  House,
  Moon,
  PencilSimple,
  Play,
  Sparkle,
  Star,
  Sun,
  Trophy,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { useProgress } from "@/components/progress-store";
import { useTheme } from "@/lib/theme";
import type { CurriculumChapter, CurriculumSubject } from "@/lib/curriculum";

interface SeniorDigitalLearningProps {
  currentStandard: number;
  subjects: readonly CurriculumSubject[];
  allFlatChapters: Array<{ subject: CurriculumSubject; chapter: CurriculumChapter }>;
  filter: string;
  setFilter: (f: string) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenStandardSwitcher: () => void;
  onSelectStandard: (std: number) => void;
  continueRecord: {
    subject: CurriculumSubject;
    chapter: CurriculumChapter;
    isStarter: boolean;
  } | null;
  totalChapters: number;
  completedChaptersCount: number;
  seniorGroupFilter?: string;
  onSelectSeniorGroup?: (group: string) => void;
}

const CLASS_ITEMS = [
  { std: 1, label: "Class 1", image: "/images/learn/class-1-art.png" },
  { std: 2, label: "Class 2", image: "/images/learn/class-2-art.png" },
  { std: 3, label: "Class 3", image: "/images/learn/class-3-art.png" },
  { std: 4, label: "Class 4", image: "/images/learn/class-4-art.png" },
  { std: 5, label: "Class 5", image: "/images/learn/class-5-art.png" },
  { std: 6, label: "Class 6", image: "/images/learn/class-6-art.png" },
  { std: 7, label: "Class 7", image: "/images/learn/class-7-shapes.png" },
  { std: 8, label: "Class 8", image: "/images/learn/class-8-armillary.png" },
  { std: 9, label: "Class 9", image: "/images/learn/class-9-books.png" },
  { std: 10, label: "Class 10", image: "/images/learn/class-10-compass.png" },
  { std: 11, label: "Class 11", image: "/images/learn/class-11-molecule.png" },
  { std: 12, label: "Class 12", image: "/images/learn/class-12-trophy.png" },
];

export function SeniorDigitalLearning({
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
}: SeniorDigitalLearningProps) {
  const { locale, setLocale, t } = useLocale();
  const progress = useProgress();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Active subject filter: "all" or subjectId
  const [activeSubjectId, setActiveSubjectId] = useState<string>("all");

  const handleBack = () => {
    if (activeSubjectId !== "all") {
      setActiveSubjectId("all");
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const displayedChapters = useMemo(() => {
    if (activeSubjectId === "all") return allFlatChapters;
    return allFlatChapters.filter((item) => item.subject.id === activeSubjectId);
  }, [activeSubjectId, allFlatChapters]);

  // Subject matchers for Class 4-10
  const tamilSubject = useMemo(() => subjects.find((s) => s.id.includes("tamil")), [subjects]);
  const englishSubject = useMemo(() => subjects.find((s) => s.id.includes("english")), [subjects]);
  const mathSubject = useMemo(
    () => subjects.find((s) => s.id.includes("math") || s.name.en.toLowerCase().includes("math")),
    [subjects]
  );
  const scienceSubject = useMemo(
    () => subjects.find((s) => s.id.includes("science") || s.id.includes("physics") || s.id.includes("bio")),
    [subjects]
  );
  const socialSubject = useMemo(
    () => subjects.find((s) => s.id.includes("social") || s.id.includes("history")),
    [subjects]
  );

  const learnerName = progress.profile?.name || "Kavin";

  // Progress percentage
  const progressPct = totalChapters > 0 ? Math.round((completedChaptersCount / totalChapters) * 100) : 60;

  const handleLaunchContinue = () => {
    if (continueRecord) {
      onOpenChapter(continueRecord.chapter.id);
    } else if (allFlatChapters[0]) {
      onOpenChapter(allFlatChapters[0].chapter.id);
    }
  };

  const handleSelectSubject = (sub?: CurriculumSubject) => {
    if (sub) {
      setActiveSubjectId((prev) => (prev === sub.id ? "all" : sub.id));
      if (sub.chapters[0]) {
        onOpenChapter(sub.chapters[0].id);
      }
    } else if (allFlatChapters[0]) {
      onOpenChapter(allFlatChapters[0].chapter.id);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 sm:gap-8 pb-28 sm:pb-36 select-none text-slate-100">
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: BRAND LOGO + CENTER NAV + LANG / THEME / PROFILE           */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-purple-900/40 pb-4 pt-1">
        {/* Left: Back button + GSX Kalpavriksha Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-1.5 rounded-xl border border-purple-800/50 bg-purple-950/60 px-3 py-2 text-xs font-semibold text-purple-200 transition-all hover:bg-purple-900/60 hover:text-white hover:border-purple-500 shadow-sm"
            title="Go Back"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5 text-purple-400 group-hover:text-purple-200" />
            <span>Back</span>
          </button>

          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-purple-950/60 p-1 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Image
                src="/images/learn/brand-tree-logo.png"
                alt="GSX Kalpavriksha Logo"
                width={40}
                height={40}
                className="size-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-black tracking-tight text-white leading-none">
                GSX
              </span>
              <span className="font-headline text-[15px] font-bold text-purple-200 leading-tight">
                Kalpavriksha
              </span>
              <span className="font-mono text-[10px] text-purple-300/60 leading-none">
                Rooted to Rise
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Module Title Pill */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-purple-800/40 bg-purple-950/50 px-4 py-1.5 backdrop-blur-md shadow-inner">
          <GraduationCap size={16} weight="fill" className="text-purple-300" />
          <span className="font-display text-xs font-bold text-white tracking-wide">Digital Learning</span>
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
        </div>

        {/* Right: Language, Theme & Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ta" : "en")}
            className="flex items-center gap-1 rounded-xl border border-purple-800/40 bg-purple-950/50 px-3 py-1.5 text-xs font-medium text-purple-200 transition-colors hover:border-purple-600/60 hover:text-white"
          >
            <span>{locale === "en" ? "English" : "தமிழ்"}</span>
            <span className="text-[10px] text-purple-400">▾</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle theme"
            className="grid size-9 place-items-center rounded-xl border border-purple-800/40 bg-purple-950/50 text-purple-300 transition-colors hover:border-purple-600/60 hover:text-white"
          >
            {theme === "dark" ? <Moon size={16} weight="fill" /> : <Sun size={16} weight="fill" />}
          </button>

          {/* Profile Card */}
          <button
            type="button"
            onClick={onOpenStandardSwitcher}
            className="group flex items-center gap-2.5 rounded-full border border-purple-700/50 bg-gradient-to-r from-purple-950/80 to-[#1e0e38]/80 py-1 pl-1 pr-3 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all hover:border-purple-500 hover:scale-[1.02]"
          >
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-purple-400 bg-purple-900 p-0.5">
              <Image
                src="/images/junior/learner-avatar.png"
                alt="Learner Avatar"
                width={32}
                height={32}
                className="size-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-xs font-bold text-white leading-tight">
                {learnerName}
              </span>
              <span className="font-mono text-[10px] text-purple-300/80 flex items-center gap-1">
                Class {currentStandard} <span className="text-[9px]">▾</span>
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO BANNER: "DIGITAL LEARNING" + 3D MAGICAL OPEN BOOK SCENE           */}
      {/* ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-3xl border border-purple-800/30 bg-gradient-to-r from-[#170a2c]/80 via-[#210e3f]/60 to-[#120724]/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(10,4,20,0.5)]">
        {/* Left: Titles */}
        <div className="lg:col-span-6 flex flex-col gap-2.5">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_18px_rgba(168,85,247,0.35)]">
            Digital Learning
          </h1>
          <p className="font-display text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-300 bg-clip-text text-transparent">
            Explore. Discover. Grow.
          </p>
          <p className="font-headline text-sm sm:text-base text-purple-200/70 max-w-md">
            Your learning journey, beautifully connected.
          </p>
        </div>

        {/* Right: 3D Magical Open Book, Globe, Flask, Microscope & Cherry Blossoms */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[460px] aspect-[780/324] transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src="/images/learn/hero-3d-scene.png"
              alt="Magical 3D open book with glowing potions, globe, microscope, and hourglass"
              fill
              priority
              className="object-contain drop-shadow-[0_10px_35px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN 2-COLUMN GRID: CONTENT (8 cols) + RIGHT SIDEBAR (4 cols)          */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
        {/* ===================================================================== */}
        {/* LEFT MAIN AREA (8 cols)                                               */}
        {/* ===================================================================== */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* ----------------------------------------------------------------- */}
          {/* A. CHOOSE YOUR LEARNING WORLD (CLASS 1 TO 12 CAROUSEL)            */}
          {/* ----------------------------------------------------------------- */}
          <section className="flex flex-col gap-3 rounded-2xl border border-purple-900/30 bg-[#140a28]/60 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Sparkle size={18} weight="fill" className="text-purple-400" />
              <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                Choose Your Learning World
              </h2>
            </div>

            {/* Class Cards Carousel with < on left and > on right */}
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectStandard(Math.max(1, currentStandard - 1))}
                className="grid size-8 shrink-0 place-items-center rounded-xl border border-purple-800/40 bg-purple-950/60 text-purple-300 hover:text-white hover:border-purple-600 transition-colors"
                title="Previous Class"
              >
                <CaretLeft size={16} weight="bold" />
              </button>

              <div
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className="flex-1 flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 scroll-smooth [&::-webkit-scrollbar]:hidden"
              >
                {CLASS_ITEMS.map((item) => {
                  const isSelected = item.std === currentStandard;
                  return (
                    <button
                      key={item.std}
                      type="button"
                      onClick={() => onSelectStandard(item.std)}
                      className={`group relative flex flex-col items-center justify-between rounded-xl p-2.5 transition-all duration-300 min-w-[70px] shrink-0 ${
                        isSelected
                          ? "border-2 border-purple-500 bg-purple-900/40 shadow-[0_0_18px_rgba(168,85,247,0.45)] scale-105"
                          : "border border-purple-900/30 bg-purple-950/20 hover:border-purple-700/50 hover:bg-purple-900/20"
                      }`}
                    >
                      {/* Checkmark on active */}
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-purple-500 text-white shadow-sm">
                          <Check size={10} weight="bold" />
                        </span>
                      )}

                      <span className="font-mono text-[10px] text-purple-300/70 group-hover:text-purple-200">
                        Class
                      </span>
                      <span className={`font-display text-sm font-black ${isSelected ? "text-white" : "text-purple-200"}`}>
                        {item.std}
                      </span>

                      {/* 3D Class Art */}
                      <div className="relative size-10 my-1 transition-transform group-hover:scale-110">
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={40}
                          height={40}
                          className="size-full object-contain drop-shadow-sm"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onSelectStandard(Math.min(12, currentStandard + 1))}
                className="grid size-8 shrink-0 place-items-center rounded-xl border border-purple-800/40 bg-purple-950/60 text-purple-300 hover:text-white hover:border-purple-600 transition-colors"
                title="Next Class"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* B. EXPLORE YOUR SUBJECTS                                          */}
          {/* ----------------------------------------------------------------- */}
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkle size={18} weight="fill" className="text-purple-400" />
                <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                  Explore Your Subjects
                </h2>
              </div>
              {activeSubjectId !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveSubjectId("all")}
                  className="font-mono text-xs text-purple-400 hover:text-purple-300 hover:underline"
                >
                  View All Subjects
                </button>
              )}
            </div>

            {/* 5 Subject Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* 1. Tamil */}
              <div
                onClick={() => handleSelectSubject(tamilSubject)}
                className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-[#240e30]/80 to-[#16081e]/90 backdrop-blur-md ${
                  activeSubjectId === tamilSubject?.id
                    ? "border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.35)] ring-1 ring-pink-400"
                    : "border-pink-900/30 hover:border-pink-600/50"
                }`}
              >
                <div>
                  <h3 className="font-display text-base font-black text-pink-100 leading-tight">
                    Tamil
                  </h3>
                  <p className="font-display text-[11px] font-semibold text-pink-300/80 leading-snug">
                    அறிவு வளர்ச்சி
                  </p>
                </div>
                <div className="relative my-3 size-20 self-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/learn/subject-tamil-scroll.png"
                    alt="Tamil antique parchment scroll with quill pen"
                    width={80}
                    height={80}
                    className="size-full object-contain drop-shadow-[0_4px_12px_rgba(236,72,153,0.3)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-pink-300/70 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>{tamilSubject ? tamilSubject.chapters.length : 18} Chapters</span>
                  </span>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-pink-700/50 bg-pink-950/40 py-1.5 text-center font-display text-xs font-bold text-pink-200 transition-colors group-hover:bg-pink-900/50 group-hover:text-white"
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* 2. English */}
              <div
                onClick={() => handleSelectSubject(englishSubject)}
                className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-[#0f1d38]/80 to-[#0a1224]/90 backdrop-blur-md ${
                  activeSubjectId === englishSubject?.id
                    ? "border-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.35)] ring-1 ring-sky-400"
                    : "border-sky-900/30 hover:border-sky-600/50"
                }`}
              >
                <div>
                  <h3 className="font-display text-base font-black text-sky-100 leading-tight">
                    English
                  </h3>
                  <p className="font-display text-[11px] font-semibold text-sky-300/80 leading-snug">
                    Language & Literature
                  </p>
                </div>
                <div className="relative my-3 size-20 self-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/learn/subject-english-books.png"
                    alt="English classic stacked books with wooden letter A"
                    width={80}
                    height={80}
                    className="size-full object-contain drop-shadow-[0_4px_12px_rgba(56,189,248,0.3)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-sky-300/70 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>{englishSubject ? englishSubject.chapters.length : 22} Chapters</span>
                  </span>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-sky-700/50 bg-sky-950/40 py-1.5 text-center font-display text-xs font-bold text-sky-200 transition-colors group-hover:bg-sky-900/50 group-hover:text-white"
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* 3. Mathematics */}
              <div
                onClick={() => handleSelectSubject(mathSubject)}
                className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-[#21123a]/80 to-[#140a24]/90 backdrop-blur-md ${
                  activeSubjectId === mathSubject?.id
                    ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-1 ring-purple-400"
                    : "border-purple-900/30 hover:border-purple-600/50"
                }`}
              >
                <div>
                  <h3 className="font-display text-base font-black text-purple-100 leading-tight">
                    Mathematics
                  </h3>
                  <p className="font-display text-[11px] font-semibold text-purple-300/80 leading-snug">
                    Numbers, Algebra & Geometry
                  </p>
                </div>
                <div className="relative my-3 size-20 self-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/learn/subject-math-calc.png"
                    alt="Mathematics 3D calculator with geometric blocks"
                    width={80}
                    height={80}
                    className="size-full object-contain drop-shadow-[0_4px_12px_rgba(168,85,247,0.3)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-purple-300/70 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>{mathSubject ? mathSubject.chapters.length : 24} Chapters</span>
                  </span>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-purple-700/50 bg-purple-950/40 py-1.5 text-center font-display text-xs font-bold text-purple-200 transition-colors group-hover:bg-purple-900/50 group-hover:text-white"
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* 4. Science */}
              <div
                onClick={() => handleSelectSubject(scienceSubject)}
                className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-[#0c2422]/80 to-[#071615]/90 backdrop-blur-md ${
                  activeSubjectId === scienceSubject?.id
                    ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400"
                    : "border-emerald-900/30 hover:border-emerald-600/50"
                }`}
              >
                <div>
                  <h3 className="font-display text-base font-black text-emerald-100 leading-tight">
                    Science
                  </h3>
                  <p className="font-display text-[11px] font-semibold text-emerald-300/80 leading-snug">
                    Discover. Learn. Understand.
                  </p>
                </div>
                <div className="relative my-3 size-20 self-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/learn/subject-science-micro.png"
                    alt="Science microscope and green sprout in flask"
                    width={80}
                    height={80}
                    className="size-full object-contain drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-emerald-300/70 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>{scienceSubject ? scienceSubject.chapters.length : 28} Chapters</span>
                  </span>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-emerald-700/50 bg-emerald-950/40 py-1.5 text-center font-display text-xs font-bold text-emerald-200 transition-colors group-hover:bg-emerald-900/50 group-hover:text-white"
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* 5. Social Science */}
              <div
                onClick={() => handleSelectSubject(socialSubject)}
                className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-[#2a1b12]/80 to-[#190f09]/90 backdrop-blur-md ${
                  activeSubjectId === socialSubject?.id
                    ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-400"
                    : "border-amber-900/30 hover:border-amber-600/50"
                }`}
              >
                <div>
                  <h3 className="font-display text-base font-black text-amber-100 leading-tight">
                    Social Science
                  </h3>
                  <p className="font-display text-[11px] font-semibold text-amber-300/80 leading-snug">
                    Our History, Our World
                  </p>
                </div>
                <div className="relative my-3 size-20 self-center transition-transform group-hover:scale-105">
                  <Image
                    src="/images/learn/subject-social-globe.png"
                    alt="Social Science antique brass compass and globe"
                    width={80}
                    height={80}
                    className="size-full object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-amber-300/70 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>{socialSubject ? socialSubject.chapters.length : 20} Chapters</span>
                  </span>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-amber-700/50 bg-amber-950/40 py-1.5 text-center font-display text-xs font-bold text-amber-200 transition-colors group-hover:bg-amber-900/50 group-hover:text-white"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* C. EXPANDED CHAPTERS EXPLORER (Shown only when subject is clicked)*/}
          {/* ----------------------------------------------------------------- */}
          {activeSubjectId !== "all" && (
            <section className="fade-up rounded-2xl border border-purple-900/30 bg-[#140a28]/80 p-4 sm:p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-400" />
                  <span>
                    {subjects.find((s) => s.id === activeSubjectId)?.name[locale] || "Chapters"}
                  </span>
                  <span className="font-mono text-xs text-purple-300/60 font-normal">
                    ({displayedChapters.length} chapters)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubjectId("all")}
                  className="rounded-lg border border-purple-800/40 bg-purple-950/50 px-2.5 py-1 font-mono text-[11px] text-purple-300 hover:text-white hover:border-purple-600 transition-colors"
                >
                  ✕ Close Explorer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {displayedChapters.map((item, idx) => (
                  <button
                    key={item.chapter.id}
                    type="button"
                    onClick={() => onOpenChapter(item.chapter.id)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-purple-900/40 bg-purple-950/30 px-3.5 py-2.5 text-left transition-all duration-200 hover:border-purple-600/60 hover:bg-purple-900/30 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-purple-900/60 border border-purple-700/40 font-mono text-[11px] font-bold text-purple-200">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-xs sm:text-[13px] font-bold text-slate-100 group-hover:text-purple-300">
                          {item.chapter.title[locale]}
                        </p>
                        <p className="truncate font-mono text-[10.5px] text-purple-300/60">
                          {item.subject.name[locale]} • {item.chapter.summary[locale]}
                        </p>
                      </div>
                    </div>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-purple-600/40 text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Play size={10} weight="fill" className="ml-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* D. LEARNING UNIVERSE (BOTTOM QUICK NAVIGATION BAR)                */}
          {/* ----------------------------------------------------------------- */}
          <section className="flex flex-col gap-3 rounded-2xl border border-purple-900/30 bg-[#140a28]/60 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400">🪐</span>
              <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                Learning Universe
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* 1. Live Classes */}
              <div className="group flex items-center gap-2.5 rounded-xl border border-purple-900/30 bg-purple-950/30 p-2.5 transition-all hover:border-purple-600/50 hover:bg-purple-900/30">
                <div className="relative size-10 shrink-0">
                  <Image
                    src="/images/learn/universe-live.png"
                    alt="Live Classes"
                    width={40}
                    height={40}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-white leading-tight">
                    Live Classes
                  </h4>
                  <p className="font-mono text-[10px] text-purple-300/60 truncate">
                    Join interactive sessions
                  </p>
                </div>
              </div>

              {/* 2. Quizzes & Games */}
              <Link
                href="/m/evaluate"
                className="group flex items-center gap-2.5 rounded-xl border border-purple-900/30 bg-purple-950/30 p-2.5 transition-all hover:border-purple-600/50 hover:bg-purple-900/30"
              >
                <div className="relative size-10 shrink-0">
                  <Image
                    src="/images/learn/universe-quiz.png"
                    alt="Quizzes & Games"
                    width={40}
                    height={40}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-white leading-tight">
                    Quizzes & Games
                  </h4>
                  <p className="font-mono text-[10px] text-purple-300/60 truncate">
                    Learn & test knowledge
                  </p>
                </div>
              </Link>

              {/* 3. Library */}
              <div className="group flex items-center gap-2.5 rounded-xl border border-purple-900/30 bg-purple-950/30 p-2.5 transition-all hover:border-purple-600/50 hover:bg-purple-900/30">
                <div className="relative size-10 shrink-0">
                  <Image
                    src="/images/learn/universe-library.png"
                    alt="Library"
                    width={40}
                    height={40}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-white leading-tight">
                    Library
                  </h4>
                  <p className="font-mono text-[10px] text-purple-300/60 truncate">
                    e-Books & Resources
                  </p>
                </div>
              </div>

              {/* 4. Assignments */}
              <div className="group flex items-center gap-2.5 rounded-xl border border-purple-900/30 bg-purple-950/30 p-2.5 transition-all hover:border-purple-600/50 hover:bg-purple-900/30">
                <div className="relative size-10 shrink-0">
                  <Image
                    src="/images/learn/universe-assign.png"
                    alt="Assignments"
                    width={40}
                    height={40}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-white leading-tight">
                    Assignments
                  </h4>
                  <p className="font-mono text-[10px] text-purple-300/60 truncate">
                    Submit & track work
                  </p>
                </div>
              </div>

              {/* 5. Achievements */}
              <div className="group flex items-center gap-2.5 rounded-xl border border-purple-900/30 bg-purple-950/30 p-2.5 transition-all hover:border-purple-600/50 hover:bg-purple-900/30">
                <div className="relative size-10 shrink-0">
                  <Image
                    src="/images/learn/universe-achieve.png"
                    alt="Achievements"
                    width={40}
                    height={40}
                    className="size-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-white leading-tight">
                    Achievements
                  </h4>
                  <p className="font-mono text-[10px] text-purple-300/60 truncate">
                    Badges & Rewards
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT SIDEBAR (4 cols)                                                */}
        {/* ===================================================================== */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          {/* ----------------------------------------------------------------- */}
          {/* CARD 1: YOUR LEARNING PATH                                        */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-purple-900/30 bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap size={18} weight="fill" className="text-purple-400" />
                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                  Your Learning Path
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenStandardSwitcher}
                className="font-mono text-[11px] text-purple-400 hover:text-purple-300 hover:underline"
              >
                View All
              </button>
            </div>

            {/* Breadcrumb Path */}
            <p className="font-mono text-xs text-purple-200/90 mb-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-purple-300 font-bold">Class {currentStandard}</span>
              <span>›</span>
              <span className="text-pink-300">
                {continueRecord ? continueRecord.subject.name[locale] : "Science"}
              </span>
              <span>›</span>
              <span>Term 1</span>
              <span>›</span>
              <span className="text-indigo-300 font-bold">
                {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 3"}
              </span>
            </p>

            {/* Progress bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-purple-950/80 border border-purple-900/50 mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-[0_0_12px_#a855f7] transition-all duration-500"
                style={{ width: `${Math.max(15, progressPct)}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-purple-300/70">
              <span>{completedChaptersCount} of {totalChapters} chapters completed</span>
              <span className="font-bold text-purple-300">{progressPct}%</span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 2: CONTINUE LEARNING                                         */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-purple-900/30 bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-purple-600 text-white shadow-sm">
                  <Play size={10} weight="fill" className="ml-0.5" />
                </span>
                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                  Continue Learning
                </h3>
              </div>
              <button
                type="button"
                onClick={handleLaunchContinue}
                className="font-mono text-[11px] text-purple-400 hover:text-purple-300 hover:underline"
              >
                View All
              </button>
            </div>

            {/* Active Chapter Card */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-800/30 bg-purple-950/40 p-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-purple-700/40 bg-purple-900/50">
                  <Image
                    src="/images/learn/continue-sprout.png"
                    alt="Sprout in soil pot"
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs sm:text-[13px] font-bold text-white leading-tight truncate">
                    {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 3: Plants Around Us"}
                  </h4>
                  <p className="font-mono text-[10.5px] text-purple-300/70 truncate mt-0.5">
                    {continueRecord ? continueRecord.subject.name[locale] : "Science"} • Term 1
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-purple-900/60">
                      <div className="h-full rounded-full bg-purple-400" style={{ width: "60%" }} />
                    </div>
                    <span className="font-mono text-[9.5px] text-purple-400">60%</span>
                  </div>
                </div>
              </div>

              {/* Purple Continue Button */}
              <button
                type="button"
                onClick={handleLaunchContinue}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 font-display text-xs font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all hover:bg-purple-500 hover:scale-105 active:scale-95"
              >
                <span>Continue</span>
                <CaretRight size={11} weight="bold" />
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 3: QUICK ACCESS                                              */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-purple-900/30 bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-lg flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400">📚</span>
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                Quick Access
              </h3>
            </div>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between rounded-xl border border-purple-900/40 bg-purple-950/30 px-3.5 py-2.5 text-left transition-all hover:border-purple-600/50 hover:bg-purple-900/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-purple-900/60 text-purple-300">
                  <FileText size={16} />
                </span>
                <span className="font-display text-xs font-bold text-purple-100 group-hover:text-white">
                  My Notes
                </span>
              </div>
              <CaretRight size={12} className="text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between rounded-xl border border-purple-900/40 bg-purple-950/30 px-3.5 py-2.5 text-left transition-all hover:border-purple-600/50 hover:bg-purple-900/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-purple-900/60 text-purple-300">
                  <PencilSimple size={16} />
                </span>
                <span className="font-display text-xs font-bold text-purple-100 group-hover:text-white">
                  Practice Questions
                </span>
              </div>
              <CaretRight size={12} className="text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between rounded-xl border border-purple-900/40 bg-purple-950/30 px-3.5 py-2.5 text-left transition-all hover:border-purple-600/50 hover:bg-purple-900/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-purple-900/60 text-purple-300">
                  <DownloadSimple size={16} />
                </span>
                <span className="font-display text-xs font-bold text-purple-100 group-hover:text-white">
                  Download PDFs
                </span>
              </div>
              <CaretRight size={12} className="text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 4: DAILY ENCOURAGEMENT (QUOTE + 3D OWL ON BOOKS)             */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-purple-900/30 bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-pink-400">🌸</span>
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                Daily Encouragement
              </h3>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-serif italic text-xs leading-relaxed text-purple-200/90">
                  “The beautiful thing about learning is that no one can take it away from you.”
                </p>
                <p className="font-mono text-[10.5px] text-pink-300/80 mt-1 font-semibold">
                  — B.B. King
                </p>
              </div>

              {/* 3D Owl Sitting on Stacked Books */}
              <div className="relative size-16 shrink-0 transition-transform hover:scale-105 duration-300">
                <Image
                  src="/images/learn/encouragement-owl.png"
                  alt="Cute 3D owl with cherry blossom petals"
                  width={64}
                  height={64}
                  className="size-full object-contain drop-shadow-[0_4px_12px_rgba(168,85,247,0.3)]"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
