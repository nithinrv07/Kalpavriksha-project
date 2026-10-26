import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n";
import { AREAS, BANDS } from "@/lib/progress";
import {
  bandToGkLevel,
  gkLevelToBand,
  GK_LEVEL_CONFIG,
  GK_LEVELS,
  PRIMARY_QUIZ,
  INTERMEDIATE_QUIZ,
  ADVANCED_QUIZ,
  QUESTION_SECONDS,
  QUIZ,
  SONGS,
} from "./gk-songs/content";
import { AREA_INFO, BADGE_INFO } from "./grow/content";
import { LESSONS, lessonText, lessonsFor } from "./learn/lessons";

const filled = (s: string) => s.trim().length > 0;

describe("learn lessons", () => {
  it("gives every band at least four lessons (the bookworm badge needs four)", () => {
    for (const band of BANDS) expect(lessonsFor(band).length).toBeGreaterThanOrEqual(4);
  });

  it("has unique ids and translated titles, notes and text", () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
    for (const l of LESSONS) {
      for (const locale of LOCALES) {
        expect(filled(l.title[locale])).toBe(true);
        expect(filled(l.note[locale])).toBe(true);
        const { lines } = lessonText(l, locale);
        expect(lines.length).toBeGreaterThan(0);
        expect(lines.every(filled)).toBe(true);
      }
    }
  });
});

describe("GK quiz", () => {
  it("has questions for every band with a valid answer and full translations", () => {
    for (const band of BANDS) {
      const qs = QUIZ[band];
      expect(qs.length).toBeGreaterThanOrEqual(5);
      for (const q of qs) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
        for (const locale of LOCALES) {
          expect(filled(q.q[locale])).toBe(true);
          expect(filled(q.explain[locale])).toBe(true);
          expect(q.options.every((o) => filled(o[locale]))).toBe(true);
          // Options must be distinguishable in every language.
          expect(new Set(q.options.map((o) => o[locale])).size).toBe(4);
        }
      }
    }
  });

  it("uses unique question ids", () => {
    const ids = BANDS.flatMap((b) => QUIZ[b].map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("splits GK questions into three distinct levels: Primary, Intermediate, and Advanced", () => {
    expect(GK_LEVELS).toEqual(["primary", "intermediate", "advanced"]);

    // Level 1: Primary Level
    expect(PRIMARY_QUIZ.length).toBe(12);
    expect(QUIZ.primary.length).toBe(12);
    expect(QUESTION_SECONDS.primary).toBeNull(); // Untimed for foundational learners
    expect(GK_LEVEL_CONFIG.primary.name.en).toBe("Primary Level");
    expect(GK_LEVEL_CONFIG.primary.name.ta).toBe("ஆரம்ப நிலை");

    // Level 2: Intermediate Level
    expect(INTERMEDIATE_QUIZ.length).toBe(12);
    expect(QUIZ.intermediate.length).toBe(12);
    expect(QUESTION_SECONDS.intermediate).toBe(45);
    expect(GK_LEVEL_CONFIG.intermediate.name.en).toBe("Intermediate Level");
    expect(GK_LEVEL_CONFIG.intermediate.name.ta).toBe("இடைநிலை");

    // Level 3: Advanced Level
    expect(ADVANCED_QUIZ.length).toBe(12);
    expect(QUIZ.advanced.length).toBe(12);
    expect(QUESTION_SECONDS.advanced).toBe(30);
    expect(GK_LEVEL_CONFIG.advanced.name.en).toBe("Advanced Level");
    expect(GK_LEVEL_CONFIG.advanced.name.ta).toBe("மேல்நிலை");

    // Bi-directional level mappings
    expect(bandToGkLevel("junior")).toBe("primary");
    expect(bandToGkLevel("middle")).toBe("intermediate");
    expect(bandToGkLevel("senior")).toBe("advanced");

    expect(gkLevelToBand("primary")).toBe("junior");
    expect(gkLevelToBand("intermediate")).toBe("middle");
    expect(gkLevelToBand("advanced")).toBe("senior");

    // All questions in each level have valid answers and full translations
    for (const lvl of GK_LEVELS) {
      const questions = QUIZ[lvl];
      expect(questions.length).toBe(12);
      for (const q of questions) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(4);
        for (const loc of LOCALES) {
          expect(filled(q.q[loc])).toBe(true);
          expect(filled(q.explain[loc])).toBe(true);
          expect(q.options.every((o) => filled(o[loc]))).toBe(true);
          expect(new Set(q.options.map((o) => o[loc])).size).toBe(4);
        }
      }
    }
  });
});

describe("songs and growth content", () => {
  it("translates song metadata and has lyrics", () => {
    for (const s of SONGS) {
      expect(s.lines.length).toBeGreaterThan(0);
      for (const locale of LOCALES) {
        for (const text of [s.title, s.kind, s.credit, s.meaning, s.fact]) expect(filled(text[locale])).toBe(true);
      }
    }
  });

  it("describes every growth area and badge in every locale", () => {
    for (const a of AREAS) for (const locale of LOCALES) expect(filled(AREA_INFO[a].name[locale])).toBe(true);
    for (const b of Object.values(BADGE_INFO)) for (const locale of LOCALES) expect(filled(b.how[locale])).toBe(true);
  });
});
