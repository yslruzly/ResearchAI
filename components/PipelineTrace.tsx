"use client";

import { Loader2, Check } from "lucide-react";
import { motion } from "motion/react";
import { PIPELINE_STAGES } from "@/lib/types";
import ProgressBar from "@/components/ui/progress-bar";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";

// activeIndex = the stage currently running; pass PIPELINE_STAGES.length once
// everything is finished.
export default function PipelineTrace({
  activeIndex,
  size = "md",
  className,
}: {
  activeIndex: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const total = PIPELINE_STAGES.length;
  const progress = Math.max(0, Math.min(1, activeIndex / total)) * 100;
  const isSmall = size === "sm";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ProgressBar value={progress} />

      <div className={cn("flex flex-col", isSmall ? "gap-1.5" : "gap-2")}>
        {PIPELINE_STAGES.map((stage, i) => {
          const done = activeIndex > i;
          const active = activeIndex === i;

          return (
            <div
              key={stage.key}
              className={cn(
                "flex items-center gap-2 font-mono transition-colors",
                isSmall ? "text-[11px]" : "text-xs",
                done ? "text-good" : active ? "text-accent" : "text-muted"
              )}
            >
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                className={cn(
                  "flex flex-shrink-0 items-center justify-center rounded-full border",
                  isSmall ? "h-3.5 w-3.5" : "h-5 w-5 text-[10px]",
                  done
                    ? "border-good/20 bg-good/10"
                    : active
                      ? "border-accent/25 bg-accent/10"
                      : "border-border"
                )}
              >
                {done ? (
                  <Check className={isSmall ? "h-2 w-2" : "h-3 w-3"} />
                ) : active ? (
                  <Loader2 className={cn("animate-spin", isSmall ? "h-2 w-2" : "h-3 w-3")} />
                ) : (
                  !isSmall && i + 1
                )}
              </motion.span>

              {active ? <TextShimmer>{stage.label}</TextShimmer> : stage.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
