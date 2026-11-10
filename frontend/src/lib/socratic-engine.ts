/**
 * Socratic Stumble Recovery Engine
 * Specification: SPEC: ARCH-2026-EDUX (Feature 03)
 * 
 * When a student fails a checkpoint quiz twice, this engine generates targeted
 * reflection questions based on their chosen distractor to guide them to breakthrough
 * without bluntly revealing the answer.
 */

import type { QuizItem, LocalizedString } from "./manifest-schema";

export interface SocraticReflection {
  selectedDistractorText: LocalizedString;
  reflectionPrompt: LocalizedString;
  diagnosticCue: LocalizedString;
  suggestedAction: "rewind" | "analogy" | "retry";
}

/**
 * Derives a targeted Socratic reflection when a student struggles with a checkpoint.
 */
export function getSocraticReflection(
  quiz: QuizItem,
  selectedIdx: number,
  subtopicTitle: LocalizedString
): SocraticReflection {
  const selectedOption = quiz.options[selectedIdx] || {
    en: "Selected Option",
    ta: "தேர்ந்தெடுக்கப்பட்ட விடை",
  };

  // Check if educator authored a custom Socratic cue for this distractor
  const customCueKey = `distractor_${selectedIdx}`;
  const customCueEn = quiz.socraticCues?.[customCueKey];

  if (customCueEn) {
    return {
      selectedDistractorText: selectedOption,
      reflectionPrompt: {
        en: `You chose "${selectedOption.en}". Let's reflect on why that doesn't fully apply:`,
        ta: `நீங்கள் "${selectedOption.ta || selectedOption.en}" என்பதைத் தேர்ந்தெடுத்தீர்கள். இது ஏன் இங்கு முழுமையாகப் பொருந்தாது என்பதைச் சிந்திப்போம்:`,
      },
      diagnosticCue: {
        en: customCueEn,
        ta: customCueEn, // Can be supplemented with Tamil translation
      },
      suggestedAction: "analogy",
    };
  }

  // Fallback heuristic Socratic inquiry
  return {
    selectedDistractorText: selectedOption,
    reflectionPrompt: {
      en: `You chose "${selectedOption.en}". Consider how ${subtopicTitle.en} behaves under fundamental conditions:`,
      ta: `நீங்கள் "${selectedOption.ta || selectedOption.en}" என்பதைத் தேர்ந்தெடுத்தீர்கள். ${subtopicTitle.ta || subtopicTitle.en} அடிப்படை விதிகளின்படி எவ்வாறு செயல்படுகிறது என்பதைச் சிந்தியுங்கள்:`,
    },
    diagnosticCue: {
      en: `Re-examine the core definition in the textbook. Ask yourself: does this term describe an inherent resistance, a rate of change, or a resulting motion?`,
      ta: `பாடநூலில் உள்ள வரைமுறையை மீண்டும் கவனியுங்கள்: இது ஒரு உள்ளார்ந்த பண்பா, மாறுபாட்டு வீதமா அல்லது இயக்க விளைவா?`,
    },
    suggestedAction: "rewind",
  };
}
