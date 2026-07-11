"use client";
// Based on ui.unlumen.com's aurora-bars, rewritten to write bar heights via
// refs (no per-frame setState) and to scale with transform instead of height.
// One blur on the wrapper instead of one per bar; pauses off-screen.

import { useEffect, useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AuroraBarsProps {
  barCount?: number;
  colors?: string[];
  maxHeightRatio?: number;
  minHeightRatio?: number;
  speed?: number;
  gap?: number;
  blur?: number;
  className?: string;
}

/** Arch envelope (tallest in the middle) blended with two out-of-phase sines. */
function barHeight(index: number, total: number, time: number, minH: number, maxH: number) {
  const norm = total > 1 ? index / (total - 1) : 0;
  const arch = Math.sin(norm * Math.PI);
  const wave =
    0.5 +
    0.25 * Math.sin(time * 1.1 + (index / total) * Math.PI * 2) +
    0.25 * Math.sin(time * 0.7 + (index / total) * Math.PI * 5.3);
  return minH + (arch * 0.65 + wave * 0.35) * (maxH - minH);
}

export default function AuroraBars({
  barCount = 28,
  colors = ["#1E3A8A00", "#1E40AF", "#3B82F6", "#34D399"],
  maxHeightRatio = 0.92,
  minHeightRatio = 0.14,
  speed = 0.45,
  gap = 3,
  blur = 10,
  className,
}: AuroraBarsProps) {
  const shouldReduceMotion = useReducedMotion();
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const [visible, setVisible] = useState(true);

  // Don't burn frames on a hero the user has scrolled past.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, deltaMs) => {
    if (shouldReduceMotion || !visible) return;
    timeRef.current += (deltaMs / 1000) * speed;
    for (let i = 0; i < barCount; i++) {
      const bar = barsRef.current[i];
      if (bar) {
        const h = barHeight(i, barCount, timeRef.current, minHeightRatio, maxHeightRatio);
        bar.style.transform = `scaleY(${h})`;
      }
    }
  });

  const stops = colors
    .map((c, i) => `${c} ${Math.round((i / (colors.length - 1)) * 100)}%`)
    .join(", ");

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none relative h-full w-full overflow-hidden", className)}
      // Isolate paint so bar repaints can't invalidate the rest of the page.
      style={{ contain: "paint" }}
    >
      {/* One blur pass for the whole field instead of one per bar. */}
      <div className="absolute inset-0 flex items-end" style={{ filter: `blur(${blur}px)` }}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div key={i} className="flex h-full flex-1 items-end" style={{ padding: `0 ${gap / 2}px` }}>
            <div
              ref={(el) => { barsRef.current[i] = el; }}
              className="h-full w-full opacity-70"
              style={{
                background: `linear-gradient(to top, ${stops})`,
                transformOrigin: "bottom",
                transform: `scaleY(${barHeight(i, barCount, 0, minHeightRatio, maxHeightRatio)})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Vignette so the bars dissolve into the page rather than ending at a hard edge. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 100%, transparent 30%, #0D0D0D 92%)",
        }}
      />
    </div>
  );
}
