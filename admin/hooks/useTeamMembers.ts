import { useEffect, useState } from 'react';
import { getTeamMembers } from '@/lib/firestoreService';
import type { AdminTeamMember } from '@/admin/types/team';

export function useTeamMembers() {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTeamMembers();
        setMembers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load team members');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { members, loading, error };
}
