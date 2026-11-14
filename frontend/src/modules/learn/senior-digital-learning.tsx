"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CaretRight,
  DownloadSimple,
  FileText,
  GraduationCap,
  PencilSimple,
  Play,
  Sparkle,
  ArrowClockwise,
  Quotes,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { useProgress } from "@/components/progress-store";
import type { Profile } from "@/lib/progress";
import { SENIOR_GROUPS, type CurriculumChapter, type CurriculumSubject } from "@/lib/curriculum";
import { MODULES } from "@/modules/registry";
import { accentOf } from "@/modules/accents";
import { ThemeToggle } from "@/components/theme-toggle";

interface EncouragementQuote {
  quote: { en: string; ta: string };
  author: { en: string; ta: string };
  role?: { en: string; ta: string };
}

const DAILY_ENCOURAGEMENT_QUOTES: readonly EncouragementQuote[] = [
  {
    quote: {
      en: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, and knowledge makes you great.",
      ta: "கற்றல் படைப்பாற்றலைத் தருகிறது, படைப்பாற்றல் சிந்தனையை வளர்க்கிறது, சிந்தனை அறிவைத் தருகிறது, அறிவு உங்களை உயர்ந்தவராக்குகிறது.",
    },
    author: {
      en: "Dr. A.P.J. Abdul Kalam",
      ta: "டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்",
    },
    role: {
      en: "11th President of India",
      ta: "இந்தியாவின் 11-வது குடியரசுத் தலைவர்",
    },
  },
  {
    quote: {
      en: "Arise, awake, and stop not until the goal is reached.",
      ta: "எழுமின், விழுமின், உங்கள் இலக்கை அடையும் வரை ஓயாது உழையுங்கள்.",
    },
    author: {
      en: "Swami Vivekananda",
      ta: "சுவாமி விவேகானந்தர்",
    },
    role: {
      en: "Youth Icon & Philosopher",
      ta: "தத்துவஞானி",
    },
  },
  {
    quote: {
      en: "Education is the most powerful weapon which you can use to change the world.",
      ta: "உலகையே மாற்றி அமைப்பதற்கு நீங்கள் பயன்படுத்தக்கூடிய மிக சக்திவாய்ந்த ஆயுதம் கல்வி.",
    },
    author: {
      en: "Nelson Mandela",
      ta: "நெல்சன் மண்டேலா",
    },
    role: {
      en: "Nobel Peace Laureate",
      ta: "நோபல் அமைதிப் பரிசு பெற்றவர்",
    },
  },
  {
    quote: {
      en: "The beautiful thing about learning is that no one can take it away from you.",
      ta: "கற்றலின் மிக அழகான விஷயம் என்னவென்றால், அதை உங்களிடமிருந்து எவராலும் பறிக்க முடியாது.",
    },
    author: {
      en: "B.B. King",
      ta: "பி.பி. கிங்",
    },
    role: {
      en: "Legendary Musician",
      ta: "இசை மேதை",
    },
  },
  {
    quote: {
      en: "Learning is excellence that never perishes; all other wealth is not true wealth.",
      ta: "கேடில் விழுச்செல்வம் கல்வி யொருவற்கு மாடல்ல மற்றை யவை.",
    },
    author: {
      en: "Thiruvalluvar",
      ta: "திருவள்ளுவர் (திருக்குறள் 400)",
    },
    role: {
      en: "Ancient Tamil Sage",
      ta: "தெய்வப் புலவர்",
    },
  },
  {
    quote: {
      en: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      ta: "நாளை இறந்துவிடுவீர்கள் என்பது போல் வாழுங்கள். என்றும் வாழ்வீர்கள் என்பது போல் கற்றுக்கொள்ளுங்கள்.",
    },
    author: {
      en: "Mahatma Gandhi",
      ta: "மகாத்மா காந்தி",
    },
    role: {
      en: "Father of the Nation",
      ta: "தேசப்பிதா",
    },
  },
  {
    quote: {
      en: "Cultivation of mind should be the ultimate aim of human existence.",
      ta: "மனதைப் பண்படுத்துவதே மனித வாழ்வின் தலையாய நோக்கமாக இருக்க வேண்டும்.",
    },
    author: {
      en: "Dr. B.R. Ambedkar",
      ta: "டாக்டர் பாபாசாகேப் அம்பேத்கர்",
    },
    role: {
      en: "Architect of Constitution",
      ta: "இந்திய அரசியலமைப்பின் தந்தை",
    },
  },
  {
    quote: {
      en: "Wisdom is not a product of schooling, but of the lifelong attempt to acquire it.",
      ta: "ஞானம் என்பது வெறும் பள்ளிப் படிப்பின் விளைவு அல்ல, வாழ்நாள் முழுவதும் அதை அடையும் முயற்சியின் பயன்.",
    },
    author: {
      en: "Albert Einstein",
      ta: "ஆல்பர்ட் ஐன்ஸ்டீன்",
    },
    role: {
      en: "Theoretical Physicist",
      ta: "நோபல் பரிசு பெற்ற விஞ்ஞானி",
    },
  },
  {
    quote: {
      en: "Study with clarity and pure devotion; the light of knowledge shall illuminate every horizon.",
      ta: "கற்க கசடறக் கற்பவை கற்றபின்; அறிவின் பெருமையால் உலகம் மேன்மையடையும்.",
    },
    author: {
      en: "Mahakavi Bharathiyar",
      ta: "மகாகவி பாரதியார்",
    },
    role: {
      en: "Poet & Freedom Fighter",
      ta: "விடுதலைக் கவிஞர்",
    },
  },
  {
    quote: {
      en: "Ask the right questions, and nature will open the doors to all her secrets.",
      ta: "சரியான கேள்விகளைக் கேளுங்கள், இயற்கை தனது ரகசியங்களுக்கான அனைத்துக் கதவுகளையும் திறக்கும்.",
    },
    author: {
      en: "Sir C.V. Raman",
      ta: "சர் சி.வி. ராமன்",
    },
    role: {
      en: "Nobel Laureate in Physics",
      ta: "நோபல் பரிசு பெற்ற விஞ்ஞானி",
    },
  },
  {
    quote: {
      en: "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
      ta: "நம்பிக்கையே சாதனையை நோக்கி வழிநடத்தும் ஒளி; தன்னம்பிக்கையின்றி உலகில் எதையும் சாதிக்க முடியாது.",
    },
    author: {
      en: "Helen Keller",
      ta: "ஹெலன் கெல்லர்",
    },
    role: {
      en: "Author & Activist",
      ta: "எழுத்தாளர் & சமூகப் போராளி",
    },
  },
  {
    quote: {
      en: "You cannot cross the sea merely by standing and staring at the water.",
      ta: "கரையில் நின்று தண்ணீரைப் பார்த்துக் கொண்டிருப்பதால் மட்டும் நீங்கள் கடலைக் கடந்துவிட முடியாது.",
    },
    author: {
      en: "Rabindranath Tagore",
      ta: "ரவீந்திரநாத் தாகூர்",
    },
    role: {
      en: "Nobel Laureate in Literature",
      ta: "நோபல் பரிசு பெற்ற கவிஞர்",
    },
  },
];

interface SeniorDigitalLearningProps {
  currentStandard: number;
  subjects: readonly CurriculumSubject[];
  allFlatChapters: Array<{ subject: CurriculumSubject; chapter: CurriculumChapter }>;
  filter: string;
  setFilter: (f: string) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenStandardSwitcher?: () => void;
  onSelectStandard?: (std: number) => void;
  continueRecord: {
    subject: CurriculumSubject;
    chapter: CurriculumChapter;
    isStarter: boolean;
  } | null;
  totalChapters: number;
  completedChaptersCount: number;
  seniorGroupFilter?: string;
  onSelectSeniorGroup?: (group: string) => void;
  profile?: Profile;
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

const SUBJECT_PALETTES = {
  pink: {
    borderClass: "border-pink-200/80 hover:border-pink-400 dark:border-pink-900/35 dark:hover:border-pink-600/50",
    activeBorderClass: "border-pink-500 shadow-[0_0_22px_rgba(236,72,153,0.35)] ring-1 ring-pink-400",
    subtextColor: "text-pink-700 dark:text-pink-300/80",
    btnBorder: "border-pink-300 dark:border-pink-700/50",
    btnBg: "bg-pink-50 dark:bg-pink-950/40",
    btnHoverBg: "group-hover:bg-pink-100 dark:group-hover:bg-pink-900/50",
    btnText: "text-pink-800 group-hover:text-pink-950 dark:text-pink-200 dark:group-hover:text-white",
    lightGradient: "from-pink-50/95 to-white/95",
  },
  sky: {
    borderClass: "border-sky-200/80 hover:border-sky-400 dark:border-sky-900/35 dark:hover:border-sky-600/50",
    activeBorderClass: "border-sky-500 shadow-[0_0_22px_rgba(56,189,248,0.35)] ring-1 ring-sky-400",
    subtextColor: "text-sky-700 dark:text-sky-300/80",
    btnBorder: "border-sky-300 dark:border-sky-700/50",
    btnBg: "bg-sky-50 dark:bg-sky-950/40",
    btnHoverBg: "group-hover:bg-sky-100 dark:group-hover:bg-sky-900/50",
    btnText: "text-sky-800 group-hover:text-sky-950 dark:text-sky-200 dark:group-hover:text-white",
    lightGradient: "from-sky-50/95 to-white/95",
  },
  emerald: {
    borderClass: "border-emerald-200/80 hover:border-emerald-400 dark:border-emerald-900/35 dark:hover:border-emerald-500/50",
    activeBorderClass: "border-emerald-500 dark:border-emerald-400 shadow-[0_0_22px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400 dark:ring-emerald-300",
    subtextColor: "text-emerald-700 dark:text-emerald-300/80",
    btnBorder: "border-emerald-300 dark:border-emerald-700/50",
    btnBg: "bg-emerald-50 dark:bg-emerald-950/40",
    btnHoverBg: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50",
    btnText: "text-emerald-800 group-hover:text-emerald-950 dark:text-emerald-200 dark:group-hover:text-white",
    lightGradient: "from-emerald-50/95 to-white/95",
  },
  teal: {
    borderClass: "border-teal-200/80 hover:border-teal-400 dark:border-teal-900/35 dark:hover:border-teal-500/50",
    activeBorderClass: "border-teal-500 dark:border-teal-400 shadow-[0_0_22px_rgba(45,212,191,0.35)] ring-1 ring-teal-400 dark:ring-teal-300",
    subtextColor: "text-teal-700 dark:text-teal-300/80",
    btnBorder: "border-teal-300 dark:border-teal-700/50",
    btnBg: "bg-teal-50 dark:bg-teal-950/40",
    btnHoverBg: "group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50",
    btnText: "text-teal-800 group-hover:text-teal-950 dark:text-teal-200 dark:group-hover:text-white",
    lightGradient: "from-teal-50/95 to-white/95",
  },
  cyan: {
    borderClass: "border-cyan-200/80 hover:border-cyan-400 dark:border-cyan-900/35 dark:hover:border-cyan-500/50",
    activeBorderClass: "border-cyan-500 dark:border-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400 dark:ring-cyan-300",
    subtextColor: "text-cyan-700 dark:text-cyan-300/80",
    btnBorder: "border-cyan-300 dark:border-cyan-700/50",
    btnBg: "bg-cyan-50 dark:bg-cyan-950/40",
    btnHoverBg: "group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
    btnText: "text-cyan-800 group-hover:text-cyan-950 dark:text-cyan-200 dark:group-hover:text-white",
    lightGradient: "from-cyan-50/95 to-white/95",
  },
  amber: {
    borderClass: "border-amber-200/80 hover:border-amber-400 dark:border-amber-900/35 dark:hover:border-amber-500/50",
    activeBorderClass: "border-amber-500 dark:border-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.35)] ring-1 ring-amber-400 dark:ring-amber-300",
    subtextColor: "text-amber-800 dark:text-amber-300/80",
    btnBorder: "border-amber-300 dark:border-amber-700/50",
    btnBg: "bg-amber-50 dark:bg-amber-950/40",
    btnHoverBg: "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50",
    btnText: "text-amber-900 group-hover:text-amber-950 dark:text-amber-200 dark:group-hover:text-white",
    lightGradient: "from-amber-50/95 to-white/95",
  },
  indigo: {
    borderClass: "border-indigo-200/80 hover:border-indigo-400 dark:border-indigo-900/35 dark:hover:border-indigo-500/50",
    activeBorderClass: "border-indigo-500 dark:border-indigo-400 shadow-[0_0_22px_rgba(129,140,248,0.35)] ring-1 ring-indigo-400 dark:ring-indigo-300",
    subtextColor: "text-indigo-700 dark:text-indigo-300/80",
    btnBorder: "border-indigo-300 dark:border-indigo-700/50",
    btnBg: "bg-indigo-50 dark:bg-indigo-950/40",
    btnHoverBg: "group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50",
    btnText: "text-indigo-800 group-hover:text-indigo-950 dark:text-indigo-200 dark:group-hover:text-white",
    lightGradient: "from-indigo-50/95 to-white/95",
  },
  rose: {
    borderClass: "border-rose-200/80 hover:border-rose-400 dark:border-rose-900/35 dark:hover:border-rose-500/50",
    activeBorderClass: "border-rose-500 dark:border-rose-400 shadow-[0_0_22px_rgba(251,113,133,0.35)] ring-1 ring-rose-400 dark:ring-rose-300",
    subtextColor: "text-rose-700 dark:text-rose-300/80",
    btnBorder: "border-rose-300 dark:border-rose-700/50",
    btnBg: "bg-rose-50 dark:bg-rose-950/40",
    btnHoverBg: "group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50",
    btnText: "text-rose-800 group-hover:text-rose-950 dark:text-rose-200 dark:group-hover:text-white",
    lightGradient: "from-rose-50/95 to-white/95",
  },
  fuchsia: {
    borderClass: "border-fuchsia-200/80 hover:border-fuchsia-400 dark:border-fuchsia-900/35 dark:hover:border-fuchsia-500/50",
    activeBorderClass: "border-fuchsia-500 dark:border-fuchsia-400 shadow-[0_0_22px_rgba(232,121,249,0.35)] ring-1 ring-fuchsia-400 dark:ring-fuchsia-300",
    subtextColor: "text-fuchsia-700 dark:text-fuchsia-300/80",
    btnBorder: "border-fuchsia-300 dark:border-fuchsia-700/50",
    btnBg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    btnHoverBg: "group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-900/50",
    btnText: "text-fuchsia-800 group-hover:text-fuchsia-950 dark:text-fuchsia-200 dark:group-hover:text-white",
    lightGradient: "from-fuchsia-50/95 to-white/95",
  },
  purple: {
    borderClass: "border-purple-200/80 hover:border-purple-400 dark:border-purple-900/35 dark:hover:border-purple-600/50",
    activeBorderClass: "border-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.35)] ring-1 ring-purple-400",
    subtextColor: "text-purple-700 dark:text-purple-300/80",
    btnBorder: "border-purple-300 dark:border-purple-700/50",
    btnBg: "bg-purple-50 dark:bg-purple-950/40",
    btnHoverBg: "group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50",
    btnText: "text-purple-800 group-hover:text-purple-950 dark:text-purple-200 dark:group-hover:text-white",
    lightGradient: "from-purple-50/95 to-white/95",
  },
} as const;

type PaletteKey = keyof typeof SUBJECT_PALETTES;

/**
 * Solid accent per subject family. Used for the card's top edge, the code dot
 * and the chapter progress fill so each subject keeps its identity without
 * needing a different gradient surface.
 */
const SUBJECT_ACCENT_BG: Record<PaletteKey, string> = {
  pink: "bg-pink-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
  rose: "bg-rose-500",
  fuchsia: "bg-fuchsia-500",
  purple: "bg-purple-500",
};

function buildSubjectVisual(
  image: string,
  tagline: string,
  paletteKey: PaletteKey,
  darkGradient: string,
) {
  const palette = SUBJECT_PALETTES[paletteKey];
  return {
    image,
    tagline,
    accentBg: SUBJECT_ACCENT_BG[paletteKey],
    gradient: `${palette.lightGradient} ${darkGradient}`,
    borderClass: palette.borderClass,
    activeBorderClass: palette.activeBorderClass,
    subtextColor: palette.subtextColor,
    btnBorder: palette.btnBorder,
    btnBg: palette.btnBg,
    btnHoverBg: palette.btnHoverBg,
    btnText: palette.btnText,
  };
}

function getSubjectVisual(sub: CurriculumSubject) {
  const id = sub.id.toLowerCase();
  const code = (sub.code || "").toUpperCase();

  if (id.includes("tamil") || code.startsWith("TAM")) {
    return buildSubjectVisual("/images/learn/subject-tamil-scroll.png", "அறிவு வளர்ச்சி", "pink", "dark:from-[#280f2d]/85 dark:to-[#16081e]/90");
  }
  if (id.includes("english") || code.startsWith("ENG")) {
    return buildSubjectVisual("/images/learn/subject-english-books.png", "Language & Literature", "sky", "dark:from-[#0f1d38]/85 dark:to-[#0a1224]/90");
  }
  if (id.includes("biology") || code.startsWith("BIO")) {
    return buildSubjectVisual("/images/learn/subject-science-micro.png", "Cell, Genetics, Anatomy & Life Systems", "emerald", "dark:from-[#0c2a1c]/85 dark:to-[#06180f]/90");
  }
  if (id.includes("botany") || code.startsWith("BOT")) {
    return buildSubjectVisual("/images/learn/subject-science-micro.png", "Plant Morphology, Anatomy & Biotech", "teal", "dark:from-[#0b2b24]/85 dark:to-[#051914]/90");
  }
  if (id.includes("zoology") || code.startsWith("ZOO")) {
    return buildSubjectVisual("/images/learn/subject-science-micro.png", "Animal Physiology, Genetics & Ecology", "cyan", "dark:from-[#092236]/85 dark:to-[#051320]/90");
  }
  if (id.includes("physics") || code.startsWith("PHY")) {
    return buildSubjectVisual("/images/learn/class-11-molecule.png", "Forces, Waves & Cosmos", "cyan", "dark:from-[#0b243d]/85 dark:to-[#051424]/90");
  }
  if (id.includes("chemistry") || code.startsWith("CHE")) {
    return buildSubjectVisual("/images/learn/subject-science-micro.png", "Elements & Molecular Reactions", "teal", "dark:from-[#0a2e28]/85 dark:to-[#051c18]/90");
  }
  if (id.includes("csc") || id.includes("computer-science") || code.startsWith("CSC")) {
    return buildSubjectVisual("/images/learn/universe-quiz.png", "Python, OOP & Data Structures", "emerald", "dark:from-[#0d2a1d]/85 dark:to-[#061810]/90");
  }
  if (id.includes("commerce") || code.startsWith("COM")) {
    return buildSubjectVisual("/images/learn/class-12-trophy.png", "Trade, Banking & Management", "amber", "dark:from-[#312010]/85 dark:to-[#1c1107]/90");
  }
  if (id.includes("account") || code.startsWith("ACC")) {
    return buildSubjectVisual("/images/learn/subject-math-calc.png", "Ledger, P&L & Balance Sheet", "indigo", "dark:from-[#1b153b]/85 dark:to-[#0e0b21]/90");
  }
  if (id.includes("economic") || code.startsWith("ECO")) {
    return buildSubjectVisual("/images/learn/subject-social-globe.png", "National Income, Fiscal & Markets", "rose", "dark:from-[#30161a]/85 dark:to-[#1a0a0d]/90");
  }
  if (id.includes("cap") || id.includes("application") || code.startsWith("CAP")) {
    return buildSubjectVisual("/images/learn/universe-quiz.png", "Digital Tools, Web & Database", "teal", "dark:from-[#0d272d]/85 dark:to-[#06161a]/90");
  }
  if (id.includes("bma") || id.includes("business-math") || code.startsWith("BMA")) {
    return buildSubjectVisual("/images/learn/subject-math-calc.png", "Operations Research & Statistics", "fuchsia", "dark:from-[#2b1038]/85 dark:to-[#17061f]/90");
  }
  if (id.includes("math") || code.startsWith("MAT")) {
    return buildSubjectVisual("/images/learn/subject-math-calc.png", "Numbers, Algebra & Calculus", "purple", "dark:from-[#21123a]/85 dark:to-[#140a24]/90");
  }
  if (id.includes("science") || code.startsWith("SCI")) {
    return buildSubjectVisual("/images/learn/subject-science-micro.png", "Discover. Learn. Understand.", "emerald", "dark:from-[#0c2422]/85 dark:to-[#071615]/90");
  }
  if (id.includes("social") || code.startsWith("SOC")) {
    return buildSubjectVisual("/images/learn/subject-social-globe.png", "Our History, Our World", "amber", "dark:from-[#2a1b12]/85 dark:to-[#190f09]/90");
  }

  return buildSubjectVisual(
    "/images/learn/continue-sprout.png",
    sub.description?.en || "Explore & Grow",
    "purple",
    "dark:from-[#1a1230]/85 dark:to-[#0f0920]/90",
  );
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
  profile,
}: SeniorDigitalLearningProps) {
  const { locale, setLocale, t } = useLocale();
  const progress = useProgress();
  const router = useRouter();

  // Active subject filter: "all" or subjectId
  const [activeSubjectId, setActiveSubjectId] = useState<string>("all");

  const subjectsSectionRef = useRef<HTMLElement | null>(null);

  const isSenior = currentStandard >= 11;
  const activeSeniorGroup = SENIOR_GROUPS.find((g) => g.id === (seniorGroupFilter || "cs")) || SENIOR_GROUPS[0];

  // Daily Encouragement Quote Rotation (cycles naturally every day, or via Next button)
  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.floor(diff / oneDay));
  }, []);

  const [quoteOffset, setQuoteOffset] = useState<number>(0);
  const currentQuoteIndex = (dayOfYear + quoteOffset) % DAILY_ENCOURAGEMENT_QUOTES.length;
  const currentQuote = DAILY_ENCOURAGEMENT_QUOTES[currentQuoteIndex]!;

  const handleNextQuote = () => {
    setQuoteOffset((prev) => prev + 1);
  };

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
    onSelectStandard?.(std);
    setActiveSubjectId("all");
    // Smoothly scroll to the subjects section so the learner sees the change
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

  // Chapter progress for the subject of the "Continue Learning" card
  const continueSubject = continueRecord?.subject;
  const continueDone = continueSubject
    ? continueSubject.chapters.filter((ch) => progress.lessonsDone.includes(ch.id)).length
    : 0;
  const continueTotal = continueSubject?.chapters.length ?? 0;
  const continuePct = continueTotal > 0 ? Math.round((continueDone / continueTotal) * 100) : 0;

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
    }
  };

  return (
    <div className="learn-page-scale relative mx-auto flex w-full max-w-[1460px] flex-col gap-6 pb-28 select-none text-slate-900 sm:gap-8 sm:pb-36 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: BRAND LOGO + CENTER NAV + LANG / THEME / PROFILE           */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-purple-200/80 dark:border-purple-900/40 pb-4 pt-1">
        {/* Left: Back button + Module Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white/85 px-3 py-2 text-[13px] font-semibold text-purple-900 transition-all hover:bg-purple-50 hover:border-purple-400 dark:border-purple-800/50 dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-purple-900/60 dark:hover:text-white dark:hover:border-purple-500 shadow-sm"
            title="Go Back"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5 text-purple-600 group-hover:text-purple-900 dark:text-purple-400 dark:group-hover:text-purple-200" />
            <span>Back</span>
          </button>

          {/* Module Switcher Tabs (Digital Learning, Holistic Growth, GK & Patriotic Songs) */}
          <nav aria-label={t.modulesTitle} className="flex gap-1 rounded-xl border border-purple-200/80 bg-white/75 dark:border-line dark:bg-white/[0.03] p-1 backdrop-blur-md">
            {MODULES.map((m) => {
              const ModIcon = m.icon;
              const active = m.slug === "learn";
              const tabAccent = accentOf(m.accent);
              return (
                <Link
                  key={m.id}
                  href={`/m/${m.slug}`}
                  aria-current={active ? "page" : undefined}
                  title={m.title[locale]}
                  className={`grid size-10 place-items-center rounded-lg transition-colors duration-200 ${
                    active ? tabAccent.tabActive : "text-muted hover:bg-purple-100/70 dark:hover:bg-white/[0.06] hover:text-text"
                  }`}
                >
                  <ModIcon size={18} weight={active ? "fill" : "regular"} aria-hidden />
                  <span className="sr-only">{m.title[locale]}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language, Theme & Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ta" : "en")}
            className="flex items-center gap-1 rounded-xl border border-purple-200 bg-white/85 px-3 py-1.5 text-[13px] font-medium text-purple-900 transition-colors hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800/40 dark:bg-purple-950/50 dark:text-purple-200 dark:hover:border-purple-600/60 dark:hover:text-white"
          >
            <span>{locale === "en" ? "English" : "தமிழ்"}</span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400">▾</span>
          </button>

          {/* Dark / Light Toggle */}
          <ThemeToggle />

          {/* Profile Card */}
          <Link
            href="/sign-in"
            className="group flex items-center gap-2.5 rounded-full border border-purple-200 bg-white/85 py-1 pl-1 pr-3 shadow-sm hover:border-purple-400 dark:border-purple-700/50 dark:bg-gradient-to-r dark:from-purple-950/80 dark:to-[#1e0e38]/80 dark:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all dark:hover:border-purple-500 hover:scale-[1.02]"
            title="View Student Profile"
          >
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-purple-400 bg-purple-100 dark:bg-purple-900 p-0.5">
              <Image
                src="/images/junior/learner-avatar.png"
                alt="Learner Avatar"
                width={32}
                height={32}
                className="size-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                {learnerName}
              </span>
              <span className="font-mono text-[11px] text-purple-700 dark:text-purple-300/80 flex items-center gap-1">
                Class {currentStandard} {isSenior && activeSeniorGroup ? `· ${activeSeniorGroup.badge}` : ""}
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Daily Encouragement now lives in the compact right-hand rail below. */}

      {/* ========================================================================= */}
      {/* 2. SLIM PAGE HEADER: IDENTITY + CLASS / BOARD / STREAM + EDIT PROFILE    */}
      {/* ========================================================================= */}
      <section className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
          <div className="relative size-12 shrink-0 sm:size-14">
            <Image
              src={
                CLASS_ITEMS.find((c) => c.std === currentStandard)?.image ||
                "/images/learn/class-8-armillary.png"
              }
              alt={`Class ${currentStandard}`}
              width={56}
              height={56}
              className="size-full object-contain drop-shadow-md"
            />
          </div>

          <div className="min-w-0">
            <h1 className="module-hero-title font-serif text-[26px] font-black tracking-wide text-slate-900 uppercase dark:text-white sm:text-[32px]">
              Digital Learning
            </h1>
            <p className="font-display text-[15px] font-bold text-purple-700 dark:text-purple-300">
              Explore. Discover. Grow.
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-purple-800 dark:border-purple-400/30 dark:bg-purple-500/20 dark:text-purple-200">
                Class {currentStandard}
              </span>
              <span className="rounded-full border border-purple-200 bg-white px-2.5 py-0.5 font-mono text-[11.5px] text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-purple-200/70">
                {currentStandard <= 5
                  ? "Primary Stage"
                  : currentStandard <= 8
                  ? "Middle School"
                  : currentStandard <= 10
                  ? "Secondary School"
                  : "Higher Secondary"}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                {profile?.board === "cbse"
                  ? "CBSE"
                  : profile?.board === "icse_other"
                  ? "ICSE / Other"
                  : "Tamil Nadu State Board"}
              </span>
              {isSenior && activeSeniorGroup && (
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-indigo-800 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-200">
                  {activeSeniorGroup.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 self-stretch sm:w-60 sm:self-auto">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-purple-200/70">
              Overall progress
            </span>
            <span className="font-mono text-[13px] font-bold text-purple-700 dark:text-purple-300">
              {progressPct}%
            </span>
          </div>
          <p className="mt-1 font-display text-[19px] font-black leading-none text-slate-900 dark:text-white">
            {completedChaptersCount}
            <span className="text-[15px] font-semibold text-slate-400 dark:text-purple-200/60">
              {" "}/ {totalChapters} chapters
            </span>
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full border border-purple-200 bg-purple-100 dark:border-white/10 dark:bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-[0_0_10px_#a855f7] transition-all duration-500"
              style={{ width: `${Math.max(3, progressPct)}%` }}
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
          {/* A. CONTINUE LEARNING — primary action card                        */}
          {/* ----------------------------------------------------------------- */}
          <section className="relative">
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-purple-600 text-white shadow-[0_0_14px_rgba(168,85,247,0.45)]">
                    <Play size={11} weight="fill" className="ml-0.5" />
                  </span>
                  <span className="font-mono text-[11.5px] font-bold uppercase tracking-[0.18em] text-purple-700 dark:text-purple-300">
                    Continue Learning
                  </span>
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-purple-800 dark:border-purple-400/30 dark:bg-purple-500/20 dark:text-purple-200">
                    {continueRecord ? "In progress" : "Start here"}
                  </span>
                </div>

                <h2 className="mt-2.5 font-display text-[19px] font-black leading-tight text-slate-900 dark:text-white sm:text-[22px]">
                  {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 3: Plants Around Us"}
                </h2>

                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[12px] text-slate-600 dark:text-purple-200/70">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">Class {currentStandard}</span>
                  <span aria-hidden>›</span>
                  <span className="font-semibold text-pink-700 dark:text-pink-300">
                    {continueRecord ? continueRecord.subject.name[locale] : "Science"}
                  </span>
                  <span aria-hidden>›</span>
                  <span>Term 1</span>
                </p>

                <div className="mt-3.5 max-w-md">
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-purple-200 bg-purple-100 dark:border-white/10 dark:bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-[0_0_12px_#a855f7] transition-all duration-500"
                      style={{ width: `${Math.max(4, continuePct)}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[11.5px] text-slate-600 dark:text-purple-200/60">
                    <span>
                      {continueTotal > 0
                        ? `${continueDone} of ${continueTotal} chapters in this subject`
                        : "Your next chapter is ready"}
                    </span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">{continuePct}%</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                <div className="relative hidden size-20 sm:block">
                  <Image
                    src="/images/learn/continue-sprout.png"
                    alt="Sprout in soil pot"
                    width={72}
                    height={72}
                    className="size-full object-contain drop-shadow-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLaunchContinue}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 font-display text-[15px] font-bold text-white shadow-[0_0_18px_rgba(168,85,247,0.45)] transition-all hover:scale-[1.03] hover:bg-purple-500 active:scale-95"
                >
                  <span>{continueDone > 0 ? "Resume" : "Start"}</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* B. EXPLORE YOUR SUBJECTS                                          */}
          {/* ----------------------------------------------------------------- */}
          <section
            ref={subjectsSectionRef}
            className="flex flex-col gap-3.5 transition-all duration-500 ease-out"
          >
            {/* Section header: quiet mono label + count chips */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkle size={14} weight="fill" className="text-purple-600 animate-starlight dark:text-purple-400" />
                <h2 className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-slate-700 dark:text-purple-200/80">
                  Your Subjects
                </h2>
                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[11.5px] font-semibold text-purple-800 dark:border-purple-400/30 dark:bg-purple-500/20 dark:text-purple-200">
                  {subjects.length}
                </span>
                {isSenior && (
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-[11.5px] font-semibold text-indigo-800 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-200">
                    {activeSeniorGroup?.badge || "Computer Science"}
                  </span>
                )}
              </div>

              {activeSubjectId !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveSubjectId("all")}
                  className="shrink-0 font-mono text-[12px] font-semibold text-purple-700 hover:text-purple-950 hover:underline dark:text-purple-300 dark:hover:text-white"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Subjects Grid: 3 columns on desktop so titles never wrap */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((sub) => {
                const visual = getSubjectVisual(sub);
                const isSelected = activeSubjectId === sub.id;
                const completedCount = sub.chapters.filter((ch) =>
                  progress.lessonsDone.includes(ch.id),
                ).length;
                const subjectPct =
                  sub.chapters.length > 0
                    ? Math.round((completedCount / sub.chapters.length) * 100)
                    : 0;

                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubject(sub)}
                    className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-white/90 p-4 backdrop-blur-xl shadow-[0_8px_24px_-14px_rgba(15,8,30,0.45)] transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#140a28]/85 ${
                      isSelected
                        ? "border-purple-500 ring-1 ring-purple-400 dark:border-purple-400/70 dark:ring-purple-400/40"
                        : "border-purple-200/70 hover:border-purple-400/70 dark:border-white/10 dark:hover:border-white/20"
                    }`}
                  >
                    {/* Accent edge keeps the subject identity without artwork */}
                    <span aria-hidden className={`absolute inset-x-0 top-0 h-[2px] opacity-80 ${visual.accentBg}`} />

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-purple-200/60">
                          <span aria-hidden className={`size-1.5 rounded-full ${visual.accentBg}`} />
                          {sub.code || "SUB"}
                        </span>
                        {completedCount > 0 && (
                          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300">
                            {completedCount}/{sub.chapters.length}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-2 font-display text-[17px] font-semibold leading-tight text-slate-900 dark:text-white">
                        {sub.name[locale] || sub.name.en}
                      </h3>
                      <p className="mt-1 font-display text-[12px] leading-snug text-slate-500 line-clamp-1 dark:text-purple-200/60">
                        {visual.tagline}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="h-1 w-full overflow-hidden rounded-full bg-purple-100 dark:bg-white/[0.07]">
                        <div
                          className={`h-full rounded-full opacity-90 transition-all duration-500 ${visual.accentBg}`}
                          style={{ width: `${subjectPct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-[11.5px] text-slate-500 dark:text-purple-200/60">
                          {completedCount}/{sub.chapters.length} chapters
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSubject(sub);
                          }}
                          className="inline-flex items-center gap-1 font-display text-[13px] font-bold text-purple-700 transition-colors hover:text-purple-950 dark:text-purple-300 dark:hover:text-white"
                        >
                          <span>Explore</span>
                          <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
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
            <section className="fade-up">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-600 dark:text-purple-400" />
                  <span>
                    {subjects.find((s) => s.id === activeSubjectId)?.name[locale] || "Chapters"}
                  </span>
                  <span className="font-mono text-[13px] text-slate-500 dark:text-purple-300/60 font-normal">
                    ({displayedChapters.length} chapters)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubjectId("all")}
                  className="rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 font-mono text-[12px] font-medium text-purple-800 hover:bg-purple-100 hover:text-purple-950 hover:border-purple-400 dark:border-purple-800/40 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:text-white dark:hover:border-purple-600 transition-colors"
                >
                  ✕ Close Explorer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-violet">
                {displayedChapters.map((item, idx) => (
                  <button
                    key={item.chapter.id}
                    type="button"
                    onClick={() => onOpenChapter(item.chapter.id)}
                    className="group flex items-center justify-between gap-3 border-b border-purple-200/60 px-1 py-3 text-left transition-colors duration-200 last:border-0 hover:text-purple-800 dark:border-white/10 dark:hover:text-purple-300"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 shrink-0 font-mono text-[12px] font-bold text-purple-700 dark:text-purple-300">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-[13px] sm:text-[14px] font-bold text-slate-900 group-hover:text-purple-800 dark:text-slate-100 dark:group-hover:text-purple-300">
                          {item.chapter.title[locale]}
                        </p>
                        <p className="truncate font-mono text-[11.5px] text-slate-600 dark:text-purple-300/60">
                          {item.subject.name[locale]} • {item.chapter.summary[locale]}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-purple-600 transition-colors group-hover:text-purple-800 dark:text-purple-400 dark:group-hover:text-purple-200">
                      <Play size={11} weight="fill" className="ml-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ===================================================================== */}
        {/* RIGHT SIDEBAR (4 cols)                                                */}
        {/* ===================================================================== */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          {/* ----------------------------------------------------------------- */}
          {/* DAILY ENCOURAGEMENT (top of the rail)                             */}
          {/* ----------------------------------------------------------------- */}
          <div className="relative">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-pink-500 dark:text-pink-400">
                  <Quotes size={16} weight="fill" />
                </span>
                <h3 className="font-display text-[15px] font-bold tracking-wide text-slate-900 dark:text-white">
                  Daily Encouragement
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[10.5px] text-purple-700 dark:border-purple-400/30 dark:bg-purple-500/20 dark:text-purple-200">
                Day #{dayOfYear}
              </span>
            </div>

            <p className="font-serif text-[14px] italic leading-relaxed text-slate-700 dark:text-purple-100">
              “{currentQuote.quote[locale]}”
            </p>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-[12px] font-bold text-pink-600 dark:text-pink-400">
                  — {currentQuote.author[locale]}
                </p>
                {currentQuote.role && (
                  <p className="truncate font-mono text-[11px] text-purple-700/80 dark:text-purple-300/80">
                    {currentQuote.role[locale]}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNextQuote}
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-purple-200 bg-white/70 px-2.5 py-1.5 font-mono text-[11.5px] text-purple-700 transition-colors hover:border-purple-400 hover:text-purple-900 dark:border-purple-400/30 dark:bg-white/[0.04] dark:text-purple-200 dark:hover:border-purple-400 dark:hover:text-white"
                title="Next Daily Quote"
              >
                <ArrowClockwise size={11} className="transition-transform duration-300 group-hover:rotate-180" />
                <span>Next</span>
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 1: YOUR LEARNING PATH                                        */}
          {/* ----------------------------------------------------------------- */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="text-purple-700 dark:text-purple-300">
                <GraduationCap size={17} weight="fill" />
              </span>
              <h3 className="font-display text-[15px] font-bold text-slate-900 dark:text-white">
                Your Learning Path
              </h3>
            </div>

            {/* Breadcrumb Path */}
            <p className="mb-3 flex flex-wrap items-center gap-1.5 font-mono text-[12px] text-slate-700 dark:text-purple-200/80">
              <span className="font-bold text-purple-700 dark:text-purple-300">Class {currentStandard}</span>
              <span aria-hidden>›</span>
              <span className="font-semibold text-pink-700 dark:text-pink-300">
                {continueRecord ? continueRecord.subject.name[locale] : "Science"}
              </span>
              <span aria-hidden>›</span>
              <span>Term 1</span>
              <span aria-hidden>›</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 3"}
              </span>
            </p>

            {/* Progress bar */}
            <div className="relative mb-2 h-1.5 w-full overflow-hidden rounded-full border border-purple-200 bg-purple-100 dark:border-white/10 dark:bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-[0_0_12px_#a855f7] transition-all duration-500"
                style={{ width: `${Math.max(4, progressPct)}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[11.5px] text-slate-600 dark:text-purple-200/80">
              <span>{completedChaptersCount} of {totalChapters} chapters completed</span>
              <span className="font-bold text-purple-700 dark:text-purple-300">{progressPct}%</span>
            </div>
          </div>

          {/* Continue Learning now lives as the primary card in the main column. */}

          {/* ----------------------------------------------------------------- */}
          {/* CARD 3: QUICK ACCESS                                              */}
          {/* ----------------------------------------------------------------- */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-600 dark:text-purple-400">📚</span>
              <h3 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900 dark:text-white">
                Quick Access
              </h3>
            </div>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between border-b border-purple-200/60 py-2.5 text-left transition-colors last:border-0 hover:text-purple-900 dark:border-white/10 dark:hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-purple-700 dark:text-purple-400">
                  <FileText size={16} />
                </span>
                <span className="font-display text-[13px] font-bold text-slate-900 group-hover:text-purple-950 dark:text-purple-100 dark:group-hover:text-white">
                  My Notes
                </span>
              </div>
              <CaretRight size={12} className="text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between border-b border-purple-200/60 py-2.5 text-left transition-colors last:border-0 hover:text-purple-900 dark:border-white/10 dark:hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-purple-700 dark:text-purple-400">
                  <PencilSimple size={16} />
                </span>
                <span className="font-display text-[13px] font-bold text-slate-900 group-hover:text-purple-950 dark:text-purple-100 dark:group-hover:text-white">
                  Practice Questions
                </span>
              </div>
              <CaretRight size={12} className="text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between border-b border-purple-200/60 py-2.5 text-left transition-colors last:border-0 hover:text-purple-900 dark:border-white/10 dark:hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-purple-700 dark:text-purple-400">
                  <DownloadSimple size={16} />
                </span>
                <span className="font-display text-[13px] font-bold text-slate-900 group-hover:text-purple-950 dark:text-purple-100 dark:group-hover:text-white">
                  Download PDFs
                </span>
              </div>
              <CaretRight size={12} className="text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
