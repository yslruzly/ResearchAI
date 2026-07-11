import SiriOrb from "@/components/ui/siri-orb";
import { TextShimmer } from "@/components/ui/text-shimmer";

// Route-level loading UI; only shows on navigations that actually wait.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-paper">
      <SiriOrb size="72px" animationDuration={6} />
      <div className="flex flex-col items-center gap-2">
        <span className="font-display text-lg text-ink">ResearchAI</span>
        <TextShimmer className="font-mono text-xs">loading…</TextShimmer>
      </div>
    </div>
  );
}
