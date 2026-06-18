'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { AdminTeamMember, EMPTY_TEAM_MEMBER } from '@/admin/types/team';
import {
  getTeamMembers,
  saveTeamMember,
  deleteTeamMember,
} from '@/lib/firestoreService';
import { triggerRevalidate } from '@/admin/utils';

export default function TeamManager() {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [editing, setEditing] = useState<AdminTeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setMembers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.name || !editing.role || !editing.image) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const id = await saveTeamMember(editing);
      
      // Trigger background revalidation instantly
      await triggerRevalidate(['/about', '/team']);
      
      if ('id' in editing && editing.id) {
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? editing : m))
        );
      } else {
        setMembers((prev) => [...prev, { ...editing, id }]);
      }

      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;

    try {
      setError('');
      await deleteTeamMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      
      // Trigger background revalidation instantly
      await triggerRevalidate(['/about', '/team']);
    } catch (err: any) {
      setError(err.message || 'Failed to delete team member');
    }
  };


  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading team members…</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {editing ? (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-semibold">
            {editing.id ? 'Edit Team Member' : 'New Team Member'}
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name*"
              value={editing.name}
              onChange={(e) =>
                setEditing((m) => m && { ...m, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Role/Position*"
              value={editing.role}
              onChange={(e) =>
                setEditing((m) => m && { ...m, role: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <textarea
              placeholder="Bio"
              value={editing.bio}
              onChange={(e) =>
                setEditing((m) => m && { ...m, bio: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="email"
              placeholder="Email"
              value={editing.email}
              onChange={(e) =>
                setEditing((m) => m && { ...m, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="tel"
              placeholder="Phone"
              value={editing.phone}
              onChange={(e) =>
                setEditing((m) => m && { ...m, phone: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="url"
              placeholder="LinkedIn URL"
              value={editing.linkedin}
              onChange={(e) =>
                setEditing((m) => m && { ...m, linkedin: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <div>
              <label className="text-xs font-normal text-muted-foreground uppercase tracking-wide mb-2 block">
                Photo*
              </label>
              <ImageUpload
                folder="team"
                currentUrl={editing.image}
                onUploadComplete={(result) =>
                  setEditing((m) => m && { ...m, image: result.url })
                }
                onRemove={() =>
                  setEditing((m) => m && { ...m, image: '' })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing({ ...EMPTY_TEAM_MEMBER, id: '' } as AdminTeamMember)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Team Member
        </button>
      )}

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-3 border border-border rounded-lg hover:bg-muted/30 transition flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="font-medium text-sm">{member.name}</h4>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(member)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
