import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n";
import { AREAS, BANDS } from "@/lib/progress";
import { QUIZ, SONGS } from "./gk-songs/content";
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
