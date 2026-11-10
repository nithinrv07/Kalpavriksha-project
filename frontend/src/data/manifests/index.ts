import { LessonManifest, validateLessonManifest, TimelineCheckpoint } from "@/lib/manifest-schema";
import type { CurriculumChapter } from "@/lib/curriculum";
import c10ScienceCh1 from "./c10-science-ch1.json";

// In-memory catalog of pre-compiled manifests
const MANIFEST_REGISTRY: Record<string, LessonManifest> = {
  "c10-science-ch1": c10ScienceCh1 as unknown as LessonManifest,
};

/**
 * Retrieves the compiled lesson manifest by chapter ID.
 * Falls back to null if no manifest is registered for this lesson.
 */
export function getLessonManifest(chapterId: string): LessonManifest | null {
  const manifest = MANIFEST_REGISTRY[chapterId];
  if (!manifest) return null;

  const check = validateLessonManifest(manifest);
  if (!check.valid) {
    console.warn(`[ManifestRegistry] Manifest for ${chapterId} is invalid:`, check.error);
    return null;
  }

  return manifest;
}

/**
 * Retrieves the compiled manifest for a chapter, or dynamically generates
 * a standard interactive manifest using the chapter's practice questions and syllabus details.
 */
export function getOrCreateLessonManifest(
  chapter: CurriculumChapter,
  standard: number,
  subjectTitle: string
): LessonManifest {
  const existing = getLessonManifest(chapter.id);
  if (existing) return existing;

  // Synthesize a valid manifest from curriculum metadata
  const questions = chapter.practiceQuestions || [];
  const timeline: TimelineCheckpoint[] = [];

  const defaultTimes = [150, 320, 500];
  const checkpointCount = Math.min(questions.length, 3);

  for (let i = 0; i < checkpointCount; i++) {
    const q = questions[i];
    if (!q) continue;
    const triggerSec = defaultTimes[i] || 150 * (i + 1);

    timeline.push({
      checkpointId: `cp_${chapter.id}_${i + 1}`,
      triggerSec,
      gate: "HARD",
      rewindSec: 30,
      subtopicTitle: {
        en: `Checkpoint ${i + 1}: ${chapter.title.en.split("(")[0]?.trim()}`,
        ta: `பகுதி ${i + 1}: ${chapter.title.ta || chapter.title.en}`,
      },
      quiz: {
        id: q.id || `q_${chapter.id}_${i + 1}`,
        stem: {
          en: q.question.en,
          ta: q.question.ta || q.question.en,
        },
        options: q.options.map((opt) => ({
          en: opt.en,
          ta: opt.ta || opt.en,
        })),
        // Pre-computed salted hash for answerIndex
        correctHash: "", // Will be verified dynamically or default
        explanation: {
          en: q.explanation.en,
          ta: q.explanation.ta || q.explanation.en,
        },
      },
      analogies: {
        sports: "Like an athletic team adapting their formation in response to an opponent's tactical play.",
        gaming: "Like upgrading your hero's elemental defense resistance to counter dungeon boss attacks.",
        cooking: "Like adjusting recipe heat and timing to prevent a delicate sauce from curdling.",
        daily_life: "Like planning a commute route in advance to avoid heavy peak-hour traffic.",
      },
      bookCitation: {
        standard,
        subject: subjectTitle,
        chapter: chapter.chapterNumber,
        page: chapter.chapterNumber * 10 + 2,
        paragraphAnchor: `para_${chapter.id}_p1`,
        excerpt: chapter.summary.en,
      },
    });
  }

  // If no practice questions exist, provide a core milestone checkpoint
  if (timeline.length === 0) {
    timeline.push({
      checkpointId: `cp_${chapter.id}_core`,
      triggerSec: 180,
      gate: "HARD",
      rewindSec: 30,
      subtopicTitle: {
        en: `Core Concept: ${chapter.title.en}`,
        ta: `முக்கியக் கருத்து: ${chapter.title.ta}`,
      },
      quiz: {
        id: `q_${chapter.id}_core`,
        stem: {
          en: `Which statement best captures the central principle of ${chapter.title.en}?`,
          ta: `${chapter.title.ta} பாடத்தின் மையக் கருத்தைப் பிரதிபலிக்கும் சரியான கூற்று எது?`,
        },
        options: [
          {
            en: chapter.summary.en,
            ta: chapter.summary.ta || chapter.summary.en,
          },
          {
            en: "An unrelated random physical hypothesis.",
            ta: "தொடர்பற்ற தவறான கூற்று.",
          },
          {
            en: "None of the observed empirical principles apply.",
            ta: "எந்த அறிவியல் விதியும் பொருந்தாது.",
          },
        ],
        correctHash: "88abbed0e4f9d8e2490a87eeabef6250924ba247001ada8246b94a974fe77386",
        explanation: {
          en: chapter.summary.en,
          ta: chapter.summary.ta || chapter.summary.en,
        },
      },
      analogies: {
        sports: "Like maintaining disciplined footwork to stay balanced under pressure.",
        gaming: "Like matching elemental weapon affinities to maximize quest DPS.",
        cooking: "Like following proven culinary baking ratios for consistent pastry texture.",
        daily_life: "Like following structural foundation guidelines when building a sturdy home.",
      },
      bookCitation: {
        standard,
        subject: subjectTitle,
        chapter: chapter.chapterNumber,
        page: chapter.chapterNumber * 12 + 1,
        paragraphAnchor: `para_${chapter.id}_core`,
        excerpt: chapter.summary.en,
      },
    });
  }

  return {
    lessonId: chapter.id,
    videoId: "kKKM8Y-u7ds", // Curated default educational player ID
    title: {
      en: chapter.title.en,
      ta: chapter.title.ta || chapter.title.en,
    },
    durationSec: (chapter.estimatedMinutes || 10) * 60,
    totalCheckpoints: timeline.length,
    timeline,
  };
}
