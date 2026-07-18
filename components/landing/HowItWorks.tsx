import { HoverFeatureCards } from "@/components/ui/hover-feature-cards";
import Particles from "@/components/ui/particles";
import RevealText from "@/components/ui/reveal-text";
import { MODEL_LABEL } from "@/lib/model";

const STEPS = [
  {
    name: "Search",
    badge: "01",
    description:
      "Your topic goes through Jina's search API, which returns the most relevant pages on the live web right now.",
    body: "Top 5 results, 10s timeout.",
  },
  {
    name: "Fetch",
    badge: "02",
    description:
      "Each result is fetched and parsed into clean text by Jina's reader — no nav bars, no ads, no boilerplate.",
    body: "Run in parallel, 8s each. Failures are reported, not hidden.",
  },
  {
    name: "Synthesize",
    badge: "03",
    description: `${MODEL_LABEL} reads every page that loaded and drafts a summary plus the findings worth keeping.`,
    body: "Page text is fenced as untrusted data.",
  },
  {
    name: "Report",
    badge: "04",
    description:
      "You get a structured report: summary, key findings, and the exact sources it read — one click to copy.",
    body: "Markdown on the clipboard.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative isolate overflow-hidden flex min-h-[calc(100dvh-60px)] flex-col justify-center py-12 md:py-16">
      <Particles className="-z-10" />
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-7">
        <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="inline-block h-px w-4 bg-border2" />
          How it works
        </p>

        <RevealText className="mb-12 max-w-[480px] font-display text-2xl leading-tight tracking-tight text-ink md:text-[28px]">
          Four steps, same order every time.
        </RevealText>

        <HoverFeatureCards
          items={STEPS.map((s) => ({
            name: s.name,
            badge: s.badge,
            description: s.description,
            body: <p className="text-[13px] leading-relaxed text-ink/65">{s.body}</p>,
          }))}
        />

        <p className="mt-6 font-mono text-[11px] text-muted">
          hover a card to read what each stage actually does
        </p>
      </div>
    </section>
  );
}
