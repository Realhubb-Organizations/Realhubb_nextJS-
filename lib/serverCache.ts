interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

/**
 * Shared in-memory server cache for Firestore reads.
 *
 * This app runs as a persistent Node process (not serverless), so this
 * cache lives for the process lifetime and is shared across every request
 * and every page — the whole point is that two different pages asking for
 * the same data within the TTL window share one Firestore read, not two.
 *
 * Two things this specifically guards against:
 * - Thundering herd: if the cache is cold and 5 requests arrive in the same
 *   second (e.g. the chatbot right after its cache expires), only the first
 *   one actually calls Firestore — the rest await the same in-flight promise
 *   instead of each starting their own redundant fetch.
 * - Stale-while-error: if a fetch fails (transient Firestore error, network
 *   blip) but we have a previous value — even expired — serve that instead
 *   of propagating the failure. Without this, a single bad read gets
 *   converted to an empty array by the caller's try/catch, and with
 *   revalidate=3600 on the ISR pages that empty result then gets cached and
 *   served to every visitor for up to an hour.
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number
): Promise<T> {
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && entry.expiresAt > now) {
    return entry.value;
  }

  const existingFetch = inflight.get(key) as Promise<T> | undefined;
  if (existingFetch) {
    return existingFetch;
  }

  const fetchPromise = (async () => {
    try {
      const value = await fetcher();
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    } catch (err) {
      if (entry) {
        console.warn(`[serverCache] fetch failed for "${key}", serving stale cached value:`, err);
        return entry.value;
      }
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, fetchPromise);
  return fetchPromise;
}

/** Clears one cached key, or the whole cache when called with no argument. */
export function invalidateCache(key?: string): void {
  if (key) {
    store.delete(key);
    inflight.delete(key);
  } else {
    store.clear();
    inflight.clear();
  }
}
