import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Particles from "@/components/ui/particles";
import RevealText from "@/components/ui/reveal-text";
import { EXAMPLE_TOPICS } from "@/lib/examples";

export default function TryExamples() {
  return (
    <section id="try-it" className="relative isolate overflow-hidden flex min-h-[calc(100dvh-60px)] flex-col justify-center py-12 md:py-16">
      <Particles className="-z-10" />
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-7">
        <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="inline-block h-px w-4 bg-border2" />
          Don&apos;t know where to start?
        </p>

        <RevealText className="mb-10 max-w-[480px] font-display text-2xl leading-tight tracking-tight text-ink md:text-[28px]">
          Run one of these, or type your own.
        </RevealText>

        <div className="grid gap-3 sm:grid-cols-2">
          {EXAMPLE_TOPICS.map((topic) => (
            <Link
              key={topic}
              href={`/research?topic=${encodeURIComponent(topic)}`}
              className="glass group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/10 px-5 py-4 transition-colors hover:border-accent/40"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative text-sm text-ink transition-colors group-hover:text-accent">
                {topic}
              </span>
              <ArrowUpRight className="relative h-4 w-4 flex-shrink-0 text-muted transition-colors group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
