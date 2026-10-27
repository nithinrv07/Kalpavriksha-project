"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useLocale } from "@/components/locale-provider";
import { bootTheme, useTheme } from "@/lib/theme";

/**
 * Ensures stored theme preference is booted and synced with DOM
 * without any flash of unstyled content.
 */
export function ThemeBoot() {
  useEffect(() => {
    bootTheme();
  }, []);
  return null;
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Sleek dual-theme toggle button switching between Obsidian Dark and Luminous Light.
 * Supports both compact icon mode (for headers/navs) and labeled mode.
 */
export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const { locale } = useLocale();

  const label = isDark
    ? locale === "ta"
      ? "ஒளி பயன்முறைக்கு மாற்றவும்"
      : "Switch to light mode"
    : locale === "ta"
      ? "இருள் பயன்முறைக்கு மாற்றவும்"
      : "Switch to dark mode";

  const currentModeText = isDark
    ? locale === "ta"
      ? "இருள் பயன்முறை"
      : "Dark mode"
    : locale === "ta"
      ? "ஒளி பயன்முறை"
      : "Light mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`group relative flex items-center justify-center gap-2 rounded-xl border border-line bg-surface/60 text-muted backdrop-blur-md transition-all duration-200 hover:border-violet/40 hover:bg-surface hover:text-text active:scale-[0.96] ${
        showLabel ? "h-11 px-3.5 font-mono text-[13.5px]" : "size-11"
      } ${className}`}
    >
      <span className="relative grid size-5 place-items-center">
        {/* Sun icon for light mode transition */}
        <Sun
          size={19}
          weight="duotone"
          className={`absolute transition-all duration-300 ${
            isDark
              ? "scale-100 rotate-0 opacity-100 text-amber-300 group-hover:text-amber-200"
              : "scale-0 -rotate-90 opacity-0"
          }`}
          aria-hidden
        />
        {/* Moon icon for dark mode transition */}
        <Moon
          size={19}
          weight="duotone"
          className={`absolute transition-all duration-300 ${
            !isDark
              ? "scale-100 rotate-0 opacity-100 text-violet-600 dark:text-violet-300 group-hover:text-violet-700"
              : "scale-0 rotate-90 opacity-0"
          }`}
          aria-hidden
        />
      </span>

      {showLabel && (
        <span className="font-medium tracking-tight">
          {currentModeText}
        </span>
      )}
    </button>
  );
}
