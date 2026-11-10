import { describe, expect, it } from "vitest";
import { computeAnswerHash, DEFAULT_SALT, sha256, verifyAnswer } from "./hash-utils";
import { validateLessonManifest, type LessonManifest } from "./manifest-schema";

describe("hash-utils", () => {
  it("computes a deterministic 64-character SHA-256 hash", async () => {
    const hash1 = await sha256("test-input");
    const hash2 = await sha256("test-input");
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it("verifies correct option index and rejects incorrect index", async () => {
    const quizId = "q_test_101";
    const correctIndex = 1;
    const correctHash = await computeAnswerHash(quizId, correctIndex, DEFAULT_SALT);

    const isCorrect = await verifyAnswer(quizId, 1, correctHash, DEFAULT_SALT);
    const isWrong0 = await verifyAnswer(quizId, 0, correctHash, DEFAULT_SALT);
    const isWrong2 = await verifyAnswer(quizId, 2, correctHash, DEFAULT_SALT);

    expect(isCorrect).toBe(true);
    expect(isWrong0).toBe(false);
    expect(isWrong2).toBe(false);
  });

  it("fails verification if an incorrect salt is used", async () => {
    const quizId = "q_test_102";
    const correctHash = await computeAnswerHash(quizId, 0, "secret_salt_a");
    const verified = await verifyAnswer(quizId, 0, correctHash, "secret_salt_b");
    expect(verified).toBe(false);
  });
});

describe("manifest-schema validator", () => {
  it("accepts a valid sorted lesson manifest", () => {
    const mockManifest: LessonManifest = {
      lessonId: "c10-sci-ch1",
      videoId: "test_vid_123",
      title: { en: "Laws of Motion", ta: "இயக்க விதிகள்" },
      durationSec: 600,
      totalCheckpoints: 2,
      timeline: [
        {
          checkpointId: "cp_1",
          triggerSec: 100,
          gate: "HARD",
          rewindSec: 30,
          subtopicTitle: { en: "Inertia", ta: "நிலைமம்" },
          quiz: {
            id: "q1",
            stem: { en: "What is inertia?", ta: "நிலைமம் என்றால் என்ன?" },
            options: [
              { en: "Resistance to change in state", ta: "மாற்றத்திற்கு எதிர்ப்பு" },
              { en: "High speed", ta: "அதிக வேகம்" }
            ],
            correctHash: "mock_hash_1",
            explanation: { en: "Inertia resists state change.", ta: "நிலைமம் மாற்றத்தை எதிர்க்கும்." }
          },
          analogies: {
            sports: "A stationary football.",
            gaming: "Heavy armor knockback resistance.",
            cooking: "A stationary pot.",
            daily_life: "A passenger lurching forward."
          },
          bookCitation: {
            standard: 10,
            subject: "Science",
            chapter: 1,
            page: 3,
            paragraphAnchor: "p3_sec1",
            excerpt: "Inertia is the inherent property..."
          }
        },
        {
          checkpointId: "cp_2",
          triggerSec: 300,
          gate: "HARD",
          rewindSec: 35,
          subtopicTitle: { en: "Second Law", ta: "இரண்டாம் விதி" },
          quiz: {
            id: "q2",
            stem: { en: "Force equation?", ta: "விசை சமன்பாடு?" },
            options: [
              { en: "F = ma", ta: "F = ma" },
              { en: "F = m/a", ta: "F = m/a" }
            ],
            correctHash: "mock_hash_2",
            explanation: { en: "F = ma", ta: "F = ma" }
          },
          analogies: {
            sports: "Kicking harder gives higher acceleration.",
            gaming: "Higher attack stat multiplier.",
            cooking: "Pushing dough with more effort.",
            daily_life: "Pushing a heavier cart requires more force."
          },
          bookCitation: {
            standard: 10,
            subject: "Science",
            chapter: 1,
            page: 5,
            paragraphAnchor: "p5_sec2",
            excerpt: "Force is directly proportional..."
          }
        }
      ]
    };

    const res = validateLessonManifest(mockManifest);
    expect(res.valid).toBe(true);
  });

  it("rejects unsorted checkpoints", () => {
    const invalidManifest = {
      lessonId: "test",
      videoId: "test",
      timeline: [
        { checkpointId: "cp_2", triggerSec: 200 },
        { checkpointId: "cp_1", triggerSec: 100 }
      ]
    };
    const res = validateLessonManifest(invalidManifest);
    expect(res.valid).toBe(false);
  });
});
