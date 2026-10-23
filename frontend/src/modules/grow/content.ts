import type { Icon } from "@phosphor-icons/react";
import {
  BookOpen,
  ChatsCircle,
  Crown,
  Fire,
  GraduationCap,
  HandHeart,
  Leaf,
  Lightning,
  Medal,
  MusicNotes,
  PaintBrush,
  SoccerBall,
} from "@phosphor-icons/react/ssr";
import type { Locale, LocalizedText } from "@/lib/i18n";
import type { Area, Band, BadgeId } from "@/lib/progress";

export const AREA_INFO: Record<
  Area,
  {
    readonly name: LocalizedText;
    readonly color: string;
    readonly icon: Icon;
    readonly example: LocalizedText;
  }
> = {
  academics: {
    name: { en: "Academics", ta: "படிப்பு", hi: "पढ़ाई" },
    color: "#60a5fa",
    icon: BookOpen,
    example: {
      en: "e.g. Finished my maths project",
      ta: "எ.கா. கணிதத் திட்டத்தை முடித்தேன்",
      hi: "जैसे गणित का प्रोजेक्ट पूरा किया",
    },
  },
  sports: {
    name: { en: "Sports", ta: "விளையாட்டு", hi: "खेल" },
    color: "#4ade80",
    icon: SoccerBall,
    example: {
      en: "e.g. Played in the kabaddi match",
      ta: "எ.கா. கபடிப் போட்டியில் விளையாடினேன்",
      hi: "जैसे कबड्डी मैच खेला",
    },
  },
  arts: {
    name: { en: "Arts", ta: "கலை", hi: "कला" },
    color: "#f472b6",
    icon: PaintBrush,
    example: {
      en: "e.g. Drew a kolam for Pongal",
      ta: "எ.கா. பொங்கலுக்குக் கோலம் போட்டேன்",
      hi: "जैसे पोंगल पर कोलम बनाया",
    },
  },
  leadership: {
    name: { en: "Leadership", ta: "தலைமைப் பண்பு", hi: "नेतृत्व" },
    color: "#fbbf24",
    icon: Crown,
    example: {
      en: "e.g. Led the class assembly",
      ta: "எ.கா. வகுப்புக் கூட்டத்தை வழிநடத்தினேன்",
      hi: "जैसे कक्षा सभा का नेतृत्व किया",
    },
  },
  service: {
    name: { en: "Service", ta: "சேவை", hi: "सेवा" },
    color: "#2dd4bf",
    icon: HandHeart,
    example: {
      en: "e.g. Planted a tree with friends",
      ta: "எ.கா. நண்பர்களுடன் மரம் நட்டேன்",
      hi: "जैसे दोस्तों के साथ पेड़ लगाया",
    },
  },
  communication: {
    name: { en: "Communication", ta: "தொடர்புத் திறன்", hi: "संवाद" },
    color: "#c084fc",
    icon: ChatsCircle,
    example: {
      en: "e.g. Spoke at the morning assembly",
      ta: "எ.கா. காலை வழிபாட்டுக் கூட்டத்தில் பேசினேன்",
      hi: "जैसे सुबह की प्रार्थना सभा में बोला",
    },
  },
};

export const BADGE_INFO: Record<
  BadgeId,
  { readonly name: LocalizedText; readonly how: LocalizedText; readonly icon: Icon }
> = {
  "first-leaf": {
    name: { en: "First leaf", ta: "முதல் இலை", hi: "पहली पत्ती" },
    how: {
      en: "Log your first activity",
      ta: "உன் முதல் செயல்பாட்டைப் பதி",
      hi: "अपनी पहली गतिविधि दर्ज करो",
    },
    icon: Leaf,
  },
  bookworm: {
    name: { en: "Bookworm", ta: "புத்தகப் புழு", hi: "किताबी कीड़ा" },
    how: { en: "Learn 4 lessons", ta: "4 பாடங்களைக் கற்றுக்கொள்", hi: "4 पाठ सीखो" },
    icon: BookOpen,
  },
  scholar: {
    name: { en: "Scholar", ta: "அறிஞர்", hi: "विद्वान" },
    how: {
      en: "Learn 10 lessons",
      ta: "10 பாடங்களைக் கற்றுக்கொள்",
      hi: "10 पाठ सीखो",
    },
    icon: GraduationCap,
  },
  "quiz-star": {
    name: { en: "Quiz star", ta: "வினாடி வினா நட்சத்திரம்", hi: "प्रश्नोत्तरी सितारा" },
    how: {
      en: "Score 80% or more in a quiz",
      ta: "வினாடி வினாவில் 80% அல்லது அதற்கு மேல் பெறு",
      hi: "प्रश्नोत्तरी में 80% या ज़्यादा लाओ",
    },
    icon: Lightning,
  },
  singer: {
    name: { en: "Singer", ta: "பாடகர்", hi: "गायक" },
    how: {
      en: "Sing along to 2 songs",
      ta: "2 பாடல்களுடன் சேர்ந்து பாடு",
      hi: "2 गीतों के साथ गाओ",
    },
    icon: MusicNotes,
  },
  "all-rounder": {
    name: { en: "All-rounder", ta: "சகலகலா வல்லவர்", hi: "हरफ़नमौला" },
    how: {
      en: "Log an activity in all 6 areas",
      ta: "6 பகுதிகளிலும் செயல்பாட்டைப் பதி",
      hi: "सभी 6 क्षेत्रों में गतिविधि दर्ज करो",
    },
    icon: Medal,
  },
  "streak-3": {
    name: { en: "On fire", ta: "தொடர் நெருப்பு", hi: "लगातार जोश" },
    how: {
      en: "Learn 3 days in a row",
      ta: "தொடர்ந்து 3 நாள் கற்றுக்கொள்",
      hi: "लगातार 3 दिन सीखो",
    },
    icon: Fire,
  },
};

export type GrowCopy = {
  readonly treeTitle: string;
  readonly leaves: (total: number, fromLessons?: number) => string;
  readonly skillsTitle: string;
  readonly stickersTitle: string;
  readonly logTitle: string;
  readonly areaLabel: string;
  readonly whatLabel: string;
  readonly dateLabel: string;
  readonly add: string;
  readonly recent: string;
  readonly empty: string;
  readonly remove: string;
  readonly badgesTitle: string;
  readonly portfolio: string;
  readonly strongest: string;
  readonly growNext: string;
  readonly bandHint: Record<Band, string>;

  // Learning Track Performance
  readonly learningTrackTitle: string;
  readonly learningTrackSubtitle: string;
  readonly standardLabel: (std: number) => string;
  readonly changeStandard: string;
  readonly curriculumMastery: string;
  readonly lessonsMastered: string;
  readonly quizPerformance: string;
  readonly studyStreak: string;
  readonly continueLearning: string;
  readonly resumeLesson: string;
  readonly startLearning: string;
  readonly subjectProgress: string;
  readonly chaptersCompleted: (done: number, total: number) => string;
  readonly statusCompleted: string;
  readonly statusInProgress: string;
  readonly statusNotStarted: string;
  readonly academicsContributionHint: string;
  readonly viewInModule1: string;
};

export const GROW_COPY: Record<Locale, GrowCopy> = {
  en: {
    treeTitle: "Your growth tree",
    leaves: (total, fromLessons = 0) =>
      fromLessons > 0
        ? `${total} leaves · ${fromLessons} from completed lessons & ${total - fromLessons} from activities`
        : `${total} ${total === 1 ? "leaf" : "leaves"} · every activity & lesson grows a new one`,
    skillsTitle: "Skill radar",
    stickersTitle: "My sticker book",
    logTitle: "Log an activity",
    areaLabel: "Area",
    whatLabel: "What did you do?",
    dateLabel: "When?",
    add: "Grow a leaf",
    recent: "Recent activities",
    empty: "Nothing logged yet. Your tree is waiting for its first leaf!",
    remove: "Remove",
    badgesTitle: "Badges",
    portfolio: "Portfolio snapshot",
    strongest: "Strongest",
    growNext: "Grow next",
    bandHint: {
      junior: "Did something fun today? Add it and watch your tree grow!",
      middle: "Log what you do in and out of class to see your all-round growth.",
      senior: "Build a record of achievements for applications and interviews.",
    },
    learningTrackTitle: "Learning Track Performance",
    learningTrackSubtitle:
      "Your textbook chapters completed, quiz scores, and subject milestones in Module 1 automatically bloom on your Growth Tree and elevate your Academic score.",
    standardLabel: (std) => `Class ${std} Curriculum`,
    changeStandard: "Switch Standard",
    curriculumMastery: "Curriculum Mastery",
    lessonsMastered: "Lessons Mastered",
    quizPerformance: "Quiz High Score",
    studyStreak: "Study Streak",
    continueLearning: "Continue Learning",
    resumeLesson: "Resume Lesson",
    startLearning: "Start First Lesson",
    subjectProgress: "Subject Mastery Breakdown",
    chaptersCompleted: (done, total) => `${done} of ${total} chapters`,
    statusCompleted: "Mastered",
    statusInProgress: "In Progress",
    statusNotStarted: "Ready to Learn",
    academicsContributionHint:
      "Completing lessons in Module 1 directly powers the Academics axis on your Skill Radar and sprouts academic leaves on your Growth Tree.",
    viewInModule1: "Open in Digital Learning →",
  },
  ta: {
    treeTitle: "உன் வளர்ச்சி மரம்",
    leaves: (total, fromLessons = 0) =>
      fromLessons > 0
        ? `${total} இலைகள் · ${fromLessons} பாடங்கள் & ${total - fromLessons} செயல்பாடுகள்`
        : `${total} இலைகள் · ஒவ்வொரு செயல்பாடு மற்றும் பாடத்துக்கும் புதிய இலை`,
    skillsTitle: "திறன் வரைபடம்",
    stickersTitle: "என் ஸ்டிக்கர் புத்தகம்",
    logTitle: "செயல்பாட்டைப் பதி",
    areaLabel: "பகுதி",
    whatLabel: "நீ என்ன செய்தாய்?",
    dateLabel: "எப்போது?",
    add: "இலையை வளர்",
    recent: "சமீபத்திய செயல்பாடுகள்",
    empty: "இன்னும் எதுவும் பதியவில்லை. உன் மரம் முதல் இலைக்காகக் காத்திருக்கிறது!",
    remove: "நீக்கு",
    badgesTitle: "பதக்கங்கள்",
    portfolio: "சுயவிவரச் சுருக்கம்",
    strongest: "வலிமையான பகுதி",
    growNext: "அடுத்து வளர்க்க",
    bandHint: {
      junior: "இன்று ஏதாவது செய்தாயா? அதைச் சேர்த்து உன் மரம் வளர்வதைப் பார்!",
      middle: "வகுப்பிலும் வெளியிலும் செய்வதைப் பதிந்து உன் முழுமையான வளர்ச்சியைப் பார்.",
      senior: "விண்ணப்பங்கள், நேர்காணல்களுக்கான சாதனைப் பதிவை உருவாக்கு.",
    },
    learningTrackTitle: "கற்றல் அடைவுத் திறன்",
    learningTrackSubtitle:
      "முதல் தொகுதியில் நீங்கள் பயின்ற பாடப்புத்தக அத்தியாயங்கள், வினாடி வினாக்கள் மற்றும் சாதனைகள் உங்கள் வளர்ச்சி மரத்திலும் படிப்புத் திறனிலும் நேரடியாகப் பிரதிபலிக்கின்றன.",
    standardLabel: (std) => `வகுப்பு ${std} பாடத்திட்டம்`,
    changeStandard: "வகுப்பை மாற்று",
    curriculumMastery: "பாடத்திட்ட அடைவு",
    lessonsMastered: "முடித்த பாடங்கள்",
    quizPerformance: "வினாடி வினா சிறந்த மதிப்பெண்",
    studyStreak: "தொடர் கற்றல்",
    continueLearning: "தொடர்ந்து படி",
    resumeLesson: "பாடத்தைத் தொடர்க",
    startLearning: "முதல் பாடத்தைத் தொடங்கு",
    subjectProgress: "பாடவாரியான தேர்ச்சி விவரம்",
    chaptersCompleted: (done, total) => `${total} இல் ${done} பாடங்கள்`,
    statusCompleted: "முழுமை பெற்றது",
    statusInProgress: "கற்கப்படுகிறது",
    statusNotStarted: "தொடங்கத் தயார்",
    academicsContributionHint:
      "பாடங்களை முடிப்பதும் வினாடி வினாக்களில் தேர்ச்சி பெறுவதும் உங்கள் திறன் வரைபடத்தின் படிப்புப் பகுதியையும் வளர்ச்சி மரத்தையும் உயர்த்தும்.",
    viewInModule1: "டிஜிட்டல் கற்றலில் திறக்க →",
  },
  hi: {
    treeTitle: "तुम्हारा विकास वृक्ष",
    leaves: (total, fromLessons = 0) =>
      fromLessons > 0
        ? `${total} पत्तियाँ · ${fromLessons} पाठों से & ${total - fromLessons} गतिविधियों से`
        : `${total} पत्तियाँ · प्रत्येक गतिविधि व पाठ से नई पत्ती`,
    skillsTitle: "कौशल चार्ट",
    stickersTitle: "मेरी स्टिकर किताब",
    logTitle: "गतिविधि दर्ज करो",
    areaLabel: "क्षेत्र",
    whatLabel: "तुमने क्या किया?",
    dateLabel: "कब?",
    add: "पत्ती उगाओ",
    recent: "हाल की गतिविधियाँ",
    empty: "अभी कुछ दर्ज नहीं। तुम्हारा पेड़ पहली पत्ती का इंतज़ार कर रहा है!",
    remove: "हटाओ",
    badgesTitle: "बैज",
    portfolio: "पोर्टफ़ोलियो झलक",
    strongest: "सबसे मज़बूत",
    growNext: "आगे बढ़ाओ",
    bandHint: {
      junior: "आज कुछ मज़ेदार किया? उसे जोड़ो और अपना पेड़ बढ़ते देखो!",
      middle: "कक्षा के अंदर और बाहर जो करते हो उसे दर्ज करो और अपना सर्वांगीण विकास देखो।",
      senior: "आवेदनों और साक्षात्कारों के लिए उपलब्धियों का रिकॉर्ड बनाओ।",
    },
    learningTrackTitle: "अध्ययन ट्रैक प्रदर्शन",
    learningTrackSubtitle:
      "मॉड्यूल 1 में पूरी की गई आपकी पाठ्यपुस्तकें, अध्याय और क्विज़ सीधे आपके विकास वृक्ष और अकादमिक स्कोर को समृद्ध करते हैं।",
    standardLabel: (std) => `कक्षा ${std} पाठ्यक्रम`,
    changeStandard: "कक्षा बदलें",
    curriculumMastery: "पाठ्यक्रम दक्षता",
    lessonsMastered: "पूर्ण पाठ",
    quizPerformance: "सर्वश्रेष्ठ क्विज़ स्कोर",
    studyStreak: "लगातार अध्ययन",
    continueLearning: "अध्ययन जारी रखें",
    resumeLesson: "पाठ फिर शुरू करें",
    startLearning: "पहला पाठ शुरू करें",
    subjectProgress: "विषयवार दक्षता विवरण",
    chaptersCompleted: (done, total) => `${total} में से ${done} अध्याय`,
    statusCompleted: "पूर्ण",
    statusInProgress: "प्रगति में",
    statusNotStarted: "सीखने के लिए तैयार",
    academicsContributionHint:
      "अध्यायों को पूरा करना और क्विज़ में उत्तीर्ण होना सीधे आपके कौशल चार्ट के अध्ययन क्षेत्र और वृक्ष को बढ़ाता है।",
    viewInModule1: "डिजिटल अध्ययन में खोलें →",
  },
};
