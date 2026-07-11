"use client";
// From smoothui.dev's reveal-text, tweaked to take ReactNode children.

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

export interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  triggerOnView?: boolean;
}

const OFFSETS = {
  up: { y: 24, opacity: 0 },
  down: { y: -24, opacity: 0 },
  left: { x: 24, opacity: 0 },
  right: { x: -24, opacity: 0 },
};

export default function RevealText({
  children,
  direction = "up",
  delay = 0,
  triggerOnView = true,
  className,
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "block" }}
      initial={shouldReduceMotion ? { opacity: 1 } : OFFSETS[direction]}
      animate={play ? { x: 0, y: 0, opacity: 1 } : shouldReduceMotion ? { opacity: 1 } : undefined}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, delay: delay / 1000 }}
    >
      {children}
    </motion.span>
  );
}
