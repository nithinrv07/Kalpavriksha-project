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
  PencilSimple,
  Play,
  Sparkle,
  Star,
  Trophy,
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

  // Elongate subjects section view state
  const [isElongated, setIsElongated] = useState<boolean>(true);
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
    }
  };

  return (
    <div className="relative flex flex-col gap-6 sm:gap-8 pb-28 sm:pb-36 select-none text-slate-900 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: BRAND LOGO + CENTER NAV + LANG / THEME / PROFILE           */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-purple-200/80 dark:border-purple-900/40 pb-4 pt-1">
        {/* Left: Back button + Module Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white/85 px-3 py-2 text-xs font-semibold text-purple-900 transition-all hover:bg-purple-50 hover:border-purple-400 dark:border-purple-800/50 dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-purple-900/60 dark:hover:text-white dark:hover:border-purple-500 shadow-sm"
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

        {/* Center: Module Title Pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/80 dark:border-purple-800/40 dark:bg-purple-950/50 px-4 py-1.5 backdrop-blur-md shadow-inner">
          <GraduationCap size={16} weight="fill" className="text-purple-700 dark:text-purple-300" />
          <span className="font-display text-xs font-bold text-slate-900 dark:text-white tracking-wide">Digital Learning</span>
          <span className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400 shadow-[0_0_8px_#a855f7]" />
        </div>

        {/* Right: Language, Theme & Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ta" : "en")}
            className="flex items-center gap-1 rounded-xl border border-purple-200 bg-white/85 px-3 py-1.5 text-xs font-medium text-purple-900 transition-colors hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800/40 dark:bg-purple-950/50 dark:text-purple-200 dark:hover:border-purple-600/60 dark:hover:text-white"
          >
            <span>{locale === "en" ? "English" : "தமிழ்"}</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400">▾</span>
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
              <span className="font-display text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {learnerName}
              </span>
              <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300/80 flex items-center gap-1">
                Class {currentStandard} {isSenior && activeSeniorGroup ? `· ${activeSeniorGroup.badge}` : ""}
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ELONGATED FULL-WIDTH DAILY ENCOURAGEMENT BANNER                        */}
      {/* ========================================================================= */}
      <div className="daily-encouragement-card relative z-10 w-full overflow-hidden rounded-2xl border border-purple-900/40 bg-[#160a2b]/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-purple-600/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          {/* Left: Quotes Icon Badge in Front + Daily Content */}
          <div className="flex-1 flex items-start gap-3.5 sm:gap-4 min-w-0">
            {/* Front Quote Icon */}
            <div className="quote-icon grid size-10 sm:size-11 shrink-0 place-items-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-pink-400 shadow-sm mt-0.5">
              <Quotes size={22} weight="fill" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-pink-400">🌸</span>
                <h3 className="quote-title font-display text-sm sm:text-base font-bold text-white tracking-wide">
                  Daily Encouragement
                </h3>
                <span className="quote-badge rounded-full bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 font-mono text-[10px] text-purple-200">
                  Day #{dayOfYear} · {currentQuote.author[locale]}
                </span>
              </div>

              {/* In Front Quote Text */}
              <p
                className="quote-text font-serif italic text-sm sm:text-base md:text-[16px] leading-relaxed max-w-4xl"
                style={{ color: "#f5f3ff" }}
              >
                “{currentQuote.quote[locale]}”
              </p>

              {/* Author & Role in front */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="quote-author font-mono text-xs sm:text-sm font-bold"
                  style={{ color: "#f472b6" }}
                >
                  — {currentQuote.author[locale]}
                </span>
                {currentQuote.role && (
                  <span
                    className="quote-role font-mono text-[11px]"
                    style={{ color: "rgba(216, 180, 254, 0.85)" }}
                  >
                    · {currentQuote.role[locale]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Next Quote button + 3D Owl Sitting on Stacked Books */}
          <div className="flex items-center gap-4 self-end md:self-center shrink-0">
            <button
              type="button"
              onClick={handleNextQuote}
              className="quote-refresh-btn group flex items-center gap-1.5 rounded-xl border border-purple-800/40 bg-purple-950/40 px-3 py-1.5 font-mono text-xs text-purple-200 transition-all hover:border-purple-500 hover:text-white hover:bg-purple-900/50"
              title="Next Daily Quote"
            >
              <ArrowClockwise size={13} className="transition-transform duration-300 group-hover:rotate-180 !text-purple-200" />
              <span>Next Quote</span>
            </button>

            <div className="relative size-16 sm:size-20 shrink-0 transition-transform hover:scale-105 duration-300">
              <Image
                src="/images/learn/encouragement-owl.png"
                alt="Cute 3D owl with cherry blossom petals"
                width={80}
                height={80}
                className="size-full object-contain drop-shadow-[0_4px_16px_rgba(168,85,247,0.35)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HERO BANNER: "DIGITAL LEARNING" + 3D MAGICAL OPEN BOOK SCENE           */}
      {/* ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-3xl border border-purple-200/80 bg-white/80 shadow-[0_14px_40px_-10px_rgba(76,29,149,0.12)] dark:border-purple-800/30 dark:bg-gradient-to-r dark:from-[#170a2c]/80 dark:via-[#210e3f]/60 dark:to-[#120724]/80 p-6 sm:p-8 backdrop-blur-xl dark:shadow-[0_10px_40px_rgba(10,4,20,0.5)]">
        {/* Left: Titles */}
        <div className="lg:col-span-6 flex flex-col gap-2.5">
          <h1 className="module-hero-title font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-slate-900 dark:text-white uppercase drop-shadow-[0_2px_18px_rgba(168,85,247,0.35)]">
            Digital Learning
          </h1>
          <p className="font-display text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 dark:from-purple-300 dark:via-pink-200 dark:to-indigo-300 bg-clip-text text-transparent">
            Explore. Discover. Grow.
          </p>
          <p className="font-headline text-sm sm:text-base text-slate-600 dark:text-purple-200/70 max-w-md">
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
          {/* A. YOUR ENROLLED CLASS & ACADEMIC PROFILE                         */}
          {/* ----------------------------------------------------------------- */}
          <section className="relative overflow-hidden rounded-2xl border border-purple-200/80 bg-white/85 dark:border-purple-800/40 dark:bg-gradient-to-br dark:from-[#1b0d36]/80 dark:via-[#140a28]/70 dark:to-[#0e071c]/90 p-4 sm:p-5 backdrop-blur-md shadow-md dark:shadow-lg">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-purple-400/15 dark:bg-purple-600/15 blur-3xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: Class Badge + 3D Art + Stage & Board Info */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="relative size-14 sm:size-16 shrink-0 rounded-2xl border border-purple-200 bg-purple-50 dark:border-purple-500/40 dark:bg-gradient-to-b dark:from-purple-900/60 dark:to-purple-950/80 p-2 shadow-sm dark:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <Image
                    src={
                      CLASS_ITEMS.find((c) => c.std === currentStandard)?.image ||
                      "/images/learn/class-8-armillary.png"
                    }
                    alt={`Class ${currentStandard}`}
                    width={64}
                    height={64}
                    className="size-full object-contain drop-shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-purple-600 dark:bg-purple-500 text-white shadow-sm ring-2 ring-white dark:ring-[#140a28]">
                    <Check size={11} weight="bold" />
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide">
                      Class {currentStandard}
                    </h2>
                    <span className="rounded-full bg-purple-100 border border-purple-200 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-800 dark:bg-purple-500/20 dark:border-purple-400/30 dark:text-purple-200">
                      {currentStandard <= 5
                        ? "Primary Stage"
                        : currentStandard <= 8
                        ? "Middle School"
                        : currentStandard <= 10
                        ? "Secondary School"
                        : "Higher Secondary"}
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:border-emerald-400/30 dark:text-emerald-300">
                      {profile?.board === "cbse"
                        ? "CBSE"
                        : profile?.board === "icse_other"
                        ? "ICSE / Other"
                        : "Tamil Nadu State Board"}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-slate-600 dark:text-purple-300/80">
                    {isSenior && activeSeniorGroup ? (
                      <span>
                        Stream: <strong className="text-slate-900 dark:text-white font-semibold">{activeSeniorGroup.name[locale] || activeSeniorGroup.name.en}</strong> · Personalized Syllabus
                      </span>
                    ) : (
                      <span>
                        Samacheer Kalvi · Enrolled Academic Profile
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: Quick Edit Link */}
              <Link
                href="/sign-in?edit=true&redirect=/m/learn"
                className="group inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-purple-200 bg-purple-50/90 px-3.5 py-2 font-mono text-xs font-medium text-purple-800 hover:text-purple-950 hover:bg-purple-100 hover:border-purple-400 dark:border-purple-700/50 dark:bg-purple-950/70 dark:text-purple-200 dark:hover:text-white dark:hover:bg-purple-900/60 dark:hover:border-purple-400 transition-all shadow-sm"
                title="Change Class, Board or Stream in Profile Settings"
              >
                <PencilSimple size={15} className="text-purple-600 dark:text-purple-400 transition-transform group-hover:rotate-12" />
                <span>Edit Academic Profile</span>
              </Link>
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
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-purple-200/70 bg-white/80 px-3 py-1.5 backdrop-blur-md shadow-xs dark:border-transparent dark:bg-transparent dark:px-0 dark:py-0 dark:shadow-none dark:backdrop-blur-none">
                <Sparkle size={18} weight="fill" className="text-purple-600 dark:text-purple-400 animate-starlight" />
                <h2 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  Explore Your Subjects
                </h2>
                <span className="rounded-full bg-purple-100 border border-purple-200 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-800 dark:bg-purple-900/60 dark:border-purple-700/50 dark:text-purple-300">
                  {subjects.length} Subjects
                </span>
                {isSenior && (
                  <span className="rounded-full bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-800 dark:bg-indigo-900/60 dark:border-indigo-700/50 dark:text-indigo-200">
                    {activeSeniorGroup?.badge || "Computer Science"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsElongated((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white/85 px-2.5 py-1 font-mono text-[11px] font-medium text-purple-800 hover:bg-purple-50 hover:text-purple-950 hover:border-purple-400 dark:border-purple-800/40 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:text-white dark:hover:border-purple-600 transition-colors"
                  title={isElongated ? "Switch to standard grid" : "Elongate subjects layout"}
                >
                  <span>{isElongated ? "⊟ Compact Cards" : "⊞ Elongate View"}</span>
                </button>

                {activeSubjectId !== "all" && (
                  <button
                    type="button"
                    onClick={() => setActiveSubjectId("all")}
                    className="font-mono text-xs text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
                  >
                    View All Subjects
                  </button>
                )}
              </div>
            </div>

            {/* Senior Secondary Group / Stream Info Card for Class 11 and 12 */}
            {isSenior && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-purple-200/80 bg-white/85 dark:border-purple-800/40 dark:bg-gradient-to-r dark:from-purple-950/60 dark:via-[#180a2c]/60 dark:to-purple-950/60 p-3.5 sm:p-4 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-900/60 dark:border-purple-500/40 dark:text-purple-200 shadow-sm">
                    <GraduationCap size={22} weight="fill" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                        {activeSeniorGroup?.badge || "Computer Science"}
                      </span>
                      <span className="rounded-full bg-purple-100 border border-purple-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-purple-800 dark:bg-purple-500/20 dark:border-purple-400/30 dark:text-purple-300">
                        Enrolled Stream
                      </span>
                      <span className="font-mono text-[10.5px] text-slate-600 dark:text-purple-300/70">
                        Code {activeSeniorGroup?.code}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-purple-300/80">
                      {activeSeniorGroup?.description[locale] || activeSeniorGroup?.description.en}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Link
                    href="/sign-in?edit=true&redirect=/m/learn"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 font-mono text-xs font-medium text-purple-800 hover:text-purple-950 hover:bg-purple-100 hover:border-purple-400 dark:border-purple-700/50 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:text-white dark:hover:bg-purple-800/50 dark:hover:border-purple-400 transition-colors shadow-sm"
                    title="Change Stream in Profile Settings"
                  >
                    <PencilSimple size={13} />
                    <span>Change Stream in Profile</span>
                  </Link>
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
                    className={`group cosmic-card-glow cursor-pointer flex flex-col justify-between rounded-2xl border p-4 bg-gradient-to-b ${visual.gradient} backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-300 ${
                      isSelected
                        ? visual.activeBorderClass
                        : visual.borderClass
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300/80">
                          {sub.code || "SUB"}
                        </span>
                        {completedCount > 0 && (
                          <span className="rounded-full bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300">
                            {completedCount}/{sub.chapters.length}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-black text-slate-900 dark:text-white leading-tight">
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
                          handleSelectSubject(sub);
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
            <section className="fade-up rounded-2xl border border-purple-200/80 bg-white/85 dark:border-purple-900/30 dark:bg-[#140a28]/80 p-4 sm:p-5 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-600 dark:text-purple-400" />
                  <span>
                    {subjects.find((s) => s.id === activeSubjectId)?.name[locale] || "Chapters"}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-purple-300/60 font-normal">
                    ({displayedChapters.length} chapters)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubjectId("all")}
                  className="rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 font-mono text-[11px] font-medium text-purple-800 hover:bg-purple-100 hover:text-purple-950 hover:border-purple-400 dark:border-purple-800/40 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:text-white dark:hover:border-purple-600 transition-colors"
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
                    className="group flex items-center justify-between gap-3 rounded-xl border border-purple-200/80 bg-purple-50/70 px-3.5 py-2.5 text-left transition-all duration-200 hover:border-purple-400 hover:bg-purple-100/70 dark:border-purple-900/40 dark:bg-purple-950/30 dark:hover:border-purple-600/60 dark:hover:bg-purple-900/30 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-purple-100 border border-purple-200 font-mono text-[11px] font-bold text-purple-800 dark:bg-purple-900/60 dark:border-purple-700/40 dark:text-purple-200">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-purple-800 dark:text-slate-100 dark:group-hover:text-purple-300">
                          {item.chapter.title[locale]}
                        </p>
                        <p className="truncate font-mono text-[10.5px] text-slate-600 dark:text-purple-300/60">
                          {item.subject.name[locale]} • {item.chapter.summary[locale]}
                        </p>
                      </div>
                    </div>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-600/40 dark:text-purple-300 dark:group-hover:bg-purple-600 transition-colors">
                      <Play size={10} weight="fill" className="ml-0.5" />
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
          {/* CARD 1: YOUR LEARNING PATH                                        */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-purple-200/80 bg-white/85 dark:border-purple-900/30 dark:bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-md dark:shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap size={18} weight="fill" className="text-purple-600 dark:text-purple-400" />
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Your Learning Path
                </h3>
              </div>
              <Link
                href="/sign-in?edit=true&redirect=/m/learn"
                className="font-mono text-[11px] font-semibold text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
              >
                Change Class
              </Link>
            </div>

            {/* Breadcrumb Path */}
            <p className="font-mono text-xs text-slate-700 dark:text-purple-200/90 mb-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-purple-700 dark:text-purple-300 font-bold">Class {currentStandard}</span>
              <span>›</span>
              <span className="text-pink-700 dark:text-pink-300 font-semibold">
                {continueRecord ? continueRecord.subject.name[locale] : "Science"}
              </span>
              <span>›</span>
              <span>Term 1</span>
              <span>›</span>
              <span className="text-indigo-700 dark:text-indigo-300 font-bold">
                {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 3"}
              </span>
            </p>

            {/* Progress bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-purple-100 border border-purple-200 dark:bg-purple-950/80 dark:border-purple-900/50 mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-[0_0_12px_#a855f7] transition-all duration-500"
                style={{ width: `${Math.max(15, progressPct)}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-purple-300/70">
              <span>{completedChaptersCount} of {totalChapters} chapters completed</span>
              <span className="font-bold text-purple-700 dark:text-purple-300">{progressPct}%</span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 2: CONTINUE LEARNING                                         */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-purple-200/80 bg-white/85 dark:border-purple-900/30 dark:bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-md dark:shadow-lg">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-purple-600 text-white shadow-sm">
                  <Play size={10} weight="fill" className="ml-0.5" />
                </span>
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Continue Learning
                </h3>
              </div>
              <button
                type="button"
                onClick={handleLaunchContinue}
                className="font-mono text-[11px] font-semibold text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
              >
                View All
              </button>
            </div>

            {/* Active Chapter Card */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-200/80 bg-purple-50/80 dark:border-purple-800/30 dark:bg-purple-950/40 p-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-purple-200 bg-purple-100 dark:border-purple-700/40 dark:bg-purple-900/50">
                  <Image
                    src="/images/learn/continue-sprout.png"
                    alt="Sprout in soil pot"
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {continueRecord ? continueRecord.chapter.title[locale] : "Chapter 3: Plants Around Us"}
                  </h4>
                  <p className="font-mono text-[10.5px] text-slate-600 dark:text-purple-300/70 truncate mt-0.5">
                    {continueRecord ? continueRecord.subject.name[locale] : "Science"} • Term 1
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-purple-200 dark:bg-purple-900/60">
                      <div className="h-full rounded-full bg-purple-600 dark:bg-purple-400" style={{ width: "60%" }} />
                    </div>
                    <span className="font-mono text-[9.5px] font-semibold text-purple-700 dark:text-purple-400">60%</span>
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
          <div className="rounded-2xl border border-purple-200/80 bg-white/85 dark:border-purple-900/30 dark:bg-[#160a2b]/70 p-5 backdrop-blur-xl shadow-md dark:shadow-lg flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-600 dark:text-purple-400">📚</span>
              <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Quick Access
              </h3>
            </div>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/70 px-3.5 py-2.5 text-left transition-all hover:border-purple-400 hover:bg-purple-100/70 dark:border-purple-900/40 dark:bg-purple-950/30 dark:hover:border-purple-600/50 dark:hover:bg-purple-900/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  <FileText size={16} />
                </span>
                <span className="font-display text-xs font-bold text-slate-900 group-hover:text-purple-950 dark:text-purple-100 dark:group-hover:text-white">
                  My Notes
                </span>
              </div>
              <CaretRight size={12} className="text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/70 px-3.5 py-2.5 text-left transition-all hover:border-purple-400 hover:bg-purple-100/70 dark:border-purple-900/40 dark:bg-purple-950/30 dark:hover:border-purple-600/50 dark:hover:bg-purple-900/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  <PencilSimple size={16} />
                </span>
                <span className="font-display text-xs font-bold text-slate-900 group-hover:text-purple-950 dark:text-purple-100 dark:group-hover:text-white">
                  Practice Questions
                </span>
              </div>
              <CaretRight size={12} className="text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleLaunchContinue}
              className="group flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/70 px-3.5 py-2.5 text-left transition-all hover:border-purple-400 hover:bg-purple-100/70 dark:border-purple-900/40 dark:bg-purple-950/30 dark:hover:border-purple-600/50 dark:hover:bg-purple-900/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  <DownloadSimple size={16} />
                </span>
                <span className="font-display text-xs font-bold text-slate-900 group-hover:text-purple-950 dark:text-purple-100 dark:group-hover:text-white">
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
