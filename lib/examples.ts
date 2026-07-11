/** Shared by the landing page's example grid and the tool's example chips. */
export const EXAMPLE_TOPICS = [
  "RAG pipeline best practices",
  "LLM fine-tuning techniques 2025",
  "Vector database comparison",
  "AI agent frameworks",
] as const;

/** Hard ceiling on a topic, enforced on both the client and the route. */
export const MAX_TOPIC_LENGTH = 200;
