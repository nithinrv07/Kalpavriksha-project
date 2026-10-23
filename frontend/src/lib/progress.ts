/**
 * Student progress shared by every module (XP, lessons, quiz, growth log).
 * Pure functions only: the browser store lives in `components/progress-store.ts`.
 * Kept on the device until the shared student profile has a server.
 */

import { LOCALES, type Locale } from "@/lib/i18n";

export const AREAS = ["academics", "sports", "arts", "leadership", "service", "communication"] as const;
export type Area = (typeof AREAS)[number];

export const AVATARS = ["cat", "dog", "bird", "butterfly", "fish", "rabbit", "horse", "cow"] as const;
export type AvatarId = (typeof AVATARS)[number];

/**
 * The app adapts to three school stages: look, content and difficulty all follow
 * the band chosen at entry. Boundaries follow the Indian primary / secondary /
 * higher-secondary split.
 */
export const BANDS = ["junior", "middle", "senior"] as const;
export type Band = (typeof BANDS)[number];
export const BAND_GRADES: Record<Band, readonly number[]> = {
  junior: [1, 2, 3, 4, 5],
  middle: [6, 7, 8, 9, 10],
  senior: [11, 12],
};

export function bandOf(grade: number): Band {
  if (grade <= 5) return "junior";
  if (grade <= 10) return "middle";
  return "senior";
}

export type Activity = { readonly id: string; readonly area: Area; readonly title: string; readonly date: string };

export type LastAccessed = {
  readonly standard: number;
  readonly subjectId: string;
  readonly chapterId: string;
  readonly timestamp: string;
};

export type Profile = {
  readonly name: string;
  readonly avatar: AvatarId;
  readonly grade: number;
  readonly studentId: string;
  readonly email?: string;
  readonly preferredLanguage?: Locale;
  readonly lastAccessed?: LastAccessed;
};

export type Progress = {
  readonly version: 1;
  readonly profile: Profile | null;
  readonly xp: number;
  readonly lessonsDone: readonly string[];
  readonly songsHeard: readonly string[];
  /** Best quiz result as a whole percentage. */
  readonly quizBest: number;
  readonly activities: readonly Activity[];
  /** Local dates (YYYY-MM-DD) on which the student earned anything. */
  readonly activeDays: readonly string[];
};

export const EMPTY_PROGRESS: Progress = {
  version: 1,
  profile: null,
  xp: 0,
  lessonsDone: [],
  songsHeard: [],
  quizBest: 0,
  activities: [],
  activeDays: [],
};

export const XP = { lesson: 20, song: 10, quizCorrect: 10, activity: 15 } as const;

const LEVEL_SPAN = 100;

export function levelOf(xp: number): { level: number; into: number; span: number } {
  return { level: Math.floor(xp / LEVEL_SPAN) + 1, into: xp % LEVEL_SPAN, span: LEVEL_SPAN };
}

/** Local calendar date as YYYY-MM-DD. */
export function localDay(date = new Date()): string {
  return date.toLocaleDateString("en-CA");
}

function previousDay(day: string): string {
  const d = new Date(`${day}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return localDay(d);
}

/** Consecutive active days ending today (or yesterday, so the streak survives until the day ends). */
export function streak(days: readonly string[], today: string): number {
  const set = new Set(days);
  let cursor = set.has(today) ? today : previousDay(today);
  let count = 0;
  while (set.has(cursor)) {
    count += 1;
    cursor = previousDay(cursor);
  }
  return count;
}

function markActive(p: Progress, today: string): readonly string[] {
  return p.activeDays.includes(today) ? p.activeDays : [...p.activeDays, today].slice(-60);
}

export function completeLesson(p: Progress, lessonId: string, today: string): Progress {
  if (p.lessonsDone.includes(lessonId)) return p;
  return { ...p, xp: p.xp + XP.lesson, lessonsDone: [...p.lessonsDone, lessonId], activeDays: markActive(p, today) };
}

export function completeSong(p: Progress, songId: string, today: string): Progress {
  if (p.songsHeard.includes(songId)) return p;
  return { ...p, xp: p.xp + XP.song, songsHeard: [...p.songsHeard, songId], activeDays: markActive(p, today) };
}

export function recordQuiz(p: Progress, correct: number, total: number, today: string): Progress {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  return {
    ...p,
    xp: p.xp + correct * XP.quizCorrect,
    quizBest: Math.max(p.quizBest, percent),
    activeDays: markActive(p, today),
  };
}

export function logActivity(p: Progress, activity: Activity, today: string): Progress {
  return {
    ...p,
    xp: p.xp + XP.activity,
    activities: [activity, ...p.activities].slice(0, 200),
    activeDays: markActive(p, today),
  };
}

export function removeActivity(p: Progress, id: string): Progress {
  return { ...p, activities: p.activities.filter((a) => a.id !== id) };
}

export function setProfile(p: Progress, profile: Profile | null): Progress {
  return { ...p, profile };
}

export function setLastAccessed(
  p: Progress,
  record: { standard: number; subjectId: string; chapterId: string },
): Progress {
  if (!p.profile) return p;
  const updatedProfile: Profile = {
    ...p.profile,
    lastAccessed: {
      standard: record.standard,
      subjectId: record.subjectId,
      chapterId: record.chapterId,
      timestamp: new Date().toISOString(),
    },
  };
  return { ...p, profile: updatedProfile };
}

export function updateStudentProfile(p: Progress, updates: Partial<Profile>): Progress {
  if (!p.profile) return p;
  const updatedProfile: Profile = {
    ...p.profile,
    ...updates,
    grade: updates.grade !== undefined ? Math.round(updates.grade) : p.profile.grade,
  };
  return { ...p, profile: updatedProfile };
}

/**
 * 0..1 per growth area. Logged activities fill an area with diminishing returns;
 * lessons and quiz results also feed academics and communication.
 */
export function skillScores(p: Progress): Record<Area, number> {
  const counts = Object.fromEntries(AREAS.map((a) => [a, 0])) as Record<Area, number>;
  for (const a of p.activities) counts[a.area] += 1;
  counts.academics += p.lessonsDone.length * 0.5 + p.quizBest / 40;
  counts.communication += p.songsHeard.length * 0.5;
  const fill = (n: number) => Math.round((0.12 + 0.88 * (1 - Math.exp(-n / 3))) * 100) / 100;
  return Object.fromEntries(AREAS.map((a) => [a, fill(counts[a])])) as Record<Area, number>;
}

export type BadgeId = "first-leaf" | "bookworm" | "quiz-star" | "all-rounder" | "streak-3" | "singer";

export function badges(p: Progress, today: string): { id: BadgeId; earned: boolean }[] {
  const areas = new Set(p.activities.map((a) => a.area));
  return [
    { id: "first-leaf", earned: p.activities.length > 0 },
    // Every band has at least four lessons, so every student can earn it.
    { id: "bookworm", earned: p.lessonsDone.length >= 4 },
    { id: "quiz-star", earned: p.quizBest >= 80 },
    { id: "singer", earned: p.songsHeard.length >= 2 },
    { id: "all-rounder", earned: areas.size === AREAS.length },
    { id: "streak-3", earned: streak(p.activeDays, today) >= 3 },
  ];
}

// ---------- Defensive parsing of stored data ----------

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isStr = (v: unknown): v is string => typeof v === "string";
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter(isStr) : []);
const num = (v: unknown, fallback = 0) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback);

function parseActivity(v: unknown): Activity | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.title) || !isStr(v.date)) return null;
  if (!(AREAS as readonly unknown[]).includes(v.area)) return null;
  return { id: v.id, area: v.area as Area, title: v.title.slice(0, 80), date: v.date };
}

function parseProfile(v: unknown): Profile | null {
  if (!isObj(v) || !isStr(v.name) || !isStr(v.studentId)) return null;
  if (!(AVATARS as readonly unknown[]).includes(v.avatar)) return null;
  const grade = Math.round(num(v.grade, 6));
  if (grade < 1 || grade > 12) return null;

  const email = isStr(v.email) ? v.email.slice(0, 80) : undefined;
  const preferredLanguage = (LOCALES as readonly unknown[]).includes(v.preferredLanguage)
    ? (v.preferredLanguage as Locale)
    : undefined;

  let lastAccessed: LastAccessed | undefined;
  if (isObj(v.lastAccessed) && isStr(v.lastAccessed.subjectId) && isStr(v.lastAccessed.chapterId)) {
    lastAccessed = {
      standard: num(v.lastAccessed.standard, grade),
      subjectId: v.lastAccessed.subjectId,
      chapterId: v.lastAccessed.chapterId,
      timestamp: isStr(v.lastAccessed.timestamp) ? v.lastAccessed.timestamp : new Date().toISOString(),
    };
  }

  return {
    name: v.name.slice(0, 24),
    avatar: v.avatar as AvatarId,
    grade,
    studentId: v.studentId,
    email,
    preferredLanguage,
    lastAccessed,
  };
}

export function parseProgress(raw: unknown): Progress {
  if (!isObj(raw) || raw.version !== 1) return EMPTY_PROGRESS;
  return {
    version: 1,
    profile: parseProfile(raw.profile),
    xp: num(raw.xp),
    lessonsDone: strings(raw.lessonsDone),
    songsHeard: strings(raw.songsHeard),
    quizBest: Math.min(100, num(raw.quizBest)),
    activities: Array.isArray(raw.activities)
      ? raw.activities.map(parseActivity).filter((a): a is Activity => a !== null)
      : [],
    activeDays: strings(raw.activeDays),
  };
}
