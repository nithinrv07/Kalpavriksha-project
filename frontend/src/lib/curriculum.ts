import type { Locale, LocalizedText } from "@/lib/i18n";

export type ResourceType = "text" | "pdf" | "video" | "audio" | "practice" | "link";

export const TN_TEXTBOOK_PORTAL_URL = "https://share.google/DWaDvFsGIVE5d4HHs";

export type ResourceItem = {
  readonly id: string;
  readonly title: LocalizedText;
  readonly type: ResourceType;
  readonly url: string;
  readonly description?: LocalizedText;
  readonly durationMinutes?: number;
  readonly available: boolean;
};

export type PracticeQuestion = {
  readonly id: string;
  readonly question: LocalizedText;
  readonly options: readonly LocalizedText[];
  readonly answerIndex: number;
  readonly explanation: LocalizedText;
};

export type CurriculumChapter = {
  readonly id: string;
  readonly chapterNumber: number;
  readonly title: LocalizedText;
  readonly summary: LocalizedText;
  readonly lessonLines: readonly string[];
  readonly lessonLang: Locale;
  readonly resources: readonly ResourceItem[];
  readonly practiceQuestions?: readonly PracticeQuestion[];
  readonly estimatedMinutes: number;
};

export type SubjectStream = "general" | "science" | "commerce" | "arts";

export type CurriculumSubject = {
  readonly id: string;
  readonly code: string;
  readonly name: LocalizedText;
  readonly accent: string;
  readonly icon: "tamil" | "english" | "math" | "science" | "social" | "physics" | "chemistry" | "biology" | "computer" | "commerce";
  readonly description: LocalizedText;
  readonly stream: SubjectStream;
  readonly textbookUrl: string;
  readonly chapters: readonly CurriculumChapter[];
};

export type StandardCurriculum = {
  readonly standard: number;
  readonly name: LocalizedText;
  readonly stage: "primary" | "middle" | "secondary" | "higher_secondary";
  readonly subjects: readonly CurriculumSubject[];
};

export const SUPPORTED_STANDARDS = [4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type SupportedStandard = (typeof SUPPORTED_STANDARDS)[number];

export function isSupportedStandard(val: unknown): val is SupportedStandard {
  return typeof val === "number" && (SUPPORTED_STANDARDS as readonly number[]).includes(val);
}

// ============================================================================
// CURRICULUM DEFINITIONS: Class 4 to Class 12 (Samacheer Kalvi - Tamil Nadu)
// ============================================================================

const CURRICULUM_DATA: Record<SupportedStandard, StandardCurriculum> = {
  // --------------------------------------------------------------------------
  // CLASS 4 (Primary)
  // --------------------------------------------------------------------------
  4: {
    standard: 4,
    name: { en: "Class 4", ta: "வகுப்பு 4", hi: "कक्षा 4" },
    stage: "primary",
    subjects: [
      {
        id: "c4-tamil",
        code: "TAM-04",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: {
          en: "Prose, poetry, grammar, stories and foundational Tamil values.",
          ta: "உரைநடை, செய்யுள், இலக்கணம் மற்றும் நற்பண்புக் கதைகள்.",
          hi: "गद्य, पद्य, व्याकरण और नैतिक कहानियाँ।",
        },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c4-tam-ch1",
            chapterNumber: 1,
            title: { en: "Annai Thamizhe (அன்னைத் தமிழே)", ta: "அன்னைத் தமிழே", hi: "अन्नै तमिले" },
            summary: {
              en: "Praising Mother Tamil for wisdom, expression, and cultural richness.",
              ta: "அன்னைத் தமிழின் பெருமை, இனிமை மற்றும் சிறப்பைப் போற்றும் பாடல்.",
              hi: "मातृभाषा तमिल के ज्ञान, मिठास और गौरव का वर्णन।",
            },
            lessonLines: [
              "அன்னைத் தமிழே என் ஆவி கலந்தவளே!",
              "என்னை வளர்ப்பவளே என்னில் வளர்பவளே!",
              "உன்னைப் புகழ்வதற்கே உலகில் பிறப்பெடுத்தேன்;",
              "சொல்லில் விளையாடச் சொல்லித் தந்தவளே!",
            ],
            lessonLang: "ta",
            estimatedMinutes: 6,
            resources: [
              {
                id: "c4-tam-ch1-pdf",
                title: { en: "Class 4 Tamil Term 1 Textbook PDF", ta: "வகுப்பு 4 தமிழ் பாடநூல் (PDF)", hi: "कक्षा 4 तमिल पाठ्यपुस्तक" },
                type: "pdf",
                url: TN_TEXTBOOK_PORTAL_URL,
                description: { en: "Official Tamil Nadu Textbook Corporation PDF notes", ta: "தமிழ்நாடு பாடநூல் கழகத்தின் மின்நூல்", hi: "आधिकारिक तमिलनाडु पाठ्यपुस्तक" },
                available: true,
              },
              {
                id: "c4-tam-ch1-aud",
                title: { en: "Recitation & Meaning Audio", ta: "பாடல் வாசிப்பு மற்றும் விளக்கம்", hi: "पाठ और व्याख्या ऑडियो" },
                type: "audio",
                url: "https://example.com/audio/c4-tam-ch1.mp3",
                durationMinutes: 4,
                available: true,
              },
            ],
            practiceQuestions: [
              {
                id: "c4-tam-q1",
                question: { en: "Who nurtured and grew inside the poet?", ta: "கவிஞரை வளர்த்து அவரில் வளர்பவள் யார்?", hi: "कवि का पालन-पोषण किसने किया?" },
                options: [
                  { en: "Mother Tamil (அன்னைத் தமிழ்)", ta: "அன்னைத் தமிழ்", hi: "मातृभाषा तमिल" },
                  { en: "Nature (இயற்கை)", ta: "இயற்கை", hi: "प्रकृति" },
                  { en: "Teacher (ஆசிரியர்)", ta: "ஆசிரியர்", hi: "शिक्षक" },
                  { en: "Friend (நண்பன்)", ta: "நண்பன்", hi: "मित्र" },
                ],
                answerIndex: 0,
                explanation: { en: "The poem glorifies Mother Tamil as life and guide.", ta: "பாடல் அன்னைத் தமிழையே ஆவியாகவும் வளர்ப்பவளாகவும் போற்றுகிறது.", hi: "कविता मातृभाषा तमिल को जीवन और पथप्रदर्शक मानती है।" },
              },
            ],
          },
          {
            id: "c4-tam-ch2",
            chapterNumber: 2,
            title: { en: "Panmuga Kadhavukal (Panpattu Kadhaigal)", ta: "பண்படுத்தும் சொலவடைகள்", hi: "पारंपरिक लोकोक्तियाँ" },
            summary: {
              en: "Rural proverbs and stories illustrating honesty, gratitude, and moral values.",
              ta: "கிராமத்து சொலவடைகள் மற்றும் நற்பண்புகளை விளக்கும் சிறுகதைகள்.",
              hi: "पारंपरिक कहावतें और जीवन मूल्य सिखाने वाली कहानियाँ।",
            },
            lessonLines: [
              "அகத்தின் அழகு முகத்தில் தெரியும்.",
              "ஆடிப் பட்டம் தேடி விதை.",
              "அளவுக்கு மிஞ்சினால் அமுதமும் நஞ்சு.",
            ],
            lessonLang: "ta",
            estimatedMinutes: 5,
            resources: [
              {
                id: "c4-tam-ch2-pdf",
                title: { en: "Proverbs Lesson Notes PDF", ta: "சொலவடைகள் குறிப்பு (PDF)", hi: "लोकोक्तियाँ पाठ्य सामग्री" },
                type: "pdf",
                url: TN_TEXTBOOK_PORTAL_URL,
                available: true,
              },
            ],
          },
        ],
      },
      {
        id: "c4-english",
        code: "ENG-04",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: {
          en: "Reading comprehension, poetry, vocabulary building, and conversational skills.",
          ta: "ஆங்கில வாசிப்பு, செய்யுள், சொல்வளம் மற்றும் உரையாடல் பயிற்சிகள்.",
          hi: "अंग्रेज़ी पठन, शब्दावली, कविता और संवाद कौशल।",
        },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c4-eng-ch1",
            chapterNumber: 1,
            title: { en: "The Trick Robot", ta: "தந்திரமான ரோபோ", hi: "चतुर रोबोट" },
            summary: {
              en: "Vicky learns responsibility when his lazy tricks fail with an honest robot.",
              ta: "பொறுப்புணர்வை உணர்த்தும் விக்கி மற்றும் ரோபோவின் சுவையான கதை.",
              hi: "विकी और ईमानदार रोबोट की कहानी जो जिम्मेदारी का पाठ पढ़ाती है।",
            },
            lessonLines: [
              "Vicky was a lazy boy. He never did his homework on time.",
              "His father bought him a smart robot to assist him.",
              "The robot refused to work until Vicky cleaned up his room himself!",
            ],
            lessonLang: "en",
            estimatedMinutes: 5,
            resources: [
              {
                id: "c4-eng-ch1-pdf",
                title: { en: "Class 4 English Unit 1 Textbook PDF", ta: "வகுப்பு 4 ஆங்கில பாடம் 1 (PDF)", hi: "कक्षा 4 अंग्रेज़ी पाठ 1" },
                type: "pdf",
                url: TN_TEXTBOOK_PORTAL_URL,
                available: true,
              },
            ],
          },
        ],
      },
      {
        id: "c4-math",
        code: "MAT-04",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: {
          en: "Geometry, numbers up to 10,000, addition, subtraction, multiplication, and fractions.",
          ta: "வடிவியல், எண்கள், கூட்டல், கழித்தல், பெருக்கல் மற்றும் பின்னங்கள்.",
          hi: "ज्यामिति, बड़ी संख्याएँ, जोड़, घटाव, गुणा और बुनियादी भिन्न।",
        },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c4-mat-ch1",
            chapterNumber: 1,
            title: { en: "Geometry & 2D/3D Shapes", ta: "வடிவியல் மற்றும் வடிவங்கள்", hi: "ज्यामिति और आकार" },
            summary: {
              en: "Identifying edges, vertices, perimeter, cubes, cuboids, and symmetrical patterns.",
              ta: "இருபரிமாண, முப்பரிமாண வடிவங்கள் மற்றும் சமச்சீர் அமைப்புகள்.",
              hi: "2डी और 3डी आकृतियाँ, किनारे, कोने और सममिति।",
            },
            lessonLines: [
              "A square has 4 equal sides, 4 corners, and 2 diagonals.",
              "A cube has 6 square faces, 12 edges, and 8 vertices.",
              "Symmetry means one half exactly matches the other half.",
            ],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [
              {
                id: "c4-mat-ch1-pdf",
                title: { en: "Class 4 Maths Geometry Chapter PDF", ta: "கணிதம் வடிவியல் அத்தியாயம் (PDF)", hi: "गणित ज्यामिति पाठ्य सामग्री" },
                type: "pdf",
                url: TN_TEXTBOOK_PORTAL_URL,
                available: true,
              },
            ],
          },
        ],
      },
      {
        id: "c4-science",
        code: "SCI-04",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: {
          en: "My Body, Green World, Animals around us, Matter and Materials.",
          ta: "நமது உடல் உறுப்புகள், பசுமை உலகம், விலங்குகள் மற்றும் பருப்பொருட்கள்.",
          hi: "हमारा शरीर, पेड़-पौधे, जीव-जंतु और पदार्थ।",
        },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c4-sci-ch1",
            chapterNumber: 1,
            title: { en: "Internal Organs of Human Body", ta: "நமது உள்ளுறுப்புகள்", hi: "मानव शरीर के आंतरिक अंग" },
            summary: {
              en: "Functions of brain, heart, lungs, stomach, and kidneys.",
              ta: "மூளை, இதயம், நுரையீரல், இரைப்பை மற்றும் சிறுநீரகத்தின் பணிகள்.",
              hi: "मस्तिष्क, हृदय, फेफड़े, पेट और गुर्दे के कार्य।",
            },
            lessonLines: [
              "The brain controls every action and thought in our body.",
              "Lungs help us breathe oxygen and remove carbon dioxide.",
              "The heart pumps blood continuously to all body parts.",
            ],
            lessonLang: "en",
            estimatedMinutes: 6,
            resources: [
              {
                id: "c4-sci-ch1-pdf",
                title: { en: "Class 4 Science Internal Organs PDF", ta: "உள்ளுறுப்புகள் பாடம் (PDF)", hi: "आंतरिक अंग पाठ पीडीएफ" },
                type: "pdf",
                url: TN_TEXTBOOK_PORTAL_URL,
                available: true,
              },
            ],
          },
        ],
      },
      {
        id: "c4-social",
        code: "SOC-04",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: {
          en: "Kingdoms of Rivers, 5 Landscapes of Kurinji/Mullai/Marutham, Municipalities.",
          ta: "ஆற்றங்கரை அரசுகள், ஐந்திணைகள், நகராட்சிகள் மற்றும் பாதுகாப்பு விதிகள்.",
          hi: "प्राचीन साम्राज्य, पांच प्राकृतिक भूदृश्य और स्थानीय प्रशासन।",
        },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c4-soc-ch1",
            chapterNumber: 1,
            title: { en: "Kingdoms of Rivers (Chera, Chola, Pandya, Pallava)", ta: "ஆற்றங்கரை அரசுகள்", hi: "नदियों के साम्राज्य" },
            summary: {
              en: "The ancient Tamil kings who built civilization along Cauvery, Vaigai, and Palar.",
              ta: "காவிரி, வைகை, பாலாறு நதிக்கரைகளில் சிறப்புற்ற சேர, சோழ, பாண்டியர், பல்லவர் வரலாறு.",
              hi: "कावेरी और वैगई नदियों के तट पर विकसित चोल, चेर और पाण्ड्य साम्राज्य।",
            },
            lessonLines: [
              "Cheras ruled along the river Poigai; their capital was Vanchi.",
              "Cholas ruled the fertile Cauvery delta; their capital was Uraiyur.",
              "Pandyas ruled Madurai on the banks of river Vaigai.",
            ],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [
              {
                id: "c4-soc-ch1-pdf",
                title: { en: "Class 4 Social Science Kingdoms PDF", ta: "ஆற்றங்கரை அரசுகள் பாடம் (PDF)", hi: "साम्राज्य पाठ पीडीएफ" },
                type: "pdf",
                url: TN_TEXTBOOK_PORTAL_URL,
                available: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 5 (Primary)
  // --------------------------------------------------------------------------
  5: {
    standard: 5,
    name: { en: "Class 5", ta: "வகுப்பு 5", hi: "कक्षा 5" },
    stage: "primary",
    subjects: [
      {
        id: "c5-tamil",
        code: "TAM-05",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Tamil literature, grammar, Bharathidasan poems, and creative prose.", ta: "பாரதிதாசன் கவிதைகள், சிறுகதைகள் மற்றும் தமிழ் இலக்கணம்.", hi: "भारतीदासन कविताएँ, कहानियाँ और तमिल व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c5-tam-ch1",
            chapterNumber: 1,
            title: { en: "Thamizhukkum Amudhendru Paer (பாரதிதாசன்)", ta: "தமிழுக்கும் அமுதென்று பேர்", hi: "तमिलुक्कुम अमुदेंदु पेर" },
            summary: { en: "Poet Bharathidasan sings the nectar and vitality of Tamil language.", ta: "பாவேந்தர் பாரதிதாசன் இயற்றிய தமிழின் அமுதச் சுவை பாடல்.", hi: "कवि भारतीदासन द्वारा रचित तमिल भाषा की अमृतमयी महिमा।" },
            lessonLines: ["தமிழுக்கும் அமுதென்று பேர்! - அந்தத்", "தமிழ் இன்பத் தமிழ் எங்கள் உயிருக்கு நேர்!"],
            lessonLang: "ta",
            estimatedMinutes: 5,
            resources: [{ id: "c5-tam-ch1-pdf", title: { en: "Class 5 Tamil Textbook PDF", ta: "வகுப்பு 5 தமிழ் பாடநூல்", hi: "कक्षा 5 तमिल पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c5-english",
        code: "ENG-05",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "Adventure stories, grammar, reading fluency, and descriptive composition.", ta: "சாகசக் கதைகள், இலக்கணம் மற்றும் உரையாடல் பயிற்சிகள்.", hi: "कहानियाँ, व्याकरण और व्यावहारिक अंग्रेज़ी।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c5-eng-ch1",
            chapterNumber: 1,
            title: { en: "Explore Space", ta: "விண்வெளிப் பயணம்", hi: "अंतरिक्ष की खोज" },
            summary: { en: "A futuristic story of living on Mars and scientific curiosity.", ta: "செவ்வாய் கிரகத்தில் மனிதக் குடியேற்றம் பற்றிய அறிவியல் கதை.", hi: "मंगल ग्रह पर जीवन और अंतरिक्ष विज्ञान की कहानी।" },
            lessonLines: ["Amuthan and Nilavan accidentally stepped into a museum spaceship."],
            lessonLang: "en",
            estimatedMinutes: 6,
            resources: [{ id: "c5-eng-ch1-pdf", title: { en: "Class 5 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1 पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c5-math",
        code: "MAT-05",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Factors, multiples, fractions, decimals, perimeter, area, and time.", ta: "காரணிகள், மடங்குகள், பின்னங்கள், பரப்பளவு மற்றும் சுற்றளவு.", hi: "गुणनखंड, गुणज, भिन्न, दशमलव और क्षेत्रफल।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c5-mat-ch1",
            chapterNumber: 1,
            title: { en: "Geometry & Angles (Acute, Right, Obtuse)", ta: "வடிவியல் மற்றும் கோணங்கள்", hi: "ज्यामिति और कोण" },
            summary: { en: "Understanding 90° right angles, acute angles, and protractor use.", ta: "செங்கோணம், குறுங்கோணம் மற்றும் விரிகோணம் பற்றிய விளக்கம்.", hi: "समकोण, न्यूनकोण और अधिककोण की पहचान।" },
            lessonLines: ["A right angle measures exactly 90 degrees.", "An acute angle is less than 90 degrees."],
            lessonLang: "en",
            estimatedMinutes: 6,
            resources: [{ id: "c5-mat-ch1-pdf", title: { en: "Class 5 Maths PDF", ta: "கணித பாடநூல் (PDF)", hi: "गणित पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c5-science",
        code: "SCI-05",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: { en: "Organ Systems, Matter and Materials, Energy and Work, Everyday Science.", ta: "உறுப்பு மண்டலங்கள், ஆற்றல் வகைகள் மற்றும் அன்றாட அறிவியல்.", hi: "अंग प्रणालियाँ, ऊर्जा, कार्य और दैनिक विज्ञान।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c5-sci-ch1",
            chapterNumber: 1,
            title: { en: "Organ Systems: Digestive & Respiratory", ta: "உறுப்பு மண்டலங்கள்: செரிமானம் & சுவாசம்", hi: "पाचन और श्वसन प्रणाली" },
            summary: { en: "How food is converted into energy and how our lungs exchange gases.", ta: "உணவு செரிமானம் மற்றும் சுவாச மண்டலத்தின் முழுமையான செயல்முறை.", hi: "भोजन का पाचन और ऑक्सीजन का संचरण।" },
            lessonLines: ["Digestive system breaks down complex food into simple nutrients.", "The stomach secretes gastric juice containing hydrochloric acid."],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c5-sci-ch1-pdf", title: { en: "Class 5 Science PDF", ta: "அறிவியல் பாடம் 1 (PDF)", hi: "विज्ञान पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c5-social",
        code: "SOC-05",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "Our Earth, Continents and Oceans, Ancient Forts, Good Citizen.", ta: "நமது பூமி, கண்டங்கள், பண்டைய கோட்டைகள் மற்றும் நல்ல குடிமகன்.", hi: "हमारी पृथ्वी, महाद्वीप, प्राचीन किले और नागरिक शास्त्र।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c5-soc-ch1",
            chapterNumber: 1,
            title: { en: "Our Earth & Continents", ta: "நமது பூமி மற்றும் கண்டங்கள்", hi: "हमारी पृथ्वी और महाद्वीप" },
            summary: { en: "The 7 continents, 5 oceans, rotation, and revolution of Earth.", ta: "ஏழு கண்டங்கள், ஐந்து பெருங்கடல்கள் மற்றும் பூமியின் சுழற்சி.", hi: "सात महाद्वीप, पाँच महासागर और पृथ्वी की गतियाँ।" },
            lessonLines: ["Asia is the largest continent in the world.", "The Pacific Ocean is the deepest and largest ocean."],
            lessonLang: "en",
            estimatedMinutes: 6,
            resources: [{ id: "c5-soc-ch1-pdf", title: { en: "Class 5 Social Science PDF", ta: "சமூக அறிவியல் (PDF)", hi: "सामाजिक विज्ञान पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 6 (Upper Primary)
  // --------------------------------------------------------------------------
  6: {
    standard: 6,
    name: { en: "Class 6", ta: "வகுப்பு 6", hi: "कक्षा 6" },
    stage: "middle",
    subjects: [
      {
        id: "c6-tamil",
        code: "TAM-06",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Inbathamizh, Siragindri Parappom, Mozhi Arivu, and Ancient Sangam poets.", ta: "இன்பத்தமிழ், அறிவியல் ஆத்திசூடி, மொழி இலக்கணம்.", hi: "इन्बतमिल, विज्ञान काव्य और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c6-tam-ch1",
            chapterNumber: 1,
            title: { en: "Inba Thamizh (இன்பத்தமிழ்)", ta: "இன்பத்தமிழ்", hi: "इन्ब तमिल" },
            summary: { en: "Bharathidasan's famous ode comparing Tamil to nectar, milk, honey, and sword.", ta: "தமிழைப் பாலென, அமுதென, வாளெனப் புகழும் பாவேந்தர் பாடல்.", hi: "तमिल को अमृत, दूध और तलवार के समान बताने वाली अमर कविता।" },
            lessonLines: [
              "தமிழுக்கும் அமுதென்று பேர் - அந்தத்",
              "தமிழ் இன்பத் தமிழ் எங்கள் உயிருக்கு நேர்!",
              "தமிழுக்கு நிலவென்று பேர் - இன்பத்",
              "தமிழ் எங்கள் சமுகத்தின் விளைவுக்கு நீர்!",
            ],
            lessonLang: "ta",
            estimatedMinutes: 6,
            resources: [
              { id: "c6-tam-ch1-pdf", title: { en: "Class 6 Tamil Textbook Term 1 PDF", ta: "வகுப்பு 6 தமிழ் பாடநூல் (PDF)", hi: "कक्षा 6 तमिल पाठ्यपुस्तक" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true },
            ],
          },
          {
            id: "c6-tam-ch2",
            chapterNumber: 2,
            title: { en: "Silappathikaram (சிலப்பதிகாரம் - இளங்கோவடிகள்)", ta: "சிலப்பதிகாரம்", hi: "शिलप्पादिकारम" },
            summary: { en: "Ilango Adigal opens the epic by worshipping Sun, Moon, and Rain.", ta: "திங்களைப் போற்றுதும், ஞாயிறு போற்றுதும் என இயற்கையை வாழ்த்தும் காப்பியம்.", hi: "सूर्य, चंद्रमा और वर्षा की स्तुति से शुरू होने वाला महाकाव्य।" },
            lessonLines: ["திங்களைப் போற்றுதும் திங்களைப் போற்றுதும்!", "ஞாயிறு போற்றுதும் ஞாயிறு போற்றுதும்!"],
            lessonLang: "ta",
            estimatedMinutes: 6,
            resources: [{ id: "c6-tam-ch2-pdf", title: { en: "Silappathikaram Chapter PDF", ta: "சிலப்பதிகாரம் பாடம் (PDF)", hi: "शिलप्पादिकारम पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c6-english",
        code: "ENG-06",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "Sea Turtles, When the Trees Walked, The Crocodile poem, and Grammar.", ta: "கடலாமைகள், மரங்கள் நடந்தபோது, ஆங்கில இலக்கணம்.", hi: "समुद्री कछुए, पर्यावरण और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c6-eng-ch1",
            chapterNumber: 1,
            title: { en: "Sea Turtles (Marine Conservation)", ta: "கடல் ஆமைகள்", hi: "समुद्री कछुए" },
            summary: { en: "The wondrous life cycle and nesting migration of Olive Ridley turtles in Tamil Nadu coast.", ta: "ஆலிவ் ரிட்லி ஆமைகள் தமிழகக் கடற்கரையில் முட்டையிடும் விந்தை வாழ்க்கை.", hi: "ओलिव रिडले कछुओं का प्रवास और संरक्षण।" },
            lessonLines: [
              "Most turtles spend their entire lives in the open ocean.",
              "Olive Ridley turtles come ashore at night to lay their eggs in sand cavities.",
            ],
            lessonLang: "en",
            estimatedMinutes: 6,
            resources: [{ id: "c6-eng-ch1-pdf", title: { en: "Class 6 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1 पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c6-math",
        code: "MAT-06",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Numbers, Introduction to Algebra, Ratio and Proportion, Geometry, Statistics.", ta: "எண்கள், இயற்கணித அறிமுகம், விகிதம் மற்றும் விகிதசமம், புள்ளியியல்.", hi: "संख्याएँ, बीजगणित, अनुपात, समानुपात और सांख्यिकी।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c6-mat-ch1",
            chapterNumber: 1,
            title: { en: "Numbers: Indian & International System", ta: "எண்கள் மற்றும் இடமதிப்பு", hi: "संख्या प्रणाली और स्थानीय मान" },
            summary: { en: "Large numbers up to Crores, place value charts, and rounding off.", ta: "கோடி வரையிலான எண்களின் இடமதிப்பு மற்றும் ஒப்பீடு.", hi: "करोड़ तक बड़ी संख्याएँ, स्थानीय मान और सन्निकटन।" },
            lessonLines: ["In the Indian system: Ones, Thousands, Lakhs, Crores.", "In the International system: Thousands, Millions, Billions."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c6-mat-ch1-pdf", title: { en: "Class 6 Maths Chapter 1 PDF", ta: "கணிதம் பாடம் 1 (PDF)", hi: "गणित पाठ 1 पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c6-science",
        code: "SCI-06",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: { en: "Measurements, Force and Motion, Matter Around Us, Living World of Plants & Animals.", ta: "அளவீட்டியல், விசையும் இயக்கமும், பருப்பொருட்கள், தாவர உலகம்.", hi: "मापन, बल और गति, सजीव जगत और कोशिका।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c6-sci-ch1",
            chapterNumber: 1,
            title: { en: "Measurements & SI Units", ta: "அளவீட்டியல் மற்றும் SI அலகுகள்", hi: "मापन और SI मात्रक" },
            summary: { en: "Standard units of length (metre), mass (kilogram), and time (second).", ta: "நீளம், நிறை, காலத்தின் பன்னாட்டு SI அலகுகள்.", hi: "लंबाई, द्रव्यमान और समय के मानक मात्रक।" },
            lessonLines: [
              "Length is the distance between two points. The SI unit of length is metre (m).",
              "Mass is the quantity of matter in an object. Its SI unit is kilogram (kg).",
            ],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c6-sci-ch1-pdf", title: { en: "Class 6 Science Chapter 1 PDF", ta: "அறிவியல் பாடம் 1 (PDF)", hi: "विज्ञान पाठ 1 पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c6-social",
        code: "SOC-06",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "What is History?, Indus Civilisation, Ancient Cities of Tamilagam, The Solar System.", ta: "வரலாறு என்றால் என்ன?, சிந்து சமவெளி நாகரிகம், பண்டைய தமிழக நகரங்கள்.", hi: "इतिहास, सिंधु घाटी सभ्यता, प्राचीन तमिल शहर और सौरमंडल।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c6-soc-ch1",
            chapterNumber: 1,
            title: { en: "Indus Civilisation (Harappa & Mohenjo-Daro)", ta: "சிந்து வெளி நாகரிகம்", hi: "सिंधु घाटी सभ्यता" },
            summary: { en: "Grid town planning, the Great Bath, granaries, and bronze artefacts.", ta: "திட்டமிட்ட நகர அமைப்பு, பெருங்குளம் மற்றும் தானியக் களஞ்சியம்.", hi: "नगर योजना, विशाल स्नानागार और हड़प्पा संस्कृति।" },
            lessonLines: [
              "Harappa was discovered in 1921. It was an advanced Bronze Age civilization.",
              "Streets were laid in a grid pattern intersecting at right angles.",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c6-soc-ch1-pdf", title: { en: "Class 6 Social Science Chapter 1 PDF", ta: "வரலாறு பாடம் 1 (PDF)", hi: "इतिहास पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 7 (Upper Primary)
  // --------------------------------------------------------------------------
  7: {
    standard: 7,
    name: { en: "Class 7", ta: "வகுப்பு 7", hi: "कक्षा 7" },
    stage: "middle",
    subjects: [
      {
        id: "c7-tamil",
        code: "TAM-07",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Engal Thamizh (Namakkal Kavignar), Kaadu, Thirukkural, and Grammar.", ta: "எங்கள் தமிழ், காடு, நால்வகைச் சொற்கள்.", hi: "तमिल भाषा, प्रकृति और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c7-tam-ch1",
            chapterNumber: 1,
            title: { en: "Engal Thamizh (எங்கள் தமிழ் - நாமக்கல் கவிஞர்)", ta: "எங்கள் தமிழ்", hi: "एंगल तमिल" },
            summary: { en: "Namakkal Kavignar Ramalingam Pillai on non-violence and love in Tamil.", ta: "அருள்நெறி அறிவைத் தரலாகும் - அதுவே தமிழன் குரலாகும் பாடல்.", hi: "अहिंसा और प्रेम का संदेश देने वाली नामक्कल कवि की रचना।" },
            lessonLines: ["அருள்நெறி அறிவைத் தரலாகும் - அதுவே", "தமிழன் குரலாகும்!"],
            lessonLang: "ta",
            estimatedMinutes: 5,
            resources: [{ id: "c7-tam-ch1-pdf", title: { en: "Class 7 Tamil Textbook PDF", ta: "வகுப்பு 7 தமிழ் பாடநூல்", hi: "कक्षा 7 तमिल" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c7-english",
        code: "ENG-07",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "Eidgah (Premchand), The Wind on Haunted Hill, and Grammar.", ta: "ஈத்கா சிறுகதை, ஆங்கில இலக்கியம் மற்றும் இலக்கணம்.", hi: "प्रेमचंद की ईदगाह और अंग्रेज़ी साहित्य।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c7-eng-ch1",
            chapterNumber: 1,
            title: { en: "Eidgah (Story by Premchand)", ta: "ஈத்கா (பிரேம்சந்த்)", hi: "ईदगाह (प्रेमचंद)" },
            summary: { en: "Young Hamid sacrifices sweets to buy a pair of tongs for his grandmother.", ta: "தன் பாட்டியின் கை சுடாமல் இருக்க இடுக்கி வாங்கும் அமித்தின் பாசக் கதை.", hi: "अपनी दादी के लिए चिमटा खरीदने वाले बालक हामिद की भावुक कहानी।" },
            lessonLines: ["Hamid had only three paise. His friends bought clay toys."],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c7-eng-ch1-pdf", title: { en: "Class 7 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c7-math",
        code: "MAT-07",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Number System, Integers, Algebra, Measurements, Direct and Inverse Proportion.", ta: "முழுக்கள், இயற்கணிதம், நேர் மற்றும் எதிர் விகிதங்கள்.", hi: "पूर्णांक, बीजगणित, क्षेत्रफल और अनुपात।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c7-mat-ch1",
            chapterNumber: 1,
            title: { en: "Integers & Number Line Operations", ta: "முழுக்கள் மற்றும் எண் கோடு", hi: "पूर्णांक और संख्या रेखा" },
            summary: { en: "Addition, subtraction, multiplication, and division of positive and negative integers.", ta: "மிகை மற்றும் குறை எண்களின் நான்கு அடிப்படைக் கணிதச் செயல்பாடுகள்.", hi: "धनात्मक और ऋणात्मक पूर्णांकों के नियम।" },
            lessonLines: ["The product of two negative integers is always positive."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c7-mat-ch1-pdf", title: { en: "Class 7 Maths Chapter 1 PDF", ta: "கணிதம் பாடம் 1 (PDF)", hi: "गणित पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c7-science",
        code: "SCI-07",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: { en: "Measurement and Area, Force and Motion, Matter and Chemical Changes.", ta: "அளவீட்டியல், இயக்கவியல் மற்றும் வேதியியல் மாற்றங்கள்.", hi: "मापन, गति, प्रकाश और रासायनिक परिवर्तन।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c7-sci-ch1",
            chapterNumber: 1,
            title: { en: "Measurement: Volume, Density & Speed", ta: "அளவீட்டியல்: கனஅளவு மற்றும் அடர்த்தி", hi: "मापन: आयतन और घनत्व" },
            summary: { en: "Density = Mass / Volume. Determining volume of irregular objects.", ta: "பொருட்களின் அடர்த்தி மற்றும் சீரற்ற பொருட்களின் கனஅளவு காணுதல்.", hi: "घनत्व, आयतन और गति का वैज्ञानिक अध्ययन।" },
            lessonLines: ["Density is defined as mass per unit volume of a substance."],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c7-sci-ch1-pdf", title: { en: "Class 7 Science Chapter 1 PDF", ta: "அறிவியல் பாடம் 1 (PDF)", hi: "विज्ञान पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c7-social",
        code: "SOC-07",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "Medieval India, Emergence of New Kingdoms, Delhi Sultanate, Interior of Earth.", ta: "இடைக்கால இந்தியா, தில்லி சுல்தான்கள், புவியின் உள் அமைப்பு.", hi: "मध्यकालीन भारत, दिल्ली सल्तनत और नागरिक शास्त्र।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c7-soc-ch1",
            chapterNumber: 1,
            title: { en: "Sources of Medieval India & Inscriptions", ta: "இடைக்கால இந்திய வரலாற்று ஆதாரங்கள்", hi: "मध्यकालीन भारत के ऐतिहासिक स्रोत" },
            summary: { en: "Epigraphy, copper plates, monuments, and foreign travelers' accounts.", ta: "கல்வெட்டுகள், செப்பேடுகள், நினைவுச் சின்னங்கள் மற்றும் பயணக் குறிப்புகள்.", hi: "शिलालेख, ताम्रपत्र और विदेशी यात्रियों के विवरण।" },
            lessonLines: ["Inscriptions are inscriptions engraved on stone, copper plates, and temple walls."],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c7-soc-ch1-pdf", title: { en: "Class 7 Social Science Chapter 1 PDF", ta: "வரலாறு பாடம் 1 (PDF)", hi: "इतिहास पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 8 (Upper Primary)
  // --------------------------------------------------------------------------
  8: {
    standard: 8,
    name: { en: "Class 8", ta: "வகுப்பு 8", hi: "कक्षा 8" },
    stage: "middle",
    subjects: [
      {
        id: "c8-tamil",
        code: "TAM-08",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Thamizh Mozhi Vaazhthu, Odai, Kaalamudan Varuvaan, and Grammar.", ta: "தமிழ்மொழி வாழ்த்து (பாரதியார்), ஓடை, வேற்றுமை இலக்கணம்.", hi: "तमिल काव्य, प्रकृति और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c8-tam-ch1",
            chapterNumber: 1,
            title: { en: "Thamizh Mozhi Vaazhthu (பாரதியார்)", ta: "தமிழ்மொழி வாழ்த்து", hi: "तमिल मोझी वाल्थु" },
            summary: { en: "Mahakavi Bharathiyar's timeless anthem to the eternity of Tamil.", ta: "வாழ்க நிரந்தரம் வாழ்க தமிழ்மொழி வாழிய வாழியவே!", hi: "महाकवि भारतियार द्वारा रचित तमिल स्तुति गान।" },
            lessonLines: [
              "வாழ்க நிரந்தரம் வாழ்க தமிழ்மொழி",
              "வாழிய வாழியவே!",
              "வானம் அளந்தது அனைத்தும் அளந்திடும்",
              "வண்மொழி வாழியவே!",
            ],
            lessonLang: "ta",
            estimatedMinutes: 6,
            resources: [{ id: "c8-tam-ch1-pdf", title: { en: "Class 8 Tamil Textbook PDF", ta: "வகுப்பு 8 தமிழ் பாடநூல் (PDF)", hi: "कक्षा 8 तमिल" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c8-english",
        code: "ENG-08",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "The Nose-Jewel, Hobby Turns into a Successful Career, Grammar and Idioms.", ta: "ஆங்கில உரைநடை, செய்யுள், மரபுத்தொடர்கள் மற்றும் இலக்கணம்.", hi: "अंग्रेज़ी साहित्य, मुहावरे और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c8-eng-ch1",
            chapterNumber: 1,
            title: { en: "The Nose-Jewel (C. Rajagopalachari)", ta: "மூக்குத்தி கதை (ராஜாஜி)", hi: "नथुनी (सी. राजगोपालाचारी)" },
            summary: { en: "Two sparrows observe human greed and fear over a dropped diamond nose-stud.", ta: "வைர மூக்குத்தியால் ஏற்படும் பேராசையும் அச்சமும் பற்றிய ராஜாஜியின் கதை.", hi: "मानव लालच और भय पर राजगोपालाचारी की प्रसिद्ध कहानी।" },
            lessonLines: ["Ramayya was a simple man living in the town."],
            lessonLang: "en",
            estimatedMinutes: 6,
            resources: [{ id: "c8-eng-ch1-pdf", title: { en: "Class 8 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c8-math",
        code: "MAT-08",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Rational Numbers, Linear Equations, Life Mathematics (Profit/Loss, SI/CI), Geometry.", ta: "விகிதமுறு எண்கள், எளிய சமன்பாடுகள், வாழ்வியல் கணிதம்.", hi: "परिमेय संख्याएँ, रैखिक समीकरण और चक्रवृद्धि ब्याज।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c8-mat-ch1",
            chapterNumber: 1,
            title: { en: "Rational Numbers & Number Operations", ta: "விகிதமுறு எண்கள்", hi: "परिमेय संख्याएँ" },
            summary: { en: "Numbers of form p/q (q != 0), additive/multiplicative inverse, density property.", ta: "விகிதமுறு எண்களின் கூட்டல், கழித்தல், பெருக்கல் மற்றும் பண்புகள்.", hi: "परिमेय संख्याओं के गुणधर्म और संक्रियाएँ।" },
            lessonLines: ["A rational number is any number that can be expressed as p/q where q is not zero."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c8-mat-ch1-pdf", title: { en: "Class 8 Maths Chapter 1 PDF", ta: "கணிதம் பாடம் 1 (PDF)", hi: "गणित पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c8-science",
        code: "SCI-08",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: { en: "Measurement, Forces and Pressure, Light, Matter, Microorganisms, Plant Kingdom.", ta: "அழுத்தம், ஒளிவிலகல், பருப்பொருட்கள், நுண்ணுயிரிகள்.", hi: "दाब, प्रकाश, सूक्ष्मजीव और पादप जगत।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c8-sci-ch1",
            chapterNumber: 1,
            title: { en: "Forces, Thrust & Atmospheric Pressure", ta: "விசை மற்றும் அழுத்தம்", hi: "बल और दाब" },
            summary: { en: "Pressure = Force / Area. Pascal's Law, Barometer, and hydraulic machines.", ta: "அழுத்தத்தின் SI அலகு பாஸ்கல் (Pa), பாஸ்கல் விதி மற்றும் பயன்பாடுகள்.", hi: "दाब का सूत्र, पास्कल का नियम और वायुमंडलीय दाब।" },
            lessonLines: [
              "Thrust acting per unit area is called pressure.",
              "The SI unit of pressure is Pascal (N/m²), named after Blaise Pascal.",
            ],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c8-sci-ch1-pdf", title: { en: "Class 8 Science Chapter 1 PDF", ta: "அறிவியல் பாடம் 1 (PDF)", hi: "विज्ञान पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c8-social",
        code: "SOC-08",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "Advent of Europeans, From Trade to Territory, Rocks and Soils, Understanding Secularism.", ta: "ஐரோப்பியர்களின் வருகை, பாளையக்காரர் புரட்சி, மதச்சார்பின்மை.", hi: "यूरोपियों का आगमन, मिट्टी, चट्टानें और धर्मनिरपेक्षता।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c8-soc-ch1",
            chapterNumber: 1,
            title: { en: "Advent of the Europeans to India", ta: "ஐரோப்பியர்களின் வருகை", hi: "भारत में यूरोपियों का आगमन" },
            summary: { en: "Vasco da Gama's sea route in 1498, Portuguese, Dutch, British and French settlements.", ta: "1498-ல் வாஸ்கோடகாமா கடல்வழி கண்டுபிடிப்பு மற்றும் ஆங்கிலேயர் ஆதிக்கம்.", hi: "वास्को डि गामा की समुद्री यात्रा और यूरोपीय कंपनियों की स्थापना।" },
            lessonLines: ["Vasco da Gama reached Calicut in Kerala in 1498."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c8-soc-ch1-pdf", title: { en: "Class 8 Social Science Chapter 1 PDF", ta: "வரலாறு பாடம் 1 (PDF)", hi: "इतिहास पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 9 (High School)
  // --------------------------------------------------------------------------
  9: {
    standard: 9,
    name: { en: "Class 9", ta: "வகுப்பு 9", hi: "कक्षा 9" },
    stage: "secondary",
    subjects: [
      {
        id: "c9-tamil",
        code: "TAM-09",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Dravidian Languages, Pattamarathukku, E-Tamil & Computer Terminology, Grammar.", ta: "திராவிட மொழிக்குடும்பம், பட்டமரம், கணினித் தமிழ், இலக்கணம்.", hi: "द्रविड़ भाषा परिवार, आधुनिक तमिल और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c9-tam-ch1",
            chapterNumber: 1,
            title: { en: "Dravida Mozhikudumbam (திராவிட மொழிக் குடும்பம்)", ta: "திராவிட மொழிக் குடும்பம்", hi: "द्रविड़ भाषा परिवार" },
            summary: { en: "Linguistic roots of Tamil, Telugu, Kannada, Malayalam, and ancient stone inscriptions.", ta: "திராவிட மொழிகளின் தோற்றம், மூத்த மொழியாகிய தமிழின் தனித்தன்மைகள்.", hi: "द्रविड़ भाषाओं की उत्पत्ति और प्राचीनतम भाषा के रूप में तमिल की विशेषता।" },
            lessonLines: [
              "திராவிடம் என்ற சொல்லை முதன்முதலில் குறிப்பிட்டவர் குமரிலபட்டர்.",
              "தமிழ், தெலுங்கு, கன்னடம், மலையாளம் உள்ளிட்ட மொழிகள் திராவிட மொழிக் குடும்பத்தைச் சார்ந்தவை.",
            ],
            lessonLang: "ta",
            estimatedMinutes: 8,
            resources: [{ id: "c9-tam-ch1-pdf", title: { en: "Class 9 Tamil Unit 1 PDF", ta: "வகுப்பு 9 தமிழ் இயல் 1 (PDF)", hi: "कक्षा 9 तमिल पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c9-english",
        code: "ENG-09",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "Learning the Game (Sachin Tendulkar), Stopping by Woods on a Snowy Evening.", ta: "சச்சின் டெண்டுல்கர் வாழ்க்கை, ராபர்ட் ஃப்ராஸ்ட் கவிதை.", hi: "सचिन तेंदुलकर की जीवनी और रॉबर्ट फ्रॉस्ट की कविता।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c9-eng-ch1",
            chapterNumber: 1,
            title: { en: "Learning the Game (Sachin Tendulkar)", ta: "விளையாட்டைக் கற்றல் (சச்சின்)", hi: "खेल सीखना (सचिन तेंदुलकर)" },
            summary: { en: "Sachin's early cricket training under Coach Ramakant Achrekar at Shivaji Park.", ta: "சிவாஜி பார்க்கில் பயிற்சியாளர் அச்ரேக்கரிடம் சச்சின் பெற்ற தீவிரப் பயிற்சி.", hi: "कोच आचरेकर के मार्गदर्शन में सचिन तेंदुलकर का प्रारंभिक अभ्यास।" },
            lessonLines: [
              "From a very early age, I played tennis-ball cricket with my colony friends.",
              "Achrekar Sir would put a one-rupee coin on top of the stumps for the bowler who dismissed me.",
            ],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c9-eng-ch1-pdf", title: { en: "Class 9 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c9-math",
        code: "MAT-09",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Set Language, Real Numbers, Algebra & Polynomials, Coordinate Geometry, Trigonometry.", ta: "கண மொழி, மெய்யெண்கள், இயற்கணிதம், ஆயத்தொலை வடிவியல்.", hi: "समुच्चय, वास्तविक संख्याएँ, बहुपद और निर्देशांक ज्यामिति।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c9-mat-ch1",
            chapterNumber: 1,
            title: { en: "Set Language & Venn Diagrams", ta: "கண மொழி மற்றும் வென் படங்கள்", hi: "समुच्चय और वेन आरेख" },
            summary: { en: "Union, intersection, complement of sets, De Morgan's laws, and problem solving.", ta: "கணங்களின் சேர்ப்பு, வெட்டு, நிரப்பு மற்றும் டி மார்கனின் விதிகள்.", hi: "समुच्चय संक्रियाएँ और डि मॉर्गन के नियम।" },
            lessonLines: [
              "A set is a well-defined collection of objects.",
              "De Morgan's Law for Set Union: (A ∪ B)' = A' ∩ B'.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c9-mat-ch1-pdf", title: { en: "Class 9 Maths Chapter 1 PDF", ta: "கணிதம் அத்தியாயம் 1 (PDF)", hi: "गणित पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c9-science",
        code: "SCI-09",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: { en: "Motion, Light, Atomic Structure, Periodic Classification, Cell Biology.", ta: "இயக்கம், ஒளி, அணு அமைப்பு, தனிம வரிசை அட்டவணை, செல் உயிரியல்.", hi: "गति, परमाणु संरचना, आवर्त सारणी और कोशिका।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c9-sci-ch1",
            chapterNumber: 1,
            title: { en: "Motion & Equations of Motion (v = u + at)", ta: "இயக்கவியல் மற்றும் இயக்கச் சமன்பாடுகள்", hi: "गति और गति के समीकरण" },
            summary: { en: "Distance, displacement, velocity, acceleration, and Newton's equations.", ta: "திசைவேகம், முடுக்கம் மற்றும் சீரான வட்ட இயக்கம்.", hi: "वेग, त्वरण और गति के तीन मूलभूत समीकरण।" },
            lessonLines: [
              "Velocity is the rate of change of displacement: v = s / t.",
              "First equation of motion: v = u + at.",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c9-sci-ch1-pdf", title: { en: "Class 9 Science Chapter 1 PDF", ta: "அறிவியல் பாடம் 1 (PDF)", hi: "विज्ञान पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c9-social",
        code: "SOC-09",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "Evolution of Humans, Early Civilisations, Lithosphere, Forms of Government.", ta: "மனிதப் பரிணாம வளர்ச்சி, நிலக்கோளம், அரசாங்க அமைப்புகள்.", hi: "मानव विकास, स्थलमंडल और शासन प्रणाली।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c9-soc-ch1",
            chapterNumber: 1,
            title: { en: "Evolution of Humans & Prehistoric Tamil Nadu", ta: "மனிதப் பரிணாமமும் பண்டைய தமிழகமும்", hi: "मानव विकास और प्रागैतिहासिक काल" },
            summary: { en: "Paleolithic tools at Athirampakkam, stone age cultures, and ancient rock art.", ta: "அதிரம்பாக்கம் பழங்கற்காலக் கருவிகள் மற்றும் வரலாற்றுக்கு முந்தைய சான்றுகள்.", hi: "अतिरामपक्कम में पाषाण कालीन उपकरण और मानव विकास।" },
            lessonLines: ["Archaeological excavations at Athirampakkam near Chennai revealed Acheulian stone tools."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c9-soc-ch1-pdf", title: { en: "Class 9 Social Science Chapter 1 PDF", ta: "சமூக அறிவியல் பாடம் 1 (PDF)", hi: "सामाजिक विज्ञान पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 10 (SSLC / Board Exam)
  // --------------------------------------------------------------------------
  10: {
    standard: 10,
    name: { en: "Class 10 (SSLC)", ta: "வகுப்பு 10 (பத்தாம் வகுப்பு)", hi: "कक्षा 10 (बोर्ड)" },
    stage: "secondary",
    subjects: [
      {
        id: "c10-tamil",
        code: "TAM-10",
        name: { en: "Tamil (தமிழ்)", ta: "தமிழ்", hi: "तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Annai Mozhiye, Kaatrey Vaa, Thirukkural (20 Kurals), Silappathikaram, Grammar.", ta: "அன்னை மொழியே, காற்றே வா (பாரதியார்), திருக்குறள், விரிவான உரைநடை.", hi: "अन्नै मोझिये, काव्य, तिरुक्कुरल और बोर्ड व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c10-tam-ch1",
            chapterNumber: 1,
            title: { en: "Annai Mozhiye (பாவலரேறு பெருஞ்சித்திரனார்)", ta: "அன்னை மொழியே", hi: "अन्नै मोझिये" },
            summary: { en: "Pavalareru Perunchithiranar praises Tamil's antiquity, literary richness, and self-esteem.", ta: "அழகார்ந்த செந்தமிழே, அன்னை மொழியே எனத் தமிழின் தொன்மையை வாழ்த்தும் பாடல்.", hi: "तमिल की प्राचीनता और साहित्यिक समृद्धि का गान।" },
            lessonLines: [
              "அன்னை மொழியே! அழகார்ந்த செந்தமிழே!",
              "முன்னைக்கும் முன்னை முகிழ்த்த நறுங்கனியே!",
              "கன்னிக் குமரிக் கடல் கொண்ட நாட்டிடையில்",
              "மன்னி அரசிருந்த மண்ணுலகப் பேரரசே!",
            ],
            lessonLang: "ta",
            estimatedMinutes: 7,
            resources: [{ id: "c10-tam-ch1-pdf", title: { en: "Class 10 Tamil Textbook Full PDF", ta: "பத்தாம் வகுப்பு தமிழ் முழுப் பாடநூல் (PDF)", hi: "कक्षा 10 तमिल पाठ्यपुस्तक" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
          {
            id: "c10-tam-ch2",
            chapterNumber: 2,
            title: { en: "Kaatrey Vaa (மகாகவி பாரதியார் - வசன கவிதை)", ta: "காற்றே வா", hi: "कात्रे वा (हवा आओ)" },
            summary: { en: "Prose-poem invoking the gentle breath of life and vital cosmic energy.", ta: "உயிர்ப்பாக விளங்கும் தென்றல் காற்றை வருமாறு அழைக்கும் பாரதியின் வசன கவிதை.", hi: "जीवनदायिनी वायु का आह्वान करती महाकवि भारतियार की कविता।" },
            lessonLines: [
              "காற்றே வா! மகரந்தத் தூளைச் சுமந்துகொண்டு,",
              "மனத்தை மயலுறுத்துகின்ற இனிய வாசனையுடன் வா!",
            ],
            lessonLang: "ta",
            estimatedMinutes: 6,
            resources: [{ id: "c10-tam-ch2-pdf", title: { en: "Kaatrey Vaa Notes PDF", ta: "காற்றே வா குறிப்பு (PDF)", hi: "कात्रे वा पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c10-english",
        code: "ENG-10",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "His First Flight (Liam O'Flaherty), Life (Henry Van Dyke poem), The Tempest.", ta: "ஹிஸ் ஃபர்ஸ்ட் ஃப்ளைட், லைஃப் கவிதை, ஷேக்ஸ்பியர் நாடகத் தழுவல்.", hi: "हिज़ फर्स्ट फ़्लाइट, हेनरी वैन डाइक की कविता और व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c10-eng-ch1",
            chapterNumber: 1,
            title: { en: "His First Flight (Liam O'Flaherty)", ta: "அவனது முதல் பறத்தல்", hi: "उसकी पहली उड़ान" },
            summary: { en: "A young seagull overcomes his terrifying fear of flight when driven by hunger.", ta: "பசியின் உந்துதலால் பறக்கும் அச்சத்தை வென்ற இளம் கடற்பறவையின் உத்வேகக் கதை.", hi: "भूख की प्रेरणा से उड़ने का भय जीतने वाले युवा सीगल की प्रेरक कहानी।" },
            lessonLines: [
              "The young seagull was alone on his ledge.",
              "He felt certain that his wings would never support him.",
              "His mother flew past him with a piece of fish; he dived at the fish!",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c10-eng-ch1-pdf", title: { en: "Class 10 English Unit 1 PDF", ta: "வகுப்பு 10 ஆங்கில பாடம் 1 (PDF)", hi: "कक्षा 10 अंग्रेज़ी पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c10-math",
        code: "MAT-10",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Relations and Functions, Numbers & Sequences (AP/GP), Algebra, Matrices, Coordinate Geometry.", ta: "உறவுகளும் சார்புகளும், எண்களும் தொடர்வரிசைகளும், அணிகள், முக்கோணவியல்.", hi: "संबंध और फलन, समांतर श्रेणी, आव्यूह और निर्देशांक ज्यामिति।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c10-mat-ch1",
            chapterNumber: 1,
            title: { en: "Relations and Functions & Cartesian Product", ta: "உறவுகளும் சார்புகளும்", hi: "संबंध और फलन" },
            summary: { en: "Cartesian product A × B, representation of relations by arrow diagram, domain, and range.", ta: "கார்ட்டீசியன் பெருக்கல், அம்புக்குறி படம் மற்றும் சார்புகளின் வகைகள்.", hi: "कार्तेशीय गुणन, संबंध और फलनों का आरेखीय निरूपण।" },
            lessonLines: [
              "If A and B are two non-empty sets, then the Cartesian product A × B is the set of all ordered pairs (a, b).",
              "A relation R from A to B is a subset of A × B.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c10-mat-ch1-pdf", title: { en: "Class 10 Maths Chapter 1 PDF", ta: "கணிதம் பாடம் 1 (PDF)", hi: "गणित पाठ 1 पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c10-science",
        code: "SCI-10",
        name: { en: "Science", ta: "அறிவியல்", hi: "विज्ञान" },
        accent: "var(--pink)",
        icon: "science",
        description: { en: "Laws of Motion, Optics, Thermal Physics, Electricity, Carbon & Its Compounds, Genetics.", ta: "நியூட்டனின் இயக்க விதிகள், ஒளியியல், மின்னியல், மரபியல்.", hi: "गति के नियम, प्रकाशिकी, विद्युत, आनुवंशिकी और कार्बनिक यौगिक।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c10-sci-ch1",
            chapterNumber: 1,
            title: { en: "Laws of Motion (Newton's 1st, 2nd, 3rd Law)", ta: "இயக்க விதிகள் (நியூட்டன் விதிகள்)", hi: "गति के नियम" },
            summary: { en: "Inertia, momentum, F = ma, principle of conservation of linear momentum, and rocket propulsion.", ta: "நிலைமம், உந்தம், விசை = நிறை × முடுக்கம் (F=ma) மற்றும் ராக்கெட் ஏவுதல் தத்துவம்.", hi: "जड़त्व, संवेग, F=ma और रॉकेट प्रणोदन का सिद्धांत।" },
            lessonLines: [
              "Newton's First Law: An object remains at rest or in uniform motion unless acted upon by an external unbalanced force.",
              "Newton's Second Law: Force is directly proportional to the rate of change of linear momentum (F = ma).",
              "Newton's Third Law: For every action, there is an equal and opposite reaction.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c10-sci-ch1-pdf", title: { en: "Class 10 Science Chapter 1 PDF", ta: "அறிவியல் அத்தியாயம் 1 (PDF)", hi: "विज्ञान पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c10-social",
        code: "SOC-10",
        name: { en: "Social Science", ta: "சமூக அறிவியல்", hi: "सामाजिक विज्ञान" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "World War I & II, Anti-Colonial Movements, Indian Constitution, Physical Geography.", ta: "உலகப் போர்கள், இந்திய விடுதலை இயக்கம், இந்திய அரசியலமைப்பு, தமிழ்நாடு புவியியல்.", hi: "विश्व युद्ध, स्वतंत्रता संग्राम, भारतीय संविधान और भूगोल।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c10-soc-ch1",
            chapterNumber: 1,
            title: { en: "Outbreak of World War I & Its Aftermath", ta: "முதல் உலகப்போரின் வெடிப்பும் அதன் விளைவுகளும்", hi: "प्रथम विश्व युद्ध और उसके परिणाम" },
            summary: { en: "Scramble for colonies, Treaty of Versailles, and League of Nations establishment.", ta: "காலனியாதிக்கப் போட்டி, வெர்செயில்ஸ் உடன்படிக்கை மற்றும் சர்வதேச சங்கம்.", hi: "साम्राज्यवादी प्रतिद्वंद्विता, वर्साय की संधि और राष्ट्र संघ।" },
            lessonLines: [
              "The assassination of Archduke Franz Ferdinand triggered World War I in 1914.",
              "The war ended with the signing of the Treaty of Versailles in 1919.",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c10-soc-ch1-pdf", title: { en: "Class 10 Social Science Chapter 1 PDF", ta: "வரலாறு பாடம் 1 (PDF)", hi: "इतिहास पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 11 (Higher Secondary)
  // --------------------------------------------------------------------------
  11: {
    standard: 11,
    name: { en: "Class 11 (+1)", ta: "வகுப்பு 11 (மேல்நிலை முதலாமாண்டு)", hi: "कक्षा 11" },
    stage: "higher_secondary",
    subjects: [
      {
        id: "c11-tamil",
        code: "TAM-11",
        name: { en: "Tamil (பொதுத்தமிழ்)", ta: "பொதுத்தமிழ்", hi: "सामान्य तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Classical Sangam poems, Modern literature, Lexicography, and Literary criticism.", ta: "சங்க இலக்கியம், நன்னூல், மொழியியல் மற்றும் தமிழ்க் கவிதைகள்.", hi: "शास्त्रीय संगम साहित्य और आधुनिक तमिल।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-tam-ch1",
            chapterNumber: 1,
            title: { en: "Yugathin Paadal (யுகத்தின் பாடல் - சு. வில்வரத்தினம்)", ta: "யுகத்தின் பாடல்", hi: "युगथिन पाडल" },
            summary: { en: "Vilvarathinam's emotional verse on the survival and renaissance of Tamil identity.", ta: "ஈழக் கவிஞர் சு. வில்வரத்தினத்தின் தமிழ்மொழி மீளுருவாக்கக் கவிதை.", hi: "तमिल भाषा के पुनर्जागरण पर कवि विलवरत्नम की कविता।" },
            lessonLines: ["என் வசமிழந்த உடலை விடுத்து", "உன் மொழியில் வாழ்கிறேன் தமிழே!"],
            lessonLang: "ta",
            estimatedMinutes: 6,
            resources: [{ id: "c11-tam-ch1-pdf", title: { en: "Class 11 Tamil Book PDF", ta: "வகுப்பு 11 பொதுத்தமிழ் (PDF)", hi: "कक्षा 11 तमिल पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-english",
        code: "ENG-11",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "The Portrait of a Lady (Khushwant Singh), Once Upon a Time (Gabriel Okara).", ta: "குஷ்வந்த் சிங் சிறுகதை, கேப்ரியல் ஒகாரா கவிதை மற்றும் கட்டுரை.", hi: "खुशवंत सिंह की कहानी और अंग्रेज़ी साहित्य।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-eng-ch1",
            chapterNumber: 1,
            title: { en: "The Portrait of a Lady (Khushwant Singh)", ta: "ஒரு மூதாட்டியின் திருவுருவப்படம்", hi: "द पोर्ट्रेट ऑफ़ अ लेडी" },
            summary: { en: "An affectionate, poignant chronicle of the author's grandmother.", ta: "தன் பாட்டியின் பக்தி, அன்பு, இறுதிப் பிரியாவிடை பற்றிய குஷ்வந்த் சிங்கின் நினைவோடை.", hi: "अपनी दादी के प्रति खुशवंत सिंह का मार्मिक संस्मरण।" },
            lessonLines: ["My grandmother, like everybody's grandmother, was an old woman."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c11-eng-ch1-pdf", title: { en: "Class 11 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-math",
        code: "MAT-11",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Sets & Functions, Basic Algebra, Trigonometry, Combinatorics, Differential Calculus.", ta: "இயற்கணிதம், முக்கோணவியல், சேர்ப்பியல், நுண்கணிதம்.", hi: "समुच्चय, बीजगणित, त्रिकोणमिति और अवकलन।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-mat-ch1",
            chapterNumber: 1,
            title: { en: "Sets, Relations and Functions", ta: "கணங்கள், தொடர்புகள் மற்றும் சார்புகள்", hi: "समुच्चय, संबंध और फलन" },
            summary: { en: "Injective, surjective, bijective functions, inverse functions, and graphing transformations.", ta: "ஒன்றுக்கொன்றான, மேற்கோர்த்தல் சார்புகள் மற்றும் நேர்மாறு சார்புகள்.", hi: "एकैकी, आच्छादक फलन और प्रतिलोम फलन।" },
            lessonLines: ["A function f: A → B is bijective if it is both one-to-one and onto."],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c11-mat-ch1-pdf", title: { en: "Class 11 Maths Vol 1 PDF", ta: "கணிதம் தொகுதி 1 (PDF)", hi: "गणित भाग 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-physics",
        code: "PHY-11",
        name: { en: "Physics", ta: "இயற்பியல்", hi: "भौतिक विज्ञान" },
        accent: "var(--pink)",
        icon: "physics",
        description: { en: "Nature of Physical World & Measurement, Kinematics, Laws of Motion, Work Energy & Power.", ta: "இயற்பியல் உலகம், இயக்கவியல், வேலை ஆற்றல் மற்றும் திறன், புவியீர்ப்பு.", hi: "मापन, गतिकी, कार्य-ऊर्जा और गुरुत्वाकर्षण।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-phy-ch1",
            chapterNumber: 1,
            title: { en: "Nature of Physical World and Measurement", ta: "இயற்பியல் உலகமும் அளவீட்டியலும்", hi: "भौतिक जगत और मापन" },
            summary: { en: "Fundamental dimensions, dimensional analysis, precision, and errors in measurement.", ta: "பரிமாண வாய்ப்பாடுகள், பரிமாணப் பகுப்பாய்வு மற்றும் பிழைகள்.", hi: "विमीय सूत्र, विमीय विश्लेषण और मापन की त्रुटियाँ।" },
            lessonLines: [
              "Physics deals with the study of nature and natural phenomena.",
              "Dimensional formula of force is [M L T⁻²].",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c11-phy-ch1-pdf", title: { en: "Class 11 Physics Vol 1 PDF", ta: "இயற்பியல் தொகுதி 1 (PDF)", hi: "भौतिकी भाग 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-chemistry",
        code: "CHE-11",
        name: { en: "Chemistry", ta: "வேதியியல்", hi: "रसायन विज्ञान" },
        accent: "var(--teal)",
        icon: "chemistry",
        description: { en: "Basic Concepts & Chemical Calculations (Mole concept), Quantum Mechanical Model of Atom.", ta: "மோல் தத்துவம், அணுவின் குவாண்டம் எந்திரவியல் மாதிரி, வேதிப் பிணைப்பு.", hi: "मोल संकल्पना, परमाणु संरचना और आवर्त वर्गीकरण।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-che-ch1",
            chapterNumber: 1,
            title: { en: "Basic Concepts of Chemistry and Chemical Calculations", ta: "வேதியியலின் அடிப்படைக் கருத்துகள்", hi: "रसायन विज्ञान की मूल अवधारणाएँ" },
            summary: { en: "Mole concept, Avogadro's number (6.022 × 10²³), stoichiometric calculations, and empirical formulas.", ta: "மோல் தத்துவம், அவகாட்ரோ எண் மற்றும் சமன்படுத்தப்பட்ட வேதிச் சமன்பாடுகள்.", hi: "मोल संकल्पना, आवोगाद्रो संख्या और रससमीकरणमिति।" },
            lessonLines: [
              "One mole contains exactly 6.02214076 × 10²³ elementary entities.",
              "Molar mass is the mass of one mole of a substance expressed in g/mol.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c11-che-ch1-pdf", title: { en: "Class 11 Chemistry Vol 1 PDF", ta: "வேதியியல் தொகுதி 1 (PDF)", hi: "रसायन भाग 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-biology",
        code: "BIO-11",
        name: { en: "Biology (Botany & Zoology)", ta: "உயிரியல் (தாவரவியல் & விலங்கியல்)", hi: "जीव विज्ञान" },
        accent: "var(--violet)",
        icon: "biology",
        description: { en: "Living World, Plant Kingdom, Animal Kingdom, Tissue Level of Organisation.", ta: "உயிரின உலகம், தாவர உலகம், விலங்குலக வகைப்பாடு.", hi: "जीव जगत, वनस्पति और प्राणी साम्राज्य।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-bio-ch1",
            chapterNumber: 1,
            title: { en: "The Living World & Taxonomy", ta: "உயிரின உலகம் மற்றும் வகைப்பாட்டியல்", hi: "जीव जगत और वर्गिकी" },
            summary: { en: "Binomial nomenclature, taxonomic hierarchy, kingdoms of life, and species concept.", ta: "இருசொல் பெயரிடும் முறை மற்றும் உயிரினங்களின் ஐந்துலக வகைப்பாடு.", hi: "द्विपद नामपद्धति और जीवों का पांच जगत वर्गीकरण।" },
            lessonLines: ["Carolus Linnaeus introduced the binomial nomenclature system."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c11-bio-ch1-pdf", title: { en: "Class 11 Biology PDF", ta: "உயிரியல் பாடநூல் (PDF)", hi: "जीव विज्ञान पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-comp-sci",
        code: "CSC-11",
        name: { en: "Computer Science", ta: "கணினி அறிவியல்", hi: "कंप्यूटर साइंस" },
        accent: "var(--teal)",
        icon: "computer",
        description: { en: "Introduction to Computers, Number Systems, Computer Organization, C++ & Python fundamentals.", ta: "கணினி அறிமுகம், எண் அமைப்புகள், பைதான்/C++ நிரலாக்கம்.", hi: "कंप्यूटर संगठन, संख्या प्रणाली और पायथन/सी++ प्रोग्रामिंग।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-csc-ch1",
            chapterNumber: 1,
            title: { en: "Introduction to Computers & Generational Evolution", ta: "கணினி அறிமுகம் மற்றும் தலைமுறைகள்", hi: "कंप्यूटर का परिचय और पीढ़ियाँ" },
            summary: { en: "From vacuum tubes to artificial intelligence, von Neumann architecture, CPU, and RAM.", ta: "வெற்றிடக் குழாய்கள் முதல் செயற்கை நுண்ணறிவு வரையிலான கணினியின் வரலாறு.", hi: "वैक्यूम ट्यूब से एआई तक कंप्यूटर का विकास और वास्तुकला।" },
            lessonLines: [
              "A computer is an electronic device that processes raw data into meaningful information.",
              "First generation computers used vacuum tubes, second used transistors, third used ICs.",
            ],
            lessonLang: "en",
            estimatedMinutes: 7,
            resources: [{ id: "c11-csc-ch1-pdf", title: { en: "Class 11 Computer Science PDF", ta: "கணினி அறிவியல் பாடநூல் (PDF)", hi: "कंप्यूटर साइंस पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-commerce",
        code: "COM-11",
        name: { en: "Commerce", ta: "வணிகவியல்", hi: "वाणिज्य" },
        accent: "var(--amber)",
        icon: "commerce",
        description: { en: "Historical Background of Commerce in Sub-continent, Sole Proprietorship, Partnership.", ta: "வணிகத்தின் தோற்றம், தனியாள் வணிகம், கூட்டாண்மை நிறுவனம்.", hi: "वाणिज्य की उत्पत्ति, एकल स्वामित्व और साझेदारी।" },
        stream: "commerce",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-com-ch1",
            chapterNumber: 1,
            title: { en: "Historical Background of Commerce in Ancient Tamilagam", ta: "பண்டைய தமிழகத்தில் வணிகத்தின் தோற்றம்", hi: "प्राचीन तमिलनाडु में व्यापार की ऐतिहासिक पृष्ठभूमि" },
            summary: { en: "Barter system, coastal trade ports (Poompuhar, Korkai), and international maritime trade.", ta: "பண்டமாற்று முறை, பூம்புகார் மற்றும் கொற்கைத் துறைமுகங்களின் கடல்வழி வணிகம்.", hi: "वस्तु विनिमय और प्राचीन तमिल बंदरगाहों का वैश्विक व्यापार।" },
            lessonLines: ["Barter system is exchanging goods for other goods without using money."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c11-com-ch1-pdf", title: { en: "Class 11 Commerce PDF", ta: "வணிகவியல் பாடம் (PDF)", hi: "वाणिज्य पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-accountancy",
        code: "ACC-11",
        name: { en: "Accountancy", ta: "கணக்குப்பதிவியல்", hi: "लेखाशास्त्र" },
        accent: "var(--pink)",
        icon: "math",
        description: { en: "Introduction to Accounting, Conceptual Framework, Books of Prime Entry, Ledger.", ta: "கணக்கியல் அறிமுகம், இரட்டைப் பதிவு முறை, பேரேடு.", hi: "लेखांकन के सिद्धांत, जर्नल और लेजर।" },
        stream: "commerce",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-acc-ch1",
            chapterNumber: 1,
            title: { en: "Introduction to Accounting & Double Entry System", ta: "கணக்கியல் அறிமுகம் மற்றும் இரட்டைப் பதிவு முறை", hi: "दोहरी प्रविष्टि प्रणाली और लेखांकन" },
            summary: { en: "Luca Pacioli's double-entry bookkeeping, debit and credit rules, golden rules of accounting.", ta: "லூகா பாசியோலியின் இரட்டைப் பதிவு கணக்கியலின் பொன் விதிகள்.", hi: "डेबिट और क्रेडिट के स्वर्ण नियम और व्यावसायिक लेनदेन।" },
            lessonLines: [
              "Every transaction has two aspects: Debit the receiver, Credit the giver.",
              "Golden rules: Real, Personal, and Nominal account principles.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c11-acc-ch1-pdf", title: { en: "Class 11 Accountancy PDF", ta: "கணக்குப்பதிவியல் (PDF)", hi: "लेखाशास्त्र पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c11-economics",
        code: "ECO-11",
        name: { en: "Economics", ta: "பொருளியல்", hi: "अर्थशास्त्र" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "Introduction to Microeconomics, Consumption Analysis, Production Analysis, Indian Economy.", ta: "நுண்ணினப் பொருளியல், நுகர்வுப் பகுப்பாய்வு, இந்தியப் பொருளாதாரம்.", hi: "व्यष्टि अर्थशास्त्र, उपभोग और भारतीय अर्थव्यवस्था।" },
        stream: "commerce",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c11-eco-ch1",
            chapterNumber: 1,
            title: { en: "Introduction to Microeconomics & Scarcity", ta: "நுண்ணினப் பொருளியல் அறிமுகம்", hi: "व्यष्टि अर्थशास्त्र की मूल अवधारणाएँ" },
            summary: { en: "Wealth definition (Adam Smith), Welfare (Marshall), and Scarcity definition (Lionel Robbins).", ta: "ஆடம் ஸ்மித், மார்ஷல் மற்றும் லயனல் ராபின்ஸின் பொருளியல் வரைவிலக்கணங்கள்.", hi: "एडम स्मिथ और मार्शल के अनुसार अर्थशास्त्र की परिभाषा।" },
            lessonLines: ["Adam Smith is regarded as the Father of Modern Economics."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c11-eco-ch1-pdf", title: { en: "Class 11 Economics PDF", ta: "பொருளியல் பாடம் (PDF)", hi: "अर्थशास्त्र पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // CLASS 12 (Higher Secondary Final / +2)
  // --------------------------------------------------------------------------
  12: {
    standard: 12,
    name: { en: "Class 12 (+2)", ta: "வகுப்பு 12 (மேல்நிலை இரண்டாமாண்டு)", hi: "कक्षा 12 (बोर्ड)" },
    stage: "higher_secondary",
    subjects: [
      {
        id: "c12-tamil",
        code: "TAM-12",
        name: { en: "Tamil (பொதுத்தமிழ்)", ta: "பொதுத்தமிழ்", hi: "सामान्य तमिल" },
        accent: "var(--violet)",
        icon: "tamil",
        description: { en: "Ilangai Thamizh, Thandialankaram, Kambaramayanam, Grammar and Translation.", ta: "இளந்தமிழே (சிற்பி பாலசுப்பிரமணியம்), கம்பராமாயணம், திருக்குறள்.", hi: "इळंतमिळे, कंबरामायण और शास्त्रीय तमिल व्याकरण।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-tam-ch1",
            chapterNumber: 1,
            title: { en: "Ilanthamizhe (இளந்தமிழே - சிற்பி பாலசுப்பிரமணியம்)", ta: "இளந்தமிழே", hi: "इळंतमिळे" },
            summary: { en: "Celebrated poet Sirpi calls for the glorious re-emergence of Tamil poetic genius.", ta: "செம்பரிதி மலைமேட்டில் தலையைச் சாய்ப்பான் - செந்தமிழே உனை வாழ்த்தும் சிற்பியின் கவிதை.", hi: "कवि शिल्पी द्वारा तमिल भाषा के नवजागरण का आह्वान।" },
            lessonLines: [
              "செம்பரிதி மலைமேட்டில் தலையைச் சாய்ப்பான்;",
              "செந்நிறத்துப் பூக்காடாம் வானமெல்லாம்!",
              "தம் கைகள் அசைத்தபடி செந்தமிழே உன்னைத்",
              "தாமரைப்போல் மலரவைக்க வந்தோம் நாமே!",
            ],
            lessonLang: "ta",
            estimatedMinutes: 7,
            resources: [{ id: "c12-tam-ch1-pdf", title: { en: "Class 12 Tamil Full Textbook PDF", ta: "வகுப்பு 12 பொதுத்தமிழ் முழு நூல் (PDF)", hi: "कक्षा 12 तमिल पाठ्यपुस्तक" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-english",
        code: "ENG-12",
        name: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
        accent: "var(--teal)",
        icon: "english",
        description: { en: "Two Gentlemen of Verona (A.J. Cronin), The Castle poem, In Celebration of Being Alive.", ta: "ஏ.ஜே. குரோனின் உரைநடை, ஆங்கில இலக்கியக் கட்டுரைகள்.", hi: "ए.जे. क्रोनिन की रचनाएँ और अंग्रेज़ी निबंध।" },
        stream: "general",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-eng-ch1",
            chapterNumber: 1,
            title: { en: "Two Gentlemen of Verona (A.J. Cronin)", ta: "வெரோனாவின் இரு பண்பாளர்கள்", hi: "टू जेंटलमैन ऑफ़ वेरोना" },
            summary: { en: "Nicola and Jacopo show heroic courage, selfless sacrifice, and quiet dignity for their sick sister.", ta: "நோயுற்ற சகோதரிக்காக அயராது உழைக்கும் நிகோலா, ஜாகோபோ சிறுவர்களின் உன்னதக் கதை.", hi: "अपनी बीमार बहन के लिए अदम्य साहस और त्याग दिखाने वाले दो भाइयों की कहानी।" },
            lessonLines: [
              "We were driving through the foothills of the Alps when two young boys stopped our car.",
              "They were selling wild strawberries, shining shoes, and running errands.",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c12-eng-ch1-pdf", title: { en: "Class 12 English Unit 1 PDF", ta: "ஆங்கில பாடம் 1 (PDF)", hi: "अंग्रेज़ी पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-math",
        code: "MAT-12",
        name: { en: "Mathematics", ta: "கணிதம்", hi: "गणित" },
        accent: "var(--amber)",
        icon: "math",
        description: { en: "Applications of Matrices & Determinants, Complex Numbers, Analytical Geometry, Calculus.", ta: "அணிகள், கலப்பு எண்கள், பகுமுறை வடிவியல், தொகையீட்டு நுண்கணிதம்.", hi: "आव्यूह, सम्मिश्र संख्याएँ, समाकलन और अवकल समीकरण।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-mat-ch1",
            chapterNumber: 1,
            title: { en: "Applications of Matrices and Determinants", ta: "அணிகள் மற்றும் அணிக்கோவைகளின் பயன்பாடுகள்", hi: "आव्यूह और सारणिक के अनुप्रयोग" },
            summary: { en: "Inverse of non-singular matrix, rank of matrix, Cramer's rule, and Gaussian elimination.", ta: "நேர்மாறு அணி, அணியின் தரம், கிராமரின் விதி மற்றும் காசியன் நீக்கல் முறை.", hi: "व्युत्क्रम आव्यूह, आव्यूह की कोटि और क्रेमर का नियम।" },
            lessonLines: [
              "A square matrix A is invertible if and only if |A| ≠ 0.",
              "The inverse is given by A⁻¹ = (1 / |A|) adj(A).",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c12-mat-ch1-pdf", title: { en: "Class 12 Maths Vol 1 PDF", ta: "கணிதம் தொகுதி 1 (PDF)", hi: "गणित भाग 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-physics",
        code: "PHY-12",
        name: { en: "Physics", ta: "இயற்பியல்", hi: "भौतिक विज्ञान" },
        accent: "var(--pink)",
        icon: "physics",
        description: { en: "Electrostatics, Current Electricity, Magnetism & Magnetic Effects of Electric Current, Optics.", ta: "நிலைமின்னியல், மின்னோட்டவியல், மின்காந்தவியல், அணு மற்றும் அணுக்கரு இயற்பியல்.", hi: "स्थिरवैद्युतिकी, धारा विद्युत, चुंबकत्व और आधुनिक भौतिकी।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-phy-ch1",
            chapterNumber: 1,
            title: { en: "Electrostatics & Coulomb's Law", ta: "நிலைமின்னியல் மற்றும் கூலும் விதி", hi: "स्थिरवैद्युतिकी और कूलॉम का नियम" },
            summary: { en: "Electric charges, Coulomb's inverse square law, electric field, dipole, and Gauss's law.", ta: "மின்னூட்டங்கள், கூலும் விதி, மின்புலம், மின் இருமுனை மற்றும் காஸ் விதி.", hi: "विद्युत आवेश, कूलॉम का नियम, विद्युत क्षेत्र और गाउस का नियम।" },
            lessonLines: [
              "Coulomb's Law states that electrostatic force is directly proportional to product of charges.",
              "F = (1 / 4πε₀) · (q₁q₂ / r²).",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c12-phy-ch1-pdf", title: { en: "Class 12 Physics Vol 1 PDF", ta: "இயற்பியல் தொகுதி 1 (PDF)", hi: "भौतिकी भाग 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-chemistry",
        code: "CHE-12",
        name: { en: "Chemistry", ta: "வேதியியல்", hi: "रसायन विज्ञान" },
        accent: "var(--teal)",
        icon: "chemistry",
        description: { en: "Metallurgy, p-Block Elements, Coordination Chemistry, Solid State, Chemical Kinetics.", ta: "உலோகவியல், அணைவு வேதியியல், திட நிலைமை, வேதி வினைவேகவியல்.", hi: "धातुकर्म, उपसहसंयोजन यौगिक, ठोस अवस्था और रासायनिक बलगतिकी।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-che-ch1",
            chapterNumber: 1,
            title: { en: "Metallurgy: Extraction of Metals", ta: "உலோகவியல்: தாதுக்களிலிருந்து உலோகம் பிரித்தல்", hi: "धातुकर्म: धातुओं का निष्कर्षण" },
            summary: { en: "Concentration of ores, froth flotation, Ellingham diagram, and Hall-Héroult electrolytic process.", ta: "நுரை மிதப்பு முறை, எலிங்கம் வரைபடம் மற்றும் மின்னாற்பகுப்பு முறைகள்.", hi: "झाग प्लवन विधि, एलिंघम आरेख और धातुओं का शोधन।" },
            lessonLines: [
              "Sulfide ores are commonly concentrated by the froth flotation process.",
              "Ellingham diagrams predict thermodynamic feasibility of metal extraction.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c12-che-ch1-pdf", title: { en: "Class 12 Chemistry Vol 1 PDF", ta: "வேதியியல் தொகுதி 1 (PDF)", hi: "रसायन भाग 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-biology",
        code: "BIO-12",
        name: { en: "Biology", ta: "உயிரியல்", hi: "जीव विज्ञान" },
        accent: "var(--violet)",
        icon: "biology",
        description: { en: "Reproduction in Organisms, Genetics & Evolution, Biotechnology, Human Health.", ta: "இனப்பெருக்க மண்டலம், மரபியல், மூலக்கூறு மரபியல், உயிரித் தொழில்நுட்பவியல்.", hi: "जनन, आनुवंशिकी, जैव प्रौद्योगिकी और मानव कल्याण।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-bio-ch1",
            chapterNumber: 1,
            title: { en: "Reproduction in Organisms & Human Reproduction", ta: "உயிரினங்களில் இனப்பெருக்கம்", hi: "जीवों में जनन और मानव जनन तंत्र" },
            summary: { en: "Gametogenesis, fertilization, embryonic development, and reproductive health.", ta: "விந்து மற்றும் அண்ட செல் உருவாக்கம், கருவுறுதல் மற்றும் கருவளர்ச்சி.", hi: "युग्मकजनन, निषेचन और भ्रूणीय विकास के चरण।" },
            lessonLines: ["Gametogenesis is the process of formation of gametes in gonads."],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c12-bio-ch1-pdf", title: { en: "Class 12 Biology PDF", ta: "உயிரியல் பாடநூல் (PDF)", hi: "जीव विज्ञान पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-comp-sci",
        code: "CSC-12",
        name: { en: "Computer Science", ta: "கணினி அறிவியல்", hi: "कंप्यूटर साइंस" },
        accent: "var(--teal)",
        icon: "computer",
        description: { en: "Python Variables & Operators, Control Structures, Functions, Object-Oriented Programming, SQL.", ta: "பைதான் நிரலாக்கம், கட்டுப்பாட்டு அமைப்புகள், SQL தரவுத்தளம்.", hi: "पायथन प्रोग्रामिंग, ओओपी सिद्धांत और एसक्यूएल।" },
        stream: "science",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-csc-ch1",
            chapterNumber: 1,
            title: { en: "Function Concepts & Algorithmic Parameters", ta: "சார்புகள் மற்றும் நெறிமுறை பண்புகள்", hi: "फलन और एल्गोरिदम" },
            summary: { en: "Subroutines, pure functions, interfaces vs implementations, and algorithmic efficiency.", ta: "துணை நிரல்கள், தூய சார்புகள் மற்றும் இடைமுகங்கள்.", hi: "उपप्रोग्राम, शुद्ध फलन और एल्गोरिदम दक्षता।" },
            lessonLines: [
              "A function is a sub-unit of a program which solves a specific task.",
              "Pure functions return the same result for the same arguments without side-effects.",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c12-csc-ch1-pdf", title: { en: "Class 12 Computer Science PDF", ta: "கணினி அறிவியல் பாடம் 1 (PDF)", hi: "कंप्यूटर साइंस पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-commerce",
        code: "COM-12",
        name: { en: "Commerce", ta: "வணிகவியல்", hi: "वाणिज्य" },
        accent: "var(--amber)",
        icon: "commerce",
        description: { en: "Principles of Management, Financial Markets (Stock Exchange, SEBI), Marketing.", ta: "மேலாண்மை தத்துவங்கள், நிதிச் சந்தை (பங்குச் சந்தை, செபி), சந்தையியல்.", hi: "प्रबंधन के सिद्धांत, शेयर बाजार और विपणन।" },
        stream: "commerce",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-com-ch1",
            chapterNumber: 1,
            title: { en: "Principles of Management (Henri Fayol)", ta: "மேலாண்மை கோட்பாடுகள் (ஹென்றி ஃபயோல்)", hi: "प्रबंधन के 14 सिद्धांत (हेनरी फेयोल)" },
            summary: { en: "Division of work, unity of command, scalar chain, and 14 principles of management.", ta: "ஹென்றி ஃபயோலின் 14 நவீன மேலாண்மைக் கோட்பாடுகள்.", hi: "कार्य विभाजन, आदेश की एकता और फेयोल के 14 सिद्धांत।" },
            lessonLines: [
              "Henri Fayol proposed 14 Principles of Management in General and Industrial Management.",
              "Key principles include Division of Work, Authority & Responsibility, and Unity of Command.",
            ],
            lessonLang: "en",
            estimatedMinutes: 8,
            resources: [{ id: "c12-com-ch1-pdf", title: { en: "Class 12 Commerce Chapter 1 PDF", ta: "வணிகவியல் அத்தியாயம் 1 (PDF)", hi: "वाणिज्य पाठ 1" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-accountancy",
        code: "ACC-12",
        name: { en: "Accountancy", ta: "கணக்குப்பதிவியல்", hi: "लेखाशास्त्र" },
        accent: "var(--pink)",
        icon: "math",
        description: { en: "Accounts from Incomplete Records, Accounts of Not-for-Profit Organisations, Partnership Accounts.", ta: "முழுமைபெறா பதிவேடுகள், இலாப நோக்கற்ற அமைப்புகளின் கணக்குகள்.", hi: "अपूर्ण अभिलेख, अलाभकारी संस्थाओं के खाते और साझेदारी।" },
        stream: "commerce",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-acc-ch1",
            chapterNumber: 1,
            title: { en: "Accounts from Incomplete Records (Single Entry System)", ta: "முழுமைபெறா பதிவேடுகளிலிருந்து கணக்குகள்", hi: "अपूर्ण अभिलेखों से खाते" },
            summary: { en: "Ascertainment of profit or loss using Statement of Affairs method.", ta: "நிலை அறிக்கை முறை மூலம் இலாப நட்டம் கண்டறிதல்.", hi: "स्थिति विवरण पद्धति द्वारा लाभ या हानि का निर्धारण।" },
            lessonLines: ["When accounting records are not strictly kept according to double entry, they are called incomplete records."],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c12-acc-ch1-pdf", title: { en: "Class 12 Accountancy PDF", ta: "கணக்குப்பதிவியல் பாடம் (PDF)", hi: "लेखाशास्त्र पीडीएफ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
      {
        id: "c12-economics",
        code: "ECO-12",
        name: { en: "Economics", ta: "பொருளியல்", hi: "अर्थशास्त्र" },
        accent: "var(--teal)",
        icon: "social",
        description: { en: "Introduction to Macroeconomics, National Income, Theories of Employment & Income, Banking.", ta: "பேரினப் பொருளியல், நாட்டு வருமானம், வேலைவாய்ப்பு மற்றும் பணவியல்.", hi: "समष्टि अर्थशास्त्र, राष्ट्रीय आय, रोजगार सिद्धांत और बैंकिंग।" },
        stream: "commerce",
        textbookUrl: TN_TEXTBOOK_PORTAL_URL,
        chapters: [
          {
            id: "c12-eco-ch1",
            chapterNumber: 1,
            title: { en: "Introduction to Macroeconomics & Circular Flow of Income", ta: "பேரினப் பொருளியல் மற்றும் வருவாயின் வட்ட ஓட்டம்", hi: "समष्टि अर्थशास्त्र और आय का चक्रीय प्रवाह" },
            summary: { en: "J.M. Keynes's macroeconomic framework, open vs closed economies, and sector flow models.", ta: "ஜே.எம். கீன்ஸின் பேரினப் பொருளியல் அணுகுமுறை மற்றும் பொருளாதார மாதிரிகள்.", hi: "केन्स का समष्टि अर्थशास्त्र और दो, तीन तथा चार क्षेत्रीय अर्थव्यवस्था।" },
            lessonLines: [
              "Macroeconomics is the study of the economy as a whole, including inflation, GDP, and unemployment.",
              "Ragnar Frisch coined the terms 'Micro' and 'Macro' economics in 1933.",
            ],
            lessonLang: "en",
            estimatedMinutes: 9,
            resources: [{ id: "c12-eco-ch1-pdf", title: { en: "Class 12 Economics PDF", ta: "பொருளியல் பாடம் (PDF)", hi: "अर्थशास्त्र पाठ" }, type: "pdf", url: TN_TEXTBOOK_PORTAL_URL, available: true }],
          },
        ],
      },
    ],
  },
};

// ============================================================================
// HELPER & QUERY FUNCTIONS
// ============================================================================

export function getStandardsList(): readonly number[] {
  return SUPPORTED_STANDARDS;
}

export function getStandardCurriculum(standard: number): StandardCurriculum | undefined {
  if (!isSupportedStandard(standard)) return undefined;
  return CURRICULUM_DATA[standard];
}

export function getSubjectsForStandard(standard: number): readonly CurriculumSubject[] {
  const std = getStandardCurriculum(standard);
  return std ? std.subjects : [];
}

export function getSubjectById(standard: number, subjectId: string): CurriculumSubject | undefined {
  const subjects = getSubjectsForStandard(standard);
  return subjects.find((s) => s.id === subjectId);
}

export function getChapterById(
  standard: number,
  subjectId: string,
  chapterId: string,
): { subject: CurriculumSubject; chapter: CurriculumChapter } | undefined {
  const subject = getSubjectById(standard, subjectId);
  if (!subject) return undefined;
  const chapter = subject.chapters.find((c) => c.id === chapterId);
  if (!chapter) return undefined;
  return { subject, chapter };
}

export function validateStandardAccess(
  studentStandard: number,
  targetStandard: number,
): { allowed: boolean; reason?: string } {
  if (!isSupportedStandard(targetStandard)) {
    return { allowed: false, reason: `Standard ${targetStandard} is not currently supported.` };
  }
  if (studentStandard !== targetStandard) {
    return {
      allowed: false,
      reason: `This content belongs to Class ${targetStandard}, but your profile is currently set to Class ${studentStandard}.`,
    };
  }
  return { allowed: true };
}
