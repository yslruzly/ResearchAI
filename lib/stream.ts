import type { StreamEvent } from "@/lib/types";

// Parses an SSE body into events. Buffers partial frames across chunk
// boundaries; skips frames that don't parse.
export async function* readEventStream(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal
): AsyncGenerator<StreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) return;

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf("\n\n");

        const line = frame.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;

        try {
          yield JSON.parse(line.slice(5).trim()) as StreamEvent;
        } catch {
        }
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}
