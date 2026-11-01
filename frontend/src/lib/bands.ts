import type { Locale, LocalizedText } from "@/lib/i18n";
import type { AvatarId, Band } from "@/lib/progress";

/** Seed → sapling → tree: each school stage is a growth stage of the Kalpavriksha. */
export const BAND_INFO: Record<
  Band,
  { readonly name: LocalizedText; readonly classes: LocalizedText; readonly tagline: LocalizedText; readonly accent: string }
> = {
  junior: {
    name: { en: "Seed (Seedlings)", ta: "விதை (Seed)" },
    classes: { en: "Class 1–3", ta: "வகுப்பு 1–3" },
    tagline: {
      en: "Foundational rhymes, alphabet, pictures and sound learning.",
      ta: "அடிப்படை எழுத்துகள், படங்கள், கதைகள், ஒலிகளுடன் விளையாடிக் கற்போம்.",
    },
    accent: "var(--amber)",
  },
  middle: {
    name: { en: "Plant (Saplings)", ta: "செடி (Plant)" },
    classes: { en: "Class 4–10", ta: "வகுப்பு 4–10" },
    tagline: {
      en: "Samacheer Kalvi core subjects, science experiments and board foundations.",
      ta: "சமச்சீர் கல்வி பாடங்கள், அறிவியல், கணிதம் மற்றும் திறன்கள்.",
    },
    accent: "var(--violet)",
  },
  senior: {
    name: { en: "Tree (Tall Trees)", ta: "மரம் (Tree)" },
    classes: { en: "Class 11–12", ta: "வகுப்பு 11–12" },
    tagline: {
      en: "Higher Secondary specialisations, board revision, and advanced streams.",
      ta: "மேல்நிலைப் பிரிவு சிறப்புப் பாடங்கள் மற்றும் தீவிரப் பயிற்சி.",
    },
    accent: "var(--teal)",
  },
};

/** Short board names for dense surfaces such as the learner card. */
export const BOARD_NAME = {
  tn_state: { en: "Tamil Nadu State Board", ta: "தமிழ்நாடு மாநிலப் பாடத்திட்டம்" },
  cbse: { en: "CBSE", ta: "சி.பி.எஸ்.இ" },
  icse: { en: "ICSE", ta: "ஐ.சி.எஸ்.இ" },
} as const satisfies Record<string, LocalizedText>;

export function boardName(board: string | undefined, locale: Locale): string {
  const key = board && board in BOARD_NAME ? (board as keyof typeof BOARD_NAME) : "tn_state";
  return BOARD_NAME[key][locale];
}

export const AVATAR_NAME: Record<AvatarId, LocalizedText> = {
  cat: { en: "Cat", ta: "பூனை" },
  dog: { en: "Dog", ta: "நாய்" },
  bird: { en: "Bird", ta: "பறவை" },
  butterfly: { en: "Butterfly", ta: "பட்டாம்பூச்சி" },
  fish: { en: "Fish", ta: "மீன்" },
  rabbit: { en: "Rabbit", ta: "முயல்" },
  horse: { en: "Horse", ta: "குதிரை" },
  cow: { en: "Cow", ta: "பசு" },
};

type SetupCopy = {
  readonly askTitle: string;
  readonly askLead: string;
  readonly pickClass: string;
  readonly classWord: string;
  readonly nameLabel: string;
  readonly namePlaceholder: string;
  readonly avatarLabel: string;
  readonly start: string;
  readonly save: string;
  readonly back: string;
  readonly deviceNote: string;
  readonly edit: string;
  readonly remove: string;
  readonly confirmRemove: string;
  readonly continueLearning: string;
  readonly cardTitle: string;
  readonly hello: (name: string) => string;
  /** "20 of 100 XP · 80 XP to Level 3" — progress always names its target. */
  readonly xpProgress: (into: number, span: number, nextLevel: number) => string;
  readonly streakDays: (days: number) => string;
  readonly noStreak: string;
  readonly learningSince: (year: number) => string;
};

export const SETUP_COPY: Record<Locale, SetupCopy> = {
  en: {
    askTitle: "Choose your stage & class to begin",
    askLead: "Pick Seed (Class 1–3), Plant (Class 4–10) or Tree (Class 11–12), then proceed.",
    pickClass: "Pick your exact class",
    classWord: "Class",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Priya",
    avatarLabel: "Pick your buddy",
    start: "Proceed →",
    save: "Save & Proceed →",
    back: "Back",
    deviceNote: "Saved on this device. Synced to your student profile.",
    edit: "Edit card",
    remove: "Remove from this device",
    confirmRemove: "Tap again to remove",
    continueLearning: "Continue learning",
    cardTitle: "Learner card",
    hello: (name) => `Hi ${name}!`,
    xpProgress: (into, span, nextLevel) => `${into} of ${span} XP · ${span - into} XP to Level ${nextLevel}`,
    streakDays: (days) => `${days}-day streak`,
    noStreak: "No streak yet",
    learningSince: (year) => `Learning since ${year}`,
  },
  ta: {
    askTitle: "உன் படிநிலை மற்றும் வகுப்பைத் தேர்ந்தெடு",
    askLead: "விதை (வகுப்பு 1–3), செடி (வகுப்பு 4–10) அல்லது மரம் (வகுப்பு 11–12) தேர்ந்தெடுத்துத் தொடர்க.",
    pickClass: "உன் சரியான வகுப்பைத் தேர்ந்தெடு",
    classWord: "வகுப்பு",
    nameLabel: "உன் பெயர்",
    namePlaceholder: "எ.கா. பிரியா",
    avatarLabel: "உன் நண்பனைத் தேர்ந்தெடு",
    start: "தொடர்க →",
    save: "சேமித்துத் தொடர்க →",
    back: "பின்செல்",
    deviceNote: "இந்தச் சாதனத்தில் மற்றும் உன் மாணவர் சுயவிவரத்தில் சேமிக்கப்படும்.",
    edit: "அட்டையைத் திருத்து",
    remove: "இந்தச் சாதனத்திலிருந்து நீக்கு",
    confirmRemove: "நீக்க மீண்டும் தட்டு",
    continueLearning: "கற்றலைத் தொடர்",
    cardTitle: "மாணவர் அட்டை",
    hello: (name) => `வணக்கம் ${name}!`,
    xpProgress: (into, span, nextLevel) => `${into} / ${span} XP · நிலை ${nextLevel}க்கு ${span - into} XP`,
    streakDays: (days) => `${days} நாள் தொடர்`,
    noStreak: "இன்னும் தொடர் இல்லை",
    learningSince: (year) => `${year} முதல் கற்றல்`,
  },
};
