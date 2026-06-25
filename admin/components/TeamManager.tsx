'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, RefreshCw, Award, ArrowUpRight, User } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { AdminTeamMember, EMPTY_TEAM_MEMBER } from '@/admin/types/team';
import {
  getTeamMembers,
  saveTeamMember,
  deleteTeamMember,
} from '@/lib/firestoreService';
import { triggerRevalidate } from '@/admin/utils';

const LinkedInIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11.334 20h-3v-10h3v10zm-1.5-11.269c-.966 0-1.75-.792-1.75-1.77s.784-1.77 1.75-1.77 1.75.792 1.75 1.77-.784 1.77-1.75 1.77zm13.834 11.269h-3v-5.604c0-1.337-.027-3.06-1.865-3.06-1.866 0-2.153 1.46-2.153 2.967v5.697h-3v-10h2.879v1.367h.041c.401-.758 1.381-1.558 2.844-1.558 3.04 0 3.604 2.004 3.604 4.61v5.581z" />
  </svg>
);

export default function TeamManager() {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [editing, setEditing] = useState<AdminTeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Search filter state
  const [search, setSearch] = useState('');

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
      setError('Please fill in all required fields (Name, Role, Photo)');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Database-friendly format: ensure order is saved as a number
      const finalMember = {
        ...editing,
        order: typeof editing.order === 'string' ? parseInt(editing.order) || 0 : editing.order ?? 0
      };

      const id = await saveTeamMember(finalMember);

      // Trigger background revalidation instantly
      await triggerRevalidate(['/about', '/team']);

      if ('id' in finalMember && finalMember.id) {
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? finalMember : m))
        );
      } else {
        setMembers((prev) => [...prev, { ...finalMember, id }]);
      }

      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member profile?')) return;

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

  // Filter members
  const filtered = members.filter(m => {
    const term = search.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(term) ||
      (m.role || '').toLowerCase().includes(term) ||
      (m.bio || '').toLowerCase().includes(term)
    );
  });

  const totalCount = members.length;
  // Get max display order in database
  const maxOrder = members.reduce((max, m) => Math.max(max, m.order ?? 0), 0);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading team members…
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
        /* ── Edit/Add Team Member Form ── */
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-1">
            <button
              onClick={() => setEditing(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition"
            >
              &lt; Back
            </button>
            <h3 className="font-semibold text-slate-800 text-lg leading-tight mt-1">
              Edit Team Member
            </h3>
            <p className="text-slate-400 text-xs truncate">
              {editing.name ? `Editing: ${editing.name}` : 'Adding new team member profile'}
            </p>
          </div>

          {/* Profile Photo Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Profile Photo</p>
            
            <div className="relative w-36 h-36 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
              {editing.image ? (
                <img src={editing.image} alt="Photo Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-slate-350" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">OR PASTE PHOTO URL</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                />
              </div>
              <div>
                <ImageUpload
                  folder="team"
                  currentUrl={editing.image}
                  onUploadComplete={(result) => setEditing({ ...editing, image: result.url })}
                  onRemove={() => setEditing({ ...editing, image: '' })}
                />
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Details</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Santosh Ray"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Role / Designation *</label>
                <input
                  type="text"
                  placeholder="e.g. Sr. Sales Manager"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://linkedin.com/in/username"
                  value={editing.linkedin || ''}
                  onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Short Bio</label>
                <textarea
                  placeholder="Tell clients about their achievements, expertise, and focus."
                  value={editing.bio || ''}
                  onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800 resize-none font-light"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Display Order</label>
                <input
                  type="number"
                  placeholder="e.g. 0"
                  value={editing.order ?? 0}
                  onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Lower = shown first. Current range: 0 to {Math.max(15, maxOrder)}.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Email address</label>
                  <input
                    type="email"
                    placeholder="e.g. member@realhubb.in"
                    value={editing.email || ''}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Phone number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow"
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
        /* ── Team Members List View ── */
        <div className="space-y-6">
          {/* Counters panels */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl">
            {[
              { label: "Total Members", value: totalCount, bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
              { label: "Max Order Priority", value: maxOrder, bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
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
                  placeholder="Search member name, role, bio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live - Firestore
              </span>
              <button
                onClick={() => setEditing({ ...EMPTY_TEAM_MEMBER, id: '' } as AdminTeamMember)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow transition shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Member
              </button>
            </div>
          </div>

          {/* Team Members cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm hover:shadow-md transition flex flex-col justify-between h-full gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Photo */}
                    <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center shadow-inner">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-slate-350" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug truncate">{member.name}</h4>
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider leading-none">
                        {member.role}
                      </p>
                      <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed pt-0.5">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Footer metadata & actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                    {/* LinkedIn & Order */}
                    <div className="flex items-center gap-2">
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-indigo-600 transition"
                          title="LinkedIn Profile"
                        >
                          <LinkedInIcon className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-350 italic">No LinkedIn</span>
                      )}
                      <span className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                        Order: {member.order ?? 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditing(member)}
                        className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition"
                        title="Edit Member"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 hover:bg-red-50 border border-slate-200 hover:border-red-100 text-slate-450 hover:text-red-600 rounded-lg transition"
                        title="Delete Member"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
              No team members found matching query.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
