"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
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

/* --------------------------------------------------------------------------
 * Theme reveal — View Transitions API (Skiper26 "circle + blur")
 *
 * The incoming theme is revealed through an expanding circular clip-path
 * while both snapshots ramp through a blur, so the swap reads as a soft
 * radial bloom instead of a hard repaint.
 * ----------------------------------------------------------------------- */

const STYLE_ID = "kalpavriksha-theme-transition";

/** `document.startViewTransition` is not in every TS DOM lib yet. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> } | undefined;
};

const REVEAL_CSS = `
::view-transition-group(root) {
  animation-duration: 0.8s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
::view-transition-new(root) {
  animation-name: kp-theme-reveal-light;
  filter: blur(2px);
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation-name: kp-theme-reveal-dark;
  filter: blur(2px);
}
@keyframes kp-theme-reveal-dark {
  from {
    clip-path: circle(0% at 50% 50%);
    filter: blur(8px);
  }
  50% {
    filter: blur(4px);
  }
  to {
    clip-path: circle(150% at 50% 50%);
    filter: blur(0px);
  }
}
@keyframes kp-theme-reveal-light {
  from {
    clip-path: circle(0% at 50% 50%);
    filter: blur(8px);
  }
  50% {
    filter: blur(4px);
  }
  to {
    clip-path: circle(150% at 50% 50%);
    filter: blur(0px);
  }
}
`;

/** Injects the transition stylesheet once, before any theme swap happens. */
function ensureTransitionStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = REVEAL_CSS;
  document.head.appendChild(style);
}

/**
 * Swaps the theme inside a circular View Transition, falling back to an
 * instant swap when the API is missing or the user prefers reduced motion.
 */
function useAnimatedThemeToggle() {
  const { isDark, setTheme } = useTheme();
  const transitioning = useRef(false);

  useEffect(() => {
    ensureTransitionStyles();
  }, []);

  return useCallback(() => {
    const next = isDark ? "light" : "dark";
    const doc = document as ViewTransitionDocument;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof doc.startViewTransition !== "function" || transitioning.current) {
      setTheme(next);
      return;
    }

    ensureTransitionStyles();
    transitioning.current = true;

    const transition = doc.startViewTransition(() => {
      setTheme(next);
    });

    const done = () => {
      transitioning.current = false;
    };

    if (transition && typeof transition.finished?.then === "function") {
      transition.finished.then(done, done);
    } else {
      done();
    }
  }, [isDark, setTheme]);
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  "data-no-flip"?: boolean;
}

/**
 * Circular glass theme toggle (Skiper26 button) that morphs its half-moon
 * glyph and reveals the incoming theme with a blurred radial wipe.
 * Supports both compact icon mode (for headers/navs) and labeled mode.
 */
export function ThemeToggle({
  className = "",
  showLabel = false,
  ...props
}: ThemeToggleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isDark } = useTheme();
  const { locale } = useLocale();
  const toggleWithTransition = useAnimatedThemeToggle();

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
      onClick={toggleWithTransition}
      aria-label={label}
      title={label}
      className={`group relative flex items-center justify-center gap-2 rounded-xl border border-line bg-surface/60 text-muted backdrop-blur-md transition-all duration-200 hover:border-violet/40 hover:bg-surface hover:text-text active:scale-[0.96] ${
        showLabel ? "h-11 px-3.5 font-mono text-[13.5px]" : "size-11"
      } ${className}`}
      {...props}
    >
      <span className="relative grid size-5 place-items-center text-violet transition-colors duration-200 group-hover:text-violet-bright">
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-[19px]"
          aria-hidden
        >
          <motion.g
            animate={{ rotate: isDark ? -180 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          >
            <path
              d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
              fill="currentColor"
            />
            <path
              d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
              fill="currentColor"
              fillOpacity={0.24}
            />
          </motion.g>
          <motion.path
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
            fill="currentColor"
          />
        </svg>
      </span>

      {showLabel && (
        <span className="font-medium tracking-tight">{currentModeText}</span>
      )}
    </button>
  );
}

/**
 * Theme_buttons_002 — inspired by Skiper UI (skiper26) / rudrodip's
 * view-transition theme toggle. Rebuilt against Kalpavriksha's own theme
 * store (`@/lib/theme`) instead of next-themes.
 */
