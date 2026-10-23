"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Fragment, useEffect, useRef } from "react";

const REVEAL_FROM = {
  up: { y: 40, autoAlpha: 0 },
  scale: { y: 70, scale: 0.94, autoAlpha: 0 },
  pop: { scale: 0.4, autoAlpha: 0 },
} as const satisfies Record<string, gsap.TweenVars>;

type RevealKind = keyof typeof REVEAL_FROM;
const isRevealKind = (v: string | undefined): v is RevealKind => v === "up" || v === "scale" || v === "pop";

/**
 * Every scroll effect on the landing page, driven by GSAP ScrollTrigger on top of
 * Lenis smooth scrolling (both share GSAP's ticker, so they never fight).
 * - `[data-reveal="up|scale|pop"]` blocks reveal in staggered batches.
 * - `[data-reveal="words"]` headings rise word by word.
 * - Hero recedes, spiral turns, footer wordmark rises — all scrubbed to scroll.
 * Nothing is hidden until this runs, and reduced-motion users get static content.
 */
export function ScrollFx() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ lerp: 0.09, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Word-by-word headings.
      for (const el of gsap.utils.toArray<HTMLElement>('[data-reveal="words"]')) {
        gsap.from(el.querySelectorAll(".word > span"), {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.07,
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
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: "expo.out", stagger: 0.1 }),
      });

      // Hero recedes as it scrolls away; layers drift at different speeds.
      const hero = document.querySelector("[data-hero]");
      if (hero) {
        gsap
          .timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } })
          .to(".hero-frame", { yPercent: 10, ease: "none" }, 0)
          .to(".hero-stage", { y: -140, ease: "none" }, 0)
          .to(".hero-copy", { y: -70, ease: "none" }, 0);
      }

      // Background spiral turns and swells through the whole page.
      gsap.to(".waves-scroll", {
        rotation: 110,
        scale: 1.3,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 1.2 },
      });

      // Footer wordmark rises into place.
      const footer = document.querySelector("footer");
      if (footer) {
        gsap.fromTo(
          ".footer-mark",
          { yPercent: 50 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      }

      // Progress hairline.
      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
        );
      }

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

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
