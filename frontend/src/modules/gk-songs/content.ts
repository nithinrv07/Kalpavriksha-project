import type { Locale, LocalizedText } from "@/lib/i18n";
import type { Band } from "@/lib/progress";

export type Question = {
  readonly id: string;
  readonly q: LocalizedText;
  readonly options: readonly [LocalizedText, LocalizedText, LocalizedText, LocalizedText];
  readonly answer: 0 | 1 | 2 | 3;
  readonly explain: LocalizedText;
};

/** Bharat Ko Jano–style general knowledge, harder with each band. */
export const QUIZ: Record<Band, readonly Question[]> = {
  junior: [
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
        en: "The Bengal tiger is India's national animal.",
        ta: "வங்காளப் புலியே இந்தியாவின் தேசிய விலங்கு.",
        hi: "बंगाल टाइगर भारत का राष्ट्रीय पशु है।",
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
        en: "The peacock, with its colourful feathers, is India's national bird.",
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
      explain: { en: "The lotus is India's national flower.", ta: "தாமரையே இந்தியாவின் தேசிய மலர்.", hi: "कमल भारत का राष्ट्रीय पुष्प है।" },
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
        en: "India became free on 15 August 1947.",
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
      explain: { en: "Chennai is the capital of Tamil Nadu.", ta: "சென்னையே தமிழ்நாட்டின் தலைநகரம்.", hi: "चेन्नई तमिलनाडु की राजधानी है।" },
    },
  ],
  middle: [
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
      explain: { en: "The Ashoka Chakra has 24 spokes.", ta: "அசோகச் சக்கரத்தில் 24 ஆரங்கள் உள்ளன.", hi: "अशोक चक्र में 24 तीलियाँ होती हैं।" },
    },
    {
      id: "m-pm",
      q: { en: "Who was the first Prime Minister of India?", ta: "இந்தியாவின் முதல் பிரதமர் யார்?", hi: "भारत के पहले प्रधानमंत्री कौन थे?" },
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
      q: { en: "Who wrote 'Vande Mataram'?", ta: "'வந்தே மாதரம்' பாடலை இயற்றியவர் யார்?", hi: "'वन्दे मातरम्' किसने लिखा?" },
      options: [
        { en: "Bankim Chandra Chatterjee", ta: "பங்கிம் சந்திர சட்டர்ஜி", hi: "बंकिम चंद्र चट्टोपाध्याय" },
        { en: "Rabindranath Tagore", ta: "இரவீந்திரநாத் தாகூர்", hi: "रवींद्रनाथ टैगोर" },
        { en: "Muhammad Iqbal", ta: "முகம்மது இக்பால்", hi: "मुहम्मद इक़बाल" },
        { en: "Subramania Bharati", ta: "சுப்பிரமணிய பாரதி", hi: "सुब्रमण्य भारती" },
      ],
      answer: 0,
      explain: {
        en: "Bankim Chandra Chatterjee wrote it; it is our national song.",
        ta: "பங்கிம் சந்திர சட்டர்ஜி இயற்றினார்; இதுவே நம் தேசியப் பாடல்.",
        hi: "इसे बंकिम चंद्र चट्टोपाध्याय ने लिखा; यह हमारा राष्ट्रगीत है।",
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
        en: "The Ganga flows about 2,500 km through India.",
        ta: "கங்கை இந்தியாவில் சுமார் 2,500 கி.மீ. பாய்கிறது.",
        hi: "गंगा भारत में लगभग 2,500 किमी बहती है।",
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
        en: "Our Constitution came into force on 26 January 1950.",
        ta: "நம் அரசியலமைப்பு 1950 ஜனவரி 26 அன்று நடைமுறைக்கு வந்தது.",
        hi: "हमारा संविधान 26 जनवरी 1950 को लागू हुआ।",
      },
    },
  ],
  senior: [
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
        en: "Who chaired the Drafting Committee of the Constitution?",
        ta: "அரசியலமைப்பு வரைவுக் குழுவின் தலைவர் யார்?",
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
        en: "Dr B. R. Ambedkar chaired the Drafting Committee.",
        ta: "டாக்டர் பி. ஆர். அம்பேத்கர் வரைவுக் குழுவின் தலைவராக இருந்தார்.",
        hi: "डॉ. बी. आर. आंबेडकर प्रारूप समिति के अध्यक्ष थे।",
      },
    },
    {
      id: "s-article21",
      q: { en: "What does Article 21 of the Constitution protect?", ta: "அரசியலமைப்பின் பிரிவு 21 எதைப் பாதுகாக்கிறது?", hi: "संविधान का अनुच्छेद 21 किसकी रक्षा करता है?" },
      options: [
        { en: "Equality before law", ta: "சட்டத்தின் முன் சமத்துவம்", hi: "क़ानून के समक्ष समानता" },
        { en: "Freedom of religion", ta: "சமய சுதந்திரம்", hi: "धर्म की स्वतंत्रता" },
        { en: "Right to constitutional remedies", ta: "அரசியலமைப்புத் தீர்வுகளுக்கான உரிமை", hi: "संवैधानिक उपचारों का अधिकार" },
        { en: "Life and personal liberty", ta: "உயிர் மற்றும் தனிப்பட்ட சுதந்திரம்", hi: "प्राण और दैहिक स्वतंत्रता" },
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
        en: "In August 2023, Chandrayaan-3 landed near which region of the Moon?",
        ta: "2023 ஆகஸ்டில் சந்திரயான்-3 நிலவின் எந்தப் பகுதிக்கு அருகில் தரையிறங்கியது?",
        hi: "अगस्त 2023 में चंद्रयान-3 चंद्रमा के किस क्षेत्र के पास उतरा?",
      },
      options: [
        { en: "North pole", ta: "வட துருவம்", hi: "उत्तरी ध्रुव" },
        { en: "Equator", ta: "நிலநடுக்கோடு", hi: "भूमध्य रेखा" },
        { en: "South pole", ta: "தென் துருவம்", hi: "दक्षिणी ध्रुव" },
        { en: "Far side", ta: "மறுபக்கம்", hi: "पिछला भाग" },
      ],
      answer: 2,
      explain: {
        en: "On 23 August 2023 India became the first country to land near the Moon's south pole.",
        ta: "2023 ஆகஸ்ட் 23 அன்று நிலவின் தென் துருவத்துக்கு அருகில் தரையிறங்கிய முதல் நாடு இந்தியா.",
        hi: "23 अगस्त 2023 को भारत चंद्रमा के दक्षिणी ध्रुव के पास उतरने वाला पहला देश बना।",
      },
    },
    {
      id: "s-rbi",
      q: {
        en: "Where is the headquarters of the Reserve Bank of India?",
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
        en: "The RBI was set up in 1935; its headquarters moved to Mumbai in 1937.",
        ta: "ரிசர்வ் வங்கி 1935-இல் தொடங்கப்பட்டது; 1937-இல் தலைமையகம் மும்பைக்கு மாறியது.",
        hi: "आरबीआई की स्थापना 1935 में हुई; 1937 में इसका मुख्यालय मुंबई आ गया।",
      },
    },
  ],
};

/** Seconds per question; only seniors race the clock. */
export const QUESTION_SECONDS: Record<Band, number | null> = { junior: null, middle: null, senior: 30 };

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
  },
};
