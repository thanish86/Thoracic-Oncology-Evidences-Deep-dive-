/**
 * Polite HTTP for public scholarly APIs: per-host rate limiting, retries with
 * exponential backoff on 429/5xx, timeouts and an identifying User-Agent.
 * `fetchImpl` is injectable so tests run without network access.
 */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const lastCall = new Map<string, number>();

export class HttpError extends Error {
  constructor(public status: number, url: string) {
    super(`HTTP ${status} for ${url}`);
  }
}

export interface PoliteOptions {
  minIntervalMs: number;
  retries?: number;
  timeoutMs?: number;
  fetchImpl?: FetchLike;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const USER_AGENT = `ONCOATLAS/0.1 (educational evidence platform; mailto:${process.env.CONTACT_EMAIL ?? "unset@example.org"})`;

export async function politeFetch(url: string, opts: PoliteOptions): Promise<Response> {
  const { minIntervalMs, retries = 3, timeoutMs = 20_000, fetchImpl = fetch, sleep = defaultSleep } = opts;
  const host = new URL(url).host;
  for (let attempt = 0; ; attempt++) {
    const wait = (lastCall.get(host) ?? 0) + minIntervalMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall.set(host, Date.now());
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json, text/xml" }, signal: ctrl.signal });
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        await sleep(2 ** attempt * 1000);
        continue;
      }
      if (!res.ok) throw new HttpError(res.status, url);
      return res;
    } catch (e) {
      // 4xx (other than 429) are permanent: fail fast without retrying.
      if (e instanceof HttpError || attempt >= retries) throw e;
      await sleep(2 ** attempt * 1000);
    } finally {
      clearTimeout(timer);
    }
  }
}

export function resetRateLimiter() {
  lastCall.clear();
}
