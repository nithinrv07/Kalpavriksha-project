import { describe, it, expect } from "vitest";
import { getSocraticReflection } from "./socratic-engine";
import type { QuizItem } from "./manifest-schema";

describe("Socratic Stumble Recovery Engine", () => {
  const mockQuiz: QuizItem = {
    id: "quiz_newton_law_1",
    stem: {
      en: "What happens when no net external force acts on an object?",
      ta: "ஒரு பொருளின் மீது நிகர விசை செயல்படாத போது என்ன நிகழும்?",
    },
    options: [
      {
        en: "It remains in its state of rest or uniform motion.",
        ta: "ஓய்வு நிலையிலோ அல்லது சீரான இயக்க நிலையிலோ தொடர்ந்து இருக்கும்.",
      },
      {
        en: "It accelerates exponentially over time.",
        ta: "நேரத்திற்கு ஏற்ப அதிவேகமாக முடுக்கம் அடையும்.",
      },
      {
        en: "It immediately stops all motion and collapses.",
        ta: "உடனடியாக அனைத்து இயக்கமும் நின்றுவிடும்.",
      },
    ],
    correctHash: "mock_hash_abc123",
    explanation: {
      en: "Newton's First Law states an object remains in its state unless acted upon.",
      ta: "நியூட்டனின் முதல் விதிப்படி புறவிசை செயல்படாத வரை பொருள் தன் நிலையை மாற்றாது.",
    },
    socraticCues: {
      distractor_1: "Consider: If there is no external force, where would the energy for exponential acceleration come from?",
    },
  };

  it("returns educator-authored custom Socratic cue when available", () => {
    const reflection = getSocraticReflection(
      mockQuiz,
      1,
      { en: "Inertia and First Law", ta: "நிலைமம் மற்றும் முதல் விதி" }
    );

    expect(reflection.selectedDistractorText.en).toBe("It accelerates exponentially over time.");
    expect(reflection.diagnosticCue.en).toContain("where would the energy for exponential acceleration come from?");
    expect(reflection.suggestedAction).toBe("analogy");
  });

  it("returns intelligent heuristic reflection when no custom cue is authored", () => {
    const reflection = getSocraticReflection(
      mockQuiz,
      2,
      { en: "Inertia and First Law", ta: "நிலைமம் மற்றும் முதல் விதி" }
    );

    expect(reflection.selectedDistractorText.en).toBe("It immediately stops all motion and collapses.");
    expect(reflection.diagnosticCue.en).toContain("Re-examine the core definition in the textbook");
    expect(reflection.suggestedAction).toBe("rewind");
  });
});
