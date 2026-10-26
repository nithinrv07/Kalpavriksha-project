"use client";

/*
 * Small, dependency-free feedback kit: a shared "cue" event that plays a
 * gentle synthesized sound, buzzes a tablet, and lets one global layer draw
 * the sparkle at the exact tap point. No audio files, so nothing to download.
 */

import { useSyncExternalStore } from "react";

export type CueKind = "correct" | "wrong" | "complete";

export type CueDetail = {
  kind: CueKind;
  x?: number;
  y?: number;
};

export const CUE_EVENT = "kalpavriksha:cue";

const SOUND_KEY = "kalpavriksha.sound";

let soundOn = true;
let hydrated = false;
const listeners = new Set<() => void>();

function ensurePrefs() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    soundOn = window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    soundOn = true;
  }
}

export function setSoundOn(next: boolean) {
  ensurePrefs();
  soundOn = next;
  try {
    window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
  } catch {
    // Storage unavailable: the choice lasts for this visit.
  }
  for (const l of listeners) l();
}

export function getSoundOn() {
  ensurePrefs();
  return soundOn;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Whether cues are audible. Server render assumes on. */
export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, getSoundOn, () => true);
}

type Note = { freq: number; at: number; len: number; gain: number; type?: OscillatorType };

const CUES: Record<CueKind, Note[]> = {
  correct: [
    { freq: 783.99, at: 0, len: 0.1, gain: 0.05 },
    { freq: 1046.5, at: 0.085, len: 0.16, gain: 0.045 },
  ],
  wrong: [
    { freq: 220, at: 0, len: 0.12, gain: 0.035, type: "triangle" },
    { freq: 174.61, at: 0.09, len: 0.18, gain: 0.03, type: "triangle" },
  ],
  complete: [
    { freq: 523.25, at: 0, len: 0.12, gain: 0.045 },
    { freq: 659.25, at: 0.1, len: 0.12, gain: 0.045 },
    { freq: 783.99, at: 0.2, len: 0.14, gain: 0.045 },
    { freq: 1046.5, at: 0.3, len: 0.24, gain: 0.04 },
  ],
};

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function play(kind: CueKind) {
  if (!getSoundOn()) return;
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime + 0.01;
  for (const n of CUES[kind]) {
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.type = n.type ?? "sine";
    osc.frequency.value = n.freq;
    env.gain.setValueAtTime(0.0001, now + n.at);
    env.gain.exponentialRampToValueAtTime(n.gain, now + n.at + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + n.at + n.len);
    osc.connect(env).connect(ac.destination);
    osc.start(now + n.at);
    osc.stop(now + n.at + n.len + 0.02);
  }
}

/** Play a cue's sound only (used when the layer already knows the reason). */
export function playCue(kind: CueKind) {
  play(kind);
}

/**
 * Fire feedback for a correct/wrong answer or a finished activity.
 * Pass the pointer position to draw the sparkle exactly where the child tapped.
 */
export function cue(kind: CueKind, at?: { x?: number; y?: number }) {
  play(kind);
  if (kind === "correct" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate?.(12);
    } catch {
      // Vibration is optional.
    }
  }
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CueDetail>(CUE_EVENT, { detail: { kind, ...at } }));
}
