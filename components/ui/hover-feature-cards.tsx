"use client";
// Based on ui.unlumen.com's hover-feature-cards. Their classes assume Tailwind
// v4 (z-5, h-22), so those are rewritten for v3, and the image slots are gone
// since these cards only carry text.

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface HoverFeatureCardItem {
  name: string;
  description: string;
  /** rendered top-right (the step number here) */
  badge?: ReactNode;
  body?: ReactNode;
}

export interface HoverFeatureCardsProps {
  items: HoverFeatureCardItem[];
  className?: string;
}

function HoverFeatureCard({ item }: { item: HoverFeatureCardItem }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      variants={{ rest: { scale: 1, y: 0 } }}
      className="group relative flex w-full flex-col"
    >
      <div className="z-[5] flex h-52 w-full flex-col rounded-3xl border border-border bg-surface transition-colors group-hover:border-border2">
        {item.badge && (
          <span className="absolute right-4 top-4 z-10 font-display text-3xl text-border2">
            {item.badge}
          </span>
        )}

        <div className="relative flex w-full flex-col gap-3 overflow-hidden px-5 pb-4 pt-6">
          <span className="font-display text-xl tracking-tight text-ink">{item.name}</span>
          {item.body}
        </div>
      </div>

      {/* The description slides out from behind the card on hover. */}
      <motion.div
        variants={{ rest: { opacity: 0.35, y: -30 }, hover: { opacity: 1, y: 0 } }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="z-[1] w-11/12 self-center overflow-hidden"
      >
        <div className="relative rounded-b-3xl border border-t-0 border-border bg-surface2 px-5 py-3">
          {/* seam shadow under the card's bottom edge */}
          <div className="pointer-events-none absolute -left-1 -top-1 h-4 w-[103%] bg-gradient-to-b from-paper/60 to-transparent" />
          <p className="relative text-[13px] leading-relaxed text-ink/70">{item.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HoverFeatureCards({ items, className }: HoverFeatureCardsProps) {
  return (
    <div className={cn("grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <HoverFeatureCard key={item.name} item={item} />
      ))}
    </div>
  );
}
