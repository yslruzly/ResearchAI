"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Send, Loader2, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ReportView from "@/components/research/ReportView";
import PipelineTrace from "@/components/PipelineTrace";
import { BorderBeam } from "@/components/ui/border-beam";
import AuroraBars from "@/components/ui/aurora-bars";
import Particles from "@/components/ui/particles";
import Skeleton from "@/components/ui/skeleton";
import { AnimatedList } from "@/components/ui/animated-list";
import { EXAMPLE_TOPICS, MAX_TOPIC_LENGTH } from "@/lib/examples";
import { readEventStream } from "@/lib/stream";
import { PIPELINE_STAGES, type Report, type StageKey } from "@/lib/types";
import { hostnameOf } from "@/lib/utils";

type Phase = "idle" | StageKey | "error";

// "done" pushes the cursor past the last stage so every row renders complete
function activeIndexFor(phase: Phase): number {
  if (phase === "idle" || phase === "error") return -1;
  if (phase === "done") return PIPELINE_STAGES.length;
  return PIPELINE_STAGES.findIndex((s) => s.key === phase);
}

interface LiveSource {
  id: string;
  title: string;
  url: string;
  /** undefined while in flight */
  ok?: boolean;
}

export default function ResearchTool() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [report, setReport] = useState<Report | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [liveSources, setLiveSources] = useState<LiveSource[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const ranInitialTopic = useRef(false);

  const loading = phase !== "idle" && phase !== "error" && phase !== "done";

  // Cancel any in-flight run if the user navigates away mid-research.
  useEffect(() => () => abortRef.current?.abort(), []);

  const research = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setTopic(trimmed);
      setReport(null);
      setErrorMsg("");
      setLiveSources([]);
      setPhase("searching");

      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: trimmed }),
          signal: controller.signal,
        });

        // Rejections (400/429) come back as plain JSON, not as an event stream.
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `The agent responded with ${res.status}.`);
        }

        // all stage changes come from server events
        for await (const event of readEventStream(res.body, controller.signal)) {
          switch (event.stage) {
            case "searching":
            case "fetching":
            case "synthesizing":
              setPhase(event.stage);
              break;

            case "found":
              setLiveSources(
                event.sources.map((s) => ({ id: s.url, title: s.title, url: s.url }))
              );
              break;

            case "source":
              setLiveSources((prev) =>
                prev.map((s) => (s.url === event.url ? { ...s, ok: event.ok } : s))
              );
              break;

            case "done":
              setReport(event.report);
              setPhase("done");
              break;

            case "error":
              setErrorMsg(event.message);
              setPhase("error");
              break;
          }
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        setErrorMsg(e instanceof Error ? e.message : "Something went wrong reaching the agent.");
        setPhase("error");
      }
    },
    []
  );

  // landing example links arrive as /research?topic=...; run once
  useEffect(() => {
    if (ranInitialTopic.current) return;
    const fromQuery = searchParams.get("topic");
    if (fromQuery) {
      ranInitialTopic.current = true;
      setTopic(fromQuery);
      research(fromQuery.slice(0, MAX_TOPIC_LENGTH));
    }
  }, [searchParams, research]);

  const activeIndex = activeIndexFor(phase);
  const showTrace = phase !== "idle" && phase !== "error";

  // isolate keeps the -z-10 canvas above bg-paper. No overflow-hidden here:
  // it would break the sticky header.
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-paper">
      <Particles className="-z-10" />
      <SiteHeader variant="tool" working={loading} />

      <div className="mx-auto w-full max-w-[1000px] px-5 sm:px-7">
        <div className="relative isolate overflow-hidden py-8 sm:py-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-[0.18]">
            <AuroraBars barCount={20} blur={26} minHeightRatio={0.05} maxHeightRatio={0.5} />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted"
          >
            <span className="inline-block h-px w-4 bg-border2" />
            Research anything
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-2 font-display text-3xl leading-tight tracking-tight text-ink"
          >
            Ask a topic.
            <br />
            Get a full <em className="italic">report</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-7 max-w-[480px] text-sm leading-relaxed text-muted"
          >
            The agent searches the web, reads the sources, and synthesizes everything into a
            structured report.
          </motion.p>

          <div className="relative mb-2 flex rounded-xl">
            {loading && <BorderBeam size={120} duration={4} colorFrom="#3B82F6" colorTo="transparent" />}
            <input
              type="text"
              value={topic}
              maxLength={MAX_TOPIC_LENGTH}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && research(topic)}
              placeholder="e.g. Latest trends in AI engineering..."
              disabled={loading}
              aria-label="Research topic"
              className="glass glass-blur flex-1 rounded-l-xl border border-r-0 border-white/10 px-5 py-3.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/50 disabled:opacity-50"
            />
            <button
              onClick={() => research(topic)}
              disabled={!topic.trim() || loading}
              className="flex min-w-[112px] items-center justify-center gap-2 rounded-r-xl bg-ink px-5 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={loading ? "loading" : "idle"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Working
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Research
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <p className="mb-4 h-4 text-right font-mono text-[10px] text-muted">
            {topic.length > MAX_TOPIC_LENGTH - 30 && `${topic.length}/${MAX_TOPIC_LENGTH}`}
          </p>

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TOPICS.map((ex) => (
              <button
                key={ex}
                onClick={() => research(ex)}
                disabled={loading}
                className="group relative overflow-hidden rounded-full border border-white/10 bg-transparent px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-40"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{ex}</span>
              </button>
            ))}
          </div>
        </div>

        {showTrace && (
          <div className="border-t border-border py-5">
            <PipelineTrace activeIndex={activeIndex} />
            {/* each source flips to its real outcome as its fetch lands */}
            {liveSources.length > 0 && phase !== "done" && (
              <div className="mt-5">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                  sources
                </p>
                <AnimatedList
                  items={liveSources}
                  animation="slide"
                  gap={6}
                  renderItem={(source) => (
                    <div className="glass flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2">
                      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted">
                        {hostnameOf(source.url)}
                      </span>
                      {source.ok === undefined ? (
                        <Skeleton className="h-3 w-14 rounded-full" />
                      ) : source.ok ? (
                        <span className="flex flex-shrink-0 items-center gap-1 font-mono text-[10px] text-good">
                          <CheckCircle2 className="h-3 w-3" /> fetched
                        </span>
                      ) : (
                        <span className="flex flex-shrink-0 items-center gap-1 font-mono text-[10px] text-warn">
                          <XCircle className="h-3 w-3" /> unreachable
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {phase === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-start justify-between gap-4 rounded-2xl border border-danger/20 bg-danger/[0.04] px-6 py-5"
          >
            <div>
              <p className="mb-1 text-sm font-medium text-ink">The research didn&apos;t go through.</p>
              <p className="max-w-[480px] text-xs leading-relaxed text-muted">{errorMsg}</p>
            </div>
            <button
              onClick={() => research(topic)}
              className="glass flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-accent/40"
            >
              <RotateCcw className="h-3 w-3" />
              try again
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {report && <ReportView key={report.topic + report.generatedAt} report={report} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
