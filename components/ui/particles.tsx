"use client";
// Drifting dots on a 2d canvas. Not WebGL on purpose: the hero already owns a
// three.js context and 70 dots don't need a shader. Pauses off-screen; renders
// one still frame under reduced motion.

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  phase: number;
  twinkle: number;
  color: string;
}

export interface ParticlesProps {
  /** dots per 100k px^2 of area */
  density?: number;
  colors?: string[];
  /** Drift speed in px/s at 1x DPR. */
  speed?: number;
  className?: string;
}

// module-level so the default keeps a stable identity; an inline default array
// is a new object every render, which re-runs the effect and reseeds the field
// whenever a parent re-renders (e.g. on every keystroke in the search input)
const DEFAULT_COLORS = ["#3B82F6", "#34D399", "#8B5CF6", "#F0EDE8"];

export default function Particles({
  density = 6,
  colors = DEFAULT_COLORS,
  speed = 12,
  className,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const seed = () => {
      const count = Math.round(((width * height) / 100_000) * density);
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (0.4 + Math.random() * 0.6) * speed;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          r: 0.6 + Math.random() * 1.4,
          baseAlpha: 0.12 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.4 + Math.random() * 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    };

    const resize = () => {
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.phase += p.twinkle * dt;

        // wrap at edges
        if (p.x < -4) p.x = width + 4;
        else if (p.x > width + 4) p.x = -4;
        if (p.y < -4) p.y = height + 4;
        else if (p.y > height + 4) p.y = -4;

        ctx.globalAlpha = Math.max(0.05, p.baseAlpha + Math.sin(p.phase) * 0.15);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }
      // clamp dt so a background tab doesn't teleport particles
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(dt);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    if (reduce) {
      draw(0); // one still frame, no loop
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(parent);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [density, colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
