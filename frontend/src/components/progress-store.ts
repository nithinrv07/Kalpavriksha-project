"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, parseProgress, type Progress } from "@/lib/progress";

const STORAGE_KEY = "kalpavriksha.progress";

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? parseProgress(JSON.parse(raw)) : EMPTY_PROGRESS;
  } catch {
    cache = EMPTY_PROGRESS;
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the progress: drop the cache and re-read.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Apply a pure reducer from `lib/progress` and persist the result on this device. */
export function updateProgress(fn: (p: Progress) => Progress) {
  const next = fn(read());
  if (next === cache) return;
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode): progress lasts for this visit only.
  }
  for (const l of listeners) l();
}

/** Server and first client render see empty progress; stored progress arrives right after hydration. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY_PROGRESS);
}
