/**
 * Kalpavriksha — Module 03, Part B
 * Song library data for the immersive music player.
 *
 * AUDIO ATTRIBUTION & COPYRIGHT NOTICE
 * ======================================
 * Only recordings with verified redistribution rights are served.
 * - jana-gana-mana.mp3   : Supplied by project team (see project docs)
 * - vande-mataram.ogg    : Supplied by project team (see project docs)
 * - senthamizh-naadu.ogg : Supplied by project team (see project docs)
 * All other songs: audioSrc is null — the UI shows an "audio unavailable" state.
 *
 * Timestamps are illustrative line-level values only. They MUST be manually
 * calibrated against each actual recording before shipping.
 */

import type { LocalizedText } from "@/lib/i18n";

export type SongCategory =
  | "national-anthem"
  | "national-song"
  | "patriotic-hindi"
  | "patriotic-tamil"
  | "children-tamil"
  | "children-english"
  | "traditional";

export type SongLanguage = "hi" | "ta" | "en";

export type LyricWord = {
  readonly text: string;
  /** Audio time in seconds when this word starts. null = not yet calibrated. */
  readonly start: number | null;
  readonly end: number | null;
};

export type LyricLine = {
  readonly id: string;
  readonly text: string;
  /** Translation of this line (en if lang is not en, or ta/hi if lang is en). */
  readonly translation?: string;
  /** Audio time in seconds when this line starts. null = not yet calibrated. */
  readonly start: number | null;
  readonly end: number | null;
  readonly words: readonly LyricWord[];
};

export type SongEntry = {
  readonly id: string;
  readonly category: SongCategory;
  readonly language: SongLanguage;
  readonly classRange: readonly [number, number];
  readonly title: LocalizedText;
  readonly altTitle?: string;
  readonly credit: LocalizedText;
  readonly description: LocalizedText;
  readonly meaning: LocalizedText;
  readonly fact: LocalizedText;
  /** Vocab items to explain to younger students. */
  readonly vocabulary?: readonly { readonly word: string; readonly meaning: string }[];
  readonly lyrics: readonly LyricLine[];
  /** Path under /public, e.g. "/audio/patriotic-songs/jana-gana-mana.mp3". null = unavailable. */
  readonly audioSrc: string | null;
  /** Known duration in seconds; null if unknown. */
  readonly audioDuration: number | null;
  /** Colour used for ambient lighting and category badges. */
  readonly ambientColor: string;
  /** Whether lyrics are line-level only (not word-level). */
  readonly lineLevelOnly: boolean;
};

/** Build a simple line-level lyric array where every line has no word timestamps. */
function lines(texts: string[], starts: (number | null)[], ends: (number | null)[]): LyricLine[] {
  return texts.map((text, i) => ({
    id: `line-${i}`,
    text,
    start: starts[i] ?? null,
    end: ends[i] ?? null,
    words: text.split(/\s+/).filter(Boolean).map((w) => ({ text: w, start: null, end: null })),
  }));
}

export const SONG_LIBRARY: readonly SongEntry[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Jana Gana Mana — National Anthem (Hindi)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "jana-gana-mana",
    category: "national-anthem",
    language: "hi",
    classRange: [1, 4],
    title: {
      en: "Jana Gana Mana",
      ta: "ஜன கண மன",
      hi: "जन गण मन",
    },
    credit: {
      en: "Rabindranath Tagore",
      ta: "இரவீந்திரநாத் தாகூர்",
      hi: "रवींद्रनाथ टैगोर",
    },
    description: {
      en: "India's National Anthem — a song that unites every Indian heart.",
      ta: "இந்தியாவின் நாட்டுப்பண் — ஒவ்வொரு இந்தியனின் இதயத்தையும் ஒன்றிணைக்கும் பாடல்.",
      hi: "भारत का राष्ट्रगान — हर भारतीय के दिल को एक करने वाला गीत।",
    },
    meaning: {
      en: "It hails the leader who guides India's destiny, and names India's diverse regions, mountains and rivers — all awakening to sing of victory.",
      ta: "இந்தியாவின் விதியை வழிநடத்துபவரைப் போற்றுகிறது; நாட்டின் பகுதிகள், மலைகள், ஆறுகள் அனைத்தும் வெற்றியைப் பாடுகின்றன.",
      hi: "यह भारत के भाग्य-विधाता की जय गाता है और देश के क्षेत्रों, पर्वतों तथा नदियों का नाम लेता है — सभी जागकर जय-गाथा गाते हैं।",
    },
    fact: {
      en: "The full anthem takes exactly 52 seconds. By law, everyone must stand still and respectful while it plays.",
      ta: "முழு நாட்டுப்பண்ணை பாட சரியாக 52 வினாடிகள் ஆகும். பாடும்போது அனைவரும் அசையாமல் நிற்க வேண்டும்.",
      hi: "पूरा राष्ट्रगान गाने में ठीक 52 सेकंड लगते हैं। कानून के अनुसार सभी को सम्मान के साथ खड़ा होना चाहिए।",
    },
    vocabulary: [
      { word: "Adhinayaka", meaning: "Leader / Guide" },
      { word: "Vindhya", meaning: "Vindhya mountains of Central India" },
      { word: "Uchchala", meaning: "Overflowing / surging" },
    ],
    audioSrc: "/audio/patriotic-songs/jana-gana-mana.mp3",
    audioDuration: 52,
    ambientColor: "#FF9933",
    lineLevelOnly: true,
    lyrics: lines(
      [
        // Shown in English letters so every student can read along.
        "Jana gana mana adhinayaka jaya he",
        "Bharata bhagya vidhata",
        "Punjab Sindhu Gujarata Maratha",
        "Dravida Utkala Banga",
        "Vindhya Himachala Yamuna Ganga",
        "Uchchala jaladhi taranga",
        "Tava shubha name jage",
        "Tava shubha ashisha mage",
        "Gahe tava jaya gatha",
        "Jana gana mangala dayaka jaya he",
        "Bharata bhagya vidhata",
        "Jaya he, jaya he, jaya he",
        "Jaya jaya jaya, jaya he",
      ],
      // NOTE: These timestamps are ILLUSTRATIVE. Calibrate against the actual recording.
      [0, 4.5, 8, 12, 16, 20, 24, 27, 30, 34, 38, 44, 48],
      [4.5, 8, 12, 16, 20, 24, 27, 30, 34, 38, 44, 48, 52],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Vande Mataram — National Song (Hindi/Sanskrit)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "vande-mataram",
    category: "national-song",
    language: "hi",
    classRange: [1, 4],
    title: {
      en: "Vande Mataram",
      ta: "வந்தே மாதரம்",
      hi: "वन्दे मातरम्",
    },
    credit: {
      en: "Bankim Chandra Chatterjee",
      ta: "பங்கிம் சந்திர சட்டர்ஜி",
      hi: "बंकिम चंद्र चट्टोपाध्याय",
    },
    description: {
      en: "India's National Song — a passionate ode to Mother India, first published in 1882.",
      ta: "இந்தியாவின் தேசியப் பாடல் — 1882-இல் வெளியிடப்பட்ட, தாய் மண்ணுக்கான உணர்வுமிகு அஞ்சலி.",
      hi: "भारत का राष्ट्रीय गीत — 1882 में प्रकाशित, माँ भारत को एक भावपूर्ण श्रद्धांजलि।",
    },
    meaning: {
      en: "'I bow to you, Mother' — a land rich in water and fruit, cooled by southern breezes and green with crops.",
      ta: "'தாயே, உன்னை வணங்குகிறேன்' — நீர் வளமும் கனி வளமும் நிறைந்த, தென்றலால் குளிர்ந்த, பயிர்களால் பசுமையான நாடு.",
      hi: "'हे माँ, मैं तुम्हें नमन करता हूँ' — जल और फलों से भरपूर, मलय पवन से शीतल, फ़सलों से हरी-भरी धरती।",
    },
    fact: {
      en: "It first appeared in Bankim Chandra's novel 'Anandamath' (1882) and was sung at the Indian National Congress session in 1896 by Tagore.",
      ta: "இது 1882-ல் 'ஆனந்தமடம்' நாவலில் முதலில் வெளிவந்தது; 1896-ல் தாகூர் இதை காங்கிரஸ் மாநாட்டில் பாடினார்.",
      hi: "यह पहली बार 'आनंदमठ' (1882) में छपा और 1896 में टैगोर ने इसे कांग्रेस अधिवेशन में गाया था।",
    },
    audioSrc: "/audio/patriotic-songs/vande-mataram.ogg",
    audioDuration: null,
    ambientColor: "#DAA520",
    lineLevelOnly: true,
    lyrics: lines(
      [
        // Shown in English letters so every student can read along.
        "Vande Mataram",
        "Sujalam suphalam malayaja shitalam",
        "Shasya shyamalam Mataram",
        "Vande Mataram",
        "Shubhra jyotsna pulakita yaminim",
        "Phulla kusumita drumadala shobhinim",
        "Suhasinim sumadhura bhashinim",
        "Sukhadam varadam Mataram",
        "Vande Mataram",
      ],
      [0, 3, 8, 12, 15, 20, 25, 30, 35],
      [3, 8, 12, 15, 20, 25, 30, 35, 40],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Senthamizh Naadu — Tamil Patriotic
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "senthamizh-naadu",
    category: "patriotic-tamil",
    language: "ta",
    classRange: [1, 4],
    title: {
      en: "Senthamizh Naadu",
      ta: "செந்தமிழ் நாடு",
      hi: "सेंतमिल नाडु",
    },
    credit: {
      en: "Mahakavi Bharathiyar",
      ta: "மகாகவி பாரதியார்",
      hi: "महाकवि भारतियार",
    },
    description: {
      en: "A stirring patriotic song by Bharathiyar celebrating Tamil Nadu, its people and their ancestral pride.",
      ta: "தமிழ்நாட்டையும் அதன் மக்களையும் போற்றும் பாரதியாரின் தேசபக்திப் பாடல்.",
      hi: "भारतियार का एक ओजस्वी गीत जो तमिलनाडु, उसके लोगों और उनके पूर्वजों की गौरवगाथा गाता है।",
    },
    meaning: {
      en: "When we hear 'Tamil Nadu', sweet honey flows into our ears; when we speak of our forefathers' land, new strength is born in our breath.",
      ta: "'செந்தமிழ் நாடு' என்று கேட்கும்போதே காதில் இன்பத் தேன் பாய்கிறது; 'தந்தையர் நாடு' என்று பேசும்போது மூச்சில் புதிய சக்தி பிறக்கிறது.",
      hi: "'तमिल नाडु' सुनते ही कानों में मीठा शहद बहने लगता है; 'पूर्वजों की धरती' कहते ही साँसों में नई शक्ति जन्म लेती है।",
    },
    fact: {
      en: "Bharathiyar (1882–1921) was a revolutionary Tamil poet whose songs inspired thousands during India's freedom struggle.",
      ta: "பாரதியார் (1882–1921) ஒரு புரட்சிகர தமிழ்க் கவிஞர்; அவரின் பாடல்கள் விடுதலைப் போராட்டத்தில் ஆயிரக்கணக்கானோரை ஊக்குவித்தன.",
      hi: "भारतियार (1882–1921) एक क्रांतिकारी तमिल कवि थे जिनके गीतों ने स्वतंत्रता संग्राम में हजारों लोगों को प्रेरित किया।",
    },
    audioSrc: "/audio/patriotic-songs/senthamizh-naadu.ogg",
    audioDuration: null,
    ambientColor: "#8B1A1A",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "செந்தமிழ் நாடெனும் போதினிலே – இன்பத்",
        "தேன் வந்து பாயுது காதினிலே – எங்கள்",
        "தந்தையர் நாடென்ற பேச்சினிலே – ஒரு",
        "சக்தி பிறக்குது மூச்சினிலே",
        "ஓடி விளையாடு பாப்பா – நீ",
        "ஓய்ந்திருக்க லாகாது பாப்பா – கொஞ்சும்",
        "வாடி விளையாடு பாப்பா – மனம்",
        "வாட்டமடைந்திட லாகாது பாப்பா",
      ],
      [0, 5, 10, 15, 20, 26, 32, 38],
      [5, 10, 15, 20, 26, 32, 38, 45],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Aaduvome Pallu Paaduvome — Tamil Patriotic
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "aaduvome-pallu-paaduvome",
    category: "patriotic-tamil",
    language: "ta",
    classRange: [1, 4],
    title: {
      en: "Aaduvome Pallu Paaduvome",
      ta: "ஆடுவோமே பள்ளு பாடுவோமே",
      hi: "आडुवोमे पल्लु पाडुवोमे",
    },
    credit: {
      en: "Mahakavi Bharathiyar",
      ta: "மகாகவி பாரதியார்",
      hi: "महाकवि भारतियार",
    },
    description: {
      en: "A joyful Bharathiyar song celebrating freedom, dance and song as expressions of a liberated spirit.",
      ta: "சுதந்திரத்தை, நடனத்தையும் பாட்டையும் மகிழ்ச்சியுடன் கொண்டாடும் பாரதியாரின் பாடல்.",
      hi: "भारतियार का एक आनंदमय गीत जो नृत्य और गान के माध्यम से स्वतंत्रता का उत्सव मनाता है।",
    },
    meaning: {
      en: "Let us dance and sing! Let us celebrate India's freedom with joy and exuberance.",
      ta: "ஆடுவோம்! பாடுவோம்! இந்தியாவின் சுதந்திரத்தை மகிழ்ச்சியாகக் கொண்டாடுவோம்.",
      hi: "आओ नाचें और गाएँ! भारत की आज़ादी को हर्षोल्लास के साथ मनाएँ।",
    },
    fact: {
      en: "Bharathiyar wrote this song during the Indian independence movement to inspire the masses with energy and hope.",
      ta: "இந்திய விடுதலை இயக்கத்தின்போது மக்களுக்கு ஊக்கமும் நம்பிக்கையும் அளிக்க பாரதியார் இப்பாடலை இயற்றினார்.",
      hi: "भारतियार ने यह गीत भारतीय स्वतंत्रता आंदोलन के दौरान जनमानस को ऊर्जा और उम्मीद से भरने के लिए लिखा था।",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#6B3A8B",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "ஆடுவோமே பள்ளு பாடுவோமே",
        "ஆனந்த சுதந்திரம் அடைந்துவிட்டோமென்று",
        "கூடுவோமே நல்ல கூடுவோமே",
        "கோடி இந்தியர் ஒரே குலம் என்று",
        "வாழி செந்தமிழ் வாழியவே",
        "வாழி இந்தியா வாழி வாழி",
        "வேழி என்று நாம் வாழி என்று நாம்",
        "விண்ணளவு கீர்த்தி விளைத்திடுவோம்",
      ],
      [0, 5, 10, 15, 20, 26, 32, 38],
      [5, 10, 15, 20, 26, 32, 38, 45],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Odi Vilayaadu Paappa — Tamil Children's Song
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "odi-vilayaadu-paappa",
    category: "children-tamil",
    language: "ta",
    classRange: [1, 3],
    title: {
      en: "Odi Vilayaadu Paappa",
      ta: "ஓடி விளையாடு பாப்பா",
      hi: "ओडि विलयाडु पाप्पा",
    },
    credit: {
      en: "Mahakavi Bharathiyar",
      ta: "மகாகவி பாரதியார்",
      hi: "महाकवि भारतियार",
    },
    description: {
      en: "A beloved children's song by Bharathiyar urging children to run, play and not sit idle.",
      ta: "குழந்தைகளை ஓடி விளையாட ஊக்குவிக்கும் பாரதியாரின் அன்புமிகு பாடல்.",
      hi: "भारतियार का एक प्रिय बाल गीत जो बच्चों को दौड़ने, खेलने और आलस्य न करने के लिए प्रोत्साहित करता है।",
    },
    meaning: {
      en: "Run and play, little one — you must not be idle! Play happily — your mind must not be burdened with worries.",
      ta: "ஓடி விளையாடு பாப்பா — நீ ஓய்ந்திருக்கலாகாது! மனம் வாட்டமடைந்திட லாகாது.",
      hi: "दौड़ो और खेलो, बच्चे — आलस्य न करो! खुशी से खेलो — मन में चिंता न हो।",
    },
    fact: {
      en: "This song is beloved by Tamil children across generations and is often the first Tamil poem children learn in school.",
      ta: "இப்பாடல் தலைமுறை தலைமுறையாக தமிழ் குழந்தைகளுக்கு மிகவும் பிடித்தமானது; பலர் முதலில் கற்கும் தமிழ் கவிதை இதுவே.",
      hi: "यह गीत पीढ़ियों से तमिल बच्चों का प्रिय रहा है और अक्सर यही पहली तमिल कविता होती है जो बच्चे स्कूल में सीखते हैं।",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#2E7D32",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "ஓடி விளையாடு பாப்பா",
        "நீ ஓய்ந்திருக்க லாகாது பாப்பா",
        "கொஞ்சும் வாடி விளையாடு பாப்பா",
        "மனம் வாட்டமடைந்திட லாகாது பாப்பா",
        "காடும் மலையும் படர்ந்து கிடக்குது",
        "கண்ணுக்கினிய பொழில் நிறைந்திடுது",
        "நாடி நாடி விளையாட வேண்டும்",
        "நல்ல உடலும் நல்ல மனமும் வேண்டும்",
      ],
      [0, 4, 8, 13, 18, 23, 28, 33],
      [4, 8, 13, 18, 23, 28, 33, 38],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Nila Nila Odi Vaa — Tamil Children's Rhyme
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "nila-nila-odi-vaa",
    category: "children-tamil",
    language: "ta",
    classRange: [1, 2],
    title: {
      en: "Nila Nila Odi Vaa",
      ta: "நிலா நிலா ஓடி வா",
      hi: "निला निला ओडि वा",
    },
    credit: {
      en: "Traditional Tamil Rhyme",
      ta: "பாரம்பரிய தமிழ் பாடல்",
      hi: "परंपरागत तमिल गीत",
    },
    description: {
      en: "A sweet children's rhyme inviting the moon to come and play, one of the most beloved Tamil lullabies.",
      ta: "நிலாவை விளையாட அழைக்கும் இனிய குழந்தைப் பாடல் — தமிழில் மிகவும் மகிழ்ச்சியளிக்கும் தாலாட்டுகளில் ஒன்று.",
      hi: "चंद्रमा को खेलने के लिए बुलाने वाली एक मधुर बाल कविता — तमिल की सबसे प्रिय लोरियों में से एक।",
    },
    meaning: {
      en: "Come running, moon! Tell me how many stars are in the sky. Bring us your cool, gentle light.",
      ta: "நிலா ஓடி வா! வானில் எத்தனை நட்சத்திரங்கள் உள்ளன என்று சொல்; குளிர்ந்த ஒளியை கொண்டு வா.",
      hi: "दौड़ते हुए आओ, चंद्रमा! आकाश में कितने तारे हैं बताओ; अपनी शीतल रोशनी लाओ।",
    },
    fact: {
      en: "Tamil children have sung this rhyme for many centuries. It reflects how children in India have always found wonder in the night sky.",
      ta: "தமிழ் குழந்தைகள் பல நூற்றாண்டுகளாக இப்பாடலை பாடி வருகின்றனர்; இரவு வானில் அவர்கள் காணும் வியப்பை இது காட்டுகிறது.",
      hi: "तमिल बच्चे कई सदियों से यह गीत गाते आए हैं। यह भारतीय बच्चों के रात्रि आकाश से जुड़े आश्चर्य को दर्शाता है।",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#1A237E",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "நிலா நிலா ஓடி வா",
        "நில்லாமல் ஓடி வா",
        "நிலவொளி தந்து வா",
        "நித்தமும் வந்து வா",
        "வானில் நட்சத்திரம் எத்தனை",
        "வண்ண வண்ண நிறம் எத்தனை",
        "கண்ணை மூடி திறந்தால்",
        "கண்டதை சொல்லு நீ",
      ],
      [0, 4, 8, 12, 16, 20, 24, 28],
      [4, 8, 12, 16, 20, 24, 28, 32],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Twinkle Twinkle Little Star — English Nursery Rhyme
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "twinkle-twinkle",
    category: "children-english",
    language: "en",
    classRange: [1, 2],
    title: {
      en: "Twinkle Twinkle Little Star",
      ta: "டுவிங்கிள் டுவிங்கிள் லிட்டில் ஸ்டார்",
      hi: "ट्विंकल ट्विंकल लिटिल स्टार",
    },
    credit: {
      en: "Jane Taylor (1806)",
      ta: "ஜேன் டெய்லர் (1806)",
      hi: "जेन टेलर (1806)",
    },
    description: {
      en: "A timeless English nursery rhyme about the wonder of stars in the night sky.",
      ta: "இரவு வானில் மிளிர்ந்து மின்னும் நட்சத்திரங்களைப் பற்றிய காலத்தால் அழியாத ஆங்கில குழந்தைப் பாடல்.",
      hi: "रात के आकाश में टिमटिमाते तारों के बारे में एक कालजयी अंग्रेज़ी नर्सरी राइम।",
    },
    meaning: {
      en: "The song wonders at a star shining like a diamond high above the world, lighting the way for travellers in the dark.",
      ta: "உலகுக்கு மேலே வைரமாக மின்னும் நட்சத்திரம், இருளில் பயணிப்போருக்கு வழிகாட்டுகிறது என்று வியக்கும் பாடல்.",
      hi: "यह गीत दुनिया के ऊपर हीरे की तरह चमकते तारे पर अचम्भा करता है जो अँधेरे में यात्रियों को रोशनी देता है।",
    },
    fact: {
      en: "The melody was adapted from a French tune called 'Ah! vous dirai-je, maman'. Mozart also composed variations on the same melody.",
      ta: "இந்த இசை 'Ah! vous dirai-je, maman' என்ற பிரெஞ்சு ஈசையிலிருந்து எடுக்கப்பட்டது. மொஸார்ட்டும் இதே ஈசையில் மாறுபாடுகள் இசைத்தார்.",
      hi: "इस धुन को 'Ah! vous dirai-je, maman' नामक फ्रांसीसी धुन से लिया गया था। मोज़ार्ट ने भी इसी धुन पर रचनाएँ कीं।",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#4A148C",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "Twinkle, twinkle, little star",
        "How I wonder what you are",
        "Up above the world so high",
        "Like a diamond in the sky",
        "Twinkle, twinkle, little star",
        "How I wonder what you are",
        "When the blazing sun is gone",
        "When he nothing shines upon",
        "Then you show your little light",
        "Twinkle, twinkle, all the night",
      ],
      [0, 4, 8, 12, 16, 20, 24, 28, 32, 36],
      [4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Johny Johny Yes Papa — English Nursery Rhyme
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "johny-johny",
    category: "children-english",
    language: "en",
    classRange: [1, 2],
    title: {
      en: "Johny Johny Yes Papa",
      ta: "ஜானி ஜானி யெஸ் பாப்பா",
      hi: "जॉनी जॉनी यस पापा",
    },
    credit: {
      en: "Traditional Nursery Rhyme",
      ta: "பாரம்பரிய குழந்தைப் பாடல்",
      hi: "परंपरागत नर्सरी राइम",
    },
    description: {
      en: "A fun rhyme about a child who sneaks sugar and gets caught by his father!",
      ta: "சர்க்கரையை ஒளிவாக சாப்பிட்ட குழந்தை தந்தையிடம் பிடிபடும் நகைச்சுவையான குழந்தைப் பாடல்!",
      hi: "एक मज़ेदार गीत जिसमें एक बच्चा चुपके से चीनी खाता है और पिताजी उसे पकड़ लेते हैं!",
    },
    meaning: {
      en: "A dialogue between a father and child about honesty. The child admits to eating sugar when asked, learning that telling the truth is always better.",
      ta: "நேர்மையைப் பற்றிய தந்தையும் மகனும் உரையாடல். சர்க்கரை சாப்பிட்டதை ஒத்துக்கொண்ட குழந்தை, உண்மை பேசுவதே சிறந்தது என்று அறிகிறது.",
      hi: "पिता और बच्चे के बीच ईमानदारी पर एक संवाद। बच्चा चीनी खाने की बात मानता है और सीखता है कि सच बोलना हमेशा बेहतर है।",
    },
    fact: {
      en: "This rhyme teaches children about honesty through a simple, repetitive and memorable conversation. It is popular in classrooms across India.",
      ta: "இந்த ரைம் நேர்மையைப் பற்றி குழந்தைகளுக்கு எளிமையான உரையாடல் வழியாக கற்பிக்கிறது. இந்தியா முழுவதும் வகுப்பறைகளில் பிரபலமானது.",
      hi: "यह गीत बच्चों को एक सरल, दोहराव वाली बातचीत के माध्यम से ईमानदारी सिखाता है। यह भारत भर की कक्षाओं में लोकप्रिय है।",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#1B5E20",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "Johny Johny, Yes Papa?",
        "Eating sugar? No Papa!",
        "Telling lies? No Papa!",
        "Open your mouth — Ha ha ha!",
        "Johny Johny, Yes Papa?",
        "Eating sugar? No Papa!",
        "Telling lies? No Papa!",
        "Open your mouth — Ha ha ha!",
      ],
      [0, 4, 8, 12, 16, 20, 24, 28],
      [4, 8, 12, 16, 20, 24, 28, 32],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 9. The Wheels on the Bus — English Children's Rhyme
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "wheels-on-the-bus",
    category: "children-english",
    language: "en",
    classRange: [1, 3],
    title: {
      en: "The Wheels on the Bus",
      ta: "தி வீல்ஸ் ஆன் தி பஸ்",
      hi: "द व्हील्स ऑन द बस",
    },
    credit: {
      en: "Verna Hills (1939)",
      ta: "வெர்னா ஹில்ஸ் (1939)",
      hi: "वर्ना हिल्स (1939)",
    },
    description: {
      en: "An action song where children mime bus sounds — great for movement and imagination!",
      ta: "குழந்தைகள் பஸ் சத்தங்களை நடிக்கும் பாடல் — கற்பனை மற்றும் இயக்கத்திற்கு அருமையானது!",
      hi: "एक क्रिया गीत जिसमें बच्चे बस की आवाज़ें अभिनय करते हैं — आंदोलन और कल्पना के लिए बढ़िया!",
    },
    meaning: {
      en: "An action rhyme describing everything on a bus — the wheels go round, the wipers go swish, the horn goes beep, and the people go up and down!",
      ta: "ஒரு பஸ்ஸில் நடப்பவற்றை விவரிக்கும் பாடல் — சக்கரங்கள் சுற்றுகின்றன, துடைப்பிகள் அசைகின்றன, ஒலிப்பான் கத்துகிறது, மக்கள் மேல்கீழ் போகிறார்கள்!",
      hi: "बस में सब कुछ बताने वाला एक क्रिया गीत — पहिए घूमते हैं, वाइपर झूमते हैं, हॉर्न बजता है, और लोग ऊपर-नीचे होते हैं!",
    },
    fact: {
      en: "This song is used by teachers worldwide to teach action words and body movement to young children.",
      ta: "இப்பாடலை உலகெங்கும் ஆசிரியர்கள் சிறு குழந்தைகளுக்கு செயல் வார்த்தைகள் மற்றும் உடல் அசைவுகளை கற்பிக்க பயன்படுத்துகிறார்கள்.",
      hi: "यह गीत दुनिया भर के शिक्षकों द्वारा छोटे बच्चों को क्रिया शब्द और शारीरिक गतिविधि सिखाने के लिए उपयोग किया जाता है।",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#0D47A1",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "The wheels on the bus go round and round",
        "Round and round, round and round",
        "The wheels on the bus go round and round",
        "All through the town",
        "The wipers on the bus go swish, swish, swish",
        "Swish, swish, swish — swish, swish, swish",
        "The wipers on the bus go swish, swish, swish",
        "All through the town",
        "The horn on the bus goes beep, beep, beep",
        "Beep, beep, beep — beep, beep, beep",
        "The horn on the bus goes beep, beep, beep",
        "All through the town",
      ],
      [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44],
      [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
    ),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10. If You're Happy and You Know It — English Children's Song
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "if-youre-happy",
    category: "children-english",
    language: "en",
    classRange: [1, 3],
    title: {
      en: "If You're Happy and You Know It",
      ta: "இஃப் யூ ஆர் ஹேப்பி",
      hi: "इफ यू आर हैप्पी",
    },
    credit: {
      en: "Traditional — popularised by Alfred Matesky",
      ta: "பாரம்பரியம் — ஆல்ஃபிரட் மேட்ஸ்கி பிரபலப்படுத்தினார்",
      hi: "परंपरागत — अल्फ्रेड मेटेस्की द्वारा लोकप्रिय",
    },
    description: {
      en: "An action song about expressing happiness through clapping, stomping and shouting!",
      ta: "மகிழ்ச்சியை தட்டுதல், மிதித்தல், கத்துதல் வழியாக வெளிப்படுத்துவது பற்றிய ஒரு இயக்கப் பாடல்!",
      hi: "ताली बजाकर, पैर थपथपाकर और चिल्लाकर खुशी व्यक्त करने के बारे में एक क्रिया गीत!",
    },
    meaning: {
      en: "A participatory song that teaches children to show their feelings through actions — when happy, clap your hands, stomp your feet or shout 'hurray'!",
      ta: "குழந்தைகளுக்கு செயல்கள் வழியாக உணர்வுகளை வெளிப்படுத்த கற்றுத்தரும் பாடல் — மகிழ்ச்சியில் கைகளை தட்டு, காலை மிதி, 'ஹுர்ரே' என்று கத்து!",
      hi: "एक सहभागी गीत जो बच्चों को क्रियाओं के माध्यम से भावनाएँ व्यक्त करना सिखाता है — खुशी हो तो ताली बजाओ, पैर थपथपाओ या 'हुर्रे' चिल्लाओ!",
    },
    fact: {
      en: "This song helps children develop emotional intelligence by linking feelings with physical actions. It's sung in classrooms in over 50 countries!",
      ta: "இந்த பாடல் உணர்வுகளை உடல் செயல்களோடு இணைப்பதன் மூலம் குழந்தைகளின் உணர்வு நுண்ணறிவை வளர்க்க உதவுகிறது. 50க்கும் மேற்பட்ட நாடுகளில் பாடப்படுகிறது!",
      hi: "यह गीत भावनाओं को शारीरिक क्रियाओं से जोड़कर बच्चों की भावनात्मक बुद्धिमत्ता विकसित करने में मदद करता है। 50 से अधिक देशों में गाया जाता है!",
    },
    audioSrc: null,
    audioDuration: null,
    ambientColor: "#E65100",
    lineLevelOnly: true,
    lyrics: lines(
      [
        "If you're happy and you know it, clap your hands",
        "If you're happy and you know it, clap your hands",
        "If you're happy and you know it",
        "And you really want to show it",
        "If you're happy and you know it, clap your hands",
        "If you're happy and you know it, stomp your feet",
        "If you're happy and you know it, stomp your feet",
        "If you're happy and you know it",
        "And you really want to show it",
        "If you're happy and you know it, stomp your feet",
      ],
      [0, 5, 10, 13, 16, 22, 27, 32, 35, 38],
      [5, 10, 13, 16, 22, 27, 32, 35, 38, 44],
    ),
  },
];

/** Song category display metadata */
export const CATEGORY_META: Record<SongCategory, {
  label: LocalizedText;
  color: string;
  emoji: string;
}> = {
  "national-anthem": {
    label: { en: "National Anthem", ta: "நாட்டுப்பண்", hi: "राष्ट्रगान" },
    color: "#FF9933",
    emoji: "🇮🇳",
  },
  "national-song": {
    label: { en: "National Song", ta: "தேசியப் பாடல்", hi: "राष्ट्रगीत" },
    color: "#DAA520",
    emoji: "🌸",
  },
  "patriotic-hindi": {
    label: { en: "Patriotic", ta: "தேசபக்திப் பாடல்", hi: "देशभक्ति" },
    color: "#9333EA",
    emoji: "🎖️",
  },
  "patriotic-tamil": {
    label: { en: "Tamil Patriotic", ta: "தமிழ் தேசபக்தி", hi: "तमिल देशभक्ति" },
    color: "#8B1A1A",
    emoji: "🌺",
  },
  "children-tamil": {
    label: { en: "Tamil Rhyme", ta: "தமிழ் பாடல்", hi: "तमिल गीत" },
    color: "#2E7D32",
    emoji: "🌿",
  },
  "children-english": {
    label: { en: "English Rhyme", ta: "ஆங்கில பாடல்", hi: "अंग्रेज़ी गीत" },
    color: "#1565C0",
    emoji: "⭐",
  },
  "traditional": {
    label: { en: "Traditional", ta: "பாரம்பரியம்", hi: "पारंपरिक" },
    color: "#6B3A8B",
    emoji: "🎵",
  },
};

