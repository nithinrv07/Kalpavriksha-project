import type { Locale, LocalizedText } from "@/lib/i18n";
import type { AvatarId, Band } from "@/lib/progress";

/** Seed → sapling → tree: each school stage is a growth stage of the Kalpavriksha. */
export const BAND_INFO: Record<
  Band,
  { readonly name: LocalizedText; readonly classes: LocalizedText; readonly tagline: LocalizedText; readonly accent: string }
> = {
  junior: {
    name: { en: "Seedlings", ta: "நாற்றுகள்", hi: "अंकुर" },
    classes: { en: "Class 1–5", ta: "வகுப்பு 1–5", hi: "कक्षा 1–5" },
    tagline: {
      en: "Play, sing and learn with pictures and sounds.",
      ta: "படங்கள், ஒலிகளுடன் விளையாடிப் பாடிக் கற்போம்.",
      hi: "चित्रों और आवाज़ों के साथ खेलो, गाओ और सीखो।",
    },
    accent: "var(--amber)",
  },
  middle: {
    name: { en: "Saplings", ta: "இளஞ்செடிகள்", hi: "पौधे" },
    classes: { en: "Class 6–10", ta: "வகுப்பு 6–10", hi: "कक्षा 6–10" },
    tagline: {
      en: "Explore ideas, build skills and watch yourself grow.",
      ta: "கருத்துகளை ஆராய்ந்து, திறன்களை வளர்த்து, உன் வளர்ச்சியைப் பார்.",
      hi: "विचार खोजो, कौशल बनाओ और खुद को बढ़ते देखो।",
    },
    accent: "var(--violet)",
  },
  senior: {
    name: { en: "Tall Trees", ta: "உயர் மரங்கள்", hi: "ऊँचे वृक्ष" },
    classes: { en: "Class 11–12", ta: "வகுப்பு 11–12", hi: "कक्षा 11–12" },
    tagline: {
      en: "Focused revision, tougher quizzes and a profile for what comes next.",
      ta: "கவனமான மீள்பார்வை, கடினமான வினாடி வினா, அடுத்த கட்டத்துக்கான சுயவிவரம்.",
      hi: "केंद्रित दोहराई, कठिन प्रश्नोत्तरी और आगे की राह के लिए प्रोफ़ाइल।",
    },
    accent: "var(--teal)",
  },
};

export const AVATAR_NAME: Record<AvatarId, LocalizedText> = {
  cat: { en: "Cat", ta: "பூனை", hi: "बिल्ली" },
  dog: { en: "Dog", ta: "நாய்", hi: "कुत्ता" },
  bird: { en: "Bird", ta: "பறவை", hi: "चिड़िया" },
  butterfly: { en: "Butterfly", ta: "பட்டாம்பூச்சி", hi: "तितली" },
  fish: { en: "Fish", ta: "மீன்", hi: "मछली" },
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
    askTitle: "Which class are you in?",
    askLead: "Lessons, quizzes and your dashboard will be set up to match.",
    pickClass: "Pick your class",
    classWord: "Class",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Priya",
    avatarLabel: "Pick your buddy",
    start: "Let's go!",
    save: "Save changes",
    back: "Back",
    deviceNote: "Saved on this device only. School sign-in comes with the shared student profile.",
    edit: "Edit card",
    remove: "Remove from this device",
    confirmRemove: "Tap again to remove",
    continueLearning: "Continue learning",
    cardTitle: "Learner card",
    hello: (name) => `Hi ${name}!`,
  },
  ta: {
    askTitle: "நீ எந்த வகுப்பில் படிக்கிறாய்?",
    askLead: "அதற்கேற்ப பாடங்கள், வினாடி வினா, உன் பலகை அமைக்கப்படும்.",
    pickClass: "உன் வகுப்பைத் தேர்ந்தெடு",
    classWord: "வகுப்பு",
    nameLabel: "உன் பெயர்",
    namePlaceholder: "எ.கா. பிரியா",
    avatarLabel: "உன் நண்பனைத் தேர்ந்தெடு",
    start: "தொடங்குவோம்!",
    save: "மாற்றங்களைச் சேமி",
    back: "பின்செல்",
    deviceNote: "இந்தச் சாதனத்தில் மட்டும் சேமிக்கப்படும். பள்ளி உள்நுழைவு பொதுவான மாணவர் சுயவிவரத்துடன் வரும்.",
    edit: "அட்டையைத் திருத்து",
    remove: "இந்தச் சாதனத்திலிருந்து நீக்கு",
    confirmRemove: "நீக்க மீண்டும் தட்டு",
    continueLearning: "கற்றலைத் தொடர்",
    cardTitle: "மாணவர் அட்டை",
    hello: (name) => `வணக்கம் ${name}!`,
  },
  hi: {
    askTitle: "तुम किस कक्षा में हो?",
    askLead: "उसी के अनुसार पाठ, प्रश्नोत्तरी और तुम्हारा डैशबोर्ड तैयार होगा।",
    pickClass: "अपनी कक्षा चुनो",
    classWord: "कक्षा",
    nameLabel: "तुम्हारा नाम",
    namePlaceholder: "जैसे प्रिया",
    avatarLabel: "अपना साथी चुनो",
    start: "चलो शुरू करें!",
    save: "बदलाव सहेजें",
    back: "पीछे",
    deviceNote: "केवल इस डिवाइस पर सहेजा जाता है। स्कूल साइन-इन साझा विद्यार्थी प्रोफ़ाइल के साथ आएगा।",
    edit: "कार्ड बदलें",
    remove: "इस डिवाइस से हटाएँ",
    confirmRemove: "हटाने के लिए फिर टैप करें",
    continueLearning: "सीखना जारी रखें",
    cardTitle: "विद्यार्थी कार्ड",
    hello: (name) => `नमस्ते ${name}!`,
  },
};
