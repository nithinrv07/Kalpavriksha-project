// Crystal Glow — Originkit

"use client";

import * as React from "react";
import { motion, type TargetAndTransition, type Transition } from "motion/react";

export interface SparkleButtonProps {
  text?: string;
  lines?: readonly string[] | string[];
  fontFamily?: string | Record<string, unknown>;
  fontWeight?: number | string;
  fontSize?: number | string;
  lineHeight?: number | string;
  letterSpacing?: string;
  textColor?: string;
  shadowColor?: string;
  glareColor?: string;
  glareSpeed?: number;
  glareDirection?: "left-to-right" | "right-to-left";
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  align?: "left" | "center" | "right";
  as?: "a" | "h1" | "h2" | "div" | "span";
}

function OriginkitBaseSparkleButton({
  text = "Rooted To Rise",
  lines,
  fontFamily = "var(--font-display), sans-serif",
  fontWeight = 800,
  fontSize = 64,
  lineHeight,
  letterSpacing,
  textColor = "#C3AFD4",
  shadowColor = "#1E0028",
  glareColor = "#4A105DBF",
  glareSpeed = 1,
  glareDirection = "left-to-right",
  transition = { type: "spring", stiffness: 400, damping: 25, mass: 1 },
  className = "",
  style,
  href,
  onClick,
  align = "center",
  as = "a",
}: SparkleButtonProps) {
  const resolvedFontFamily =
    typeof fontFamily === "string"
      ? fontFamily
      : typeof fontFamily === "object" && fontFamily !== null
        ? ((fontFamily as Record<string, unknown>).fontFamily as string) || "var(--font-display), sans-serif"
        : "var(--font-display), sans-serif";

  const resolvedFontWeight =
    typeof fontFamily === "object" && fontFamily !== null && (fontFamily as Record<string, unknown>).fontWeight
      ? ((fontFamily as Record<string, unknown>).fontWeight as number | string)
      : fontWeight;

  const resolvedFontSize =
    typeof fontFamily === "object" && fontFamily !== null && (fontFamily as Record<string, unknown>).fontSize
      ? ((fontFamily as Record<string, unknown>).fontSize as string | number)
      : fontSize;

  const resolvedLineHeight =
    lineHeight ??
    (typeof fontFamily === "object" && fontFamily !== null && (fontFamily as Record<string, unknown>).lineHeight
      ? ((fontFamily as Record<string, unknown>).lineHeight as string | number)
      : undefined);

  const resolvedLetterSpacing =
    letterSpacing ??
    (typeof fontFamily === "object" && fontFamily !== null && (fontFamily as Record<string, unknown>).letterSpacing
      ? ((fontFamily as Record<string, unknown>).letterSpacing as string)
      : undefined);

  const fontSizeCss =
    typeof resolvedFontSize === "number" ? `${resolvedFontSize}px` : resolvedFontSize;

  const variants = React.useMemo(() => {
    let hoverPos = 1;
    let restPos = 0;
    if (glareDirection === "right-to-left") {
      hoverPos = 0;
      restPos = 1;
    }

    return {
      rest: {
        "--hover": 0.45,
        "--pos": restPos,
        transition: {
          "--hover": transition,
          "--pos": { duration: 0 },
        },
      } as TargetAndTransition,
      hover: {
        "--hover": 1,
        "--pos": hoverPos,
        transition: {
          "--hover": transition,
          "--pos": {
            duration: 1 / glareSpeed,
            ease: "linear",
          },
        },
      } as TargetAndTransition,
      tap: {
        "--hover": 0,
      } as TargetAndTransition,
    };
  }, [glareDirection, glareSpeed, transition]);

  const alignItems =
    align === "right" ? "flex-end" : align === "left" ? "flex-start" : "center";

  const content = lines && lines.length > 0 ? (
    lines.map((line, idx) => (
      <span key={idx} className="block w-full">
        {line}
      </span>
    ))
  ) : (
    <span>{text}</span>
  );

  const motionProps = {
    className: `sparkle-button ${className}`,
    style: {
      fontFamily: resolvedFontFamily,
      textAlign: align,
      letterSpacing: resolvedLetterSpacing,
      lineHeight: resolvedLineHeight,
      "--color": textColor,
      "--shadow": shadowColor,
      "--glare": glareColor,
      "--font-size": fontSizeCss,
      "--sparkle-align-items": alignItems,
      "--sparkle-text-align": align,
      ...style,
    } as React.CSSProperties,
    initial: "rest" as const,
    whileHover: "hover" as const,
    whileTap: "tap" as const,
    variants,
    onClick,
  };

  const inner = (
    <>
      <Sparkle />
      <Sparkle />
      <Sparkle />
      <Sparkle />
      <Sparkle />

      <span className="sparkle-text-base">{content}</span>
      <span aria-hidden="true" className="sparkle-text-glare">
        {content}
      </span>
    </>
  );

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems,
        justifyContent: alignItems,
        width: align === "right" || align === "left" ? "100%" : "auto",
      }}
    >
      <style>{`
.sparkle-button {
  --padding: 4px 8px;
  padding: var(--padding);
  border-radius: 16px;
  text-decoration: none;
  color: transparent;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: var(--sparkle-align-items, center);
  justify-content: center;
  user-select: none;
}

.sparkle-button .sparkle-text-base {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: var(--font-size);
  font-weight: ${resolvedFontWeight};
  text-decoration: none;
  color: transparent;
  text-align: var(--sparkle-text-align, center);
  text-shadow:
    calc(var(--hover) * (var(--font-size) * -0)) calc(var(--hover) * (var(--font-size) * 0)) var(--shadow),
    calc(var(--hover) * (var(--font-size) * -0.02)) calc(var(--hover) * (var(--font-size) * 0.02)) var(--shadow),
    calc(var(--hover) * (var(--font-size) * -0.04)) calc(var(--hover) * (var(--font-size) * 0.04)) var(--shadow),
    calc(var(--hover) * (var(--font-size) * -0.06)) calc(var(--hover) * (var(--font-size) * 0.06)) var(--shadow),
    calc(var(--hover) * (var(--font-size) * -0.08)) calc(var(--hover) * (var(--font-size) * 0.08)) var(--shadow),
    calc(var(--hover) * (var(--font-size) * -0.10)) calc(var(--hover) * (var(--font-size) * 0.10)) var(--shadow);
  transform: translate(calc(var(--hover) * (var(--font-size) * 0.10)), calc(var(--hover) * (var(--font-size) * -0.10)));
}

.sparkle-button .sparkle-text-glare {
  position: absolute;
  inset: 0;
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: var(--sparkle-align-items, center);
  justify-content: center;
  text-align: var(--sparkle-text-align, center);
  font-size: var(--font-size);
  font-weight: ${resolvedFontWeight};
  background: linear-gradient(
    108deg,
    transparent 0 50%,
    var(--glare) 52% 62%,
    transparent 64% 72%,
    var(--glare) 74% 88%,
    transparent 90%
  ) calc(var(--pos) * -200%) 0% / 200% 100%, var(--color);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  z-index: 2;
  text-shadow: none;
  transform: translate(calc(var(--hover) * (var(--font-size) * 0.10)), calc(var(--hover) * (var(--font-size) * -0.10)));
}

.sparkle-button svg {
  position: absolute;
  z-index: 3;
  width: calc(var(--font-size) * 0.45);
  aspect-ratio: 1;
  pointer-events: none;
  top: calc(var(--y, 50) * 1%);
  left: calc(var(--x, 0) * 1%);
  transform: translate(-50%, -50%) scale(0);
}

.sparkle-button svg path {
  fill: var(--glare);
}

.sparkle-button:hover svg {
  animation: sparkle 0.75s calc((var(--delay-step) * var(--d)) * 1s) both;
}

@keyframes sparkle {
  50% {
    transform: translate(-50%, -50%) scale(var(--s, 1));
  }
}

.sparkle-button svg:nth-of-type(1) { --x: 8; --y: 15; --s: 1.15; --d: 1; --delay-step: 0.14; }
.sparkle-button svg:nth-of-type(2) { --x: 18; --y: 85; --s: 1.3; --d: 2; --delay-step: 0.14; }
.sparkle-button svg:nth-of-type(3) { --x: 52; --y: 20; --s: 1.1; --d: 3; --delay-step: 0.14; }
.sparkle-button svg:nth-of-type(4) { --x: 82; --y: 78; --s: 1.0; --d: 2; --delay-step: 0.14; }
.sparkle-button svg:nth-of-type(5) { --x: 94; --y: 25; --s: 0.9; --d: 4; --delay-step: 0.14; }
`}</style>

      {as === "h1" ? (
        <motion.h1 {...motionProps}>{inner}</motion.h1>
      ) : as === "h2" ? (
        <motion.h2 {...motionProps}>{inner}</motion.h2>
      ) : as === "div" ? (
        <motion.div {...motionProps}>{inner}</motion.div>
      ) : as === "span" ? (
        <motion.span {...motionProps}>{inner}</motion.span>
      ) : (
        <motion.a href={href} {...motionProps}>{inner}</motion.a>
      )}
    </div>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z" />
    </svg>
  );
}

const __originkitPresetProps = {
  text: "Rooted To Rise",
  fontFamily: {
    variant: "Extra Bold",
    fontSize: "90px",
    textAlign: "center",
    fontFamily: "Inter",
    fontWeight: 800,
    lineHeight: "1em",
    letterSpacing: "0.04em",
  },
  textColor: "#C3AFD4",
  shadowColor: "#1E0028",
  glareColor: "#4A105DBF",
};

export function SparkleButton(props: Partial<SparkleButtonProps>) {
  return (
    <OriginkitBaseSparkleButton
      {...(__originkitPresetProps as Record<string, unknown>)}
      {...props}
    />
  );
}

export default SparkleButton;
