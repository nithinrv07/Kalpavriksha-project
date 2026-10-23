import type { Locale, LocalizedText } from "@/lib/i18n";
import type { AvatarId, Band } from "@/lib/progress";

/** Seed → sapling → tree: each school stage is a growth stage of the Kalpavriksha. */
export const BAND_INFO: Record<
  Band,
  { readonly name: LocalizedText; readonly classes: LocalizedText; readonly tagline: LocalizedText; readonly accent: string }
> = {
  junior: {
    name: { en: "Seed (Seedlings)", ta: "விதை (Seed)", hi: "बीज (Seed)" },
    classes: { en: "Class 1–3", ta: "வகுப்பு 1–3", hi: "कक्षा 1–3" },
    tagline: {
      en: "Foundational rhymes, alphabet, pictures and sound learning.",
      ta: "அடிப்படை எழுத்துகள், படங்கள், கதைகள், ஒலிகளுடன் விளையாடிக் கற்போம்.",
      hi: "मूलभूत अक्षर, चित्रों और आवाज़ों के साथ खेलो और सीखो।",
    },
    accent: "var(--amber)",
  },
  middle: {
    name: { en: "Plant (Saplings)", ta: "செடி (Plant)", hi: "पौधा (Plant)" },
    classes: { en: "Class 4–10", ta: "வகுப்பு 4–10", hi: "कक्षा 4–10" },
    tagline: {
      en: "Samacheer Kalvi core subjects, science experiments and board foundations.",
      ta: "சமச்சீர் கல்வி பாடங்கள், அறிவியல், கணிதம் மற்றும் திறன்கள்.",
      hi: "समशीर कल्वि मुख्य विषय, विज्ञान, गणित और कौशल विकास।",
    },
    accent: "var(--violet)",
  },
  senior: {
    name: { en: "Tree (Tall Trees)", ta: "மரம் (Tree)", hi: "वृक्ष (Tree)" },
    classes: { en: "Class 11–12", ta: "வகுப்பு 11–12", hi: "कक्षा 11–12" },
    tagline: {
      en: "Higher Secondary specialisations, board revision, and advanced streams.",
      ta: "மேல்நிலைப் பிரிவு சிறப்புப் பாடங்கள் மற்றும் தீவிரப் பயிற்சி.",
      hi: "उच्चतर माध्यमिक विशेषज्ञता, बोर्ड परीक्षा और उन्नत विषय।",
    },
    accent: "var(--teal)",
  },
};

export const AVATAR_NAME: Record<AvatarId, LocalizedText> = {
  cat: { en: "Cat", ta: "பூனை", hi: "बिल्ली" },
  dog: { en: "Dog", ta: "நாய்", hi: "कुत्ता" },
  bird: { en: "Bird", ta: "பறவை", hi: "चिड़िया" },
  butterfly: { en: "Butterfly", ta: "பட்டாம்பூச்சி", hi: "तितली" },
  fish: { en: "Fish", ta: "மீன்", hi: "மछली" },
  rabbit: { en: "Rabbit", ta: "முயல்", hi: "खरगोश" },
  horse: { en: "Horse", ta: "குதிரை", hi: "घोड़ा" },
  cow: { en: "Cow", ta: "பசு", hi: "गाय" },
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
  },
  hi: {
    askTitle: "अपनी अवस्था और कक्षा चुनें",
    askLead: "बीज (कक्षा 1–3), पौधा (कक्षा 4–10) या वृक्ष (कक्षा 11–12) चुनकर आगे बढ़ें।",
    pickClass: "अपनी सटीक कक्षा चुनें",
    classWord: "कक्षा",
    nameLabel: "तुम्हारा नाम",
    namePlaceholder: "जैसे प्रिया",
    avatarLabel: "अपना साथी चुनो",
    start: "आगे बढ़ें →",
    save: "सहेजें और आगे बढ़ें →",
    back: "पीछे",
    deviceNote: "इस डिवाइस और आपकी छात्र प्रोफ़ाइल में सहेजा गया।",
    edit: "कार्ड बदलें",
    remove: "इस डिवाइस से हटाएँ",
    confirmRemove: "हटाने के लिए फिर टैप करें",
    continueLearning: "सीखना जारी रखें",
    cardTitle: "विद्यार्थी कार्ड",
    hello: (name) => `नमस्ते ${name}!`,
  },
};
