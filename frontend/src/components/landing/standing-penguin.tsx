"use client";

import Image from "next/image";
import { useState, useCallback, useRef } from "react";

const QUOTES = [
  "Smile and wave, boys. Smile and wave! 🐧",
  "Kowalski, analysis! 📊",
  "Cute and cuddly, boys. Cute and cuddly! ✨",
  "Status report! 🫡",
  "Kaboom? Yes, Rico, kaboom. 💥",
  "No thinking! Just execution. 🚀",
  "Rooted to rise! 🌲",
];

export function StandingPenguin() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const playClickSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch {
      // AudioContext may be restricted before user gesture
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();

      setIsBouncing(true);
      setBubbleVisible(true);
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);

      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        setBubbleVisible(false);
      }, 3000);

      window.setTimeout(() => {
        setIsBouncing(false);
      }, 450);
    },
    [playClickSound]
  );

  return (
    <div
      onClick={handleClick}
      className="group relative z-20 flex shrink-0 cursor-pointer flex-col items-center select-none"
      title="Click Skipper!"
    >
      {/* Speech bubble */}
      <div
        className={`pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-violet/40 bg-surface/95 px-3.5 py-1.5 font-mono text-[11.5px] text-violet-ink shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5)] backdrop-blur-md transition-all duration-300 sm:text-[12.5px] ${
          bubbleVisible
            ? "scale-100 opacity-100 -translate-y-2"
            : "scale-90 opacity-0 translate-y-1"
        }`}
      >
        <span>{QUOTES[quoteIndex]}</span>
        <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-violet/40 bg-surface/95" />
      </div>

      {/* The Cutout Penguin Image with Full Body & Feet */}
      <div
        className={`relative will-change-transform transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
          isBouncing ? "animate-bounce" : ""
        }`}
        style={{
          filter:
            "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 15px rgba(124, 58, 237, 0.25))",
        }}
      >
        <Image
          src="/images/skipper-penguin.png"
          alt="Skipper Penguin"
          width={538}
          height={951}
          priority
          draggable={false}
          className="h-[140px] w-auto sm:h-[185px] lg:h-[235px] object-contain transition-transform duration-200 group-hover:-rotate-2"
        />
      </div>

      {/* Ground Contact Shadow under Feet */}
      <div
        aria-hidden
        className="mt-[-8px] h-3 w-28 rounded-full bg-black/70 blur-[3px] transition-transform duration-300 group-hover:scale-95 sm:w-36"
      />
    </div>
  );
}

export default StandingPenguin;
