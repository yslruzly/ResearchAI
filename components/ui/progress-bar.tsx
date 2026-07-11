"use client";
// Based on smoothui.dev's animated-progress-bar, recolored for this palette.

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** 0-100 */
  value: number;
  className?: string;
  color?: string;
  "aria-label"?: string;
}

const SPRING = { type: "spring" as const, damping: 18, mass: 0.6, stiffness: 120 };

export default function ProgressBar({
  value,
  className,
  color = "#3B82F6",
  "aria-label": ariaLabel = "Research progress",
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-[3px] w-full overflow-hidden rounded-full bg-border", className)}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={shouldReduceMotion ? { duration: 0 } : SPRING}
      />
    </div>
  );
}
