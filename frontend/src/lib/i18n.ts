export const LOCALES = ["en", "ta"] as const;
export type Locale = (typeof LOCALES)[number];
export type LocalizedText = Readonly<Record<Locale, string> & { hi?: string }>;

export const LOCALE_LABEL = {
  en: { short: "Eng", native: "English" },
  ta: { short: "தமிழ்", native: "தமிழ்" },
} as const satisfies Record<Locale, { short: string; native: string }>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

type Stat = { readonly value: string; readonly label: string };
type Principle = { readonly title: string; readonly body: string };

export type Copy = {
  readonly menu: string;
  readonly signIn: string;
  readonly eyebrow: string;
  readonly tagline: readonly [string, string];
  readonly headline: readonly [string, string];
  readonly lead: string;
  readonly explore: string;
  readonly stats: readonly [Stat, Stat, Stat, Stat];
  readonly modulesTitle: string;
  readonly modulesLead: string;
  readonly open: string;
  readonly soonTitle: string;
  readonly soonBody: string;
  readonly identityTitle: string;
  readonly identityBody: string;
  readonly identityCenter: string;
  readonly principles: readonly [Principle, Principle, Principle, Principle];
  readonly ctaTitle: string;
  readonly cta: string;
  readonly trust: string;
  readonly partner: string;
  readonly close: string;
  readonly language: string;
  readonly comfort: string;
  readonly calm: string;
  readonly calmHint: string;
  readonly projector: string;
  readonly projectorHint: string;
  readonly comingSoon: string;
  readonly signInSoon: string;
  readonly back: string;
  readonly home: string;
  readonly level: string;
  readonly streak: string;
  readonly myCard: string;
  readonly makeCard: string;
};

const LANGS = "தமிழ் · English";

export const COPY = {
  en: {
    menu: "Menu",
    signIn: "Sign In",
    eyebrow: "One app for every learner",
    tagline: ["Student Learning", "Platform"],
    headline: ["Rooted", "to Rise"],
    lead: "Learning, growth and knowledge in one place, in your own language. Enter once, use everywhere.",
    explore: "Explore modules",
    stats: [
      { value: "03", label: "modules" },
      { value: "02", label: "languages" },
      { value: "01", label: "student identity" },
      { value: "₹0", label: "for students" },
    ],
    modulesTitle: "Three modules. One app.",
    modulesLead: "Each module works on its own. All of them share one student profile.",
    open: "Open",
    soonTitle: "More modules ahead",
    soonBody: "Attendance, events and future projects plug straight in.",
    identityTitle: "Enter once. Use everywhere.",
    identityBody:
      "One student identity follows the learner across every module, today and in future Kalpavriksha projects.",
    identityCenter: "Student profile",
    principles: [
      { title: LANGS, body: "Learn in the language you think in." },
      { title: "Any screen", body: "Phone, tablet, desktop or smart panel." },
      { title: "Free for students", body: "No cost for any student." },
      { title: "Less paperwork", body: "Teachers record more with fewer taps." },
    ],
    ctaTitle: "Grow with Kalpavriksha.",
    cta: "Start learning",
    trust: "Kalpavriksha Seva Trust",
    partner: "Technology partner: GSX Chennai Chapter",
    close: "Close",
    language: "Language",
    comfort: "Comfort",
    calm: "Calm mode",
    calmHint: "Stops motion and glow",
    projector: "Projector mode",
    projectorHint: "Bigger, brighter text",
    comingSoon: "This module is being built. It will open right here.",
    signInSoon: "Student and staff sign-in arrives with the shared student profile.",
    back: "Back to home",
    home: "Home",
    level: "Level",
    streak: "day streak",
    myCard: "My learner card",
    makeCard: "Make your card",
  },
  ta: {
    menu: "பட்டியல்",
    signIn: "உள்நுழை",
    eyebrow: "ஒவ்வொரு மாணவருக்கும் ஒரே செயலி",
    tagline: ["மாணவர் கற்றல்", "தளம்"],
    headline: ["வேரூன்றி", "உயர்வோம்"],
    lead: "கற்றல், வளர்ச்சி, அறிவு — ஒரே இடத்தில், உங்கள் மொழியில். ஒருமுறை நுழைந்தால், எங்கும் பயன்படுத்தலாம்.",
    explore: "தொகுதிகளைப் பார்க்க",
    stats: [
      { value: "03", label: "தொகுதிகள்" },
      { value: "02", label: "மொழிகள்" },
      { value: "01", label: "மாணவர் அடையாளம்" },
      { value: "₹0", label: "மாணவர்களுக்கு" },
    ],
    modulesTitle: "மூன்று தொகுதிகள். ஒரே செயலி.",
    modulesLead: "ஒவ்வொரு தொகுதியும் தனித்து இயங்கும்; அனைத்தும் ஒரே மாணவர் சுயவிவரத்தைப் பகிரும்.",
    open: "திற",
    soonTitle: "மேலும் தொகுதிகள் வரவிருக்கின்றன",
    soonBody: "வருகைப் பதிவு, நிகழ்வுகள், எதிர்காலத் திட்டங்கள் நேரடியாக இணையும்.",
    identityTitle: "ஒருமுறை நுழை. எங்கும் பயன்படுத்து.",
    identityBody: "ஒரே மாணவர் அடையாளம் எல்லாத் தொகுதிகளிலும் தொடரும் — இன்றும், எதிர்கால கல்பவிருக்ஷா திட்டங்களிலும்.",
    identityCenter: "மாணவர் சுயவிவரம்",
    principles: [
      { title: LANGS, body: "நீங்கள் சிந்திக்கும் மொழியில் கற்கலாம்." },
      { title: "எந்தத் திரையிலும்", body: "கைபேசி, டேப்லெட், கணினி அல்லது ஸ்மார்ட் பேனல்." },
      { title: "மாணவர்களுக்கு இலவசம்", body: "எந்த மாணவருக்கும் கட்டணம் இல்லை." },
      { title: "குறைந்த பதிவுப் பணி", body: "குறைந்த தட்டல்களில் ஆசிரியர்கள் அதிகம் பதிவு செய்யலாம்." },
    ],
    ctaTitle: "கல்பவிருக்ஷாவுடன் வளர்வோம்.",
    cta: "கற்கத் தொடங்கு",
    trust: "கல்பவிருக்ஷா சேவா அறக்கட்டளை",
    partner: "தொழில்நுட்பக் கூட்டாளர்: GSX சென்னை",
    close: "மூடு",
    language: "மொழி",
    comfort: "வசதி",
    calm: "அமைதிப் பயன்முறை",
    calmHint: "இயக்கமும் ஒளிர்வும் நிற்கும்",
    projector: "ப்ரொஜெக்டர் பயன்முறை",
    projectorHint: "பெரிய, தெளிவான எழுத்து",
    comingSoon: "இந்தத் தொகுதி உருவாக்கப்பட்டு வருகிறது. விரைவில் இங்கே திறக்கும்.",
    signInSoon: "மாணவர் மற்றும் ஆசிரியர் உள்நுழைவு, பொதுவான மாணவர் சுயவிவரத்துடன் வரும்.",
    back: "முகப்புக்குத் திரும்பு",
    home: "முகப்பு",
    level: "நிலை",
    streak: "நாள் தொடர்",
    myCard: "என் மாணவர் அட்டை",
    makeCard: "உன் அட்டையை உருவாக்கு",
  },
} as const satisfies Record<Locale, Copy>;
