import { useEffect, useState } from 'react';
import { getProperties } from '@/lib/firestoreService';
import type { AdminProperty } from '@/admin/types/property';

export function useProperties() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { properties, loading, error };
}
