'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Globe, RefreshCw, AlertTriangle, ShieldCheck, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { AdminDeveloper, EMPTY_DEVELOPER } from '@/admin/types/developer';
import {
  getDevelopers,
  saveDeveloper,
  deleteDeveloper,
} from '@/lib/firestoreService';
import { triggerRevalidate } from '@/admin/utils';

// Helper to revalidate developer-related pages
const revalidateDeveloperPages = async (slug: string) => {
  const paths = [
    '/developers',
    `/developers/${slug}`,
    '/sitemap.xml',
  ];
  await triggerRevalidate(paths);
};

interface EditingDeveloper extends AdminDeveloper {
  citiesString?: string;
}

export default function DeveloperManager() {
  const [developers, setDevelopers] = useState<AdminDeveloper[]>([]);
  const [editing, setEditing] = useState<EditingDeveloper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');

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
      setError('Please fill in all required fields (Name, Slug, Logo)');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Database-friendly format: parse cities string to array of strings
      const citiesArray = editing.citiesString
        ? editing.citiesString.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const { citiesString, ...developerToSave } = editing;
      const finalDeveloper = {
        ...developerToSave,
        cities: citiesArray,
      } as AdminDeveloper;

      const id = await saveDeveloper(finalDeveloper);

      // Trigger background revalidation instantly
      await revalidateDeveloperPages(finalDeveloper.slug);

      if ('id' in finalDeveloper && finalDeveloper.id) {
        setDevelopers((prev) =>
          prev.map((d) => (d.id === id ? finalDeveloper : d))
        );
      } else {
        setDevelopers((prev) => [...prev, { ...finalDeveloper, id }]);
      }

      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save developer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this developer profile?')) return;

    const devToDelete = developers.find((d) => d.id === id);

    try {
      setError('');
      await deleteDeveloper(id);
      setDevelopers((prev) => prev.filter((d) => d.id !== id));

      if (devToDelete) {
        await revalidateDeveloperPages(devToDelete.slug);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete developer');
    }
  };

  // Filter developers
  const filtered = developers.filter(d => {
    const term = search.toLowerCase();
    const matchesSearch =
      (d.name || '').toLowerCase().includes(term) ||
      (d.description || '').toLowerCase().includes(term);

    const matchesFeatured = featuredFilter === 'all' ||
      (featuredFilter === 'featured' && d.featured) ||
      (featuredFilter === 'regular' && !d.featured);

    return matchesSearch && matchesFeatured;
  });

  const totalCount = developers.length;
  const featuredCount = developers.filter(d => d.featured).length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading developers…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {editing ? (
        /* ── Edit/Add Developer Form ── */
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-1">
            <button
              onClick={() => setEditing(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition"
            >
              &lt; Back
            </button>
            <h3 className="font-semibold text-slate-800 text-lg leading-tight mt-1">
              Edit Developer
            </h3>
            <p className="text-slate-400 text-xs truncate">
              {editing.name ? `Editing: ${editing.name}` : 'Adding new developer profile'}
            </p>
          </div>

          {/* Logo Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Developer Logo</p>
            
            <div className="relative w-40 h-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
              {editing.logoUrl ? (
                <img src={editing.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
              ) : (
                <span className="text-xs text-slate-400">No logo uploaded</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">OR PASTE LOGO URL</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={editing.logoUrl}
                  onChange={(e) => setEditing({ ...editing, logoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
                />
              </div>
              <div>
                <ImageUpload
                  folder="developers"
                  currentUrl={editing.logoUrl}
                  onUploadComplete={(result) => setEditing({ ...editing, logoUrl: result.url })}
                  onRemove={() => setEditing({ ...editing, logoUrl: '' })}
                />
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Details</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Developer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Abhee Group"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">URL Slug *</label>
                <input
                  type="text"
                  placeholder="e.g. abhee-group"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Description</label>
                <textarea
                  placeholder="Short summary description of the developer."
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">About (Detailed profile)</label>
                <textarea
                  placeholder="Detailed information, history, and achievements."
                  value={editing.about}
                  onChange={(e) => setEditing({ ...editing, about: e.target.value })}
                  rows={4}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800 resize-none font-light"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://www.abheegroup.com"
                  value={editing.websiteUrl}
                  onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Experience</label>
                <input
                  type="text"
                  placeholder="e.g. 15+ years"
                  value={editing.experience}
                  onChange={(e) => setEditing({ ...editing, experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Cities (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Bangalore, Hyderabad, Chennai"
                  value={editing.citiesString || ''}
                  onChange={(e) => setEditing({ ...editing, citiesString: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Separate with commas. These are converted to a database-friendly array.</span>
              </div>

              <div className="flex items-center gap-2 pt-2 select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 h-4.5 w-4.5"
                  />
                  <span className="text-sm font-semibold text-slate-700">Featured on homepage marquee</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Saving changes…' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-sm font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── Developers List View ── */
        <div className="space-y-6">
          {/* Counters panels */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl">
            {[
              { label: "Total Developers", value: totalCount, bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
              { label: "Featured marquee", value: featuredCount, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
            ].map(card => (
              <div key={card.label} className={`p-4 rounded-xl border ${card.border} ${card.bg} flex flex-col justify-center`}>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">{card.label}</span>
                <span className={`text-2xl font-black ${card.text}`}>{card.value}</span>
              </div>
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search builder name, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                />
              </div>

              {/* Status Filter */}
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
              >
                <option value="all">All Builders</option>
                <option value="featured">Featured Marquee Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live - Firestore
              </span>
              <button
                onClick={() => setEditing({ ...EMPTY_DEVELOPER, id: '' } as AdminDeveloper)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow transition shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Developer
              </button>
            </div>
          </div>

          {/* Developers cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(dev => (
                <div
                  key={dev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4"
                >
                  {/* Logo */}
                  <div className="w-24 h-14 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center p-1.5 shadow-inner">
                    {dev.logoUrl ? (
                      <img src={dev.logoUrl} alt={dev.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold">{dev.name.substring(0, 3).toUpperCase()}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug truncate">{dev.name}</h4>
                      {dev.featured && (
                        <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wider shrink-0">
                          <Star className="h-2.5 w-2.5 fill-current" /> Marquee
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 line-clamp-1 font-light leading-none">
                      {dev.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-light">
                      {dev.experience && (
                        <span>Exp: <span className="font-medium">{dev.experience}</span></span>
                      )}
                      {dev.cities && dev.cities.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="truncate" title={dev.cities.join(', ')}>Cities: {dev.cities.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <button
                      onClick={() => setEditing({
                        ...dev,
                        citiesString: dev.cities ? dev.cities.join(', ') : ''
                      })}
                      className="p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition"
                      title="Edit Developer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dev.id)}
                      className="p-2 hover:bg-red-50 border border-slate-200 hover:border-red-100 text-slate-400 hover:text-red-600 rounded-xl transition"
                      title="Delete Developer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
              No developers found matching query.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
