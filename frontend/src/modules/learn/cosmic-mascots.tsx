"use client";

import React from "react";

/** Cheerful laptop mascot in astronaut bubble helmet with starry eyes and waving hands */
export function LaptopMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 100"
      className={`shrink-0 overflow-visible transition-transform duration-300 hover:scale-105 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="laptopLid" x1="20" y1="10" x2="100" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="28" y1="18" x2="92" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <filter id="neonGlowLaptop" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Bubble Astronaut Helmet Glow */}
      <circle cx="65" cy="46" r="46" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeWidth="2.5" className="filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
      {/* Helmet glass reflection arc */}
      <path d="M 32 30 A 40 40 0 0 1 85 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.65" />

      {/* Laptop Glow aura */}
      <ellipse cx="65" cy="52" rx="38" ry="24" fill="#a855f7" opacity="0.3" filter="url(#neonGlowLaptop)" />

      {/* Screen Frame / Lid */}
      <rect
        x="30"
        y="18"
        width="70"
        height="46"
        rx="8"
        fill="url(#laptopLid)"
        stroke="#e0e7ff"
        strokeWidth="2"
        className="filter drop-shadow-[0_0_12px_rgba(192,132,252,0.8)]"
      />

      {/* Display */}
      <rect x="35" y="23" width="60" height="36" rx="5" fill="url(#laptopScreen)" stroke="#38bdf8" strokeWidth="1" />

      {/* Stars on Screen */}
      <circle cx="40" cy="28" r="1.2" fill="#fef08a" />
      <circle cx="88" cy="28" r="1.4" fill="#f472b6" />
      <circle cx="86" cy="52" r="1" fill="#38bdf8" />
      <circle cx="42" cy="51" r="1" fill="#a7f3d0" />

      {/* Left Star Eye */}
      <path d="M50 34 L51.5 38 L55.5 39.5 L51.5 41 L50 45 L48.5 41 L44.5 39.5 L48.5 38 Z" fill="#38bdf8" />
      <circle cx="50" cy="39.5" r="1.5" fill="#ffffff" />

      {/* Right Star Eye */}
      <path d="M78 34 L79.5 38 L83.5 39.5 L79.5 41 L78 45 L76.5 41 L72.5 39.5 L76.5 38 Z" fill="#38bdf8" />
      <circle cx="78" cy="39.5" r="1.5" fill="#ffffff" />

      {/* Rosy Cheeks */}
      <ellipse cx="45" cy="47" rx="3.5" ry="2" fill="#f472b6" opacity="0.85" />
      <ellipse cx="83" cy="47" rx="3.5" ry="2" fill="#f472b6" opacity="0.85" />

      {/* Happy Smile */}
      <path d="M60 44 Q64 50 68 44" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="#ec4899" />

      {/* Laptop Base */}
      <path d="M18 66 L112 66 L104 76 L26 76 Z" fill="#475569" stroke="#c084fc" strokeWidth="2" />
      <rect x="32" y="68" width="66" height="4" rx="2" fill="#1e293b" />
      <rect x="57" y="73" width="16" height="2" rx="1" fill="#94a3b8" />

      {/* Left Waving Hand */}
      <g className="animate-[wiggle_2s_ease-in-out_infinite] origin-[25px_50px]">
        <path d="M30 44 C20 40 14 32 18 26 C21 21 28 26 28 33" stroke="#e0e7ff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="25" r="5" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
      </g>

      {/* Right Waving Hand */}
      <g className="animate-[wiggle_2s_ease-in-out_infinite_reverse] origin-[105px_50px]">
        <path d="M100 44 C110 40 116 28 112 22 C108 18 102 24 102 31" stroke="#e0e7ff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="112" cy="21" r="5" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** Toy rocket blasting off diagonally with orange exhaust plumes */
export function BlastingRocket({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Exhaust Smoke & Flame */}
      <circle cx="10" cy="52" r="5" fill="#ffffff" opacity="0.4" />
      <circle cx="16" cy="46" r="6" fill="#fef08a" opacity="0.8" />
      <path d="M16 42 Q8 54 6 58 Q18 56 22 46 Z" fill="#f97316" />
      <path d="M18 40 Q12 48 10 52 Q16 50 20 44 Z" fill="#fef08a" />

      {/* Rocket Body */}
      <g transform="rotate(-15 35 25)">
        {/* Fins */}
        <polygon points="26,34 16,36 22,42" fill="#ef4444" />
        <polygon points="38,44 42,54 46,46" fill="#ef4444" />
        {/* Main Body */}
        <path d="M46 14 C36 18 26 30 22 40 L38 44 C44 34 50 22 46 14 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Red Nose Cone */}
        <path d="M46 14 C48 10 54 8 54 8 C54 8 50 14 46 14 Z" fill="#ef4444" />
        {/* Blue Window */}
        <circle cx="36" cy="26" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
      </g>
    </svg>
  );
}

/** Cute blue baby elephant sitting and reading an orange book */
export function BabyElephantMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="elephGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93c5fd" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      {/* Big Back Ear */}
      <ellipse cx="28" cy="46" rx="18" ry="24" fill="#60a5fa" />
      <ellipse cx="28" cy="46" rx="12" ry="18" fill="#f472b6" opacity="0.6" />
      {/* Body */}
      <ellipse cx="58" cy="68" rx="26" ry="22" fill="url(#elephGrad)" />
      {/* Feet */}
      <circle cx="44" cy="85" r="9" fill="#3b82f6" />
      <circle cx="68" cy="85" r="9" fill="#3b82f6" />
      {/* Front Ear */}
      <ellipse cx="38" cy="42" rx="16" ry="22" fill="#93c5fd" />
      <ellipse cx="38" cy="42" rx="10" ry="16" fill="#fbcfe8" />
      {/* Head */}
      <circle cx="56" cy="44" r="22" fill="url(#elephGrad)" />
      {/* Cheeks */}
      <circle cx="46" cy="52" r="3.5" fill="#f43f5e" opacity="0.5" />
      <circle cx="66" cy="52" r="3.5" fill="#f43f5e" opacity="0.5" />
      {/* Eyes */}
      <circle cx="50" cy="40" r="3.5" fill="#1e293b" />
      <circle cx="51.5" cy="38.5" r="1.5" fill="#ffffff" />
      <circle cx="62" cy="40" r="3.5" fill="#1e293b" />
      <circle cx="63.5" cy="38.5" r="1.5" fill="#ffffff" />
      {/* Trunk curving forward holding book */}
      <path d="M56 54 Q56 68 68 70 Q76 70 74 62" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Orange Book */}
      <g transform="translate(62, 54) rotate(-15)">
        <rect x="0" y="0" width="22" height="18" rx="3" fill="#f97316" stroke="#ffffff" strokeWidth="1.2" />
        <rect x="3" y="2" width="16" height="14" rx="2" fill="#fed7aa" />
        <line x1="11" y1="2" x2="11" y2="16" stroke="#ea580c" strokeWidth="1" />
      </g>
    </svg>
  );
}

/** Cute cartoon lion cub with friendly face and fluffy golden mane */
export function LionCubMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="maneGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="lionBody" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* Fluffy Mane */}
      <circle cx="50" cy="42" r="34" fill="url(#maneGrad)" />
      {/* Body */}
      <ellipse cx="50" cy="74" rx="24" ry="18" fill="url(#lionBody)" />
      <circle cx="38" cy="85" r="7" fill="#fde047" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="62" cy="85" r="7" fill="#fde047" stroke="#d97706" strokeWidth="1.5" />
      {/* Ears */}
      <circle cx="28" cy="22" r="9" fill="#f59e0b" />
      <circle cx="28" cy="22" r="5" fill="#fbcfe8" />
      <circle cx="72" cy="22" r="9" fill="#f59e0b" />
      <circle cx="72" cy="22" r="5" fill="#fbcfe8" />
      {/* Head */}
      <circle cx="50" cy="42" r="22" fill="url(#lionBody)" />
      {/* Eyes */}
      <circle cx="42" cy="38" r="3.5" fill="#451a03" />
      <circle cx="43.5" cy="36.5" r="1.5" fill="#ffffff" />
      <circle cx="58" cy="38" r="3.5" fill="#451a03" />
      <circle cx="59.5" cy="36.5" r="1.5" fill="#ffffff" />
      {/* Muzzle */}
      <ellipse cx="50" cy="46" rx="9" ry="6" fill="#fef08a" />
      <polygon points="48,43 52,43 50,46" fill="#b45309" />
      <path d="M47 48 Q50 51 53 48" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="37" cy="44" r="3" fill="#f43f5e" opacity="0.6" />
      <circle cx="63" cy="44" r="3" fill="#f43f5e" opacity="0.6" />
    </svg>
  );
}

/** Cheerful cartoon boy mascot in blue shirt */
export function KidBoyMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="34" y="58" width="32" height="34" rx="8" fill="#3b82f6" />
      {/* Collar */}
      <polygon points="44,58 50,66 56,58" fill="#ffffff" />
      {/* Arms */}
      <path d="M34 62 L20 74 L16 82" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
      <path d="M66 62 L80 50 L86 42" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
      <circle cx="88" cy="40" r="5" fill="#fed7aa" />
      <circle cx="15" cy="84" r="5" fill="#fed7aa" />
      {/* Neck */}
      <rect x="46" y="50" width="8" height="10" fill="#fed7aa" />
      {/* Head */}
      <circle cx="50" cy="36" r="18" fill="#fed7aa" />
      {/* Hair */}
      <path d="M32 32 C32 18 68 18 68 32 C68 28 62 22 50 22 C38 22 32 28 32 32 Z" fill="#1e1b4b" />
      <path d="M32 32 L36 38 L42 32 L48 38 L54 32 L60 38 L68 32" fill="#1e1b4b" />
      {/* Eyes */}
      <circle cx="44" cy="36" r="2.5" fill="#0f172a" />
      <circle cx="56" cy="36" r="2.5" fill="#0f172a" />
      {/* Smile */}
      <path d="M46 44 Q50 48 54 44" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="39" cy="40" r="2.5" fill="#fb7185" opacity="0.7" />
      <circle cx="61" cy="40" r="2.5" fill="#fb7185" opacity="0.7" />
    </svg>
  );
}

/** Cheerful cartoon girl mascot with pigtails in red top and dungarees */
export function KidGirlMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pigtails */}
      <ellipse cx="26" cy="34" rx="8" ry="12" fill="#451a03" transform="rotate(-20 26 34)" />
      <ellipse cx="74" cy="34" rx="8" ry="12" fill="#451a03" transform="rotate(20 74 34)" />
      <circle cx="30" cy="32" r="3.5" fill="#ef4444" />
      <circle cx="70" cy="32" r="3.5" fill="#ef4444" />
      {/* Dungarees / Clothes */}
      <rect x="34" y="60" width="32" height="34" rx="6" fill="#2563eb" />
      <rect x="38" y="54" width="24" height="12" fill="#ef4444" />
      <rect x="38" y="56" width="4" height="20" fill="#1d4ed8" />
      <rect x="58" y="56" width="4" height="20" fill="#1d4ed8" />
      <circle cx="40" cy="72" r="1.5" fill="#fbbf24" />
      <circle cx="60" cy="72" r="1.5" fill="#fbbf24" />
      {/* Head */}
      <circle cx="50" cy="36" r="18" fill="#fed7aa" />
      {/* Hair Bangs */}
      <path d="M33 34 C33 20 67 20 67 34 C64 26 58 24 50 24 C42 24 36 26 33 34 Z" fill="#451a03" />
      {/* Eyes */}
      <circle cx="44" cy="36" r="2.5" fill="#0f172a" />
      <circle cx="56" cy="36" r="2.5" fill="#0f172a" />
      {/* Smile */}
      <path d="M46 44 Q50 48 54 44" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="39" cy="40" r="3" fill="#fda4af" />
      <circle cx="61" cy="40" r="3" fill="#fda4af" />
      {/* Arms waving */}
      <path d="M34 62 L22 52 L16 46" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
      <circle cx="14" cy="44" r="4.5" fill="#fed7aa" />
      <path d="M66 62 L78 72 L84 80" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
      <circle cx="86" cy="82" r="4.5" fill="#fed7aa" />
    </svg>
  );
}

/** Glowing golden and wood pirate treasure chest with jewels */
export function TreasureChestMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 80" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chestWood" x1="10" y1="20" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b45309" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Glow */}
      <ellipse cx="45" cy="40" rx="35" ry="25" fill="#fbbf24" opacity="0.3" filter="blur(8px)" />
      {/* Chest Base */}
      <rect x="15" y="36" width="60" height="34" rx="6" fill="url(#chestWood)" stroke="#f59e0b" strokeWidth="2" />
      {/* Chest Lid open */}
      <path d="M 12 36 Q 45 14 78 36" fill="#d97706" stroke="#fbbf24" strokeWidth="2.5" />
      {/* Inner glowing gold jewels */}
      <ellipse cx="45" cy="37" rx="24" ry="7" fill="#fef08a" />
      <circle cx="36" cy="36" r="3" fill="#ec4899" />
      <circle cx="45" cy="35" r="3.5" fill="#38bdf8" />
      <circle cx="54" cy="36" r="3" fill="#22c55e" />
      {/* Gold Bands */}
      <rect x="25" y="36" width="6" height="34" fill="#fbbf24" />
      <rect x="59" y="36" width="6" height="34" fill="#fbbf24" />
      {/* Lock */}
      <rect x="41" y="44" width="8" height="10" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
      <circle cx="45" cy="48" r="1.5" fill="#78350f" />
    </svg>
  );
}

/** Cute friendly green baby dinosaur mascot */
export function DinosaurMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dinoGrad" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {/* Back Spikes */}
      <polygon points="26,22 30,16 34,22" fill="#fbbf24" />
      <polygon points="36,20 40,14 44,20" fill="#fbbf24" />
      <polygon points="46,24 50,18 54,24" fill="#fbbf24" />
      {/* Body */}
      <ellipse cx="38" cy="50" rx="18" ry="16" fill="url(#dinoGrad)" />
      {/* Tail */}
      <path d="M 22 56 Q 10 58 6 68" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Feet */}
      <rect x="28" y="62" width="7" height="10" rx="3" fill="#15803d" />
      <rect x="42" y="62" width="7" height="10" rx="3" fill="#15803d" />
      {/* Head */}
      <circle cx="48" cy="30" r="14" fill="url(#dinoGrad)" />
      <ellipse cx="54" cy="34" rx="8" ry="6" fill="url(#dinoGrad)" />
      {/* Eye */}
      <circle cx="48" cy="26" r="3" fill="#ffffff" />
      <circle cx="49" cy="26" r="1.5" fill="#0f172a" />
      {/* Smile */}
      <path d="M52 36 Q56 40 60 36" stroke="#064e3b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Cheek */}
      <circle cx="45" cy="32" r="2" fill="#f43f5e" opacity="0.6" />
      {/* Belly */}
      <ellipse cx="40" cy="52" rx="10" ry="10" fill="#bbf7d0" />
    </svg>
  );
}

/** Cute fuzzy little purple/blue math monster mascot */
export function MathMonsterMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="monstGrad" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Horns */}
      <polygon points="26,22 22,12 32,18" fill="#f472b6" />
      <polygon points="54,22 58,12 48,18" fill="#f472b6" />
      {/* Fluffy Body */}
      <circle cx="40" cy="46" r="22" fill="url(#monstGrad)" />
      {/* Big Eyes */}
      <circle cx="32" cy="40" r="6" fill="#ffffff" />
      <circle cx="33" cy="40" r="3" fill="#0f172a" />
      <circle cx="48" cy="40" r="6" fill="#ffffff" />
      <circle cx="47" cy="40" r="3" fill="#0f172a" />
      {/* Smile with tooth */}
      <path d="M32 52 Q40 62 48 52 Z" fill="#0f172a" />
      <rect x="38" y="52" width="4" height="4" rx="1" fill="#ffffff" />
      {/* Tiny Feet */}
      <circle cx="32" cy="66" r="5" fill="#4f46e5" />
      <circle cx="48" cy="66" r="5" fill="#4f46e5" />
    </svg>
  );
}

/** Happy glowing golden star with completed chapters count */
export function HappyStarBadge({
  done,
  total,
  className = "",
}: {
  done: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className="size-20 sm:size-24 drop-shadow-[0_0_24px_rgba(251,191,36,0.85)] filter"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="starGrad" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.4" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* 5-pointed cute puffy star */}
        <path
          d="M60 6 L74 40 L112 43 L83 67 L92 105 L60 85 L28 105 L37 67 L8 43 L46 40 Z"
          fill="url(#starGrad)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Cute star eyes */}
        <circle cx="48" cy="46" r="2.5" fill="#78350f" />
        <circle cx="72" cy="46" r="2.5" fill="#78350f" />
        <ellipse cx="44" cy="52" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6" />
        <ellipse cx="76" cy="52" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6" />
        <path d="M54 53 Q60 58 66 53" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      {/* Text in center overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 pointer-events-none text-center">
        <span className="font-display text-base sm:text-lg font-black tracking-tight text-amber-950 drop-shadow-sm">
          {done}/{total}
        </span>
      </div>
    </div>
  );
}

/** Cute cheering astronaut kid shouting happily */
export function CheeringAstronautKid({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={`shrink-0 overflow-visible ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="suitGrad" x1="30" y1="30" x2="70" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="35" y1="20" x2="65" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.6" stopColor="#0284c7" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* Backpack */}
      <rect x="22" y="44" width="56" height="42" rx="10" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="28" cy="88" r="6" fill="#f97316" />
      <circle cx="72" cy="88" r="6" fill="#f97316" />

      {/* Body / Suit */}
      <rect x="32" y="48" width="36" height="40" rx="12" fill="url(#suitGrad)" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="42" y="55" width="16" height="12" rx="3" fill="#1e293b" />
      <circle cx="46" cy="61" r="2" fill="#ef4444" />
      <circle cx="54" cy="61" r="2" fill="#22c55e" />

      {/* Legs */}
      <rect x="36" y="84" width="11" height="18" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="53" y="84" width="11" height="18" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="41.5" cy="102" rx="7" ry="4" fill="#64748b" />
      <ellipse cx="58.5" cy="102" rx="7" ry="4" fill="#64748b" />

      {/* Helmet Base */}
      <circle cx="50" cy="30" r="25" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
      <ellipse cx="50" cy="30" rx="19" ry="16" fill="url(#visorGrad)" stroke="#bae6fd" strokeWidth="1.5" />
      <circle cx="44" cy="28" r="2.5" fill="#ffffff" />
      <circle cx="56" cy="28" r="2.5" fill="#ffffff" />
      <ellipse cx="40" cy="34" rx="2.5" ry="1.5" fill="#fda4af" />
      <ellipse cx="60" cy="34" rx="2.5" ry="1.5" fill="#fda4af" />
      <path d="M47 34 Q50 38 53 34" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M37 20 Q48 16 57 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Both arms raised cheering */}
      <g className="animate-[wiggle_1.8s_ease-in-out_infinite] origin-[30px_52px]">
        <path d="M32 54 L18 36 L12 28" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
        <circle cx="10" cy="26" r="6" fill="#f43f5e" />
      </g>
      <g className="animate-[wiggle_1.8s_ease-in-out_infinite_reverse] origin-[70px_52px]">
        <path d="M68 54 L82 36 L88 28" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
        <circle cx="90" cy="26" r="6" fill="#f43f5e" />
      </g>
    </svg>
  );
}

/** Yellow book mascot wearing glasses */
export function BookMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 95"
      className={`shrink-0 overflow-visible transition-transform duration-300 hover:rotate-3 hover:scale-105 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bookCover" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="0.6" stopColor="#eab308" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="bookPages" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      <rect x="18" y="12" width="64" height="72" rx="10" fill="url(#bookCover)" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-[0_8px_16px_rgba(234,179,8,0.4)]" />
      <path d="M18 14 Q28 14 28 82 L18 82 Z" fill="#b45309" opacity="0.35" />
      <rect x="25" y="16" width="53" height="64" rx="6" fill="url(#bookPages)" />

      {/* Cute Glasses */}
      <circle cx="42" cy="42" r="11" stroke="#451a03" strokeWidth="3" fill="#ffffff" fillOpacity="0.4" />
      <circle cx="64" cy="42" r="11" stroke="#451a03" strokeWidth="3" fill="#ffffff" fillOpacity="0.4" />
      <path d="M53 42 L53 42" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
      <path d="M31 40 L24 38" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M75 40 L82 38" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="42" cy="42" r="3.5" fill="#451a03" />
      <circle cx="44" cy="40" r="1.5" fill="#ffffff" />
      <circle cx="64" cy="42" r="3.5" fill="#451a03" />
      <circle cx="66" cy="40" r="1.5" fill="#ffffff" />
      <ellipse cx="32" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.75" />
      <ellipse cx="74" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.75" />
      <path d="M47 54 Q53 62 59 54" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="#f43f5e" />

      {/* Waving little hands */}
      <path d="M18 48 Q8 40 10 32" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
      <circle cx="10" cy="30" r="4" fill="#fde047" />
      <path d="M82 48 Q92 40 90 32" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
      <circle cx="90" cy="30" r="4" fill="#fde047" />
    </svg>
  );
}

/** Cute smiling green space alien mascot */
export function AlienMascot({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      style={style}
      viewBox="0 0 80 80"
      className={`shrink-0 overflow-visible ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="alienGrad" x1="20" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <path d="M30 25 Q24 10 20 12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="19" cy="12" r="4" fill="#a855f7" />
      <path d="M50 25 Q56 10 60 12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="61" cy="12" r="4" fill="#ec4899" />
      <ellipse cx="40" cy="46" rx="24" ry="20" fill="url(#alienGrad)" stroke="#bbf7d0" strokeWidth="2" />
      <path d="M18 48 Q8 40 10 30" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
      <path d="M62 48 Q72 40 70 30" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="42" r="6" fill="#ffffff" />
      <circle cx="33" cy="42" r="3" fill="#0f172a" />
      <circle cx="48" cy="42" r="6" fill="#ffffff" />
      <circle cx="47" cy="42" r="3" fill="#0f172a" />
      <path d="M34 52 Q40 58 46 52" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Space Puppy astronaut mascot */
export function SpacePuppy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="24" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
      <circle cx="30" cy="30" r="20" fill="#38bdf8" fillOpacity="0.2" />
      <ellipse cx="18" cy="22" rx="5" ry="9" fill="#d97706" transform="rotate(-20 18 22)" />
      <ellipse cx="42" cy="22" rx="5" ry="9" fill="#d97706" transform="rotate(20 42 22)" />
      <circle cx="30" cy="30" r="14" fill="#fef3c7" />
      <ellipse cx="24" cy="28" rx="4" ry="6" fill="#d97706" />
      <circle cx="26" cy="29" r="2" fill="#1e293b" />
      <circle cx="34" cy="29" r="2" fill="#1e293b" />
      <ellipse cx="30" cy="34" rx="2.5" ry="1.8" fill="#451a03" />
      <path d="M28 37 Q30 40 32 37" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Space Bear astronaut mascot */
export function SpaceBear({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="24" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" opacity="0.9" />
      <circle cx="30" cy="30" r="20" fill="#c084fc" fillOpacity="0.2" />
      <circle cx="20" cy="18" r="5" fill="#92400e" />
      <circle cx="40" cy="18" r="5" fill="#92400e" />
      <circle cx="30" cy="31" r="13" fill="#b45309" />
      <ellipse cx="30" cy="35" rx="6" ry="4.5" fill="#fde68a" />
      <circle cx="26" cy="29" r="1.8" fill="#0f172a" />
      <circle cx="34" cy="29" r="1.8" fill="#0f172a" />
      <ellipse cx="30" cy="34" rx="2" ry="1.2" fill="#0f172a" />
      <path d="M29 37 Q30 38.5 31 37" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Space Kitty mascot */
export function SpaceKitty({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="24" fill="#1e1b4b" stroke="#f472b6" strokeWidth="2" opacity="0.9" />
      <circle cx="30" cy="30" r="20" fill="#f472b6" fillOpacity="0.2" />
      <path d="M18 24 L22 14 L28 22 Z" fill="#93c5fd" />
      <path d="M42 24 L38 14 L32 22 Z" fill="#93c5fd" />
      <circle cx="30" cy="31" r="13" fill="#bfdbfe" />
      <circle cx="26" cy="29" r="2" fill="#1e3a8a" />
      <circle cx="34" cy="29" r="2" fill="#1e3a8a" />
      <polygon points="29,33 31,33 30,35" fill="#f43f5e" />
      <path d="M22 33 L16 32 M22 35 L16 36 M38 33 L44 32 M38 35 L44 36" stroke="#1e3a8a" strokeWidth="1" />
    </svg>
  );
}

/** Vintage Computer & Monitor Mascot */
export function ComputerMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 80" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="monitorGrad" x1="10" y1="10" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect x="18" y="10" width="54" height="42" rx="8" fill="url(#monitorGrad)" stroke="#a5f3fc" strokeWidth="2" />
      <rect x="23" y="15" width="44" height="32" rx="4" fill="#082f49" />
      <circle cx="36" cy="28" r="3" fill="#38bdf8" />
      <circle cx="37" cy="27" r="1" fill="#ffffff" />
      <circle cx="54" cy="28" r="3" fill="#38bdf8" />
      <circle cx="55" cy="27" r="1" fill="#ffffff" />
      <path d="M41 36 Q45 40 49 36" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="40" y="52" width="10" height="7" fill="#0e7490" />
      <ellipse cx="45" cy="60" rx="15" ry="4" fill="#0891b2" />
      <rect x="15" y="62" width="60" height="12" rx="3" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
      <rect x="20" y="65" width="50" height="3" rx="1" fill="#67e8f9" />
    </svg>
  );
}

/** Calculator & Floating Coins Mascot */
export function CalculatorMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 85" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="animate-bounce origin-center" style={{ animationDuration: "2.5s" }}>
        <circle cx="20" cy="22" r="11" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
        <text x="16" y="26" fill="#78350f" fontSize="11" fontWeight="bold">₹</text>
      </g>
      <circle cx="16" cy="54" r="8" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="13" y="58" fill="#451a03" fontSize="8" fontWeight="bold">₹</text>

      <rect x="36" y="18" width="46" height="60" rx="9" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="2" />
      <rect x="42" y="24" width="34" height="18" rx="4" fill="#1e3a8a" />
      <circle cx="51" cy="31" r="2" fill="#60a5fa" />
      <circle cx="67" cy="31" r="2" fill="#60a5fa" />
      <path d="M56 36 Q59 39 62 36" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="42" y="47" width="9" height="7" rx="2" fill="#60a5fa" />
      <rect x="54" y="47" width="9" height="7" rx="2" fill="#60a5fa" />
      <rect x="66" y="47" width="9" height="7" rx="2" fill="#f59e0b" />
      <rect x="42" y="57" width="9" height="7" rx="2" fill="#60a5fa" />
      <rect x="54" y="57" width="9" height="7" rx="2" fill="#60a5fa" />
      <rect x="66" y="57" width="9" height="7" rx="2" fill="#10b981" />
      <rect x="42" y="67" width="21" height="7" rx="2" fill="#93c5fd" />
      <rect x="66" y="67" width="9" height="7" rx="2" fill="#ef4444" />
    </svg>
  );
}

/** Yellow Triangle Ruler Mascot */
export function RulerMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 85" className={`shrink-0 overflow-visible ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rulerGrad" x1="10" y1="10" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <path d="M20 74 L80 74 L20 14 Z" fill="url(#rulerGrad)" stroke="#ffffff" strokeWidth="2" className="filter drop-shadow-[0_4px_12px_rgba(202,138,4,0.5)]" />
      <path d="M30 66 L62 66 L30 34 Z" fill="#1f1138" stroke="#ca8a04" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="26" y2="20" stroke="#78350f" strokeWidth="1.5" />
      <line x1="20" y1="36" x2="26" y2="36" stroke="#78350f" strokeWidth="1.5" />
      <line x1="20" y1="52" x2="26" y2="52" stroke="#78350f" strokeWidth="1.5" />
      <line x1="36" y1="74" x2="36" y2="68" stroke="#78350f" strokeWidth="1.5" />
      <line x1="52" y1="74" x2="52" y2="68" stroke="#78350f" strokeWidth="1.5" />
      <line x1="68" y1="74" x2="68" y2="68" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  );
}

/** Glowing Tamil Letter 'அ' */
export function TamilLetterA({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[72px] sm:text-[90px] font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-purple-300 via-fuchsia-400 to-purple-600 drop-shadow-[0_0_25px_rgba(192,132,252,0.9)] ${className}`}
    >
      அ
    </span>
  );
}

/** Winding glowing board-game road with stepping stones and walking space animals */
export function BoardGameTrailSvg({
  done,
  total,
  className = "",
}: {
  done: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <svg
        viewBox="0 0 340 95"
        className="w-[280px] sm:w-[320px] md:w-[350px] h-[75px] sm:h-[90px] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="roadGrad" x1="10" y1="70" x2="320" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#581c87" />
            <stop offset="0.5" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#9333ea" />
          </linearGradient>
        </defs>

        {/* Glowing Winding Road Surface */}
        <path
          d="M 15 70 C 70 70, 95 24, 160 24 C 220 24, 240 68, 290 40 C 305 32, 318 26, 330 22"
          stroke="url(#roadGrad)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="filter drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]"
        />
        {/* Road Center Line (dashed neon) */}
        <path
          d="M 15 70 C 70 70, 95 24, 160 24 C 220 24, 240 68, 290 40 C 305 32, 318 26, 330 22"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="6 8"
          opacity="0.8"
        />

        {/* Stepping Stones / Milestones ① ② ③ ④ ⑤ */}
        <g transform="translate(65, 46)">
          <circle cx="0" cy="0" r="8" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
          <text x="-3" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">1</text>
        </g>
        <g transform="translate(110, 24)">
          <circle cx="0" cy="0" r="8" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="-3" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">2</text>
        </g>
        <g transform="translate(170, 26)">
          <circle cx="0" cy="0" r="8" fill="#1e1b4b" stroke="#f472b6" strokeWidth="1.5" />
          <text x="-3" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">3</text>
        </g>
        <g transform="translate(230, 52)">
          <circle cx="0" cy="0" r="8" fill="#1e1b4b" stroke="#4ade80" strokeWidth="1.5" />
          <text x="-3" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">4</text>
        </g>
        <g transform="translate(285, 42)">
          <circle cx="0" cy="0" r="8" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" />
          <text x="-3" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">5</text>
        </g>

        {/* Walking Space Bear & Space Puppy on Road (Left) */}
        <g transform="translate(25, 48) scale(0.65)">
          {/* Bear Astronaut */}
          <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#c084fc" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="12" ry="10" fill="#38bdf8" opacity="0.8" />
          <circle cx="-10" cy="-12" r="5" fill="#92400e" />
          <circle cx="10" cy="-12" r="5" fill="#92400e" />
          <circle cx="0" cy="0" r="8" fill="#b45309" />
          <circle cx="-3" cy="-2" r="1.5" fill="#ffffff" />
          <circle cx="3" cy="-2" r="1.5" fill="#ffffff" />
        </g>
        <g transform="translate(48, 48) scale(0.65)">
          {/* Puppy Astronaut */}
          <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="12" ry="10" fill="#38bdf8" opacity="0.8" />
          <ellipse cx="-10" cy="-8" rx="4" ry="7" fill="#d97706" />
          <ellipse cx="10" cy="-8" rx="4" ry="7" fill="#d97706" />
          <circle cx="0" cy="0" r="8" fill="#fef3c7" />
          <circle cx="-3" cy="-1" r="1.5" fill="#000000" />
          <circle cx="3" cy="-1" r="1.5" fill="#000000" />
        </g>

        {/* Saturn alongside road */}
        <g transform="translate(195, 60)">
          <circle cx="0" cy="0" r="7" fill="#f43f5e" />
          <ellipse cx="0" cy="0" rx="14" ry="3.5" stroke="#fde047" strokeWidth="1.5" transform="rotate(-15)" />
        </g>
      </svg>
    </div>
  );
}

/** Cosmic doodles background: smiling stars, rockets, planets & constellation dots */
export function CosmicBackgroundDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-85" aria-hidden="true">
      {/* Big Saturn on Far Left */}
      <div className="absolute top-48 -left-8 opacity-80">
        <svg viewBox="0 0 100 80" className="size-24" fill="none">
          <circle cx="50" cy="40" r="24" fill="#fb923c" />
          <ellipse cx="50" cy="40" rx="44" ry="12" stroke="#fde047" strokeWidth="4" transform="rotate(-20 50 40)" />
        </svg>
      </div>

      {/* Smiling Blue Planet on Left */}
      <div className="absolute top-96 left-4 opacity-80">
        <svg viewBox="0 0 50 50" className="size-12" fill="none">
          <circle cx="25" cy="25" r="18" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" />
          <circle cx="20" cy="22" r="2" fill="#0369a1" />
          <circle cx="30" cy="22" r="2" fill="#0369a1" />
          <path d="M22 28 Q25 31 28 28" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Smiling Yellow Saturn on Top Center */}
      <div className="absolute top-10 left-[42%] opacity-85 animate-pulse" style={{ animationDuration: "3s" }}>
        <svg viewBox="0 0 60 50" className="size-14" fill="none">
          <circle cx="30" cy="25" r="16" fill="#facc15" stroke="#fef08a" strokeWidth="2" />
          <ellipse cx="30" cy="25" rx="28" ry="7" stroke="#fb923c" strokeWidth="2.5" transform="rotate(-15 30 25)" />
          <circle cx="25" cy="22" r="2" fill="#713f12" />
          <circle cx="35" cy="22" r="2" fill="#713f12" />
          <path d="M27 28 Q30 32 33 28" stroke="#713f12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Friendly Green Alien on Top Right */}
      <div className="absolute top-16 right-[38%] animate-bounce" style={{ animationDuration: "4s" }}>
        <AlienMascot className="size-14" />
      </div>

      {/* Smiling Stars */}
      <svg className="absolute top-6 left-6 size-7 animate-pulse text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 5.3 5.6.8-4 4.1 1 5.8-5-2.8-5 2.8 1-5.8-4-4.1 5.6-.8z" />
        <circle cx="10" cy="11" r="0.8" fill="#78350f" />
        <circle cx="14" cy="11" r="0.8" fill="#78350f" />
      </svg>
      <svg className="absolute top-36 right-10 size-6 animate-pulse text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" style={{ animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 5.3 5.6.8-4 4.1 1 5.8-5-2.8-5 2.8 1-5.8-4-4.1 5.6-.8z" />
      </svg>
    </div>
  );
}

/** Peeking spaceship graphic for card corners */
export function PeekingSpaceship({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="25" rx="22" ry="10" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" />
      <ellipse cx="30" cy="20" rx="12" ry="8" fill="#ec4899" />
      <circle cx="26" cy="19" r="2" fill="#fff" />
      <circle cx="34" cy="19" r="2" fill="#fff" />
      <circle cx="20" cy="26" r="2" fill="#facc15" />
      <circle cx="30" cy="28" r="2" fill="#facc15" />
      <circle cx="40" cy="26" r="2" fill="#facc15" />
      <path d="M25 34 Q30 46 35 34 Z" fill="#f97316" />
      <path d="M27 34 Q30 42 33 34 Z" fill="#fde047" />
    </svg>
  );
}

/** Astronaut Book Mascot - Smiling yellow book in astronaut bubble helmet */
export function AstronautBookMascot({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      style={style}
      viewBox="0 0 120 120"
      className={`shrink-0 overflow-visible transition-transform duration-300 hover:scale-105 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="astroHelmetGlow" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" stopOpacity="0.4" />
          <stop offset="0.7" stopColor="#c084fc" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="astroBookCover" x1="30" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="astroSuitGrad" x1="35" y1="85" x2="85" y2="115" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Backpack & Helmet Collar */}
      <rect x="25" y="80" width="70" height="24" rx="8" fill="#94a3b8" />
      <rect x="34" y="86" width="52" height="28" rx="10" fill="url(#astroSuitGrad)" stroke="#64748b" strokeWidth="2" />
      {/* Suit Chest Details */}
      <circle cx="50" cy="98" r="3" fill="#38bdf8" />
      <circle cx="60" cy="98" r="3" fill="#ec4899" />
      <circle cx="70" cy="98" r="3" fill="#facc15" />
      <rect x="46" y="104" width="28" height="4" rx="2" fill="#0284c7" />

      {/* Bubble Helmet Outer Circle */}
      <circle cx="60" cy="50" r="42" fill="#0c1226" fillOpacity="0.7" stroke="#38bdf8" strokeWidth="3.5" className="filter drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]" />
      <circle cx="60" cy="50" r="42" fill="url(#astroHelmetGlow)" />

      {/* Yellow Book Inside Helmet */}
      <rect x="38" y="26" width="44" height="48" rx="7" fill="url(#astroBookCover)" stroke="#ffffff" strokeWidth="2" />
      {/* Red Ribbon Bookmark */}
      <path d="M72 23 L72 35 L76 32 L80 35 L80 23 Z" fill="#ef4444" />
      {/* Book Pages */}
      <rect x="42" y="29" width="36" height="42" rx="4" fill="#ffffff" />

      {/* Book Face: Cute Eyes & Smile */}
      <circle cx="52" cy="45" r="3" fill="#1e293b" />
      <circle cx="53.5" cy="43.5" r="1.2" fill="#ffffff" />
      <circle cx="68" cy="45" r="3" fill="#1e293b" />
      <circle cx="69.5" cy="43.5" r="1.2" fill="#ffffff" />
      {/* Rosy Cheeks */}
      <ellipse cx="46" cy="52" rx="3" ry="1.8" fill="#fb7185" />
      <ellipse cx="74" cy="52" rx="3" ry="1.8" fill="#fb7185" />
      {/* Happy Open Smile */}
      <path d="M56 50 Q60 56 64 50" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="#f43f5e" />

      {/* Helmet Glass Reflection Arc */}
      <path d="M30 38 A 36 36 0 0 1 76 18" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <path d="M26 48 A 36 36 0 0 1 32 35" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

      {/* Waving Astronaut Gloved Hands */}
      <g className="animate-bounce" style={{ animationDuration: "2s" }}>
        <path d="M25 60 Q12 50 16 40" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <circle cx="16" cy="38" r="6" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: "2.4s" }}>
        <path d="M95 60 Q108 50 104 40" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <circle cx="104" cy="38" r="6" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** Tiger Cub Mascot - Adorable waving cartoon tiger cub */
export function TigerCubMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`shrink-0 overflow-visible transition-transform duration-300 hover:scale-110 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail */}
      <path d="M82 68 Q95 55 92 40 Q88 35 84 42 Q86 52 76 60" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M87 45 L91 47" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
      <path d="M85 53 L89 56" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="50" cy="68" rx="26" ry="22" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
      {/* White Chest */}
      <ellipse cx="50" cy="72" rx="15" ry="14" fill="#fffbeb" />

      {/* Body Stripes */}
      <path d="M26 66 Q34 68 36 64" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M74 66 Q66 68 64 64" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />

      {/* Feet / Paws */}
      <ellipse cx="34" cy="88" rx="8" ry="6" fill="#fffbeb" stroke="#f97316" strokeWidth="2" />
      <ellipse cx="66" cy="88" rx="8" ry="6" fill="#fffbeb" stroke="#f97316" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="50" cy="38" rx="28" ry="24" fill="#f97316" stroke="#ea580c" strokeWidth="2" />

      {/* Ears */}
      <circle cx="28" cy="18" r="10" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
      <circle cx="28" cy="18" r="6" fill="#fbcfe8" />
      <circle cx="72" cy="18" r="10" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
      <circle cx="72" cy="18" r="6" fill="#fbcfe8" />

      {/* Face Muzzle (White) */}
      <ellipse cx="50" cy="45" rx="14" ry="10" fill="#fffbeb" />

      {/* Forehead Stripes */}
      <path d="M50 18 L50 25" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M43 22 L46 26" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
      <path d="M57 22 L54 26" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />

      {/* Cheek Stripes */}
      <path d="M24 36 L30 38" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M23 42 L29 43" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M76 36 L70 38" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M77 42 L71 43" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="39" cy="35" r="5" fill="#1e293b" />
      <circle cx="41" cy="33" r="2" fill="#ffffff" />
      <circle cx="61" cy="35" r="5" fill="#1e293b" />
      <circle cx="63" cy="33" r="2" fill="#ffffff" />

      {/* Cute Pink Nose */}
      <polygon points="47,42 53,42 50,46" fill="#f43f5e" />

      {/* Smiling Mouth */}
      <path d="M46 47 Q50 51 54 47" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M50 46 L50 48" stroke="#7c2d12" strokeWidth="1.5" />

      {/* Waving Paw */}
      <g className="animate-bounce" style={{ animationDuration: "1.8s" }}>
        <ellipse cx="18" cy="46" rx="7" ry="5" fill="#fffbeb" stroke="#f97316" strokeWidth="2" transform="rotate(-30 18 46)" />
        <circle cx="15" cy="44" r="1.5" fill="#f43f5e" />
        <circle cx="18" cy="42" r="1.5" fill="#f43f5e" />
        <circle cx="21" cy="43" r="1.5" fill="#f43f5e" />
      </g>
    </svg>
  );
}

/** Rainbow Shooting Star Banner for Header */
export function ShootingStarBanner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rainbowTail" x1="0" y1="25" x2="130" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" stopOpacity="0" />
          <stop offset="0.3" stopColor="#ec4899" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#a855f7" />
          <stop offset="0.8" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#facc15" />
        </linearGradient>
      </defs>
      {/* Rainbow Tail Waves */}
      <path d="M0 38 Q60 44 125 22 Q135 18 140 18" stroke="url(#rainbowTail)" strokeWidth="9" strokeLinecap="round" />
      <path d="M10 32 Q70 38 128 20 Q136 16 142 16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Glowing Star Head */}
      <g transform="translate(132, 4) scale(0.9)">
        <polygon points="15,0 20,10 30,12 22,20 25,30 15,24 5,30 8,20 0,12 10,10" fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" className="filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" />
        <circle cx="12" cy="14" r="1.5" fill="#78350f" />
        <circle cx="18" cy="14" r="1.5" fill="#78350f" />
      </g>
    </svg>
  );
}
