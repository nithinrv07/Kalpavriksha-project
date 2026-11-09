import type { LocalizedText } from "@/lib/i18n";
import { levelOf, streak, localDay, type Progress } from "@/lib/progress";
import {
  getSubjectsForStandard,
  getChapterById,
  isSupportedStandard,
  SUPPORTED_STANDARDS,
  type SupportedStandard,
} from "@/lib/curriculum";

export type SubjectProgress = {
  readonly id: string;
  readonly name: LocalizedText;
  readonly code: string;
  readonly accent: string;
  readonly icon: string;
  readonly totalChapters: number;
  readonly completedChapters: number;
  readonly percentage: number;
  readonly isComplete: boolean;
  readonly status: "completed" | "in-progress" | "not-started";
};

export type CompletedChapterDetail = {
  readonly chapterId: string;
  readonly chapterNumber?: number;
  readonly chapterTitle: LocalizedText;
  readonly subjectId: string;
  readonly subjectName: LocalizedText;
  readonly standard: number;
  readonly accent: string;
  readonly icon: string;
  readonly reviewHref: string;
};

export type LearningTrackStats = {
  readonly standard: SupportedStandard;
  readonly totalChaptersInStandard: number;
  readonly completedChaptersInStandard: number;
  readonly standardPercentage: number;
  readonly totalLessonsDoneOverall: number;
  readonly quizBest: number;
  readonly xp: number;
  readonly level: { level: number; into: number; span: number };
  readonly streakDays: number;
  readonly subjects: readonly SubjectProgress[];
  readonly completedChaptersList: readonly CompletedChapterDetail[];
  readonly lastAccessed?: {
    readonly standard: number;
    readonly subjectId: string;
    readonly chapterId: string;
    readonly subjectName: LocalizedText;
    readonly chapterTitle: LocalizedText;
    readonly timestamp: string;
  };
  readonly nextRecommendedChapter?: {
    readonly standard: number;
    readonly subjectId: string;
    readonly chapterId: string;
    readonly subjectName: LocalizedText;
    readonly chapterTitle: LocalizedText;
  };
};

export function getLearningTrackStats(
  progress: Progress,
  standardOverride?: number,
  today = localDay(),
): LearningTrackStats {
  // Resolve standard (profile grade -> last accessed standard -> override -> default 6)
  let standard: SupportedStandard = 6;
  if (standardOverride && isSupportedStandard(standardOverride)) {
    standard = standardOverride;
  } else if (progress.profile && isSupportedStandard(progress.profile.grade)) {
    standard = progress.profile.grade;
  } else if (
    progress.profile?.lastAccessed &&
    isSupportedStandard(progress.profile.lastAccessed.standard)
  ) {
    standard = progress.profile.lastAccessed.standard;
  }

  const subjects = getSubjectsForStandard(standard);
  const doneSet = new Set(progress.lessonsDone);

  const subjectProgressList: SubjectProgress[] = subjects.map((s) => {
    const total = s.chapters.length;
    const completed = s.chapters.filter((ch) => doneSet.has(ch.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isComplete = total > 0 && completed === total;
    const status: SubjectProgress["status"] = isComplete
      ? "completed"
      : completed > 0
        ? "in-progress"
        : "not-started";

    return {
      id: s.id,
      name: s.name,
      code: s.code,
      accent: s.accent || "var(--violet)",
      icon: s.icon || "book",
      totalChapters: total,
      completedChapters: completed,
      percentage,
      isComplete,
      status,
    };
  });

  const totalChaptersInStandard = subjectProgressList.reduce(
    (acc, curr) => acc + curr.totalChapters,
    0,
  );
  const completedChaptersInStandard = subjectProgressList.reduce(
    (acc, curr) => acc + curr.completedChapters,
    0,
  );
  const standardPercentage =
    totalChaptersInStandard > 0
      ? Math.round((completedChaptersInStandard / totalChaptersInStandard) * 100)
      : 0;

  // Resolve last accessed chapter metadata if present
  let lastAccessedMeta: LearningTrackStats["lastAccessed"];
  if (
    progress.profile?.lastAccessed &&
    progress.profile.lastAccessed.standard === standard
  ) {
    const data = getChapterById(
      standard,
      progress.profile.lastAccessed.subjectId,
      progress.profile.lastAccessed.chapterId,
    );
    if (data) {
      lastAccessedMeta = {
        standard,
        subjectId: data.subject.id,
        chapterId: data.chapter.id,
        subjectName: data.subject.name,
        chapterTitle: data.chapter.title,
        timestamp: progress.profile.lastAccessed.timestamp,
      };
    }
  }

  // Resolve next recommended chapter
  let nextRecommended: LearningTrackStats["nextRecommendedChapter"];

  // 1. If last accessed chapter is incomplete, recommend continuing it
  if (
    lastAccessedMeta &&
    !doneSet.has(lastAccessedMeta.chapterId)
  ) {
    nextRecommended = {
      standard,
      subjectId: lastAccessedMeta.subjectId,
      chapterId: lastAccessedMeta.chapterId,
      subjectName: lastAccessedMeta.subjectName,
      chapterTitle: lastAccessedMeta.chapterTitle,
    };
  } else {
    // 2. Otherwise look for the next uncompleted chapter in the current standard
    for (const sub of subjects) {
      const nextUnfinished = sub.chapters.find((ch) => !doneSet.has(ch.id));
      if (nextUnfinished) {
        nextRecommended = {
          standard,
          subjectId: sub.id,
          chapterId: nextUnfinished.id,
          subjectName: sub.name,
          chapterTitle: nextUnfinished.title,
        };
        break;
      }
    }
  }

  return {
    standard,
    totalChaptersInStandard,
    completedChaptersInStandard,
    standardPercentage,
    totalLessonsDoneOverall: progress.lessonsDone.length,
    quizBest: progress.quizBest,
    xp: progress.xp,
    level: levelOf(progress.xp),
    streakDays: streak(progress.activeDays, today),
    subjects: subjectProgressList,
    completedChaptersList: getCompletedChaptersList(progress.lessonsDone, standard),
    lastAccessed: lastAccessedMeta,
    nextRecommendedChapter: nextRecommended,
  };
}

/**
 * Resolves all completed chapter IDs into human-readable details,
 * localized titles, subject names, accents, and classroom navigation URLs.
 */
export function getCompletedChaptersList(
  lessonsDone: readonly string[],
  preferredStandard?: number,
): readonly CompletedChapterDetail[] {
  const result: CompletedChapterDetail[] = [];
  const searchOrder =
    preferredStandard && isSupportedStandard(preferredStandard)
      ? [preferredStandard, ...SUPPORTED_STANDARDS.filter((s) => s !== preferredStandard)]
      : [...SUPPORTED_STANDARDS];

  for (const chId of lessonsDone) {
    let matched = false;
    for (const std of searchOrder) {
      const subjects = getSubjectsForStandard(std);
      for (const sub of subjects) {
        const ch = sub.chapters.find((c) => c.id === chId);
        if (ch) {
          result.push({
            chapterId: ch.id,
            chapterNumber: ch.chapterNumber,
            chapterTitle: ch.title,
            subjectId: sub.id,
            subjectName: sub.name,
            standard: std,
            accent: sub.accent || "var(--violet)",
            icon: sub.icon || "book",
            reviewHref: `/m/learn?subject=${sub.id}&chapter=${ch.id}`,
          });
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      const cleanTitle = chId.replace(/[-_]/g, " ");
      result.push({
        chapterId: chId,
        chapterTitle: { en: cleanTitle, ta: cleanTitle },
        subjectId: "general",
        subjectName: { en: "Digital Learning", ta: "டிஜிட்டல் கற்றல்" },
        standard: preferredStandard ?? 6,
        accent: "var(--violet)",
        icon: "book",
        reviewHref: `/m/learn`,
      });
    }
  }

  return result;
}
