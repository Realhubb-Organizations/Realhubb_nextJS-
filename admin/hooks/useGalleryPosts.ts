import { useEffect, useState } from 'react';
import { getGalleryPosts } from '@/lib/firestoreService';
import type { AdminGalleryPost } from '@/admin/types/gallery';

export function useGalleryPosts() {
  const [posts, setPosts] = useState<AdminGalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getGalleryPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { posts, loading, error };
}
