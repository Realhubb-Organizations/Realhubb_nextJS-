import { useEffect, useState } from 'react';
import { getDevelopers } from '@/lib/firestoreService';
import type { AdminDeveloper } from '@/admin/types/developer';

export function useDevelopers() {
  const [developers, setDevelopers] = useState<AdminDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDevelopers();
        setDevelopers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load developers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { developers, loading, error };
}
