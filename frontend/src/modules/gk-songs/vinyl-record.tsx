"use client";

/**
 * VinylRecord — Premium animated vinyl record with Ashoka Chakra / cultural artwork.
 * Spins while playing; stops when paused. Uses CSS animation-play-state.
 */

import { useId } from "react";

type VinylVariant = "patriotic" | "tamil" | "english" | "default";

interface VinylRecordProps {
  spinning: boolean;
  variant: VinylVariant;
  ambientColor?: string;
  size?: number;
}

function AshokaChaкra({ size = 60, color = "#c084fc" }: { size?: number; color?: string }) {
  const r = size / 2;
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 24;
    const x1 = r + Math.cos(angle) * (r * 0.18);
    const y1 = r + Math.sin(angle) * (r * 0.18);
    const x2 = r + Math.cos(angle) * (r * 0.82);
    const y2 = r + Math.sin(angle) * (r * 0.82);
    return { x1, y1, x2, y2 };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={r} cy={r} r={r * 0.9} fill="none" stroke={color} strokeWidth={1.5} opacity={0.6} />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth={1} opacity={0.8} />
      ))}
      <circle cx={r} cy={r} r={r * 0.12} fill={color} opacity={0.9} />
    </svg>
  );
}

function TamilSunSymbol({ size = 60, color = "#DAA520" }: { size?: number; color?: string }) {
  const r = size / 2;
  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 16;
    const x1 = r + Math.cos(angle) * (r * 0.4);
    const y1 = r + Math.sin(angle) * (r * 0.4);
    const x2 = r + Math.cos(angle) * (r * 0.85);
    const y2 = r + Math.sin(angle) * (r * 0.85);
    return { x1, y1, x2, y2 };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {rays.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth={1.5} opacity={0.7} />
      ))}
      <circle cx={r} cy={r} r={r * 0.3} fill="none" stroke={color} strokeWidth={1.5} opacity={0.8} />
      <circle cx={r} cy={r} r={r * 0.08} fill={color} opacity={0.9} />
    </svg>
  );
}

function StarSymbol({ size = 60, color = "#c084fc" }: { size?: number; color?: string }) {
  const r = size / 2;
  const points = Array.from({ length: 5 }, (_, i) => {
    const outer = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const inner = outer + Math.PI / 5;
    return [
      `${r + Math.cos(outer) * r * 0.7},${r + Math.sin(outer) * r * 0.7}`,
      `${r + Math.cos(inner) * r * 0.3},${r + Math.sin(inner) * r * 0.3}`,
    ].join(" ");
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <polygon points={points} fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
      <circle cx={r} cy={r} r={r * 0.08} fill={color} opacity={0.9} />
    </svg>
  );
}

export function VinylRecord({
  spinning,
  variant,
  ambientColor = "#c084fc",
  size = 220,
}: VinylRecordProps) {
  const id = useId();
  const gradId = `vr-grad-${id}`;
  const shineId = `vr-shine-${id}`;
  const maskId = `vr-mask-${id}`;

  const r = size / 2;
  const grooves = [0.95, 0.88, 0.82, 0.76, 0.70, 0.64, 0.58];
  const labelR = r * 0.38;
  const holeMR = r * 0.045;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{
        animation: "vinyl-spin 5s linear infinite",
        animationPlayState: spinning ? "running" : "paused",
        willChange: "transform",
        filter: `drop-shadow(0 8px 32px ${ambientColor}44) drop-shadow(0 2px 8px rgba(0,0,0,0.6))`,
      }}
    >
      <defs>
        {/* Vinyl surface radial gradient */}
        <radialGradient id={gradId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#2a1a3e" />
          <stop offset="30%" stopColor="#16082a" />
          <stop offset="70%" stopColor="#0c0518" />
          <stop offset="100%" stopColor="#08030f" />
        </radialGradient>
        {/* Specular shine */}
        <radialGradient id={shineId} cx="30%" cy="25%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Centre label clip */}
        <clipPath id={maskId}>
          <circle cx={r} cy={r} r={labelR} />
        </clipPath>
      </defs>

      {/* Outer vinyl body */}
      <circle cx={r} cy={r} r={r} fill={`url(#${gradId})`} />

      {/* Groove rings */}
      {grooves.map((gr) => (
        <circle
          key={gr}
          cx={r}
          cy={r}
          r={r * gr}
          fill="none"
          stroke="rgba(255,255,255,0.045)"
          strokeWidth={0.8}
        />
      ))}

      {/* Specular highlight arc */}
      <path
        d={`M ${r * 0.22 + r} ${r} A ${r * 0.78} ${r * 0.78} 0 0 1 ${r + r * 0.78 * Math.cos((2 * Math.PI) / 3)} ${r + r * 0.78 * Math.sin((2 * Math.PI) / 3)}`}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Shine overlay */}
      <circle cx={r} cy={r} r={r} fill={`url(#${shineId})`} />

      {/* Thin metallic outer border */}
      <circle
        cx={r}
        cy={r}
        r={r - 0.8}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1.5}
      />

      {/* Centre label */}
      <circle cx={r} cy={r} r={labelR} fill="#1a0a30" />
      <circle
        cx={r}
        cy={r}
        r={labelR}
        fill="none"
        stroke={ambientColor}
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <circle
        cx={r}
        cy={r}
        r={labelR * 0.88}
        fill="none"
        stroke={ambientColor}
        strokeOpacity={0.2}
        strokeWidth={0.8}
      />

      {/* Artwork inside label */}
      <g clipPath={`url(#${maskId})`}>
        <foreignObject x={r - labelR} y={r - labelR} width={labelR * 2} height={labelR * 2}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {variant === "patriotic" && (
              <AshokaChaкra size={labelR * 1.5} color={ambientColor} />
            )}
            {variant === "tamil" && (
              <TamilSunSymbol size={labelR * 1.5} color={ambientColor} />
            )}
            {(variant === "english" || variant === "default") && (
              <StarSymbol size={labelR * 1.5} color={ambientColor} />
            )}
          </div>
        </foreignObject>
      </g>

      {/* Centre hole */}
      <circle cx={r} cy={r} r={holeMR} fill="#08030f" />
    </svg>
  );
}

export function getVinylVariant(category: string): VinylVariant {
  if (category === "national-anthem" || category === "national-song" || category === "patriotic-hindi") {
    return "patriotic";
  }
  if (category === "patriotic-tamil" || category === "children-tamil") {
    return "tamil";
  }
  if (category === "children-english") {
    return "english";
  }
  return "default";
}

