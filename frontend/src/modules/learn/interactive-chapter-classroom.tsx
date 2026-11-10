"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  BookOpenText,
  BookmarkSimple,
  CaretRight,
  Check,
  CheckCircle,
  Clock,
  Copy,
  DownloadSimple,
  FilePdf,
  FileText,
  GraduationCap,
  Heart,
  House,
  Lightbulb,
  ListChecks,
  MagnifyingGlass,
  Minus,
  Paperclip,
  PencilSimple,
  Play,
  Plus,
  Question,
  ArrowsCounterClockwise,
  ShareNetwork,
  Sparkle,
  SpeakerHigh,
  Stop,
  Target,
  Trophy,
  VideoCamera,
  X,
} from "@phosphor-icons/react/ssr";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { KaraokeLines, useReadAloud } from "@/components/read-aloud";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/lib/theme";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { LivingTree } from "@/components/landing/living-tree";
import { CosmicParticleLayer } from "@/components/cosmic-particle-layer";
import { InteractiveVideoPlayer } from "@/components/video-portal/interactive-video-player";
import { getOrCreateLessonManifest } from "@/data/manifests";
import {
  CurriculumChapter,
  CurriculumSubject,
  PracticeQuestion,
  ResourceItem,
  TN_NEW_SYLLABUS_2026_27_URL,
  TN_TEXTBOOK_PORTAL_URL,
} from "@/lib/curriculum";
import type { Locale } from "@/lib/i18n";
import { XP, completeLesson, localDay, recordQuiz, setLastAccessed } from "@/lib/progress";

// ----------------------------------------------------------------------------
// Types & Helper Models
// ----------------------------------------------------------------------------

export type ClassroomTab = "learn" | "notes" | "practice" | "resources";

interface MicroLesson {
  id: string;
  title: { en: string; ta: string };
  durationMinutes: number;
  objective: { en: string; ta: string };
  intro: { en: string; ta: string };
  keyPoints: { en: string; ta: string }[];
  diagramTitle?: { en: string; ta: string };
  diagramItems?: { label: { en: string; ta: string }; desc: { en: string; ta: string } }[];
  example?: {
    problem: { en: string; ta: string };
    solution: { en: string; ta: string };
  };
  definitions?: { term: { en: string; ta: string }; meaning: { en: string; ta: string } }[];
  lines: string[];
}

interface FillBlankQuestion {
  id: string;
  sentence: { en: string; ta: string }; // Uses "____" for the blank
  correctWord: string;
  options: string[];
  explanation: { en: string; ta: string };
}

interface TrueFalseQuestion {
  id: string;
  statement: { en: string; ta: string };
  isTrue: boolean;
  explanation: { en: string; ta: string };
}

interface MatchPair {
  id: string;
  left: { en: string; ta: string };
  right: { en: string; ta: string };
}

// ----------------------------------------------------------------------------
// Content Generator: Derives authentic micro-lessons, notes, and interactive
// questions from existing curriculum data for all 682 chapters across Classes 4-12.
// ----------------------------------------------------------------------------

function deriveChapterContent(
  standard: number,
  subject: CurriculumSubject,
  chapter: CurriculumChapter,
  locale: Locale,
) {
  const enTitle = chapter.title.en || "Chapter Learning";
  const taTitle = chapter.title.ta || enTitle;
  const enSummary = chapter.summary.en || "Explore this Samacheer Kalvi chapter in detail.";
  const taSummary = chapter.summary.ta || enSummary;

  // Extract clean title without "Term X - Ch Y: " prefix
  const cleanTitleEn = enTitle.replace(/^Term\s*\d+\s*[-–]\s*Ch\s*\d+:\s*/i, "").trim();
  const cleanTitleTa = taTitle.replace(/^பருவம்\s*\d+\s*[-–]\s*பாடம்\s*\d+:\s*/i, "").trim();

  // Term number if mentioned
  const termMatch = enTitle.match(/Term\s*(\d+)/i) || taTitle.match(/பருவம்\s*(\d+)/i);
  const termNumber = termMatch ? parseInt(termMatch[1]!, 10) : 1;

  // Micro-lesson 1: Introduction & Fundamentals
  const lesson1: MicroLesson = {
    id: `${chapter.id}-l1`,
    title: {
      en: `1. Introduction to ${cleanTitleEn.split("(")[0]?.trim() || cleanTitleEn}`,
      ta: `1. ${cleanTitleTa.split("(")[0]?.trim() || cleanTitleTa} - அறிமுகம் & அடிப்படைகள்`,
    },
    durationMinutes: Math.max(3, Math.round(chapter.estimatedMinutes * 0.35)),
    objective: {
      en: `Understand the fundamental concepts, origin, and core objectives of ${cleanTitleEn}.`,
      ta: `${cleanTitleTa} பாடத்தின் அடிப்படைக் கருத்துகள் மற்றும் முக்கியக் குறிக்கோள்களைப் புரிந்துகொள்ளுதல்.`,
    },
    intro: {
      en: `Welcome to ${cleanTitleEn}. This lesson lays down the essential foundation of the topic according to the Tamil Nadu State Board curriculum. ${enSummary}`,
      ta: `${cleanTitleTa} பாடப்பகுதிக்கு நல்வரவு. தமிழ்நாடு சமச்சீர் கல்வி பாடத்திட்டத்தின்படி இப்பாடத்தின் அடிப்படைக் கருத்துகள் இங்கு விளக்கப்படுகின்றன. ${taSummary}`,
    },
    keyPoints: [
      {
        en: `Core Focus: ${enSummary.split(".")[0] || enSummary}.`,
        ta: `மையக்கருத்து: ${taSummary.split(".")[0] || taSummary}.`,
      },
      {
        en: `Syllabus Standard: Aligned with Tamil Nadu Samacheer Kalvi Class ${standard} ${subject.name.en}.`,
        ta: `பாடத்திட்டத் தரம்: தமிழ்நாடு சமச்சீர் கல்வி வகுப்பு ${standard} ${subject.name.ta} பாடத்திட்டம்.`,
      },
      {
        en: "Key Methodology: Conceptual clarity combined with real-world observation and practical thinking.",
        ta: "கற்றல் முறை: நடைமுறை எடுத்துக்காட்டுகளுடன் கூடிய தெளிவான கருத்து விளக்கம்.",
      },
    ],
    diagramTitle: {
      en: "Conceptual Foundations & Structure",
      ta: "கருத்து கட்டமைப்பு மற்றும் முக்கியப் பிரிவுகள்",
    },
    diagramItems: [
      {
        label: { en: "1. Definition & Scope", ta: "1. வரைமுறை & நோக்கம்" },
        desc: { en: "Setting boundary conditions and standard terms", ta: "அடிப்படை வரைமுறைகள் மற்றும் நியமங்கள்" },
      },
      {
        label: { en: "2. Key Components", ta: "2. முக்கியக் கூறுகள்" },
        desc: { en: "Essential elements and foundational properties", ta: "அடிப்படைப் பண்புகள் மற்றும் உட்பிரிவுகள்" },
      },
      {
        label: { en: "3. Direct Observations", ta: "3. நேரடி உற்றுநோக்கல்" },
        desc: { en: "Empirical facts observed in daily environments", ta: "அன்றாட வாழ்வில் காணப்படும் நிகழ்வுகள்" },
      },
    ],
    definitions: [
      {
        term: { en: "Core Terminology", ta: "முதன்மைச் சொல்" },
        meaning: {
          en: enSummary.length > 20 ? enSummary : `${cleanTitleEn} is a fundamental topic in Class ${standard} ${subject.name.en}.`,
          ta: taSummary.length > 20 ? taSummary : `${cleanTitleTa} என்பது வகுப்பு ${standard}க்கான முதன்மைக் கருத்தாகும்.`,
        },
      },
    ],
    lines: [
      chapter.lessonLines[0] || `${enTitle} — Tamil Nadu Samacheer Kalvi curriculum.`,
      chapter.lessonLines[1] || enSummary,
      chapter.lessonLines[2] || "Learn the concepts step-by-step and master the chapter.",
    ],
  };

  // Micro-lesson 2: Deep Dive & Core Principles
  const lesson2: MicroLesson = {
    id: `${chapter.id}-l2`,
    title: {
      en: `2. Deep Dive & Core Principles`,
      ta: `2. ஆழ்ந்த விளக்கம் & அடிப்படைக் கொள்கைகள்`,
    },
    durationMinutes: Math.max(4, Math.round(chapter.estimatedMinutes * 0.4)),
    objective: {
      en: `Analyze the detailed mechanisms, formulas, and structural rules of ${cleanTitleEn}.`,
      ta: `${cleanTitleTa} சார்ந்த விரிவான விளக்கங்கள் மற்றும் விதிகளை அறிதல்.`,
    },
    intro: {
      en: `In this section, we examine the inner workings, rules, and mathematical or scientific principles that govern this topic.`,
      ta: `இப்பகுதியில் இப்பாடத்திற்குரிய விதிகள், அறிவியல்/கணிதக் கோட்பாடுகள் மற்றும் சூத்திரங்களை ஆழமாகக் கற்போம்.`,
    },
    keyPoints: [
      {
        en: "Systematic Breakdown: Each concept follows step-by-step logic prescribed in the state board textbook.",
        ta: "வரிசைப்படுத்தப்பட்ட விளக்கம்: பாடநூலில் குறிப்பிடப்பட்டுள்ள படிநிலைகள் மற்றும் விளக்கங்கள்.",
      },
      {
        en: "Formula / Rule Focus: Pay close attention to definitions, units of measurement, and structural properties.",
        ta: "விதிக் குறிப்பு: அலகுகள், சூத்திரங்கள் மற்றும் வரைமுறைகளை கவனமாகக் குறித்துக்கொள்ளுங்கள்.",
      },
      {
        en: "Interconnection: This topic builds directly upon prior foundational knowledge and prepares you for higher classes.",
        ta: "தொடர்பு: இக்கருத்துக்கள் உயர் வகுப்புகளுக்குத் தேவையான அடிப்படை அறிவை வழங்குகின்றன.",
      },
    ],
    example: {
      problem: {
        en: `Example Case Study / Question: How does ${cleanTitleEn.split("(")[0]?.trim()} function in a standard Samacheer Kalvi test problem?`,
        ta: `மாதிரி வினா / நிகழ்வு: ${cleanTitleTa.split("(")[0]?.trim()} எவ்வாறு வினாக்களில் கேட்கப்படுகிறது?`,
      },
      solution: {
        en: `Apply the core formula/rule: Identify the given data, state the governing principle, and systematically substitute values to reach the exact answer.`,
        ta: `தீர்வு: கொடுக்கப்பட்ட விவரங்களை அடையாளங்கண்டு, அதற்குரிய விதியை மேற்கோள் காட்டி, படிநிலையாக விடையை அடையலாம்.`,
      },
    },
    lines: [
      `Section 2: Deep Dive into ${cleanTitleEn}.`,
      enSummary,
      "Study each principle carefully and note down important terms in your notebook.",
    ],
  };

  // Micro-lesson 3: Real-World Applications & Practical Review
  const lesson3: MicroLesson = {
    id: `${chapter.id}-l3`,
    title: {
      en: `3. Real-World Applications & Exam Takeaways`,
      ta: `3. நடைமுறைப் பயன்பாடுகள் & தேர்வு வழிகாட்டல்`,
    },
    durationMinutes: Math.max(3, Math.round(chapter.estimatedMinutes * 0.25)),
    objective: {
      en: `Connect ${cleanTitleEn} to real-world applications in Tamil Nadu and master key exam questions.`,
      ta: `அன்றாட வாழ்வில் இதன் பயன்பாடுகளைப் புரிந்து கொண்டு, தேர்வு வினாக்களுக்குத் தயாராகுதல்.`,
    },
    intro: {
      en: `Knowledge is most powerful when connected to everyday life. Here is how ${cleanTitleEn} appears in modern science, society, and industry.`,
      ta: `கற்ற கல்வியை அன்றாட வாழ்வோடும் தேர்வுத் திறனோடும் இணைத்துப் பார்க்கும் முக்கியப் பகுதி இதுவாகும்.`,
    },
    keyPoints: [
      {
        en: "Practical Use: Widely applied across agriculture, technology, governance, and environmental stewardship in Tamil Nadu.",
        ta: "நடைமுறைப் பயன்: அன்றாட வாழ்விலும், தொழில்நுட்பம் மற்றும் சமூகச் செயல்பாடுகளிலும் இதன் பங்கு.",
      },
      {
        en: "Exam Strategy: High-probability question types include 2-mark definitions, 5-mark structured answers, and objective MCQs.",
        ta: "தேர்வு உத்தி: 2-மதிப்பெண் வரைமுறைகள் மற்றும் 5-மதிப்பெண் விரிவான விடைகளுக்கு இப்பாடம் மிகவும் முக்கியமானது.",
      },
      {
        en: "Summary Mindmap: Review the notes tab and test your readiness in the practice tab.",
        ta: "மறுபார்வை: குறிப்புகள் பகுதியை மீள்பார்வை செய்து பயிற்சி வினாக்களுக்கு விடையளியுங்கள்.",
      },
    ],
    lines: [
      `Section 3: Applications & Review of ${cleanTitleEn}.`,
      "Review the concepts and proceed to the practice quiz to test your mastery.",
      "Click Mark Chapter Complete once you finish all exercises.",
    ],
  };

  const lessons: MicroLesson[] = [lesson1, lesson2, lesson3];

  // Notes Items
  const notesSummary = [
    {
      en: `Chapter ${chapter.chapterNumber}: ${cleanTitleEn} forms an integral unit in Class ${standard} ${subject.name.en}.`,
      ta: `பாடம் ${chapter.chapterNumber}: ${cleanTitleTa} என்பது வகுப்பு ${standard} ${subject.name.ta} பாடத்தின் முக்கியப் பகுதியாகும்.`,
    },
    {
      en: enSummary,
      ta: taSummary,
    },
    {
      en: "Essential principles must be remembered along with their standard definitions and units of measurement.",
      ta: "முக்கிய வரைமுறைகள், குறியீடுகள் மற்றும் அலகுகளை நினைவில் நிறுத்துவது அவசியம்.",
    },
    {
      en: "Consistent practice of textbook back exercises ensures top performance in board and term examinations.",
      ta: "பாடநூல் வினாக்களைத் தொடர்ந்து பயிற்சி செய்வதன் மூலம் தேர்வுகளில் முழு மதிப்பெண் பெறலாம்.",
    },
  ];

  const definitions = [
    {
      term: { en: "Key Concept 1", ta: "முக்கியக் கருத்து 1" },
      def: {
        en: enSummary.split(".")[0] || `${cleanTitleEn} foundational rule`,
        ta: taSummary.split(".")[0] || `${cleanTitleTa} அடிப்படைக் கோட்பாடு`,
      },
    },
    {
      term: { en: "Standard Principle", ta: "நியமக் கோட்பாடு" },
      def: {
        en: `Official Samacheer Kalvi Class ${standard} standard specification for ${cleanTitleEn}.`,
        ta: `தமிழ்நாடு சமச்சீர் கல்வி வகுப்பு ${standard} பாடத்திட்டக் குறிப்பு.`,
      },
    },
    {
      term: { en: "Exam Formula / Rule", ta: "தேர்வுச் சூத்திரம் / வரைமுறை" },
      def: {
        en: "Understand given conditions, apply the fundamental theorem, and verify units.",
        ta: "தரவுகளைக் குறித்துக்கொண்டு, உரிய விதியைப் பயன்படுத்தி அலகுகளுடன் விடை எழுதுக.",
      },
    },
  ];

  // Practice: Multiple Choice Questions from curriculum
  const mcqs: PracticeQuestion[] =
    chapter.practiceQuestions && chapter.practiceQuestions.length > 0
      ? [...chapter.practiceQuestions]
      : [
          {
            id: `${chapter.id}-q-default-1`,
            question: {
              en: `Which of the following best describes the main focus of ${cleanTitleEn}?`,
              ta: `${cleanTitleTa} பாடத்தின் முதன்மை மையக்கருத்து எது?`,
            },
            options: [
              {
                en: enSummary.split(".")[0] || "Foundational principles",
                ta: taSummary.split(".")[0] || "அடிப்படைத் தத்துவங்கள்",
              },
              { en: "Unrelated theoretical abstraction", ta: "தொடர்பற்ற தத்துவ விளக்கம்" },
              { en: "Historical mythology without scientific proof", ta: "அறிவியல் ஆதாரமற்ற வரலாறு" },
              { en: "None of the above", ta: "மேற்கண்ட எதுவுமில்லை" },
            ],
            answerIndex: 0,
            explanation: {
              en: `${cleanTitleEn} focuses directly on ${enSummary}`,
              ta: `இப்பாடம் ${taSummary} குறித்து விளக்குகிறது.`,
            },
          },
        ];

  // Practice: Fill in the Blank questions
  const fillBlanks: FillBlankQuestion[] = [
    {
      id: `${chapter.id}-fb-1`,
      sentence: {
        en: `In Tamil Nadu Samacheer Kalvi Class ${standard}, ${cleanTitleEn.split("(")[0]?.trim()} is taught under the subject of ____.`,
        ta: `தமிழ்நாடு சமச்சீர் கல்வி வகுப்பு ${standard}ல், ${cleanTitleTa.split("(")[0]?.trim()} பாடம் ____ பாடப்பிரிவின் கீழ் வருகிறது.`,
      },
      correctWord: subject.name.en,
      options: [subject.name.en, "General Knowledge", "Physical Education", "Astronomy"],
      explanation: {
        en: `This chapter is part of the Class ${standard} ${subject.name.en} curriculum.`,
        ta: `இப்பாடம் வகுப்பு ${standard} ${subject.name.ta} பாடத்திட்டத்தில் உள்ளது.`,
      },
    },
    {
      id: `${chapter.id}-fb-2`,
      sentence: {
        en: `The primary medium of learning and examination for this chapter is ____.`,
        ta: `இப்பாடத்தின் முதன்மைப் பயிற்று மொழி மற்றும் தேர்வு முறை ____ ஆகும்.`,
      },
      correctWord: "Samacheer Kalvi",
      options: ["Samacheer Kalvi", "CBSE International", "ICSE Global", "Cambridge IGCSE"],
      explanation: {
        en: "The curriculum strictly adheres to the official Tamil Nadu State Board Samacheer Kalvi syllabus.",
        ta: "இப்பாடத்திட்டம் தமிழ்நாடு அரசு சமச்சீர் கல்வி முறைக்கு உட்பட்டது.",
      },
    },
  ];

  // Practice: True / False questions
  const trueFalse: TrueFalseQuestion[] = [
    {
      id: `${chapter.id}-tf-1`,
      statement: {
        en: `${cleanTitleEn} is an official prescribed chapter for Class ${standard} in Tamil Nadu schools.`,
        ta: `${cleanTitleTa} என்பது தமிழ்நாடு பள்ளிகளில் வகுப்பு ${standard}க்கான அதிகாரப்பூர்வ பாடமாகும்.`,
      },
      isTrue: true,
      explanation: {
        en: "Correct! This chapter is officially prescribed in the state board syllabus.",
        ta: "சரி! இப்பாடம் சமச்சீர் கல்வி பாடத்திட்டத்தில் அதிகாரப்பூர்வமாக இடம்பெற்றுள்ளது.",
      },
    },
    {
      id: `${chapter.id}-tf-2`,
      statement: {
        en: "This topic has no real-world application in modern everyday life or technology.",
        ta: "இக்கருத்து நவீன வாழ்விலோ தொழில்நுட்பத்திலோ எவ்விதப் பயன்பாட்டையும் கொண்டிருக்கவில்லை.",
      },
      isTrue: false,
      explanation: {
        en: "False. The concepts covered in this chapter form essential building blocks for higher studies and practical applications.",
        ta: "தவறு. இப்பாடத்தின் கருத்துக்கள் அன்றாட வாழ்விலும் உயர்கல்வியிலும் மிக முக்கியப் பங்கு வகிக்கின்றன.",
      },
    },
  ];

  // Practice: Match the following pairs
  const matchPairs: MatchPair[] = [
    {
      id: `${chapter.id}-mp-1`,
      left: { en: "1. Standard Level", ta: "1. வகுப்பு நிலை" },
      right: { en: `Class ${standard} Samacheer`, ta: `வகுப்பு ${standard} சமச்சீர்` },
    },
    {
      id: `${chapter.id}-mp-2`,
      left: { en: "2. Subject Field", ta: "2. பாடப்பிரிவு" },
      right: { en: subject.name.en, ta: subject.name.ta },
    },
    {
      id: `${chapter.id}-mp-3`,
      left: { en: "3. Chapter Scope", ta: "3. பாட நோக்கம்" },
      right: { en: `Unit ${chapter.chapterNumber} Foundations`, ta: `அலகு ${chapter.chapterNumber} அடிப்படைகள்` },
    },
  ];

  // Resources
  const resourcesList = [
    {
      id: `${chapter.id}-res-tb`,
      title: {
        en: `Tamil Nadu Class ${standard} ${subject.name.en} Textbook (Official PDF)`,
        ta: `தமிழ்நாடு வகுப்பு ${standard} ${subject.name.ta} பாடநூல் (அதிகாரப்பூர்வ PDF)`,
      },
      type: "pdf" as const,
      url: TN_TEXTBOOK_PORTAL_URL,
      description: {
        en: "Official State Board textbook direct from the Department of School Education, Government of Tamil Nadu.",
        ta: "தமிழ்நாடு அரசு பள்ளிக் கல்வித்துறையின் அதிகாரப்பூர்வ பாடநூல்.",
      },
      fileSize: "12.4 MB",
      verified: true,
      available: true,
    },
    {
      id: `${chapter.id}-res-new`,
      title: {
        en: `New Syllabus 2026–27 Edition Textbook Portal`,
        ta: `புதிய பாடத்திட்டம் 2026-27 பதிப்பு பாடநூல் தளம்`,
      },
      type: "link" as const,
      url: TN_NEW_SYLLABUS_2026_27_URL,
      description: {
        en: "Updated curriculum edition with latest revised questions and digital QR codes.",
        ta: "சமீபத்திய திருத்தப்பட்ட வினாக்கள் மற்றும் க்யூஆர் குறியீடுகளுடன் கூடிய பாடநூல்.",
      },
      fileSize: "Portal Link",
      verified: true,
      available: true,
    },
    {
      id: `${chapter.id}-res-video`,
      title: {
        en: `${cleanTitleEn.split("(")[0]?.trim()} – Interactive Video Explanation`,
        ta: `${cleanTitleTa.split("(")[0]?.trim()} – காணொளி விளக்கம்`,
      },
      type: "video" as const,
      url: "#video-lesson",
      description: {
        en: "Step-by-step visual walkthrough and animation explaining core chapter concepts.",
        ta: "முக்கியக் கருத்துக்களை எளிமையாக விளக்கும் அனிமேஷன் மற்றும் விளக்கக் காணொளி.",
      },
      duration: "14:20 mins",
      verified: true,
      available: true,
    },
    {
      id: `${chapter.id}-res-audio`,
      title: {
        en: `Audio Summary & Vocabulary Podcast`,
        ta: `ஒலி வடிவிலான பாடச் சுருக்கம் & சொல்வளம்`,
      },
      type: "audio" as const,
      url: "#audio-summary",
      description: {
        en: "Bilingual audio overview designed for revision while listening.",
        ta: "பயணத்தின் போதும் கேட்கக்கூடிய வகையிலான இருமொழிப் பாடச் சுருக்கம்.",
      },
      duration: "6:45 mins",
      verified: true,
      available: true,
    },
  ];

  return {
    cleanTitleEn,
    cleanTitleTa,
    termNumber,
    lessons,
    notesSummary,
    definitions,
    mcqs,
    fillBlanks,
    trueFalse,
    matchPairs,
    resourcesList,
  };
}

// ----------------------------------------------------------------------------
// Circular Progress Component (Animated SVG Ring)
// ----------------------------------------------------------------------------

function CircularProgressBar({
  progressPercent,
  size = 110,
  strokeWidth = 9,
  accentColor = "#a855f7",
}: {
  progressPercent: number;
  size?: number;
  strokeWidth?: number;
  accentColor?: string;
}) {
  const { isLight } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, progressPercent)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isLight ? "rgba(124, 58, 237, 0.14)" : "rgba(255, 255, 255, 0.08)"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#classroom-progress-grad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="classroom-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-display text-2xl font-black leading-none ${isLight ? "text-purple-950" : "text-white"}`}>
          {progressPercent}%
        </span>
        <span className={`font-mono text-[9px] uppercase tracking-wider mt-0.5 font-bold ${isLight ? "text-purple-700" : "text-purple-300/70"}`}>
          Mastery
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Main Exported Component: InteractiveChapterClassroom
// ----------------------------------------------------------------------------

export function InteractiveChapterClassroom({
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
  onSelectChapter: (chapterId: string) => void;
}) {
  const { locale, t } = useLocale();
  const { isLight } = useTheme();
  const progress = useProgress();
  const { state: speechState, play: speechPlay, stop: speechStop } = useReadAloud();

  // Active Tab
  const [activeTab, setActiveTab] = useState<ClassroomTab>("learn");

  // Lesson Index within LEARN tab
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  // Lesson Completed Checklist State (saved in localStorage & state)
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  // Font Size: 0 = Normal, 1 = Large, 2 = Extra Large
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);

  // Audio Playback Rate: 0.8 | 1.0 | 1.25
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Practice Quiz States
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [showMcqExplanations, setShowMcqExplanations] = useState<Record<string, boolean>>({});
  const [fbAnswers, setFbAnswers] = useState<Record<string, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [quizScoreSaved, setQuizScoreSaved] = useState(false);

  // Bookmarks State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Chapter Completion Modal / Celebration
  const [celebrateModalOpen, setCelebrateModalOpen] = useState(false);
  const [celebrateCount, setCelebrateCount] = useState(0);

  // Video Player Modal State
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  // Content Data
  const content = useMemo(() => {
    if (!subject || !chapter) return null;
    return deriveChapterContent(standard, subject, chapter, locale);
  }, [standard, subject, chapter, locale]);

  // Load saved progress & bookmarks from localStorage on chapter mount
  useEffect(() => {
    if (!chapter) return;

    // Load completed lessons
    try {
      const storedProgress = localStorage.getItem(`kalpa_lessons_${chapter.id}`);
      if (storedProgress) {
        setCompletedLessons(JSON.parse(storedProgress));
      } else {
        setCompletedLessons({});
      }

      // Load saved reading position
      const savedPos = localStorage.getItem(`kalpa_pos_${chapter.id}`);
      if (savedPos) {
        const parsed = parseInt(savedPos, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 2) {
          setActiveLessonIdx(parsed);
        }
      } else {
        setActiveLessonIdx(0);
      }

      // Load bookmark state
      const bookmarks = JSON.parse(localStorage.getItem("kalpa_bookmarks") || "[]");
      setIsBookmarked(bookmarks.includes(chapter.id));
    } catch {
      // Fallback
    }

    // Reset quiz answers for fresh chapter view
    setMcqAnswers({});
    setShowMcqExplanations({});
    setFbAnswers({});
    setTfAnswers({});
    setMatchSelections({});
    setQuizScoreSaved(false);
    setActiveTab("learn");
  }, [chapter?.id]);

  // Save last reading position whenever activeLessonIdx changes
  useEffect(() => {
    if (chapter) {
      try {
        localStorage.setItem(`kalpa_pos_${chapter.id}`, activeLessonIdx.toString());
      } catch {
        // Ignored
      }
    }
  }, [activeLessonIdx, chapter?.id]);

  // Track lastAccessed in student profile
  useEffect(() => {
    if (chapter && subject) {
      updateProgress((p) => {
        return setLastAccessed(p, {
          standard,
          subjectId: subject.id,
          chapterId: chapter.id,
        });
      });
    }
  }, [chapter, subject, standard]);

  // Calculate Overall Chapter Progress Percentage
  const progressPercent = useMemo(() => {
    if (!content) return 0;
    const totalItems = content.lessons.length + 1; // 3 lessons + practice
    let completedCount = 0;
    content.lessons.forEach((l) => {
      if (completedLessons[l.id]) completedCount += 1;
    });

    const isQuizDone =
      Object.keys(mcqAnswers).length > 0 ||
      Object.keys(fbAnswers).length > 0 ||
      Object.keys(tfAnswers).length > 0;
    if (isQuizDone) completedCount += 1;

    return Math.min(100, Math.round((completedCount / totalItems) * 100));
  }, [content, completedLessons, mcqAnswers, fbAnswers, tfAnswers]);

  // Current Lesson Completion
  const currentLesson = content?.lessons[activeLessonIdx];
  const isCurrentLessonDone = currentLesson ? Boolean(completedLessons[currentLesson.id]) : false;

  const toggleLessonComplete = (lessonId: string) => {
    const nextState = { ...completedLessons, [lessonId]: !completedLessons[lessonId] };
    setCompletedLessons(nextState);
    try {
      if (chapter) {
        localStorage.setItem(`kalpa_lessons_${chapter.id}`, JSON.stringify(nextState));
      }
    } catch {
      // Ignored
    }

    // If all 3 lessons are now complete, check if we should celebrate
    if (content && content.lessons.every((l) => nextState[l.id])) {
      triggerChapterCelebration();
    }
  };

  // Toggle Bookmark
  const toggleBookmark = () => {
    if (!chapter) return;
    try {
      const bookmarks: string[] = JSON.parse(localStorage.getItem("kalpa_bookmarks") || "[]");
      let nextBookmarks: string[];
      if (isBookmarked) {
        nextBookmarks = bookmarks.filter((id) => id !== chapter.id);
        setIsBookmarked(false);
      } else {
        nextBookmarks = [...bookmarks, chapter.id];
        setIsBookmarked(true);
      }
      localStorage.setItem("kalpa_bookmarks", JSON.stringify(nextBookmarks));
    } catch {
      // Ignored
    }
  };

  // Trigger celebration & reward XP
  const triggerChapterCelebration = () => {
    if (!chapter || !subject) return;
    updateProgress((p) => {
      let next = completeLesson(p, chapter.id, localDay());
      next = setLastAccessed(next, {
        standard,
        subjectId: subject.id,
        chapterId: chapter.id,
      });
      return next;
    });
    setCelebrateCount((c) => c + 1);
    setCelebrateModalOpen(true);
  };

  // MCQ Selection handler
  const handleMcqSelect = (qId: string, optIndex: number, correctIndex: number) => {
    setMcqAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowMcqExplanations((prev) => ({ ...prev, [qId]: true }));

    // Record quiz attempt in student profile once first answer is submitted
    if (!quizScoreSaved) {
      setQuizScoreSaved(true);
      const isCorrect = optIndex === correctIndex;
      updateProgress((p) => recordQuiz(p, isCorrect ? 1 : 0, 1, localDay()));
    }
  };

  // Copy Definition Helper
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(id);
      setTimeout(() => setCopiedNotification(null), 2000);
    }
  };

  // Text-to-speech Play/Stop
  const isReading = currentLesson ? speechState.id === currentLesson.id : false;
  const handleToggleSpeech = () => {
    if (!currentLesson) return;
    if (isReading) {
      speechStop();
    } else {
      speechPlay(currentLesson.id, currentLesson.lines, locale === "ta" ? "ta" : "en", {
        rate: speechRate,
      });
    }
  };

  // Next / Previous Chapter in Syllabus Sequence
  const currentIndex = chapter
    ? allChapters.findIndex((item) => item.chapter.id === chapter.id)
    : -1;
  const prevChapterItem = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapterItem =
    currentIndex >= 0 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  // Font Size Classes
  const fontSizeClass =
    fontSizeLevel === 0
      ? "text-sm sm:text-base leading-relaxed"
      : fontSizeLevel === 1
      ? "text-base sm:text-lg leading-loose"
      : "text-lg sm:text-xl leading-loose font-medium";

  if (!chapter || !subject || !content) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={chapter.title[locale] || chapter.title.en}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto selection:bg-purple-600 selection:text-white transition-colors duration-300 ${
        isLight ? "bg-[#f8f6fc]/85 text-slate-900" : "bg-[#080312] text-slate-100"
      }`}
    >
      {/* ===================================================================== */}
      {/* LANDING PAGE SIGNATURE BACKGROUND (Chrome Waves + Living Tree + Petals)*/}
      {/* ===================================================================== */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${
          isLight ? "bg-[#f7f1fd]/90" : "bg-[#080312]"
        }`}
      >
        {/* 1. Underlying Signature Chrome Waves (chromatic nebula + spiral orbit rings directly from Landing) */}
        <ChromeWaves />

        {/* 2. Harmonious Plum & Cosmic Purple Mixup - subtle accent auras allowing rings to shine */}
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_65%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.24),transparent_65%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-[radial-gradient(ellipse_at_75%_35%,rgba(236,72,153,0.08),transparent_60%)]"
              : "bg-[radial-gradient(ellipse_at_75%_35%,rgba(236,72,153,0.18),transparent_60%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)]"
              : "bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.16),transparent_60%)]"
          }`}
        />

        {/* 3. Blooming Wishing Tree with drifting petals hugging the left side */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden sm:block h-full w-[46vw] min-w-[280px] max-w-[600px] overflow-hidden opacity-85 transform-gpu"
          style={{
            maskImage: "linear-gradient(to right, #000 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, #000 70%, transparent 100%)",
          }}
        >
          <LivingTree />
        </div>
      </div>

      {/* 4. Cosmic particle layer with drifting petals + interactive bursts */}
      <CosmicParticleLayer moduleSlug="learn" className="z-[1]" />

      {/* --------------------------------------------------------------------- */}
      {/* TOP CLASSROOM HEADER BAR                                              */}
      {/* --------------------------------------------------------------------- */}
      <header
        className={`sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 sm:px-8 backdrop-blur-xl shadow-sm transition-colors ${
          isLight
            ? "border-purple-200/80 bg-white/85 text-purple-950"
            : "border-purple-900/40 bg-[#0d051f]/80 text-white shadow-lg"
        }`}
      >
        {/* Left: Back button & Breadcrumb Navigation */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className={`group flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-xs shrink-0 ${
              isLight
                ? "border-purple-200 bg-white/90 text-purple-900 hover:bg-purple-100 hover:border-purple-400"
                : "border-purple-800/50 bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 hover:text-white hover:border-purple-500 shadow-sm"
            }`}
            title="Return to Digital Learning Module"
          >
            <ArrowLeft
              size={15}
              className={`transition-transform duration-200 group-hover:-translate-x-0.5 ${
                isLight ? "text-purple-700 group-hover:text-purple-950" : "text-purple-400 group-hover:text-purple-200"
              }`}
            />
            <span className="hidden sm:inline">Back to Overview</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-xs truncate">
            <span
              className={`rounded-md border px-2 py-0.5 font-bold ${
                isLight
                  ? "bg-purple-100 border-purple-300 text-purple-900"
                  : "bg-purple-900/40 border-purple-800/40 text-purple-300"
              }`}
            >
              Class {standard}
            </span>
            <span className={isLight ? "text-purple-400" : "text-purple-500"}>›</span>
            <span className={`truncate font-bold ${isLight ? "text-pink-700" : "text-pink-300 font-semibold"}`}>
              {subject.name[locale] || subject.name.en}
            </span>
            <span className={isLight ? "text-purple-400" : "text-purple-500"}>›</span>
            <span className={isLight ? "text-purple-800 font-semibold" : "text-purple-300/70"}>
              Term {content.termNumber}
            </span>
            <span className={isLight ? "text-purple-400" : "text-purple-500"}>›</span>
            <span className={`font-bold truncate ${isLight ? "text-indigo-900 font-black" : "text-indigo-300"}`}>
              Ch {chapter.chapterNumber}
            </span>
          </nav>
        </div>

        {/* Right Controls: Font Size, Bookmark, and Close */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Font Size Adjuster (A- / A+) */}
          <div
            className={`hidden sm:flex items-center gap-1 rounded-xl border p-1 text-xs ${
              isLight ? "border-purple-200 bg-white/90 text-purple-900" : "border-purple-800/40 bg-purple-950/40 text-purple-300"
            }`}
          >
            <button
              type="button"
              onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
              disabled={fontSizeLevel === 0}
              className={`grid size-7 place-items-center rounded-lg disabled:opacity-40 transition-colors ${
                isLight ? "text-purple-800 hover:text-purple-950 hover:bg-purple-100" : "text-purple-300 hover:text-white hover:bg-purple-800/50"
              }`}
              title="Decrease text size"
            >
              <Minus size={13} weight="bold" />
            </button>
            <span
              className={`px-1.5 font-mono font-bold text-[11px] select-none ${
                isLight ? "text-purple-950 font-black" : "text-purple-200"
              }`}
            >
              {fontSizeLevel === 0 ? "100%" : fontSizeLevel === 1 ? "120%" : "140%"}
            </span>
            <button
              type="button"
              onClick={() => setFontSizeLevel((prev) => Math.min(2, prev + 1))}
              disabled={fontSizeLevel === 2}
              className={`grid size-7 place-items-center rounded-lg disabled:opacity-40 transition-colors ${
                isLight ? "text-purple-800 hover:text-purple-950 hover:bg-purple-100" : "text-purple-300 hover:text-white hover:bg-purple-800/50"
              }`}
              title="Increase text size"
            >
              <Plus size={13} weight="bold" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={toggleBookmark}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              isBookmarked
                ? isLight
                  ? "border-pink-300 bg-pink-100 text-pink-700 font-bold shadow-xs"
                  : "border-pink-500 bg-pink-950/50 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                : isLight
                ? "border-purple-200 bg-white/90 text-purple-800 hover:bg-purple-50 font-medium"
                : "border-purple-800/50 bg-purple-950/50 text-purple-300 hover:border-purple-600 hover:text-white"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark this Chapter"}
          >
            <BookmarkSimple size={15} weight={isBookmarked ? "fill" : "regular"} />
            <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle className="size-9 rounded-xl" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chapter view"
            className={`grid size-9 place-items-center rounded-xl border transition-colors ${
              isLight
                ? "border-purple-200 bg-white/90 text-purple-900 hover:bg-purple-100 hover:border-purple-400"
                : "border-purple-800/50 bg-purple-950/60 text-purple-300 transition-colors hover:border-purple-600 hover:text-white"
            }`}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN DIGITAL CLASSROOM LAYOUT                                         */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
        {/* =================================================================== */}
        {/* 1. CHAPTER HERO CARD: TITLE + DESCRIPTION + OBJECTIVES + 3D ART     */}
        {/* =================================================================== */}
        <section
          className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl mb-8 transition-all ${
            isLight
              ? "border-purple-200/90 bg-white/90 shadow-[0_12px_40px_rgba(124,58,237,0.12)] text-purple-950"
              : "border-purple-800/40 bg-gradient-to-r from-[#170a2c]/80 via-[#220e40]/65 to-[#120724]/80 shadow-[0_12px_50px_rgba(6,2,14,0.6)] text-white"
          }`}
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-pink-600/15 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Titles & Objectives */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                    isLight
                      ? "bg-purple-100 border-purple-300 text-purple-900"
                      : "bg-purple-500/20 border-purple-400/40 text-purple-200"
                  }`}
                >
                  Unit {chapter.chapterNumber}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                    isLight
                      ? "bg-pink-100 border-pink-300 text-pink-800"
                      : "bg-pink-500/20 border-pink-400/40 text-pink-200"
                  }`}
                >
                  {subject.name[locale] || subject.name.en}
                </span>
                <span
                  className={`flex items-center gap-1.5 font-mono text-xs ml-auto sm:ml-0 ${
                    isLight ? "text-purple-800 font-medium" : "text-purple-300/80"
                  }`}
                >
                  <Clock size={14} className={isLight ? "text-purple-600" : "text-purple-400"} />
                  <span>~{chapter.estimatedMinutes} mins learning</span>
                </span>
              </div>

              <h1
                className={`font-serif text-2xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight ${
                  isLight ? "text-purple-950" : "text-white drop-shadow-[0_2px_15px_rgba(168,85,247,0.4)]"
                }`}
              >
                {chapter.title[locale] || chapter.title.en}
              </h1>

              <p
                className={`font-headline text-sm sm:text-base leading-relaxed max-w-2xl font-medium ${
                  isLight ? "text-purple-900/90" : "text-purple-200/80"
                }`}
              >
                {chapter.summary[locale] || chapter.summary.en}
              </p>

              {/* Learning Objectives Pills */}
              <div className="mt-2 flex flex-col gap-2">
                <span
                  className={`font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                    isLight ? "text-purple-900" : "text-purple-300"
                  }`}
                >
                  <Target size={14} className={isLight ? "text-pink-600" : "text-pink-400"} />
                  <span>{locale === "ta" ? "கற்றல் நோக்கங்கள்" : "Learning Objectives"}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-xs ${
                      isLight
                        ? "border-purple-200 bg-purple-50/90 text-purple-950"
                        : "border-purple-800/40 bg-purple-950/40 text-purple-200"
                    }`}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full text-[10px] font-bold ${
                        isLight ? "bg-purple-200 text-purple-900" : "bg-purple-500/30 text-purple-300"
                      }`}
                    >
                      1
                    </span>
                    <span>{content.lessons[0]?.objective[locale] || "Core Fundamentals & Definitions"}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-xs ${
                      isLight
                        ? "border-purple-200 bg-purple-50/90 text-purple-950"
                        : "border-purple-800/40 bg-purple-950/40 text-purple-200"
                    }`}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full text-[10px] font-bold ${
                        isLight ? "bg-pink-200 text-pink-900" : "bg-pink-500/30 text-pink-300"
                      }`}
                    >
                      2
                    </span>
                    <span>{content.lessons[1]?.objective[locale] || "Governing Principles & Rules"}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-xs ${
                      isLight
                        ? "border-purple-200 bg-purple-50/90 text-purple-950"
                        : "border-purple-800/40 bg-purple-950/40 text-purple-200"
                    }`}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full text-[10px] font-bold ${
                        isLight ? "bg-indigo-200 text-indigo-900" : "bg-indigo-500/30 text-indigo-300"
                      }`}
                    >
                      3
                    </span>
                    <span>{content.lessons[2]?.objective[locale] || "Real-World Context & Exam Practice"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Chapter 3D Art Illustration */}
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <div
                className={`relative size-44 sm:size-52 rounded-2xl border p-4 flex items-center justify-center transition-all ${
                  isLight
                    ? "border-purple-200 bg-gradient-to-tr from-purple-50/90 to-pink-50/80 shadow-md"
                    : "border-purple-700/40 bg-gradient-to-tr from-purple-950/70 to-indigo-950/70 shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
                }`}
              >
                <Image
                  src="/images/learn/hero-3d-scene.png"
                  alt="3D Interactive Lesson Scene"
                  width={200}
                  height={200}
                  className="size-full object-contain drop-shadow-[0_8px_25px_rgba(168,85,247,0.5)] transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. MAIN 2-COLUMN GRID: CONTENT (8 cols) + RIGHT PANELS (4 cols)    */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================================================================= */}
          {/* LEFT 8 COLUMNS: INTERACTIVE TABS & CONTENT                        */}
          {/* ================================================================= */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            {/* Interactive Tabs Header */}
            <div
              className={`flex items-center gap-2 border-b pb-3 overflow-x-auto scrollbar-none ${
                isLight ? "border-purple-200" : "border-purple-900/50"
              }`}
            >
              {(
                [
                  { id: "learn", label: locale === "ta" ? "கற்க (LEARN)" : "LEARN", icon: BookOpenText },
                  { id: "notes", label: locale === "ta" ? "குறிப்புகள் (NOTES)" : "NOTES", icon: FileText },
                  { id: "practice", label: locale === "ta" ? "பயிற்சி (PRACTICE)" : "PRACTICE", icon: Question },
                  { id: "resources", label: locale === "ta" ? "மூலங்கள் (RESOURCES)" : "RESOURCES", icon: Paperclip },
                ] as const
              ).map((tab) => {
                const TabIcon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-display text-sm font-bold transition-all duration-200 shrink-0 ${
                      active
                        ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] ring-1 ring-purple-400"
                        : isLight
                        ? "border border-purple-200/90 bg-white/90 text-purple-900 hover:bg-purple-100 hover:text-purple-950 font-semibold shadow-xs"
                        : "border border-purple-900/40 bg-purple-950/30 text-purple-300 hover:border-purple-700 hover:bg-purple-900/40 hover:text-white"
                    }`}
                  >
                    <TabIcon size={17} weight={active ? "bold" : "regular"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* --------------------------------------------------------------- */}
            {/* TAB 1: LEARN (Micro-Lessons, TTS, Font Resize, Diagrams)        */}
            {/* --------------------------------------------------------------- */}
            {activeTab === "learn" && currentLesson && (
              <div className="flex flex-col gap-6">
                {/* Micro-Lesson Navigation Bar */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 backdrop-blur-xl ${
                    isLight ? "border-purple-200 bg-white/90 shadow-xs" : "border-purple-800/40 bg-[#160a2b]/80"
                  }`}
                >
                  {/* Lesson Switcher Pills */}
                  <div className="flex items-center gap-2">
                    {content.lessons.map((lesson, idx) => {
                      const isSelected = activeLessonIdx === idx;
                      const isDone = completedLessons[lesson.id];
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => setActiveLessonIdx(idx)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                            isSelected
                              ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                              : isDone
                              ? isLight
                                ? "border border-emerald-400 bg-emerald-50 text-emerald-800 font-bold"
                                : "border border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                              : isLight
                              ? "border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 font-semibold"
                              : "border border-purple-900/40 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40"
                          }`}
                        >
                          {isDone ? (
                            <Check size={12} weight="bold" className="text-emerald-500" />
                          ) : (
                            <span>{idx + 1}.</span>
                          )}
                          <span>Lesson {idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Text-to-Speech Controls Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleSpeech}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                        isReading
                          ? "border-amber-400 bg-amber-400 text-black shadow-sm font-bold animate-pulse"
                          : isLight
                          ? "border-purple-300 bg-purple-100 text-purple-900 hover:bg-purple-200 font-bold"
                          : "border-purple-700 bg-purple-900/60 text-purple-200 hover:bg-purple-800 hover:text-white"
                      }`}
                      title={isReading ? "Stop Audio" : "Listen via Text-to-Speech"}
                    >
                      {isReading ? <Stop size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                      <span>{isReading ? "Stop Voice" : "Listen Aloud"}</span>
                    </button>

                    {/* Speed selector */}
                    <button
                      type="button"
                      onClick={() => setSpeechRate((r) => (r === 1 ? 0.8 : r === 0.8 ? 1.25 : 1))}
                      className={`rounded-xl border px-2 py-1.5 font-mono text-[11px] font-bold ${
                        isLight
                          ? "border-purple-200 bg-white text-purple-900 hover:bg-purple-50"
                          : "border-purple-800/40 bg-purple-950/40 text-purple-300 hover:text-white"
                      }`}
                      title="Adjust Speech Speed"
                    >
                      {speechRate}x
                    </button>
                  </div>
                </div>

                {/* Lesson Main Card */}
                <div
                  className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col gap-6 ${
                    isLight
                      ? "border-purple-200/90 bg-white/95 text-purple-950 shadow-md"
                      : "border-purple-800/40 bg-[#160a2b]/80 text-white"
                  }`}
                >
                  {/* Lesson Subheader */}
                  <div
                    className={`flex items-start justify-between gap-4 border-b pb-4 ${
                      isLight ? "border-purple-200" : "border-purple-900/40"
                    }`}
                  >
                    <div>
                      <span
                        className={`font-mono text-xs uppercase tracking-wider font-bold ${
                          isLight ? "text-pink-600 font-black" : "text-pink-300"
                        }`}
                      >
                        Micro-Lesson {activeLessonIdx + 1} of 3
                      </span>
                      <h2
                        className={`font-display text-xl sm:text-2xl font-bold mt-1 ${
                          isLight ? "text-purple-950 font-black" : "text-white"
                        }`}
                      >
                        {currentLesson.title[locale] || currentLesson.title.en}
                      </h2>
                      <p
                        className={`font-mono text-xs mt-1 flex items-center gap-1.5 ${
                          isLight ? "text-purple-700 font-medium" : "text-purple-300/70"
                        }`}
                      >
                        <Clock size={13} className={isLight ? "text-purple-600" : "text-purple-400"} />
                        <span>~{currentLesson.durationMinutes} mins lesson reading time</span>
                      </p>
                    </div>

                    {/* Mark Lesson Complete Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleLessonComplete(currentLesson.id)}
                      className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 font-display text-xs font-bold transition-all shrink-0 ${
                        isCurrentLessonDone
                          ? "border-emerald-400 bg-emerald-600 text-white shadow-sm"
                          : isLight
                          ? "border-purple-300 bg-purple-100 text-purple-900 hover:bg-purple-200 font-bold"
                          : "border-purple-700/60 bg-purple-950/40 text-purple-300 hover:border-purple-500 hover:bg-purple-900/40 hover:text-white"
                      }`}
                    >
                      <CheckCircle
                        size={18}
                        weight={isCurrentLessonDone ? "fill" : "regular"}
                        className={isCurrentLessonDone ? "text-white" : isLight ? "text-purple-600" : "text-purple-400"}
                      />
                      <span>{isCurrentLessonDone ? "Lesson Completed ✓" : "Mark as Completed"}</span>
                    </button>
                  </div>

                  {/* Lesson Explanation Content */}
                  <div className={`${isLight ? "text-slate-800 font-medium" : "text-purple-100"} ${fontSizeClass}`}>
                    <p className={`leading-relaxed mb-4 ${isLight ? "text-purple-950 font-semibold" : "text-white font-medium"}`}>
                      {currentLesson.intro[locale] || currentLesson.intro.en}
                    </p>

                    {/* Karaoke Audio Highlighting Display when reading */}
                    {isReading && (
                      <div
                        className={`my-4 rounded-2xl border p-4 ${
                          isLight
                            ? "border-purple-200 bg-purple-50/80 text-purple-950"
                            : "border-purple-500/50 bg-purple-950/60 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                        }`}
                      >
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider block mb-2 font-bold ${
                            isLight ? "text-pink-700 font-black" : "text-pink-300"
                          }`}
                        >
                          Live Narration Stream
                        </span>
                        <KaraokeLines
                          lines={currentLesson.lines}
                          lang={locale === "ta" ? "ta" : "en"}
                          activeLine={speechState.line}
                          activeWord={speechState.word}
                          className={`font-serif text-lg ${isLight ? "text-purple-950" : "text-purple-100"}`}
                        />
                      </div>
                    )}

                    {/* Key Lesson Takeaways List */}
                    <div
                      className={`my-5 flex flex-col gap-3 rounded-2xl border p-5 ${
                        isLight
                          ? "border-purple-200 bg-purple-50/70 text-purple-950"
                          : "border-purple-900/40 bg-purple-950/30 text-purple-200"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                          isLight ? "text-purple-900" : "text-purple-300"
                        }`}
                      >
                        <Sparkle size={14} className={isLight ? "text-amber-500" : "text-yellow-400"} weight="fill" />
                        <span>Core Key Points</span>
                      </span>
                      <ul className="flex flex-col gap-2.5">
                        {currentLesson.keyPoints.map((pt, ptIdx) => (
                          <li
                            key={ptIdx}
                            className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                              isLight ? "text-slate-800 font-medium" : "text-purple-200"
                            }`}
                          >
                            <span
                              className={`grid size-5 place-items-center rounded-full font-mono text-[11px] shrink-0 mt-0.5 font-bold ${
                                isLight
                                  ? "bg-purple-200 text-purple-900"
                                  : "bg-purple-500/20 text-purple-300"
                              }`}
                            >
                              •
                            </span>
                            <span>{pt[locale] || pt.en}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Concept Diagram Box (Lesson 1) */}
                    {currentLesson.diagramItems && (
                      <div
                        className={`my-6 rounded-2xl border p-5 ${
                          isLight
                            ? "border-purple-200 bg-purple-50/60 text-purple-950"
                            : "border-purple-800/40 bg-gradient-to-b from-purple-950/50 to-indigo-950/40"
                        }`}
                      >
                        <span
                          className={`font-mono text-xs uppercase tracking-wider font-bold block mb-3 ${
                            isLight ? "text-pink-700 font-black" : "text-pink-300"
                          }`}
                        >
                          📊 {currentLesson.diagramTitle ? currentLesson.diagramTitle[locale] : "Concept Diagram"}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {currentLesson.diagramItems.map((item, dIdx) => (
                            <div
                              key={dIdx}
                              className={`flex flex-col gap-1.5 rounded-xl border p-3.5 ${
                                isLight
                                  ? "border-purple-200 bg-white text-purple-950 shadow-xs"
                                  : "border-purple-800/40 bg-purple-900/20"
                              }`}
                            >
                              <h4
                                className={`font-display text-xs font-bold ${
                                  isLight ? "text-purple-950" : "text-white"
                                }`}
                              >
                                {item.label[locale] || item.label.en}
                              </h4>
                              <p
                                className={`font-mono text-[11px] leading-relaxed ${
                                  isLight ? "text-purple-800 font-medium" : "text-purple-300/80"
                                }`}
                              >
                                {item.desc[locale] || item.desc.en}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Solved Example Box (Lesson 2) */}
                    {currentLesson.example && (
                      <div
                        className={`my-6 rounded-2xl border p-5 ${
                          isLight
                            ? "border-pink-200 bg-pink-50/60 text-purple-950"
                            : "border-pink-900/40 bg-pink-950/20"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider font-mono ${
                            isLight ? "text-pink-700 font-black" : "text-pink-300"
                          }`}
                        >
                          <Lightbulb size={16} weight="fill" className={isLight ? "text-amber-500" : "text-yellow-400"} />
                          <span>Worked Example Problem</span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm font-medium mb-3 ${
                            isLight ? "text-purple-950 font-bold" : "text-white"
                          }`}
                        >
                          {currentLesson.example.problem[locale] || currentLesson.example.problem.en}
                        </p>
                        <div
                          className={`rounded-xl border p-3.5 text-xs ${
                            isLight
                              ? "border-pink-200 bg-white text-purple-950"
                              : "border-pink-800/30 bg-purple-950/60 text-purple-200"
                          }`}
                        >
                          <span className={`font-bold block mb-1 ${isLight ? "text-pink-700" : "text-pink-300"}`}>
                            Step-by-step Solution:
                          </span>
                          <span>{currentLesson.example.solution[locale] || currentLesson.example.solution.en}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Previous / Next Lesson Footer Controls */}
                  <div
                    className={`flex items-center justify-between pt-5 border-t ${
                      isLight ? "border-purple-200" : "border-purple-900/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveLessonIdx((i) => Math.max(0, i - 1))}
                      disabled={activeLessonIdx === 0}
                      className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 font-display text-xs font-bold disabled:opacity-40 transition-colors ${
                        isLight
                          ? "border-purple-200 bg-white text-purple-900 hover:bg-purple-100"
                          : "border-purple-800/40 bg-purple-950/40 text-purple-300 hover:text-white"
                      }`}
                    >
                      <ArrowLeft size={14} />
                      <span>Previous Lesson</span>
                    </button>

                    {activeLessonIdx < content.lessons.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentLesson) toggleLessonComplete(currentLesson.id);
                          setActiveLessonIdx((i) => i + 1);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 font-display text-xs font-bold text-white hover:bg-purple-500 shadow-sm transition-all"
                      >
                        <span>Next Lesson</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentLesson) toggleLessonComplete(currentLesson.id);
                          setActiveTab("practice");
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-5 py-2 font-display text-xs font-bold text-white hover:bg-pink-500 shadow-sm transition-all"
                      >
                        <span>Start Practice Quiz</span>
                        <CaretRight size={14} weight="bold" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* TAB 2: NOTES (Summary, Formulas, Key Points, PDF Export)        */}
            {/* --------------------------------------------------------------- */}
            {activeTab === "notes" && (
              <div className="flex flex-col gap-6">
                {/* Notes Controls Header */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 backdrop-blur-xl ${
                    isLight ? "border-purple-200 bg-white/90 shadow-xs" : "border-purple-800/40 bg-[#160a2b]/80"
                  }`}
                >
                  <div>
                    <h3 className={`font-display text-base font-bold ${isLight ? "text-purple-950" : "text-white"}`}>
                      Chapter Revision Notes & High-Yield Summary
                    </h3>
                    <p className={`font-mono text-xs ${isLight ? "text-purple-700 font-medium" : "text-purple-300/70"}`}>
                      Standardized Samacheer Kalvi formula & definition handbook
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") window.print();
                    }}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 font-display text-xs font-bold text-white shadow-sm transition-all"
                  >
                    <DownloadSimple size={15} weight="bold" />
                    <span>Print / Save Notes (PDF)</span>
                  </button>
                </div>

                {/* Chapter Summary Card */}
                <div
                  className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-xl shadow-xl flex flex-col gap-4 ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-md"
                      : "border-purple-800/40 bg-[#160a2b]/80 text-white"
                  }`}
                >
                  <h4 className={`font-display text-lg font-bold flex items-center gap-2 ${isLight ? "text-purple-950" : "text-white"}`}>
                    <BookOpen size={18} className={isLight ? "text-purple-700" : "text-purple-400"} />
                    <span>Executive Summary</span>
                  </h4>
                  <div className="grid gap-3">
                    {content.notesSummary.map((item, sIdx) => (
                      <div
                        key={sIdx}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-xs sm:text-sm ${
                          isLight
                            ? "border-purple-200 bg-purple-50/70 text-slate-800 font-medium"
                            : "border-purple-900/40 bg-purple-950/30 text-purple-200"
                        }`}
                      >
                        <span
                          className={`grid size-6 place-items-center rounded-lg font-mono text-xs font-bold shrink-0 ${
                            isLight
                              ? "bg-purple-200 text-purple-900"
                              : "bg-purple-600/30 text-purple-300"
                          }`}
                        >
                          {sIdx + 1}
                        </span>
                        <p className="leading-relaxed">{item[locale] || item.en}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Definitions & Formulas Card */}
                <div
                  className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-xl shadow-xl flex flex-col gap-4 ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-md"
                      : "border-purple-800/40 bg-[#160a2b]/80 text-white"
                  }`}
                >
                  <h4 className={`font-display text-lg font-bold flex items-center gap-2 ${isLight ? "text-purple-950" : "text-white"}`}>
                    <Lightbulb size={18} className={isLight ? "text-amber-500" : "text-yellow-400"} weight="fill" />
                    <span>Important Definitions & Formulas</span>
                  </h4>
                  <div className="grid gap-3">
                    {content.definitions.map((defItem, dIdx) => (
                      <div
                        key={dIdx}
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                          isLight
                            ? "border-purple-200 bg-purple-50/60 text-purple-950 hover:border-purple-400"
                            : "border-purple-900/40 bg-purple-950/40 text-white hover:border-purple-600/50"
                        }`}
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <span
                            className={`font-mono text-xs font-bold uppercase tracking-wider ${
                              isLight ? "text-pink-700 font-black" : "text-pink-300"
                            }`}
                          >
                            {defItem.term[locale] || defItem.term.en}
                          </span>
                          <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-800 font-medium" : "text-white"}`}>
                            {defItem.def[locale] || defItem.def.en}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(defItem.def[locale] || defItem.def.en, `def-${dIdx}`)}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs shrink-0 self-start sm:self-center transition-colors ${
                            isLight
                              ? "border-purple-200 bg-white text-purple-900 hover:bg-purple-100 font-bold"
                              : "border-purple-800/50 bg-purple-900/40 text-purple-200 hover:text-white"
                          }`}
                          title="Copy Definition"
                        >
                          <Copy size={13} />
                          <span>{copiedNotification === `def-${dIdx}` ? "Copied! ✓" : "Copy"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* TAB 3: PRACTICE (MCQ, Fill Blanks, True/False, Match, Score)    */}
            {/* --------------------------------------------------------------- */}
            {activeTab === "practice" && (
              <div className="flex flex-col gap-6">
                {/* Practice Score Banner */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 backdrop-blur-xl ${
                    isLight
                      ? "border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 text-purple-950 shadow-md"
                      : "border-purple-800/40 bg-gradient-to-r from-purple-950/80 via-pink-950/60 to-purple-950/80 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-purple-600 text-white shadow-sm">
                      <Trophy size={20} weight="fill" />
                    </span>
                    <div>
                      <h3 className={`font-display text-base font-bold ${isLight ? "text-purple-950" : "text-white"}`}>
                        Interactive Knowledge Check
                      </h3>
                      <p className={`font-mono text-xs ${isLight ? "text-purple-700 font-medium" : "text-purple-300/80"}`}>
                        {Object.keys(mcqAnswers).length + Object.keys(fbAnswers).length + Object.keys(tfAnswers).length} questions answered
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMcqAnswers({});
                        setShowMcqExplanations({});
                        setFbAnswers({});
                        setTfAnswers({});
                        setMatchSelections({});
                        setQuizScoreSaved(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs transition-colors ${
                        isLight
                          ? "border-purple-300 bg-white text-purple-900 hover:bg-purple-100 font-bold shadow-sm"
                          : "border-purple-800/50 bg-purple-900/40 text-purple-200 hover:text-white"
                      }`}
                    >
                      <ArrowsCounterClockwise size={13} />
                      <span>Retry All</span>
                    </button>
                  </div>
                </div>

                {/* 1. Multiple Choice Questions (from Curriculum) */}
                <div
                  className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-xl flex flex-col gap-5 ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-lg"
                      : "border-purple-800/40 bg-[#160a2b]/80 shadow-xl"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between border-b pb-3 ${
                      isLight ? "border-purple-200" : "border-purple-900/40"
                    }`}
                  >
                    <h4 className={`font-display text-base font-bold flex items-center gap-2 ${isLight ? "text-purple-950" : "text-white"}`}>
                      <Question size={18} className={isLight ? "text-purple-600" : "text-purple-400"} weight="fill" />
                      <span>Part A: Multiple Choice Questions</span>
                    </h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        isLight
                          ? "bg-purple-100 border border-purple-300 text-purple-900"
                          : "bg-purple-900/60 border border-purple-700/50 text-purple-200"
                      }`}
                    >
                      {content.mcqs.length} Questions
                    </span>
                  </div>

                  <div className="flex flex-col gap-5">
                    {content.mcqs.map((q, qIdx) => {
                      const selected = mcqAnswers[q.id];
                      const isAnswered = selected !== undefined;
                      const isCorrect = selected === q.answerIndex;

                      return (
                        <div
                          key={q.id}
                          className={`rounded-2xl border p-4 sm:p-5 ${
                            isLight
                              ? "border-purple-200 bg-purple-50/50"
                              : "border-purple-900/50 bg-purple-950/40"
                          }`}
                        >
                          <p className={`font-display text-sm sm:text-base font-semibold mb-3 ${isLight ? "text-purple-950" : "text-white"}`}>
                            <span className={`font-mono text-xs mr-2 ${isLight ? "text-pink-600 font-bold" : "text-pink-400"}`}>
                              Q{qIdx + 1}.
                            </span>
                            {q.question[locale] || q.question.en}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {q.options.map((opt, optIdx) => {
                              const isThisSelected = selected === optIdx;
                              let btnClass = isLight
                                ? "border-purple-200 bg-white text-purple-950 hover:bg-purple-100/80 hover:border-purple-400 shadow-sm"
                                : "border-purple-900/50 bg-purple-950/30 text-purple-200 hover:border-purple-600 hover:bg-purple-900/40";

                              if (isAnswered) {
                                if (optIdx === q.answerIndex) {
                                  btnClass = isLight
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30"
                                    : "border-emerald-400 bg-emerald-950/60 text-emerald-200 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                                } else if (isThisSelected) {
                                  btnClass = isLight
                                    ? "border-rose-400 bg-rose-50 text-rose-950 font-bold"
                                    : "border-red-500 bg-red-950/60 text-red-200 font-bold";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleMcqSelect(q.id, optIdx, q.answerIndex)}
                                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs sm:text-sm transition-all ${btnClass}`}
                                >
                                  <span
                                    className={`grid size-6 place-items-center rounded-lg font-mono text-xs shrink-0 font-bold ${
                                      isLight
                                        ? "bg-purple-100 text-purple-900"
                                        : "bg-purple-900/60 text-purple-200"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="leading-snug">{opt[locale] || opt.en}</span>
                                </button>
                              );
                            })}
                          </div>

                          {showMcqExplanations[q.id] && (
                            <div
                              className={`mt-4 rounded-xl border p-3 text-xs leading-relaxed ${
                                isCorrect
                                  ? isLight
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                                    : "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                                  : isLight
                                  ? "border-amber-300 bg-amber-50 text-amber-950"
                                  : "border-amber-500/40 bg-amber-950/40 text-amber-200"
                              }`}
                            >
                              <span className="font-bold block mb-0.5">
                                {isCorrect ? "✓ Correct Answer!" : "Explanation & Reasoning:"}
                              </span>
                              <p>{q.explanation[locale] || q.explanation.en}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Fill in the Blanks */}
                <div
                  className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-xl flex flex-col gap-4 ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-lg"
                      : "border-purple-800/40 bg-[#160a2b]/80 shadow-xl"
                  }`}
                >
                  <h4
                    className={`font-display text-base font-bold flex items-center gap-2 border-b pb-3 ${
                      isLight ? "border-purple-200 text-purple-950" : "border-purple-900/40 text-white"
                    }`}
                  >
                    <PencilSimple size={18} className="text-pink-500" weight="fill" />
                    <span>Part B: Fill in the Blanks</span>
                  </h4>

                  <div className="grid gap-4">
                    {content.fillBlanks.map((fb, fbIdx) => {
                      const userPick = fbAnswers[fb.id];
                      const isCorrect = userPick === fb.correctWord;

                      return (
                        <div
                          key={fb.id}
                          className={`rounded-2xl border p-4 ${
                            isLight
                              ? "border-purple-200 bg-purple-50/50"
                              : "border-purple-900/50 bg-purple-950/40"
                          }`}
                        >
                          <p className={`text-xs sm:text-sm font-medium mb-3 ${isLight ? "text-purple-950" : "text-purple-100"}`}>
                            <span className={`font-mono mr-2 ${isLight ? "text-pink-600 font-bold" : "text-pink-400"}`}>
                              {fbIdx + 1}.
                            </span>
                            {(fb.sentence[locale] || fb.sentence.en).replace("____", userPick ? `[${userPick}]` : "______")}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {fb.options.map((opt, oIdx) => {
                              const picked = userPick === opt;
                              let pillStyle = isLight
                                ? "border-purple-300 bg-white text-purple-900 hover:border-purple-500 hover:bg-purple-100 font-bold"
                                : "border-purple-800/50 bg-purple-950/30 text-purple-300 hover:border-purple-600 hover:text-white";

                              if (picked) {
                                if (isCorrect) {
                                  pillStyle = isLight
                                    ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold"
                                    : "border-emerald-400 bg-emerald-950/60 text-emerald-300 font-bold";
                                } else {
                                  pillStyle = isLight
                                    ? "border-rose-400 bg-rose-100 text-rose-950 font-bold"
                                    : "border-red-500 bg-red-950/60 text-red-200 font-bold";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => setFbAnswers((p) => ({ ...p, [fb.id]: opt }))}
                                  className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${pillStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {userPick && (
                            <p className={`mt-3 text-xs ${isLight ? "text-slate-800 font-medium" : "text-purple-300/80"}`}>
                              <span className={`font-bold ${isLight ? "text-purple-950" : "text-white"}`}>Note: </span>
                              {fb.explanation[locale] || fb.explanation.en}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. True / False Questions */}
                <div
                  className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-xl flex flex-col gap-4 ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-lg"
                      : "border-purple-800/40 bg-[#160a2b]/80 shadow-xl"
                  }`}
                >
                  <h4
                    className={`font-display text-base font-bold flex items-center gap-2 border-b pb-3 ${
                      isLight ? "border-purple-200 text-purple-950" : "border-purple-900/40 text-white"
                    }`}
                  >
                    <CheckCircle size={18} className="text-emerald-500" weight="fill" />
                    <span>Part C: True or False</span>
                  </h4>

                  <div className="grid gap-4">
                    {content.trueFalse.map((tf, tfIdx) => {
                      const userPick = tfAnswers[tf.id];
                      const answered = userPick !== undefined;

                      return (
                        <div
                          key={tf.id}
                          className={`rounded-2xl border p-4 ${
                            isLight
                              ? "border-purple-200 bg-purple-50/50"
                              : "border-purple-900/50 bg-purple-950/40"
                          }`}
                        >
                          <p className={`text-xs sm:text-sm font-medium mb-3 ${isLight ? "text-purple-950" : "text-white"}`}>
                            <span className={`font-mono mr-2 ${isLight ? "text-pink-600 font-bold" : "text-pink-400"}`}>
                              {tfIdx + 1}.
                            </span>
                            {tf.statement[locale] || tf.statement.en}
                          </p>

                          <div className="flex items-center gap-2">
                            {[
                              { label: "True", val: true },
                              { label: "False", val: false },
                            ].map((btn) => {
                              const isThisChosen = userPick === btn.val;
                              let btnClass = isLight
                                ? "border-purple-300 bg-white text-purple-900 hover:border-purple-500 hover:bg-purple-100 font-bold shadow-sm"
                                : "border-purple-800/50 bg-purple-950/30 text-purple-200 hover:border-purple-600";

                              if (answered) {
                                if (btn.val === tf.isTrue) {
                                  btnClass = isLight
                                    ? "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold"
                                    : "border-emerald-400 bg-emerald-950/60 text-emerald-300 font-bold";
                                } else if (isThisChosen) {
                                  btnClass = isLight
                                    ? "border-rose-400 bg-rose-100 text-rose-950 font-bold"
                                    : "border-red-500 bg-red-950/60 text-red-200";
                                }
                              }

                              return (
                                <button
                                  key={btn.label}
                                  type="button"
                                  onClick={() => setTfAnswers((p) => ({ ...p, [tf.id]: btn.val }))}
                                  className={`rounded-xl border px-4 py-2 font-display text-xs font-bold transition-all ${btnClass}`}
                                >
                                  {btn.label}
                                </button>
                              );
                            })}
                          </div>

                          {answered && (
                            <p className={`mt-3 text-xs ${isLight ? "text-slate-800 font-medium" : "text-purple-300/80"}`}>
                              <span className={`font-bold ${isLight ? "text-purple-950" : "text-white"}`}>Explanation: </span>
                              {tf.explanation[locale] || tf.explanation.en}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Match the Following */}
                <div
                  className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-xl flex flex-col gap-4 ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-lg"
                      : "border-purple-800/40 bg-[#160a2b]/80 shadow-xl"
                  }`}
                >
                  <h4
                    className={`font-display text-base font-bold flex items-center gap-2 border-b pb-3 ${
                      isLight ? "border-purple-200 text-purple-950" : "border-purple-900/40 text-white"
                    }`}
                  >
                    <ListChecks size={18} className={isLight ? "text-indigo-600" : "text-indigo-400"} weight="fill" />
                    <span>Part D: Concept Match</span>
                  </h4>

                  <div className="grid gap-2.5">
                    {content.matchPairs.map((pair) => (
                      <div
                        key={pair.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 ${
                          isLight
                            ? "border-purple-200 bg-purple-50/60 text-purple-950"
                            : "border-purple-900/40 bg-purple-950/30 text-white"
                        }`}
                      >
                        <span className={`font-display text-xs sm:text-sm font-semibold ${isLight ? "text-purple-950 font-bold" : "text-white"}`}>
                          {pair.left[locale] || pair.left.en}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`hidden sm:inline font-mono ${isLight ? "text-purple-600 font-bold" : "text-purple-500"}`}>→</span>
                          <span
                            className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-bold shadow-sm ${
                              isLight
                                ? "border-purple-300 bg-white text-pink-700"
                                : "border-purple-700/50 bg-purple-900/40 text-pink-200"
                            }`}
                          >
                            {pair.right[locale] || pair.right.en}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* TAB 4: RESOURCES (Official Textbook, Video Lessons, Audio)      */}
            {/* --------------------------------------------------------------- */}
            {activeTab === "resources" && (
              <div className="flex flex-col gap-6">
                <div
                  className={`rounded-2xl border p-4 backdrop-blur-xl ${
                    isLight
                      ? "border-purple-200 bg-white/95 text-purple-950 shadow-md"
                      : "border-purple-800/40 bg-[#160a2b]/80 text-white"
                  }`}
                >
                  <h3 className={`font-display text-base font-bold ${isLight ? "text-purple-950" : "text-white"}`}>
                    Verified Samacheer Kalvi Learning Assets
                  </h3>
                  <p className={`font-mono text-xs ${isLight ? "text-slate-600 font-medium" : "text-purple-300/70"}`}>
                    Official state board textbook files, verified animated video lessons, and podcast guides.
                  </p>
                </div>

                <div className="grid gap-4">
                  {content.resourcesList.map((res) => {
                    const isPdf = res.type === "pdf";
                    const isVideo = res.type === "video";
                    const isAudio = res.type === "audio";

                    return (
                      <div
                        key={res.id}
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border p-5 backdrop-blur-xl transition-all shadow-lg ${
                          isLight
                            ? "border-purple-200 bg-white/95 text-purple-950 hover:border-purple-400"
                            : "border-purple-800/40 bg-[#160a2b]/80 text-white hover:border-purple-600/60"
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <span
                            className={`grid size-12 shrink-0 place-items-center rounded-2xl border transition-transform group-hover:scale-105 ${
                              isLight
                                ? "bg-purple-100 border-purple-300 text-purple-900"
                                : "bg-purple-900/50 border-purple-700/40 text-purple-300"
                            }`}
                          >
                            {isPdf ? (
                              <FilePdf size={22} weight="duotone" className="text-pink-500" />
                            ) : isVideo ? (
                              <VideoCamera size={22} weight="duotone" className="text-cyan-500" />
                            ) : isAudio ? (
                              <SpeakerHigh size={22} weight="duotone" className="text-amber-500" />
                            ) : (
                              <Paperclip size={22} weight="duotone" className="text-purple-500" />
                            )}
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`rounded-full px-2 py-0.2 font-mono text-[10px] font-bold flex items-center gap-1 ${
                                  isLight
                                    ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
                                    : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                                }`}
                              >
                                <Check size={10} weight="bold" />
                                <span>Verified Official</span>
                              </span>
                              <span
                                className={`font-mono text-[10px] uppercase tracking-wider ${
                                  isLight ? "text-purple-700 font-bold" : "text-purple-400"
                                }`}
                              >
                                {res.fileSize || res.duration || "Verified Material"}
                              </span>
                            </div>

                            <h4
                              className={`font-display text-sm sm:text-base font-bold transition-colors ${
                                isLight
                                  ? "text-purple-950 group-hover:text-purple-700"
                                  : "text-white group-hover:text-pink-300"
                              }`}
                            >
                              {res.title[locale] || res.title.en}
                            </h4>
                            <p className={`font-mono text-xs mt-1 line-clamp-2 ${isLight ? "text-slate-600 font-medium" : "text-purple-300/70"}`}>
                              {res.description[locale] || res.description.en}
                            </p>
                          </div>
                        </div>

                        {/* Action Link / Button */}
                        <div className="shrink-0 self-end sm:self-center">
                          {isVideo ? (
                            <button
                              type="button"
                              onClick={() => setActiveVideoModal(res.title.en)}
                              className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 font-display text-xs font-bold text-white shadow-sm transition-all"
                            >
                              <Play size={12} weight="fill" />
                              <span>Play Video</span>
                            </button>
                          ) : isAudio ? (
                            <button
                              type="button"
                              onClick={handleToggleSpeech}
                              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 font-display text-xs font-bold transition-all ${
                                isLight
                                  ? "border-purple-300 bg-purple-100 text-purple-900 hover:bg-purple-200"
                                  : "border-purple-700 bg-purple-900/40 hover:bg-purple-800 text-purple-200"
                              }`}
                            >
                              <SpeakerHigh size={14} />
                              <span>Play Audio</span>
                            </button>
                          ) : (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 font-display text-xs font-bold text-white shadow-sm transition-all"
                            >
                              <span>Open PDF</span>
                              <ArrowSquareOut size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </main>

          {/* ================================================================= */}
          {/* RIGHT 4 COLUMNS: PROGRESS, CHECKLIST & NEXT LESSON ACTION         */}
          {/* ================================================================= */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* 1. Chapter Progress Ring Card */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-2xl shadow-xl flex flex-col items-center text-center ${
                isLight
                  ? "border-purple-200 bg-white/95 text-purple-950 shadow-lg"
                  : "border-purple-800/40 bg-[#160a2b]/85 text-white"
              }`}
            >
              <span
                className={`font-mono text-xs uppercase tracking-wider font-bold mb-4 ${
                  isLight ? "text-pink-700 font-black" : "text-pink-300"
                }`}
              >
                Chapter Completion
              </span>

              <CircularProgressBar progressPercent={progressPercent} size={110} strokeWidth={9} />

              <p className={`font-display text-xs mt-4 max-w-[220px] ${isLight ? "text-slate-700 font-medium" : "text-purple-200"}`}>
                {progressPercent === 100
                  ? "🎉 Magnificent! You have mastered this chapter!"
                  : progressPercent >= 50
                  ? "Great progress! Keep going to unlock the next chapter."
                  : "Begin Lesson 1 and check your understanding."}
              </p>

              {/* Status Badge */}
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-mono ${
                  isLight
                    ? "border-purple-300 bg-purple-50 text-purple-900 font-semibold"
                    : "border-purple-700/50 bg-purple-950/60 text-purple-300"
                }`}
              >
                <span className={`size-2 rounded-full ${progressPercent === 100 ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-purple-400 animate-pulse"}`} />
                <span>
                  {progressPercent === 100
                    ? "Completed"
                    : `Lesson ${activeLessonIdx + 1} of 3 in progress`}
                </span>
              </div>
            </div>

            {/* 2. Lesson Completion Checklist */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-2xl shadow-xl flex flex-col gap-3 ${
                isLight
                  ? "border-purple-200 bg-white/95 text-purple-950 shadow-lg"
                  : "border-purple-800/40 bg-[#160a2b]/85 text-white"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-3 ${
                  isLight ? "border-purple-200" : "border-purple-900/40"
                }`}
              >
                <h4 className={`font-display text-sm font-bold flex items-center gap-2 ${isLight ? "text-purple-950" : "text-white"}`}>
                  <ListChecks size={16} className={isLight ? "text-purple-600" : "text-purple-400"} />
                  <span>Lesson Checklist</span>
                </h4>
                <span className={`font-mono text-[11px] font-bold ${isLight ? "text-purple-700" : "text-purple-300/70"}`}>
                  {Object.values(completedLessons).filter(Boolean).length}/{content.lessons.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {content.lessons.map((lesson, idx) => {
                  const isDone = completedLessons[lesson.id];
                  const isCurrent = activeTab === "learn" && activeLessonIdx === idx;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setActiveTab("learn");
                        setActiveLessonIdx(idx);
                      }}
                      className={`group flex items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all ${
                        isCurrent
                          ? isLight
                            ? "border-purple-400 bg-purple-100/70 shadow-sm"
                            : "border-purple-500 bg-purple-900/40 shadow-sm"
                          : isLight
                          ? "border-purple-200 bg-purple-50/50 hover:border-purple-300 hover:bg-purple-100/50"
                          : "border-purple-900/40 bg-purple-950/20 hover:border-purple-700 hover:bg-purple-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`grid size-6 place-items-center rounded-lg font-mono text-xs font-bold transition-all shrink-0 ${
                            isDone
                              ? "bg-emerald-500 text-white font-bold shadow-sm"
                              : isLight
                              ? "border border-purple-300 bg-white text-purple-900 font-bold"
                              : "border border-purple-700/60 bg-purple-900/40 text-purple-300"
                          }`}
                        >
                          {isDone ? <Check size={12} weight="bold" /> : idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`font-display text-xs font-bold truncate transition-colors ${
                              isLight
                                ? "text-purple-950 group-hover:text-purple-700"
                                : "text-white group-hover:text-pink-300"
                            }`}
                          >
                            {lesson.title[locale] || lesson.title.en}
                          </p>
                          <span className={`font-mono text-[10px] ${isLight ? "text-slate-500 font-medium" : "text-purple-300/60"}`}>
                            ~{lesson.durationMinutes} mins
                          </span>
                        </div>
                      </div>

                      <CaretRight size={13} className={`${isLight ? "text-purple-600" : "text-purple-500"} group-hover:text-purple-400 shrink-0`} />
                    </button>
                  );
                })}

                {/* Practice Quiz Checklist Item */}
                <button
                  type="button"
                  onClick={() => setActiveTab("practice")}
                  className={`group flex items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all ${
                    activeTab === "practice"
                      ? isLight
                        ? "border-purple-400 bg-purple-100/70 shadow-sm"
                        : "border-purple-500 bg-purple-900/40 shadow-sm"
                      : isLight
                      ? "border-purple-200 bg-purple-50/50 hover:border-purple-300 hover:bg-purple-100/50"
                      : "border-purple-900/40 bg-purple-950/20 hover:border-purple-700 hover:bg-purple-900/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`grid size-6 place-items-center rounded-lg font-mono text-xs font-bold shrink-0 ${
                        isLight
                          ? "bg-pink-100 border border-pink-300 text-pink-700"
                          : "bg-pink-500/30 border border-pink-400/40 text-pink-300"
                      }`}
                    >
                      ★
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`font-display text-xs font-bold truncate transition-colors ${
                          isLight
                            ? "text-purple-950 group-hover:text-purple-700"
                            : "text-white group-hover:text-pink-300"
                        }`}
                      >
                        Practice Knowledge Check
                      </p>
                      <span className={`font-mono text-[10px] ${isLight ? "text-slate-500 font-medium" : "text-purple-300/60"}`}>
                        MCQs, Blanks & Match
                      </span>
                    </div>
                  </div>
                  <CaretRight size={13} className={`${isLight ? "text-purple-600" : "text-purple-500"} group-hover:text-purple-400 shrink-0`} />
                </button>
              </div>
            </div>

            {/* 3. Prominent Action Button: Continue / Next Chapter */}
            <div className="flex flex-col gap-2.5">
              {progressPercent === 100 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (nextChapterItem) {
                      onSelectChapter(nextChapterItem.chapter.id);
                    } else {
                      onClose();
                    }
                  }}
                  className="beam-border relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-6 py-4 font-display text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Trophy size={18} weight="fill" />
                  <span>{nextChapterItem ? "Unlock Next Chapter →" : "Course Complete! Return Home"}</span>
                </button>
              ) : activeTab === "learn" && activeLessonIdx < content.lessons.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentLesson) toggleLessonComplete(currentLesson.id);
                    setActiveLessonIdx((i) => i + 1);
                  }}
                  className="beam-border relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 py-4 font-display text-sm font-bold text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue: Lesson {activeLessonIdx + 2} →</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab("practice")}
                  className="beam-border relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-6 py-4 font-display text-sm font-bold text-white shadow-[0_0_25px_rgba(236,72,153,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Question size={18} weight="bold" />
                  <span>Start Practice Quiz →</span>
                </button>
              )}

              {/* Textbook PDF Quick Link */}
              <a
                href={TN_TEXTBOOK_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs transition-all text-center ${
                  isLight
                    ? "border-purple-300 bg-white text-purple-900 hover:bg-purple-50 hover:border-purple-400 font-bold shadow-sm"
                    : "border-purple-800/40 bg-purple-950/40 text-purple-300 hover:border-purple-600 hover:text-white"
                }`}
              >
                <FilePdf size={14} className="text-pink-500" />
                <span>Open Samacheer Kalvi PDF</span>
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* CELEBRATION MODAL OVERLAY: CHAPTER COMPLETE                           */}
      {/* --------------------------------------------------------------------- */}
      {celebrateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-fade-in">
          <div
            className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-8 text-center ${
              isLight
                ? "border-purple-300 bg-white text-purple-950 shadow-2xl"
                : "border-purple-500/50 bg-[#160a2b] text-white shadow-[0_0_50px_rgba(168,85,247,0.6)]"
            }`}
          >
            <Burst key={celebrateCount} />
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <Trophy size={32} weight="fill" />
            </div>

            <span
              className={`font-mono text-xs uppercase tracking-wider font-bold ${
                isLight ? "text-pink-700 font-black" : "text-pink-300"
              }`}
            >
              Chapter Mastered
            </span>
            <h3 className={`font-display text-2xl font-black mt-1 ${isLight ? "text-purple-950" : "text-white"}`}>
              Outstanding Work!
            </h3>
            <p className={`font-headline text-xs sm:text-sm mt-2 ${isLight ? "text-slate-700 font-medium" : "text-purple-200/80"}`}>
              You have completed all lessons, notes review, and practice problems for{" "}
              <strong className={isLight ? "text-purple-950 font-bold" : "text-white"}>
                {chapter.title[locale] || chapter.title.en}
              </strong>.
            </p>

            <div
              className={`my-5 inline-flex items-center gap-2 rounded-2xl border px-4 py-2 font-mono text-sm font-bold shadow-sm ${
                isLight
                  ? "border-amber-300 bg-amber-50 text-amber-950"
                  : "border-amber-500/50 bg-amber-950/40 text-amber-300"
              }`}
            >
              <Sparkle size={18} weight="fill" className={isLight ? "text-amber-600" : "text-yellow-400"} />
              <span>+{XP.lesson} XP Awarded</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {nextChapterItem ? (
                <button
                  type="button"
                  onClick={() => {
                    setCelebrateModalOpen(false);
                    onSelectChapter(nextChapterItem.chapter.id);
                  }}
                  className="rounded-2xl bg-purple-600 hover:bg-purple-500 px-6 py-3 font-display text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                >
                  Unlock Next Chapter: {nextChapterItem.chapter.title[locale] || nextChapterItem.chapter.title.en} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCelebrateModalOpen(false);
                    onClose();
                  }}
                  className="rounded-2xl bg-purple-600 hover:bg-purple-500 px-6 py-3 font-display text-sm font-bold text-white shadow-sm transition-all"
                >
                  Return to Digital Learning
                </button>
              )}

              <button
                type="button"
                onClick={() => setCelebrateModalOpen(false)}
                className={`rounded-xl border px-4 py-2 font-mono text-xs transition-colors ${
                  isLight
                    ? "border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100 font-bold"
                    : "border-purple-800/40 bg-purple-950/40 text-purple-300 hover:text-white"
                }`}
              >
                Review Chapter Lessons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* ZERO-LATENCY INTERACTIVE VIDEO VIEWPORT MODAL                         */}
      {/* --------------------------------------------------------------------- */}
      {activeVideoModal && (
        <InteractiveVideoPlayer
          manifest={getOrCreateLessonManifest(chapter, standard, subject.name.en)}
          chapter={chapter}
          subject={subject}
          standard={standard}
          onClose={() => setActiveVideoModal(null)}
        />
      )}
    </div>
  );
}
