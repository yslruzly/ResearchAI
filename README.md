# ResearchAI

Type a topic, get a short research report with sources. The server searches the
web (Jina), reads the top results (Jina Reader), and has an LLM on Groq write a
summary and key findings. Progress streams to the client over SSE, including
per-source success/failure, so the UI only shows what actually happened.

It's a fixed pipeline (search → fetch → synthesize), not an agent.

## Components

`components/ui/` contains components from [smoothui.dev](https://smoothui.dev),
[ui.unlumen.com](https://ui.unlumen.com), and [reactbits.dev](https://reactbits.dev)
rather than installed via their CLIs — they're written for Tailwind v4 / shadcn
tokens and this project runs Tailwind v3 with its own palette, so each needed
edits. Each file's header notes where it came from and what changed.

## Notes / limits

- The rate limiter is in-memory and per-instance. Fine for a single server,
  meaningless on autoscaled serverless. Use Redis before a real launch.
- Scraped page text is fenced as untrusted data in the prompt, which blocks
  the lazy prompt-injection path but not a determined one.
- Reports are only as good as the pages behind them. Every source is listed
  and linked; unreachable ones are marked and excluded.
- The reader treats sub-400-char responses as failures — most are bot walls
  that return HTTP 200 (Reddit's Cloudflare page, for example).
