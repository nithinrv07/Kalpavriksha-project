"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const KEY = "kalpavriksha.theme";
let currentTheme: Theme = "dark";
let initialized = false;
const listeners = new Set<() => void>();

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
}

export function bootTheme() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") {
      currentTheme = saved;
    } else {
      currentTheme = "dark";
    }
  } catch {
    currentTheme = "dark";
  }
  applyTheme(currentTheme);
  for (const l of listeners) l();
}

export function setTheme(theme: Theme) {
  bootTheme();
  currentTheme = theme;
  applyTheme(theme);
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {}
  for (const l of listeners) l();
}

export function toggleTheme() {
  bootTheme();
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme(): {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} {
  const theme = useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => "dark" as Theme
  );

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    setTheme,
    toggleTheme,
  };
}
