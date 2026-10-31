"use client";

import { useEffect, useState, useRef } from "react";
import { BentoModules } from "@/components/landing/bento-modules";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { CtaFooter } from "@/components/landing/cta-footer";
import { Hero } from "@/components/landing/hero";
import { IdentitySection } from "@/components/landing/identity-section";
import { KolamDivider } from "@/components/landing/kolam-divider";
import { LivingTree } from "@/components/landing/living-tree";
import { ScrollFx } from "@/components/scroll-fx";
import { AmbientDepthLayers } from "@/components/landing/ambient-layers";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState({
    hero: 0,
    modules: 0,
    identity: 0,
    footer: 0,
    global: 0,
  });

  const heroRef = useRef<HTMLElement>(null);
  const modulesRef = useRef<HTMLElement>(null);
  const identityRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const maxScroll = docHeight - viewportHeight;
      const globalProgress = Math.min(scrollY / maxScroll, 1);

      const refs = { hero: heroRef, modules: modulesRef, identity: identityRef, footer: footerRef };
      Object.entries(refs).forEach(([key, ref]) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportCenter = viewportHeight / 2;
        const distanceFromCenter = rect.top + sectionHeight / 2 - viewportCenter;
        const progress = 1 - Math.abs(distanceFromCenter) / (viewportHeight / 2 + sectionHeight / 2);
        setScrollProgress(prev => ({ ...prev, [key]: Math.max(0, Math.min(1, progress)) }));
      });

      setScrollProgress(prev => ({ ...prev, global: globalProgress }));
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    calculateProgress();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply global progress to CSS custom property for color narrative
  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-progress", scrollProgress.global.toString());
  }, [scrollProgress.global]);

  return (
    <>
      {/* Unified ambient depth layers - single continuous background */}
      <AmbientDepthLayers />

      {/* Chrome waves (kept for compatibility) */}
      <ChromeWaves />

      {/* Living Tree on left side */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-[1] hidden sm:block h-full w-[52vw] min-w-[300px] max-w-[700px] overflow-hidden opacity-90 transform-gpu"
        style={{
          maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
        }}
      >
        <LivingTree />
      </div>

      <main className="relative z-10">
        <ScrollFx />
        
        {/* Hero with scroll progress */}
        <section ref={heroRef} id="hero" className="relative">
          <Hero scrollProgress={scrollProgress.hero} />
        </section>

        {/* BentoModules with scroll progress */}
        <section ref={modulesRef} id="modules" className="relative">
          <BentoModules scrollProgress={scrollProgress.modules} />
        </section>

        {/* Kolam Divider */}
        <KolamDivider />

        {/* Identity Section with scroll progress */}
        <section ref={identityRef} id="identity" className="relative">
          <IdentitySection scrollProgress={scrollProgress.identity} />
        </section>

        {/* Footer with scroll progress */}
        <section ref={footerRef} id="footer" className="relative">
          <CtaFooter scrollProgress={scrollProgress.footer} />
        </section>
      </main>

      {/* Global scroll progress indicator */}
      <div
        aria-hidden
        className="fixed top-0 left-0 h-0.5 w-full z-[100] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, 
            var(--violet) 0%, 
            var(--glow-a) 33%, 
            #2dd4bf 66%, 
            #fbbf24 100%
          )`,
          transform: `scaleX(${scrollProgress.global})`,
          transformOrigin: "left center",
          transition: "transform 0.1s linear",
        }}
      />

      <style jsx global>{`
        :root {
          --scroll-progress: 0;
        }

        /* Scroll-driven color narrative - accent shifts as you scroll */
        html {
          --violet: #a855f7;
          --glow-a: #9333ea;
          --glow-b: #e879f9;
        }

        @supports (animation-timeline: scroll()) {
          /* The scroll colour narrative is tuned for the dark canvas; in light
             mode the accent tokens stay on their paper-legible values. */
          html:not(.light):not([data-theme="light"]) {
            animation: theme-shift auto linear;
            animation-timeline: scroll(root);
          }
        }

        @keyframes theme-shift {
          0% {
            --violet: #a855f7;
            --glow-a: #9333ea;
            --glow-b: #e879f9;
          }
          25% {
            --violet: #a855f7;
            --glow-a: #9333ea;
            --glow-b: #e879f9;
          }
          35% {
            --violet: #7c3aed;
            --glow-a: #6d28d9;
            --glow-b: #c084fc;
          }
          50% {
            --violet: #2dd4bf;
            --glow-a: #0d9488;
            --glow-b: #5eead4;
          }
          65% {
            --violet: #fbbf24;
            --glow-a: #b45309;
            --glow-b: #fcd34d;
          }
          80% {
            --violet: #fbbf24;
            --glow-a: #b45309;
            --glow-b: #fcd34d;
          }
          90% {
            --violet: #ec4899;
            --glow-a: #be185d;
            --glow-b: #f472b6;
          }
          100% {
            --violet: #ec4899;
            --glow-a: #be185d;
            --glow-b: #f472b6;
          }
        }
      `}</style>
    </>
  );
}