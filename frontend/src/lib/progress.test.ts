import { describe, expect, it } from "vitest";
import {
  AREAS,
  BANDS,
  BAND_GRADES,
  EMPTY_PROGRESS,
  bandOf,
  XP,
  badges,
  completeLesson,
  levelOf,
  logActivity,
  parseProgress,
  recordQuiz,
  removeActivity,
  skillScores,
  streak,
} from "./progress";

const TODAY = "2026-10-21";

describe("bandOf", () => {
  it("maps every class 1-12 to exactly one band", () => {
    for (const band of BANDS) for (const g of BAND_GRADES[band]) expect(bandOf(g)).toBe(band);
    const all = BANDS.flatMap((b) => BAND_GRADES[b]);
    expect(all).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });
});

describe("levelOf", () => {
  it("starts at level 1 and levels up every 100 XP", () => {
    expect(levelOf(0)).toEqual({ level: 1, into: 0, span: 100 });
    expect(levelOf(250)).toEqual({ level: 3, into: 50, span: 100 });
  });
});

describe("streak", () => {
  it("counts consecutive days ending today", () => {
    expect(streak(["2026-10-19", "2026-10-20", "2026-10-21"], TODAY)).toBe(3);
  });

  it("keeps a streak alive until the day is over", () => {
    expect(streak(["2026-10-19", "2026-10-20"], TODAY)).toBe(2);
  });

  it("breaks after a missed day", () => {
    expect(streak(["2026-10-17", "2026-10-18"], TODAY)).toBe(0);
    expect(streak([], TODAY)).toBe(0);
  });

  it("crosses month boundaries", () => {
    expect(streak(["2026-09-30", "2026-10-01"], "2026-10-01")).toBe(2);
  });
});

describe("progress reducers", () => {
  it("awards lesson XP only once per lesson", () => {
    const once = completeLesson(EMPTY_PROGRESS, "kural-1", TODAY);
    const twice = completeLesson(once, "kural-1", TODAY);
    expect(once.xp).toBe(XP.lesson);
    expect(twice).toBe(once);
    expect(once.activeDays).toEqual([TODAY]);
  });

  it("keeps the best quiz percentage and pays XP per correct answer", () => {
    const a = recordQuiz(EMPTY_PROGRESS, 8, 10, TODAY);
    const b = recordQuiz(a, 5, 10, TODAY);
    expect(b.quizBest).toBe(80);
    expect(b.xp).toBe(13 * XP.quizCorrect);
  });

  it("logs and removes activities", () => {
    const logged = logActivity(EMPTY_PROGRESS, { id: "a1", area: "sports", title: "Kabaddi", date: TODAY }, TODAY);
    expect(logged.activities).toHaveLength(1);
    expect(logged.xp).toBe(XP.activity);
    expect(removeActivity(logged, "a1").activities).toEqual([]);
  });
});

describe("skillScores", () => {
  it("returns 0..1 for every area and grows with activity", () => {
    const empty = skillScores(EMPTY_PROGRESS);
    expect(Object.keys(empty).sort()).toEqual([...AREAS].sort());
    const busy = [1, 2, 3].reduce(
      (p, i) => logActivity(p, { id: `s${i}`, area: "arts", title: "Kolam", date: TODAY }, TODAY),
      EMPTY_PROGRESS,
    );
    const scores = skillScores(busy);
    expect(scores.arts).toBeGreaterThan(empty.arts);
    for (const v of Object.values(scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("increases academics score when lessons are completed in Module 1", () => {
    const before = skillScores(EMPTY_PROGRESS);
    let p = EMPTY_PROGRESS;
    for (let i = 1; i <= 5; i++) {
      p = completeLesson(p, `lesson-${i}`, TODAY);
    }
    const after = skillScores(p);
    expect(after.academics).toBeGreaterThan(before.academics);
  });
});

describe("badges", () => {
  it("unlocks the first-leaf badge after one activity", () => {
    const before = badges(EMPTY_PROGRESS, TODAY).find((b) => b.id === "first-leaf");
    const p = logActivity(EMPTY_PROGRESS, { id: "a", area: "service", title: "Tree planting", date: TODAY }, TODAY);
    const after = badges(p, TODAY).find((b) => b.id === "first-leaf");
    expect(before?.earned).toBe(false);
    expect(after?.earned).toBe(true);
  });

  it("unlocks the scholar badge after 10 completed lessons", () => {
    let p = EMPTY_PROGRESS;
    for (let i = 1; i <= 10; i++) {
      p = completeLesson(p, `lesson-${i}`, TODAY);
    }
    const scholar = badges(p, TODAY).find((b) => b.id === "scholar");
    expect(scholar?.earned).toBe(true);
  });
});

describe("parseProgress", () => {
  it("falls back to empty progress on junk", () => {
    expect(parseProgress(null)).toEqual(EMPTY_PROGRESS);
    expect(parseProgress("nope")).toEqual(EMPTY_PROGRESS);
    expect(parseProgress({ version: 99 })).toEqual(EMPTY_PROGRESS);
  });

  it("drops malformed activities but keeps valid fields", () => {
    const parsed = parseProgress({
      ...EMPTY_PROGRESS,
      xp: 40,
      activities: [{ id: "ok", area: "arts", title: "Drawing", date: TODAY }, { id: 3, area: "space" }],
    });
    expect(parsed.xp).toBe(40);
    expect(parsed.activities.map((a) => a.id)).toEqual(["ok"]);
  });
});
