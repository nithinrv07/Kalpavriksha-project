"use client";

import { ArrowsIn, ArrowsOut } from "@phosphor-icons/react/ssr";
import { useIsFullscreen, toggleFullscreen } from "@/lib/fullscreen";

export function FullScreenToggle({ className }: { className?: string }) {
  const isFs = useIsFullscreen();

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      title={isFs ? "Exit Fullscreen" : "Enter Fullscreen"}
      aria-label={isFs ? "Exit Fullscreen" : "Enter Fullscreen"}
      className={
        className ??
        "grid size-9 place-items-center rounded-xl border border-purple-800/40 bg-purple-950/50 text-purple-300 transition-colors hover:border-purple-600/60 hover:text-white"
      }
    >
      {isFs ? <ArrowsIn size={16} weight="bold" /> : <ArrowsOut size={16} weight="bold" />}
    </button>
  );
}
