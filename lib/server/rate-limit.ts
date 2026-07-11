// Fixed-window limiter in module memory. Per-instance only, so on serverless
// the real ceiling is limit x instances. Swap for Redis before a public launch.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 6;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function evictExpired(now: number) {
  // forEach: the ES5 target can't for..of a Map
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) buckets.delete(key);
  });
}

export interface RateLimitResult {
  ok: boolean;
  /** seconds until retry, when !ok */
  retryAfter: number;
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();

  if (buckets.size > 1000) evictExpired(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

// x-forwarded-for is only trustworthy behind a proxy that overwrites it
// (Vercel/Cloudflare do).
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
