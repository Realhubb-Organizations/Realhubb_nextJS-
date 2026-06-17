'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import MultiImageUpload from './MultiImageUpload';
import InlineFaqManager from './InlineFaqManager';
import { AdminProperty, EMPTY_PROPERTY } from '@/admin/types/property';
import {
  getProperties,
  saveProperty,
  deleteProperty,
  updateProperty,
} from '@/lib/firestoreService';

export default function PropertyManager() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [editing, setEditing] = useState<AdminProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    if (
      !editing.name ||
      !editing.developer ||
      !editing.location ||
      !editing.slug ||
      editing.images.length === 0
    ) {
      setError('Please fill in all required fields and upload at least one image');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const id = await saveProperty(editing);
      
      if ('id' in editing && editing.id) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? editing : p))
        );
      } else {
        setProperties((prev) => [...prev, { ...editing, id }]);
      }

      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return;

    try {
      setError('');
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading properties…</div>
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
            {editing.id ? 'Edit Property' : 'New Property'}
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Property Name*"
              value={editing.name}
              onChange={(e) =>
                setEditing((p) => p && { ...p, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Slug (URL-friendly name)*"
              value={editing.slug}
              onChange={(e) =>
                setEditing((p) => p && { ...p, slug: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Developer*"
              value={editing.developer}
              onChange={(e) =>
                setEditing((p) => p && { ...p, developer: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <select
              value={editing.city}
              onChange={(e) =>
                setEditing((p) =>
                  p && { ...p, city: e.target.value as AdminProperty['city'] }
                )
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            >
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
            </select>

            <input
              type="text"
              placeholder="Location*"
              value={editing.location}
              onChange={(e) =>
                setEditing((p) => p && { ...p, location: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <select
              value={editing.status}
              onChange={(e) =>
                setEditing((p) =>
                  p && { ...p, status: e.target.value as AdminProperty['status'] }
                )
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            >
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
            </select>

            <select
              value={editing.type}
              onChange={(e) =>
                setEditing((p) =>
                  p && { ...p, type: e.target.value as AdminProperty['type'] }
                )
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            >
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>

            <input
              type="text"
              placeholder="Price (e.g., '₹50 Lakhs - ₹1 Cr')*"
              value={editing.price}
              onChange={(e) =>
                setEditing((p) => p && { ...p, price: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="number"
              placeholder="Price Value (for sorting)*"
              value={editing.priceValue}
              onChange={(e) =>
                setEditing((p) =>
                  p && { ...p, priceValue: parseInt(e.target.value) || 0 }
                )
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Area (e.g., '2000 Sq.Ft')"
              value={editing.area}
              onChange={(e) =>
                setEditing((p) => p && { ...p, area: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Bedrooms"
              value={editing.bedrooms}
              onChange={(e) =>
                setEditing((p) => p && { ...p, bedrooms: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="RERA Number"
              value={editing.rera}
              onChange={(e) =>
                setEditing((p) => p && { ...p, rera: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Possession (e.g., 'Q4 2024')"
              value={editing.possession}
              onChange={(e) =>
                setEditing((p) => p && { ...p, possession: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <textarea
              placeholder="Description"
              value={editing.description}
              onChange={(e) =>
                setEditing((p) => p && { ...p, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="url"
              placeholder="Map Embed URL"
              value={editing.mapEmbedUrl}
              onChange={(e) =>
                setEditing((p) => p && { ...p, mapEmbedUrl: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing((p) =>
                      p && { ...p, featured: e.target.checked }
                    )
                  }
                  className="rounded border-input"
                />
                <span className="text-sm">Featured Property</span>
              </label>
            </div>

            {editing && (
              <MultiImageUpload
                folder="properties"
                images={editing.images}
                onImagesChange={(images) =>
                  setEditing((p) => p && { ...p, images })
                }
              />
            )}

            {editing && editing.id ? (
              <InlineFaqManager page="property" referenceId={editing.id} />
            ) : editing ? (
              <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border text-center text-xs text-muted-foreground">
                Save this property first to add property-specific FAQs.
              </div>
            ) : null}
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
          onClick={() => setEditing({ ...EMPTY_PROPERTY, id: '' } as AdminProperty)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Property
        </button>
      )}

      <div className="space-y-2">
        {properties.map((property) => (
          <div
            key={property.id}
            className="p-3 border border-border rounded-lg hover:bg-muted/30 transition flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="font-medium text-sm">{property.name}</h4>
              <p className="text-xs text-muted-foreground">
                {property.location} • {property.developer}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(property)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(property.id)}
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
