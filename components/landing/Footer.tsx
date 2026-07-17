import SiriOrb from "@/components/ui/siri-orb";
import { MODEL_LABEL } from "@/lib/model";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-7">
        <span className="flex items-center gap-2">
          <SiriOrb size="22px" animationDuration={20} dots={false} />
          <span className="font-display text-base text-ink">ResearchAI</span>
        </span>
        <span className="font-mono text-xs text-muted">
          search by Jina · synthesis by {MODEL_LABEL}
        </span>
      </div>
    </footer>
  );
}
