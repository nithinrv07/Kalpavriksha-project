"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";

function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .flatMap((c) =>
      typeof c === "string"
        ? c
        : c && typeof c === "object"
        ? Object.entries(c).filter(([, v]) => v).map(([k]) => k)
        : []
    )
    .join(" ");
}

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** 0-20: How much light bends (air=1.0, water=1.33, glass=1.5) */
  refraction?: number;
  /** 0-20: Chromatic dispersion - splits RGB channels at edges */
  dispersion?: number;
  /** 1-20: Clarity - 20 = clear glass, lower = thicker/more tinted */
  clarity?: number;
  /** 1-20: Edge/Fresnel brightness - rim lighting at grazing angles */
  edge?: number;
  /** 1-20: Gloss - low=wet sheen, high=sharp pinpoint highlights */
  gloss?: number;
  /** 0-20: Rounding - 0=sharp cube, 20=ball (affects edge curvature) */
  rounding?: number;
  /** Base glass color (tint when clarity < 20) */
  glassColor?: string;
  /** Room/environment top color */
  roomTop?: string;
  /** Room/environment bottom color */
  roomBottom?: string;
  /** Highlight/specular color */
  highlightColor?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Intensity of all effects 0-1 */
  intensity?: number;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

/**
 * Liquid Glass Card — 2D implementation of Originkit's liquid glass physics
 * 
 * Optical properties translated from the Three.js shader:
 * - REFRACTION: Index of Refraction (IOR) → controls "bending" simulation via edge distortion
 * - DISPERSION: Chromatic aberration → RGB channel separation at edges/corners
 * - CLARITY: Beer-Lambert absorption → glass tint strength vs transparency
 * - EDGE: Fresnel term → rim lighting at grazing angles (view-dependent)
 * - GLOSS: Specular lobe exponent → highlight sharpness/size
 * - ROUNDING: Superellipsoid exponent → corner roundness affecting edge falloff
 * 
 * The "room" environment is a procedural gradient with two virtual lights.
 * Both "walls" (front/back faces) are simulated for depth.
 */
export function LiquidGlassCard({
  children,
  className = "",
  refraction = 12,
  dispersion = 12,
  clarity = 14,
  edge = 14,
  gloss = 12,
  rounding = 8,
  glassColor = "#ffffff",
  roomTop = "#1a0a2e",
  roomBottom = "#0d0516",
  highlightColor = "#e8b4ff",
  speed = 1,
  intensity = 1,
  onMouseMove,
  onMouseLeave,
}: LiquidGlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Continuous time for ambient animations
  useEffect(() => {
    if (intensity === 0) return;
    const animate = (timestamp: number) => {
      setTime(timestamp * 0.001 * speed);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [intensity, speed]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    onMouseMove?.(e);
  }, [onMouseMove]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos(null);
    onMouseLeave?.();
  }, [onMouseLeave]);

  // Clamp helper (from Originkit)
  const clamp = (v: number, lo: number, hi: number, fallback: number) => {
    const n = typeof v === "number" && isFinite(v) ? v : fallback;
    return Math.max(lo, Math.min(hi, n));
  };

  // Settings translation from Originkit's settingsFor()
  const settings = useMemo(() => {
    const r = clamp(refraction, 1, 20, 12);
    const d = clamp(dispersion, 0, 20, 12);
    const c = clamp(clarity, 1, 20, 14);
    const e = clamp(edge, 1, 20, 14);
    const g = clamp(gloss, 1, 20, 12);
    const ro = clamp(rounding, 0, 20, 8);

    // Exponent: 2 = sphere, 50 = sharp cube. Inverted & curved like Originkit
    const exponent = 2 + Math.pow(1 - ro / 20, 1.6) * 48;
    // IOR: 1.05 (barely) to ~1.89 (dense flint glass)
    const ior = 1.05 + r * 0.042;
    // Dispersion: 0 to 0.08 (spread between R/G/B IOR)
    const dispersionVal = d * 0.004;
    // Clarity: 0.05 to 1.0 (1 = perfectly clear)
    const clarityVal = c / 20;
    // Edge/Fresnel multiplier: 0.09 to 1.8
    const edgeVal = e * 0.09;
    // Gloss/specular exponent: 54 to 734
    const glossVal = 20 + g * 34;

    return {
      exponent,
      ior,
      dispersion: dispersionVal,
      clarity: clarityVal,
      edge: edgeVal,
      gloss: glossVal,
      rounding: ro,
      // Virtual light directions in view space (from shader)
      keyLight: { x: 0.55, y: 0.72, z: 0.42 },
      fillLight: { x: -0.62, y: -0.28, z: 0.73 },
    };
  }, [refraction, dispersion, clarity, edge, gloss, rounding]);

  // Parse colors
  const parseColor = (hex: string) => {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
    };
  };

  const glass = parseColor(glassColor);
  const roomT = parseColor(roomTop);
  const roomB = parseColor(roomBottom);
  const highlight = parseColor(highlightColor);

  // CSS custom properties for the liquid glass physics
  const style = useMemo((): React.CSSProperties & Record<string, string | number> => {
    const mx = mousePos ? `${mousePos.x}%` : "50%";
    const my = mousePos ? `${mousePos.y}%` : "50%";
    const i = intensity;
    const s = settings;

    // Corner radius from rounding (superellipsoid-inspired)
    const cornerRadius = 16 + (1 - s.rounding / 20) * 24; // 16px to 40px

    // Fresnel/rim intensity at current view angle (simulated)
    const fresnelStrength = s.edge * i * (isHovered ? 1.3 : 1);

    // Specular gloss factor
    const specularExp = s.gloss;
    const specularSize = 1 / Math.sqrt(specularExp / 100); // inverse relationship

    return {
      // Physics uniforms
      "--ior": s.ior,
      "--dispersion": s.dispersion,
      "--clarity": s.clarity,
      "--edge": s.edge,
      "--gloss": s.gloss,
      "--exponent": s.exponent,
      "--corner-radius": `${cornerRadius}px`,
      "--intensity": i,
      "--hover": isHovered ? 1 : 0,
      "--time": time,
      "--mouse-x": mx,
      "--mouse-y": my,
      // Colors
      "--glass-r": glass.r,
      "--glass-g": glass.g,
      "--glass-b": glass.b,
      "--room-top-r": roomT.r,
      "--room-top-g": roomT.g,
      "--room-top-b": roomT.b,
      "--room-bot-r": roomB.r,
      "--room-bot-g": roomB.g,
      "--room-bot-b": roomB.b,
      "--highlight-r": highlight.r,
      "--highlight-g": highlight.g,
      "--highlight-b": highlight.b,
      // Virtual lights
      "--key-x": s.keyLight.x,
      "--key-y": s.keyLight.y,
      "--key-z": s.keyLight.z,
      "--fill-x": s.fillLight.x,
      "--fill-y": s.fillLight.y,
      "--fill-z": s.fillLight.z,
      // Derived
      "--fresnel": fresnelStrength,
      "--spec-exp": specularExp,
      "--spec-size": specularSize,
    };
  }, [mousePos, isHovered, time, intensity, settings, glassColor, roomTop, roomBottom, highlightColor]);

  // Layer 1: Room Environment (what gets refracted/reflected)
  const roomEnvStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-20%",
    pointerEvents: "none",
    background: `
      /* Vertical gradient room */
      linear-gradient(
        180deg,
        rgb(var(--room-top-r), var(--room-top-g), var(--room-top-b)) 0%,
        rgb(var(--room-bot-r), var(--room-bot-g), var(--room-bot-b)) 100%
      ),
      /* Key light */
      radial-gradient(
        ellipse 80% 60% at calc(var(--key-x) * 50% + 50%) calc(var(--key-y) * 50% + 50%),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 70%
      ),
      /* Fill light */
      radial-gradient(
        ellipse 120% 80% at calc(var(--fill-x) * 50% + 50%) calc(var(--fill-y) * 50% + 50%),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 60%
      )
    `,
    opacity: 0.6 * intensity,
    filter: "blur(40px)",
    transform: `translateZ(-100px) scale(1.4)`,
    zIndex: -2,
  };

  // Layer 2: Refracted Room (seen through glass) - with chromatic dispersion
  const refractedStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-10%",
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    background: `
      /* R channel - bent more (lower IOR = more bend) */
      radial-gradient(
        ellipse at calc(var(--mouse-x) - var(--dispersion) * 500%) var(--mouse-y),
        rgb(var(--room-top-r), 0, 0) 0%,
        rgb(var(--room-bot-r), 0, 0) 100%
      ),
      /* G channel - center IOR */
      radial-gradient(
        ellipse at var(--mouse-x) var(--mouse-y),
        rgb(0, var(--room-top-g), 0) 0%,
        rgb(0, var(--room-bot-g), 0) 100%
      ),
      /* B channel - bent less (higher IOR = less bend) */
      radial-gradient(
        ellipse at calc(var(--mouse-x) + var(--dispersion) * 500%) var(--mouse-y),
        rgb(0, 0, var(--room-top-b)) 0%,
        rgb(0, 0, var(--room-bot-b)) 100%
      )
    `,
    opacity: (1 - settings.clarity) * 0.4 * intensity + 0.15 * intensity,
    mixBlendMode: "screen",
    filter: "blur(30px)",
    clipPath: "inset(0 round var(--corner-radius))",
    transition: "opacity 400ms ease-out",
  };

  // Layer 3: Reflected Room (Fresnel reflection)
  const reflectedStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    background: `
      /* Reflection of room */
      linear-gradient(
        180deg,
        rgb(var(--room-top-r), var(--room-top-g), var(--room-top-b)) 0%,
        rgb(var(--room-bot-r), var(--room-bot-g), var(--room-bot-b)) 100%
      ),
      /* Key light reflection */
      radial-gradient(
        ellipse 60% 40% at calc(var(--key-x) * 50% + 50%) calc(var(--key-y) * 50% + 50%),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 60%
      )
    `,
    opacity: `calc(var(--fresnel) * var(--hover) * 0.8 + var(--fresnel) * (1 - var(--hover)) * 0.3)`,
    mixBlendMode: "screen",
    filter: "blur(8px)",
    transition: "opacity 500ms cubic-bezier(0.23, 1, 0.32, 1)",
    clipPath: "inset(0 round var(--corner-radius))",
  };

  // Layer 4: Glass Body Tint (Beer-Lambert - thickness-based)
  const glassBodyStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    background: `
      /* Thicker at edges (Fresnel zones) */
      radial-gradient(
        ellipse 120% 120% at 50% 50%,
        transparent 40%,
        rgb(var(--glass-r), var(--glass-g), var(--glass-b)) 100%
      ),
      /* Center thinner */
      linear-gradient(
        180deg,
        rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc((1 - var(--clarity)) * 0.08)) 0%,
        rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc((1 - var(--clarity)) * 0.02)) 50%,
        rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc((1 - var(--clarity)) * 0.08)) 100%
      )
    `,
    opacity: `calc((1 - var(--clarity)) * var(--intensity) * 0.6)`,
    mixBlendMode: "multiply",
    transition: "opacity 400ms ease-out",
  };

  // Layer 5: Specular Highlights (Gloss-controlled)
  const specularStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    background: `
      /* Key light specular - tight lobe */
      radial-gradient(
        ellipse calc(10% / var(--spec-size)) calc(15% / var(--spec-size)) at 
          calc(var(--key-x) * 50% + 50%) calc(var(--key-y) * 50% + 50%),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 70%
      ),
      /* Fill light specular - broader */
      radial-gradient(
        ellipse calc(20% / var(--spec-size)) calc(30% / var(--spec-size)) at 
          calc(var(--fill-x) * 50% + 50%) calc(var(--fill-y) * 50% + 50%),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 80%
      ),
      /* Mouse-tracking specular (view-dependent) */
      radial-gradient(
        ellipse calc(8% / var(--spec-size)) calc(12% / var(--spec-size)) at var(--mouse-x) var(--mouse-y),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 65%
      )
    `,
    opacity: `calc(var(--intensity) * 0.9)`,
    mixBlendMode: "plus-lighter",
    filter: "blur(4px)",
    clipPath: "inset(0 round var(--corner-radius))",
  };

  // Layer 6: Edge/Rim Lighting (Fresnel term - the "glass edge")
  const edgeStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    background: `
      /* Edge highlight - where surface normal perpendicular to view */
      conic-gradient(
        from 0deg at 50% 50%,
        transparent 0deg,
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 45deg,
        transparent 90deg,
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 225deg,
        transparent 270deg,
        transparent 360deg
      ),
      /* Radial edge glow */
      radial-gradient(
        ellipse 110% 110% at 50% 50%,
        transparent 75%,
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 95%,
        transparent 100%
      )
    `,
    opacity: `calc(var(--fresnel) * var(--intensity) * var(--hover))`,
    mixBlendMode: "plus-lighter",
    filter: "blur(12px)",
    clipPath: "inset(0 round var(--corner-radius))",
    transition: "opacity 500ms cubic-bezier(0.23, 1, 0.32, 1)",
  };

  // Layer 7: Inner Volume Caustics (light swimming through liquid)
  const causticsStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-15%",
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    opacity: 0.08 * intensity,
    mixBlendMode: "plus-lighter",
    background: `
      /* Fractal caustic pattern */
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0 0.05 0.2 0.4 0.6 0.8 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E"),
      /* Moving focus */
      radial-gradient(
        ellipse 200% 150% at var(--mouse-x) var(--mouse-y),
        rgb(var(--highlight-r), var(--highlight-g), var(--highlight-b)) 0%,
        transparent 50%
      )
    `,
    backgroundSize: "600% 600%, 300% 300%",
    animation: `caustic-swim ${20 / speed}s ease-in-out infinite`,
    filter: "blur(20px)",
    clipPath: "inset(0 round var(--corner-radius))",
  };

  // Layer 8: Surface Distortion (simulated refraction displacement)
  const distortionStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "var(--corner-radius)",
    opacity: 0.04 * intensity * settings.dispersion * 50,
    mixBlendMode: "difference",
    background: `
      radial-gradient(
        ellipse at var(--mouse-x) var(--mouse-y),
        rgb(255,255,255) 0%,
        transparent 40%
      )
    `,
    filter: "blur(2px)",
    clipPath: "inset(0 round var(--corner-radius))",
  };

  // Layer 9: Back-face Simulation (depth - seeing "through" the glass)
  const backFaceStyle: React.CSSProperties = {
    position: "absolute",
    inset: "2%",
    pointerEvents: "none",
    borderRadius: "calc(var(--corner-radius) - 2px)",
    opacity: `calc(var(--clarity) * var(--intensity) * 0.15)`,
    background: `
      linear-gradient(
        180deg,
        rgb(var(--room-top-r), var(--room-top-g), var(--room-top-b)) 0%,
        rgb(var(--room-bot-r), var(--room-bot-g), var(--room-bot-b)) 100%
      )
    `,
    filter: "blur(60px)",
    transform: "scale(0.96) translateZ(-20px)",
    clipPath: "inset(0 round calc(var(--corner-radius) - 2px))",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate overflow-hidden",
        "rounded-[var(--corner-radius)]",
        "bg-gradient-to-br",
        "from-[rgba(255,255,255,0.02)]",
        "via-[rgba(255,255,255,0.005)]",
        "to-[rgba(0,0,0,0.03)]",
        "backdrop-blur-[12px]",
        "border",
        "border-white/[calc(var(--intensity)*0.12)]",
        "shadow-[0_8px_32px_-6px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_40px_-10px_rgb(var(--highlight-r)_var(--highlight-g)_var(--highlight-b)_/_0.15)]",
        "transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)",
        "hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_0_60px_-12px_rgb(var(--highlight-r)_var(--highlight-g)_var(--highlight-b)_/_0.25)]",
        "hover:border-white/20",
        className
      )}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Room environment (behind glass) */}
      <div className="room-environment" style={roomEnvStyle} />

      {/* Back face - seen through glass */}
      <div className="back-face" style={backFaceStyle} />

      {/* Refracted room (chromatic dispersion) */}
      <div className="refracted-layer" style={refractedStyle} />

      {/* Reflected room (Fresnel) */}
      <div className="reflected-layer" style={reflectedStyle} />

      {/* Glass body tint (Beer-Lambert absorption) */}
      <div className="glass-body" style={glassBodyStyle} />

      {/* Specular highlights (Gloss-controlled) */}
      <div className="specular-layer" style={specularStyle} />

      {/* Edge/Fresnel rim */}
      <div className="edge-layer" style={edgeStyle} />

      {/* Caustics */}
      <div className="caustics-layer" style={causticsStyle} />

      {/* Subtle distortion */}
      <div className="distortion-layer" style={distortionStyle} />

      {/* Content */}
      <div className="relative z-10" style={{ position: "relative", zIndex: 10 }}>{children}</div>

      <style jsx>{`
        @keyframes caustic-swim {
          0%, 100% {
            background-position: 0% 0%, var(--mouse-x) var(--mouse-y);
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            background-position: 20% -15%, var(--mouse-x) var(--mouse-y);
            transform: translate(-1%, 2%) rotate(0.5deg) scale(1.02);
          }
          50% {
            background-position: -15% 25%, var(--mouse-x) var(--mouse-y);
            transform: translate(1.5%, -1%) rotate(-0.3deg) scale(0.98);
          }
          75% {
            background-position: 25% 20%, var(--mouse-x) var(--mouse-y);
            transform: translate(-2%, -1.5%) rotate(0.2deg) scale(1.01);
          }
        }

        /* Subtle breathing of the glass surface */
        @keyframes glass-breathe {
          0%, 100% {
            filter: blur(12px);
          }
          50% {
            filter: blur(16px);
          }
        }

        .room-environment {
          animation: glass-breathe 6s ease-in-out infinite;
        }

        /* Hover transitions */
        .refracted-layer,
        .reflected-layer,
        .glass-body,
        .specular-layer,
        .edge-layer,
        .caustics-layer,
        .distortion-layer {
          transition: opacity 500ms cubic-bezier(0.23, 1, 0.32, 1),
            filter 400ms ease-out,
            transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .caustics-layer,
          .room-environment {
            animation: none !important;
            opacity: 0.05 !important;
          }
          .refracted-layer,
          .specular-layer,
          .edge-layer,
          .distortion-layer {
            opacity: 0.15 !important;
          }
        }

        /* Calm mode */
        html[data-calm="true"] .caustics-layer,
        html[data-calm="true"] .room-environment {
          animation: none !important;
          opacity: 0.02 !important;
        }
        html[data-calm="true"] .refracted-layer,
        html[data-calm="true"] .specular-layer,
        html[data-calm="true"] .edge-layer,
        html[data-calm="true"] .distortion-layer {
          opacity: 0.08 !important;
        }

        /* High contrast */
        @media (prefers-contrast: high) {
          .refracted-layer,
          .reflected-layer,
          .specular-layer,
          .edge-layer {
            opacity: 0.3 !important;
          }
        }
      `}</style>
    </div>
  );
}