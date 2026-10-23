"use client";

import * as React from "react";
import { useState } from "react";
import "./flip-card.css";

export interface FlipCardProps {
  front: React.ReactNode;
  back?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  background?: string;
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  glare?: boolean;
  axis?: "x" | "y";
  draggable?: boolean;
  disabled?: boolean;
  fade?: boolean;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export function FlipCard({
  front,
  back,
  width,
  height,
  radius,
  background,
  shadow = true,
  shadowColor,
  shadowOpacity,
  glare = false,
  axis = "y",
  draggable = false,
  disabled = false,
  fade = false,
  flipped,
  defaultFlipped = false,
  onFlip,
  className = "",
  style,
  ariaLabel,
}: FlipCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);
  const isFlipped = flipped !== undefined ? flipped : internalFlipped;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    // Do not flip if the user clicked an interactive child (e.g. link, button, input)
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.closest("a, button, input, select, textarea, [role='button'], [data-no-flip]") ||
        target.isContentEditable)
    ) {
      return;
    }

    const next = !isFlipped;
    if (flipped === undefined) {
      setInternalFlipped(next);
    }
    onFlip?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const next = !isFlipped;
      if (flipped === undefined) {
        setInternalFlipped(next);
      }
      onFlip?.(next);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!glare) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--fc-gx", `${x}%`);
    e.currentTarget.style.setProperty("--fc-gy", `${y}%`);
    e.currentTarget.style.setProperty("--fc-sheen", "1");
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!glare) return;
    e.currentTarget.style.setProperty("--fc-sheen", "0");
  };

  const cssVars: Record<string, string | number> = {};
  if (width !== undefined) cssVars["--fc-w"] = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) cssVars["--fc-h"] = typeof height === "number" ? `${height}px` : height;
  if (radius !== undefined) cssVars["--fc-radius"] = typeof radius === "number" ? `${radius}px` : radius;
  if (background !== undefined) cssVars["--fc-bg"] = background;
  if (shadowColor !== undefined) cssVars["--fc-shadow"] = shadowColor;
  if (shadowOpacity !== undefined) cssVars["--fc-shadow-o"] = shadowOpacity;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-axis={axis === "x" ? "x" : undefined}
      data-draggable={draggable ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-fade={fade ? (isFlipped ? "back" : "front") : undefined}
      data-flipped={isFlipped ? "" : undefined}
      className={`flip-card ${className}`}
      style={{
        ...cssVars,
        ...style,
      }}
    >
      {shadow && <div className="flip-card__shadow" aria-hidden />}
      <div
        className="flip-card__rotor"
        style={{
          transform: isFlipped
            ? axis === "x"
              ? "rotateX(180deg)"
              : "rotateY(180deg)"
            : "rotate(0deg)",
        }}
      >
        <div className="flip-card__face flip-card__face--front">
          {front}
          {glare && <div className="flip-card__glare" aria-hidden />}
        </div>
        <div className="flip-card__face flip-card__face--back">
          {back}
          {glare && <div className="flip-card__glare" aria-hidden />}
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
