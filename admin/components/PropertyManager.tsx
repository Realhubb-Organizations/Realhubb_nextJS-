'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Building2, Eye, ShieldAlert, Award, FileText } from 'lucide-react';
import MultiImageUpload from './MultiImageUpload';
import InlineFaqManager from './InlineFaqManager';
import { AdminProperty, EMPTY_PROPERTY } from '@/admin/types/property';
import {
  getProperties,
  saveProperty,
  deleteProperty,
  updateProperty,
} from '@/lib/firestoreService';
import { triggerRevalidate, scorePropertySEO } from '@/admin/utils';

// Helper to revalidate all property-related pages
const revalidatePropertyPages = async (slug: string, city: string) => {
  const paths = [
    '/',
    `/property/${slug}`,
    `/projects/ongoing/${city}`,
    `/projects/upcoming/${city}`,
    `/buy/2bhk-flats-${city}`,
    `/buy/3bhk-flats-${city}`,
    `/buy/luxury-apartments-${city}`,
    `/buy/villas-${city}`,
    `/buy/plots-${city}`,
    `/real-estate/${city}`,
    '/sitemap.xml',
  ];
  await triggerRevalidate(paths);
};

export default function PropertyManager() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [editing, setEditing] = useState<AdminProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

      // Trigger background revalidation instantly
      await revalidatePropertyPages(editing.slug, editing.city);

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

    const propertyToDelete = properties.find((p) => p.id === id);

    try {
      setError('');
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));

      if (propertyToDelete) {
        await revalidatePropertyPages(propertyToDelete.slug, propertyToDelete.city);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete property');
    }
  };

  // Filter properties dynamically
  const filtered = properties.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (p.name || '').toLowerCase().includes(term) ||
      (p.developer || '').toLowerCase().includes(term) ||
      (p.location || '').toLowerCase().includes(term);

    const matchesCity = cityFilter === 'all' || (p.city || '').toLowerCase() === cityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || (p.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Calculate statistics
  const totalCount = properties.length;
  const ongoingCount = properties.filter((p) => (p.status || '') === 'ongoing').length;
  const upcomingCount = properties.filter((p) => (p.status || '') === 'upcoming').length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const highSeoCount = properties.filter((p) => scorePropertySEO(p).score >= 75).length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading properties…
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
        /* ── Edit/Add Property Form ── */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-800 text-lg">
              {editing.id ? 'Edit Property details' : 'Add New Property listing'}
            </h3>
            <button
              onClick={() => setEditing(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Property Name *</label>
              <input
                type="text"
                placeholder="e.g. Prestige Jindal City"
                value={editing.name}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Slug (URL)*</label>
              <input
                type="text"
                placeholder="e.g. prestige-jindal-city"
                value={editing.slug}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, slug: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Developer *</label>
              <input
                type="text"
                placeholder="e.g. Prestige Group"
                value={editing.developer}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, developer: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Location *</label>
              <input
                type="text"
                placeholder="e.g. Tumkur Road, Bangalore"
                value={editing.location}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, location: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">City *</label>
              <select
                value={editing.city}
                onChange={(e) =>
                  setEditing((p) =>
                    p && { ...p, city: e.target.value as AdminProperty['city'] }
                  )
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              >
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Project Status *</label>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing((p) =>
                    p && { ...p, status: e.target.value as AdminProperty['status'] }
                  )
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              >
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Property Type *</label>
              <select
                value={editing.type}
                onChange={(e) =>
                  setEditing((p) =>
                    p && { ...p, type: e.target.value as AdminProperty['type'] }
                  )
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Price Display *</label>
              <input
                type="text"
                placeholder="e.g. ₹79 Lakhs - ₹1.2 Cr"
                value={editing.price || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, price: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Price Value (for sorting) *</label>
              <input
                type="number"
                placeholder="e.g. 7900000"
                value={editing.priceValue ?? 0}
                onChange={(e) =>
                  setEditing((p) =>
                    p && { ...p, priceValue: parseInt(e.target.value) || 0 }
                  )
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Area size</label>
              <input
                type="text"
                placeholder="e.g. 1200 - 2400 Sq.Ft"
                value={editing.area || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, area: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Bedrooms / BHK</label>
              <input
                type="text"
                placeholder="e.g. 2, 3 BHK"
                value={editing.bedrooms || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, bedrooms: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">RERA Registration</label>
              <input
                type="text"
                placeholder="e.g. PRM/KA/RERA/..."
                value={editing.rera || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, rera: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Possession Date</label>
              <input
                type="text"
                placeholder="e.g. Dec 2026"
                value={editing.possession || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, possession: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Google Maps Embed URL</label>
              <input
                type="url"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={editing.mapEmbedUrl || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, mapEmbedUrl: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Property Description</label>
              <textarea
                placeholder="Detailed description of the property, highlights, and amenities."
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, description: e.target.value })
                }
                rows={3}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition text-slate-800 resize-none"
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing((p) =>
                      p && { ...p, featured: e.target.checked }
                    )
                  }
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 h-4.5 w-4.5"
                />
                <span className="text-sm font-medium text-slate-700">Feature this Property</span>
              </label>
            </div>
          </div>

          {/* Cloudinary MultiImageUpload */}
          <div className="border-t border-slate-100 pt-6">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Upload Images *</p>
            {editing && (
              <MultiImageUpload
                folder="properties"
                images={editing.images}
                onImagesChange={(images) =>
                  setEditing((p) => p && { ...p, images })
                }
              />
            )}
          </div>

          {/* Inline FAQ manager */}
          <div className="border-t border-slate-100 pt-6">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Property FAQs</p>
            {editing && editing.id ? (
              <InlineFaqManager page="property" referenceId={editing.id} />
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                Please save this property first before adding property-specific FAQs.
              </div>
            )}
          </div>

          {/* Save / Cancel buttons */}
          <div className="flex gap-3 border-t border-slate-100 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Saving changes…' : 'Save Property Listing'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── Properties List View ── */
        <div className="space-y-6">
          {/* Summary counters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total", value: totalCount, bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
              { label: "Ongoing", value: ongoingCount, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
              { label: "Upcoming", value: upcomingCount, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
              { label: "Featured", value: featuredCount, bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
              { label: "SEO ≥ 75%", value: highSeoCount, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" }
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
                  placeholder="Search name, developer, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                />
              </div>

              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
              >
                <option value="all">All Cities</option>
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live - Firestore
              </span>
              <button
                onClick={() => setEditing({ ...EMPTY_PROPERTY, id: '' } as AdminProperty)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow transition shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Property
              </button>
            </div>
          </div>

          {/* Properties list cards */}
          {filtered.length > 0 ? (
            <div className="space-y-3.5">
              {filtered.map((property) => {
                const seo = scorePropertySEO(property);
                const hasImages = property.images && property.images.length > 0;
                
                // Colors based on SEO
                const seoColor =
                  seo.score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                  seo.score >= 50 ? "text-amber-600 bg-amber-50 border-amber-100" :
                  "text-rose-600 bg-rose-50 border-rose-100";

                // City badge color maps
                const cityColors: Record<string, string> = {
                  bangalore: "bg-sky-50 text-sky-600 border border-sky-100",
                  hyderabad: "bg-indigo-50 text-indigo-600 border border-indigo-100",
                  chennai: "bg-violet-50 text-violet-600 border border-violet-100",
                };

                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 shadow-inner flex items-center justify-center border border-slate-100">
                      {hasImages ? (
                        <>
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                          {property.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                              +{property.images.length - 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <Building2 className="h-6 w-6 text-slate-300" />
                      )}
                    </div>

                    {/* Middle Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm leading-snug">{property.name}</h4>
                        
                        {/* City Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          cityColors[(property.city || '').toLowerCase()] || "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}>
                          {property.city}
                        </span>

                        {/* Status Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          (property.status || '') === 'ongoing' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {property.status}
                        </span>

                        {/* Featured Badge */}
                        {property.featured && (
                          <span className="text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                            <Award className="h-3 w-3" /> Featured
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-1 leading-none">
                        <span className="font-medium text-slate-500">{property.developer}</span>
                        <span>·</span>
                        <span>{property.location}</span>
                      </p>

                      {/* Specifications row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        {property.price && (
                          <span className="font-semibold text-sky-600">{property.price}</span>
                        )}
                        {property.bedrooms && (
                          <span className="text-slate-400">{property.bedrooms} BHK</span>
                        )}
                        {property.area && (
                          <span className="text-slate-400">{property.area}</span>
                        )}
                      </div>
                    </div>

                    {/* SEO rating indicator & action buttons */}
                    <div className="flex items-center gap-4.5 justify-between w-full md:w-auto shrink-0 border-t border-slate-100 md:border-t-0 pt-3 md:pt-0">
                      {/* SEO score pill */}
                      <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${seoColor}`}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full" />
                        SEO Score: {seo.score}%
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditing(property)}
                          className="p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition"
                          title="Edit Listing"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 hover:bg-red-50 border border-slate-200 hover:border-red-100 text-slate-400 hover:text-red-600 rounded-xl transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
              No properties found matching filters or search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
