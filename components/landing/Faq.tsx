import { FaqAccordion } from "@/components/ui/faq-accordion";
import Particles from "@/components/ui/particles";
import RevealText from "@/components/ui/reveal-text";
import { MODEL_LABEL } from "@/lib/model";

const ITEMS = [
  {
    question: "Is this actually an agent?",
    answer:
      "No, and it doesn't claim to be. It's a fixed three-stage pipeline: search, read the results, synthesize once. There's no planning loop and no tool selection. It's called an agent in a lot of marketing; here it's a script that runs the same way every time — which is the reason it's predictable.",
  },
  {
    question: "Are the progress steps real?",
    answer:
      "Yes. The route streams each stage over Server-Sent Events as it happens, including whether each individual page loaded. Nothing in the progress trace is on a timer — if a stage is slow, you watch it be slow.",
  },
  {
    question: "What if a source fails to load?",
    answer:
      "It's listed in the report and marked unreachable, and its content is excluded from synthesis. If every source fails, you get an error rather than a report written from nothing.",
  },
  {
    question: "Which model writes the report?",
    answer: `${MODEL_LABEL}, running on Groq's inference API. Page text is fenced inside untrusted-data tags before it reaches the model, which blunts the obvious prompt-injection path but doesn't eliminate it — treat findings from an unfamiliar source with the same suspicion you'd give the source itself.`,
  },
  {
    question: "Can I trust the summary?",
    answer:
      "Trust it about as far as you trust the five pages it read, which are all listed with links. It's a reading shortcut, not a fact-checker. Click through before you cite anything.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="relative isolate overflow-hidden flex min-h-[calc(100dvh-60px)] flex-col justify-center py-12 md:py-16">
      <Particles className="-z-10" />
      <div className="mx-auto w-full max-w-[760px] px-5 sm:px-7">
        <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="inline-block h-px w-4 bg-border2" />
          FAQ
        </p>

        <RevealText className="mb-10 max-w-[480px] font-display text-2xl leading-tight tracking-tight text-ink md:text-[28px]">
          What it does, and what it doesn&apos;t.
        </RevealText>

        <FaqAccordion items={ITEMS} />
      </div>
    </section>
  );
}
