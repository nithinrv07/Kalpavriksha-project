"use client";

import { useEffect, useRef } from "react";

/**
 * Unified Ambient Depth Layers
 * Single continuous background behind the entire landing page
 * Layers separate on scroll creating true 3D parallax depth
 */
export function AmbientDepthLayers() {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      const docHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(docHeight - viewportHeight, 1);
      const progress = Math.min(scrollYRef.current / maxScroll, 1);

      const layers = [
        { ref: layer1Ref, speed: 0.05, scaleFactor: 0, opacityFactor: 0 },
        { ref: layer2Ref, speed: 0.15, scaleFactor: 0.1, opacityFactor: 0.1 },
        { ref: layer3Ref, speed: 0.3, scaleFactor: 0.2, opacityFactor: 0.2 },
        { ref: layer4Ref, speed: 0.5, scaleFactor: 0.3, opacityFactor: 0.3 },
      ];

      layers.forEach(({ ref, speed, scaleFactor, opacityFactor }) => {
        const el = ref.current;
        if (!el) return;
        const y = scrollYRef.current * speed;
        const scale = 1 + progress * scaleFactor;
        const opacity = 1 - progress * opacityFactor;
        el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        el.style.opacity = String(opacity);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        transform: "translateZ(0)",
        willChange: "transform, opacity",
        contain: "strict",
      }}
    >
      {/* Layer 1: Deep space stars - slowest */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 ambient-layer"
        style={{
          background: `
            radial-gradient(2px 2px at 10% 20%, #fff 50%, transparent),
            radial-gradient(1px 1px at 30% 40%, rgba(192,132,252,0.8) 50%, transparent),
            radial-gradient(2px 2px at 60% 70%, #fff 50%, transparent),
            radial-gradient(1px 1px at 80% 10%, rgba(232,121,249,0.6) 50%, transparent),
            radial-gradient(2px 2px at 40% 80%, #fff 50%, transparent),
            radial-gradient(1px 1px at 90% 50%, rgba(168,85,247,0.7) 50%, transparent),
            radial-gradient(2px 2px at 20% 60%, #fff 50%, transparent),
            radial-gradient(1px 1px at 70% 30%, rgba(244,114,182,0.5) 50%, transparent)
          `,
          backgroundSize: "600px 600px, 400px 400px, 500px 500px, 300px 300px, 700px 700px, 350px 350px, 550px 550px, 450px 450px",
          animation: "star-twinkle 8s ease-in-out infinite",
          opacity: 0.4,
        }}
      />

      {/* Layer 2: Aurora gradients - mid */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 ambient-layer"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(168,85,247,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(45,212,191,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 100% 70% at 50% 80%, rgba(251,191,36,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 70% 90% at 10% 90%, rgba(236,72,153,0.12) 0%, transparent 55%)
          `,
          filter: "blur(120px)",
          opacity: 0.6,
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 3: Floating particles/dust - faster */}
      <div
        ref={layer3Ref}
        className="absolute inset-0 ambient-layer"
        style={{
          background: `
            radial-gradient(circle at 15% 30%, rgba(192,132,252,0.08) 1px, transparent 1px),
            radial-gradient(circle at 75% 40%, rgba(45,212,191,0.06) 1px, transparent 1px),
            radial-gradient(circle at 35% 75%, rgba(251,191,36,0.05) 1px, transparent 1px),
            radial-gradient(circle at 85% 85%, rgba(236,72,153,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "200px 200px, 150px 150px, 180px 180px, 160px 160px",
          animation: "dust-drift 30s linear infinite",
          opacity: 0.5,
        }}
      />

      {/* Layer 4: Vignette/edge darkening - fastest (stays with viewport) */}
      <div
        ref={layer4Ref}
        className="absolute inset-0 pointer-events-none ambient-layer"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 40%, rgba(5,2,12,0.8) 100%),
            linear-gradient(180deg, rgba(5,2,12,0.3) 0%, transparent 30%, transparent 70%, rgba(5,2,12,0.3) 100%)
          `,
          opacity: 0.7,
        }}
      />

      <style jsx>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; filter: brightness(1); }
          50% { opacity: 0.5; filter: brightness(1.3); }
        }
        @keyframes dust-drift {
          0% { background-position: 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: 200px 200px, -150px 150px, 180px -180px, -160px 160px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ambient-layer {
            animation: none !important;
          }
        }

        /* Calm mode */
        html[data-calm="true"] .ambient-layer {
          animation: none !important;
          opacity: 0.15 !important;
        }
      `}</style>
    </div>
  );
}