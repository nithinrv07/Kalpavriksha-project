"use client";

import { useRef, useEffect, useState } from "react";

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

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "module" | "elevated" | "interactive";
  accentColor?: string;
  accentGlow?: string;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

/**
 * Apple-style Glass Card with multi-layer refraction physics
 * - Base layer: frosted glass with backdrop-filter
 * - Refraction layer: subtle chromatic aberration simulation
 * - Specular layer: dynamic highlights that track cursor
 * - Edge layer: rim lighting for depth perception
 * - Caustic layer: subtle light pattern projection
 */
export function GlassCard({
  children,
  className = "",
  variant = "default",
  accentColor = "#a855f7",
  accentGlow = "rgba(168, 85, 247, 0.35)",
  onMouseMove,
  onMouseLeave,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    onMouseMove?.(e);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos(null);
    onMouseLeave?.();
  };

  // Variant configurations
  const configs = {
    default: {
      baseOpacity: 0.85,
      blur: "24px",
      borderOpacity: 0.12,
      shadowDepth: "0 8px 32px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
      highlightOpacity: 0.08,
      causticOpacity: 0.03,
    },
    module: {
      baseOpacity: 0.92,
      blur: "32px",
      borderOpacity: 0.15,
      shadowDepth: "0 16px 50px -10px rgba(0,0,0,0.85), 0 0 40px -15px var(--accent-glow), 0 0 0 1px rgba(255,255,255,0.06) inset",
      highlightOpacity: 0.12,
      causticOpacity: 0.05,
    },
    elevated: {
      baseOpacity: 0.95,
      blur: "40px",
      borderOpacity: 0.18,
      shadowDepth: "0 24px 60px -12px rgba(0,0,0,0.9), 0 0 60px -20px var(--accent-glow), 0 0 0 1px rgba(255,255,255,0.08) inset",
      highlightOpacity: 0.15,
      causticOpacity: 0.07,
    },
    interactive: {
      baseOpacity: 0.88,
      blur: "28px",
      borderOpacity: 0.14,
      shadowDepth: "0 12px 40px -8px rgba(0,0,0,0.75), 0 0 30px -10px var(--accent-glow), 0 0 0 1px rgba(255,255,255,0.05) inset",
      highlightOpacity: 0.1,
      causticOpacity: 0.04,
    },
  };

  const config = configs[variant];

  // CSS custom properties for dynamic values
  const style: React.CSSProperties & Record<string, string | number> = {
    // Mouse position for specular highlights
    "--mouse-x": mousePos ? `${mousePos.x}%` : "50%",
    "--mouse-y": mousePos ? `${mousePos.y}%` : "50%",
    // Accent color for glow
    "--accent-color": accentColor,
    "--accent-glow": accentGlow,
    // Config values
    "--glass-blur": config.blur,
    "--glass-base-opacity": config.baseOpacity,
    "--glass-border-opacity": config.borderOpacity,
    "--glass-shadow": config.shadowDepth,
    "--glass-highlight-opacity": config.highlightOpacity,
    "--glass-caustic-opacity": config.causticOpacity,
    // Hover state
    "--hover-intensity": isHovered ? 1 : 0,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate rounded-3xl overflow-hidden",
        "bg-gradient-to-br",
        "from-[rgba(255,255,255,0.02)]",
        "via-[rgba(255,255,255,0.01)]",
        "to-[rgba(255,255,255,0.005)]",
        "backdrop-blur-[var(--glass-blur)]",
        "border",
        "border-white/[var(--glass-border-opacity)]",
        "shadow-[var(--glass-shadow)]",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9),0_0_50px_-15px_var(--accent-glow),0_0_0_1px_rgba(255,255,255,0.08)_inset]",
        "hover:border-white/25",
        className
      )}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Layer 1: Base frosted glass surface */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at var(--mouse-x) var(--mouse-y),
              rgba(255,255,255,calc(var(--glass-highlight-opacity) * 1.5)) 0%,
              rgba(255,255,255,calc(var(--glass-highlight-opacity) * 0.8)) 25%,
              rgba(255,255,255,calc(var(--glass-highlight-opacity) * 0.3)) 50%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 120% 80% at 50% 120%,
              rgba(255,255,255,calc(var(--glass-highlight-opacity) * 0.5)) 0%,
              transparent 60%
            ),
            linear-gradient(
              135deg,
              rgba(255,255,255,calc(var(--glass-highlight-opacity) * 0.6)) 0%,
              rgba(255,255,255,calc(var(--glass-highlight-opacity) * 0.1)) 40%,
              transparent 60%,
              rgba(0,0,0,calc(var(--glass-highlight-opacity) * 0.15)) 100%
            )
          `,
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 400ms ease-out, background 400ms ease-out",
        }}
      />

      {/* Layer 2: Chromatic aberration / refraction simulation */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at var(--mouse-x) var(--mouse-y),
              rgba(168,85,247,calc(var(--glass-caustic-opacity) * 2)) 0%,
              rgba(236,72,153,var(--glass-caustic-opacity)) 30%,
              rgba(6,182,212,var(--glass-caustic-opacity)) 60%,
              transparent 85%
            )
          `,
          opacity: isHovered ? 0.6 : 0.3,
          mixBlendMode: "screen",
          transition: "opacity 500ms ease-out",
        }}
      />

      {/* Layer 3: Edge rim lighting */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,calc(var(--glass-border-opacity) * 1.2)),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            inset 0 0 0 1px rgba(255,255,255,calc(var(--glass-border-opacity) * 0.4)),
            0 0 0 1px rgba(255,255,255,calc(var(--glass-border-opacity) * 0.2))
          `,
          opacity: isHovered ? 1 : 0.8,
        }}
      />

      {/* Layer 4: Caustic light pattern (subtle animated) */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        style={{
          opacity: config.causticOpacity,
          maskImage: `
            radial-gradient(ellipse 200% 200% at 50% 50%, black 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")
          `,
          background: `
            linear-gradient(
              45deg,
              transparent 48%,
              rgba(168,85,247,0.15) 50%,
              transparent 52%
            ),
            radial-gradient(
              ellipse at var(--mouse-x) var(--mouse-y),
              rgba(168,85,247,0.2) 0%,
              transparent 40%
            )
          `,
          mixBlendMode: "plus-lighter",
          animation: "caustic-drift 20s ease-in-out infinite",
        }}
      />

      {/* Layer 5: Inner glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          boxShadow: `
            inset 0 0 60px -10px var(--accent-glow),
            inset 0 0 100px -20px rgba(168,85,247,0.08)
          `,
          opacity: isHovered ? 0.5 : 0,
          transition: "opacity 400ms ease-out",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes caustic-drift {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: var(--glass-caustic-opacity);
          }
          25% {
            transform: translate(-2%, 1%) rotate(0.5deg) scale(1.02);
            opacity: calc(var(--glass-caustic-opacity) * 1.3);
          }
          50% {
            transform: translate(1%, -1.5%) rotate(-0.3deg) scale(0.98);
            opacity: var(--glass-caustic-opacity);
          }
          75% {
            transform: translate(-1%, 2%) rotate(0.2deg) scale(1.01);
            opacity: calc(var(--glass-caustic-opacity) * 1.2);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .caustic-layer {
            animation: none !important;
          }
        }

        /* Calm mode */
        html[data-calm="true"] .caustic-layer {
          animation: none !important;
          opacity: 0 !important;
        }
      `}</style>
    </div>
  );
}

/**
 * Simpler glass wrapper for existing cards - wraps content with glass layers
 */
export function withGlassEffect<P extends object>(
  Component: React.ComponentType<P>,
  glassProps?: Partial<GlassCardProps>
) {
  return function GlassWrapped(props: P) {
    return (
      <GlassCard {...glassProps}>
        <Component {...props} />
      </GlassCard>
    );
  };
}