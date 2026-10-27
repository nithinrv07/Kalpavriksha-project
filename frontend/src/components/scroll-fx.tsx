"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Fragment, useEffect, useRef } from "react";
import { useComfort } from "@/lib/comfort";

const REVEAL_FROM = {
  up: { y: 32, autoAlpha: 0 },
  scale: { y: 40, scale: 0.96, autoAlpha: 0 },
  pop: { scale: 0.6, autoAlpha: 0 },
} as const satisfies Record<string, gsap.TweenVars>;

type RevealKind = keyof typeof REVEAL_FROM;
const isRevealKind = (v: string | undefined): v is RevealKind => v === "up" || v === "scale" || v === "pop";

/**
 * High-performance, zero-lag scroll controller.
 * Integrates snappy, responsive Lenis smooth scroll with GSAP ScrollTrigger.
 * - Ultra-low latency wheel response (350ms settle instead of 1000ms float)
 * - Decoupled scrub triggers (scrub: 0.4) prevent main-thread layout thrashing
 * - Intelligent lagSmoothing prevents frame-drop jumps and stutters
 */
export function ScrollFx() {
  const barRef = useRef<HTMLDivElement>(null);
  const calm = useComfort().calm;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 0.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.15,
        touchMultiplier: 1.0,
        syncTouch: false,
        anchors: true,
        autoRaf: false,
      });

      const onScroll = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", onScroll);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(500, 33);

      // Word-by-word headings.
      for (const el of gsap.utils.toArray<HTMLElement>('[data-reveal="words"]')) {
        gsap.from(el.querySelectorAll(".word > span"), {
          yPercent: 110,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }

      // Block reveals: hide up front (no flash), then animate in batches for a natural stagger.
      const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]").filter((el) => el.dataset.reveal !== "words");
      for (const el of blocks) {
        const kind = el.dataset.reveal;
        if (isRevealKind(kind)) gsap.set(el, REVEAL_FROM[kind]);
      }
      ScrollTrigger.batch(blocks, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "expo.out", stagger: 0.07 }),
      });

      // Hero recedes as it scrolls away with smoothed scrub to prevent stutter
      const hero = document.querySelector("[data-hero]");
      if (hero) {
        gsap
          .timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.4 } })
          .to(".hero-frame", { yPercent: 8, ease: "none" }, 0)
          .to(".hero-stage", { y: -100, ease: "none" }, 0)
          .to(".hero-copy", { y: -50, ease: "none" }, 0);
      }

      // Background spiral turns gently through the whole page with decoupled scrub
      gsap.to(".waves-scroll", {
        rotation: 60,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.8 },
      });

      // Footer wordmark rises into place.
      const footer = document.querySelector("footer");
      if (footer) {
        gsap.fromTo(
          ".footer-mark",
          { yPercent: 40 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: 0.4 },
          },
        );
      }

      // Progress hairline.
      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.1 } },
        );
      }

      return () => {
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

  // Calm mode: pause every scroll-driven timeline.
  useEffect(() => {
    if (calm) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false));
    } else {
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false));
      ScrollTrigger.refresh();
    }
  }, [calm]);

  return (
    <div
      ref={barRef}
      aria-hidden
      style={{ transform: "scaleX(0)" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-glow-a via-glow-b to-white"
    />
  );
}

/** Heading whose words rise out of a mask, one after another, when it scrolls into view. */
export function RevealWords({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h2" | "p";
}) {
  const words = text.split(" ");
  return (
    <Tag data-reveal="words" className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${i}-${word}`}>
          <span aria-hidden className="word">
            <span>{word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}
