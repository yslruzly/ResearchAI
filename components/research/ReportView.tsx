"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link as LinkIcon, Lightbulb, FileText, CheckCircle2, XCircle } from "lucide-react";
import type { Report, Source } from "@/lib/types";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimateDigits } from "@/components/ui/animate-digits";
import { AnimatedList } from "@/components/ui/animated-list";
import ButtonCopy from "@/components/ui/button-copy";
import { formatGeneratedAt, reportToMarkdown } from "@/lib/report";
import { hostnameOf } from "@/lib/utils";

// Local monogram instead of a favicon service, so nobody else learns what
// people research here.
function SourceMark({ url }: { url: string }) {
  const host = hostnameOf(url);
  const initial = host.charAt(0).toUpperCase() || "?";

  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[4px] border border-border bg-paper font-mono text-[9px] text-muted"
    >
      {initial}
    </span>
  );
}

function SourceRow({ source, index }: { source: Source; index: number }) {
  const body = (
    <>
      <span className="w-4 flex-shrink-0 text-center font-mono text-[10px] text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <SourceMark url={source.url} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-ink transition-colors group-hover:text-accent">
          {source.title}
        </span>
        <span className="block truncate font-mono text-[10px] text-muted">{source.url}</span>
      </span>
      {source.ok ? (
        <span className="flex flex-shrink-0 items-center gap-1 rounded-full border border-good/15 bg-good/[0.08] px-2 py-0.5 font-mono text-[9px] text-good">
          <CheckCircle2 className="h-2.5 w-2.5" />
          fetched
        </span>
      ) : (
        <span
          title="This page could not be read, so nothing from it was used in the summary."
          className="flex flex-shrink-0 items-center gap-1 rounded-full border border-warn/20 bg-warn/[0.08] px-2 py-0.5 font-mono text-[9px] text-warn"
        >
          <XCircle className="h-2.5 w-2.5" />
          unreachable
        </span>
      )}
    </>
  );

  const className =
    "group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors";

  // unreachable sources aren't rendered as links
  return source.ok ? (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:border-accent/30`}
    >
      {body}
    </a>
  ) : (
    <div className={`${className} opacity-60`}>{body}</div>
  );
}

export default function ReportView({ report }: { report: Report }) {
  const [showBeam, setShowBeam] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowBeam(false), 2600);
    return () => clearTimeout(t);
  }, []);

  // throws so ButtonCopy can show the failure
  async function copy() {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard unavailable");
    }
    await navigator.clipboard.writeText(reportToMarkdown(report));
  }

  const reachable = report.sources.filter((s) => s.ok).length;
  const total = report.sources.length;

  const findings = report.keyFindings.map((text, i) => ({ id: i, text }));
  const sources = report.sources.map((source) => ({ id: source.url, source }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4 }}
      className="glass relative mb-12 overflow-hidden rounded-2xl border border-white/10"
    >
      {showBeam && <BorderBeam size={140} duration={2.2} colorFrom="#34D399" colorTo="transparent" />}

      <div className="flex items-start justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <p className="font-display text-[17px] leading-snug text-ink">{report.topic}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-1 font-mono text-xs text-muted">
            <AnimateDigits value={String(reachable)} />
            <span>
              of <AnimateDigits value={String(total)} className="inline-flex" /> sources read ·{" "}
              {formatGeneratedAt(report.generatedAt)} · {report.model}
            </span>
          </p>
        </div>
        <ButtonCopy onCopy={copy} />
      </div>

      <section className="border-t border-white/10 px-4 py-4 sm:px-6 sm:py-5">
        <p className="mb-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted">
          <FileText className="h-3 w-3" />
          summary
        </p>
        <p className="text-sm leading-[1.8] text-ink/65">{report.summary}</p>
      </section>

      {findings.length > 0 && (
        <section className="border-t border-white/10 px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted">
            <Lightbulb className="h-3 w-3" />
            key findings
          </p>
          <AnimatedList
            items={findings}
            animation="scale"
            renderItem={(finding) => (
              <div className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3">
                <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <p className="text-sm leading-relaxed text-ink/65">{finding.text}</p>
              </div>
            )}
          />
        </section>
      )}

      <section className="border-t border-white/10 px-4 py-4 sm:px-6 sm:py-5">
        <p className="mb-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted">
          <LinkIcon className="h-3 w-3" />
          sources
        </p>
        <AnimatedList
          items={sources}
          animation="slide"
          renderItem={(item, i) => <SourceRow source={item.source} index={i} />}
        />
        {reachable < total && (
          <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted">
            {total - reachable} source{total - reachable === 1 ? "" : "s"} could not be read. Nothing
            from {total - reachable === 1 ? "it" : "them"} went into the summary above.
          </p>
        )}
      </section>
    </motion.div>
  );
}
