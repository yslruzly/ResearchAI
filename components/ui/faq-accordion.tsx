"use client";
// Based on ui.unlumen.com's motion-faqs-accordion, restyled. Collapsed panels
// get visibility:hidden so their links drop out of the tab order.

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  itemId,
  panelId,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  itemId: string;
  panelId: string;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContentH(el.scrollHeight));
    ro.observe(el);
    setContentH(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      layout
      className="glass overflow-hidden rounded-2xl border border-white/10 text-ink shadow-sm"
      transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
      animate={{ scale: isOpen || shouldReduceMotion ? 1 : 0.99 }}
      initial={false}
      style={{ originX: 0.5, originY: 0 }}
    >
      <button
        id={itemId}
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full select-none items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[15px] font-medium leading-snug text-ink">{item.question}</span>
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 28 }}
          className="inline-flex size-6 shrink-0 items-center justify-center text-muted"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d={isOpen ? "M1 7h12" : "M7 1v12M1 7h12"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={itemId}
        initial={false}
        animate={{ height: isOpen ? contentH : 0, opacity: isOpen ? 1 : 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                height: { type: "spring", stiffness: 340, damping: 34, mass: 0.9 },
                opacity: { duration: 0.2, ease: "easeOut" },
              }
        }
        style={{ overflow: "hidden", visibility: isOpen ? "visible" : "hidden" }}
      >
        <div ref={contentRef} className="px-6 pb-6">
          <p className="text-[13px] leading-relaxed text-ink/70">{item.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const rawId = React.useId();
  const baseId = `faq-${rawId.replace(/:/g, "")}`;
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
          itemId={`${baseId}-trigger-${i}`}
          panelId={`${baseId}-panel-${i}`}
        />
      ))}
    </div>
  );
}
