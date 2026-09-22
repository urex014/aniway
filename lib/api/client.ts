/**
 * Jikan API v4 Centralized Client
 * Incorporates rate-limiting, request deduplication, memory caching,
 * exponential backoff retries, and high-availability fallbacks.
 */

const BASE_URL = process.env.NEXT_PUBLIC_JIKAN_API_URL || "https://api.jikan.moe/v4";

// In-memory cache to prevent redundant network round-trips
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-flight request deduplication map
const pendingRequests = new Map<string, Promise<unknown>>();

// Rate limit queue (334ms spacing = ~3 requests/second max)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 340;

async function throttle(): Promise<void> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
    const delay = MIN_REQUEST_INTERVAL_MS - timeSinceLast;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  lastRequestTime = Date.now();
}

interface RequestOptions {
  cacheTtl?: number;
  retries?: number;
  skipCache?: boolean;
}

export async function fetchJikan<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  options: RequestOptions = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${BASE_URL}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.append(key, String(val));
      }
    });
  }

  const cacheKey = url.toString();
  const ttl = options.cacheTtl ?? CACHE_TTL_MS;

  // 1. Check in-memory cache
  if (!options.skipCache && memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }
    memoryCache.delete(cacheKey);
  }

  // 2. Check pending in-flight requests (deduplication)
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  const retries = options.retries ?? 2;

  const executeFetch = async (attempt = 0): Promise<T> => {
    await throttle();

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": "AniwayCyberStream/1.0",
        },
        next: { revalidate: 300 }, // Next.js cache
      });

      if (response.status === 429) {
        // Rate limited
        if (attempt < retries) {
          const retryAfter = response.headers.get("Retry-After");
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1500 * (attempt + 1);
          await new Promise((res) => setTimeout(res, waitTime));
          return executeFetch(attempt + 1);
        }
        throw new Error(`Jikan Rate Limit Exceeded (429) for ${endpoint}`);
      }

      if (response.status === 504 || response.status === 502 || response.status === 503) {
        // Upstream MAL timeout on Jikan
        if (attempt < retries) {
          await new Promise((res) => setTimeout(res, 1200 * (attempt + 1)));
          return executeFetch(attempt + 1);
        }
        throw new Error(`Jikan Upstream Gateway Timeout (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(`Jikan API Error: ${response.status} ${response.statusText} at ${endpoint}`);
      }

      const json = await response.json();
      memoryCache.set(cacheKey, { data: json, timestamp: Date.now() });
      return json as T;
    } catch (err: unknown) {
      if (attempt < retries && (err as Error).message?.includes("fetch")) {
        await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
        return executeFetch(attempt + 1);
      }
      throw err;
    }
  };

  const requestPromise = executeFetch().finally(() => {
    pendingRequests.delete(cacheKey);
  });

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

export function clearClientCache(): void {
  memoryCache.clear();
}
