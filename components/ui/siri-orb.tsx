"use client";
// Based on smoothui.dev's siri-orb. Keyframes live in globals.css so several
// orbs share one style block. Dot overlay is opt-in; rotation pauses off-screen.

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SiriOrbProps {
  size?: string;
  className?: string;
  colors?: { bg?: string; c1?: string; c2?: string; c3?: string };
  animationDuration?: number;
  /** dot overlay; costs a backdrop-filter pass */
  dots?: boolean;
}

const DEFAULT_COLORS = {
  bg: "#0D0D0D",
  c1: "#3B82F6",
  c2: "#34D399",
  c3: "#6366F1",
};

export default function SiriOrb({
  size = "192px",
  className,
  colors,
  animationDuration = 20,
  dots = false,
}: SiriOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const finalColors = { ...DEFAULT_COLORS, ...colors };
  const px = Number.parseInt(size.replace("px", ""), 10);

  const isSmall = px < 50;
  // 2px floor, not 4: a 4px blur on a ~72px orb (the loading splash) reads as
  // a fuzzy blob instead of plasma
  const blur = isSmall ? Math.max(px * 0.008, 1) : Math.max(px * 0.015, 2);
  const contrast = isSmall ? Math.max(px * 0.004, 1.2) : Math.max(px * 0.008, 1.5);
  const dot = isSmall ? Math.max(px * 0.004, 0.05) : Math.max(px * 0.008, 0.1);
  const shadow = isSmall ? Math.max(px * 0.004, 0.5) : Math.max(px * 0.008, 2);

  const maskRadius = px < 30 ? "0%" : px < 50 ? "5%" : px < 100 ? "15%" : "25%";
  const finalContrast = px < 30 ? 1.1 : isSmall ? Math.max(contrast * 1.2, 1.3) : contrast;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("siri-orb", dots && "siri-orb--dots", !visible && "siri-orb--paused", className)}
      style={
        {
          width: size,
          height: size,
          "--orb-bg": finalColors.bg,
          "--orb-c1": finalColors.c1,
          "--orb-c2": finalColors.c2,
          "--orb-c3": finalColors.c3,
          "--orb-duration": `${animationDuration}s`,
          "--orb-blur": `${blur}px`,
          "--orb-contrast": finalContrast,
          "--orb-dot": `${dot}px`,
          "--orb-shadow": `${shadow}px`,
          "--orb-mask": maskRadius,
        } as React.CSSProperties
      }
    />
  );
}
