"use client";

import React, { useMemo, useRef, useState } from "react";
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
import { SENIOR_GROUPS, type CurriculumChapter, type CurriculumSubject } from "@/lib/curriculum";

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

function getSubjectVisual(sub: CurriculumSubject) {
  const id = sub.id.toLowerCase();
  const code = (sub.code || "").toUpperCase();

  // 1. Tamil
  if (id.includes("tamil") || code.startsWith("TAM")) {
    return {
      image: "/images/learn/subject-tamil-scroll.png",
      gradient: "from-[#280f2d]/85 to-[#16081e]/90",
      borderClass: "border-pink-900/35 hover:border-pink-600/50",
      activeBorderClass: "border-pink-500 shadow-[0_0_22px_rgba(236,72,153,0.35)] ring-1 ring-pink-400",
      subtextColor: "text-pink-300/80",
      tagline: "அறிவு வளர்ச்சி",
      btnBorder: "border-pink-700/50",
      btnBg: "bg-pink-950/40",
      btnHoverBg: "group-hover:bg-pink-900/50",
      btnText: "text-pink-200 group-hover:text-white",
    };
  }

  // 2. English
  if (id.includes("english") || code.startsWith("ENG")) {
    return {
      image: "/images/learn/subject-english-books.png",
      gradient: "from-[#0f1d38]/85 to-[#0a1224]/90",
      borderClass: "border-sky-900/35 hover:border-sky-600/50",
      activeBorderClass: "border-sky-500 shadow-[0_0_22px_rgba(56,189,248,0.35)] ring-1 ring-sky-400",
      subtextColor: "text-sky-300/80",
      tagline: "Language & Literature",
      btnBorder: "border-sky-700/50",
      btnBg: "bg-sky-950/40",
      btnHoverBg: "group-hover:bg-sky-900/50",
      btnText: "text-sky-200 group-hover:text-white",
    };
  }

  // 3. Physics (11th & 12th)
  if (id.includes("physics") || code.startsWith("PHY")) {
    return {
      image: "/images/learn/class-11-molecule.png",
      gradient: "from-[#0b243d]/85 to-[#051424]/90",
      borderClass: "border-cyan-900/35 hover:border-cyan-500/50",
      activeBorderClass: "border-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.35)] ring-1 ring-cyan-300",
      subtextColor: "text-cyan-300/80",
      tagline: "Forces, Waves & Cosmos",
      btnBorder: "border-cyan-700/50",
      btnBg: "bg-cyan-950/40",
      btnHoverBg: "group-hover:bg-cyan-900/50",
      btnText: "text-cyan-200 group-hover:text-white",
    };
  }

  // 4. Chemistry (11th & 12th)
  if (id.includes("chemistry") || code.startsWith("CHE")) {
    return {
      image: "/images/learn/subject-science-micro.png",
      gradient: "from-[#0a2e28]/85 to-[#051c18]/90",
      borderClass: "border-teal-900/35 hover:border-teal-500/50",
      activeBorderClass: "border-teal-400 shadow-[0_0_22px_rgba(45,212,191,0.35)] ring-1 ring-teal-300",
      subtextColor: "text-teal-300/80",
      tagline: "Elements & Molecular Reactions",
      btnBorder: "border-teal-700/50",
      btnBg: "bg-teal-950/40",
      btnHoverBg: "group-hover:bg-teal-900/50",
      btnText: "text-teal-200 group-hover:text-white",
    };
  }

  // 5. Computer Science (11th & 12th CS Group)
  if (id.includes("csc") || id.includes("computer-science") || code.startsWith("CSC")) {
    return {
      image: "/images/learn/universe-quiz.png",
      gradient: "from-[#0d2a1d]/85 to-[#061810]/90",
      borderClass: "border-emerald-900/35 hover:border-emerald-500/50",
      activeBorderClass: "border-emerald-400 shadow-[0_0_22px_rgba(52,211,153,0.35)] ring-1 ring-emerald-300",
      subtextColor: "text-emerald-300/80",
      tagline: "Python, OOP & Data Structures",
      btnBorder: "border-emerald-700/50",
      btnBg: "bg-emerald-950/40",
      btnHoverBg: "group-hover:bg-emerald-900/50",
      btnText: "text-emerald-200 group-hover:text-white",
    };
  }

  // 6. Commerce (11th & 12th Commerce Group)
  if (id.includes("commerce") || code.startsWith("COM")) {
    return {
      image: "/images/learn/class-12-trophy.png",
      gradient: "from-[#312010]/85 to-[#1c1107]/90",
      borderClass: "border-amber-900/35 hover:border-amber-500/50",
      activeBorderClass: "border-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.35)] ring-1 ring-amber-300",
      subtextColor: "text-amber-300/80",
      tagline: "Trade, Banking & Management",
      btnBorder: "border-amber-700/50",
      btnBg: "bg-amber-950/40",
      btnHoverBg: "group-hover:bg-amber-900/50",
      btnText: "text-amber-200 group-hover:text-white",
    };
  }

  // 7. Accountancy (11th & 12th)
  if (id.includes("account") || code.startsWith("ACC")) {
    return {
      image: "/images/learn/subject-math-calc.png",
      gradient: "from-[#1b153b]/85 to-[#0e0b21]/90",
      borderClass: "border-indigo-900/35 hover:border-indigo-500/50",
      activeBorderClass: "border-indigo-400 shadow-[0_0_22px_rgba(129,140,248,0.35)] ring-1 ring-indigo-300",
      subtextColor: "text-indigo-300/80",
      tagline: "Ledger, P&L & Balance Sheet",
      btnBorder: "border-indigo-700/50",
      btnBg: "bg-indigo-950/40",
      btnHoverBg: "group-hover:bg-indigo-900/50",
      btnText: "text-indigo-200 group-hover:text-white",
    };
  }

  // 8. Economics (11th & 12th)
  if (id.includes("economic") || code.startsWith("ECO")) {
    return {
      image: "/images/learn/subject-social-globe.png",
      gradient: "from-[#30161a]/85 to-[#1a0a0d]/90",
      borderClass: "border-rose-900/35 hover:border-rose-500/50",
      activeBorderClass: "border-rose-400 shadow-[0_0_22px_rgba(251,113,133,0.35)] ring-1 ring-rose-300",
      subtextColor: "text-rose-300/80",
      tagline: "National Income, Fiscal & Markets",
      btnBorder: "border-rose-700/50",
      btnBg: "bg-rose-950/40",
      btnHoverBg: "group-hover:bg-rose-900/50",
      btnText: "text-rose-200 group-hover:text-white",
    };
  }

  // 9. Computer Applications (11th & 12th Commerce with CA)
  if (id.includes("cap") || id.includes("application") || code.startsWith("CAP")) {
    return {
      image: "/images/learn/universe-quiz.png",
      gradient: "from-[#0d272d]/85 to-[#06161a]/90",
      borderClass: "border-teal-900/35 hover:border-teal-500/50",
      activeBorderClass: "border-teal-400 shadow-[0_0_22px_rgba(45,212,191,0.35)] ring-1 ring-teal-300",
      subtextColor: "text-teal-300/80",
      tagline: "Digital Tools, Web & Database",
      btnBorder: "border-teal-700/50",
      btnBg: "bg-teal-950/40",
      btnHoverBg: "group-hover:bg-teal-900/50",
      btnText: "text-teal-200 group-hover:text-white",
    };
  }

  // 10. Business Mathematics & Statistics (11th & 12th BM Group)
  if (id.includes("bma") || id.includes("business-math") || code.startsWith("BMA")) {
    return {
      image: "/images/learn/subject-math-calc.png",
      gradient: "from-[#2b1038]/85 to-[#17061f]/90",
      borderClass: "border-fuchsia-900/35 hover:border-fuchsia-500/50",
      activeBorderClass: "border-fuchsia-400 shadow-[0_0_22px_rgba(232,121,249,0.35)] ring-1 ring-fuchsia-300",
      subtextColor: "text-fuchsia-300/80",
      tagline: "Operations Research & Statistics",
      btnBorder: "border-fuchsia-700/50",
      btnBg: "bg-fuchsia-950/40",
      btnHoverBg: "group-hover:bg-fuchsia-900/50",
      btnText: "text-fuchsia-200 group-hover:text-white",
    };
  }

  // 11. Mathematics (Class 1-12)
  if (id.includes("math") || code.startsWith("MAT")) {
    return {
      image: "/images/learn/subject-math-calc.png",
      gradient: "from-[#21123a]/85 to-[#140a24]/90",
      borderClass: "border-purple-900/35 hover:border-purple-600/50",
      activeBorderClass: "border-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.35)] ring-1 ring-purple-400",
      subtextColor: "text-purple-300/80",
      tagline: "Numbers, Algebra & Calculus",
      btnBorder: "border-purple-700/50",
      btnBg: "bg-purple-950/40",
      btnHoverBg: "group-hover:bg-purple-900/50",
      btnText: "text-purple-200 group-hover:text-white",
    };
  }

  // 12. Science (Class 1-10)
  if (id.includes("science") || code.startsWith("SCI")) {
    return {
      image: "/images/learn/subject-science-micro.png",
      gradient: "from-[#0c2422]/85 to-[#071615]/90",
      borderClass: "border-emerald-900/35 hover:border-emerald-600/50",
      activeBorderClass: "border-emerald-500 shadow-[0_0_22px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400",
      subtextColor: "text-emerald-300/80",
      tagline: "Discover. Learn. Understand.",
      btnBorder: "border-emerald-700/50",
      btnBg: "bg-emerald-950/40",
      btnHoverBg: "group-hover:bg-emerald-900/50",
      btnText: "text-emerald-200 group-hover:text-white",
    };
  }

  // 13. Social Science (Class 1-10)
  if (id.includes("social") || code.startsWith("SOC")) {
    return {
      image: "/images/learn/subject-social-globe.png",
      gradient: "from-[#2a1b12]/85 to-[#190f09]/90",
      borderClass: "border-amber-900/35 hover:border-amber-600/50",
      activeBorderClass: "border-amber-500 shadow-[0_0_22px_rgba(245,158,11,0.35)] ring-1 ring-amber-400",
      subtextColor: "text-amber-300/80",
      tagline: "Our History, Our World",
      btnBorder: "border-amber-700/50",
      btnBg: "bg-amber-950/40",
      btnHoverBg: "group-hover:bg-amber-900/50",
      btnText: "text-amber-200 group-hover:text-white",
    };
  }

  // Default fallback
  return {
    image: "/images/learn/continue-sprout.png",
    gradient: "from-[#1a1230]/85 to-[#0f0920]/90",
    borderClass: "border-purple-900/35 hover:border-purple-600/50",
    activeBorderClass: "border-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.35)] ring-1 ring-purple-400",
    subtextColor: "text-purple-300/80",
    tagline: sub.description?.en || "Explore & Grow",
    btnBorder: "border-purple-700/50",
    btnBg: "bg-purple-950/40",
    btnHoverBg: "group-hover:bg-purple-900/50",
    btnText: "text-purple-200 group-hover:text-white",
  };
}

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
  seniorGroupFilter = "cs",
  onSelectSeniorGroup,
}: SeniorDigitalLearningProps) {
  const { locale, setLocale, t } = useLocale();
  const progress = useProgress();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Active subject filter: "all" or subjectId
  const [activeSubjectId, setActiveSubjectId] = useState<string>("all");

  // Elongate subjects section view state
  const [isElongated, setIsElongated] = useState<boolean>(true);
  const subjectsSectionRef = useRef<HTMLElement | null>(null);

  const isSenior = currentStandard >= 11;
  const activeSeniorGroup = SENIOR_GROUPS.find((g) => g.id === (seniorGroupFilter || "cs")) || SENIOR_GROUPS[0];

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

  const handleClassTouch = (std: number) => {
    onSelectStandard(std);
    setActiveSubjectId("all");
    setIsElongated(true);
    // Smoothly scroll to elongated subjects section so user sees updated subjects
    setTimeout(() => {
      subjectsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  const displayedChapters = useMemo(() => {
    if (activeSubjectId === "all") return allFlatChapters;
    return allFlatChapters.filter((item) => item.subject.id === activeSubjectId);
  }, [activeSubjectId, allFlatChapters]);

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
          <div className="relative w-full max-w-[460px] aspect-[780/324] cosmic-prop-float transition-transform duration-500 hover:scale-[1.03]">
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
              <Sparkle size={18} weight="fill" className="text-purple-400 animate-starlight" />
              <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                Choose Your Learning World
              </h2>
            </div>

            {/* Class Cards Carousel with < on left and > on right */}
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleClassTouch(Math.max(1, currentStandard - 1))}
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
                      onClick={() => handleClassTouch(item.std)}
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
                onClick={() => handleClassTouch(Math.min(12, currentStandard + 1))}
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
          <section
            ref={subjectsSectionRef}
            className="flex flex-col gap-3.5 transition-all duration-500 ease-out"
          >
            {/* Header: Title + Badges + Elongate View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkle size={18} weight="fill" className="text-purple-400 animate-starlight" />
                <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                  Explore Your Subjects
                </h2>
                <span className="rounded-full bg-purple-900/60 border border-purple-700/50 px-2.5 py-0.5 font-mono text-[11px] text-purple-300">
                  {subjects.length} Subjects
                </span>
                {isSenior && (
                  <span className="rounded-full bg-indigo-900/60 border border-indigo-700/50 px-2.5 py-0.5 font-mono text-[11px] text-indigo-200">
                    {activeSeniorGroup?.badge || "Computer Science"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsElongated((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-800/40 bg-purple-950/40 px-2.5 py-1 font-mono text-[11px] text-purple-300 hover:text-white hover:border-purple-600 transition-colors"
                  title={isElongated ? "Switch to standard grid" : "Elongate subjects layout"}
                >
                  <span>{isElongated ? "⊟ Compact Cards" : "⊞ Elongate View"}</span>
                </button>

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
            </div>

            {/* Senior Secondary Group / Stream Switcher for Class 11 and 12 */}
            {isSenior && (
              <div className="flex flex-col gap-2 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-purple-950/60 via-[#180a2c]/60 to-purple-950/60 p-3.5 sm:p-4 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} weight="fill" className="text-purple-300" />
                    <span className="font-display text-xs sm:text-sm font-bold text-white tracking-wide">
                      Select Class {currentStandard} Stream
                    </span>
                  </div>
                  <span className="font-mono text-[10.5px] text-purple-300/70 hidden sm:inline">
                    Choose stream to switch electives & subjects
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {SENIOR_GROUPS.map((grp) => {
                    const isActive = (seniorGroupFilter || "cs") === grp.id;
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => {
                          onSelectSeniorGroup?.(grp.id);
                          setActiveSubjectId("all");
                        }}
                        className={`group relative flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all duration-200 border ${
                          isActive
                            ? "border-purple-400 bg-purple-900/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/50"
                            : "border-purple-900/40 bg-purple-950/20 hover:border-purple-700/50 hover:bg-purple-900/30 text-purple-200/80"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-display text-xs sm:text-sm font-bold text-white">
                            {grp.badge}
                          </span>
                          {isActive && (
                            <span className="grid size-4 place-items-center rounded-full bg-purple-400 text-purple-950 shadow-sm">
                              <Check size={11} weight="bold" />
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-1 font-mono text-[10.5px] text-purple-300/70">
                          {grp.description[locale] || grp.description.en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Subjects Grid (Elongated across all subjects for this Class) */}
            <div
              className={`grid gap-3.5 transition-all duration-500 ease-out ${
                isElongated
                  ? isSenior
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
                    : subjects.length === 5
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              }`}
            >
              {subjects.map((sub) => {
                const visual = getSubjectVisual(sub);
                const isSelected = activeSubjectId === sub.id;
                const completedCount = sub.chapters.filter((ch) =>
                  progress.lessonsDone.includes(ch.id),
                ).length;

                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubject(sub)}
                    className={`group cosmic-card-glow cursor-pointer flex flex-col justify-between rounded-2xl border p-4 bg-gradient-to-b ${visual.gradient} backdrop-blur-md transition-all duration-300 ${
                      isSelected
                        ? visual.activeBorderClass
                        : visual.borderClass
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-75">
                          {sub.code || "SUB"}
                        </span>
                        {completedCount > 0 && (
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 font-mono text-[9px] text-emerald-300">
                            {completedCount}/{sub.chapters.length}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-black text-white leading-tight">
                        {sub.name[locale] || sub.name.en}
                      </h3>
                      <p className={`font-display text-[11px] font-semibold ${visual.subtextColor} leading-snug line-clamp-1`}>
                        {visual.tagline}
                      </p>
                    </div>

                    {/* 3D Visual Asset */}
                    <div className="relative my-3 size-20 self-center transition-transform group-hover:scale-105">
                      <Image
                        src={visual.image}
                        alt={sub.name.en}
                        width={80}
                        height={80}
                        className="size-full object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
                      />
                    </div>

                    {/* Bottom Bar: Chapters + Explore Button */}
                    <div className="flex flex-col gap-2">
                      <span className={`font-mono text-[11px] ${visual.subtextColor} flex items-center gap-1.5`}>
                        <BookOpen size={13} />
                        <span>{sub.chapters.length} Chapters</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sub.chapters[0]) {
                            onOpenChapter(sub.chapters[0].id);
                          }
                        }}
                        className={`w-full rounded-xl border py-1.5 text-center font-display text-xs font-bold transition-colors ${visual.btnBorder} ${visual.btnBg} ${visual.btnHoverBg} ${visual.btnText}`}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                );
              })}
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
