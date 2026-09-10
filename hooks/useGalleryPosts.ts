"use client";

import { useState, useEffect } from "react";
import { getGalleryPosts, AdminGalleryPost } from "@/lib/firestoreService";

const CACHE_KEY = "realhubb_gallery_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CachedPayload {
  posts: AdminGalleryPost[];
  cachedAt: number;
}

function readCache(): AdminGalleryPost[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null;
    return parsed.posts;
  } catch {
    // sessionStorage can throw in private-browsing/blocked-storage contexts —
    // just treat it as a cache miss, never let this break the page.
    return null;
  }
}

function writeCache(posts: AdminGalleryPost[]): void {
  try {
    const payload: CachedPayload = { posts, cachedAt: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or blocked — fine, just means no caching this session.
  }
}

export function useGalleryPosts() {
  const [posts, setPosts] = useState<AdminGalleryPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Every visitor to /gallery was hitting Firestore directly from the
    // browser, uncached, on every load/refresh — this reads from
    // sessionStorage first so repeat visits within the same tab/session
    // don't cost a Firestore read at all.
    const cachedPosts = readCache();
    if (cachedPosts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only reachable client-side, this can't run during SSR/initial render
      setPosts(cachedPosts);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const all = await getGalleryPosts();
        const published = all.filter((p) => p.published);
        setPosts(published);
        writeCache(published);
      } catch (e) {
        console.error("[useGalleryPosts]", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { posts, loading };
}
