import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FloatingLines from "@/components/ui/floating-lines";
import TypewriterText from "@/components/ui/typewriter-text";
import PipelineDemo from "@/components/landing/PipelineDemo";
import { MODEL_LABEL } from "@/lib/model";

export default function Hero() {
  // isolate: without it the -z-10 background paints behind bg-paper
  return (
    <section id="top" className="relative isolate flex min-h-[calc(100dvh-60px)] flex-col overflow-hidden">
      {/* the lines listen on window, so pointer-events-none is fine here */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <FloatingLines
          linesGradient={["#3B82F6", "#34D399", "#8B5CF6"]}
          lineCount={[7, 7, 6]}
          lineDistance={[6, 5, 6]}
          animationSpeed={0.8}
        />
      </div>

      <div className="flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-[1100px] items-center gap-12 px-5 py-14 sm:px-7 md:grid-cols-2 md:gap-8">
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
              <span className="inline-block h-px w-4 bg-border2" />
              Search, read, synthesize — in one pass
            </p>

            <h1 className="mb-5 font-display text-4xl leading-[1.1] tracking-tight text-ink md:text-[44px]">
              <TypewriterText
                segments={[
                  { text: "Type a topic." },
                  { text: "Walk away with a ", breakBefore: true },
                  { text: "report", em: true },
                  { text: "." },
                ]}
              />
            </h1>

            <p className="mb-8 max-w-[420px] text-sm leading-relaxed text-muted md:text-[15px]">
              ResearchAI searches the live web, reads what it finds, and writes up a structured report
              with sources attached. No tabs, no skimming.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/research"
                className="flex items-center gap-2 rounded-full bg-ink py-3 pl-5 pr-4 text-sm font-medium text-paper transition-opacity hover:opacity-90"
              >
                Open the agent
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#how-it-works"
                className="px-2 py-3 font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                see how it works
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <PipelineDemo />
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-paper/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-4 font-mono text-[11px] uppercase tracking-wider text-muted sm:px-7">
          <span>web search by jina</span>
          <span className="text-border2">·</span>
          <span>reading by jina reader</span>
          <span className="text-border2">·</span>
          <span>synthesis by {MODEL_LABEL}</span>
        </div>
      </div>
    </section>
  );
}
