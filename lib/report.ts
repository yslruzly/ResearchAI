import type { Report } from "@/lib/types";

export function formatGeneratedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** The exact text the copy button writes to the clipboard. */
export function reportToMarkdown(report: Report): string {
  const findings = report.keyFindings.map((f) => `- ${f}`).join("\n");

  const sources = report.sources
    .map((s) => `- [${s.title}](${s.url})${s.ok ? "" : " _(unreachable — not used)_"}`)
    .join("\n");

  return [
    `# ${report.topic}`,
    "",
    "## Summary",
    report.summary,
    "",
    "## Key Findings",
    findings || "_none returned_",
    "",
    "## Sources",
    sources || "_none_",
    "",
    "---",
    `Generated ${formatGeneratedAt(report.generatedAt)} by ${report.model}.`,
  ].join("\n");
}
