"use client";
// Based on smoothui.dev's button-copy, but state follows the real clipboard
// promise instead of fixed timeouts, so failures actually show as failures.

import { Check, Copy, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "success" | "error";

export interface ButtonCopyProps {
  onCopy: () => Promise<void>;
  className?: string;
  /** How long the success/error state lingers before returning to idle. */
  resetAfter?: number;
  label?: string;
}

const ICONS: Record<State, React.ReactNode> = {
  idle: <Copy className="h-3 w-3" />,
  loading: <LoaderCircle className="h-3 w-3 animate-spin" />,
  success: <Check className="h-3 w-3 text-good" />,
  error: <X className="h-3 w-3 text-danger" />,
};

const LABELS: Record<State, string> = {
  idle: "copy",
  loading: "copying",
  success: "copied!",
  error: "copy failed",
};

export default function ButtonCopy({
  onCopy,
  className,
  resetAfter = 2000,
  label,
}: ButtonCopyProps) {
  const [state, setState] = useState<State>("idle");
  const shouldReduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleClick = useCallback(async () => {
    if (state !== "idle") return;
    setState("loading");
    try {
      await onCopy();
      setState("success");
    } catch {
      setState("error");
    }
    timer.current = setTimeout(() => setState("idle"), resetAfter);
  }, [onCopy, resetAfter, state]);

  return (
    <button
      type="button"
      aria-label={LABELS[state]}
      aria-live="polite"
      disabled={state !== "idle"}
      onClick={handleClick}
      className={cn(
        "flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5",
        "font-mono text-xs text-muted transition-colors hover:text-ink disabled:cursor-default",
        state === "error" && "border-danger/30",
        className
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={state}
          className="flex items-center gap-1.5"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(4px)" }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", duration: 0.25, bounce: 0 }}
        >
          {ICONS[state]}
          {label ?? LABELS[state]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
