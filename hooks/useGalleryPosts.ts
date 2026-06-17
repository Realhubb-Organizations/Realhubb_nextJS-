"use client";

import { useState, useEffect } from "react";
import { getGalleryPosts, AdminGalleryPost } from "@/lib/firestoreService";

export function useGalleryPosts() {
  const [posts,   setPosts]   = useState<AdminGalleryPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await getGalleryPosts();
        setPosts(all.filter(p => p.published));
      } catch (e) {
        console.error("[useGalleryPosts]", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { posts, loading };
}
