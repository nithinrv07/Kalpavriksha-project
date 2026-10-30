"use client";

import React, { useEffect, useRef } from "react";

interface CosmicParticleLayerProps {
  moduleSlug?: string;
  className?: string;
}

interface PetalParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vAngle: number;
  flip: number;
  vFlip: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  isBurst: boolean;
  type: "petal" | "star";
}

const PALETTES: Record<string, { petals: string[]; stars: string[] }> = {
  learn: {
    petals: [
      "rgba(244, 114, 182, 0.92)", // pink-400
      "rgba(251, 207, 232, 0.95)", // pink-200
      "rgba(236, 72, 153, 0.88)",  // pink-500
      "rgba(216, 180, 254, 0.9)",  // purple-300
    ],
    stars: [
      "rgba(192, 132, 252, 0.95)", // purple-400
      "rgba(232, 121, 249, 0.95)", // fuchsia-400
      "rgba(255, 255, 255, 0.95)", // white
      "rgba(167, 139, 250, 0.9)",  // violet-400
    ],
  },
  grow: {
    petals: [
      "rgba(251, 191, 36, 0.92)",  // amber-400
      "rgba(254, 240, 138, 0.95)", // yellow-200
      "rgba(244, 114, 182, 0.88)", // pink-400
      "rgba(52, 211, 153, 0.85)",  // emerald-400
    ],
    stars: [
      "rgba(251, 191, 36, 0.95)",  // gold
      "rgba(52, 211, 153, 0.95)",  // emerald
      "rgba(255, 255, 255, 0.95)", // white
      "rgba(245, 158, 11, 0.9)",   // amber
    ],
  },
  "gk-songs": {
    petals: [
      "rgba(249, 115, 22, 0.92)",  // saffron orange
      "rgba(255, 255, 255, 0.95)", // white lotus
      "rgba(34, 197, 94, 0.85)",   // emerald green
      "rgba(253, 164, 175, 0.88)", // soft rose
    ],
    stars: [
      "rgba(56, 189, 248, 0.95)",  // cyan-400
      "rgba(251, 191, 36, 0.95)",  // amber gold
      "rgba(255, 255, 255, 0.95)", // pure starlight
      "rgba(168, 85, 247, 0.9)",   // violet
    ],
  },
};

export function CosmicParticleLayer({ moduleSlug = "learn", className = "" }: CosmicParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const palette = (moduleSlug && PALETTES[moduleSlug]) ? PALETTES[moduleSlug] : PALETTES.learn;
    if (!palette) return;

    const particles: PetalParticle[] = [];

    // Helper to spawn a gentle ambient drifting petal or star
    const spawnAmbient = (startY = -20) => {
      const isStar = Math.random() < 0.45;
      const type = isStar ? "star" : "petal";
      const colors = isStar ? palette.stars : palette.petals;
      const color = colors[Math.floor(Math.random() * colors.length)] ?? colors[0] ?? "#ffffff";

      particles.push({
        x: Math.random() * width,
        y: startY,
        vx: (Math.random() - 0.4) * 0.8 + 0.3, // gentle rightward drift
        vy: isStar ? 0.3 + Math.random() * 0.4 : 0.7 + Math.random() * 1.1,
        size: isStar ? 2 + Math.random() * 3.5 : 8 + Math.random() * 9,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI,
        vFlip: (Math.random() - 0.5) * 0.04,
        alpha: isStar ? 0.4 + Math.random() * 0.5 : 0.6 + Math.random() * 0.35,
        maxLife: 600 + Math.random() * 400,
        life: 0,
        color,
        isBurst: false,
        type,
      });
    };

    // Pre-populate initial ambient particles scattered across screen
    const initialAmbientCount = Math.min(28, Math.floor(width / 50));
    for (let i = 0; i < initialAmbientCount; i++) {
      spawnAmbient(Math.random() * height);
    }

    // Interactive burst on click or tap
    const createBurst = (cx: number, cy: number, count?: number) => {
      const burstCount = count ?? (16 + Math.floor(Math.random() * 8));
      for (let i = 0; i < burstCount; i++) {
        const isStar = Math.random() < 0.5;
        const type = isStar ? "star" : "petal";
        const colors = isStar ? palette.stars : palette.petals;
        const color = colors[Math.floor(Math.random() * colors.length)] ?? colors[0] ?? "#ffffff";

        const speed = 2.5 + Math.random() * 5.5;
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5, // slight upward impulse
          size: isStar ? 3 + Math.random() * 4 : 9 + Math.random() * 10,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.15,
          flip: Math.random() * Math.PI,
          vFlip: (Math.random() - 0.5) * 0.12,
          alpha: 1,
          maxLife: 75 + Math.random() * 35, // short energetic lifespan
          life: 0,
          color,
          isBurst: true,
          type,
        });
      }
    };

    // Global listener for card clicks & interactive taps
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest("button, a, [role='button'], [data-interactive], .group, .card, input");
      // Full rich burst on interactive elements/cards, gentle ripple burst on background clicks
      createBurst(e.clientX, e.clientY, isInteractive ? 22 : 10);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Maintain ambient particle population
      if (particles.filter((p) => !p.isBurst).length < initialAmbientCount && Math.random() < 0.1) {
        spawnAmbient(-20);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;

        p.life++;

        if (p.isBurst) {
          // Physics for burst particles: air resistance + gentle gravity
          p.vx *= 0.94;
          p.vy = p.vy * 0.94 + 0.12; // gentle gravity
          p.x += p.vx;
          p.y += p.vy;
          p.angle += p.vAngle;
          p.flip += p.vFlip;

          // Fade out towards end of life
          const progress = p.life / p.maxLife;
          p.alpha = Math.max(0, 1 - progress);

          if (p.life >= p.maxLife || p.alpha <= 0.01) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          // Ambient particles: floating drift
          p.x += p.vx + Math.sin(p.life * 0.02) * 0.4;
          p.y += p.vy;
          p.angle += p.vAngle;
          p.flip += p.vFlip;

          // Wrap or remove when offscreen
          if (p.y > height + 30 || p.x < -30 || p.x > width + 30) {
            particles.splice(i, 1);
            continue;
          }
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.flip), 1);
        ctx.globalAlpha = p.alpha;

        if (p.type === "star") {
          // 4-pointed radiant starlight diamond
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.isBurst ? 10 : 6;

          const r = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.closePath();
          ctx.fill();

          // Core bright center
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Authentic curved Sakura Petal
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.isBurst ? 8 : 4;

          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.9, s * 0.3, 0, s);
          ctx.bezierCurveTo(-s * 0.9, s * 0.3, -s * 0.8, -s * 0.6, 0, -s);
          ctx.closePath();
          ctx.fill();

          // Subtle petal vein highlight
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.7);
          ctx.lineTo(0, s * 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [moduleSlug]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-30 h-full w-full contain-strict will-change-transform ${className}`}
    />
  );
}
