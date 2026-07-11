/** A source the agent found and tried to read. */
export interface Source {
  title: string;
  url: string;
  /** whether the page body was actually retrieved */
  ok: boolean;
  /** chars of text extracted; 0 when !ok */
  chars: number;
}

export interface Report {
  topic: string;
  summary: string;
  keyFindings: string[];
  sources: Source[];
  /** ISO-8601, server clock */
  generatedAt: string;
  /** model that produced the synthesis */
  model: string;
}

/** SSE events from POST /api/research, in emit order. */
export type StreamEvent =
  | { stage: "searching" }
  | { stage: "found"; sources: Pick<Source, "title" | "url">[] }
  | { stage: "fetching" }
  | { stage: "source"; url: string; ok: boolean; chars: number }
  | { stage: "synthesizing" }
  | { stage: "done"; report: Report }
  | { stage: "error"; message: string };

/** stages the progress trace renders */
export const PIPELINE_STAGES = [
  { key: "searching", label: "search" },
  { key: "fetching", label: "fetch pages" },
  { key: "synthesizing", label: "synthesize" },
  { key: "done", label: "report ready" },
] as const;

export type StageKey = (typeof PIPELINE_STAGES)[number]["key"];
