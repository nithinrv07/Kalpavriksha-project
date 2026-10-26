"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  SpeakerHigh,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { useReadAloud } from "@/components/read-aloud";
import { useProgress, updateProgress } from "@/components/progress-store";
import { completeLesson, localDay, XP } from "@/lib/progress";
import type { CurriculumChapter, CurriculumSubject } from "@/lib/curriculum";
import {
  AstronautBookMascot,
  TigerCubMascot,
  ShootingStarBanner,
  BabyElephantMascot,
  CheeringAstronautKid,
  CosmicBackgroundDoodles,
} from "./cosmic-mascots";

// ============================================================================
// THEME TYPES & RESOLVER (Content based on specific chapter & subject)
// ============================================================================
export type JuniorSceneTheme =
  | "ancient_tamil"
  | "garden_rhyme"
  | "tamil_alphabet"
  | "english_story"
  | "math_wonderland"
  | "science_nature"
  | "community_village";

export interface JuniorSceneConfig {
  theme: JuniorSceneTheme;
  spotQuestion: string;
  spotPills: { id: string; label: string; emoji: string; speechText: string }[];
  bubbleTag: string;
  bubbleHighlight: string;
  bubbleText: string;
}

export function resolveJuniorSceneConfig(
  subject: CurriculumSubject,
  chapter: CurriculumChapter
): JuniorSceneConfig {
  const subCode = (subject.code || "").toUpperCase();
  const subId = (subject.id || "").toLowerCase();
  const title = (chapter.title.en || "") + " " + (chapter.title.ta || "");
  const summary = (chapter.summary.en || "") + " " + (chapter.summary.ta || "");
  const text = (title + " " + summary).toLowerCase();

  // 1. Mathematics
  if (subCode.includes("MAT") || subId.includes("math") || text.includes("number") || text.includes("கணிதம்") || text.includes("shape")) {
    return {
      theme: "math_wonderland",
      spotQuestion: "Can You Spot Number 3? 🤔",
      spotPills: [
        { id: "num3", label: "Lucky Number 3", emoji: "🔢", speechText: "Number 3! எண் மூன்று!" },
        { id: "star", label: "Golden Star", emoji: "⭐", speechText: "Golden Star! நட்சத்திரம்!" },
        { id: "triangle", label: "Magic Triangle", emoji: "🔺", speechText: "Triangle! முக்கோணம்!" },
      ],
      bubbleTag: "Fun With Numbers! 🧮",
      bubbleHighlight: "1, 2, 3 Counting",
      bubbleText: "is super easy and magical! ⭐",
    };
  }

  // 2. Science / Environmental Studies
  if (subCode.includes("SCI") || subId.includes("science") || subId.includes("evs") || text.includes("plant") || text.includes("செடி") || text.includes("water") || text.includes("nature")) {
    return {
      theme: "science_nature",
      spotQuestion: "Can You Spot the Plant Sprout? 🤔",
      spotPills: [
        { id: "sprout", label: "Green Sprout", emoji: "🌱", speechText: "Green Sprout! பசுமையான தளிர்!" },
        { id: "rainbow", label: "Sunny Rainbow", emoji: "🌈", speechText: "Rainbow! வானவில்!" },
        { id: "bee", label: "Busy Bee", emoji: "🐝", speechText: "Honey Bee! தேனீ!" },
      ],
      bubbleTag: "Nature & Science! 🌿",
      bubbleHighlight: "Green Plants",
      bubbleText: "grow with warm sunlight and rain! 🌻",
    };
  }

  // 3. Social Science / Community Helpers
  if (subCode.includes("SOC") || subId.includes("social") || text.includes("helper") || text.includes("family") || text.includes("village") || text.includes("vehicle")) {
    return {
      theme: "community_village",
      spotQuestion: "Can You Spot the Fire Truck? 🤔",
      spotPills: [
        { id: "firetruck", label: "Red Fire Truck", emoji: "🚒", speechText: "Fire Truck! தீயணைப்பு வண்டி!" },
        { id: "doctor", label: "Friendly Doctor", emoji: "🩺", speechText: "Doctor! மருத்துவர்!" },
        { id: "school", label: "Village School", emoji: "🏫", speechText: "School! பள்ளி!" },
      ],
      bubbleTag: "Our Community! 🤝",
      bubbleHighlight: "Helpful Friends",
      bubbleText: "work together to help everyone! 🏡",
    };
  }

  // 4. English Language & Storyland
  if (subCode.includes("ENG") || subId.includes("english")) {
    const firstLine = chapter.lessonLines?.[0] || "A B C D in the Morning!";
    return {
      theme: "english_story",
      spotQuestion: "Can You Spot the School Bus? 🤔",
      spotPills: [
        { id: "bus", label: "Yellow Bus", emoji: "🚌", speechText: "Yellow School Bus!" },
        { id: "apple", label: "Letter Apple", emoji: "🍎", speechText: "Letter A for Apple!" },
        { id: "teddy", label: "Happy Teddy", emoji: "🧸", speechText: "Cute Teddy Bear!" },
      ],
      bubbleTag: "English Storyland! 📖",
      bubbleHighlight: firstLine.slice(0, 24),
      bubbleText: "is joyful reading and singing! 🎈",
    };
  }

  // 5. Tamil Language specific topic branches:
  // 5A: Ancient history / civilization / trade / seashore
  if (text.includes("நாகரிகம்") || text.includes("தொழில்") || text.includes("வணிகம்") || text.includes("வரலாறு") || text.includes("trade") || text.includes("civilization")) {
    return {
      theme: "ancient_tamil",
      spotQuestion: "Can You Spot the Market? 🤔",
      spotPills: [
        { id: "pottery", label: "Old Pottery", emoji: "🏺", speechText: "Old Pottery! மண்பாண்டங்கள்!" },
        { id: "boat", label: "Trading Boat", emoji: "⛵", speechText: "Trading Boat! வாணிபக் கப்பல்!" },
        { id: "house", label: "Ancient House", emoji: "🏠", speechText: "Ancient House! பண்டைத் தமிழர் இல்லம்!" },
      ],
      bubbleTag: "Listen & Read-Along! ✨",
      bubbleHighlight: "நாகரிகம் (Naagarigam)",
      bubbleText: "means Good Living! 🌾",
    };
  }

  // 5B: Alphabet / letters / Thirukkural / grammar
  if (text.includes("எழுத்து") || text.includes("அகரம்") || text.includes("உயிர்") || text.includes("குறள்") || text.includes("letter") || text.includes("alphabet")) {
    return {
      theme: "tamil_alphabet",
      spotQuestion: "Can You Spot Letter 'அ'? 🤔",
      spotPills: [
        { id: "letterA", label: "Letter 'அ'", emoji: "🔤", speechText: "Tamil Letter 'அ'! அகர முதல எழுத்தெல்லாம்!" },
        { id: "peacock", label: "Dancing Peacock", emoji: "🦚", speechText: "Peacock! மயில்!" },
        { id: "scroll", label: "Palm Leaf", emoji: "📜", speechText: "Palm Leaf Manuscript! ஓலைச்சுவடி!" },
      ],
      bubbleTag: "Tamil Letters! 🌟",
      bubbleHighlight: "அகர முதல எழுத்தெல்லாம்",
      bubbleText: "Let's learn beautiful Tamil letters! 🔤",
    };
  }

  // 5C: Default Nursery Rhymes & Garden Songs
  const line0 = chapter.lessonLines?.[0] || "அணிலே அணிலே ஓடி வா!";
  return {
    theme: "garden_rhyme",
    spotQuestion: "Can You Spot the Squirrel? 🤔",
    spotPills: [
      { id: "squirrel", label: "Playful Squirrel", emoji: "🐿️", speechText: "Squirrel! அணிலே அணிலே ஓடி வா!" },
      { id: "guava", label: "Sweet Guava", emoji: "🍐", speechText: "Sweet Guava Fruit! கொய்யாப் பழம்!" },
      { id: "parrot", label: "Singing Parrot", emoji: "🦜", speechText: "Singing Parrot! பச்சைக்கிளி!" },
    ],
    bubbleTag: "Joyful Tamil Rhyme! 🎵",
    bubbleHighlight: line0.slice(0, 24),
    bubbleText: "பாடி ஆடி விளையாடுவோம்! 🌸",
  };
}

// ============================================================================
// ILLUSTRATION 1: Ancient Tamil Seashore Civilization & Trade
// ============================================================================
export function AncientTamilSeashoreIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ancientSky" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.6" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="ancientSea" x1="0" y1="200" x2="0" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="0.5" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="ancientSand" x1="0" y1="260" x2="0" y2="450" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fed7aa" />
          <stop offset="0.6" stopColor="#fde047" />
          <stop offset="1" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="280" fill="url(#ancientSky)" />
      <circle cx="700" cy="80" r="38" fill="#fef08a" opacity="0.85" />
      <circle cx="700" cy="80" r="48" fill="#fde047" opacity="0.3" />
      <ellipse cx="140" cy="65" rx="50" ry="18" fill="#ffffff" opacity="0.85" />
      <ellipse cx="170" cy="55" rx="35" ry="22" fill="#ffffff" opacity="0.85" />
      <ellipse cx="480" cy="90" rx="60" ry="16" fill="#ffffff" opacity="0.75" />

      {/* Sea & Waves */}
      <rect x="340" y="220" width="460" height="90" fill="url(#ancientSea)" />
      <path d="M350 250 Q420 245 500 250 Q600 255 700 250" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Trading Boat */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("boat")}
        filter={highlightedItem === "boat" ? "drop-shadow(0 0 14px #38bdf8)" : undefined}
      >
        <g transform="translate(430, 185) scale(0.9)">
          <path d="M10 70 Q50 95 110 75 Q115 65 105 60 L15 60 Z" fill="#854d0e" stroke="#581c87" strokeWidth="2" />
          <line x1="60" y1="10" x2="60" y2="65" stroke="#78350f" strokeWidth="3" />
          <path d="M60 12 Q95 28 85 58 L60 55 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <polygon points="60,10 75,14 60,18" fill="#ef4444" />
        </g>
        <g transform="translate(580, 190) scale(0.7)">
          <path d="M10 70 Q50 95 110 75 Q115 65 105 60 L15 60 Z" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <line x1="60" y1="15" x2="60" y2="65" stroke="#78350f" strokeWidth="2.5" />
          <path d="M60 16 Q90 32 82 58 L60 55 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>
      </g>

      {/* Sand */}
      <path d="M0 260 Q200 240 380 270 Q550 300 800 280 L800 450 L0 450 Z" fill="url(#ancientSand)" />
      <path d="M360 272 Q520 302 800 282" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

      {/* Palm Trees */}
      <g transform="translate(180, 160) scale(0.85)">
        <path d="M40 130 Q30 70 50 10" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        <path d="M50 10 Q20 -15 -10 0" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 10 Q10 0 0 25" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 10 Q80 -10 100 10" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Ancient Houses */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("house")}
        filter={highlightedItem === "house" ? "drop-shadow(0 0 16px #facc15)" : undefined}
      >
        <g transform="translate(70, 225)">
          <rect x="10" y="55" width="65" height="50" rx="3" fill="#c084fc" stroke="#7e22ce" strokeWidth="2" />
          <polygon points="42,5 85,55 0,55" fill="#facc15" stroke="#a16207" strokeWidth="2" />
        </g>
        <g transform="translate(145, 235)">
          <rect x="10" y="50" width="70" height="50" rx="3" fill="#f472b6" stroke="#be185d" strokeWidth="2" />
          <polygon points="45,8 90,50 0,50" fill="#2dd4bf" stroke="#115e59" strokeWidth="2" />
        </g>
        <g transform="translate(225, 240)">
          <rect x="10" y="50" width="75" height="52" rx="3" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
          <polygon points="48,6 95,50 0,50" fill="#fb923c" stroke="#9a3412" strokeWidth="2" />
        </g>
      </g>

      {/* Old Pottery */}
      <g
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={() => onSpotItem("pottery")}
        filter={highlightedItem === "pottery" ? "drop-shadow(0 0 16px #ea580c)" : undefined}
      >
        <g transform="translate(75, 345)">
          <ellipse cx="20" cy="40" rx="14" ry="16" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <ellipse cx="20" cy="24" rx="8" ry="4" fill="#fed7aa" stroke="#9a3412" strokeWidth="1.5" />
          <ellipse cx="44" cy="44" rx="11" ry="13" fill="#c2410c" stroke="#7c2d12" strokeWidth="2" />
        </g>
      </g>

      {/* Characters */}
      <g transform="translate(290, 310) scale(0.95)">
        <path d="M25 65 L40 115 L12 115 Z" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
        <circle cx="26" cy="24" r="11" fill="#fcd34d" />
        <ellipse cx="18" cy="22" rx="7" ry="9" fill="#1e293b" />
      </g>
      <g transform="translate(420, 290) scale(1.1)">
        <rect x="22" y="70" width="22" height="42" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="23" y="42" width="20" height="30" rx="3" fill="#f59e0b" />
        <circle cx="33" cy="26" r="10" fill="#f59e0b" />
        <ellipse cx="33" cy="20" rx="14" ry="8" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
      </g>

      {/* Baby Elephant */}
      <g transform="translate(110, 315) scale(0.9)">
        <ellipse cx="70" cy="65" rx="35" ry="28" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <circle cx="45" cy="50" r="24" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <ellipse cx="65" cy="48" rx="11" ry="13" fill="#fbcfe8" />
        <path d="M35 55 Q20 62 18 45 Q16 35 26 38" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>

      {/* Tiger Cub */}
      <g transform="translate(490, 340) scale(0.85)">
        <TigerCubMascot />
      </g>
    </svg>
  );
}

// ============================================================================
// ILLUSTRATION 2: Nature & Rhymes Garden (Squirrel & Guava Orchard)
// ============================================================================
export function NatureRhymesGardenIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a7f3d0" />
          <stop offset="0.6" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="gardenGrass" x1="0" y1="260" x2="0" y2="450" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="0.5" stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="280" fill="url(#gardenSky)" />
      <circle cx="120" cy="70" r="40" fill="#fde047" opacity="0.9" />
      <circle cx="120" cy="70" r="52" fill="#fef08a" opacity="0.4" />

      {/* Rolling Hills */}
      <path d="M0 240 Q250 180 500 240 Q680 190 800 240 L800 450 L0 450 Z" fill="url(#gardenGrass)" />

      {/* Giant Guava Tree */}
      <g transform="translate(260, 60)">
        {/* Tree Trunk & Branches */}
        <path d="M120 320 Q100 220 110 160 Q80 120 50 110" stroke="#78350f" strokeWidth="24" strokeLinecap="round" />
        <path d="M110 170 Q150 130 190 120" stroke="#78350f" strokeWidth="18" strokeLinecap="round" />
        {/* Leaves Canopy */}
        <circle cx="60" cy="90" r="65" fill="#22c55e" />
        <circle cx="120" cy="60" r="75" fill="#16a34a" />
        <circle cx="190" cy="85" r="70" fill="#15803d" />
        <circle cx="130" cy="110" r="60" fill="#4ade80" />

        {/* Sweet Guava Fruits (Spot item: guava) */}
        <g
          className="cursor-pointer transition-transform hover:scale-125"
          onClick={() => onSpotItem("guava")}
          filter={highlightedItem === "guava" ? "drop-shadow(0 0 16px #facc15)" : undefined}
        >
          <g transform="translate(80, 110)">
            <ellipse cx="15" cy="20" rx="14" ry="17" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
            <circle cx="15" cy="5" r="3" fill="#65a30d" />
          </g>
          <g transform="translate(170, 100)">
            <ellipse cx="15" cy="20" rx="14" ry="17" fill="#a3e635" stroke="#4d7c0f" strokeWidth="2" />
          </g>
        </g>

        {/* Playful Striped Squirrel on the branch (Spot item: squirrel) */}
        <g
          className="cursor-pointer transition-transform hover:scale-115"
          onClick={() => onSpotItem("squirrel")}
          filter={highlightedItem === "squirrel" ? "drop-shadow(0 0 16px #f97316)" : undefined}
          transform="translate(140, 140) scale(1.1)"
        >
          {/* Big Fluffy Tail */}
          <path d="M40 30 Q70 10 65 -15 Q55 -30 35 -20 Q25 -10 32 10" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <path d="M45 20 Q60 5 55 -10" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="25" cy="30" rx="16" ry="12" fill="#ea580c" />
          <ellipse cx="25" cy="32" rx="10" ry="7" fill="#fed7aa" />
          {/* Head & Ears */}
          <circle cx="10" cy="20" r="10" fill="#ea580c" />
          <polygon points="12,12 16,5 18,12" fill="#c2410c" />
          <circle cx="7" cy="18" r="2.5" fill="#0f172a" />
          <circle cx="8" cy="17" r="1" fill="#ffffff" />
          {/* Holding a little nut */}
          <circle cx="4" cy="26" r="3" fill="#ca8a04" />
        </g>

        {/* Singing Green Parrot (Spot item: parrot) */}
        <g
          className="cursor-pointer transition-transform hover:scale-125"
          onClick={() => onSpotItem("parrot")}
          filter={highlightedItem === "parrot" ? "drop-shadow(0 0 16px #22c55e)" : undefined}
          transform="translate(30, 40) scale(1.1)"
        >
          {/* Tail */}
          <path d="M25 35 L35 70 L28 72 Z" fill="#15803d" />
          {/* Body */}
          <ellipse cx="20" cy="30" rx="14" ry="18" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
          <circle cx="16" cy="15" r="10" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
          <path d="M12 18 Q5 22 8 26" fill="#ef4444" /> {/* Red Beak */}
          <circle cx="18" cy="13" r="2" fill="#0f172a" />
          <circle cx="19" cy="12" r="0.8" fill="#ffffff" />
        </g>
      </g>

      {/* Playing Baby Elephant & Tiger Cub on the grass */}
      <g transform="translate(60, 310) scale(0.95)">
        <ellipse cx="70" cy="65" rx="35" ry="28" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <circle cx="45" cy="50" r="24" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <ellipse cx="65" cy="48" rx="11" ry="13" fill="#fbcfe8" />
        <path d="M35 55 Q20 62 18 45 Q16 35 26 38" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
      <g transform="translate(660, 320) scale(0.9)">
        <TigerCubMascot />
      </g>
    </svg>
  );
}

// ============================================================================
// ILLUSTRATION 3: Tamil Alphabet Temple (Peacock & Palm Leaf Manuscript)
// ============================================================================
export function TamilAlphabetTempleIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="templeSky" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="0.6" stopColor="#c084fc" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="280" fill="url(#templeSky)" />
      <rect x="0" y="270" width="800" height="180" fill="#312e81" />

      {/* Traditional Temple Gopuram Pillars & Arch */}
      <g transform="translate(240, 40)">
        <rect x="0" y="70" width="30" height="200" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <rect x="290" y="70" width="30" height="200" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <path d="M0 70 Q160 -10 320 70 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
        {/* Kalasam peaks */}
        <polygon points="160,5 150,30 170,30" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
      </g>

      {/* Sparkling Floating Tamil Letters (Spot item: letterA) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115"
        onClick={() => onSpotItem("letterA")}
        filter={highlightedItem === "letterA" ? "drop-shadow(0 0 20px #facc15)" : "drop-shadow(0 0 10px #fde047)"}
        transform="translate(360, 140)"
      >
        <circle cx="45" cy="45" r="45" fill="#fef08a" stroke="#f59e0b" strokeWidth="3" />
        <text x="45" y="60" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#78350f">
          அ
        </text>
      </g>

      <g transform="translate(270, 160) scale(0.8)">
        <circle cx="35" cy="35" r="35" fill="#c084fc" />
        <text x="35" y="48" textAnchor="middle" fontSize="38" fontWeight="bold" fill="#ffffff">
          ஆ
        </text>
      </g>
      <g transform="translate(480, 160) scale(0.8)">
        <circle cx="35" cy="35" r="35" fill="#38bdf8" />
        <text x="35" y="48" textAnchor="middle" fontSize="38" fontWeight="bold" fill="#ffffff">
          இ
        </text>
      </g>

      {/* Palm Leaf Manuscript (Spot item: scroll) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115"
        onClick={() => onSpotItem("scroll")}
        filter={highlightedItem === "scroll" ? "drop-shadow(0 0 16px #fbbf24)" : undefined}
        transform="translate(100, 310)"
      >
        <rect x="0" y="10" width="130" height="40" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
        <line x1="15" y1="22" x2="115" y2="22" stroke="#854d0e" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="15" y1="36" x2="115" y2="36" stroke="#854d0e" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="65" cy="30" r="4" fill="#ef4444" /> {/* Red string tie */}
      </g>

      {/* Dancing Peacock (Spot item: peacock) */}
      <g
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={() => onSpotItem("peacock")}
        filter={highlightedItem === "peacock" ? "drop-shadow(0 0 18px #22d3ee)" : undefined}
        transform="translate(600, 260) scale(1.1)"
      >
        {/* Fan Plumes */}
        <circle cx="50" cy="50" r="45" fill="#06b6d4" opacity="0.8" />
        <circle cx="30" cy="25" r="7" fill="#fbbf24" />
        <circle cx="50" cy="15" r="7" fill="#fbbf24" />
        <circle cx="70" cy="25" r="7" fill="#fbbf24" />
        {/* Body */}
        <ellipse cx="50" cy="70" rx="14" ry="24" fill="#0284c7" />
        <circle cx="50" cy="45" r="10" fill="#0284c7" />
        <polygon points="58,45 66,48 58,51" fill="#f59e0b" />
      </g>
    </svg>
  );
}

// ============================================================================
// ILLUSTRATION 4: English Storyland (Yellow School Bus & Letter Tree)
// ============================================================================
export function EnglishStorylandIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="englishSky" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.7" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="280" fill="url(#englishSky)" />
      {/* Hills & Road */}
      <path d="M0 250 Q200 200 450 250 Q650 210 800 250 L800 450 L0 450 Z" fill="#22c55e" />
      <path d="M0 350 Q400 320 800 350 L800 450 L0 450 Z" fill="#475569" />
      <line x1="0" y1="400" x2="800" y2="400" stroke="#facc15" strokeWidth="6" strokeDasharray="30 25" />

      {/* Alphabet Apple Tree (Spot item: apple) */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("apple")}
        filter={highlightedItem === "apple" ? "drop-shadow(0 0 16px #ef4444)" : undefined}
        transform="translate(100, 100)"
      >
        <rect x="45" y="100" width="30" height="150" fill="#78350f" rx="4" />
        <circle cx="60" cy="80" r="75" fill="#16a34a" />
        {/* Apples with A, B, C */}
        <circle cx="30" cy="65" r="14" fill="#ef4444" />
        <text x="30" y="70" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">A</text>
        <circle cx="85" cy="60" r="14" fill="#ef4444" />
        <text x="85" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">B</text>
        <circle cx="60" cy="110" r="14" fill="#ef4444" />
        <text x="60" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">C</text>
      </g>

      {/* Bright Yellow School Bus (Spot item: bus) */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("bus")}
        filter={highlightedItem === "bus" ? "drop-shadow(0 0 20px #facc15)" : undefined}
        transform="translate(340, 260) scale(1.15)"
      >
        {/* Bus Body */}
        <rect x="0" y="20" width="180" height="70" rx="14" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
        <rect x="25" y="32" width="32" height="28" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        <rect x="70" y="32" width="32" height="28" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        <rect x="115" y="32" width="32" height="28" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        {/* Wheels */}
        <circle cx="45" cy="90" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
        <circle cx="135" cy="90" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
        {/* Headlight */}
        <circle cx="178" cy="60" r="6" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
      </g>

      {/* Cute Teddy Bear on Roadside (Spot item: teddy) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115"
        onClick={() => onSpotItem("teddy")}
        filter={highlightedItem === "teddy" ? "drop-shadow(0 0 16px #ec4899)" : undefined}
        transform="translate(680, 290) scale(0.9)"
      >
        <circle cx="35" cy="55" r="24" fill="#ca8a04" />
        <circle cx="35" cy="28" r="18" fill="#ca8a04" />
        <circle cx="20" cy="14" r="8" fill="#ca8a04" />
        <circle cx="50" cy="14" r="8" fill="#ca8a04" />
        <circle cx="30" cy="26" r="2.5" fill="#451a03" />
        <circle cx="40" cy="26" r="2.5" fill="#451a03" />
        <polygon points="35,32 32,36 38,36" fill="#f43f5e" />
      </g>
    </svg>
  );
}

// ============================================================================
// ILLUSTRATION 5: Mathematics Wonderland (1, 2, 3 & Shapes)
// ============================================================================
export function MathWonderlandIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mathSky" x1="0" y1="0" x2="0" y2="450" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" />
          <stop offset="0.6" stopColor="#312e81" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="450" fill="url(#mathSky)" />

      {/* Big Golden Star (Spot item: star) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115 animate-pulse"
        onClick={() => onSpotItem("star")}
        filter={highlightedItem === "star" ? "drop-shadow(0 0 25px #fde047)" : "drop-shadow(0 0 15px #fde047)"}
        transform="translate(100, 80) scale(1.4)"
      >
        <polygon points="30,0 39,19 60,22 44,37 48,58 30,48 12,58 16,37 0,22 21,19" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="24" cy="28" r="2.5" fill="#78350f" />
        <circle cx="36" cy="28" r="2.5" fill="#78350f" />
        <path d="M26 36 Q30 40 34 36" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Magic Glowing Triangle (Spot item: triangle) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115"
        onClick={() => onSpotItem("triangle")}
        filter={highlightedItem === "triangle" ? "drop-shadow(0 0 25px #22c55e)" : "drop-shadow(0 0 15px #22c55e)"}
        transform="translate(620, 100) scale(1.3)"
      >
        <polygon points="50,10 95,90 5,90" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
        <circle cx="43" cy="55" r="3" fill="#ffffff" />
        <circle cx="57" cy="55" r="3" fill="#ffffff" />
        <path d="M45 68 Q50 74 55 68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Lucky Number 3 Center Display (Spot item: num3) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115"
        onClick={() => onSpotItem("num3")}
        filter={highlightedItem === "num3" ? "drop-shadow(0 0 30px #ec4899)" : "drop-shadow(0 0 15px #a855f7)"}
        transform="translate(350, 160) scale(1.6)"
      >
        <rect x="0" y="0" width="70" height="85" rx="16" fill="#f43f5e" stroke="#ffffff" strokeWidth="3" />
        <text x="35" y="62" textAnchor="middle" fontSize="60" fontWeight="900" fill="#ffffff">
          3
        </text>
      </g>

      {/* Numbers 1 and 2 on Left and Right */}
      <g transform="translate(200, 210) scale(1.2)">
        <rect x="0" y="0" width="60" height="75" rx="14" fill="#38bdf8" />
        <text x="30" y="55" textAnchor="middle" fontSize="50" fontWeight="900" fill="#ffffff">
          1
        </text>
      </g>
      <g transform="translate(540, 210) scale(1.2)">
        <rect x="0" y="0" width="60" height="75" rx="14" fill="#a855f7" />
        <text x="30" y="55" textAnchor="middle" fontSize="50" fontWeight="900" fill="#ffffff">
          2
        </text>
      </g>
    </svg>
  );
}

// ============================================================================
// ILLUSTRATION 6: Science & Nature Lab (Sprout, Rainbow & Honeybee)
// ============================================================================
export function ScienceNatureLabIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sciSky" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.6" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="280" fill="url(#sciSky)" />
      {/* Rich Soil Ground */}
      <rect x="0" y="320" width="800" height="130" fill="#78350f" />
      <path d="M0 320 Q200 300 400 320 Q600 340 800 320 L800 340 L0 340 Z" fill="#4ade80" />

      {/* Arching Sunny Rainbow (Spot item: rainbow) */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("rainbow")}
        filter={highlightedItem === "rainbow" ? "drop-shadow(0 0 20px #f43f5e)" : undefined}
        transform="translate(180, 40)"
      >
        <path d="M0 240 A 220 200 0 0 1 440 240" stroke="#f43f5e" strokeWidth="12" fill="none" />
        <path d="M12 240 A 208 188 0 0 1 428 240" stroke="#fb923c" strokeWidth="12" fill="none" />
        <path d="M24 240 A 196 176 0 0 1 416 240" stroke="#facc15" strokeWidth="12" fill="none" />
        <path d="M36 240 A 184 164 0 0 1 404 240" stroke="#22c55e" strokeWidth="12" fill="none" />
        <path d="M48 240 A 172 152 0 0 1 392 240" stroke="#38bdf8" strokeWidth="12" fill="none" />
        <path d="M60 240 A 160 140 0 0 1 380 240" stroke="#a855f7" strokeWidth="12" fill="none" />
      </g>

      {/* Green Plant Sprout (Spot item: sprout) */}
      <g
        className="cursor-pointer transition-transform hover:scale-120"
        onClick={() => onSpotItem("sprout")}
        filter={highlightedItem === "sprout" ? "drop-shadow(0 0 20px #22c55e)" : undefined}
        transform="translate(370, 240) scale(1.4)"
      >
        <path d="M30 70 Q28 40 30 20" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
        <path d="M30 20 Q10 10 5 25 Q15 35 30 22" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
        <path d="M30 20 Q50 10 55 25 Q45 35 30 22" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
        {/* Roots under soil */}
        <path d="M30 70 Q20 85 15 95" stroke="#ca8a04" strokeWidth="2.5" />
        <path d="M30 70 Q40 85 45 95" stroke="#ca8a04" strokeWidth="2.5" />
      </g>

      {/* Flying Busy Honeybee (Spot item: bee) */}
      <g
        className="cursor-pointer transition-transform hover:scale-125 animate-bounce"
        onClick={() => onSpotItem("bee")}
        filter={highlightedItem === "bee" ? "drop-shadow(0 0 16px #facc15)" : undefined}
        transform="translate(560, 180) scale(1.2)"
        style={{ animationDuration: "2.5s" }}
      >
        {/* Wings */}
        <ellipse cx="20" cy="10" rx="8" ry="12" fill="#e0f2fe" opacity="0.8" />
        <ellipse cx="28" cy="10" rx="8" ry="12" fill="#e0f2fe" opacity="0.8" />
        {/* Body with stripes */}
        <ellipse cx="24" cy="24" rx="16" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        <line x1="20" y1="12" x2="20" y2="36" stroke="#451a03" strokeWidth="3" />
        <line x1="28" y1="12" x2="28" y2="36" stroke="#451a03" strokeWidth="3" />
        <circle cx="14" cy="22" r="2" fill="#451a03" />
      </g>
    </svg>
  );
}

// ============================================================================
// ILLUSTRATION 7: Community & Village Helpers (Firetruck & School)
// ============================================================================
export function CommunityVillageIllustration({
  highlightedItem,
  onSpotItem,
}: {
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="comSky" x1="0" y1="0" x2="0" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.7" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="280" fill="url(#comSky)" />
      <rect x="0" y="270" width="800" height="180" fill="#334155" />
      <line x1="0" y1="360" x2="800" y2="360" stroke="#facc15" strokeWidth="6" strokeDasharray="30 25" />

      {/* Village School Building (Spot item: school) */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("school")}
        filter={highlightedItem === "school" ? "drop-shadow(0 0 16px #3b82f6)" : undefined}
        transform="translate(100, 140)"
      >
        <rect x="0" y="50" width="160" height="85" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" rx="4" />
        <polygon points="80,10 170,50 -10,50" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <rect x="65" y="85" width="30" height="50" fill="#0284c7" />
        <rect x="25" y="65" width="25" height="25" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="110" y="65" width="25" height="25" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
      </g>

      {/* Red Fire Truck (Spot item: firetruck) */}
      <g
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSpotItem("firetruck")}
        filter={highlightedItem === "firetruck" ? "drop-shadow(0 0 20px #ef4444)" : undefined}
        transform="translate(360, 240) scale(1.1)"
      >
        <rect x="0" y="20" width="170" height="70" rx="10" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" />
        <rect x="115" y="30" width="40" height="30" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        <rect x="10" y="10" width="100" height="10" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" /> {/* Ladder */}
        <circle cx="40" cy="90" r="16" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="130" cy="90" r="16" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      </g>

      {/* Friendly Doctor (Spot item: doctor) */}
      <g
        className="cursor-pointer transition-transform hover:scale-115"
        onClick={() => onSpotItem("doctor")}
        filter={highlightedItem === "doctor" ? "drop-shadow(0 0 16px #38bdf8)" : undefined}
        transform="translate(650, 240) scale(1.1)"
      >
        <rect x="15" y="45" width="30" height="60" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="30" cy="26" r="14" fill="#fed7aa" />
        <path d="M22 45 Q30 65 38 45" stroke="#0284c7" strokeWidth="3" /> {/* Stethoscope */}
      </g>
    </svg>
  );
}

// ============================================================================
// DYNAMIC CHAPTER ILLUSTRATION DISPATCHER
// ============================================================================
export function DynamicChapterIllustration({
  theme,
  highlightedItem,
  onSpotItem,
}: {
  theme: JuniorSceneTheme;
  highlightedItem: string | null;
  onSpotItem: (name: string) => void;
}) {
  switch (theme) {
    case "ancient_tamil":
      return <AncientTamilSeashoreIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    case "garden_rhyme":
      return <NatureRhymesGardenIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    case "tamil_alphabet":
      return <TamilAlphabetTempleIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    case "english_story":
      return <EnglishStorylandIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    case "math_wonderland":
      return <MathWonderlandIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    case "science_nature":
      return <ScienceNatureLabIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    case "community_village":
      return <CommunityVillageIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
    default:
      return <AncientTamilSeashoreIllustration highlightedItem={highlightedItem} onSpotItem={onSpotItem} />;
  }
}

// ============================================================================
// The Junior Cosmic Lesson Player (Matches exact reference mockup model)
// ============================================================================
export function JuniorCosmicLessonPlayer({
  standard,
  subject,
  chapter,
  allChapters,
  onClose,
  onSelectChapter,
}: {
  standard: number;
  subject: CurriculumSubject | null;
  chapter: CurriculumChapter | null;
  allChapters: { subject: CurriculumSubject; chapter: CurriculumChapter }[];
  onClose: () => void;
  onSelectChapter: (chId: string) => void;
}) {
  const { locale } = useLocale();
  const progress = useProgress();
  const { state, play, stop } = useReadAloud();

  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedSpot, setHighlightedSpot] = useState<string | null>(null);
  const [spotScore, setSpotScore] = useState(0);
  const [celebrateStar, setCelebrateStar] = useState(false);
  const [activeQuestStep, setActiveQuestStep] = useState<number>(2);

  if (!chapter || !subject) return null;

  // Resolve dynamic theme configuration based on subject & chapter
  const sceneConfig = resolveJuniorSceneConfig(subject, chapter);

  // Lesson speech / lines
  const lines = chapter.lessonLines && chapter.lessonLines.length > 0
    ? chapter.lessonLines
    : [
        `${chapter.title[locale]} is full of wonder and wisdom!`,
        chapter.summary[locale],
        "Let us read, sing, and discover with joy!",
      ];

  const handlePlayToggle = () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      play(chapter.id, lines, chapter.lessonLang, {
        rate: 0.9,
      });
    }
  };

  const handleSpot = (spotId: string) => {
    setHighlightedSpot(spotId);
    setCelebrateStar(true);
    setSpotScore((s) => s + 1);

    const pill = sceneConfig.spotPills.find((p) => p.id === spotId);
    const speechText = pill?.speechText || pill?.label || "Awesome spot!";

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(speechText);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }

    setTimeout(() => {
      setCelebrateStar(false);
    }, 2000);
  };

  const handleMarkDone = () => {
    updateProgress((p) => completeLesson(p, chapter.id, localDay()));
  };

  const isDone = progress.lessonsDone.includes(chapter.id);

  return (
    <div className="relative min-h-[92vh] w-full overflow-hidden rounded-[32px] border-2 border-violet-500/80 bg-[#0c041f] text-white p-3 sm:p-6 shadow-[0_0_60px_rgba(168,85,247,0.5)] flex flex-col justify-between">
      {/* Background cosmic doodles */}
      <CosmicBackgroundDoodles />

      {/* [1. Top Navigation & Header] */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/30 pb-4">
        {/* Left: Back to Adventures + Class Badge + Title & Chapter */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-purple-400 bg-purple-950/90 px-4 py-2 font-display text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Adventures</span>
          </button>

          <div className="inline-flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-purple-400 px-3 py-1 font-display leading-tight shadow-md">
            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Class</span>
            <span className="text-sm font-black text-purple-950">{standard}</span>
          </div>

          <div>
            <h1 className="font-display text-lg sm:text-2xl font-black text-white flex items-center gap-2 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]">
              <span>{chapter.title[locale]}</span>
              <span className="text-xl animate-pulse">🚀</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 font-medium">
              {subject.name[locale]} - Chapter {chapter.chapterNumber}: "{chapter.summary[locale]}"
            </p>
          </div>
        </div>

        {/* Center: Astronaut Book Mascot */}
        <div className="hidden md:flex items-center justify-center">
          <AstronautBookMascot className="size-20 animate-bounce" />
        </div>

        {/* Right: Task Progress Badge + Cheering Astronaut */}
        <div className="flex items-center gap-3 rounded-2xl border-2 border-purple-400/80 bg-gradient-to-r from-purple-950/90 to-violet-950/90 p-2 sm:px-4 sm:py-2.5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <div className="flex flex-col">
            <span className="font-display text-xs sm:text-sm font-black text-yellow-300 flex items-center gap-1.5">
              <span>Task 1 of 5:</span>
              <span className="text-white">Let's Watch & Listen!</span>
            </span>
            <ShootingStarBanner className="h-6 w-36 -mt-1" />
          </div>
          <CheeringAstronautKid className="size-12 sm:size-14 -mr-1" />
        </div>
      </div>

      {/* [2. Main Content Center Grid] */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 items-stretch">
        {/* Center-Left: The Play-Learning Theater Box (col-span-12 lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-[32px] border-4 border-fuchsia-500/90 bg-[#14082c] p-4 sm:p-5 shadow-[0_0_40px_rgba(217,70,239,0.5),inset_0_0_20px_rgba(217,70,239,0.2)]">
          {/* Main Visual Row: Scene + Playback Column */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* The Illustrated Animated Scene Frame */}
            <div className="md:col-span-9 relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-purple-400/50 shadow-2xl bg-black">
              <DynamicChapterIllustration
                theme={sceneConfig.theme}
                highlightedItem={highlightedSpot}
                onSpotItem={handleSpot}
              />

              {/* Overlaid Speech / Read-Along Bubble */}
              <div className="absolute bottom-3 left-3 max-w-[85%] rounded-2xl border-2 border-purple-400 bg-white/95 px-4 py-2.5 shadow-2xl text-slate-900 transition-all hover:scale-102">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-fuchsia-700 uppercase">
                  <span>{sceneConfig.bubbleTag}</span>
                  <span>✨</span>
                </span>
                <p className="font-display text-sm sm:text-base font-black leading-snug mt-0.5">
                  <span className="bg-yellow-300 px-1.5 py-0.5 rounded text-purple-950 font-black">
                    {sceneConfig.bubbleHighlight}
                  </span>{" "}
                  {sceneConfig.bubbleText}
                </p>
              </div>

              {/* Celebration Star Pop */}
              {celebrateStar && (
                <div className="absolute top-4 right-4 animate-bounce rounded-full bg-yellow-400 border-2 border-white px-3 py-1 font-display text-xs font-black text-purple-950 shadow-[0_0_20px_rgba(250,204,21,1)]">
                  ⭐ Awesome Spot! +10 XP! ⭐
                </div>
              )}
            </div>

            {/* Playback Controls Column */}
            <div className="md:col-span-3 flex flex-col items-center justify-center gap-3 py-2">
              <p className="font-display text-xs font-extrabold text-pink-200 text-center tracking-wide leading-tight">
                Cinematic Play-Learning Video
              </p>

              {/* PAUSE / PLAY Button */}
              <button
                type="button"
                onClick={handlePlayToggle}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 border-2 border-pink-200 py-3 px-5 font-display text-sm sm:text-base font-black text-white shadow-[0_0_25px_rgba(236,72,153,0.85)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
                <span>{isPlaying ? "PAUSE ⏸" : "PLAY ▶"}</span>
              </button>

              {/* SKIP Button */}
              <button
                type="button"
                onClick={() => handleSpot(sceneConfig.spotPills[0]?.id || "item")}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 border-2 border-blue-200 py-2.5 px-5 font-display text-xs sm:text-sm font-black text-white shadow-[0_0_20px_rgba(59,130,246,0.7)] hover:scale-105 active:scale-95 transition-all"
              >
                <SkipForward size={16} weight="fill" />
                <span>SKIP ⏭</span>
              </button>

              {/* PLAY AUDIO Button */}
              <button
                type="button"
                onClick={handlePlayToggle}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 border-2 border-purple-200 py-2.5 px-4 font-display text-xs sm:text-sm font-black text-white shadow-[0_0_20px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95 transition-all"
              >
                <SpeakerHigh size={16} weight="fill" />
                <span>PLAY AUDIO 🔊</span>
              </button>
            </div>
          </div>

          {/* Scrub Track + Tap the Words hint */}
          <div className="flex items-center gap-3 my-2 pt-2 border-t border-purple-500/20">
            <div className="flex-1 h-3 rounded-full bg-purple-950/80 border border-purple-500/50 p-0.5 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-400 animate-pulse" />
            </div>
            <span className="font-display text-xs text-pink-200 font-bold flex items-center gap-1.5 shrink-0">
              <span>Tap the Words!</span>
              <span>🗣️</span>
            </span>
          </div>

          {/* Bottom Interactive Row: Dynamic Spot & Tap mini-game */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-purple-500/20">
            <div className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-black text-yellow-300">
              <span>{sceneConfig.spotQuestion}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {sceneConfig.spotPills.map((pill) => {
                const isSelected = highlightedSpot === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleSpot(pill.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 font-display text-xs font-bold transition-all hover:scale-105 ${
                      isSelected
                        ? "border-yellow-400 bg-yellow-500/30 text-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.7)]"
                        : "border-purple-400/80 bg-purple-950/70 text-purple-200 hover:border-pink-400 hover:text-white"
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span>{pill.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center-Right: Lesson Map! 🗺️ & Quest Checklist (col-span-12 lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-[32px] border-2 border-indigo-500/70 bg-[#12072a]/95 p-4 sm:p-5 shadow-[0_0_30px_rgba(99,102,241,0.35)]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30">
              <h3 className="font-display text-base sm:text-lg font-black text-cyan-300 flex items-center gap-2">
                <span>Lesson Map!</span>
                <span>🗺️</span>
              </h3>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-400/60 px-2.5 py-0.5 font-mono text-[11px] text-cyan-300 font-bold">
                Quest Checklist
              </span>
            </div>

            {/* Vertical timeline */}
            <div className="flex flex-col gap-3 my-4">
              {/* Step 1: Watch Cartoon Story Video */}
              <div
                onClick={() => setActiveQuestStep(1)}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  activeQuestStep === 1
                    ? "border-purple-400 bg-purple-900/60"
                    : "border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-purple-500 text-white font-black text-xs">
                    1
                  </span>
                  <span className="font-display text-xs sm:text-sm font-bold text-white">
                    Watch Cartoon Story Video
                  </span>
                </div>
                <span className="text-yellow-300 text-base">✨</span>
              </div>

              {/* Step 2: Spot & Tap Game (Active Glowing Card) */}
              <div className="relative rounded-2xl border-2 border-fuchsia-400 bg-gradient-to-r from-[#2c0b46] to-[#1e0836] p-3 shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full bg-fuchsia-500 text-white font-black text-xs">
                      2
                    </span>
                    <span className="font-display text-xs sm:text-sm font-black text-yellow-300">
                      Spot & Tap Game
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpot(sceneConfig.spotPills[0]?.id || "item")}
                    className="animate-pulse rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-3.5 py-1 font-display text-[11px] font-black text-white shadow-md border border-pink-200"
                  >
                    TAP HERE ➔
                  </button>
                </div>
              </div>

              {/* Step 3: Listen to Story Song */}
              <div
                onClick={() => {
                  handlePlayToggle();
                  setActiveQuestStep(3);
                }}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  activeQuestStep === 3
                    ? "border-indigo-400 bg-indigo-900/60"
                    : "border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-indigo-500 text-white font-black text-xs">
                    3
                  </span>
                  <span className="font-display text-xs sm:text-sm font-bold text-indigo-100">
                    Listen to Story Song
                  </span>
                </div>
                <span className="text-indigo-300 text-base">🎵</span>
              </div>

              {/* Step 4: Friendly Quiz! */}
              <div
                onClick={() => {
                  handleMarkDone();
                  setActiveQuestStep(4);
                }}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  activeQuestStep === 4
                    ? "border-amber-400 bg-amber-900/60"
                    : "border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-amber-500 text-white font-black text-xs">
                    4
                  </span>
                  <span className="font-display text-xs sm:text-sm font-bold text-amber-200">
                    Friendly Quiz!
                  </span>
                </div>
                <span className="text-amber-300 text-base">🏆</span>
              </div>
            </div>
          </div>

          {/* Bottom Mascot Cheering Bubble */}
          <div className="pt-3 border-t border-indigo-500/30 flex items-center justify-between">
            <div className="relative rounded-2xl bg-white text-slate-900 px-3 py-1.5 font-display text-xs font-black shadow-lg">
              <span>Keep going, Little Explorer! 🐾</span>
              <div className="absolute -bottom-1.5 left-4 size-3 bg-white rotate-45" />
            </div>

            <div className="flex items-center gap-1 -mr-2">
              <BabyElephantMascot className="size-14 -mr-2" />
              <div className="size-14">
                <TigerCubMascot />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* [3. Bottom Playful Navigation Bar] */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-500/30">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-pink-400/80 bg-pink-950/60 px-4 py-2 font-display text-xs font-bold text-pink-200 hover:text-white hover:bg-pink-900/80 shadow-[0_0_12px_rgba(244,114,182,0.3)] transition-all hover:scale-105"
          >
            <span>All Activities</span>
            <span>🎒</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/80 bg-amber-950/60 px-4 py-2 font-display text-xs font-bold text-amber-200 hover:text-white hover:bg-amber-900/80 shadow-[0_0_12px_rgba(251,191,36,0.3)] transition-all hover:scale-105"
          >
            <span>My Stickers</span>
            <span>⭐</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-950/60 px-4 py-2 font-display text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-900/80 shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all hover:scale-105"
          >
            <span>Tamil Dict</span>
            <span>📚</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/80 bg-violet-950/60 px-4 py-2 font-display text-xs font-bold text-violet-200 hover:text-white hover:bg-violet-900/80 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
          >
            <span>Voice Play</span>
            <span>🎤</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/80 bg-cyan-950/60 px-4 py-2 font-display text-xs font-bold text-cyan-200 hover:text-white hover:bg-cyan-900/80 shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all hover:scale-105"
          >
            <span>Show Map</span>
            <span>🗺️</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleMarkDone}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-display text-xs font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
            isDone
              ? "bg-emerald-600 border border-emerald-300"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_20px_rgba(52,211,153,0.6)]"
          }`}
        >
          <CheckCircle size={16} weight="bold" />
          <span>{isDone ? "Completed! ✓ (+100 XP)" : `Mark Completed (+${XP.lesson} XP)`}</span>
        </button>
      </div>
    </div>
  );
}

export default JuniorCosmicLessonPlayer;
