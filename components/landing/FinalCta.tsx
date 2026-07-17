import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiriOrb from "@/components/ui/siri-orb";
import RevealText from "@/components/ui/reveal-text";

export default function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden flex min-h-[calc(100dvh-60px)] snap-start flex-col justify-center py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-25 blur-2xl">
        <SiriOrb size="380px" animationDuration={28} dots={false} />
      </div>

      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center px-5 text-center sm:px-7">
        <RevealText className="mb-8 max-w-[560px] font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
          <>
            Stop reading ten tabs.
            <br />
            <em className="italic">Start reading one report.</em>
          </>
        </RevealText>

        <Link
          href="/research"
          className="flex items-center gap-2 rounded-full bg-ink py-3.5 pl-6 pr-5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Open the agent
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
