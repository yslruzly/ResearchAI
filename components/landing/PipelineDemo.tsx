"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Search, Loader2, FileText, Lightbulb } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import PipelineTrace from "@/components/PipelineTrace";
import { PIPELINE_STAGES } from "@/lib/types";
import { delay } from "@/lib/utils";

// Scripted demo data; the card is labelled as an illustration in the UI.
const DEMOS = [
  {
    topic: "RAG pipeline best practices",
    summary:
      "Most production RAG pipelines now pair hybrid retrieval with a reranking pass before generation. Chunk size tuning tends to matter more for retrieval quality than the embedding model itself.",
    findings: [
      "Hybrid search (vector + keyword) consistently beats vector-only retrieval",
      "Reranking the top results before generation noticeably reduces hallucination",
    ],
  },
  {
    topic: "Vector database comparison",
    summary:
      "Under about 10M vectors, the choice between Pinecone, Weaviate, and pgvector comes down to operational overhead more than raw query speed, which stays comparable across all three at that scale.",
    findings: [
      "pgvector is the lowest-friction option if you already run Postgres",
      "Managed tiers remove the most ops burden, at a cost premium",
    ],
  },
  {
    topic: "AI agent frameworks",
    summary:
      "Explicit state machines remain more reliable than open-ended agent loops for multi-step tasks in production, and most real deployments still cap autonomous steps with a human checkpoint.",
    findings: [
      "Explicit state machines outperform open-ended loops on reliability",
      "Most production agents cap depth and add a human-in-the-loop checkpoint",
    ],
  },
];

export default function PipelineDemo() {
  const prefersReducedMotion = useReducedMotion();
  const [demoIndex, setDemoIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "thinking" | "done">("typing");
  const [stageIndex, setStageIndex] = useState(-1);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;

    if (prefersReducedMotion) {
      setTyped(DEMOS[0].topic);
      setStageIndex(PIPELINE_STAGES.length);
      setPhase("done");
      return;
    }

    async function loop() {
      let i = 0;
      while (alive.current) {
        const demo = DEMOS[i % DEMOS.length];
        setDemoIndex(i % DEMOS.length);
        setPhase("typing");
        setStageIndex(-1);
        setTyped("");

        for (let c = 1; c <= demo.topic.length; c++) {
          if (!alive.current) return;
          setTyped(demo.topic.slice(0, c));
          await delay(36);
        }
        await delay(450);
        if (!alive.current) return;

        setPhase("thinking");
        for (let s = 0; s < PIPELINE_STAGES.length; s++) {
          if (!alive.current) return;
          setStageIndex(s);
          await delay(s === PIPELINE_STAGES.length - 1 ? 500 : 1000);
        }
        if (!alive.current) return;
        setStageIndex(PIPELINE_STAGES.length);
        await delay(450);

        if (!alive.current) return;
        setPhase("done");
        await delay(3400);
        i++;
      }
    }

    loop();
    return () => {
      alive.current = false;
    };
  }, [prefersReducedMotion]);

  const demo = DEMOS[demoIndex];
  const isWorking = phase === "thinking";
  const isDone = phase === "done";

  return (
    <div className="glass glass-blur relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">sample run</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-muted">
          illustration
        </span>
      </div>

      <div className="p-5">
        <div className="relative mb-4 flex rounded-lg">
          {isWorking && <BorderBeam size={70} duration={3} colorFrom="#3B82F6" colorTo="transparent" />}
          <div className="flex h-[34px] flex-1 items-center overflow-hidden whitespace-nowrap rounded-l-lg border border-r-0 border-white/10 bg-white/5 px-3.5 py-2.5 font-sans text-xs text-ink">
            <span>{typed}</span>
            {phase === "typing" && (
              <span className="ml-0.5 inline-block h-3.5 w-px flex-shrink-0 animate-pulse bg-accent" />
            )}
          </div>
          <div className="flex flex-shrink-0 items-center justify-center rounded-r-lg bg-ink px-3 text-paper">
            {isWorking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-[136px] overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <div className="border-b border-white/10 px-4 py-3">
                <p className="font-display text-[13px] leading-snug text-ink">{demo.topic}</p>
              </div>
              <div className="border-b border-white/10 px-4 py-3">
                <p className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted">
                  <FileText className="h-2.5 w-2.5" /> summary
                </p>
                <p className="text-[11px] leading-relaxed text-ink/65">{demo.summary}</p>
              </div>
              <div className="px-4 py-3">
                <p className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted">
                  <Lightbulb className="h-2.5 w-2.5" /> key findings
                </p>
                <div className="flex flex-col gap-1.5">
                  {demo.findings.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <div className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                      <p className="text-[11px] leading-relaxed text-ink/65">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="steps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[136px]"
            >
              <PipelineTrace activeIndex={stageIndex} size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
