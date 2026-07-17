import { Link2, Zap, ClipboardCheck } from "lucide-react";
import { Tilt } from "@/components/ui/tilt";
import { ClippedCircle } from "@/components/ui/clipped-circle";
import Particles from "@/components/ui/particles";
import RevealText from "@/components/ui/reveal-text";

const FEATURES = [
  {
    icon: Link2,
    title: "Shows its work",
    body: "Every source is listed with whether it actually loaded. Pages that failed are shown as unreachable, not quietly counted.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    body: "Groq's inference means the whole pipeline, search through synthesis, usually finishes in well under a minute.",
  },
  {
    icon: ClipboardCheck,
    title: "Copy-paste ready",
    body: "One click turns the report into clean Markdown, ready to drop straight into your notes.",
  },
];

export default function Why() {
  return (
    <section id="why" className="relative isolate overflow-hidden flex min-h-[calc(100dvh-60px)] snap-start flex-col justify-center py-12 md:py-16">
      <Particles className="-z-10" />
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-7">
        <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="inline-block h-px w-4 bg-border2" />
          Why
        </p>

        <RevealText className="mb-12 max-w-[520px] font-display text-2xl leading-tight tracking-tight text-ink md:text-[28px]">
          A summarizer you can audit.
        </RevealText>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Tilt
              key={f.title}
              rotationFactor={8}
              springOptions={{ stiffness: 300, damping: 30 }}
              className="glass group relative overflow-hidden rounded-2xl border border-white/10 p-6"
            >
              <f.icon className="mb-4 h-4 w-4 text-accent" />
              <h3 className="mb-2 text-sm font-medium text-ink">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink/70">{f.body}</p>
              <ClippedCircle circleClassName="bg-accent/10" circleSize={420} />
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
