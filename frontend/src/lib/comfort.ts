"use client";

import { useSyncExternalStore } from "react";

/**
 * Two comfort switches a teacher can flip on a shared tablet:
 * calm (no motion, no glow, no blur) and projector (brighter, larger text).
 * The choice is applied as `data-calm` / `data-projector` on <html> so CSS and
 * the animated canvases can all read it, and it is remembered per device.
 */
export type Comfort = {
  calm: boolean;
  projector: boolean;
};

const KEY = "kalpavriksha.comfort";
const DEFAULTS: Comfort = { calm: false, projector: false };

let state: Comfort = DEFAULTS;
let hydrated = false;
const listeners = new Set<() => void>();

function apply(next: Comfort) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.calm = next.calm ? "true" : "false";
  root.dataset.projector = next.projector ? "true" : "false";
}

/** Read the saved choice and put it on <html>. Safe to call more than once. */
export function bootComfort() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Comfort>;
      state = {
        calm: parsed.calm === true,
        projector: parsed.projector === true,
      };
    }
  } catch {
    state = DEFAULTS;
  }
  apply(state);
  for (const l of listeners) l();
}

export function setComfort(key: keyof Comfort, value: boolean) {
  bootComfort();
  state = { ...state, [key]: value };
  apply(state);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable: the choice lasts for this visit.
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current switches. Server render assumes both off. */
export function useComfort(): Comfort {
  return useSyncExternalStore(subscribe, () => state, () => DEFAULTS);
}

/**
 * Read by animation loops. Reading the DOM attribute (instead of React state)
 * keeps this usable inside requestAnimationFrame without re-rendering.
 */
export function isCalm(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.calm === "true";
}
