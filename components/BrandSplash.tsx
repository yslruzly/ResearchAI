import SiriOrb from "@/components/ui/siri-orb";
import { TextShimmer } from "@/components/ui/text-shimmer";

// The orb + wordmark loader, shared by loading.tsx and the splash overlay.
export default function BrandSplash() {
  return (
    <div className="flex flex-col items-center gap-6">
      <SiriOrb size="72px" animationDuration={6} />
      <div className="flex flex-col items-center gap-2">
        <span className="font-display text-lg text-ink">ResearchAI</span>
        <TextShimmer className="font-mono text-xs">loading…</TextShimmer>
      </div>
    </div>
  );
}
