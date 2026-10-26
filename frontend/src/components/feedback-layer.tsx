"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Burst } from "@/components/burst";
import { useProgress } from "@/components/progress-store";
import { CUE_EVENT, playCue, type CueDetail } from "@/lib/feedback";

type Pop = {
  id: number;
  x: number;
  y: number;
  kind: "correct" | "wrong" | "xp";
  label?: string;
};

const LIFETIME = 1200;

/**
 * One global layer for tap feedback: sparkle at the finger, a soft shake ring
 * for a miss, and a "+N XP" chip whenever the shared progress actually grows.
 */
export function FeedbackLayer() {
  const progress = useProgress();
  const [pops, setPops] = useState<Pop[]>([]);
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const seenXp = useRef<number | null>(null);
  const xpNow = useRef(progress.xp);
  xpNow.current = progress.xp;
  const ready = useRef(false);

  const add = useCallback((pop: Omit<Pop, "id">) => {
    const id = nextId.current++;
    setPops((all) => [...all, { ...pop, id }]);
    const t = window.setTimeout(() => {
      setPops((all) => all.filter((p) => p.id !== id));
    }, LIFETIME);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    const onCue = (event: Event) => {
      const detail = (event as CustomEvent<CueDetail>).detail;
      if (!detail) return;
      const x = detail.x ?? window.innerWidth / 2;
      const y = detail.y ?? window.innerHeight * 0.38;
      add({ x, y, kind: detail.kind === "wrong" ? "wrong" : "correct" });
    };
    window.addEventListener(CUE_EVENT, onCue);
    return () => window.removeEventListener(CUE_EVENT, onCue);
  }, [add]);

  // Stored progress replaces the empty server snapshot right after hydration.
  // Take the baseline on the next tick so that swap isn't read as a gain.
  useEffect(() => {
    const t = window.setTimeout(() => {
      seenXp.current = xpNow.current;
      ready.current = true;
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const xp = progress.xp;
    const delta = xp - (seenXp.current ?? xp);
    seenXp.current = xp;
    if (delta <= 0) return;

    playCue("complete");
    const pill = document.querySelector<HTMLElement>("[data-xp-pill]");
    const rect = pill?.getBoundingClientRect();
    add({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth - 96,
      y: rect ? rect.top + rect.height / 2 : 64,
      kind: "xp",
      label: `+${delta} XP`,
    });
  }, [progress.xp, add]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const t of pending) window.clearTimeout(t);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[130] overflow-hidden">
      {pops.map((pop) => (
        <span
          key={pop.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: pop.x, top: pop.y }}
        >
          {pop.kind === "correct" && <Burst />}
          {pop.kind === "wrong" && (
            <span className="feedback-ring block size-14 rounded-full border-2 border-danger/70" />
          )}
          {pop.label && (
            <span className="float-up whitespace-nowrap rounded-full border border-amber/40 bg-[#1b1030]/95 px-3 py-1 font-mono text-[12px] font-semibold text-amber shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              {pop.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
