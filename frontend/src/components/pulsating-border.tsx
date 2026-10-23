// Pulsating Border — Originkit

"use client";

import * as React from "react";
import { PulsingBorder } from "@paper-design/shaders-react";

export interface PulsatingBorderProps {
  colors?: string[];
  colorBack?: string;
  speed?: number;
  /**
   * Corner radius in pixels (e.g. 28) or ratio (0..1).
   * If omitted, dynamically adapts to card frame: 28px on desktop (lg), 22px on mobile.
   */
  radius?: number;
  thickness?: number;
  softness?: number;
  intensity?: number;
  bloom?: number;
  spotSize?: number;
  spread?: number;
  smoke?: number;
  smokeSize?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_COLORS = ["#000000", "#ffffff", "#a855f7"];

const DEFAULTS = {
  colorBack: "rgba(0, 0, 0, 0)",
  speed: 1,
  radius: 28,
  thickness: 0.35,
  softness: 65,
  intensity: 30,
  bloom: 45,
  spotSize: 60,
  spread: 0,
  smoke: 0, // Clean structural border without noisy drift
  smokeSize: 0,
};

const SPOTS = 3;
const PULSE = 0;

function OriginkitBasePulsatingBorder(props: PulsatingBorderProps) {
  const {
    colorBack = DEFAULTS.colorBack,
    speed = DEFAULTS.speed,
    radius: propRadius,
    thickness = DEFAULTS.thickness,
    softness = DEFAULTS.softness,
    intensity = DEFAULTS.intensity,
    bloom = DEFAULTS.bloom,
    spotSize = DEFAULTS.spotSize,
    spread = DEFAULTS.spread,
    smoke = DEFAULTS.smoke,
    smokeSize = DEFAULTS.smokeSize,
    style,
    className,
    children,
  } = props;

  const colors =
    Array.isArray(props.colors) && props.colors.length
      ? props.colors
      : DEFAULT_COLORS;

  const hostRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w > 0 && h > 0) {
        setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      }
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(host);

    return () => ro.disconnect();
  }, []);

  const worldW = size.w + spread * 2;
  const worldH = size.h + spread * 2;
  const marginX = worldW > 0 ? spread / worldW : 0;
  const marginY = worldH > 0 ? spread / worldH : 0;

  // room provides buffer for bloom / softness glow around the outer edge
  const room = Math.min(100, Math.ceil(0.18 * Math.min(worldW, worldH)));
  const bleed = spread + room;
  const canvasW = size.w + bleed * 2;
  const canvasH = size.h + bleed * 2;
  const measured = size.w > 0 && size.h > 0;

  // Responsive radius in pixels: default to 28px on desktop (lg: w >= 1024), 22px on mobile
  const targetRadiusPx =
    typeof propRadius === "number"
      ? propRadius > 1
        ? propRadius
        : propRadius * (Math.min(size.w, size.h) / 2)
      : size.w >= 1024
      ? 28
      : 22;

  // In PulsingBorder shader:
  // radius = mix(0., min(halfSize.x, halfSize.y), roundness)
  // where min(halfSize.x, halfSize.y) in screen pixels corresponds to Math.min(size.w, size.h) / 2.
  // Therefore, roundness = targetRadiusPx / (Math.min(size.w, size.h) / 2) = (targetRadiusPx * 2) / Math.min(size.w, size.h).
  const minDimension = Math.min(size.w, size.h);
  const roundness =
    minDimension > 0
      ? Math.max(0, Math.min(1, (targetRadiusPx * 2) / minDimension))
      : 0.08;

  const layer = measured ? (
    <PulsingBorder
      colors={colors}
      colorBack={colorBack}
      speed={speed}
      roundness={roundness}
      thickness={thickness / 100}
      softness={softness / 100}
      intensity={intensity / 100}
      bloom={bloom / 100}
      spots={SPOTS}
      spotSize={(spotSize / 100) * 0.5}
      pulse={PULSE}
      smoke={smoke}
      smokeSize={smokeSize}
      worldWidth={worldW}
      worldHeight={worldH}
      fit="none"
      marginLeft={marginX}
      marginRight={marginX}
      marginTop={marginY}
      marginBottom={marginY}
      scale={1}
      rotation={0}
      offsetX={0}
      offsetY={0}
      originX={0.5}
      originY={0.5}
      frame={0}
      style={{
        position: "absolute",
        left: -bleed,
        top: -bleed,
        width: canvasW,
        height: canvasH,
        zIndex: (style?.zIndex as number | undefined) ?? 20,
        pointerEvents: "none",
      }}
    />
  ) : null;

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        flexShrink: 0,
        overflow: "visible",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
      {layer}
    </div>
  );
}

const __originkitPresetProps = {
  colors: ["#000000", "#ffffff", "#a855f7"],
  thickness: 0.35,
  radius: 28,
  softness: 65,
  intensity: 30,
  bloom: 45,
  spread: 0,
  smoke: 0,
  speed: 1,
  spotSize: 60,
};

export function PulsatingBorder(props: PulsatingBorderProps) {
  return (
    <OriginkitBasePulsatingBorder
      {...(__originkitPresetProps as Record<string, unknown>)}
      {...props}
    />
  );
}

export default PulsatingBorder;
