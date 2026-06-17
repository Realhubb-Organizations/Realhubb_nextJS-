import { useEffect, useState } from 'react';
import { getBlogPosts } from '@/lib/firestoreService';
import type { AdminBlogPost } from '@/admin/types/blog';

export function useBlogPosts() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { posts, loading, error };
}
