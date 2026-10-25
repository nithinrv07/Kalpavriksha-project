"use client";

import { useEffect, useRef } from "react";
import { createParticleScene, type ParticleScene } from "@/lib/particle-scene";
import type { ShapeName } from "@/lib/shapes";

export function ParticleCanvas({
  shape,
  className,
  active = true,
}: {
  shape: ShapeName;
  className?: string;
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ParticleScene | null>(null);
  const initialShape = useRef(shape);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createParticleScene(canvas, initialShape.current);
    sceneRef.current = scene;
    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.morphTo(shape);
  }, [shape]);

  useEffect(() => {
    sceneRef.current?.setActive(active);
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
