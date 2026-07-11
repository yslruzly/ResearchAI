"use client";
// From ui.unlumen.com's animated-list, plus a stagger prop.

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type AnimationType = "scale" | "slide" | "fade" | "bounce";

export interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  maxVisible?: number;
  gap?: number;
  animation?: AnimationType;
  stagger?: number;
  className?: string;
}

function variantsFor(type: AnimationType) {
  switch (type) {
    case "slide":
      return { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };
    case "fade":
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    case "bounce":
      return { initial: { opacity: 0, y: -20, scale: 0.8 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.8 } };
    default:
      return { initial: { opacity: 0, y: -20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.9 } };
  }
}

export function AnimatedList<T extends { id: string | number }>({
  items,
  renderItem,
  maxVisible = 12,
  gap = 8,
  animation = "scale",
  stagger = 0.05,
  className,
}: AnimatedListProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const visible = items.slice(0, maxVisible);
  const variants = variantsFor(animation);

  return (
    <div className={cn("flex flex-col", className)} style={{ gap: `${gap}px` }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {visible.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={shouldReduceMotion ? { opacity: 0 } : variants.initial}
            animate={shouldReduceMotion ? { opacity: 1 } : variants.animate}
            exit={shouldReduceMotion ? { opacity: 0 } : variants.exit}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 350,
                    damping: 28,
                    delay: index * stagger,
                    layout: { type: "spring", stiffness: 350, damping: 28 },
                  }
            }
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
