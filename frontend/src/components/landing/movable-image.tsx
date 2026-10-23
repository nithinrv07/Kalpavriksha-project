"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface MovableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function MovableImage({
  src,
  alt,
  width = 571,
  height = 350,
  className = "",
}: MovableImageProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const startRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const movedRef = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    setIsDragging(true);
    movedRef.current = false;
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [position.x, position.y]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      movedRef.current = true;
    }

    // Limit drag radius so it stays in sight
    const maxDistance = 90;
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, startRef.current.initialX + dx));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, startRef.current.initialY + dy));

    setPosition({ x: clampedX, y: clampedY });
    setRotation(clampedX * 0.08);
  }, [isDragging]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }

    if (!movedRef.current) {
      // It was a click! Trigger a playful movement hop
      setIsClicked(true);
      setPosition({ x: (Math.random() - 0.5) * 36, y: -16 });
      setRotation((Math.random() - 0.5) * 8);

      setTimeout(() => {
        setPosition({ x: 0, y: 0 });
        setRotation(0);
        setIsClicked(false);
      }, 700);
    } else {
      // Return smoothly to center after release
      setTimeout(() => {
        setPosition({ x: 0, y: 0 });
        setRotation(0);
      }, 200);
    }
  }, [isDragging]);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className={`group/movable relative select-none touch-none will-change-transform ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) scale(${
          isDragging ? 1.05 : isClicked ? 1.03 : 1
        })`,
        transition: isDragging
          ? "none"
          : "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_-8px_rgba(124,58,237,0.3)] transition-all duration-300 group-hover/movable:border-violet/50 group-hover/movable:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-5px_rgba(124,58,237,0.45)] lg:rounded-3xl">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          draggable={false}
          className="h-auto w-full max-w-[440px] object-cover object-center transition-transform duration-300 group-hover/movable:scale-[1.02] lg:max-w-[480px]"
        />
        {/* Subtle highlight sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent"
        />
      </div>
    </div>
  );
}
