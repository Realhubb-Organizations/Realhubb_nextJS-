'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { AdminDeveloper, EMPTY_DEVELOPER } from '@/admin/types/developer';
import {
  getDevelopers,
  saveDeveloper,
  deleteDeveloper,
} from '@/lib/firestoreService';

export default function DeveloperManager() {
  const [developers, setDevelopers] = useState<AdminDeveloper[]>([]);
  const [editing, setEditing] = useState<AdminDeveloper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      const data = await getDevelopers();
      setDevelopers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.name || !editing.slug || !editing.logoUrl) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const id = await saveDeveloper(editing);
      
      if ('id' in editing && editing.id) {
        setDevelopers((prev) =>
          prev.map((d) => (d.id === id ? editing : d))
        );
      } else {
        setDevelopers((prev) => [...prev, { ...editing, id }]);
      }

      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save developer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this developer?')) return;

    try {
      setError('');
      await deleteDeveloper(id);
      setDevelopers((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete developer');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading developers…</div>
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
            {editing.id ? 'Edit Developer' : 'New Developer'}
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Developer Name*"
              value={editing.name}
              onChange={(e) =>
                setEditing((d) => d && { ...d, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Slug (URL-friendly)*"
              value={editing.slug}
              onChange={(e) =>
                setEditing((d) => d && { ...d, slug: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <textarea
              placeholder="Short Description"
              value={editing.description}
              onChange={(e) =>
                setEditing((d) => d && { ...d, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <textarea
              placeholder="About (Detailed)"
              value={editing.about}
              onChange={(e) =>
                setEditing((d) => d && { ...d, about: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="url"
              placeholder="Website URL"
              value={editing.websiteUrl}
              onChange={(e) =>
                setEditing((d) => d && { ...d, websiteUrl: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Experience (e.g., '20+ years')"
              value={editing.experience}
              onChange={(e) =>
                setEditing((d) => d && { ...d, experience: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <div>
              <label className="text-xs font-normal text-muted-foreground uppercase tracking-wide mb-2 block">
                Logo*
              </label>
              <ImageUpload
                folder="developers"
                currentUrl={editing.logoUrl}
                onUploadComplete={(result) =>
                  setEditing((d) => d && { ...d, logoUrl: result.url })
                }
                onRemove={() =>
                  setEditing((d) => d && { ...d, logoUrl: '' })
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing((d) =>
                      d && { ...d, featured: e.target.checked }
                    )
                  }
                  className="rounded border-input"
                />
                <span className="text-sm">Featured Developer</span>
              </label>
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
          onClick={() => setEditing({ ...EMPTY_DEVELOPER, id: '' } as AdminDeveloper)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Developer
        </button>
      )}

      <div className="space-y-2">
        {developers.map((developer) => (
          <div
            key={developer.id}
            className="p-3 border border-border rounded-lg hover:bg-muted/30 transition flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="font-medium text-sm">{developer.name}</h4>
              <p className="text-xs text-muted-foreground">
                {developer.experience} • {developer.featured ? '⭐ Featured' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(developer)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(developer.id)}
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
