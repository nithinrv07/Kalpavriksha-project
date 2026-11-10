/**
 * Curriculum Engineering System - Checkpoint Manifest Schema
 * Specification: SPEC: ARCH-2026-EDUX
 * 
 * Defines the core types and data contracts for pre-compiled video manifests,
 * active recall gating checkpoints, 4-persona analogies, and textbook citations.
 */

export type GateType = "HARD" | "SOFT";

export interface LocalizedString {
  en: string;
  ta: string;
  hi?: string;
}

export interface QuizItem {
  id: string;
  stem: LocalizedString;
  options: LocalizedString[];
  correctHash: string; // Salted SHA-256
  socraticCues?: Record<string, string>; // Maps distractor option index e.g. "distractor_1" -> Socratic prompt
  explanation: LocalizedString;
}

export interface AnalogyCollection {
  sports: string;
  gaming: string;
  cooking: string;
  daily_life: string;
}

export interface BookCitation {
  standard: number;
  subject: string;
  chapter: number;
  page: number;
  paragraphAnchor: string;
  excerpt: string;
}

export interface TimelineCheckpoint {
  checkpointId: string;
  triggerSec: number;
  gate: GateType;
  rewindSec: number;
  subtopicTitle: LocalizedString;
  quiz: QuizItem;
  analogies: AnalogyCollection;
  bookCitation: BookCitation;
}

export interface LessonManifest {
  lessonId: string;
  videoId: string;
  title: LocalizedString;
  durationSec: number;
  totalCheckpoints: number;
  timeline: TimelineCheckpoint[];
}

/**
 * Validates that a manifest object strictly satisfies the LessonManifest data contract
 * and ensures all checkpoints are in ascending chronological order.
 */
export function validateLessonManifest(manifest: unknown): { valid: boolean; error?: string } {
  if (!manifest || typeof manifest !== "object") {
    return { valid: false, error: "Manifest must be a non-null object" };
  }

  const m = manifest as Record<string, unknown>;
  if (typeof m.lessonId !== "string" || !m.lessonId) {
    return { valid: false, error: "Missing or invalid lessonId" };
  }
  if (typeof m.videoId !== "string" || !m.videoId) {
    return { valid: false, error: "Missing or invalid videoId" };
  }
  if (!Array.isArray(m.timeline)) {
    return { valid: false, error: "Manifest timeline must be an array" };
  }

  let prevTriggerSec = -1;
  for (let i = 0; i < m.timeline.length; i++) {
    const cp = m.timeline[i] as TimelineCheckpoint;
    if (!cp.checkpointId || typeof cp.triggerSec !== "number") {
      return { valid: false, error: `Invalid checkpoint at index ${i}` };
    }
    if (cp.triggerSec <= prevTriggerSec) {
      return { valid: false, error: `Checkpoints must be strictly sorted by triggerSec (error at index ${i})` };
    }
    if (!cp.quiz || !cp.quiz.correctHash || !Array.isArray(cp.quiz.options)) {
      return { valid: false, error: `Invalid quiz in checkpoint ${cp.checkpointId}` };
    }
    if (!cp.analogies || !cp.analogies.sports || !cp.analogies.gaming) {
      return { valid: false, error: `Missing required 4-persona analogies in checkpoint ${cp.checkpointId}` };
    }
    if (!cp.bookCitation || !cp.bookCitation.page) {
      return { valid: false, error: `Missing textbook citation in checkpoint ${cp.checkpointId}` };
    }
    prevTriggerSec = cp.triggerSec;
  }

  return { valid: true };
}
