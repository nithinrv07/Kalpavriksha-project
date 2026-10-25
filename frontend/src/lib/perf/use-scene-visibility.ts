"use client";

import { useEffect, useRef } from "react";

export interface SceneVisibilityOptions {
  /** Grow the observed box so effects wake up before they are actually on screen. */
  rootMargin?: string;
  threshold?: number;
}

/**
 * Reports whether a scene should be rendering: on screen AND the tab is visible.
 *
 * Every canvas effect on the site uses this so nothing keeps drawing while it is
 * scrolled away or the tab is in the background.
 */
export function useSceneVisibility(
  ref: React.RefObject<Element | null>,
  onVisibilityChange: (visible: boolean) => void,
  { rootMargin = "0px", threshold = 0.01 }: SceneVisibilityOptions = {}
): void {
  const callbackRef = useRef(onVisibilityChange);

  useEffect(() => {
    callbackRef.current = onVisibilityChange;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let inView = true;
    let pageVisible = typeof document === "undefined" ? true : !document.hidden;

    const sync = () => callbackRef.current(inView && pageVisible);

    if (typeof IntersectionObserver === "undefined") {
      sync();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        sync();
      },
      { rootMargin, threshold }
    );
    observer.observe(element);

    const onPageVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onPageVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onPageVisibility);
    };
  }, [ref, rootMargin, threshold]);
}
