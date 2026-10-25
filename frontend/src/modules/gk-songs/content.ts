import type { Locale, LocalizedText } from "@/lib/i18n";
import type { Band } from "@/lib/progress";

export type Question = {
  readonly id: string;
  readonly q: LocalizedText;
  readonly options: readonly [LocalizedText, LocalizedText, LocalizedText, LocalizedText];
  readonly answer: 0 | 1 | 2 | 3;
  readonly explain: LocalizedText;
};

export type GkLevel = "primary" | "intermediate" | "advanced";

export const GK_LEVELS = ["primary", "intermediate", "advanced"] as const;

export interface GkLevelInfo {
  readonly id: GkLevel;
  readonly name: LocalizedText;
  readonly badge: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly accent: string;
  readonly iconName: string;
  readonly defaultSeconds: number | null;
  readonly targetClasses: LocalizedText;
}

export const GK_LEVEL_CONFIG: Record<GkLevel, GkLevelInfo> = {
  primary: {
    id: "primary",
    name: { en: "Primary Level", ta: "ஆரம்ப நிலை", hi: "प्राथमिक स्तर" },
    badge: { en: "Level 1 · Primary", ta: "நிலை 1 · ஆரம்பம்", hi: "स्तर 1 · प्राथमिक" },
    subtitle: {
      en: "Foundational GK — National symbols, nature, state facts & simple history.",
      ta: "அடிப்படைப் பொது அறிவு — தேசியச் சின்னங்கள், தமிழ்நாடு, இயற்கை மற்றும் தலைவர்கள்.",
      hi: "मूलभूत सामान्य ज्ञान — राष्ट्रीय प्रतीक, प्रकृति, राज्य तथ्य और सरल इतिहास।",
    },
    targetClasses: { en: "Class 1–3 (Seed)", ta: "வகுப்பு 1–3 (விதை)", hi: "कक्षा 1–3 (बीज)" },
    accent: "var(--amber)",
    iconName: "plant",
    defaultSeconds: null,
  },
  intermediate: {
    id: "intermediate",
    name: { en: "Intermediate Level", ta: "இடைநிலை", hi: "मध्यम स्तर" },
    badge: { en: "Level 2 · Intermediate", ta: "நிலை 2 · இடைநிலை", hi: "स्तर 2 · मध्यम" },
    subtitle: {
      en: "Bharat & World — Freedom fighters, geography, monuments, space & science.",
      ta: "பாரதம் & உலகம் — விடுதலைப் போராட்ட வீரர்கள், புவியியல், அறிவியல் மற்றும் வரலாறு.",
      hi: "भारत और विश्व — स्वतंत्रता सेनानी, भूगोल, स्मारक, अंतरिक्ष और विज्ञान।",
    },
    targetClasses: { en: "Class 4–10 (Plant)", ta: "வகுப்பு 4–10 (செடி)", hi: "कक्षा 4–10 (पौधा)" },
    accent: "var(--violet)",
    iconName: "compass",
    defaultSeconds: 45,
  },
  advanced: {
    id: "advanced",
    name: { en: "Advanced Level", ta: "மேல்நிலை", hi: "उन्नत स्तर" },
    badge: { en: "Level 3 · Advanced", ta: "நிலை 3 · மேல்நிலை", hi: "स्तर 3 · उन्नत" },
    subtitle: {
      en: "High School & Board — Constitution, governance, space missions, economy & current affairs.",
      ta: "மேல்நிலை & தேர்வுகள் — அரசியலமைப்பு, ஆட்சிமுறை, சந்திரயான்/இஸ்ரோ, பொருளாதாரம்.",
      hi: "उच्चतर स्तर — संविधान, शासन, अंतरिक्ष अभियान, अर्थव्यवस्था और समसामयिकी।",
    },
    targetClasses: { en: "Class 11–12 (Tree)", ta: "வகுப்பு 11–12 (மரம்)", hi: "कक्षा 11–12 (वृक्ष)" },
    accent: "var(--teal)",
    iconName: "crown",
    defaultSeconds: 30,
  },
};

export function bandToGkLevel(band: Band): GkLevel {
  switch (band) {
    case "junior":
      return "primary";
    case "middle":
      return "intermediate";
    case "senior":
      return "advanced";
  }
}

export function gkLevelToBand(level: GkLevel): Band {
  switch (level) {
    case "primary":
      return "junior";
    case "intermediate":
      return "middle";
    case "advanced":
      return "senior";
  }
}

// ----------------------------------------------------------------------------
// 1. PRIMARY LEVEL GK QUESTIONS (Foundational: Class 1-3)
// ----------------------------------------------------------------------------
export const PRIMARY_QUIZ: readonly Question[] = [
  {
    id: "j-animal",
    q: { en: "What is the national animal of India?", ta: "இந்தியாவின் தேசிய விலங்கு எது?", hi: "भारत का राष्ट्रीय पशु कौन-सा है?" },
    options: [
      { en: "Tiger", ta: "புலி", hi: "बाघ" },
      { en: "Lion", ta: "சிங்கம்", hi: "शेर" },
      { en: "Elephant", ta: "யானை", hi: "हाथी" },
      { en: "Deer", ta: "மான்", hi: "हिरण" },
    ],
    answer: 0,
    explain: {
      en: "The Royal Bengal tiger is India's national animal, symbolising strength and grace.",
      ta: "வங்காளப் புலியே இந்தியாவின் தேசிய விலங்கு; இது வலிமை மற்றும் கம்பீரத்தின் சின்னம்.",
      hi: "रॉयल बंगाल टाइगर भारत का राष्ट्रीय पशु है।",
    },
  },
  {
    id: "j-bird",
    q: { en: "Which is our national bird?", ta: "நம் தேசியப் பறவை எது?", hi: "हमारा राष्ट्रीय पक्षी कौन-सा है?" },
    options: [
      { en: "Parrot", ta: "கிளி", hi: "तोता" },
      { en: "Peacock", ta: "மயில்", hi: "मोर" },
      { en: "Sparrow", ta: "சிட்டுக்குருவி", hi: "गौरैया" },
      { en: "Eagle", ta: "கழுகு", hi: "चील" },
    ],
    answer: 1,
    explain: {
      en: "The Indian peacock, with its colourful feathers, is India's national bird.",
      ta: "வண்ணத் தோகை கொண்ட மயிலே இந்தியாவின் தேசியப் பறவை.",
      hi: "रंग-बिरंगे पंखों वाला मोर भारत का राष्ट्रीय पक्षी है।",
    },
  },
  {
    id: "j-flag",
    q: {
      en: "How many colour bands does our national flag have?",
      ta: "நம் தேசியக் கொடியில் எத்தனை வண்ணப் பட்டைகள் உள்ளன?",
      hi: "हमारे राष्ट्रीय ध्वज में कितनी रंगीन पट्टियाँ हैं?",
    },
    options: [
      { en: "Two", ta: "இரண்டு", hi: "दो" },
      { en: "Three", ta: "மூன்று", hi: "तीन" },
      { en: "Four", ta: "நான்கு", hi: "चार" },
      { en: "Five", ta: "ஐந்து", hi: "पाँच" },
    ],
    answer: 1,
    explain: {
      en: "Saffron, white and green, with the navy-blue Ashoka Chakra in the middle.",
      ta: "காவி, வெள்ளை, பச்சை — நடுவில் நீல நிற அசோகச் சக்கரம்.",
      hi: "केसरिया, सफ़ेद और हरा — बीच में नीले रंग का अशोक चक्र।",
    },
  },
  {
    id: "j-flower",
    q: { en: "What is the national flower of India?", ta: "இந்தியாவின் தேசிய மலர் எது?", hi: "भारत का राष्ट्रीय पुष्प कौन-सा है?" },
    options: [
      { en: "Rose", ta: "ரோஜா", hi: "गुलाब" },
      { en: "Jasmine", ta: "மல்லிகை", hi: "चमेली" },
      { en: "Lotus", ta: "தாமரை", hi: "कमल" },
      { en: "Sunflower", ta: "சூரியகாந்தி", hi: "सूरजमुखी" },
    ],
    answer: 2,
    explain: {
      en: "The sacred lotus is India's national flower, signifying purity and wisdom.",
      ta: "தாமரையே இந்தியாவின் தேசிய மலர்; இது தூய்மை மற்றும் அறிவின் சின்னம்.",
      hi: "कमल भारत का राष्ट्रीय पुष्प है, जो पवित्रता का प्रतीक है।"
    },
  },
  {
    id: "j-independence",
    q: {
      en: "On which day do we celebrate Independence Day?",
      ta: "சுதந்திர தினத்தை எந்த நாளில் கொண்டாடுகிறோம்?",
      hi: "हम स्वतंत्रता दिवस किस दिन मनाते हैं?",
    },
    options: [
      { en: "26 January", ta: "ஜனவரி 26", hi: "26 जनवरी" },
      { en: "2 October", ta: "அக்டோபர் 2", hi: "2 अक्टूबर" },
      { en: "15 August", ta: "ஆகஸ்ட் 15", hi: "15 अगस्त" },
      { en: "14 November", ta: "நவம்பர் 14", hi: "14 नवंबर" },
    ],
    answer: 2,
    explain: {
      en: "India became free on 15 August 1947 after the historic freedom struggle.",
      ta: "இந்தியா 1947 ஆகஸ்ட் 15 அன்று சுதந்திரம் பெற்றது.",
      hi: "भारत 15 अगस्त 1947 को आज़ाद हुआ।",
    },
  },
  {
    id: "j-capital",
    q: { en: "What is the capital of Tamil Nadu?", ta: "தமிழ்நாட்டின் தலைநகரம் எது?", hi: "तमिलनाडु की राजधानी कौन-सी है?" },
    options: [
      { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
      { en: "Chennai", ta: "சென்னை", hi: "चेन्नई" },
      { en: "Coimbatore", ta: "கோயம்புத்தூர்", hi: "कोयंबटूर" },
      { en: "Salem", ta: "சேலம்", hi: "सेलम" },
    ],
    answer: 1,
    explain: {
      en: "Chennai is the capital of Tamil Nadu and a major cultural and port city.",
      ta: "சென்னையே தமிழ்நாட்டின் தலைநகரமும் முதன்மைத் துறைமுக நகரமும் ஆகும்.",
      hi: "चेन्नई तमिलनाडु की राजधानी है।"
    },
  },
  {
    id: "j-tree",
    q: { en: "What is the national tree of India?", ta: "இந்தியாவின் தேசிய மரம் எது?", hi: "भारत का राष्ट्रीय वृक्ष कौन-सा है?" },
    options: [
      { en: "Neem tree", ta: "வேப்ப மரம்", hi: "नीम का पेड़" },
      { en: "Mango tree", ta: "மாமரம்", hi: "आम का पेड़" },
      { en: "Banyan tree", ta: "ஆலமரம்", hi: "बरगद का पेड़" },
      { en: "Coconut tree", ta: "தென்னை மரம்", hi: "नारियल का पेड़" },
    ],
    answer: 2,
    explain: {
      en: "The Indian banyan tree (Ficus benghalensis) with deep aerial roots is the national tree.",
      ta: "விழுதுகள் கொண்ட ஆலமரமே இந்தியாவின் தேசிய மரமாகும்.",
      hi: "बरगद (वटवृक्ष) भारत का राष्ट्रीय वृक्ष है।"
    },
  },
  {
    id: "j-fruit",
    q: { en: "What is the national fruit of India?", ta: "இந்தியாவின் தேசிய பழம் எது?", hi: "भारत का राष्ट्रीय फल कौन-सा है?" },
    options: [
      { en: "Apple", ta: "ஆப்பிள்", hi: "सेब" },
      { en: "Banana", ta: "வாழைப்பழம்", hi: "केला" },
      { en: "Mango", ta: "மாம்பழம்", hi: "आम" },
      { en: "Orange", ta: "ஆரஞ்சு", hi: "संतरा" },
    ],
    answer: 2,
    explain: {
      en: "The sweet, golden mango is India's national fruit.",
      ta: "சுவையான மாம்பழமே இந்தியாவின் தேசியப் பழமாகும்.",
      hi: "रसीला आम भारत का राष्ट्रीय फल है।"
    },
  },
  {
    id: "j-song",
    q: { en: "What is 'Vande Mataram' designated as in India?", ta: "இந்தியாவில் 'வந்தே மாதரம்' எத்தகைய பாடலாக ஏற்கப்பட்டுள்ளது?", hi: "भारत में 'वन्दे मातरम्' को क्या दर्जा प्राप्त है?" },
    options: [
      { en: "National Anthem", ta: "நாட்டுப்பண்", hi: "राष्ट्रगान" },
      { en: "National Song", ta: "தேசியப் பாடல்", hi: "राष्ट्रगीत" },
      { en: "State Song", ta: "மாநிலப் பாடல்", hi: "राज्यगीत" },
      { en: "Folk Song", ta: "நாட்டுப்புறப் பாடல்", hi: "लोकगीत" },
    ],
    answer: 1,
    explain: {
      en: "Jana Gana Mana is the National Anthem, while Vande Mataram is the National Song.",
      ta: "ஜன கண மன நாட்டுப்பண் ஆகும்; வந்தே மாதரம் தேசியப் பாடல் ஆகும்.",
      hi: "जन गण मन राष्ट्रगान है और वन्दे मातरम् राष्ट्रीय गीत है।"
    },
  },
  {
    id: "j-currency",
    q: { en: "What is the currency of India?", ta: "இந்தியாவின் நாணயம் எது?", hi: "भारत की मुद्रा कौन-सी है?" },
    options: [
      { en: "Dollar", ta: "டாலர்", hi: "डॉलर" },
      { en: "Indian Rupee", ta: "இந்திய ரூபாய்", hi: "भारतीय रुपया" },
      { en: "Pound", ta: "பவுண்ட்", hi: "पाउंड" },
      { en: "Yen", ta: "யென்", hi: "येन" },
    ],
    answer: 1,
    explain: {
      en: "The Indian Rupee (INR, ₹) is the official currency of India.",
      ta: "இந்திய ரூபாய் (₹) இந்தியாவின் அதிகாரப்பூர்வ நாணயமாகும்.",
      hi: "भारतीय रुपया (₹) भारत की आधिकारिक मुद्रा है।"
    },
  },
  {
    id: "j-pongal",
    q: { en: "Which traditional harvest festival is celebrated with joy in Tamil Nadu?", ta: "தமிழ்நாட்டில் மகிழ்ச்சியுடன் கொண்டாடப்படும் அறுவடைத் திருவிழா எது?", hi: "तमिलनाडु में मनाया जाने वाला प्रमुख फसल उत्सव कौन-सा है?" },
    options: [
      { en: "Diwali", ta: "தீபாவளி", hi: "दिवाली" },
      { en: "Pongal", ta: "பொங்கல்", hi: "पोंगल" },
      { en: "Holi", ta: "ஹோலி", hi: "होली" },
      { en: "Navaratri", ta: "நவராத்திரி", hi: "नवरात्रि" },
    ],
    answer: 1,
    explain: {
      en: "Pongal is the 4-day Thanksgiving harvest festival celebrating the Sun, nature, and farm cattle.",
      ta: "பொங்கல் திருநாள் இயற்கையையும் கதிரவனையும் உழவு மாடுகளையும் போற்றும் தமிழர் அறுவடைத் திருவிழா.",
      hi: "पोंगल तमिलनाडु का प्रसिद्ध 4 दिवसीय फसल उत्सव है।"
    },
  },
  {
    id: "j-gandhi",
    q: { en: "Who is affectionately known as the 'Father of the Nation' in India?", ta: "இந்தியாவின் 'தேசப்பிதா' என்று அன்புடன் அழைக்கப்படுபவர் யார்?", hi: "भारत में 'राष्ट्रपिता' के नाम से किसे जाना जाता है?" },
    options: [
      { en: "Subhas Chandra Bose", ta: "சுபாஷ் சந்திர போஸ்", hi: "सुभाष चंद्र बोस" },
      { en: "Mahatma Gandhi", ta: "மகாத்மா காந்தி", hi: "महात्मा गांधी" },
      { en: "Bhagat Singh", ta: "பகத் சிங்", hi: "भगत सिंह" },
      { en: "B. R. Ambedkar", ta: "பி. ஆர். அம்பேத்கர்", hi: "बी. आर. आंबेडकर" },
    ],
    answer: 1,
    explain: {
      en: "Mahatma Gandhi led India to freedom through truth and non-violence (Ahimsa).",
      ta: "மகாத்மா காந்தி உண்மை மற்றும் அஹிம்சை வழியில் விடுதலைப் போராட்டத்தை வழிநடத்தினார்.",
      hi: "महात्मा गांधी ने सत्य और अहिंसा के मार्ग पर चलकर स्वतंत्रता दिलाई।"
    },
  },
];

// ----------------------------------------------------------------------------
// 2. INTERMEDIATE LEVEL GK QUESTIONS (Samacheer & Bharat Ko Jano: Class 4-10)
// ----------------------------------------------------------------------------
export const INTERMEDIATE_QUIZ: readonly Question[] = [
  {
    id: "m-anthem",
    q: { en: "Who wrote our national anthem, Jana Gana Mana?", ta: "நாட்டுப்பண் 'ஜன கண மன'வை இயற்றியவர் யார்?", hi: "राष्ट्रगान 'जन गण मन' किसने लिखा?" },
    options: [
      { en: "Bankim Chandra Chatterjee", ta: "பங்கிம் சந்திர சட்டர்ஜி", hi: "बंकिम चंद्र चट्टोपाध्याय" },
      { en: "Subramania Bharati", ta: "சுப்பிரமணிய பாரதி", hi: "सुब्रमण्य भारती" },
      { en: "Rabindranath Tagore", ta: "இரவீந்திரநாத் தாகூர்", hi: "रवींद्रनाथ टैगोर" },
      { en: "Sarojini Naidu", ta: "சரோஜினி நாயுடு", hi: "सरोजिनी नायडू" },
    ],
    answer: 2,
    explain: {
      en: "Rabindranath Tagore wrote it; it was adopted as the national anthem in 1950.",
      ta: "இரவீந்திரநாத் தாகூர் இயற்றினார்; 1950-இல் நாட்டுப்பண்ணாக ஏற்கப்பட்டது.",
      hi: "इसे रवींद्रनाथ टैगोर ने लिखा; 1950 में इसे राष्ट्रगान के रूप में अपनाया गया।",
    },
  },
  {
    id: "m-chakra",
    q: { en: "How many spokes does the Ashoka Chakra have?", ta: "அசோகச் சக்கரத்தில் எத்தனை ஆரங்கள் உள்ளன?", hi: "अशोक चक्र में कितनी तीलियाँ हैं?" },
    options: [
      { en: "12", ta: "12", hi: "12" },
      { en: "16", ta: "16", hi: "16" },
      { en: "24", ta: "24", hi: "24" },
      { en: "32", ta: "32", hi: "32" },
    ],
    answer: 2,
    explain: { en: "The Ashoka Chakra has 24 spokes representing 24 virtuous principles.", ta: "அசோகச் சக்கரத்தில் 24 ஆரங்கள் உள்ளன.", hi: "अशोक चक्र में 24 तीलियाँ होती हैं।" },
  },
  {
    id: "m-pm",
    q: { en: "Who was the first Prime Minister of independent India?", ta: "சுதந்திர இந்தியாவின் முதல் பிரதமர் யார்?", hi: "स्वतंत्र भारत के पहले प्रधानमंत्री कौन थे?" },
    options: [
      { en: "Sardar Vallabhbhai Patel", ta: "சர்தார் வல்லபாய் படேல்", hi: "सरदार वल्लभभाई पटेल" },
      { en: "Jawaharlal Nehru", ta: "ஜவஹர்லால் நேரு", hi: "जवाहरलाल नेहरू" },
      { en: "Lal Bahadur Shastri", ta: "லால் பகதூர் சாஸ்திரி", hi: "लाल बहादुर शास्त्री" },
      { en: "Rajendra Prasad", ta: "ராஜேந்திர பிரசாத்", hi: "राजेंद्र प्रसाद" },
    ],
    answer: 1,
    explain: {
      en: "Jawaharlal Nehru served as Prime Minister from 1947 to 1964.",
      ta: "ஜவஹர்லால் நேரு 1947 முதல் 1964 வரை பிரதமராக இருந்தார்.",
      hi: "जवाहरलाल नेहरू 1947 से 1964 तक प्रधानमंत्री रहे।",
    },
  },
  {
    id: "m-vande",
    q: { en: "Who wrote the national song 'Vande Mataram'?", ta: "தேசியப் பாடல் 'வந்தே மாதரம்' பாடலை இயற்றியவர் யார்?", hi: "राष्ट्रगीत 'वन्दे मातरम्' किसने लिखा?" },
    options: [
      { en: "Bankim Chandra Chatterjee", ta: "பங்கிம் சந்திர சட்டர்ஜி", hi: "बंकिम चंद्र चट्टोपाध्याय" },
      { en: "Rabindranath Tagore", ta: "இரவீந்திரநாத் தாகூர்", hi: "रवींद्रनाथ टैगोर" },
      { en: "Muhammad Iqbal", ta: "முகம்மது இக்பால்", hi: "मुहम्मद इक़बाल" },
      { en: "Subramania Bharati", ta: "சுப்பிரமணிய பாரதி", hi: "सुब्रमण्य भारती" },
    ],
    answer: 0,
    explain: {
      en: "Bankim Chandra Chatterjee wrote it in his novel Anandamath (1882).",
      ta: "பங்கிம் சந்திர சட்டர்ஜி 1882-இல் எழுதிய ஆனந்தமடம் நாவலில் இப்பாடல் இடம்பெற்றது.",
      hi: "इसे बंकिम चंद्र चट्टोपाध्याय ने 1882 में अपने उपन्यास आनंदमठ में लिखा।",
    },
  },
  {
    id: "m-river",
    q: { en: "Which is the longest river in India?", ta: "இந்தியாவின் மிக நீளமான ஆறு எது?", hi: "भारत की सबसे लंबी नदी कौन-सी है?" },
    options: [
      { en: "Godavari", ta: "கோதாவரி", hi: "गोदावरी" },
      { en: "Kaveri", ta: "காவிரி", hi: "कावेरी" },
      { en: "Yamuna", ta: "யமுனை", hi: "यमुना" },
      { en: "Ganga", ta: "கங்கை", hi: "गंगा" },
    ],
    answer: 3,
    explain: {
      en: "The Ganga flows about 2,525 km through India and is sacred in Indian heritage.",
      ta: "கங்கை இந்தியாவில் சுமார் 2,525 கி.மீ. பாயும் மிக நீளமான நதியாகும்.",
      hi: "गंगा भारत में लगभग 2,525 किमी बहने वाली सबसे लंबी नदी है।",
    },
  },
  {
    id: "m-republic",
    q: {
      en: "What do we celebrate on Republic Day, 26 January?",
      ta: "ஜனவரி 26 குடியரசு தினத்தில் எதைக் கொண்டாடுகிறோம்?",
      hi: "26 जनवरी, गणतंत्र दिवस पर हम क्या मनाते हैं?",
    },
    options: [
      { en: "India's freedom from British rule", ta: "ஆங்கிலேய ஆட்சியிலிருந்து விடுதலை", hi: "अंग्रेज़ी शासन से आज़ादी" },
      { en: "The Constitution coming into force", ta: "அரசியலமைப்பு நடைமுறைக்கு வந்தது", hi: "संविधान का लागू होना" },
      { en: "Mahatma Gandhi's birthday", ta: "மகாத்மா காந்தியின் பிறந்தநாள்", hi: "महात्मा गांधी का जन्मदिन" },
      { en: "The first general election", ta: "முதல் பொதுத் தேர்தல்", hi: "पहला आम चुनाव" },
    ],
    answer: 1,
    explain: {
      en: "Our Constitution came into force on 26 January 1950, making India a sovereign democratic Republic.",
      ta: "நம் அரசியலமைப்பு 1950 ஜனவரி 26 அன்று நடைமுறைக்கு வந்து இந்தியா குடியரசானது.",
      hi: "हमारा संविधान 26 जनवरी 1950 को लागू हुआ था।",
    },
  },
  {
    id: "m-peak",
    q: { en: "Which is the highest mountain peak in South India?", ta: "தென்னிந்தியாவின் மிக உயரமான சிகரம் எது?", hi: "दक्षिण भारत की सबसे ऊँची पर्वत चोटी कौन-सी है?" },
    options: [
      { en: "Doddabetta", ta: "தொட்டபட்டா", hi: "डोड्डाबेट्टा" },
      { en: "Anamudi", ta: "ஆனைமுடி", hi: "अनामुडी" },
      { en: "Agasthiyar Malai", ta: "அகத்தியர் மலை", hi: "अगस्त्य मलाई" },
      { en: "Kodaikanal Peak", ta: "கொடைக்கானல் சிகரம்", hi: "कोडाइकनाल चोटी" },
    ],
    answer: 1,
    explain: {
      en: "Anamudi in the Western Ghats (Kerala, 2,695 m) is the highest peak in South India.",
      ta: "மேற்குத் தொடர்ச்சி மலையில் உள்ள ஆனைமுடி (2,695 மீ) தென்னிந்தியாவின் உயரமான சிகரம்.",
      hi: "पश्चिमी घाट में स्थित अनामुडी (2,695 मीटर) दक्षिण भारत की सबसे ऊँची चोटी है।"
    },
  },
  {
    id: "m-kalam",
    q: { en: "Who was affectionately hailed as the 'Missile Man of India' and became the 11th President?", ta: "'இந்தியாவின் ஏவுகணை மனிதர்' என்று போற்றப்பட்ட 11-வது குடியரசுத் தலைவர் யார்?", hi: "भारत के 'मिसाइल मैन' और 11वें राष्ट्रपति कौन थे?" },
    options: [
      { en: "Homi Bhabha", ta: "ஹோமி பாபா", hi: "होमी भाभा" },
      { en: "Vikram Sarabhai", ta: "விக்ரம் சாராபாய்", hi: "विक्रम साराभाई" },
      { en: "Dr A. P. J. Abdul Kalam", ta: "டாக்டர் ஏ. பி. ஜே. அப்துல் கலாம்", hi: "डॉ. ए. पी. जे. अब्दुल कलाम" },
      { en: "C. V. Raman", ta: "சி. வி. இராமன்", hi: "सी. वी. रमन" },
    ],
    answer: 2,
    explain: {
      en: "Dr A. P. J. Abdul Kalam from Rameswaram, Tamil Nadu, was known as the Missile Man and People's President.",
      ta: "இராமேஸ்வரத்தைச் சேர்ந்த டாக்டர் ஏ. பி. ஜே. அப்துல் கலாம் இந்தியாவின் மக்கள் ஜனாதிபதியாகத் திகழ்ந்தார்.",
      hi: "डॉ. कलाम को भारत के मिसाइल कार्यक्रम के विकास के लिए मिसाइल मैन कहा जाता है।"
    },
  },
  {
    id: "m-thanjavur",
    q: { en: "Who built the world-renowned Brihadisvara Temple (Big Temple) in Thanjavur?", ta: "தஞ்சைப் பெரிய கோவிலைக் கட்டிய சோழப் பேரரசர் யார்?", hi: "तंजாவुर के प्रसिद्ध बृहदीश्वर मंदिर का निर्माण किसने कराया था?" },
    options: [
      { en: "Rajendra Chola I", ta: "முதலாம் ராஜேந்திர சோழன்", hi: "राजेंद्र चोल प्रथम" },
      { en: "Raja Raja Chola I", ta: "முதலாம் ராஜராஜ சோழன்", hi: "राजा राज चोल प्रथम" },
      { en: "Kulothunga Chola", ta: "குலோத்துங்க சோழன்", hi: "कुलोत्तुंग चोल" },
      { en: "Karikala Chola", ta: "கரிகால் சோழன்", hi: "करिकाल चोल" },
    ],
    answer: 1,
    explain: {
      en: "Raja Raja Chola I completed this UNESCO World Heritage monument in 1010 CE.",
      ta: "முதலாம் ராஜராஜ சோழன் கி.பி. 1010-இல் இம்மாபெரும் தஞ்சைக் கோவிலைக் கட்டி முடித்தார்.",
      hi: "राजा राज चोल प्रथम ने 1010 ईस्वी में इस भव्य यूनेस्को विश्व धरोहर मंदिर का निर्माण कराया।"
    },
  },
  {
    id: "m-isro",
    q: { en: "Where is the headquarters of ISRO (Indian Space Research Organisation) located?", ta: "இந்திய விண்வெளி ஆராய்ச்சி நிறுவனத்தின் (இஸ்ரோ) தலைமையகம் எங்குள்ளது?", hi: "भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) का मुख्यालय कहाँ है?" },
    options: [
      { en: "Hyderabad", ta: "ஹைதராபாத்", hi: "हैदराबाद" },
      { en: "Bengaluru", ta: "பெங்களூரு", hi: "बेंगलुरु" },
      { en: "Thiruvananthapuram", ta: "திருவனந்தபுரம்", hi: "तिरुवनंतपुरम" },
      { en: "Sriharikota", ta: "ஸ்ரீஹரிகோட்டா", hi: "श्रीहरिकोटा" },
    ],
    answer: 1,
    explain: {
      en: "ISRO headquarters is in Bengaluru, Karnataka; launches take place from Sriharikota, AP.",
      ta: "இஸ்ரோவின் தலைமையகம் பெங்களூரில் உள்ளது; ஏவுதளம் ஸ்ரீஹரிகோட்டாவில் உள்ளது.",
      hi: "इसरो का मुख्यालय बेंगलुरु में स्थित है और प्रक्षेपण केंद्र श्रीहरिकोटा में है।"
    },
  },
  {
    id: "m-bharathi",
    q: { en: "In which historic town was Mahakavi Subramania Bharathiyar born?", ta: "மகாகவி சுப்பிரமணிய பாரதியார் பிறந்த ஊர் எது?", hi: "महाकवि सुब्रमण्य भारती का जन्म किस नगर में हुआ था?" },
    options: [
      { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
      { en: "Tirunelveli", ta: "திருநெல்வேலி", hi: "तिरुनेलवेली" },
      { en: "Ettayapuram", ta: "எட்டயபுரம்", hi: "एट्टयपुरम" },
      { en: "Puducherry", ta: "புதுச்சேரி", hi: "पुदुचेरी" },
    ],
    answer: 2,
    explain: {
      en: "Bharathiyar was born in Ettayapuram in 1882 and inspired the freedom movement through poetry.",
      ta: "பாரதியார் 1882-இல் எட்டயபுரத்தில் பிறந்தார்; விடுதலை தாகத்தை கவிதைகளால் ஊட்டினார்.",
      hi: "भारती का जन्म 1882 में एट्टयपुरम में हुआ था।"
    },
  },
  {
    id: "m-states",
    q: { en: "How many States and Union Territories are there in India currently?", ta: "தற்போது இந்தியாவில் எத்தனை மாநிலங்கள் மற்றும் யூனியன் பிரதேசங்கள் உள்ளன?", hi: "वर्तमान में भारत में कितने राज्य और केंद्र शासित प्रदेश हैं?" },
    options: [
      { en: "25 States and 7 UTs", ta: "25 மாநிலங்கள், 7 யூனியன் பிரதேசங்கள்", hi: "25 राज्य और 7 केंद्र शासित प्रदेश" },
      { en: "28 States and 8 UTs", ta: "28 மாநிலங்கள், 8 யூனியன் பிரதேசங்கள்", hi: "28 राज्य और 8 केंद्र शासित प्रदेश" },
      { en: "29 States and 7 UTs", ta: "29 மாநிலங்கள், 7 யூனியன் பிரதேசங்கள்", hi: "29 राज्य और 7 केंद्र शासित प्रदेश" },
      { en: "30 States and 8 UTs", ta: "30 மாநிலங்கள், 8 யூனியன் பிரதேசங்கள்", hi: "30 राज्य और 8 केंद्र शासित प्रदेश" },
    ],
    answer: 1,
    explain: {
      en: "India comprises 28 States and 8 Union Territories.",
      ta: "இந்தியா 28 மாநிலங்களையும் 8 யூனியன் பிரதேசங்களையும் கொண்டுள்ளது.",
      hi: "भारत में 28 राज्य और 8 केंद्र शासित प्रदेश हैं।"
    },
  },
];

// ----------------------------------------------------------------------------
// 3. ADVANCED LEVEL GK QUESTIONS (High School, Board & Competitive: Class 11-12)
// ----------------------------------------------------------------------------
export const ADVANCED_QUIZ: readonly Question[] = [
  {
    id: "s-constitution",
    q: {
      en: "The Constitution of India was adopted on 26 November 1949. When did it come into force?",
      ta: "இந்திய அரசியலமைப்பு 1949 நவம்பர் 26 அன்று ஏற்கப்பட்டது. அது எப்போது நடைமுறைக்கு வந்தது?",
      hi: "भारत का संविधान 26 नवंबर 1949 को अपनाया गया। यह कब लागू हुआ?",
    },
    options: [
      { en: "15 August 1947", ta: "1947 ஆகஸ்ட் 15", hi: "15 अगस्त 1947" },
      { en: "26 January 1950", ta: "1950 ஜனவரி 26", hi: "26 जनवरी 1950" },
      { en: "26 November 1950", ta: "1950 நவம்பர் 26", hi: "26 नवंबर 1950" },
      { en: "2 October 1949", ta: "1949 அக்டோபர் 2", hi: "2 अक्टूबर 1949" },
    ],
    answer: 1,
    explain: {
      en: "It came into force on 26 January 1950, now celebrated as Republic Day.",
      ta: "1950 ஜனவரி 26 அன்று நடைமுறைக்கு வந்தது; அந்நாள் குடியரசு தினமாகக் கொண்டாடப்படுகிறது.",
      hi: "यह 26 जनवरी 1950 को लागू हुआ, जिसे अब गणतंत्र दिवस के रूप में मनाया जाता है।",
    },
  },
  {
    id: "s-ambedkar",
    q: {
      en: "Who chaired the Drafting Committee of the Indian Constitution?",
      ta: "இந்திய அரசியலமைப்பு வரைவுக் குழுவின் தலைவர் யார்?",
      hi: "संविधान की प्रारूप समिति के अध्यक्ष कौन थे?",
    },
    options: [
      { en: "Jawaharlal Nehru", ta: "ஜவஹர்லால் நேரு", hi: "जवाहरलाल नेहरू" },
      { en: "Rajendra Prasad", ta: "ராஜேந்திர பிரசாத்", hi: "राजेंद्र प्रसाद" },
      { en: "Dr B. R. Ambedkar", ta: "டாக்டர் பி. ஆர். அம்பேத்கர்", hi: "डॉ. बी. आर. आंबेडकर" },
      { en: "Sardar Vallabhbhai Patel", ta: "சர்தார் வல்லபாய் படேல்", hi: "सरदार वल्लभभाई पटेल" },
    ],
    answer: 2,
    explain: {
      en: "Dr B. R. Ambedkar chaired the Drafting Committee and is known as the Chief Architect of the Constitution.",
      ta: "டாக்டர் பி. ஆர். அம்பேத்கர் வரைவுக் குழுவின் தலைவராகவும் அரசியலமைப்பின் தலைமைச் சிற்பியாகவும் திகழ்ந்தார்.",
      hi: "डॉ. बी. आर. आंबेडकर प्रारूप समिति के अध्यक्ष थे।",
    },
  },
  {
    id: "s-article21",
    q: { en: "What does Article 21 of the Indian Constitution guarantee?", ta: "இந்திய அரசியலமைப்பின் பிரிவு 21 எதைப் பாதுகாக்கிறது?", hi: "भारतीय संविधान का अनुच्छेद 21 किसकी गारंटी देता है?" },
    options: [
      { en: "Equality before law", ta: "சட்டத்தின் முன் சமத்துவம்", hi: "क़ानून के समक्ष समानता" },
      { en: "Freedom of speech and expression", ta: "பேச்சு மற்றும் கருத்து சுதந்திரம்", hi: "भाषण और अभिव्यक्ति की स्वतंत्रता" },
      { en: "Right to constitutional remedies", ta: "அரசியலமைப்புத் தீர்வுகளுக்கான உரிமை", hi: "संवैधानिक उपचारों का अधिकार" },
      { en: "Protection of life and personal liberty", ta: "உயிர் மற்றும் தனிப்பட்ட சுதந்திரப் பாதுகாப்பு", hi: "प्राण और दैहिक स्वतंत्रता का संरक्षण" },
    ],
    answer: 3,
    explain: {
      en: "Article 21 protects life and personal liberty. Equality is Article 14; remedies are Article 32.",
      ta: "பிரிவு 21 உயிரையும் தனிப்பட்ட சுதந்திரத்தையும் பாதுகாக்கிறது. சமத்துவம் பிரிவு 14; தீர்வுகள் பிரிவு 32.",
      hi: "अनुच्छेद 21 प्राण और दैहिक स्वतंत्रता की रक्षा करता है। समानता अनुच्छेद 14 में और उपचार अनुच्छेद 32 में हैं।",
    },
  },
  {
    id: "s-president",
    q: { en: "Who was the first President of India?", ta: "இந்தியாவின் முதல் குடியரசுத் தலைவர் யார்?", hi: "भारत के पहले राष्ट्रपति कौन थे?" },
    options: [
      { en: "Dr Rajendra Prasad", ta: "டாக்டர் ராஜேந்திர பிரசாத்", hi: "डॉ. राजेंद्र प्रसाद" },
      { en: "Dr S. Radhakrishnan", ta: "டாக்டர் எஸ். ராதாகிருஷ்ணன்", hi: "डॉ. एस. राधाकृष्णन" },
      { en: "Dr Zakir Husain", ta: "டாக்டர் ஜாகிர் உசேன்", hi: "डॉ. ज़ाकिर हुसैन" },
      { en: "V. V. Giri", ta: "வி. வி. கிரி", hi: "वी. वी. गिरि" },
    ],
    answer: 0,
    explain: {
      en: "Dr Rajendra Prasad served as President from 1950 to 1962.",
      ta: "டாக்டர் ராஜேந்திர பிரசாத் 1950 முதல் 1962 வரை குடியரசுத் தலைவராக இருந்தார்.",
      hi: "डॉ. राजेंद्र प्रसाद 1950 से 1962 तक राष्ट्रपति रहे।",
    },
  },
  {
    id: "s-chandrayaan",
    q: {
      en: "In August 2023, Chandrayaan-3 achieved a historic landing near which region of the Moon?",
      ta: "2023 ஆகஸ்டில் சந்திரயான்-3 நிலவின் எந்தப் பகுதிக்கு அருகில் தரையிறங்கியது?",
      hi: "अगस्त 2023 में चंद्रयान-3 चंद्रमा के किस क्षेत्र के पास उतरा?",
    },
    options: [
      { en: "North pole", ta: "வட துருவம்", hi: "उत्तरी ध्रुव" },
      { en: "Equator", ta: "நிலநடுக்கோடு", hi: "भूमध्य रेखा" },
      { en: "South pole region", ta: "தென் துருவப் பகுதி", hi: "दक्षिणी ध्रुव क्षेत्र" },
      { en: "Sea of Tranquility", ta: "அமைதிக் கடல்", hi: "शांति का सागर" },
    ],
    answer: 2,
    explain: {
      en: "On 23 August 2023 India became the first country to land near the Moon's south pole (celebrated as National Space Day).",
      ta: "2023 ஆகஸ்ட் 23 அன்று நிலவின் தென் துருவத்துக்கு அருகில் தரையிறங்கிய முதல் நாடு இந்தியா; இந்நாள் தேசிய விண்வெளி தினமாகக் கொண்டாடப்படுகிறது.",
      hi: "23 अगस्त 2023 को भारत चंद्रमा के दक्षिणी ध्रुव के पास उतरने वाला विश्व का पहला देश बना।",
    },
  },
  {
    id: "s-rbi",
    q: {
      en: "Where is the headquarters of the Reserve Bank of India located?",
      ta: "இந்திய ரிசர்வ் வங்கியின் தலைமையகம் எங்கு உள்ளது?",
      hi: "भारतीय रिज़र्व बैंक का मुख्यालय कहाँ है?",
    },
    options: [
      { en: "New Delhi", ta: "புது தில்லி", hi: "नई दिल्ली" },
      { en: "Mumbai", ta: "மும்பை", hi: "मुंबई" },
      { en: "Kolkata", ta: "கொல்கத்தா", hi: "कोलकाता" },
      { en: "Chennai", ta: "சென்னை", hi: "चेन्नई" },
    ],
    answer: 1,
    explain: {
      en: "The RBI was set up in 1935; its central headquarters moved to Mumbai in 1937.",
      ta: "ரிசர்வ் வங்கி 1935-இல் தொடங்கப்பட்டது; 1937-இல் தலைமையகம் மும்பைக்கு மாற்றப்பட்டது.",
      hi: "आरबीआई की स्थापना 1935 में हुई; 1937 में इसका मुख्यालय मुंबई आ गया।",
    },
  },
  {
    id: "s-aditya",
    q: { en: "What is India's dedicated solar observatory mission placed at Sun-Earth Lagrange Point 1?", ta: "சூரியனை ஆய்வு செய்ய சூரியன்-பூமி லெக்ராஞ்சியன் புள்ளி 1-இல் நிலைநிறுத்தப்பட்ட இந்திய விண்கலம் எது?", hi: "सूर्य का अध्ययन करने वाला भारत का पहला सौर वेधशाला मिशन कौन-सा है?" },
    options: [
      { en: "Gaganyaan", ta: "ககன்யான்", hi: "गगनयान" },
      { en: "Mangalyaan", ta: "மங்கள்யான்", hi: "मंगलयान" },
      { en: "Aditya-L1", ta: "ஆதித்யா-L1", hi: "आदित्य-एल1" },
      { en: "Astrosat", ta: "ஆஸ்ட்ரோசாட்", hi: "एस्ट्रोसैट" },
    ],
    answer: 2,
    explain: {
      en: "Aditya-L1 was launched by ISRO in Sept 2023 to continuously observe solar flares and corona from L1 orbit.",
      ta: "இஸ்ரோவால் ஏவப்பட்ட ஆதித்யா-L1 விண்கலம் சூரியனின் புறவளிமண்டலம் மற்றும் கொரோனா நிகழ்வுகளை ஆய்வு செய்கிறது.",
      hi: "आदित्य-एल1 सूर्य के कोरोना और सौर वायु का अध्ययन करने के लिए एल1 बिंदु पर स्थापित किया गया है।"
    },
  },
  {
    id: "s-supremecourt",
    q: { en: "Which institution is the ultimate guardian and final interpreter of the Indian Constitution?", ta: "இந்திய அரசியலமைப்பின் இறுதிப் பாதுகாவலராகவும் விளக்கமளிக்கும் உச்ச அமைப்பாகவும் இருப்பது எது?", hi: "भारतीय संविधान का अंतिम संरक्षक और व्याख्याकार कौन-सा निकाय है?" },
    options: [
      { en: "Parliament of India", ta: "இந்திய நாடாளுமன்றம்", hi: "भारतीय संसद" },
      { en: "Supreme Court of India", ta: "இந்திய உச்ச நீதிமன்றம்", hi: "भारत का सर्वोच्च न्यायालय" },
      { en: "President of India", ta: "இந்தியக் குடியரசுத் தலைவர்", hi: "भारत के राष्ट्रपति" },
      { en: "Law Commission", ta: "சட்ட ஆணையம்", hi: "विधि आयोग" },
    ],
    answer: 1,
    explain: {
      en: "The Supreme Court of India is the highest judicial forum and guardian of fundamental rights.",
      ta: "இந்திய உச்ச நீதிமன்றமே அடிப்படை உரிமைகளின் காவலனும் அரசியலமைப்பின் உச்சபட்ச நடுவருமாகும்.",
      hi: "भारत का सर्वोच्च न्यायालय संविधान का संरक्षक और मौलिक अधिकारों का रक्षक है।"
    },
  },
  {
    id: "s-swaminathan",
    q: { en: "Which eminent agricultural scientist from Tamil Nadu is revered as the Father of India's Green Revolution?", ta: "இந்தியப் பசுமைப் புரட்சியின் தந்தை என்று போற்றப்படும் தமிழ்நாட்டைச் சேர்ந்த வேளாண் விஞ்ஞானி யார்?", hi: "भारत में 'हरित क्रांति के जनक' के रूप में जाने जाने वाले कृषि वैज्ञानिक कौन हैं?" },
    options: [
      { en: "Dr Verghese Kurien", ta: "டாக்டர் வர்கீஸ் குரியன்", hi: "डॉ. वर्गीज कुरियन" },
      { en: "Dr M. S. Swaminathan", ta: "டாக்டர் எம். எஸ். சுவாமிநாதன்", hi: "डॉ. एम. एस. स्वामीनाथन" },
      { en: "Dr Salim Ali", ta: "டாக்டர் சலீம் அலி", hi: "डॉ. सलीम अली" },
      { en: "Dr Birbal Sahni", ta: "டாக்டர் பீர்பால் சஹானி", hi: "डॉ. बीरबल साहनी" },
    ],
    answer: 1,
    explain: {
      en: "Dr M. S. Swaminathan led the Green Revolution introduced high-yielding wheat and rice varieties ensuring food security.",
      ta: "டாக்டர் எம். எஸ். சுவாமிநாதன் அதிக விளைச்சல் தரும் பயிர் வகைகளை அறிமுகப்படுத்தி நாட்டின் உணவுப் பஞ்சத்தைப் போக்கினார்.",
      hi: "डॉ. एम. एस. स्वामीनाथन ने उच्च उपज वाले बीजों की शुरुआत कर देश को खाद्यान्न में आत्मनिर्भर बनाया।"
    },
  },
  {
    id: "s-panchayat",
    q: { en: "Which landmark Constitutional Amendment Act in 1992 constitutionalized Panchayati Raj Institutions in India?", ta: "இந்தியாவில் பஞ்சாயத்து ராஜ் ஊரக உள்ளாட்சி அமைப்புகளுக்கு அரசியலமைப்பு அங்கீகாரம் வழங்கிய 1992-ஆம் ஆண்டின் சட்டத்திருத்தம் எது?", hi: "1992 के किस ऐतिहासिक संविधान संशोधन ने पंचायती राज संस्थाओं को संवैधानिक दर्जा दिया?" },
    options: [
      { en: "42nd Amendment Act", ta: "42-வது சட்டத்திருத்தம்", hi: "42वां संशोधन अधिनियम" },
      { en: "44th Amendment Act", ta: "44-வது சட்டத்திருத்தம்", hi: "44वां संशोधन अधिनियम" },
      { en: "73rd Amendment Act", ta: "73-வது சட்டத்திருத்தம்", hi: "73वां संशोधन अधिनियम" },
      { en: "86th Amendment Act", ta: "86-வது சட்டத்திருத்தம்", hi: "86वां संशोधन अधिनियम" },
    ],
    answer: 2,
    explain: {
      en: "The 73rd Amendment Act, 1992 added Part IX and the 11th Schedule establishing local self-government in rural areas.",
      ta: "73-வது சட்டத்திருத்தம் (1992) கிராமப்புற உள்ளாட்சிக்கு அரசியலமைப்பு அங்கீகாரம் அளித்து 3 அடுக்கு பஞ்சாயத்து முறையை உருவாக்கியது.",
      hi: "73वें संविधान संशोधन अधिनियम (1992) ने पंचायती राज व्यवस्था को संवैधानिक दर्जा प्रदान किया।"
    },
  },
  {
    id: "s-gdp",
    q: { en: "Which sector of the economy currently contributes the largest share to India's GDP?", ta: "இந்தியாவின் மொத்த உள்நாட்டு உற்பத்தியில் (GDP) தற்போது மிகப்பெரிய பங்களிப்பை வழங்கும் துறை எது?", hi: "वर्तमान में भारत के सकल घरेलू उत्पाद (GDP) में सबसे बड़ा योगदान किस क्षेत्र का है?" },
    options: [
      { en: "Agriculture sector", ta: "வேளாண்மைத் துறை", hi: "कृषि क्षेत्र" },
      { en: "Services sector", ta: "சேவைகள் துறை", hi: "सेवा क्षेत्र" },
      { en: "Manufacturing sector", ta: "உற்பத்தித் துறை", hi: "विनिर्माण क्षेत्र" },
      { en: "Mining sector", ta: "சுரங்கத் துறை", hi: "खनन क्षेत्र" },
    ],
    answer: 1,
    explain: {
      en: "The Services sector (IT, finance, transport, healthcare, education) contributes over 53% of India's GDP.",
      ta: "தகவல் தொழில்நுட்பம், நிதி, போக்குவரத்து உள்ளிட்ட சேவைகள் துறை இந்திய ஜிடிபியில் 53%க்கும் அதிகமான பங்கை வழங்குகிறது.",
      hi: "सेवा क्षेत्र भारतीय जीडीपी में 53% से अधिक का योगदान देता है।"
    },
  },
  {
    id: "s-raman",
    q: { en: "Who was the first Indian and Asian to win the Nobel Prize in Physics for his work on the scattering of light?", ta: "ஒளிச்சிதறல் குறித்த புகழ்பெற்ற கண்டுபிடிப்புக்காக இயற்பியலில் நோபல் பரிசு பெற்ற முதல் இந்தியரும் ஆசியருமான விஞ்ஞானி யார்?", hi: "प्रकाश के प्रकीर्णन पर खोज के लिए भौतिकी में नोबेल पुरस्कार पाने वाले पहले भारतीय और एशियाई कौन थे?" },
    options: [
      { en: "Satyendra Nath Bose", ta: "சத்யேந்திர நாத் போஸ்", hi: "सत्येंद्र नाथ बोस" },
      { en: "Sir C. V. Raman", ta: "சர் சி. வி. இராமன்", hi: "सर सी. वी. रमन" },
      { en: "Subrahmanyan Chandrasekhar", ta: "சுப்பிரமணியன் சந்திரசேகர்", hi: "सुब्रह्मण्यन चंद्रशेखर" },
      { en: "Jagadish Chandra Bose", ta: "ஜெகதீஷ் சந்திர போஸ்", hi: "जगदीश चंद्र बोस" },
    ],
    answer: 1,
    explain: {
      en: "Sir C. V. Raman discovered the Raman Effect on 28 Feb 1928 (celebrated as National Science Day) and won the Nobel Prize in 1930.",
      ta: "சர் சி. வி. இராமன் 1928 பிப்ரவரி 28 அன்று 'இராமன் விளைவைக்' கண்டுபிடித்தார்; 1930-இல் இயற்பியல் நோபல் பரிசை வென்றார்.",
      hi: "सर सी. वी. रमन ने 'रमन प्रभाव' की खोज के लिए 1930 में भौतिकी का नोबेल पुरस्कार जीता।"
    },
  },
];

/**
 * Bharat Ko Jano GK questions organized across 3 levels:
 * - Primary Level: Foundational national symbols, state facts, nature
 * - Intermediate Level: Freedom movement, geography, history, monuments, science
 * - Advanced Level: Indian constitution, space missions, economy, Nobel laureates
 *
 * Indexed by both GkLevel ('primary' | 'intermediate' | 'advanced') and Band ('junior' | 'middle' | 'senior').
 */
export const QUIZ: Record<GkLevel | Band, readonly Question[]> = {
  primary: PRIMARY_QUIZ,
  intermediate: INTERMEDIATE_QUIZ,
  advanced: ADVANCED_QUIZ,
  junior: PRIMARY_QUIZ,
  middle: INTERMEDIATE_QUIZ,
  senior: ADVANCED_QUIZ,
};

/** Seconds per question per level; untimed for primary, 45s for intermediate, 30s for advanced. */
export const QUESTION_SECONDS: Record<GkLevel | Band, number | null> = {
  primary: null,
  intermediate: 45,
  advanced: 30,
  junior: null,
  middle: 45,
  senior: 30,
};

export type Song = {
  readonly id: string;
  readonly kind: LocalizedText;
  readonly title: LocalizedText;
  readonly credit: LocalizedText;
  readonly lang: Locale;
  readonly lines: readonly string[];
  readonly meaning: LocalizedText;
  readonly fact: LocalizedText;
};

export const SONGS: readonly Song[] = [
  {
    id: "jana-gana-mana",
    kind: { en: "National anthem", ta: "நாட்டுப்பண்", hi: "राष्ट्रगान" },
    title: { en: "Jana Gana Mana", ta: "ஜன கண மன", hi: "जन गण मन" },
    credit: { en: "Rabindranath Tagore", ta: "இரவீந்திரநாத் தாகூர்", hi: "रवींद्रनाथ टैगोर" },
    lang: "hi",
    lines: [
      "जन गण मन अधिनायक जय हे",
      "भारत भाग्य विधाता",
      "पंजाब सिंधु गुजरात मराठा",
      "द्राविड़ उत्कल बंग",
      "विंध्य हिमाचल यमुना गंगा",
      "उच्छल जलधि तरंग",
      "तव शुभ नामे जागे",
      "तव शुभ आशिष मागे",
      "गाहे तव जय गाथा",
      "जन गण मंगल दायक जय हे",
      "भारत भाग्य विधाता",
      "जय हे, जय हे, जय हे",
      "जय जय जय जय हे",
    ],
    meaning: {
      en: "It hails the one who guides India's destiny, and names her regions, mountains and rivers, all of which wake to that name and sing of victory.",
      ta: "இந்தியாவின் விதியை வழிநடத்துபவரைப் போற்றுகிறது; நாட்டின் பகுதிகள், மலைகள், ஆறுகள் அனைத்தும் அந்தப் பெயரைக் கேட்டு எழுந்து வெற்றியைப் பாடுகின்றன.",
      hi: "यह भारत के भाग्य विधाता की जय गाता है, और देश के प्रदेशों, पर्वतों और नदियों का नाम लेता है, जो उस शुभ नाम से जागकर जय गाथा गाते हैं।",
    },
    fact: {
      en: "The full anthem takes about 52 seconds. Stand still and respectful while it is sung.",
      ta: "முழு நாட்டுப்பண்ணைப் பாட சுமார் 52 வினாடிகள் ஆகும். பாடும்போது அசையாமல் மரியாதையுடன் நில்.",
      hi: "पूरा राष्ट्रगान गाने में लगभग 52 सेकंड लगते हैं। गाते समय सावधान और सम्मान से खड़े रहें।",
    },
  },
  {
    id: "vande-mataram",
    kind: { en: "National song", ta: "தேசியப் பாடல்", hi: "राष्ट्रगीत" },
    title: { en: "Vande Mataram", ta: "வந்தே மாதரம்", hi: "वन्दे मातरम्" },
    credit: { en: "Bankim Chandra Chatterjee", ta: "பங்கிம் சந்திர சட்டர்ஜி", hi: "बंकिम चंद्र चट्टोपाध्याय" },
    lang: "hi",
    lines: ["वन्दे मातरम्", "सुजलां सुफलां मलयजशीतलाम्", "शस्यश्यामलां मातरम्", "वन्दे मातरम्"],
    meaning: {
      en: "'I bow to you, Mother' — a land rich in water and fruit, cooled by southern breezes and green with crops.",
      ta: "'தாயே, உன்னை வணங்குகிறேன்' — நீர் வளமும் கனி வளமும் நிறைந்த, தென்றலால் குளிர்ந்த, பயிர்களால் பசுமையான நாடு.",
      hi: "'हे माँ, मैं तुम्हें नमन करता हूँ' — जल और फलों से भरपूर, मलय पवन से शीतल, फ़सलों से हरी-भरी धरती।",
    },
    fact: {
      en: "It first appeared in Bankim Chandra Chatterjee's novel Anandamath (1882).",
      ta: "இது பங்கிம் சந்திர சட்டர்ஜியின் 'ஆனந்தமடம்' (1882) நாவலில் முதலில் இடம்பெற்றது.",
      hi: "यह पहली बार बंकिम चंद्र चट्टोपाध्याय के उपन्यास 'आनंदमठ' (1882) में छपा था।",
    },
  },
  {
    id: "senthamizh-naadu",
    kind: { en: "Patriotic song", ta: "தேசபக்திப் பாடல்", hi: "देशभक्ति गीत" },
    title: { en: "Senthamizh Naadu", ta: "செந்தமிழ் நாடு", hi: "सेंतमिल नाडु" },
    credit: { en: "Mahakavi Bharathiyar", ta: "மகாகவி பாரதியார்", hi: "महाकवि भारतियार" },
    lang: "ta",
    lines: [
      "செந்தமிழ் நாடெனும் போதினிலே – இன்பத்",
      "தேன் வந்து பாயுது காதினிலே – எங்கள்",
      "தந்தையர் நாடென்ற பேச்சினிலே – ஒரு",
      "சக்தி பிறக்குது மூச்சினிலே",
    ],
    meaning: {
      en: "When we hear the words 'Tamil Nadu', sweet honey flows into our ears; when we speak of the land of our forefathers, a new strength is born in our breath.",
      ta: "'செந்தமிழ் நாடு' என்று கேட்கும்போதே காதில் இன்பத் தேன் பாய்கிறது; 'எங்கள் தந்தையர் நாடு' என்று பேசும்போதே மூச்சில் புதிய சக்தி பிறக்கிறது.",
      hi: "'सेंतमिल नाडु' (सुंदर तमिल धरती) सुनते ही कानों में मीठा शहद बहने लगता है; पूर्वजों की धरती की बात करते ही साँसों में नई शक्ति जन्म लेती है।",
    },
    fact: {
      en: "Bharathiyar's patriotic songs inspired people during India's freedom struggle.",
      ta: "பாரதியாரின் தேசபக்திப் பாடல்கள் விடுதலைப் போராட்டத்தில் மக்களுக்கு ஊக்கம் அளித்தன.",
      hi: "भारतियार के देशभक्ति गीतों ने स्वतंत्रता संग्राम में लोगों को प्रेरित किया।",
    },
  },
];

type GkCopy = {
  readonly tabs: { readonly quiz: string; readonly songs: string };
  readonly startQuiz: string;
  readonly best: string;
  readonly questions: (n: number) => string;
  readonly questionOf: (n: number, total: number) => string;
  readonly correct: string;
  readonly wrong: string;
  readonly timeUp: string;
  readonly perQuestion: (s: number) => string;
  readonly next: string;
  readonly finish: string;
  readonly result: (n: number, total: number) => string;
  readonly cheer: readonly [string, string, string, string];
  readonly again: string;
  readonly review: string;
  readonly singAlong: string;
  readonly stop: string;
  readonly meaning: string;
  readonly fact: string;
  readonly sung: string;
  readonly silent: string;
  readonly bandHint: Record<Band, string>;
  readonly levelLabel: string;
  readonly levelTitle: string;
  readonly levelSubtitle: string;
  readonly untimed: string;
  readonly tryNextLevel: string;
  readonly switchLevel: string;
};

export const GK_COPY: Record<Locale, GkCopy> = {
  en: {
    tabs: { quiz: "Quiz", songs: "Songs" },
    startQuiz: "Start quiz",
    best: "Best score",
    questions: (n) => `${n} questions`,
    questionOf: (n, t) => `Question ${n} of ${t}`,
    correct: "Correct!",
    wrong: "Not quite",
    timeUp: "Time's up!",
    perQuestion: (s) => `${s}s per question`,
    next: "Next",
    finish: "See result",
    result: (n, t) => `You got ${n} of ${t}`,
    cheer: ["Keep going — every try teaches you!", "Good try — play again to beat it!", "Great job!", "Superstar!"],
    again: "Play again",
    review: "Review answers",
    singAlong: "Sing along",
    stop: "Stop",
    meaning: "Meaning",
    fact: "Did you know?",
    sung: "Sung",
    silent: "No voice for this language on this device — follow the glowing words!",
    bandHint: {
      junior: "Answer the questions and collect stars! Then sing along with me.",
      middle: "Test your India GK, then sing along with the words.",
      senior: "Timed revision: 30 seconds a question. Explanations after each answer.",
    },
    levelLabel: "Level",
    levelTitle: "Choose Your Quiz Level",
    levelSubtitle: "Split into 3 progressive tiers: Primary, Intermediate, and Advanced. Practice any level anytime!",
    untimed: "Untimed · Learn at your pace",
    tryNextLevel: "Try Next Level →",
    switchLevel: "Change Level",
  },
  ta: {
    tabs: { quiz: "வினாடி வினா", songs: "பாடல்கள்" },
    startQuiz: "வினாடி வினாவைத் தொடங்கு",
    best: "சிறந்த மதிப்பெண்",
    questions: (n) => `${n} கேள்விகள்`,
    questionOf: (n, t) => `கேள்வி ${n} / ${t}`,
    correct: "சரி!",
    wrong: "சரியில்லை",
    timeUp: "நேரம் முடிந்தது!",
    perQuestion: (s) => `ஒரு கேள்விக்கு ${s} வினாடி`,
    next: "அடுத்தது",
    finish: "முடிவைப் பார்",
    result: (n, t) => `${t}-இல் ${n} சரி`,
    cheer: [
      "தொடர்ந்து முயல் — ஒவ்வொரு முயற்சியும் கற்றுத்தரும்!",
      "நல்ல முயற்சி — மீண்டும் விளையாடி வெல்!",
      "அருமை!",
      "சூப்பர் ஸ்டார்!",
    ],
    again: "மீண்டும் விளையாடு",
    review: "விடைகளைப் பார்",
    singAlong: "சேர்ந்து பாடு",
    stop: "நிறுத்து",
    meaning: "பொருள்",
    fact: "உனக்குத் தெரியுமா?",
    sung: "பாடினாய்",
    silent: "இந்தச் சாதனத்தில் இந்த மொழிக்குக் குரல் இல்லை — ஒளிரும் சொற்களைப் பின்தொடர்!",
    bandHint: {
      junior: "கேள்விகளுக்குப் பதில் சொல்லி நட்சத்திரங்களைச் சேகரி! பிறகு என்னுடன் சேர்ந்து பாடு.",
      middle: "உன் இந்தியப் பொது அறிவைச் சோதி, பிறகு வரிகளுடன் சேர்ந்து பாடு.",
      senior: "நேர மீள்பார்வை: ஒரு கேள்விக்கு 30 வினாடி. ஒவ்வொரு பதிலுக்குப் பின் விளக்கம்.",
    },
    levelLabel: "நிலை",
    levelTitle: "வினாடி வினா நிலையைத் தேர்ந்தெடு",
    levelSubtitle: "ஆரம்ப நிலை, இடைநிலை, மற்றும் மேல்நிலை என மூன்று பிரிவுகள். எந்நேரமும் பயிற்சி செய்!",
    untimed: "நேர வரம்பற்றது · நிதானமாகக் கற்போம்",
    tryNextLevel: "அடுத்த நிலையை முயல் →",
    switchLevel: "நிலையை மாற்று",
  },
  hi: {
    tabs: { quiz: "प्रश्नोत्तरी", songs: "गीत" },
    startQuiz: "प्रश्नोत्तरी शुरू करो",
    best: "सर्वश्रेष्ठ स्कोर",
    questions: (n) => `${n} प्रश्न`,
    questionOf: (n, t) => `प्रश्न ${n} / ${t}`,
    correct: "सही!",
    wrong: "सही नहीं",
    timeUp: "समय समाप्त!",
    perQuestion: (s) => `हर प्रश्न के लिए ${s} सेकंड`,
    next: "अगला",
    finish: "परिणाम देखो",
    result: (n, t) => `${t} में से ${n} सही`,
    cheer: ["लगे रहो — हर कोशिश कुछ सिखाती है!", "अच्छी कोशिश — फिर खेलो और बेहतर करो!", "बहुत बढ़िया!", "सुपरस्टार!"],
    again: "फिर से खेलो",
    review: "उत्तर देखो",
    singAlong: "साथ गाओ",
    stop: "रोको",
    meaning: "अर्थ",
    fact: "क्या तुम जानते हो?",
    sung: "गा लिया",
    silent: "इस डिवाइस पर इस भाषा की आवाज़ नहीं है — चमकते शब्दों के साथ चलो!",
    bandHint: {
      junior: "प्रश्नों के उत्तर दो और सितारे जीतो! फिर मेरे साथ गाओ।",
      middle: "अपना भारत ज्ञान परखो, फिर शब्दों के साथ गाओ।",
      senior: "समयबद्ध दोहराई: हर प्रश्न के लिए 30 सेकंड। हर उत्तर के बाद व्याख्या।",
    },
    levelLabel: "स्तर",
    levelTitle: "प्रश्नोत्तरी स्तर चुनें",
    levelSubtitle: "तीन स्तरों में विभाजित: प्राथमिक, मध्यम और उन्नत। कभी भी किसी भी स्तर का अभ्यास करें!",
    untimed: "बिना समय सीमा · अपनी गति से सीखें",
    tryNextLevel: "अगला स्तर आज़माएँ →",
    switchLevel: "स्तर बदलें",
  },
};
