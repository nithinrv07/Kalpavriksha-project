"use client";

import { useSyncExternalStore } from "react";

/**
 * Light / dark theme. The first visit follows the device setting; a choice made
 * with the toggle is remembered per device. Applied as `data-theme` on <html>
 * (an inline script in the root layout sets it before the first paint).
 */
export type Theme = "light" | "dark";

const KEY = "kalpavriksha.theme";

function systemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const set = document.documentElement.dataset.theme;
  return set === "light" || set === "dark" ? set : systemTheme();
}

const listeners = new Set<() => void>();

export function setTheme(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // Storage unavailable: the choice lasts for this visit.
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current theme. The server render assumes dark; the real value arrives on hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "dark");
}
