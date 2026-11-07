"use client";

import {
  Airplane,
  Armchair,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  Atom,
  Bank,
  BatteryCharging,
  Boat,
  BookOpen,
  Books,
  Broadcast,
  Calculator,
  Camera,
  CaretRight,
  ChartBar,
  ChartLineUp,
  CheckCircle,
  Circuitry,
  Clock,
  Code,
  Coffee,
  Coins,
  Compass,
  Crown,
  Cpu,
  Cube,
  CurrencyInr,
  Database,
  Desktop,
  DiceFive,
  Dna,
  Drop,
  Eye,
  FilePdf,
  FirstAid,
  Flag,
  Flame,
  Flask,
  Flower,
  Function,
  Globe,
  GlobeHemisphereWest,
  GraduationCap,
  GridNine,
  Hammer,
  Handshake,
  Heart,
  House,
  Infinity,
  Key,
  Lightbulb,
  Lightning,
  Magnet,
  MaskHappy,
  Medal,
  Mountains,
  MusicNotes,
  NavigationArrow,
  PawPrint,
  PencilSimple,
  PenNib,
  Plant,
  Question,
  Radio,
  Receipt,
  Scales,
  ShieldCheck,
  Sparkle,
  SpeakerHigh,
  Stop,
  Sun,
  Target,
  TrafficSignal,
  Translate,
  Tree,
  Waveform,
  WifiHigh,
  X,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Burst } from "@/components/burst";
import { GrowthStage, useHydrated } from "@/components/learner-setup";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import {
  AlienMascot,
  BabyElephantMascot,
  BlastingRocket,
  BoardGameTrailSvg,
  BookMascot,
  CalculatorMascot,
  CheeringAstronautKid,
  ComputerMascot,
  CosmicBackgroundDoodles,
  DinosaurMascot,
  HappyStarBadge,
  KidBoyMascot,
  KidGirlMascot,
  LaptopMascot,
  LionCubMascot,
  MathMonsterMascot,
  PeekingSpaceship,
  RulerMascot,
  SpaceBear,
  SpaceKitty,
  SpacePuppy,
  TamilLetterA,
  TreasureChestMascot,
} from "./cosmic-mascots";
import { JuniorCosmicLessonPlayer } from "./junior-lesson-scene";
import { KaraokeLines, useReadAloud } from "@/components/read-aloud";
import { authService } from "@/lib/auth-service";
import { BAND_INFO } from "@/lib/bands";
import {
  filterSubjectsByGroup,
  getChapterById,
  getSeniorGroup,
  getSubjectsForStandard,
  isSupportedStandard,
  SENIOR_GROUPS,
  type SeniorGroupId,
  TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL,
  TN_NEW_SYLLABUS_2026_27_URL,
  TN_TEXTBOOK_PORTAL_URL,
  type CurriculumChapter,
  type CurriculumSubject,
} from "@/lib/curriculum";
import { StandardSwitcherModal } from "@/components/standard-switcher-modal";
import { completeLesson, localDay, setLastAccessed, XP, type Band, type Profile } from "@/lib/progress";

// ----------------------------------------------------------------------------
// Chapter Topic Icon Resolver & Renderer (Lesson-specific iconography)
// ----------------------------------------------------------------------------
function resolveChapterIcon(subject: CurriculumSubject, chapter: CurriculumChapter): string {
  if (chapter.icon) return chapter.icon;

  const t = (chapter.title?.en || "").toLowerCase();
  const id = (chapter.id || "").toLowerCase();

  // Physics mapping
  if (t.includes("electrostatics") || id.includes("electrostatics") || t.includes("coulomb")) return "lightning";
  if (t.includes("electromagnetic induction") || t.includes("alternating current")) return "waveform";
  if (t.includes("electromagnetic wave") || t.includes("em wave") || t.includes("waves")) return "radio";
  if (t.includes("magnet") || id.includes("magnet") || t.includes("biot-savart")) return "magnet";
  if (t.includes("current electricity") || t.includes("kirchhoff") || (t.includes("current") && !t.includes("alternating"))) return "cpu";
  if (t.includes("optics") || /\bray\b/.test(t) || t.includes("lens") || t.includes("microscope")) return "eye";
  if (t.includes("radiation") || t.includes("photoelectric") || t.includes("dual nature")) return "sun";
  if (t.includes("atomic") || t.includes("nuclear") || t.includes("bohr") || t.includes("nucleus")) return "atom";
  if (t.includes("semiconductor") || t.includes("diode") || t.includes("transistor") || t.includes("electronics")) return "circuitry";
  if (t.includes("communication") || t.includes("satellite") || t.includes("modulation")) return "broadcast";
  if (t.includes("recent developments") || t.includes("nanotechnology") || t.includes("robotics")) return "lightbulb";

  // English (12th & 11th specific lessons)
  if (t.includes("verona") || t.includes("two gentlemen")) return "heart";
  if (t.includes("castle")) return "shield";
  if (t.includes("god sees the truth") || t.includes("truth, but waits")) return "scales";
  if (t.includes("nice cup of tea") || t.includes("tea")) return "coffee";
  if (t.includes("casuarina") || t.includes("our casuarina tree")) return "tree";
  if (t.includes("life of pi") || t.includes("pi")) return "boat";
  if (t.includes("celebration of being alive")) return "heart";
  if (t.includes("world's a stage") || t.includes("stage")) return "theater";
  if (t.includes("hour of truth")) return "handshake";
  if (t.includes("summit") || t.includes("everest")) return "mountains";
  if (t.includes("ulysses")) return "compass";
  if (t.includes("midnight visitor")) return "key";
  if (t.includes("chair")) return "chair";
  if (t.includes("father to his son")) return "heart";
  if (t.includes("summer in a day") || t.includes("sun")) return "sun";
  if (t.includes("rule of the road")) return "traffic";
  if (t.includes("french camp")) return "flag";
  if (t.includes("remember caesar")) return "flower";

  if (t.includes("portrait of a lady")) return "heart";
  if (t.includes("once upon a time")) return "heart";
  if (t.includes("after twenty years")) return "clock";
  if (t.includes("queen of boxing") || t.includes("boxing")) return "medal";
  if (t.includes("confessions of a born spectator")) return "eye";
  if (t.includes("shot in the dark")) return "target";
  if (t.includes("forgetting")) return "lightbulb";
  if (t.includes("lines written in early spring")) return "plant";
  if (t.includes("first patient")) return "firstaid";
  if (t.includes("tight corners")) return "coins";
  if (t.includes("macavity")) return "paw";
  if (t.includes("with the photographer")) return "camera";
  if (t.includes("convocation address")) return "graduation";
  if (t.includes("singing lesson")) return "music";
  if (t.includes("accidental tourist")) return "airplane";
  if (t.includes("hollow crown")) return "crown";
  if (t.includes("never-never nest")) return "house";

  // Mathematics
  if (t.includes("matrices") || t.includes("determinants")) return "grid";
  if (t.includes("complex numbers")) return "infinity";
  if (t.includes("trigonometric") || t.includes("trigonometry")) return "compass";
  if (t.includes("vector")) return "vector";
  if (t.includes("differential") || t.includes("derivatives")) return "chart-up";
  if (t.includes("integral") || t.includes("calculus") || t.includes("integration")) return "chart-bar";
  if (t.includes("probability")) return "dice";
  if (t.includes("discrete")) return "circuitry";
  if (t.includes("geometry") || t.includes("analytical")) return "target";
  if (t.includes("equations") || t.includes("algebra")) return "function";

  // Chemistry
  if (t.includes("metallurgy")) return "flame";
  if (t.includes("solid state")) return "cube";
  if (t.includes("kinetics")) return "clock";
  if (t.includes("electrochemistry")) return "battery";
  if (t.includes("surface chemistry")) return "waveform";
  if (t.includes("biomolecules") || t.includes("genetics")) return "dna";
  if (t.includes("organic") || t.includes("nitrogen") || t.includes("carbonyl") || t.includes("ethers")) return "flask";
  if (t.includes("everyday life") || t.includes("medicines")) return "heart";

  // Biology
  if (t.includes("reproduction") || t.includes("plant") || t.includes("genetics") || t.includes("dna") || t.includes("evolution")) return "dna";
  if (t.includes("health") || t.includes("disease")) return "firstaid";
  if (t.includes("environment") || t.includes("ecology") || t.includes("population")) return "globe";

  // Computer Science
  if (t.includes("python") || t.includes("programming") || t.includes("algorithm")) return "code";
  if (t.includes("database") || t.includes("sql")) return "database";
  if (t.includes("network") || t.includes("internet")) return "wifi";

  // Commerce / Economics
  if (t.includes("market") || t.includes("commerce") || t.includes("shares")) return "chart-up";
  if (t.includes("banking") || t.includes("bank")) return "bank";
  if (t.includes("money") || t.includes("national income") || t.includes("fiscal") || t.includes("economy")) return "currency";

  // Computer Applications
  if (t.includes("pagemaker") || t.includes("word") || t.includes("writer") || t.includes("multimedia")) return "camera";
  if (t.includes("html") || t.includes("css") || t.includes("javascript") || t.includes("php")) return "code";
  if (t.includes("open source") || t.includes("organization") || t.includes("operating system")) return "cpu";
  if (t.includes("e-commerce") || t.includes("edi") || t.includes("payment")) return "coins";
  if (t.includes("security") || t.includes("ethics")) return "shield";
  if (t.includes("calc") || t.includes("spreadsheet") || t.includes("impress") || t.includes("presentation")) return "grid";

  // Business Mathematics & Statistics
  if (t.includes("financial") || t.includes("annuities") || t.includes("stocks")) return "currency";
  if (t.includes("correlation") || t.includes("regression") || t.includes("sampling") || t.includes("applied statistics")) return "chart-bar";
  if (t.includes("operations research") || t.includes("transportation") || t.includes("assignment")) return "target";

  // Tamil
  if (t.includes("இயல் 1") || t.includes("மொழி")) return "translate";
  if (t.includes("இயல் 2") || t.includes("இயற்கை")) return "tree";
  if (t.includes("இயல் 3") || t.includes("பண்பாடு")) return "house";
  if (t.includes("இயல் 4") || t.includes("அறிவியல்")) return "lightbulb";
  if (t.includes("இயல் 5") || t.includes("கல்வி")) return "graduation";
  if (t.includes("இயல் 6") || t.includes("கலை")) return "music";
  if (t.includes("இயல் 7") || t.includes("நாடு") || t.includes("வீரம்")) return "flag";
  if (t.includes("இயல் 8") || t.includes("அறம்")) return "heart";

  // Fallback to subject icon
  switch (subject?.icon) {
    case "physics": return "atom";
    case "chemistry": return "flask";
    case "math": return "function";
    case "biology": return "dna";
    case "computer": return "code";
    case "commerce": return "chart-up";
    case "tamil": return "translate";
    case "english": return "book";
    default: return "book";
  }
}

function ChapterIcon({
  name,
  className = "size-16",
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "lightning":
      return <Lightning className={className} weight="duotone" />;
    case "cpu":
      return <Cpu className={className} weight="duotone" />;
    case "magnet":
      return <Magnet className={className} weight="duotone" />;
    case "waveform":
      return <Waveform className={className} weight="duotone" />;
    case "radio":
      return <Radio className={className} weight="duotone" />;
    case "eye":
      return <Eye className={className} weight="duotone" />;
    case "sun":
      return <Sun className={className} weight="duotone" />;
    case "atom":
      return <Atom className={className} weight="duotone" />;
    case "broadcast":
      return <Broadcast className={className} weight="duotone" />;
    case "lightbulb":
      return <Lightbulb className={className} weight="duotone" />;
    case "circuitry":
      return <Circuitry className={className} weight="duotone" />;
    case "battery":
      return <BatteryCharging className={className} weight="duotone" />;
    case "heart":
      return <Heart className={className} weight="duotone" />;
    case "shield":
      return <ShieldCheck className={className} weight="duotone" />;
    case "scales":
      return <Scales className={className} weight="duotone" />;
    case "coffee":
      return <Coffee className={className} weight="duotone" />;
    case "tree":
      return <Tree className={className} weight="duotone" />;
    case "boat":
      return <Boat className={className} weight="duotone" />;
    case "theater":
      return <MaskHappy className={className} weight="duotone" />;
    case "handshake":
      return <Handshake className={className} weight="duotone" />;
    case "mountains":
      return <Mountains className={className} weight="duotone" />;
    case "compass":
      return <Compass className={className} weight="duotone" />;
    case "key":
      return <Key className={className} weight="duotone" />;
    case "chair":
      return <Armchair className={className} weight="duotone" />;
    case "traffic":
      return <TrafficSignal className={className} weight="duotone" />;
    case "flag":
      return <Flag className={className} weight="duotone" />;
    case "flower":
      return <Flower className={className} weight="duotone" />;
    case "medal":
      return <Medal className={className} weight="duotone" />;
    case "clock":
      return <Clock className={className} weight="duotone" />;
    case "target":
      return <Target className={className} weight="duotone" />;
    case "firstaid":
      return <FirstAid className={className} weight="duotone" />;
    case "paw":
      return <PawPrint className={className} weight="duotone" />;
    case "camera":
      return <Camera className={className} weight="duotone" />;
    case "graduation":
      return <GraduationCap className={className} weight="duotone" />;
    case "music":
      return <MusicNotes className={className} weight="duotone" />;
    case "airplane":
      return <Airplane className={className} weight="duotone" />;
    case "crown":
      return <Crown className={className} weight="duotone" />;
    case "house":
      return <House className={className} weight="duotone" />;
    case "buildings":
      return <House className={className} weight="duotone" />;
    case "users":
      return <Handshake className={className} weight="duotone" />;
    case "grid":
      return <GridNine className={className} weight="duotone" />;
    case "infinity":
      return <Infinity className={className} weight="duotone" />;
    case "function":
      return <Function className={className} weight="duotone" />;
    case "vector":
      return <NavigationArrow className={className} weight="duotone" />;
    case "chart-up":
      return <ChartLineUp className={className} weight="duotone" />;
    case "chart-bar":
      return <ChartBar className={className} weight="duotone" />;
    case "dice":
      return <DiceFive className={className} weight="duotone" />;
    case "flame":
      return <Flame className={className} weight="duotone" />;
    case "hammer":
      return <Hammer className={className} weight="duotone" />;
    case "flask":
      return <Flask className={className} weight="duotone" />;
    case "cube":
      return <Cube className={className} weight="duotone" />;
    case "drop":
      return <Drop className={className} weight="duotone" />;
    case "dna":
      return <Dna className={className} weight="duotone" />;
    case "plant":
      return <Plant className={className} weight="duotone" />;
    case "globe":
      return <Globe className={className} weight="duotone" />;
    case "code":
      return <Code className={className} weight="duotone" />;
    case "database":
      return <Database className={className} weight="duotone" />;
    case "wifi":
      return <WifiHigh className={className} weight="duotone" />;
    case "bank":
      return <Bank className={className} weight="duotone" />;
    case "currency":
      return <CurrencyInr className={className} weight="duotone" />;
    case "coins":
      return <Coins className={className} weight="duotone" />;
    case "receipt":
      return <Receipt className={className} weight="duotone" />;
    case "translate":
      return <Translate className={className} weight="duotone" />;
    case "pen":
      return <PenNib className={className} weight="duotone" />;
    case "book":
    default:
      return <BookOpen className={className} weight="duotone" />;
  }
}

// ----------------------------------------------------------------------------
// Subject Icon Mapper
// ----------------------------------------------------------------------------
function SubjectIcon({
  icon,
  className = "size-6",
}: {
  icon: CurriculumSubject["icon"];
  className?: string;
}) {
  switch (icon) {
    case "tamil":
      return <Translate className={className} weight="duotone" />;
    case "english":
      return <BookOpen className={className} weight="duotone" />;
    case "math":
      return <Calculator className={className} weight="duotone" />;
    case "science":
      return <Flask className={className} weight="duotone" />;
    case "social":
      return <GlobeHemisphereWest className={className} weight="duotone" />;
    case "physics":
      return <Atom className={className} weight="duotone" />;
    case "chemistry":
      return <Flask className={className} weight="duotone" />;
    case "biology":
      return <Books className={className} weight="duotone" />;
    case "computer":
      return <Desktop className={className} weight="duotone" />;
    case "commerce":
      return <ChartLineUp className={className} weight="duotone" />;
    default:
      return <BookOpen className={className} weight="duotone" />;
  }
}

// ----------------------------------------------------------------------------
// Progress Ring Component
// ----------------------------------------------------------------------------
function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const frac = total > 0 ? done / total : 0;
  return (
    <svg viewBox="0 0 80 80" className="size-20 shrink-0 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="7" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--band, var(--violet))"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${Math.round(circ * frac * 100) / 100} ${Math.round(circ * 100) / 100}`}
        className="transition-[stroke-dasharray] duration-700"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Interactive Lesson Dialog (Reader, Karaoke Audio, Textbook Link & Quiz)
// ----------------------------------------------------------------------------

function CosmicCurriculumLessonDialog({
  standard,
  subject,
  chapter,
  allChapters,
  onClose,
  onSelectChapter,
}: {
  standard: number;
  subject: CurriculumSubject | null;
  chapter: CurriculumChapter | null;
  allChapters: { subject: CurriculumSubject; chapter: CurriculumChapter }[];
  onClose: () => void;
  onSelectChapter: (chId: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { locale } = useLocale();
  const progress = useProgress();
  const { state, play, stop } = useReadAloud();
  const [slow, setSlow] = useState(false);
  const [celebrate, setCelebrate] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (chapter && !dialog.open) {
      dialog.showModal();
    }
    if (!chapter && dialog.open) {
      dialog.close();
    }
  }, [chapter]);

  // Record last accessed when chapter opens
  useEffect(() => {
    if (chapter && subject) {
      updateProgress((p) => {
        if (typeof setLastAccessed === "function") {
          return setLastAccessed(p, {
            standard,
            subjectId: subject.id,
            chapterId: chapter.id,
          });
        }
        if (!p.profile) return p;
        return {
          ...p,
          profile: {
            ...p.profile,
            lastAccessed: {
              standard,
              subjectId: subject.id,
              chapterId: chapter.id,
              timestamp: new Date().toISOString(),
            },
          },
        };
      });
    }
  }, [chapter, subject, standard]);

  const close = () => {
    stop();
    setCelebrate(0);
    onClose();
  };

  if (!chapter || !subject) return null;

  const done = progress.lessonsDone.includes(chapter.id);
  const reading = state.id === chapter.id;

  // Next / Previous navigation
  const currentIndex = allChapters.findIndex((item) => item.chapter.id === chapter.id);
  const prevItem = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const markComplete = () => {
    updateProgress((p) => {
      let next = completeLesson(p, chapter.id, localDay());
      if (typeof setLastAccessed === "function") {
        next = setLastAccessed(next, {
          standard,
          subjectId: subject.id,
          chapterId: chapter.id,
        });
      } else if (next.profile) {
        next = {
          ...next,
          profile: {
            ...next.profile,
            lastAccessed: {
              standard,
              subjectId: subject.id,
              chapterId: chapter.id,
              timestamp: new Date().toISOString(),
            },
          },
        };
      }
      return next;
    });
    setCelebrate((n) => n + 1);
  };

  const handleAnswerSelect = (qId: string, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label={chapter.title[locale]}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[32px] border-2 border-violet-500/80 bg-[#0e0524] p-0 text-white shadow-[0_0_80px_rgba(168,85,247,0.5)] backdrop:bg-black/80 backdrop:backdrop-blur-md open:animate-[fade-up_0.45s_var(--ease-out)_both] md:inset-0 md:m-auto md:max-h-[88dvh] md:w-[min(860px,calc(100%-3rem))] md:rounded-[32px]"
    >
      <div className="relative flex flex-col p-5 sm:p-8">
        {/* Glow backdrop with stars */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(168,85,247,0.35),transparent_70%)]"
        />

        {/* Floating sparkles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
          <span className="absolute top-5 right-20 text-pink-400 text-lg animate-ping">✦</span>
          <span className="absolute top-12 left-16 text-amber-300 text-base animate-pulse">✨</span>
          <span className="absolute bottom-20 right-10 text-cyan-300 text-sm">✦</span>
        </div>

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-pink-400/80 bg-pink-950/60 text-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.4)]">
              <ChapterIcon name={resolveChapterIcon(subject, chapter)} className="size-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/70 bg-violet-950/80 px-3 py-0.5 font-mono text-[11px] font-bold text-violet-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  <span>✨</span>
                  <span>Class {standard} · {subject.name[locale]} · Chapter {chapter.chapterNumber}</span>
                  <span>✨</span>
                </span>
              </div>
              <h2 className="font-display text-[clamp(22px,3vw,30px)] font-black leading-tight tracking-[-0.02em] text-white mt-1">
                {chapter.title[locale]}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close dialog"
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-400/50 bg-violet-950/60 text-violet-200 transition-all hover:bg-violet-900/80 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Description */}
        <p className="relative mt-3 text-sm text-purple-200/90 leading-relaxed">
          {chapter.summary[locale]}
        </p>

        {/* Read-Aloud Karaoke Text */}
        {chapter.lessonLines && chapter.lessonLines.length > 0 && (
          <div className="relative mt-6 rounded-3xl border-2 border-violet-500/40 bg-[#160932]/95 p-5 sm:p-7 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
            <KaraokeLines
              lines={chapter.lessonLines}
              lang={chapter.lessonLang}
              activeLine={reading ? state.line : -1}
              activeWord={reading ? state.word : -1}
              className="flex flex-col gap-2.5 font-display text-[clamp(18px,2.4vw,25px)] leading-relaxed text-purple-100"
            />
          </div>
        )}

        {/* Audio Controls */}
        {chapter.lessonLines && chapter.lessonLines.length > 0 && (
          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                reading
                  ? stop()
                  : play(chapter.id, chapter.lessonLines, chapter.lessonLang, { rate: slow ? 0.8 : 1 })
              }
              className={`inline-flex h-12 items-center gap-2 rounded-full px-6 font-mono text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.7)] transition-all hover:scale-105 active:scale-95 ${
                reading
                  ? "bg-violet-900/80 text-white border border-pink-400"
                  : "bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 text-white"
              }`}
            >
              {reading ? <Stop size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
              {reading ? "Stop Audio" : "Listen / Read Aloud 🎵"}
            </button>
            <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-violet-400/50 bg-violet-950/60 px-4 text-[13px] text-purple-200 has-[:checked]:border-pink-400 has-[:checked]:text-white">
              <input
                type="checkbox"
                checked={slow}
                onChange={(e) => setSlow(e.target.checked)}
                className="accent-pink-500"
              />
              Slower
            </label>
            {reading && state.silent && (
              <p className="w-full text-[12.5px] text-amber-300">
                Speech audio synthesis unavailable on this device.
              </p>
            )}
          </div>
        )}

        {/* Tamil Nadu State Board Textbooks Section */}
        <div className="relative mt-6 rounded-3xl border border-violet-500/40 bg-[#14072b]/90 p-5 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilePdf size={18} weight="duotone" className="text-pink-400" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-purple-200 font-bold">
                Official Tamil Nadu Textbooks & References
              </h4>
            </div>
            <span className="rounded-full border border-violet-400/50 bg-violet-950/70 px-2.5 py-0.5 font-mono text-[10px] text-violet-200">
              Samacheer Kalvi 2026–27 ✨
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={TN_NEW_SYLLABUS_2026_27_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-violet-500/50 bg-[#1c0c3c]/80 p-3.5 transition-all hover:border-pink-400 hover:bg-violet-900/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-white group-hover:text-pink-300">
                    New Syllabus Textbooks (From 2026 - 27)
                  </p>
                  <span className="shrink-0 rounded bg-pink-500/20 px-1.5 py-0.5 font-mono text-[9px] text-pink-300 border border-pink-400/40">
                    Tnkalvi .net
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-purple-200/70">
                  Direct Download Link for New Syllabus Textbooks
                </p>
              </div>
              <ArrowSquareOut size={14} className="shrink-0 text-purple-300 group-hover:text-pink-300" />
            </a>

            <a
              href={TN_TEXTBOOK_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-violet-500/50 bg-[#1c0c3c]/80 p-3.5 transition-all hover:border-pink-400 hover:bg-violet-900/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-white group-hover:text-pink-300">
                    Tamilnadu School Textbooks
                  </p>
                  <span className="shrink-0 rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] text-cyan-300 border border-cyan-400/40">
                    Official
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-purple-200/70">
                  Complete State Board Textbooks Repository
                </p>
              </div>
              <ArrowSquareOut size={14} className="shrink-0 text-purple-300 group-hover:text-pink-300" />
            </a>
          </div>

          <div className="mt-2">
            <a
              href={TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-violet-500/40 bg-[#1a0a38]/80 p-3 transition-all hover:border-pink-400 hover:bg-[#200d44]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 rounded-full border border-amber-400/60 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                  Class 1, 2, 3
                </span>
                <p className="truncate text-xs text-purple-200 group-hover:text-white">
                  TN Class 1, 2, 3 New Textbooks 2026–2027 PDF Download – Tamil & English Medium ✨
                </p>
              </div>
              <ArrowSquareOut size={13} className="shrink-0 text-purple-300 group-hover:text-pink-300" />
            </a>
          </div>
        </div>

        {/* Practice Questions */}
        {chapter.practiceQuestions && chapter.practiceQuestions.length > 0 && (
          <div className="relative mt-6 rounded-3xl border border-violet-500/40 bg-[#14072b]/90 p-5 sm:p-6 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="flex items-center gap-2 text-pink-400">
              <Question size={18} weight="fill" />
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold">
                Practice Questions 🌟
              </h4>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {chapter.practiceQuestions.map((q, qIndex) => {
                const selected = selectedAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.answerIndex;

                return (
                  <div key={q.id} className="rounded-2xl border border-violet-500/30 bg-[#1c0c3c]/80 p-4">
                    <p className="text-sm font-semibold text-white">
                      <span className="mr-2 font-mono text-xs text-pink-300">Q{qIndex + 1}.</span>
                      {q.question[locale]}
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, optIndex) => {
                        const isOptionSelected = selected === optIndex;
                        let btnStyle = "border-violet-500/40 bg-violet-950/60 text-purple-200 hover:border-pink-400 hover:text-white";

                        if (isAnswered) {
                          if (optIndex === q.answerIndex) {
                            btnStyle = "border-2 border-emerald-400 bg-emerald-950/80 text-emerald-300 font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)]";
                          } else if (isOptionSelected) {
                            btnStyle = "border-2 border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]";
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, optIndex)}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors ${btnStyle}`}
                          >
                            <span className="font-mono text-[11px] opacity-75">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span>{opt[locale]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation[q.id] && (
                      <div
                        className={`mt-3 rounded-xl border p-2.5 text-xs leading-relaxed ${
                          isCorrect
                            ? "border-emerald-400/50 bg-emerald-950/60 text-emerald-300"
                            : "border-amber-400/50 bg-amber-950/60 text-amber-300"
                        }`}
                      >
                        <p className="font-bold">{isCorrect ? "✓ Correct! Amazing job! ⭐" : "Hint / Explanation:"}</p>
                        <p className="mt-0.5">{q.explanation[locale]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer controls: Navigation & Complete */}
        <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-violet-500/30 pt-5">
          <div>
            {prevItem ? (
              <button
                type="button"
                onClick={() => onSelectChapter(prevItem.chapter.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/50 bg-violet-950/60 px-4 py-2 font-mono text-xs text-purple-200 hover:text-white hover:border-pink-400 transition-all"
              >
                <ArrowLeft size={13} />
                Previous Chapter
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {done ? (
              <span className="pop-in relative inline-flex h-12 items-center gap-2 rounded-full border border-emerald-400 bg-emerald-950/80 px-5 font-mono text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                <CheckCircle size={18} weight="fill" />
                Learned (+{XP.lesson} XP)
                {celebrate > 0 && (
                  <>
                    <Burst key={celebrate} />
                    <span
                      key={`xp-${celebrate}`}
                      className="float-up absolute -top-5 right-4 font-mono text-xs text-amber-300"
                    >
                      +{XP.lesson} XP
                    </span>
                  </>
                )}
              </span>
            ) : (
              <button
                type="button"
                onClick={markComplete}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(52,211,153,0.6)] hover:scale-105 active:scale-95 transition-transform"
              >
                <CheckCircle size={18} />
                Mark Chapter Complete (+{XP.lesson} XP)
              </button>
            )}

            {nextItem && (
              <button
                type="button"
                onClick={() => onSelectChapter(nextItem.chapter.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/80 bg-gradient-to-r from-pink-500/30 to-purple-500/30 px-5 py-2.5 font-mono text-xs font-bold text-pink-200 hover:text-white shadow-[0_0_15px_rgba(244,114,182,0.4)] transition-all"
              >
                Next Chapter
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
// ----------------------------------------------------------------------------
// Subject Card (Rendered in "this place" for All Subjects view)
// ----------------------------------------------------------------------------

function StandardCurriculumLessonDialog({
  standard,
  subject,
  chapter,
  allChapters,
  onClose,
  onSelectChapter,
}: {
  standard: number;
  subject: CurriculumSubject | null;
  chapter: CurriculumChapter | null;
  allChapters: { subject: CurriculumSubject; chapter: CurriculumChapter }[];
  onClose: () => void;
  onSelectChapter: (chId: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { locale } = useLocale();
  const progress = useProgress();
  const { state, play, stop } = useReadAloud();
  const [slow, setSlow] = useState(false);
  const [celebrate, setCelebrate] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (chapter && !dialog.open) {
      dialog.showModal();
    }
    if (!chapter && dialog.open) {
      dialog.close();
    }
  }, [chapter]);

  // Record last accessed when chapter opens
  useEffect(() => {
    if (chapter && subject) {
      updateProgress((p) => {
        if (typeof setLastAccessed === "function") {
          return setLastAccessed(p, {
            standard,
            subjectId: subject.id,
            chapterId: chapter.id,
          });
        }
        if (!p.profile) return p;
        return {
          ...p,
          profile: {
            ...p.profile,
            lastAccessed: {
              standard,
              subjectId: subject.id,
              chapterId: chapter.id,
              timestamp: new Date().toISOString(),
            },
          },
        };
      });
    }
  }, [chapter, subject, standard]);

  const close = () => {
    stop();
    setCelebrate(0);
    onClose();
  };

  if (!chapter || !subject) return null;

  const done = progress.lessonsDone.includes(chapter.id);
  const reading = state.id === chapter.id;

  // Next / Previous navigation
  const currentIndex = allChapters.findIndex((item) => item.chapter.id === chapter.id);
  const prevItem = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const markComplete = () => {
    updateProgress((p) => {
      let next = completeLesson(p, chapter.id, localDay());
      if (typeof setLastAccessed === "function") {
        next = setLastAccessed(next, {
          standard,
          subjectId: subject.id,
          chapterId: chapter.id,
        });
      } else if (next.profile) {
        next = {
          ...next,
          profile: {
            ...next.profile,
            lastAccessed: {
              standard,
              subjectId: subject.id,
              chapterId: chapter.id,
              timestamp: new Date().toISOString(),
            },
          },
        };
      }
      return next;
    });
    setCelebrate((n) => n + 1);
  };

  const handleAnswerSelect = (qId: string, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  const catStyle = { "--cat": subject.accent } as React.CSSProperties;

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label={chapter.title[locale]}
      style={catStyle}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[28px] border border-line-strong bg-surface/95 p-0 text-text shadow-[0_-30px_90px_-10px_rgb(0_0_0/0.8)] backdrop-blur-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm open:animate-[fade-up_0.45s_var(--ease-out)_both] md:inset-0 md:m-auto md:max-h-[88dvh] md:w-[min(820px,calc(100%-3rem))] md:rounded-[28px]"
    >
      <div className="relative flex flex-col p-5 sm:p-8">
        {/* Glow backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(70%_100%_at_20%_0%,color-mix(in_srgb,var(--cat)_28%,transparent),transparent_70%)]"
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--cat)_18%,transparent)] text-[var(--cat)]">
              <ChapterIcon name={resolveChapterIcon(subject, chapter)} className="size-6" />
            </span>
            <div>
              <p className="font-mono text-[12px] text-[var(--cat)]">
                Class {standard} · {subject.name[locale]} · Chapter {chapter.chapterNumber}
              </p>
              <h2 className="font-display text-[clamp(22px,3vw,30px)] leading-tight tracking-[-0.02em]">
                {chapter.title[locale]}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close dialog"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] transition-colors hover:bg-white/[0.1]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Description */}
        <p className="relative mt-3 text-sm text-muted">
          {chapter.summary[locale]}
        </p>

        {/* Read-Aloud Karaoke Text */}
        {chapter.lessonLines && chapter.lessonLines.length > 0 && (
          <div className="relative mt-6 rounded-3xl border border-line bg-bg/50 p-5 sm:p-7">
            <KaraokeLines
              lines={chapter.lessonLines}
              lang={chapter.lessonLang}
              activeLine={reading ? state.line : -1}
              activeWord={reading ? state.word : -1}
              className="flex flex-col gap-2.5 font-display text-[clamp(18px,2.4vw,25px)] leading-relaxed text-text"
            />
          </div>
        )}

        {/* Audio Controls */}
        {chapter.lessonLines && chapter.lessonLines.length > 0 && (
          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                reading
                  ? stop()
                  : play(chapter.id, chapter.lessonLines, chapter.lessonLang, { rate: slow ? 0.8 : 1 })
              }
              className={`inline-flex h-12 items-center gap-2 rounded-full px-5 font-mono text-sm transition-colors ${
                reading
                  ? "bg-white/[0.1] text-text"
                  : "bg-[var(--cat)] text-bg hover:brightness-110"
              }`}
            >
              {reading ? <Stop size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
              {reading ? "Stop Audio" : "Listen / Read Aloud"}
            </button>
            <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-[13px] text-muted has-[:checked]:border-[var(--cat)] has-[:checked]:text-text">
              <input
                type="checkbox"
                checked={slow}
                onChange={(e) => setSlow(e.target.checked)}
                className="accent-[var(--cat)]"
              />
              Slower
            </label>
            {reading && state.silent && (
              <p className="w-full text-[12.5px] text-amber">
                Speech audio synthesis unavailable on this device.
              </p>
            )}
          </div>
        )}

        {/* Tamil Nadu State Board Textbooks Section */}
        <div className="relative mt-6 rounded-3xl border border-line bg-surface-2 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilePdf size={18} weight="duotone" className="text-violet" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-text">
                Official Tamil Nadu Textbooks & References
              </h4>
            </div>
            <span className="rounded-full bg-violet-deep/40 px-2.5 py-0.5 font-mono text-[10px] text-violet-ink">
              Samacheer Kalvi 2026–27
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={TN_NEW_SYLLABUS_2026_27_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-all hover:border-violet/60 hover:bg-violet-deep/10"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-text group-hover:text-violet-ink">
                    New Syllabus Textbooks (From 2026 - 27)
                  </p>
                  <span className="shrink-0 rounded bg-violet/15 px-1.5 py-0.5 font-mono text-[9px] text-violet">
                    Tnkalvi .net
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  Direct Download Link for New Syllabus Textbooks
                </p>
              </div>
              <ArrowSquareOut size={14} className="shrink-0 text-muted group-hover:text-violet" />
            </a>

            <a
              href={TN_TEXTBOOK_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-all hover:border-violet/60 hover:bg-violet-deep/10"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-text group-hover:text-violet-ink">
                    Tamilnadu School Textbooks
                  </p>
                  <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-muted">
                    Official
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  Complete State Board Textbooks Repository
                </p>
              </div>
              <ArrowSquareOut size={14} className="shrink-0 text-muted group-hover:text-violet" />
            </a>
          </div>

          <div className="mt-2">
            <a
              href={TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line/60 bg-surface/60 p-3 transition-all hover:border-line-strong hover:bg-surface"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[10px] text-amber">
                  Class 1, 2, 3
                </span>
                <p className="truncate text-xs text-muted group-hover:text-text">
                  TN Class 1, 2, 3 New Textbooks 2026–2027 PDF Download – Tamil & English Medium
                </p>
              </div>
              <ArrowSquareOut size={13} className="shrink-0 text-muted group-hover:text-violet" />
            </a>
          </div>
        </div>

        {/* Practice Questions */}
        {chapter.practiceQuestions && chapter.practiceQuestions.length > 0 && (
          <div className="relative mt-6 rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-2 text-violet">
              <Question size={18} weight="fill" />
              <h4 className="font-mono text-xs uppercase tracking-wider">
                Practice Questions
              </h4>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {chapter.practiceQuestions.map((q, qIndex) => {
                const selected = selectedAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.answerIndex;

                return (
                  <div key={q.id} className="rounded-2xl border border-line/60 bg-surface-2 p-4">
                    <p className="text-sm font-medium text-text">
                      <span className="mr-2 font-mono text-xs text-muted">Q{qIndex + 1}.</span>
                      {q.question[locale]}
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, optIndex) => {
                        const isOptionSelected = selected === optIndex;
                        let btnStyle = "border-line bg-surface text-muted hover:text-text";

                        if (isAnswered) {
                          if (optIndex === q.answerIndex) {
                            btnStyle = "border-success bg-success/15 text-success font-medium";
                          } else if (isOptionSelected) {
                            btnStyle = "border-danger bg-danger/15 text-danger";
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, optIndex)}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors ${btnStyle}`}
                          >
                            <span className="font-mono text-[11px] opacity-60">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span>{opt[locale]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation[q.id] && (
                      <div
                        className={`mt-3 rounded-xl border p-2.5 text-xs leading-relaxed ${
                          isCorrect
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-amber/30 bg-amber/10 text-amber"
                        }`}
                      >
                        <p className="font-bold">{isCorrect ? "✓ Correct!" : "Note:"}</p>
                        <p className="mt-0.5">{q.explanation[locale]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer controls: Navigation & Complete */}
        <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-5">
          <div>
            {prevItem ? (
              <button
                type="button"
                onClick={() => onSelectChapter(prevItem.chapter.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-xs text-muted hover:text-text"
              >
                <ArrowLeft size={13} />
                Previous
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {done ? (
              <span className="pop-in relative inline-flex h-12 items-center gap-2 rounded-full bg-success/15 px-5 font-mono text-xs text-success">
                <CheckCircle size={18} weight="fill" />
                Learned (+{XP.lesson} XP)
                {celebrate > 0 && (
                  <>
                    <Burst key={celebrate} />
                    <span
                      key={`xp-${celebrate}`}
                      className="float-up absolute -top-5 right-4 font-mono text-xs text-amber"
                    >
                      +{XP.lesson} XP
                    </span>
                  </>
                )}
              </span>
            ) : (
              <button
                type="button"
                onClick={markComplete}
                className="beam-border inline-flex h-12 items-center gap-2 rounded-full bg-violet-deep px-6 font-mono text-xs font-semibold text-violet-ink transition-transform hover:-translate-y-0.5"
              >
                <CheckCircle size={18} />
                Mark Chapter Complete (+{XP.lesson} XP)
              </button>
            )}

            {nextItem && (
              <button
                type="button"
                onClick={() => onSelectChapter(nextItem.chapter.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet-deep/30 px-4 py-2 font-mono text-xs text-violet-ink hover:bg-violet-deep"
              >
                Next
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

// ----------------------------------------------------------------------------
// Subject Card (Rendered in "this place" for All Subjects view)
// ----------------------------------------------------------------------------

function CurriculumLessonDialog(props: {
  standard: number;
  subject: CurriculumSubject | null;
  chapter: CurriculumChapter | null;
  allChapters: { subject: CurriculumSubject; chapter: CurriculumChapter }[];
  onClose: () => void;
  onSelectChapter: (chId: string) => void;
}) {
  if (props.standard <= 3) {
    if (!props.chapter || !props.subject) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={props.chapter.title.en}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 sm:p-4 backdrop-blur-md"
      >
        <div className="relative w-full max-w-[1240px] my-auto">
          <JuniorCosmicLessonPlayer {...props} />
        </div>
      </div>
    );
  }
  return <StandardCurriculumLessonDialog {...props} />;
}

function CosmicSubjectCard({
  subject,
  standard,
  doneCount,
  onOpen,
}: {
  subject: CurriculumSubject;
  standard: number;
  doneCount: number;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const allDone = doneCount === subject.chapters.length && subject.chapters.length > 0;

  const isTamil = subject.code === "TAM" || subject.id.includes("tamil");
  const isEnglish = subject.code === "ENG" || subject.id.includes("english");
  const isMaths = subject.code === "MAT" || subject.id.includes("math");

  const borderClass = isTamil
    ? "border-2 border-purple-500/80 shadow-[0_0_25px_-5px_rgba(168,85,247,0.5)] hover:border-purple-400"
    : isEnglish
    ? "border-2 border-cyan-400/80 shadow-[0_0_25px_-5px_rgba(34,211,238,0.5)] hover:border-cyan-300"
    : isMaths
    ? "border-2 border-amber-400/80 shadow-[0_0_25px_-5px_rgba(251,191,36,0.5)] hover:border-amber-300"
    : "border-2 border-violet-500/60 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] hover:border-violet-400";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative flex flex-col overflow-hidden rounded-[26px] bg-[#140828] text-left transition-all duration-300 hover:-translate-y-1.5 ${borderClass}`}
    >
      <span className="relative grid h-36 place-items-center overflow-hidden bg-gradient-to-b from-white/[0.05] to-transparent">
        {isTamil ? (
          <TamilLetterA />
        ) : isEnglish ? (
          <BookOpen size={60} weight="duotone" className="text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
        ) : isMaths ? (
          <Calculator size={60} weight="duotone" className="text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
        ) : (
          <SubjectIcon
            icon={subject.icon}
            className="size-16 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
          />
        )}
        <PeekingSpaceship className="absolute -top-1 -right-1 size-12 opacity-80 pointer-events-none group-hover:scale-110 transition-transform" />
        {allDone && (
          <span className="pop-in absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/25 border border-emerald-400 px-2.5 py-1 font-mono text-[11px] text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]">
            <CheckCircle size={14} weight="fill" />
            Completed
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[11.5px] uppercase tracking-wider text-purple-300 font-bold">
          Class {standard} · {subject.code}
        </span>
        <span className="text-[20px] font-bold leading-snug text-white group-hover:text-fuchsia-300 transition-colors">
          {subject.name[locale]}
        </span>
        <span className="line-clamp-2 text-xs text-purple-200/70">
          {subject.description[locale]}
        </span>
        <span className="mt-auto flex items-center justify-between pt-3 font-mono text-[11.5px] text-purple-200/80">
          <span>
            {subject.chapters.length} Chapters · {doneCount}/{subject.chapters.length} Done
          </span>
          <span className="flex items-center gap-1 text-fuchsia-300 font-bold transition-transform group-hover:translate-x-1">
            Open Subject <CaretRight size={13} weight="bold" />
          </span>
        </span>
      </span>
    </button>
  );
}

// ----------------------------------------------------------------------------
// Chapter Card (Rendered in "this place" for Subject / All Chapters view)
// ----------------------------------------------------------------------------
function CosmicChapterCard({
  subject,
  chapter,
  done,
  onOpen,
}: {
  subject: CurriculumSubject;
  chapter: CurriculumChapter;
  done: boolean;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const style = { "--cat": subject.accent } as React.CSSProperties;
  const iconName = resolveChapterIcon(subject, chapter);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={style}
      className="group relative flex flex-col overflow-hidden rounded-[26px] border-2 border-violet-500/60 bg-[#140828] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]"
    >
      <span className="relative grid h-36 place-items-center overflow-hidden bg-gradient-to-b from-white/[0.06] to-transparent">
        <ChapterIcon
          name={iconName}
          className="size-16 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
        />
        <PeekingSpaceship className="absolute -top-1 -right-1 size-12 opacity-80 pointer-events-none group-hover:scale-110 transition-transform" />
        {done && (
          <span className="pop-in absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/25 border border-emerald-400 px-2.5 py-1 font-mono text-[11px] text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]">
            <CheckCircle size={14} weight="fill" />
            Learned
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[11.5px] uppercase tracking-wider text-purple-300 font-bold">
          {subject.name[locale]} · Ch {chapter.chapterNumber}
        </span>
        <span className="text-[20px] font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors">
          {chapter.title[locale]}
        </span>
        <span className="line-clamp-2 text-xs text-purple-200/70">
          {chapter.summary[locale]}
        </span>
        <span className="mt-auto flex items-center justify-between pt-3 font-mono text-[11.5px] text-purple-200/80">
          <span className="flex items-center gap-1.5">
            <Clock size={13} aria-hidden />
            {chapter.estimatedMinutes} min
          </span>
          <span className="font-mono text-[11px] text-cyan-300 font-bold opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
            Listen / Read ➔
          </span>
        </span>
      </span>
    </button>
  );
}

function StandardSubjectCard({
  subject,
  standard,
  doneCount,
  onOpen,
}: {
  subject: CurriculumSubject;
  standard: number;
  doneCount: number;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const allDone = doneCount === subject.chapters.length && subject.chapters.length > 0;
  const style = { "--cat": subject.accent } as React.CSSProperties;

  return (
    <button
      type="button"
      onClick={onOpen}
      style={style}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--cat)_50%,transparent)] hover:shadow-[0_20px_60px_-25px_var(--cat)]"
    >
      <span className="relative grid h-36 place-items-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,color-mix(in_srgb,var(--cat)_40%,transparent),transparent_60%)]">
        <SubjectIcon
          icon={subject.icon}
          className="size-16 text-[var(--cat)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
        />
        {allDone && (
          <span className="pop-in absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 font-mono text-[11px] text-success">
            <CheckCircle size={14} weight="fill" />
            Completed
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[11.5px] text-[var(--cat)]">
          Class {standard} · {subject.code}
        </span>
        <span className="text-[20px] font-medium leading-snug text-text group-hover:text-violet-ink">
          {subject.name[locale]}
        </span>
        <span className="line-clamp-2 text-xs text-muted">
          {subject.description[locale]}
        </span>
        <span className="mt-auto flex items-center justify-between pt-3 font-mono text-[11.5px] text-muted">
          <span>
            {subject.chapters.length} Chapters · {doneCount}/{subject.chapters.length} Done
          </span>
          <span className="flex items-center gap-1 text-[var(--cat)] transition-transform group-hover:translate-x-1">
            Open Subject <CaretRight size={13} />
          </span>
        </span>
      </span>
    </button>
  );
}

// ----------------------------------------------------------------------------
// Chapter Card (Rendered in "this place" for Subject / All Chapters view)
// ----------------------------------------------------------------------------
function StandardChapterCard({
  subject,
  chapter,
  done,
  onOpen,
}: {
  subject: CurriculumSubject;
  chapter: CurriculumChapter;
  done: boolean;
  onOpen: () => void;
}) {
  const { locale } = useLocale();
  const style = { "--cat": subject.accent } as React.CSSProperties;
  const iconName = resolveChapterIcon(subject, chapter);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={style}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--cat)_50%,transparent)] hover:shadow-[0_20px_60px_-25px_var(--cat)]"
    >
      <span className="relative grid h-36 place-items-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,color-mix(in_srgb,var(--cat)_40%,transparent),transparent_60%)]">
        <ChapterIcon
          name={iconName}
          className="size-16 text-[var(--cat)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
        />
        {done && (
          <span className="pop-in absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 font-mono text-[11px] text-success">
            <CheckCircle size={14} weight="fill" />
            Learned
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[11.5px] text-[var(--cat)]">
          {subject.name[locale]} · Ch {chapter.chapterNumber}
        </span>
        <span className="text-[20px] font-medium leading-snug text-text group-hover:text-violet-ink">
          {chapter.title[locale]}
        </span>
        <span className="line-clamp-2 text-xs text-muted">
          {chapter.summary[locale]}
        </span>
        <span className="mt-auto flex items-center justify-between pt-3 font-mono text-[11.5px] text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={13} aria-hidden />
            {chapter.estimatedMinutes} min
          </span>
          <span className="font-mono text-[11px] text-[var(--cat)] opacity-0 transition-opacity group-hover:opacity-100">
            Listen / Read →
          </span>
        </span>
      </span>
    </button>
  );
}

// ----------------------------------------------------------------------------
// Main Personalised Learn Screen Dashboard
// ----------------------------------------------------------------------------

function SubjectCard(props: {
  subject: CurriculumSubject;
  standard: number;
  doneCount: number;
  onOpen: () => void;
}) {
  if (props.standard <= 3) {
    return <CosmicSubjectCard {...props} />;
  }
  return <StandardSubjectCard {...props} />;
}

function ChapterCard(props: {
  subject: CurriculumSubject;
  chapter: CurriculumChapter;
  standard?: number;
  done: boolean;
  onOpen: () => void;
}) {
  if (props.standard !== undefined && props.standard <= 3) {
    return <CosmicChapterCard {...props} />;
  }
  return <StandardChapterCard {...props} />;
}

function PersonalisedLearnDashboard({
  band,
  profile,
}: {
  band: Band;
  profile: Profile;
}) {
  const { locale } = useLocale();
  const progress = useProgress();

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [filter, setFilter] = useState<string>("subjects"); // "subjects" | "all" | subject.id
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);

  // Active Standard (fallback to 6)
  const currentStandard = isSupportedStandard(profile.grade) ? profile.grade : 6;
  const isJunior = currentStandard <= 3; // Class 1 to 3 gets cosmic gamified interface!
  const isSenior = currentStandard >= 11;

  // Selected Group Filter for Class 11 and 12 (strictly cs, commerce, or business_maths)
  const [seniorGroupFilter, setSeniorGroupFilter] = useState<SeniorGroupId>(() => {
    if (profile.seniorGroup === "cs" || profile.seniorGroup === "commerce" || profile.seniorGroup === "business_maths") {
      return profile.seniorGroup;
    }
    return "cs";
  });

  // Keep group filter state synchronized with profile
  useEffect(() => {
    if (profile.seniorGroup === "cs" || profile.seniorGroup === "commerce" || profile.seniorGroup === "business_maths") {
      setSeniorGroupFilter(profile.seniorGroup);
    }
  }, [profile.seniorGroup]);

  // All subjects for this standard
  const allStandardSubjects = useMemo(() => getSubjectsForStandard(currentStandard), [currentStandard]);

  // Displayed subjects (strictly filtered by group for Class 11/12)
  const subjects = useMemo(() => {
    if (!isSenior) return allStandardSubjects;
    return filterSubjectsByGroup(allStandardSubjects, seniorGroupFilter || "cs", true);
  }, [isSenior, seniorGroupFilter, allStandardSubjects]);

  // Flattened chapters across displayed subjects
  const allFlatChapters = useMemo(() => {
    return subjects.flatMap((s) => s.chapters.map((ch) => ({ subject: s, chapter: ch })));
  }, [subjects]);

  const totalChapters = allFlatChapters.length;
  const completedChaptersCount = allFlatChapters.filter((item) =>
    progress.lessonsDone.includes(item.chapter.id),
  ).length;

  // Active chapter opened in dialog
  const activeChapterItem = useMemo(() => {
    if (!openChapterId) return null;
    return allFlatChapters.find((item) => item.chapter.id === openChapterId) ?? null;
  }, [openChapterId, allFlatChapters]);

  // Personalised Continue Learning record
  const continueRecord = useMemo((): {
    subject: CurriculumSubject;
    chapter: CurriculumChapter;
    isStarter: boolean;
  } | null => {
    if (profile.lastAccessed && profile.lastAccessed.standard === currentStandard) {
      const data = getChapterById(
        currentStandard,
        profile.lastAccessed.subjectId,
        profile.lastAccessed.chapterId,
      );
      if (data) {
        return {
          subject: data.subject,
          chapter: data.chapter,
          isStarter: false,
        };
      }
    }
    // Fallback: first chapter of first subject
    const first = allFlatChapters[0];
    if (first) {
      return {
        subject: first.subject,
        chapter: first.chapter,
        isStarter: true,
      };
    }
    return null;
  }, [profile.lastAccessed, currentStandard, allFlatChapters]);

  const handleStandardChange = (newStd: number, newGroup?: string) => {
    authService.updateStandard(newStd, newGroup);
    if (newGroup === "cs" || newGroup === "commerce" || newGroup === "business_maths") {
      setSeniorGroupFilter(newGroup);
    }
    setFilter("subjects");
  };

  return (
    <div className={isJunior ? "relative flex flex-col gap-8" : "flex flex-col gap-8"}>
      {/* Standard Selector Modal */}
      <StandardSwitcherModal
        currentGrade={currentStandard}
        currentSeniorGroup={seniorGroupFilter}
        isOpen={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        onSelectStandard={handleStandardChange}
      />

      {isJunior ? (
        // CLASS 1 TO 3: Cosmic Gamified Dashboard
        <>

      {/* Cosmic background doodles */}
      <CosmicBackgroundDoodles />

      {/* [Top Navigation & Header: Class 1-3 Junior Cosmic View] */}
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b border-purple-500/20 pb-7">
        {/* Left Column: Bubbly Neon Title, Laptop Mascot, Subtitle & Action Badges */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[clamp(32px,4.5vw,54px)] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 drop-shadow-[0_0_20px_rgba(244,114,182,0.7)]">
              Digital Learning!
            </h1>
            <LaptopMascot className="size-16 sm:size-20 -mt-2 animate-bounce" />
            <BlastingRocket className="hidden sm:block size-14 -mt-4 animate-pulse" />
          </div>
          <p className="text-sm sm:text-base text-purple-200/90 font-medium">
            Videos, lessons, songs and stories. Read or listen.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Green capsule with seedling / tree icon */}
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-950/70 px-4 py-1.5 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.35)]">
              <Tree size={15} weight="fill" className="text-emerald-400" />
              <span>Seed (Seedlings) - Class 1-3 🌱</span>
            </span>
            {/* Bouncing pink/violet pill */}
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/80 bg-gradient-to-r from-pink-500/25 via-purple-500/30 to-violet-500/25 px-4 py-1.5 font-mono text-xs font-semibold text-pink-200 shadow-[0_0_18px_rgba(244,114,182,0.45)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Change Standard ✏️</span>
            </button>
          </div>
        </div>

        {/* Right Column: Gamified Board-Game Progress Tracker Trail */}
        <div className="flex flex-col items-start lg:items-end gap-1.5">
          <span className="font-mono text-xs uppercase tracking-wider text-purple-200/90 font-bold">
            Progress tracker
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <BoardGameTrailSvg done={completedChaptersCount} total={totalChapters} />
            <HappyStarBadge done={completedChaptersCount} total={totalChapters} />
            <CheeringAstronautKid className="size-20 sm:size-24 -ml-2" />
          </div>
          <p className="font-mono text-xs text-purple-200/90 font-medium">
            {completedChaptersCount === totalChapters
              ? "🌟 All caught up! Class completed!"
              : `${totalChapters - completedChaptersCount} more to complete Class ${currentStandard}!`}
          </p>
        </div>
      </div>

      {/* [The Interactive 2-Column Split: Lesson Adventure Gate + Textbooks & Study Worlds] */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: The Interactive Lesson Gate ("Adventure Gate") (col-span-12 lg:col-span-5) */}
        {continueRecord && (
          <div className="lg:col-span-5 relative overflow-hidden rounded-[28px] border-2 border-violet-500/80 bg-[#160a2f] p-5 sm:p-7 shadow-[0_0_40px_-5px_rgba(168,85,247,0.55),inset_0_0_30px_rgba(168,85,247,0.18)] flex flex-col justify-between">
            {/* Background magical sparkles and cosmic floaters */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
              <span className="absolute top-4 left-6 text-pink-400 text-lg animate-ping">✦</span>
              <span className="absolute top-10 right-8 text-amber-300 text-base animate-pulse">✨</span>
              <span className="absolute bottom-16 left-8 text-cyan-300 text-sm">✦</span>
              <span className="absolute bottom-8 right-16 text-yellow-300 text-base animate-pulse">⭐</span>
            </div>

            <div>
              {/* Title Badge: ✨ IYAL 5: ADVENTURE GATE! ✨ */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/80 bg-gradient-to-r from-pink-500/30 via-purple-500/35 to-violet-500/30 px-3.5 py-1 font-mono text-xs font-bold text-pink-200 shadow-[0_0_15px_rgba(244,114,182,0.45)] animate-pulse">
                  <span>✨</span>
                  <span>IYAL {continueRecord.chapter.chapterNumber}: ADVENTURE GATE!</span>
                  <span>✨</span>
                </span>
                <BookMascot className="size-10 sm:size-12 shrink-0 -mt-1" />
              </div>

              {/* Continue Learning Subtitle */}
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-fuchsia-300 font-extrabold flex items-center gap-1.5">
                <span>🪐</span>
                <span>CONTINUE LEARNING</span>
              </p>

              {/* Chapter Title */}
              <h2 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white mt-1.5 text-balance leading-snug">
                {continueRecord.chapter.title[locale]} - {continueRecord.subject.name[locale]} - Chapter {continueRecord.chapter.chapterNumber}
              </h2>

              {/* Mascot Ensemble Around the Gate */}
              <div className="relative my-5 flex items-center justify-center gap-2 sm:gap-4 py-3 px-2 rounded-2xl bg-[#0f0522]/80 border border-violet-500/30 overflow-hidden">
                <BabyElephantMascot className="size-14 sm:size-18 shrink-0 transform hover:scale-110 transition-transform" />
                <LionCubMascot className="size-12 sm:size-14 shrink-0 transform hover:scale-110 transition-transform" />

                {/* Big Cartoon Circular Interactive Button in the center */}
                <button
                  type="button"
                  onClick={() => setOpenChapterId(continueRecord.chapter.id)}
                  className="group relative flex flex-col items-center justify-center size-24 sm:size-28 shrink-0 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 p-2 text-center text-white shadow-[0_0_30px_rgba(236,72,153,0.85)] hover:shadow-[0_0_45px_rgba(236,72,153,1)] hover:scale-105 active:scale-95 transition-all border-2 border-pink-300"
                >
                  <span className="text-xl sm:text-2xl animate-bounce">⭐</span>
                  <span className="font-display text-[10px] sm:text-[11px] font-black leading-tight text-yellow-200">
                    Tap to Enter & Start Learning!
                  </span>
                  <span className="text-[9px] text-pink-100 font-mono">Click Here!</span>
                </button>

                <KidBoyMascot className="size-12 sm:size-14 shrink-0 transform hover:scale-110 transition-transform" />
                <KidGirlMascot className="size-12 sm:size-14 shrink-0 transform hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Irresistible Oversized 3D-styled Pink & Purple Resume Play Button */}
            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={() => setOpenChapterId(continueRecord.chapter.id)}
                className="w-full inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 px-8 font-display text-base sm:text-lg font-black text-white shadow-[0_0_35px_rgba(236,72,153,0.85)] hover:shadow-[0_0_50px_rgba(236,72,153,1)] hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-pink-300/80 animate-pulse"
              >
                <span>Resume Play!</span>
                <span className="text-xl">➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Right Column: Textbooks + Study Worlds */}
        <div className="lg:col-span-7 flex flex-col gap-5 justify-between">
          {/* Top: Official TN Textbooks */}
          <div className="relative overflow-hidden rounded-[26px] border border-violet-500/40 bg-[#120726]/90 p-4 sm:p-5 shadow-[0_0_25px_-5px_rgba(168,85,247,0.35)]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <TreasureChestMascot className="size-9" />
                <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                  <span>Official TN Textbooks!</span>
                  <span>📚</span>
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <SpacePuppy className="size-7" />
                <SpaceBear className="size-7" />
                <SpaceKitty className="size-7" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <a
                href={TN_NEW_SYLLABUS_2026_27_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-violet-500/60 bg-violet-950/70 px-4 py-2 text-violet-200 hover:border-pink-400 hover:bg-violet-900/80 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
              >
                <span>New Syllabus 2026–27 ✨</span>
              </a>
              <a
                href={TN_TEXTBOOK_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-violet-500/60 bg-violet-950/70 px-4 py-2 text-violet-200 hover:border-pink-400 hover:bg-violet-900/80 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
              >
                <span>TN School Textbooks Portal 🎒</span>
              </a>
              <a
                href={TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-violet-500/60 bg-violet-950/70 px-4 py-2 text-violet-200 hover:border-pink-400 hover:bg-violet-900/80 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
              >
                <span>Class 1, 2, 3 PDF ✨</span>
              </a>
            </div>
          </div>

          {/* Bottom: Choose Your Study Adventure Worlds */}
          <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={22} weight="fill" className="text-cyan-400" />
                <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                  Choose Your Study Adventure! 🌟
                </h3>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-950/80 px-3.5 py-1 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.35)]">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Enrolled: {seniorGroupFilter === "commerce" ? "Commerce Group" : seniorGroupFilter === "business_maths" ? "Business Maths Group" : "Computer Science Group"}
                </span>
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* World 1: Science Quest 🧪 */}
              <button
                type="button"
                onClick={() => {
                  setSeniorGroupFilter("cs");
                  setFilter("subjects");
                  authService.updateStandard(currentStandard, "cs");
                }}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[140px] ${
                  seniorGroupFilter === "cs"
                    ? "border-cyan-400 bg-gradient-to-br from-[#0c2e42] via-[#081c2e] to-[#06121f] shadow-[0_0_30px_-5px_rgba(34,211,238,0.55)]"
                    : "border-cyan-900/50 bg-[#091522]/80 hover:border-cyan-500/60"
                }`}
              >
                <div className="z-10">
                  <h4 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>Science Quest</span>
                    <span>🧪</span>
                  </h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-cyan-100/80">
                    Computer Science, Mathematics, Physics, Chemistry (+ Tamil & English)
                  </p>
                </div>
                <div className="flex items-end justify-between mt-2 pt-1 border-t border-cyan-500/20 z-10">
                  <DinosaurMascot className="size-10 pointer-events-none" />
                  <ComputerMascot className="size-11 pointer-events-none" />
                </div>
              </button>

              {/* World 2: Merchant World 🪙 */}
              <button
                type="button"
                onClick={() => {
                  setSeniorGroupFilter("commerce");
                  setFilter("subjects");
                  authService.updateStandard(currentStandard, "commerce");
                }}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[140px] ${
                  seniorGroupFilter === "commerce"
                    ? "border-blue-400 bg-gradient-to-br from-[#142354] via-[#0f173f] to-[#0a0d2a] shadow-[0_0_30px_-5px_rgba(96,165,250,0.55)]"
                    : "border-blue-900/50 bg-[#0a102b]/80 hover:border-blue-500/60"
                }`}
              >
                <div className="z-10">
                  <h4 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>Merchant World</span>
                    <span>🪙</span>
                  </h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-blue-100/80">
                    Commerce, Accountancy, Economics, Computer Applications (+ Tamil & English)
                  </p>
                </div>
                <div className="flex items-end justify-between mt-2 pt-1 border-t border-blue-500/20 z-10">
                  <TreasureChestMascot className="size-9 pointer-events-none" />
                  <CalculatorMascot className="size-11 pointer-events-none" />
                </div>
              </button>

              {/* World 3: Math Maze 📐 */}
              <button
                type="button"
                onClick={() => {
                  setSeniorGroupFilter("business_maths");
                  setFilter("subjects");
                  authService.updateStandard(currentStandard, "business_maths");
                }}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[140px] ${
                  seniorGroupFilter === "business_maths"
                    ? "border-purple-400 bg-gradient-to-br from-[#2f124d] via-[#1f0b37] to-[#120524] shadow-[0_0_30px_-5px_rgba(192,132,252,0.55)]"
                    : "border-purple-900/50 bg-[#160826]/80 hover:border-purple-500/60"
                }`}
              >
                <div className="z-10">
                  <h4 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>Math Maze</span>
                    <span>📐</span>
                  </h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-purple-100/80">
                    Commerce, Accountancy, Economics, Business Mathematics (+ Tamil & English)
                  </p>
                </div>
                <div className="flex items-end justify-between mt-2 pt-1 border-t border-purple-500/20 z-10">
                  <MathMonsterMascot className="size-10 pointer-events-none" />
                  <RulerMascot className="size-11 pointer-events-none" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* [Footer Navigation: Filter Capsules Row] */}
      <div
        role="radiogroup"
        aria-label="Filter subjects and chapters"
        className="relative z-10 flex items-center gap-2.5 overflow-x-auto pb-3 [scrollbar-width:none]"
      >
        {/* All Subjects */}
        <button
          type="button"
          role="radio"
          aria-checked={filter === "subjects"}
          onClick={() => setFilter("subjects")}
          className={`relative flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all duration-200 ${
            filter === "subjects"
              ? "border-2 border-violet-400 bg-violet-600/35 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              : "border-white/10 bg-[#140828] text-purple-200/80 hover:text-white hover:border-violet-400/60"
          }`}
        >
          <span>All Subjects</span>
          <span className="font-mono text-xs opacity-75">{subjects.length}</span>
          <span className="text-base">🎒</span>
          {filter === "subjects" && (
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-violet-400" />
          )}
        </button>

        {/* All Chapters */}
        <button
          type="button"
          role="radio"
          aria-checked={filter === "all"}
          onClick={() => setFilter("all")}
          className={`relative flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all duration-200 ${
            filter === "all"
              ? "border-2 border-violet-400 bg-violet-600/35 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              : "border-white/10 bg-[#140828] text-purple-200/80 hover:text-white hover:border-violet-400/60"
          }`}
        >
          <span>All Chapters</span>
          <span className="font-mono text-xs opacity-75">{totalChapters}</span>
          <span className="text-base">🌟</span>
          {filter === "all" && (
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-violet-400" />
          )}
        </button>

        {/* Subject Specific Pills */}
        {subjects.map((sub) => {
          const active = filter === sub.id;
          const count = sub.chapters.length;
          const iconEmoji =
            sub.code === "TAM" || sub.id.includes("tamil")
              ? "🐯"
              : sub.code === "ENG" || sub.id.includes("english")
              ? "🦜"
              : sub.code === "MAT" || sub.id.includes("math")
              ? "🍎"
              : sub.code === "PHY" || sub.id.includes("physics")
              ? "🚀"
              : sub.code === "CHE" || sub.id.includes("chem")
              ? "🧪"
              : sub.code === "CS" || sub.id.includes("computer")
              ? "💻"
              : "📚";

          const label = (sub.code === "TAM" || sub.id.includes("tamil"))
            ? `${sub.name[locale]} (பொதுத்தமிழ்)`
            : sub.name[locale];

          return (
            <button
              key={sub.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFilter(sub.id)}
              className={`relative flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "border-2 border-cyan-400 bg-cyan-600/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                  : "border-white/10 bg-[#140828] text-purple-200/80 hover:text-white hover:border-violet-400/60"
              }`}
            >
              <span>{label}</span>
              <span className="font-mono text-xs opacity-75">{count}</span>
              <span className="text-base">{iconEmoji}</span>
              {active && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* The Cards Grid */}
      <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filter === "subjects" &&
          subjects.map((sub, i) => {
            const doneCount = sub.chapters.filter((c) =>
              progress.lessonsDone.includes(c.id),
            ).length;

            return (
              <div key={sub.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <SubjectCard
                  subject={sub}
                  standard={currentStandard}
                  doneCount={doneCount}
                  onOpen={() => setFilter(sub.id)}
                />
              </div>
            );
          })}

        {filter === "all" &&
          allFlatChapters.map((item, i) => {
            const isDone = progress.lessonsDone.includes(item.chapter.id);
            return (
              <div key={item.chapter.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <ChapterCard
                  subject={item.subject}
                  chapter={item.chapter}
                  standard={currentStandard}
                  done={isDone}
                  onOpen={() => setOpenChapterId(item.chapter.id)}
                />
              </div>
            );
          })}

        {filter !== "subjects" &&
          filter !== "all" &&
          (() => {
            const sub = subjects.find((s) => s.id === filter);
            if (!sub) return null;
            return sub.chapters.map((ch, i) => {
              const isDone = progress.lessonsDone.includes(ch.id);
              return (
                <div key={ch.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ChapterCard
                    subject={sub}
                    chapter={ch}
                    standard={currentStandard}
                    done={isDone}
                    onOpen={() => setOpenChapterId(ch.id)}
                  />
                </div>
              );
            });
          })()}
      </div>

        </>
      ) : (
        // CLASS 4 TO 12: Clean Standard Educational Portal
        <>

      {/* 1. Top Row: Progress Ring & Speech Bubble Mascot / Standard Hint */}
      <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface px-5 py-4">
          <ProgressRing done={completedChaptersCount} total={totalChapters} />
          <div>
            <p className="font-mono text-2xl">
              {completedChaptersCount}
              <span className="text-muted">/{totalChapters}</span>
            </p>
            <p className="text-[13px] text-muted">
              {completedChaptersCount === totalChapters ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <Sparkle size={14} weight="fill" aria-hidden />
                  All caught up!
                </span>
              ) : (
                `${totalChapters - completedChaptersCount} more to complete Class ${currentStandard}`
              )}
            </p>
          </div>
        </div>

        {/* Band hint with speech bubble & standard badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-surface px-6 py-4">
          <div className="flex items-center gap-3">
            <GrowthStage band={band} className="size-10 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-violet">
                  Class {currentStandard} · {BAND_INFO[band].name[locale]}
                </span>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-muted">
                  Samacheer Kalvi
                </span>
              </div>
              <p className="text-sm text-text">
                Tap a subject or chapter card below, then listen and read along!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSwitcherOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet-deep/30 px-3.5 py-1.5 font-mono text-xs font-semibold text-violet-ink hover:bg-violet-deep transition-colors"
          >
            <PencilSimple size={13} />
            <span>Change Standard</span>
          </button>
        </div>
      </div>

      {/* 2. Personalised Continue Learning Pointer (if available) */}
      {continueRecord && (
        <div className="relative overflow-hidden rounded-3xl border border-violet/30 bg-gradient-to-r from-violet-deep/20 via-surface to-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet/20 text-violet">
                <ChapterIcon name={resolveChapterIcon(continueRecord.subject, continueRecord.chapter)} className="size-7" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-violet">
                  {continueRecord.isStarter ? "Start your first lesson" : "Continue Learning"}
                </p>
                <h3 className="font-display text-lg font-bold text-text">
                  {continueRecord.chapter.title[locale]}
                </h3>
                <p className="text-xs text-muted">
                  {continueRecord.subject.name[locale]} · Chapter {continueRecord.chapter.chapterNumber}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpenChapterId(continueRecord.chapter.id)}
              className="beam-border inline-flex h-11 items-center gap-2 rounded-full bg-violet-deep px-5 font-mono text-xs font-semibold text-violet-ink transition-transform hover:-translate-y-0.5"
            >
              {continueRecord.isStarter ? "Start Lesson →" : "Resume →"}
            </button>
          </div>
        </div>
      )}

      {/* 3. Official Tamil Nadu Textbooks Reference Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <FilePdf size={18} weight="duotone" className="shrink-0 text-violet" />
          <span className="font-mono text-xs text-muted">Official TN Textbooks:</span>
          <span className="rounded-full bg-violet/15 px-2.5 py-0.5 font-mono text-[11px] text-violet-ink">
            New Syllabus 2026–27
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <a
            href={TN_NEW_SYLLABUS_2026_27_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet-deep/30 px-3.5 py-1 text-violet-ink hover:bg-violet-deep transition-colors"
          >
            <span>New Syllabus 2026–27 (Tnkalvi.net)</span>
            <ArrowSquareOut size={12} />
          </a>
          <a
            href={TN_TEXTBOOK_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-muted hover:border-line-strong hover:text-text transition-colors"
          >
            <span>TN School Textbooks Portal</span>
            <ArrowSquareOut size={12} />
          </a>
          <a
            href={TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-muted hover:border-line-strong hover:text-text transition-colors"
          >
            <span>Class 1, 2, 3 PDF</span>
            <ArrowSquareOut size={12} />
          </a>
        </div>
      </div>

      {/* Higher Secondary Group Selector (Class 11 & 12) */}
      {isSenior && (
        <div className="rounded-3xl border border-teal/40 bg-teal/[0.04] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-teal/20 text-teal">
                <GraduationCap size={18} weight="fill" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-text">
                  {locale === "ta"
                    ? "மேல்நிலைப் பிரிவு பாடங்கள் (Class 11 & 12 Streams)"
                    : "Higher Secondary Stream Groups"}
                </h3>
                <p className="text-xs text-muted">
                  {locale === "ta"
                    ? "தமிழ்நாடு மாநிலப் பாடத்திட்டத்தின் முக்கியப் பாடப்பிரிவுகள்"
                    : "Tamil Nadu Samacheer Kalvi standard-wise group tracks"}
                </p>
              </div>
            </div>

            {profile.seniorGroup && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/15 px-3 py-1 font-mono text-[11px] text-teal">
                <span className="size-1.5 rounded-full bg-teal" />
                <span>Enrolled: {getSeniorGroup(profile.seniorGroup)?.name[locale] ?? profile.seniorGroup}</span>
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {SENIOR_GROUPS.map((grp) => {
              const active = seniorGroupFilter === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    setSeniorGroupFilter(grp.id);
                    setFilter("subjects");
                    authService.updateStandard(currentStandard, grp.id);
                  }}
                  style={{ "--grp": grp.accent } as React.CSSProperties}
                  className={`flex flex-col rounded-2xl border p-3.5 text-left transition-all ${
                    active
                      ? "border-[var(--grp)] bg-[color-mix(in_srgb,var(--grp)_18%,var(--surface))] shadow-[0_0_20px_-5px_var(--grp)] font-medium"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:bg-white/[0.04] hover:text-text"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] font-semibold text-[var(--grp)]">{grp.badge}</span>
                    {active && <CheckCircle size={15} weight="fill" className="text-[var(--grp)]" />}
                  </div>
                  <span className="font-display text-sm font-bold text-text mt-1.5 line-clamp-1">
                    {grp.name[locale]}
                  </span>
                  <span className="text-[11.5px] text-muted line-clamp-2 mt-1">
                    {grp.description[locale]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Filter Capsules: All Subjects vs All Chapters vs Individual Subject */}
      <div
        role="radiogroup"
        aria-label="Filter subjects and chapters"
        className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none]"
      >
        <button
          type="button"
          role="radio"
          aria-checked={filter === "subjects"}
          onClick={() => setFilter("subjects")}
          className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 font-mono text-xs transition-colors ${
            filter === "subjects"
              ? "border-violet bg-violet-deep text-violet-ink"
              : "border-line bg-surface text-muted hover:text-text"
          }`}
        >
          <span>All Subjects</span>
          <span className="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[10px]">
            {subjects.length}
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={filter === "all"}
          onClick={() => setFilter("all")}
          className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 font-mono text-xs transition-colors ${
            filter === "all"
              ? "border-violet bg-violet-deep text-violet-ink"
              : "border-line bg-surface text-muted hover:text-text"
          }`}
        >
          <span>All Chapters</span>
          <span className="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[10px]">
            {totalChapters}
          </span>
        </button>

        {subjects.map((sub) => {
          const active = filter === sub.id;
          const count = sub.chapters.length;
          return (
            <button
              key={sub.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFilter(sub.id)}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 font-mono text-xs transition-colors ${
                active
                  ? "border-[var(--cat)] bg-[color-mix(in_srgb,var(--cat)_15%,transparent)] text-[var(--cat)]"
                  : "border-line bg-surface text-muted hover:text-text"
              }`}
              style={{ "--cat": sub.accent } as React.CSSProperties}
            >
              <span>{sub.name[locale]}</span>
              <span className="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[10px]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* The Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filter === "subjects" &&
          subjects.map((sub, i) => {
            const doneCount = sub.chapters.filter((c) =>
              progress.lessonsDone.includes(c.id),
            ).length;

            return (
              <div key={sub.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <SubjectCard
                  subject={sub}
                  standard={currentStandard}
                  doneCount={doneCount}
                  onOpen={() => setFilter(sub.id)}
                />
              </div>
            );
          })}

        {filter === "all" &&
          allFlatChapters.map((item, i) => {
            const isDone = progress.lessonsDone.includes(item.chapter.id);
            return (
              <div key={item.chapter.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <ChapterCard
                  subject={item.subject}
                  chapter={item.chapter}
                  standard={currentStandard}
                  done={isDone}
                  onOpen={() => setOpenChapterId(item.chapter.id)}
                />
              </div>
            );
          })}

        {filter !== "subjects" &&
          filter !== "all" &&
          (() => {
            const sub = subjects.find((s) => s.id === filter);
            if (!sub) return null;
            return sub.chapters.map((ch, i) => {
              const isDone = progress.lessonsDone.includes(ch.id);
              return (
                <div key={ch.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ChapterCard
                    subject={sub}
                    chapter={ch}
                    standard={currentStandard}
                    done={isDone}
                    onOpen={() => setOpenChapterId(ch.id)}
                  />
                </div>
              );
            });
          })()}
      </div>

        </>
      )}

      {/* Interactive Lesson Dialog (Reader & Quiz) */}
      <CurriculumLessonDialog
        standard={currentStandard}
        subject={activeChapterItem?.subject ?? null}
        chapter={activeChapterItem?.chapter ?? null}
        allChapters={allFlatChapters}
        onClose={() => setOpenChapterId(null)}
        onSelectChapter={(chId) => setOpenChapterId(chId)}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Exported Component: Module 1 LearnScreen
// ----------------------------------------------------------------------------
export function LearnScreen({ band }: { band: Band }) {
  const { profile } = useProgress();
  const hydrated = useHydrated();

  // If not signed in or hydrated:
  if (!hydrated) {
    return <div aria-hidden className="h-96 animate-pulse rounded-3xl border border-line bg-surface/60" />;
  }

  if (!profile) {
    return (
      <div className="rounded-[28px] border border-line bg-surface/80 p-6 text-center sm:p-12">
        <h2 className="font-display text-3xl font-bold">Please complete your student profile</h2>
        <p className="mt-2 text-sm text-muted">
          Select your school standard (Class 1 to Class 12) to access your personalised curriculum.
        </p>
        <div className="mt-6">
          <Link
            href="/sign-in?redirect=/m/learn"
            className="beam-border inline-flex h-12 items-center gap-2 rounded-full bg-violet-deep px-6 font-mono text-xs text-violet-ink"
          >
            Create Profile & Choose Standard →
          </Link>
        </div>
      </div>
    );
  }

  return <PersonalisedLearnDashboard band={band} profile={profile} />;
}

export default LearnScreen;
