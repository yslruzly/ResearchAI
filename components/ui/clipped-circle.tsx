"use client";
// From ui.unlumen.com; tilt-card needs it but doesn't declare the dependency.
// Position runs through motion values so mousemove doesn't re-render.

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export interface ClippedCircleProps {
  className?: string;
  circleClassName?: string;
  circleSize?: number;
}

export function ClippedCircle({
  className,
  circleClassName = "bg-white/20",
  circleSize = 400,
}: ClippedCircleProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue("50%");
  const y = useMotionValue("50%");
  const scale = useSpring(0, { stiffness: 260, damping: 30 });

  React.useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent || shouldReduceMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const track = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x.set(`${((e.clientX - rect.left) / rect.width) * 100}%`);
      y.set(`${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    const enter = (e: MouseEvent) => {
      track(e);
      scale.set(1);
    };
    const leave = () => scale.set(0);

    const opts = { passive: true } as const;
    parent.addEventListener("mouseenter", enter, opts);
    parent.addEventListener("mousemove", track, opts);
    parent.addEventListener("mouseleave", leave, opts);
    return () => {
      parent.removeEventListener("mouseenter", enter);
      parent.removeEventListener("mousemove", track);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [shouldReduceMotion, x, y, scale]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <motion.div
        className={cn("pointer-events-none absolute rounded-full", circleClassName)}
        style={{
          left: x,
          top: y,
          scale,
          x: "-50%",
          y: "-50%",
          width: circleSize,
          height: circleSize,
        }}
      />
    </div>
  );
}
