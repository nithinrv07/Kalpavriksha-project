import type { Locale, LocalizedText } from "@/lib/i18n";
import type { Band } from "@/lib/progress";

export const CATEGORIES = ["kural", "aathichudi", "bharathiyar", "science"] as const;
export type CategoryId = (typeof CATEGORIES)[number];

export const CATEGORY_INFO: Record<CategoryId, { readonly name: LocalizedText; readonly accent: string }> = {
  kural: { name: { en: "Thirukkural", ta: "திருக்குறள்", hi: "तिरुक्कुरल" }, accent: "var(--violet)" },
  aathichudi: { name: { en: "Aathichudi", ta: "ஆத்திசூடி", hi: "आत्तिचूडी" }, accent: "var(--pink)" },
  bharathiyar: { name: { en: "Bharathiyar", ta: "பாரதியார்", hi: "भारतियार" }, accent: "var(--amber)" },
  science: { name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" }, accent: "var(--teal)" },
};

/** Original-language text (read as written) or the same lesson written in every locale. */
type LessonText = { readonly lang: Locale; readonly lines: readonly string[] } | Readonly<Record<Locale, readonly string[]>>;

export type Lesson = {
  readonly id: string;
  readonly category: CategoryId;
  readonly bands: readonly Band[];
  readonly minutes: number;
  readonly title: LocalizedText;
  readonly credit?: LocalizedText;
  readonly text: LessonText;
  readonly noteKind: "meaning" | "try" | "tip";
  readonly note: LocalizedText;
};

export function lessonText(lesson: Lesson, locale: Locale): { lang: Locale; lines: readonly string[] } {
  const text = lesson.text;
  return "lang" in text ? { lang: text.lang as Locale, lines: text.lines as readonly string[] } : { lang: locale, lines: text[locale] };
}

const VALLUVAR = { en: "Thiruvalluvar", ta: "திருவள்ளுவர்", hi: "तिरुवल्लुवर" } as const;
const AVVAIYAR = { en: "Avvaiyar", ta: "ஔவையார்", hi: "औवैयार" } as const;
const BHARATHI = { en: "Mahakavi Bharathiyar", ta: "மகாகவி பாரதியார்", hi: "महाकवि भारतियार" } as const;

export const LESSONS: readonly Lesson[] = [
  {
    id: "kural-1",
    category: "kural",
    bands: ["junior", "middle"],
    minutes: 2,
    title: { en: "Kural 1 — A comes first", ta: "குறள் 1 — அகர முதல", hi: "कुरल 1 — 'अ' सबसे पहले" },
    credit: VALLUVAR,
    text: { lang: "ta", lines: ["அகர முதல எழுத்தெல்லாம் ஆதி", "பகவன் முதற்றே உலகு."] },
    noteKind: "meaning",
    note: {
      en: "Just as the letter A comes first among all letters, the world begins with the Creator.",
      ta: "எழுத்துகள் எல்லாம் 'அ' என்ற எழுத்தை முதலாகக் கொண்டுள்ளன; அதுபோல உலகம் இறைவனை முதலாகக் கொண்டுள்ளது.",
      hi: "जैसे सभी अक्षरों में 'अ' पहला है, वैसे ही संसार का आदि ईश्वर है।",
    },
  },
  {
    id: "kural-391",
    category: "kural",
    bands: ["middle", "senior"],
    minutes: 2,
    title: { en: "Kural 391 — Learn well", ta: "குறள் 391 — கற்க கசடற", hi: "कुरल 391 — अच्छी तरह सीखो" },
    credit: VALLUVAR,
    text: { lang: "ta", lines: ["கற்க கசடறக் கற்பவை கற்றபின்", "நிற்க அதற்குத் தக."] },
    noteKind: "meaning",
    note: {
      en: "Learn what is worth learning, thoroughly and without flaw; then live by what you have learnt.",
      ta: "கற்க வேண்டியவற்றைக் குற்றமில்லாமல் கற்க வேண்டும்; கற்ற பின் அதன்படி நடக்க வேண்டும்.",
      hi: "जो सीखने योग्य है उसे पूरी तरह, बिना दोष के सीखो; फिर उसी के अनुसार जीवन जियो।",
    },
  },
  {
    id: "kural-400",
    category: "kural",
    bands: ["senior"],
    minutes: 2,
    title: { en: "Kural 400 — Wealth that never fades", ta: "குறள் 400 — அழியாச் செல்வம்", hi: "कुरल 400 — कभी न घटने वाला धन" },
    credit: VALLUVAR,
    text: { lang: "ta", lines: ["கேடில் விழுச்செல்வம் கல்வி ஒருவற்கு", "மாடல்ல மற்றை யவை."] },
    noteKind: "meaning",
    note: {
      en: "Learning is the true wealth that never decays; all other riches are not real wealth.",
      ta: "ஒருவனுக்கு அழியாத சிறந்த செல்வம் கல்வியே; மற்றவை எல்லாம் செல்வம் ஆகாது.",
      hi: "विद्या ही वह सच्चा धन है जो कभी नष्ट नहीं होता; बाकी सब असली धन नहीं।",
    },
  },
  {
    id: "aathichudi-1",
    category: "aathichudi",
    bands: ["junior"],
    minutes: 3,
    title: { en: "Aathichudi — Part 1", ta: "ஆத்திசூடி — பகுதி 1", hi: "आत्तिचूडी — भाग 1" },
    credit: AVVAIYAR,
    text: {
      lang: "ta",
      lines: ["அறம் செய விரும்பு", "ஆறுவது சினம்", "இயல்வது கரவேல்", "ஈவது விலக்கேல்", "உடையது விளம்பேல்", "ஊக்கமது கைவிடேல்"],
    },
    noteKind: "meaning",
    note: {
      en: "Love to do good. Let anger cool down. Don't hide the help you can give. Don't stop others from giving. Don't boast about what you own. Never give up your enthusiasm.",
      ta: "நல்லது செய்ய விரும்பு. கோபத்தைத் தணித்துக்கொள். உன்னால் முடிந்த உதவியை மறைக்காதே. பிறர் கொடுப்பதைத் தடுக்காதே. உன்னிடம் உள்ளதைப் பெருமையாகப் பேசாதே. ஊக்கத்தைக் கைவிடாதே.",
      hi: "भलाई करना पसंद करो। क्रोध को शांत करो। जो मदद कर सकते हो उसे मत छिपाओ। दूसरों को देने से मत रोको। अपनी चीज़ों का घमंड मत करो। उत्साह कभी मत छोड़ो।",
    },
  },
  {
    id: "aathichudi-2",
    category: "aathichudi",
    bands: ["middle"],
    minutes: 3,
    title: { en: "Aathichudi — Part 2", ta: "ஆத்திசூடி — பகுதி 2", hi: "आत्तिचूडी — भाग 2" },
    credit: AVVAIYAR,
    text: {
      lang: "ta",
      lines: [
        "எண் எழுத்து இகழேல்",
        "ஏற்பது இகழ்ச்சி",
        "ஐயம் இட்டு உண்",
        "ஒப்புரவு ஒழுகு",
        "ஓதுவது ஒழியேல்",
        "ஔவியம் பேசேல்",
        "அஃகம் சுருக்கேல்",
      ],
    },
    noteKind: "meaning",
    note: {
      en: "Never look down on numbers and letters. Begging is shameful. Share with those in need before you eat. Live in harmony with others. Never stop learning. Don't speak with envy. Don't cheat on measures of grain.",
      ta: "எண்ணையும் எழுத்தையும் இகழாதே. பிச்சை ஏற்பது இழிவு. இல்லாதவர்க்குக் கொடுத்துவிட்டு உண். உலகத்தோடு ஒத்து வாழ். கற்பதை நிறுத்தாதே. பொறாமைச் சொற்களைப் பேசாதே. தானிய அளவைக் குறைக்காதே.",
      hi: "अंकों और अक्षरों का अनादर मत करो। माँगना लज्जा की बात है। ज़रूरतमंद को देकर फिर खाओ। सबके साथ मेल से रहो। पढ़ना कभी मत छोड़ो। ईर्ष्या भरी बातें मत करो। अनाज की तौल में कमी मत करो।",
    },
  },
  {
    id: "bharathiyar-odi",
    category: "bharathiyar",
    bands: ["junior", "middle"],
    minutes: 2,
    title: {
      en: "Run and play, little one",
      ta: "ஓடி விளையாடு பாப்பா",
      hi: "दौड़ो, खेलो, नन्हे",
    },
    credit: BHARATHI,
    text: {
      lang: "ta",
      lines: ["ஓடி விளையாடு பாப்பா – நீ", "ஓய்ந்திருக்க லாகாது பாப்பா", "கூடி விளையாடு பாப்பா – ஒரு", "குழந்தையை வையாதே பாப்பா"],
    },
    noteKind: "meaning",
    note: {
      en: "Run and play, little one — don't sit idle. Play together with friends, and never scold another child.",
      ta: "ஓடி விளையாடு, சோம்பி இருக்காதே. நண்பர்களோடு கூடி விளையாடு; எந்தக் குழந்தையையும் திட்டாதே.",
      hi: "दौड़ो और खेलो, नन्हे — आलसी मत बैठो। मिल-जुलकर खेलो और किसी बच्चे को डाँटो मत।",
    },
  },
  {
    id: "water-cycle",
    category: "science",
    bands: ["junior"],
    minutes: 3,
    title: { en: "The water cycle", ta: "நீர்ச் சுழற்சி", hi: "जल चक्र" },
    text: {
      en: [
        "The sun warms the water in seas and lakes.",
        "Water turns into vapour and rises up — that is evaporation.",
        "High in the sky, the vapour cools and forms clouds.",
        "When clouds get heavy, water falls as rain.",
        "Rain flows back to rivers and seas, and the cycle begins again.",
      ],
      ta: [
        "சூரியன் கடல், ஏரி நீரைச் சூடாக்குகிறது.",
        "நீர் ஆவியாகி மேலே எழுகிறது — இதுவே ஆவியாதல்.",
        "வானில் உயரே ஆவி குளிர்ந்து மேகமாகிறது.",
        "மேகம் கனமானதும் நீர் மழையாகப் பெய்கிறது.",
        "மழைநீர் ஆறுகளிலும் கடலிலும் சேர்ந்து, சுழற்சி மீண்டும் தொடங்குகிறது.",
      ],
      hi: [
        "सूरज समुद्र और झीलों के पानी को गर्म करता है।",
        "पानी भाप बनकर ऊपर उठता है — इसे वाष्पीकरण कहते हैं।",
        "आसमान में ऊपर भाप ठंडी होकर बादल बनाती है।",
        "बादल भारी होने पर पानी बारिश बनकर गिरता है।",
        "बारिश का पानी नदियों और समुद्र में लौटता है, और चक्र फिर शुरू होता है।",
      ],
    },
    noteKind: "try",
    note: {
      en: "Cover a bowl of warm water with a plate. After a few minutes, look for 'rain' drops under the plate!",
      ta: "வெதுவெதுப்பான நீருள்ள கிண்ணத்தை ஒரு தட்டால் மூடு. சில நிமிடம் கழித்து தட்டின் அடியில் 'மழைத்துளிகளை'ப் பார்!",
      hi: "गुनगुने पानी के कटोरे को प्लेट से ढको। कुछ मिनट बाद प्लेट के नीचे 'बारिश' की बूँदें देखो!",
    },
  },
  {
    id: "solar-system",
    category: "science",
    bands: ["junior", "middle"],
    minutes: 3,
    title: { en: "Meet the solar system", ta: "சூரியக் குடும்பம்", hi: "सौरमंडल से मिलो" },
    text: {
      en: [
        "Our Sun is a star at the centre of the solar system.",
        "Eight planets travel around it.",
        "Mercury is closest to the Sun; Neptune is the farthest.",
        "Earth is the third planet — the only one we know with life.",
        "Jupiter is the biggest planet of all.",
      ],
      ta: [
        "நம் சூரியன் சூரியக் குடும்பத்தின் மையத்தில் உள்ள ஒரு விண்மீன்.",
        "எட்டுக் கோள்கள் அதைச் சுற்றி வருகின்றன.",
        "புதன் சூரியனுக்கு மிக அருகில் உள்ளது; நெப்டியூன் மிகத் தொலைவில் உள்ளது.",
        "பூமி மூன்றாவது கோள் — உயிர்கள் வாழ்வதாக நமக்குத் தெரிந்த ஒரே கோள்.",
        "வியாழனே எல்லாக் கோள்களிலும் மிகப் பெரியது.",
      ],
      hi: [
        "हमारा सूर्य सौरमंडल के केंद्र में एक तारा है।",
        "आठ ग्रह इसके चारों ओर घूमते हैं।",
        "बुध सूर्य के सबसे पास है; नेपच्यून सबसे दूर।",
        "पृथ्वी तीसरा ग्रह है — अब तक ज्ञात एकमात्र ग्रह जहाँ जीवन है।",
        "बृहस्पति सबसे बड़ा ग्रह है।",
      ],
    },
    noteKind: "try",
    note: {
      en: "Say the planets in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
      ta: "கோள்களை வரிசையாகச் சொல்: புதன், வெள்ளி, பூமி, செவ்வாய், வியாழன், சனி, யுரேனஸ், நெப்டியூன்.",
      hi: "ग्रहों को क्रम से बोलो: बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, अरुण (यूरेनस), वरुण (नेपच्यून)।",
    },
  },
  {
    id: "photosynthesis",
    category: "science",
    bands: ["middle"],
    minutes: 3,
    title: { en: "How plants make food", ta: "தாவரங்கள் உணவு தயாரிக்கும் விதம்", hi: "पौधे भोजन कैसे बनाते हैं" },
    text: {
      en: [
        "Plants make their own food.",
        "Leaves take in sunlight, water and carbon dioxide from the air.",
        "The green pigment, chlorophyll, catches the sunlight.",
        "Plants turn these into sugar for food and give out oxygen.",
        "So every leaf is a tiny kitchen that helps us breathe!",
      ],
      ta: [
        "தாவரங்கள் தங்கள் உணவைத் தாமே தயாரிக்கின்றன.",
        "இலைகள் சூரிய ஒளி, நீர், காற்றிலுள்ள கார்பன் டை ஆக்சைடு ஆகியவற்றைப் பெறுகின்றன.",
        "பச்சையம் எனும் பச்சை நிறமி சூரிய ஒளியைப் பிடிக்கிறது.",
        "இவற்றைக் கொண்டு தாவரங்கள் சர்க்கரை உணவைத் தயாரித்து, ஆக்சிஜனை வெளியிடுகின்றன.",
        "ஒவ்வொரு இலையும் நாம் சுவாசிக்க உதவும் சிறிய சமையலறை!",
      ],
      hi: [
        "पौधे अपना भोजन खुद बनाते हैं।",
        "पत्तियाँ धूप, पानी और हवा से कार्बन डाइऑक्साइड लेती हैं।",
        "हरा वर्णक, क्लोरोफ़िल, धूप को पकड़ता है।",
        "इनसे पौधे भोजन के लिए शर्करा बनाते हैं और ऑक्सीजन छोड़ते हैं।",
        "हर पत्ती एक छोटी रसोई है जो हमें साँस लेने में मदद करती है!",
      ],
    },
    noteKind: "try",
    note: {
      en: "Keep one plant in sunlight and one in a dark cupboard for a week. Which one stays greener?",
      ta: "ஒரு செடியை வெயிலிலும், ஒன்றை இருட்டான அலமாரியிலும் ஒரு வாரம் வை. எது பச்சையாக இருக்கிறது?",
      hi: "एक पौधे को धूप में और एक को अँधेरी अलमारी में एक हफ़्ता रखो। कौन ज़्यादा हरा रहता है?",
    },
  },
  {
    id: "newton-laws",
    category: "science",
    bands: ["senior"],
    minutes: 4,
    title: { en: "Newton's three laws of motion", ta: "நியூட்டனின் மூன்று இயக்க விதிகள்", hi: "न्यूटन के गति के तीन नियम" },
    text: {
      en: [
        "First law: an object stays at rest or keeps moving in a straight line unless a force acts on it — this is inertia.",
        "Second law: force equals mass times acceleration, F = m × a.",
        "Third law: for every action there is an equal and opposite reaction.",
        "A rocket rises because the hot gases it pushes down push the rocket up.",
      ],
      ta: [
        "முதல் விதி: விசை செயல்படாத வரை, ஒரு பொருள் ஓய்வில் இருக்கும் அல்லது நேர்கோட்டில் சீராக இயங்கும் — இதுவே நிலைமம்.",
        "இரண்டாம் விதி: விசை = நிறை × முடுக்கம், F = m × a.",
        "மூன்றாம் விதி: ஒவ்வொரு வினைக்கும் சமமான, எதிரான எதிர்வினை உண்டு.",
        "ராக்கெட் கீழ்நோக்கித் தள்ளும் சூடான வாயுக்கள் அதை மேலே தள்ளுவதால் அது உயர்கிறது.",
      ],
      hi: [
        "पहला नियम: जब तक कोई बल न लगे, वस्तु विराम में रहती है या सीधी रेखा में चलती रहती है — यही जड़त्व है।",
        "दूसरा नियम: बल = द्रव्यमान × त्वरण, F = m × a।",
        "तीसरा नियम: हर क्रिया की समान और विपरीत प्रतिक्रिया होती है।",
        "रॉकेट इसलिए उठता है क्योंकि वह जो गर्म गैसें नीचे धकेलता है, वे उसे ऊपर धकेलती हैं।",
      ],
    },
    noteKind: "tip",
    note: {
      en: "In numericals, write F = ma first, convert units to kg and m/s², then substitute.",
      ta: "கணக்குகளில் முதலில் F = ma என்று எழுது; அலகுகளை kg, m/s² ஆக மாற்றிப் பிறகு மதிப்புகளைப் பொருத்து.",
      hi: "संख्यात्मक प्रश्नों में पहले F = ma लिखो, इकाइयाँ kg और m/s² में बदलो, फिर मान रखो।",
    },
  },
  {
    id: "ohms-law",
    category: "science",
    bands: ["senior"],
    minutes: 3,
    title: { en: "Ohm's law", ta: "ஓமின் விதி", hi: "ओम का नियम" },
    text: {
      en: [
        "Ohm's law links voltage, current and resistance.",
        "V = I × R: voltage equals current times resistance.",
        "Voltage is measured in volts, current in amperes and resistance in ohms.",
        "Double the voltage across a fixed resistor and the current doubles too.",
      ],
      ta: [
        "ஓமின் விதி மின்னழுத்தம், மின்னோட்டம், மின்தடை ஆகியவற்றை இணைக்கிறது.",
        "V = I × R: மின்னழுத்தம் = மின்னோட்டம் × மின்தடை.",
        "மின்னழுத்தம் வோல்ட்டிலும், மின்னோட்டம் ஆம்பியரிலும், மின்தடை ஓமிலும் அளக்கப்படுகின்றன.",
        "நிலையான மின்தடையில் மின்னழுத்தத்தை இரட்டிப்பாக்கினால் மின்னோட்டமும் இரட்டிப்பாகும்.",
      ],
      hi: [
        "ओम का नियम विभवांतर, धारा और प्रतिरोध को जोड़ता है।",
        "V = I × R: विभवांतर = धारा × प्रतिरोध।",
        "विभवांतर वोल्ट में, धारा ऐम्पियर में और प्रतिरोध ओम में मापा जाता है।",
        "स्थिर प्रतिरोध पर विभवांतर दोगुना करो तो धारा भी दोगुनी हो जाती है।",
      ],
    },
    noteKind: "tip",
    note: {
      en: "Quick check: a 12 V battery across a 4 Ω resistor gives I = 12 ÷ 4 = 3 A.",
      ta: "சரிபார்: 4 Ω மின்தடையில் 12 V மின்கலம் இணைத்தால் I = 12 ÷ 4 = 3 A.",
      hi: "जाँचो: 4 Ω प्रतिरोध पर 12 V बैटरी से I = 12 ÷ 4 = 3 A।",
    },
  },
];

export function lessonsFor(band: Band): readonly Lesson[] {
  return LESSONS.filter((l) => l.bands.includes(band));
}

type LearnCopy = {
  readonly all: string;
  readonly learned: string;
  readonly listen: string;
  readonly stop: string;
  readonly slower: string;
  readonly markDone: string;
  readonly notes: Record<Lesson["noteKind"], string>;
  readonly minutes: string;
  readonly progress: (done: number, total: number) => string;
  readonly silent: string;
  readonly allDone: string;
  readonly bandHint: Record<Band, string>;
};

export const LEARN_COPY: Record<Locale, LearnCopy> = {
  en: {
    all: "All",
    learned: "Learned",
    listen: "Listen",
    stop: "Stop",
    slower: "Slow",
    markDone: "I learned this!",
    notes: { meaning: "Meaning", try: "Try it", tip: "Exam tip" },
    minutes: "min",
    progress: (d, t) => `${d} of ${t} learned`,
    silent: "No voice for this language on this device — follow the glowing words!",
    allDone: "You learned every lesson here. Amazing!",
    bandHint: {
      junior: "Tap a card, then press Listen. I'll read along with you!",
      middle: "Pick a topic, listen along and mark what you've learned.",
      senior: "Revision mode: short, exam-ready lessons with tips.",
    },
  },
  ta: {
    all: "அனைத்தும்",
    learned: "கற்றது",
    listen: "கேள்",
    stop: "நிறுத்து",
    slower: "மெதுவாக",
    markDone: "இதைக் கற்றேன்!",
    notes: { meaning: "பொருள்", try: "செய்து பார்", tip: "தேர்வுக் குறிப்பு" },
    minutes: "நிமி",
    progress: (d, t) => `${t}-இல் ${d} கற்றாய்`,
    silent: "இந்தச் சாதனத்தில் இந்த மொழிக்குக் குரல் இல்லை — ஒளிரும் சொற்களைப் பின்தொடர்!",
    allDone: "இங்குள்ள எல்லாப் பாடங்களையும் கற்றுவிட்டாய். அருமை!",
    bandHint: {
      junior: "ஒரு அட்டையைத் தட்டி, 'கேள்' அழுத்து. நான் உன்னுடன் படிப்பேன்!",
      middle: "ஒரு தலைப்பைத் தேர்ந்தெடுத்து, கேட்டுப் படி, கற்றதைக் குறி.",
      senior: "மீள்பார்வை முறை: தேர்வுக்கு ஏற்ற சிறு பாடங்கள், குறிப்புகளுடன்.",
    },
  },
  hi: {
    all: "सभी",
    learned: "सीख लिया",
    listen: "सुनो",
    stop: "रोको",
    slower: "धीमे",
    markDone: "मैंने सीख लिया!",
    notes: { meaning: "अर्थ", try: "करके देखो", tip: "परीक्षा टिप" },
    minutes: "मिनट",
    progress: (d, t) => `${t} में से ${d} सीखे`,
    silent: "इस डिवाइस पर इस भाषा की आवाज़ नहीं है — चमकते शब्दों के साथ चलो!",
    allDone: "तुमने यहाँ के सारे पाठ सीख लिए। शानदार!",
    bandHint: {
      junior: "कोई कार्ड दबाओ, फिर 'सुनो' दबाओ। मैं तुम्हारे साथ पढ़ूँगा!",
      middle: "कोई विषय चुनो, साथ में सुनो और जो सीखा उसे चिह्नित करो।",
      senior: "दोहराई मोड: परीक्षा के लिए छोटे पाठ, टिप्स के साथ।",
    },
  },
};
