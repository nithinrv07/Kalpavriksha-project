"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  Atom,
  BookOpen,
  Books,
  Calculator,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  Clock,
  Desktop,
  FilePdf,
  Flask,
  GlobeHemisphereWest,
  PencilSimple,
  PlayCircle,
  Question,
  SpeakerHigh,
  Stop,
  Translate,
  WarningCircle,
  X,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Burst } from "@/components/burst";
import { GrowthStage, useHydrated } from "@/components/learner-setup";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { KaraokeLines, useReadAloud } from "@/components/read-aloud";
import { authService } from "@/lib/auth-service";
import { BAND_INFO } from "@/lib/bands";
import {
  getChapterById,
  getStandardCurriculum,
  getSubjectsForStandard,
  isSupportedStandard,
  SUPPORTED_STANDARDS,
  TN_TEXTBOOK_PORTAL_URL,
  type CurriculumChapter,
  type CurriculumSubject,
  type SupportedStandard,
} from "@/lib/curriculum";
import { completeLesson, localDay, setLastAccessed, XP, type Band, type Profile } from "@/lib/progress";

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
// Standard Switcher Modal
// ----------------------------------------------------------------------------
function StandardSwitcherModal({
  currentGrade,
  isOpen,
  onClose,
  onSelectStandard,
}: {
  currentGrade: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectStandard: (std: number) => void;
}) {
  const { locale } = useLocale();
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Change school standard"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="pop-in relative w-full max-w-xl rounded-3xl border border-line-strong bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">
              {locale === "ta" ? "வகுப்பை மாற்று" : locale === "hi" ? "कक्षा बदलें" : "Select Your Standard"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {locale === "ta"
                ? "வகுப்பு 4 முதல் 12 வரையிலான பாடங்கள் மாற்றப்படும்."
                : locale === "hi"
                  ? "कक्षा 4 से 12 तक के अनुसार पाठ्यक्रम प्रदर्शित होगा।"
                  : "Switching standard dynamically updates your subjects, chapters, and textbooks."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {SUPPORTED_STANDARDS.map((std) => {
            const isSelected = std === currentGrade;
            return (
              <button
                key={std}
                type="button"
                onClick={() => {
                  onSelectStandard(std);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-violet bg-violet-deep/60 text-violet-ink shadow-[0_0_20px_-5px_var(--violet)]"
                    : "border-line bg-surface-2 hover:border-line-strong hover:bg-white/[0.04]"
                }`}
              >
                <span className="font-mono text-[10px] text-muted">Class</span>
                <span className="font-display text-2xl font-bold">{std}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-5 py-2 font-mono text-xs text-muted hover:text-text"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Chapter Content Viewer
// ----------------------------------------------------------------------------
function ChapterViewer({
  standard,
  subject,
  chapter,
  onBack,
  onOpenChapter,
}: {
  standard: number;
  subject: CurriculumSubject;
  chapter: CurriculumChapter;
  onBack: () => void;
  onOpenChapter: (chId: string) => void;
}) {
  const { locale } = useLocale();
  const progress = useProgress();
  const { state, play, stop } = useReadAloud();
  const [slow, setSlow] = useState(false);
  const [celebrate, setCelebrate] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const done = progress.lessonsDone.includes(chapter.id);
  const reading = state.id === chapter.id;

  const currentIndex = subject.chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? subject.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < subject.chapters.length - 1 ? subject.chapters[currentIndex + 1] : null;

  const markComplete = () => {
    updateProgress((p) => {
      let next = completeLesson(p, chapter.id, localDay());
      next = setLastAccessed(next, {
        standard,
        subjectId: subject.id,
        chapterId: chapter.id,
      });
      return next;
    });
    setCelebrate((n) => n + 1);
  };

  const handleAnswerSelect = (qId: string, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="fade-up flex flex-col gap-6">
      {/* Top navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to {subject.name[locale]}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-violet-deep/30 px-3 py-1 font-mono text-xs text-violet-ink">
            Class {standard}
          </span>
          <span className="rounded-full bg-white/[0.04] px-3 py-1 font-mono text-xs text-muted">
            Chapter {chapter.chapterNumber} of {subject.chapters.length}
          </span>
        </div>
      </div>

      {/* Chapter Title & Header */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              style={{ "--accent": subject.accent } as React.CSSProperties}
              className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]"
            >
              {subject.name[locale]} · Chapter {chapter.chapterNumber}
            </span>
            <h2 className="mt-1 font-display text-[clamp(26px,3.5vw,42px)] font-bold tracking-tight text-text">
              {chapter.title[locale]}
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
              {chapter.summary[locale]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
              <Clock size={15} />
              {chapter.estimatedMinutes} mins
            </span>
            {done && (
              <span className="flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 font-mono text-xs text-success">
                <CheckCircle size={15} weight="fill" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Read-Aloud Audio Controls */}
        {chapter.lessonLines && chapter.lessonLines.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/50 pt-5">
            <button
              type="button"
              onClick={() =>
                reading
                  ? stop()
                  : play(chapter.id, chapter.lessonLines, chapter.lessonLang, { rate: slow ? 0.8 : 1 })
              }
              className={`inline-flex h-11 items-center gap-2 rounded-full px-5 font-mono text-xs transition-colors ${
                reading
                  ? "bg-white/[0.1] text-text"
                  : "bg-violet text-bg hover:brightness-110"
              }`}
            >
              {reading ? <Stop size={16} weight="fill" /> : <SpeakerHigh size={16} weight="fill" />}
              {reading ? "Stop Audio" : "Listen / Read Aloud"}
            </button>

            <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 font-mono text-xs text-muted has-[:checked]:border-violet has-[:checked]:text-text">
              <input
                type="checkbox"
                checked={slow}
                onChange={(e) => setSlow(e.target.checked)}
                className="accent-violet"
              />
              Slower
            </label>

            {reading && state.silent && (
              <span className="text-xs text-amber">
                Speech audio synthesis unavailable on this browser.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lesson Content Text with Karaoke lines */}
      {chapter.lessonLines && chapter.lessonLines.length > 0 && (
        <div className="rounded-3xl border border-line bg-bg/60 p-6 sm:p-8">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">
            Lesson Core Concepts & Text
          </h3>
          <KaraokeLines
            lines={chapter.lessonLines}
            lang={chapter.lessonLang}
            activeLine={reading ? state.line : -1}
            activeWord={reading ? state.word : -1}
            className="flex flex-col gap-3 font-display text-[clamp(18px,2.2vw,24px)] leading-relaxed text-text"
          />
        </div>
      )}

      {/* Available Resources (PDF, Video, Links) */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted">
          Available Learning Resources & Textbooks
        </h3>
        <p className="mt-1 text-xs text-muted">
          Official Tamil Nadu School Textbooks repository & study materials for Class {standard}.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {/* Main Tamil Nadu Textbook portal link */}
          <a
            href={TN_TEXTBOOK_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 p-4 transition-all hover:border-violet/60 hover:bg-violet-deep/15"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-violet/15 text-violet">
                <FilePdf size={22} weight="duotone" />
              </span>
              <div>
                <p className="text-sm font-medium text-text group-hover:text-violet-ink">
                  TN Samacheer Textbook PDF
                </p>
                <p className="font-mono text-[11px] text-muted">
                  Official School Education Dept. Notes
                </p>
              </div>
            </div>
            <ArrowSquareOut size={16} className="text-muted group-hover:text-violet" />
          </a>

          {/* Any specific chapter resources */}
          {chapter.resources.map((res) => (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 p-4 transition-all hover:border-violet/60 hover:bg-violet-deep/15"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-white/[0.06] text-text group-hover:text-violet">
                  {res.type === "pdf" ? (
                    <FilePdf size={20} />
                  ) : res.type === "video" ? (
                    <PlayCircle size={20} />
                  ) : (
                    <BookOpen size={20} />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-text group-hover:text-violet-ink">
                    {res.title[locale]}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {res.type.toUpperCase()} resource {res.durationMinutes ? `· ${res.durationMinutes} min` : ""}
                  </p>
                </div>
              </div>
              <ArrowSquareOut size={16} className="text-muted group-hover:text-violet" />
            </a>
          ))}
        </div>
      </div>

      {/* Practice Questions / Interactive Assessment */}
      {chapter.practiceQuestions && chapter.practiceQuestions.length > 0 && (
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-2 text-violet">
            <Question size={20} weight="fill" />
            <h3 className="font-mono text-xs uppercase tracking-wider">
              Practice Questions & Check for Understanding
            </h3>
          </div>

          <div className="mt-5 flex flex-col gap-6">
            {chapter.practiceQuestions.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.answerIndex;

              return (
                <div key={q.id} className="rounded-2xl border border-line/70 bg-surface-2 p-5">
                  <p className="text-[15px] font-medium text-text">
                    <span className="font-mono text-xs text-muted mr-2">Q{qIndex + 1}.</span>
                    {q.question[locale]}
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selected === optIndex;
                      let btnStyle = "border-line bg-surface text-muted hover:text-text hover:border-line-strong";

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
                          className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs transition-colors ${btnStyle}`}
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
                      className={`mt-4 rounded-xl border p-3 text-xs leading-relaxed ${
                        isCorrect
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-amber/30 bg-amber/10 text-amber"
                      }`}
                    >
                      <p className="font-bold">
                        {isCorrect ? "✓ Correct!" : "Review note:"}
                      </p>
                      <p className="mt-0.5">{q.explanation[locale]}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion & Next/Prev Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-surface p-6">
        <div>
          {prevChapter ? (
            <button
              type="button"
              onClick={() => onOpenChapter(prevChapter.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-xs text-muted hover:text-text"
            >
              <ArrowLeft size={14} />
              Previous Chapter
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-3">
          {done ? (
            <span className="relative inline-flex items-center gap-2 rounded-full bg-success/15 px-6 py-3 font-mono text-xs text-success">
              <CheckCircle size={18} weight="fill" />
              Lesson Completed (+{XP.lesson} XP)
              {celebrate > 0 && <Burst key={celebrate} />}
            </span>
          ) : (
            <button
              type="button"
              onClick={markComplete}
              className="beam-border inline-flex items-center gap-2 rounded-full bg-violet-deep px-7 py-3 font-mono text-xs text-violet-ink transition-transform hover:-translate-y-0.5"
            >
              <CheckCircle size={18} />
              Mark Chapter Complete (+{XP.lesson} XP)
            </button>
          )}

          {nextChapter && (
            <button
              type="button"
              onClick={() => onOpenChapter(nextChapter.id)}
              className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet-deep/30 px-5 py-3 font-mono text-xs text-violet-ink hover:bg-violet-deep"
            >
              Next Chapter
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Subject Chapter List View
// ----------------------------------------------------------------------------
function SubjectDetailView({
  standard,
  subject,
  onBack,
  onSelectChapter,
}: {
  standard: number;
  subject: CurriculumSubject;
  onBack: () => void;
  onSelectChapter: (chId: string) => void;
}) {
  const { locale } = useLocale();
  const progress = useProgress();

  const completedCount = subject.chapters.filter((c) =>
    progress.lessonsDone.includes(c.id),
  ).length;

  return (
    <div className="fade-up flex flex-col gap-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>All Subjects (Class {standard})</span>
        </button>

        <a
          href={TN_TEXTBOOK_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet-deep/20 px-4 py-1.5 font-mono text-xs text-violet-ink hover:bg-violet-deep"
        >
          <FilePdf size={15} />
          Tamil Nadu Textbook PDF Portal
          <ArrowSquareOut size={13} />
        </a>
      </div>

      {/* Subject Banner */}
      <div
        style={{ "--sub-accent": subject.accent } as React.CSSProperties}
        className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--sub-accent)_16%,transparent)] text-[var(--sub-accent)]">
            <SubjectIcon icon={subject.icon} className="size-8" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--sub-accent)]">
              Class {standard} · {subject.code}
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-text">
              {subject.name[locale]}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-muted">
              {subject.description[locale]}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-text">
              {completedCount}/{subject.chapters.length}
            </span>
            <p className="font-mono text-[11px] text-muted">Chapters done</p>
          </div>
        </div>
      </div>

      {/* Chapter Cards List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted">
          Chapters & Learning Modules
        </h3>

        {subject.chapters.map((ch) => {
          const isDone = progress.lessonsDone.includes(ch.id);
          return (
            <div
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] font-mono text-xs text-muted group-hover:bg-violet-deep group-hover:text-violet-ink">
                  {ch.chapterNumber}
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-base font-medium text-text group-hover:text-violet-ink">
                    {ch.title[locale]}
                  </h4>
                  <p className="truncate text-xs text-muted">{ch.summary[locale]}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden items-center gap-1 font-mono text-xs text-muted sm:flex">
                  <Clock size={13} />
                  {ch.estimatedMinutes}m
                </span>
                {isDone ? (
                  <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 font-mono text-[11px] text-success">
                    <CheckCircle size={14} weight="fill" />
                    Done
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-mono text-xs text-muted group-hover:text-text">
                    Open <CaretRight size={13} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Main Personalised Learn Screen Inner Container
// ----------------------------------------------------------------------------
function PersonalisedLearnDashboard({
  band,
  profile,
}: {
  band: Band;
  profile: Profile;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const progress = useProgress();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Read standard from profile (fallback to 6 if invalid)
  const currentStandard = isSupportedStandard(profile.grade) ? profile.grade : 6;

  // Active curriculum for this standard
  const curriculum = getStandardCurriculum(currentStandard);
  const subjects = useMemo(() => getSubjectsForStandard(currentStandard), [currentStandard]);

  // Query parameter state (subject & chapter)
  const querySubject = searchParams?.get("subject");
  const queryChapter = searchParams?.get("chapter");

  // Determine active view
  const activeSubject = querySubject ? subjects.find((s) => s.id === querySubject) : null;
  const activeChapterData =
    querySubject && queryChapter
      ? getChapterById(currentStandard, querySubject, queryChapter)
      : null;

  // Total chapter counts for standard
  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);
  const completedChaptersCount = subjects
    .flatMap((s) => s.chapters)
    .filter((c) => progress.lessonsDone.includes(c.id)).length;

  // Continue Learning data
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
    // Fallback recommended starter: first subject, first chapter
    const firstSub = subjects[0];
    const firstCh = firstSub?.chapters[0];
    if (firstSub && firstCh) {
      return {
        subject: firstSub,
        chapter: firstCh,
        isStarter: true,
      };
    }
    return null;
  }, [profile.lastAccessed, currentStandard, subjects]);

  const handleStandardChange = (newStd: number) => {
    authService.updateStandard(newStd);
    router.replace("/m/learn");
  };

  const handleOpenSubject = (subjectId: string) => {
    router.push(`/m/learn?subject=${subjectId}`);
  };

  const handleOpenChapter = (chapterId: string, subjectId?: string) => {
    const sId = subjectId || activeSubject?.id || continueRecord?.subject.id || "";
    router.push(`/m/learn?subject=${sId}&chapter=${chapterId}`);
  };

  const handleBackToSubjects = () => {
    router.push("/m/learn");
  };

  const handleBackToSubjectChapters = () => {
    if (activeSubject) {
      router.push(`/m/learn?subject=${activeSubject.id}`);
    } else {
      router.push("/m/learn");
    }
  };

  // If a specific chapter is open:
  if (activeChapterData) {
    return (
      <ChapterViewer
        standard={currentStandard}
        subject={activeChapterData.subject}
        chapter={activeChapterData.chapter}
        onBack={handleBackToSubjectChapters}
        onOpenChapter={(chId) => handleOpenChapter(chId, activeChapterData.subject.id)}
      />
    );
  }

  // If a specific subject is open:
  if (activeSubject) {
    return (
      <SubjectDetailView
        standard={currentStandard}
        subject={activeSubject}
        onBack={handleBackToSubjects}
        onSelectChapter={(chId) => handleOpenChapter(chId, activeSubject.id)}
      />
    );
  }

  // Otherwise: Root Personalised Dashboard
  return (
    <div className="flex flex-col gap-8">
      <StandardSwitcherModal
        currentGrade={currentStandard}
        isOpen={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        onSelectStandard={handleStandardChange}
      />

      {/* 1. Personalised Student Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-violet">
                {locale === "ta" ? "தனிப்பயனாக்கப்பட்ட பலகை" : locale === "hi" ? "व्यक्तिगत डैशबोर्ड" : "Personalised Dashboard"}
              </span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-muted">
                Samacheer Kalvi
              </span>
            </div>

            <h2 className="mt-1 font-display text-[clamp(26px,4vw,38px)] font-bold tracking-tight text-text">
              {locale === "ta"
                ? `மீண்டும் வருக, ${profile.name}!`
                : locale === "hi"
                  ? `स्वागत है, ${profile.name}!`
                  : `Welcome back, ${profile.name}!`}
            </h2>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Your Standard:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet-deep/30 px-3 py-0.5 font-mono text-xs font-semibold text-violet-ink">
                Class {currentStandard} · {BAND_INFO[band].name[locale]}
              </span>
              <button
                type="button"
                onClick={() => setSwitcherOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-violet underline underline-offset-4 hover:text-violet-ink transition-colors"
              >
                <PencilSimple size={12} />
                Change Standard
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
              <span className="font-mono text-xl font-bold text-violet-ink">
                {completedChaptersCount}/{totalChapters}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Completed
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
              <span className="font-mono text-xl font-bold text-amber">
                {progress.xp}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Total XP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personalised Continue Learning Section */}
      {continueRecord && (
        <div className="relative overflow-hidden rounded-3xl border border-violet/30 bg-gradient-to-r from-violet-deep/20 via-surface to-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet/20 text-violet">
                <PlayCircle size={28} weight="duotone" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-violet">
                  {continueRecord.isStarter ? "Start your first lesson" : "Continue Learning"}
                </p>
                <h3 className="font-display text-xl font-bold text-text">
                  {continueRecord.chapter.title[locale]}
                </h3>
                <p className="text-xs text-muted">
                  {continueRecord.subject.name[locale]} · Chapter {continueRecord.chapter.chapterNumber}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const rec = continueRecord;
                if (rec) handleOpenChapter(rec.chapter.id, rec.subject.id);
              }}
              className="beam-border inline-flex h-12 items-center gap-2 rounded-full bg-violet-deep px-6 font-mono text-xs font-semibold text-violet-ink transition-transform hover:-translate-y-0.5"
            >
              {continueRecord.isStarter ? "Start Lesson →" : "Continue →"}
            </button>
          </div>
        </div>
      )}

      {/* 3. Your Subjects for Class N */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-text">
              {locale === "ta"
                ? `வகுப்பு ${currentStandard} பாடங்கள்`
                : locale === "hi"
                  ? `कक्षा ${currentStandard} के विषय`
                  : `Your Subjects — Class ${currentStandard}`}
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              {locale === "ta"
                ? "தமிழ்நாடு மாநில பாடத்திட்டத்தின்படி வடிவமைக்கப்பட்ட பாடங்கள்."
                : locale === "hi"
                  ? "तमिलनाडु स्टेट बोर्ड के अनुसार विषय और अध्याय।"
                  : "Curriculum configured specifically for Class " + currentStandard + "."}
            </p>
          </div>

          <a
            href={TN_TEXTBOOK_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-muted hover:text-text hover:border-violet transition-colors"
          >
            <FilePdf size={14} />
            All Textbooks
            <ArrowSquareOut size={12} />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub) => {
            const completedCount = sub.chapters.filter((c) =>
              progress.lessonsDone.includes(c.id),
            ).length;

            return (
              <div
                key={sub.id}
                onClick={() => handleOpenSubject(sub.id)}
                style={{ "--sub-accent": sub.accent } as React.CSSProperties}
                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2 hover:shadow-[0_20px_60px_-25px_var(--sub-accent)]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--sub-accent)_16%,transparent)] text-[var(--sub-accent)] transition-transform duration-300 group-hover:scale-110">
                      <SubjectIcon icon={sub.icon} className="size-6" />
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {completedCount}/{sub.chapters.length} Done
                    </span>
                  </div>

                  <h4 className="mt-4 font-display text-xl font-bold tracking-tight text-text group-hover:text-violet-ink">
                    {sub.name[locale]}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                    {sub.description[locale]}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 font-mono text-xs">
                  <span className="text-muted">{sub.chapters.length} Chapters</span>
                  <span className="flex items-center gap-1 text-[var(--sub-accent)] group-hover:translate-x-1 transition-transform">
                    View Chapters <CaretRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
          Select your school standard (Class 4 to Class 12) to access your personalised curriculum.
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

  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl border border-line bg-surface/60" />}>
      <PersonalisedLearnDashboard band={band} profile={profile} />
    </Suspense>
  );
}

export default LearnScreen;
