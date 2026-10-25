import { describe, expect, it } from "vitest";
import { EMPTY_PROGRESS, completeLesson, localDay, recordQuiz, type Progress } from "./progress";
import { getLearningTrackStats } from "./learning-track";
import { getSubjectsForStandard } from "./curriculum";

const TODAY = localDay();

describe("getLearningTrackStats", () => {
  it("computes stats for default standard 6 when no profile is present", () => {
    const stats = getLearningTrackStats(EMPTY_PROGRESS);
    expect(stats.standard).toBe(6);
    expect(stats.totalChaptersInStandard).toBeGreaterThan(0);
    expect(stats.completedChaptersInStandard).toBe(0);
    expect(stats.standardPercentage).toBe(0);
    expect(stats.subjects.length).toBeGreaterThan(0);
    expect(stats.nextRecommendedChapter).toBeDefined();
  });

  it("dynamically reflects completed chapters in the current standard", () => {
    const std6Subjects = getSubjectsForStandard(6);
    const firstSubject = std6Subjects[0];
    const firstChapter = firstSubject?.chapters[0];
    const secondChapter = firstSubject?.chapters[1];

    expect(firstChapter).toBeDefined();
    expect(secondChapter).toBeDefined();

    let p: Progress = EMPTY_PROGRESS;
    p = completeLesson(p, firstChapter!.id, TODAY);

    const stats = getLearningTrackStats(p, 6);
    expect(stats.completedChaptersInStandard).toBe(1);
    expect(stats.totalLessonsDoneOverall).toBe(1);

    const sub = stats.subjects.find((s) => s.id === firstSubject!.id);
    expect(sub).toBeDefined();
    expect(sub?.completedChapters).toBe(1);
    expect(sub?.status).toBe("in-progress");

    // Recommends the next uncompleted chapter
    expect(stats.nextRecommendedChapter?.chapterId).toBe(secondChapter!.id);
  });

  it("handles profile with custom standard (e.g. Class 10)", () => {
    const progressWithProfile: Progress = {
      ...EMPTY_PROGRESS,
      profile: {
        name: "Ananya",
        studentId: "KV-2026-0001",
        avatar: "butterfly",
        grade: 10,
      },
    };

    const stats = getLearningTrackStats(progressWithProfile);
    expect(stats.standard).toBe(10);
    expect(stats.subjects.some((s) => s.id.includes("c10-math"))).toBe(true);
  });

  it("marks subject as completed when all chapters are done", () => {
    const std1Subjects = getSubjectsForStandard(1);
    const tamil = std1Subjects.find((s) => s.id === "c1-tamil");
    expect(tamil).toBeDefined();

    let p: Progress = {
      ...EMPTY_PROGRESS,
      profile: {
        name: "Kavi",
        studentId: "KV-2026-0002",
        avatar: "cat",
        grade: 1,
      },
    };

    for (const ch of tamil!.chapters) {
      p = completeLesson(p, ch.id, TODAY);
    }

    const stats = getLearningTrackStats(p, 1);
    const tamilProgress = stats.subjects.find((s) => s.id === "c1-tamil");
    expect(tamilProgress?.completedChapters).toBe(tamil!.chapters.length);
    expect(tamilProgress?.percentage).toBe(100);
    expect(tamilProgress?.isComplete).toBe(true);
    expect(tamilProgress?.status).toBe("completed");
  });

  it("tracks quiz high scores and study streak in learning stats", () => {
    let p = recordQuiz(EMPTY_PROGRESS, 9, 10, TODAY);
    p = completeLesson(p, "c6-science-ch1", TODAY);

    const stats = getLearningTrackStats(p, 6);
    expect(stats.quizBest).toBe(90);
    expect(stats.streakDays).toBe(1);
    expect(stats.xp).toBeGreaterThan(0);
  });

  it("identifies last accessed chapter when available in profile", () => {
    const p: Progress = {
      ...EMPTY_PROGRESS,
      profile: {
        name: "Dhivya",
        studentId: "KV-2026-0003",
        avatar: "bird",
        grade: 6,
        lastAccessed: {
          standard: 6,
          subjectId: "c6-math",
          chapterId: "c6-math-ch1",
          timestamp: "2026-10-23T10:00:00.000Z",
        },
      },
    };

    const stats = getLearningTrackStats(p);
    expect(stats.lastAccessed).toBeDefined();
    expect(stats.lastAccessed?.subjectId).toBe("c6-math");
    expect(stats.lastAccessed?.chapterId).toBe("c6-math-ch1");
    expect(stats.lastAccessed?.subjectName.en).toBeDefined();
    expect(stats.lastAccessed?.chapterTitle.en).toBeDefined();
  });
});
