"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Search, Eye, EyeOff,
  Loader2, Image as ImageIcon, CheckCircle, AlertCircle,
} from "lucide-react";
import ImageUpload from "./ImageUpload";
import {
  getGalleryPosts, addGalleryPost, updateGalleryPost, deleteGalleryPost,
  AdminGalleryPost,
} from "@/lib/firestoreService";

const CATEGORIES = ["Events", "Award & Recognition"];

const EMPTY: Omit<AdminGalleryPost, "id"> = {
  title: "", description: "", image: "", category: "Events",
  published: false, publishedAt: new Date().toISOString().split("T")[0],
};

export default function GalleryManager() {
  const [posts,   setPosts]   = useState<AdminGalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [editing,   setEditing]   = useState<AdminGalleryPost | null>(null);
  const [form,      setForm]      = useState<Omit<AdminGalleryPost, "id">>(EMPTY);
  const [showForm,  setShowForm]  = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);
  const [delId,   setDelId]   = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try { setPosts(await getGalleryPosts()); }
    catch { showToast("Failed to load gallery", false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: AdminGalleryPost) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, image: p.image,
              category: p.category, published: p.published, publishedAt: p.publishedAt });
    setShowForm(true);
  };
  const closeForm = () => { setEditing(null); setForm(EMPTY); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title.trim()) return showToast("Title is required", false);
    if (!form.image)        return showToast("Please upload an image", false);
    setSaving(true);
    try {
      if (editing) {
        await updateGalleryPost(editing.id, form);
        showToast("Post updated");
      } else {
        await addGalleryPost(form);
        showToast("Post added");
      }
      await load();
      closeForm();
    } catch (err: any) {
      console.error("[GalleryManager] save error:", err);
      const msg = err?.code === "permission-denied"
        ? "Permission denied — check Firestore rules for 'gallery' collection"
        : err?.message
          ? `Save failed: ${err.message}`
          : "Save failed — check console for details";
      showToast(msg, false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryPost(id);
      showToast("Post deleted");
      await load();
    } catch { showToast("Delete failed", false); }
    finally { setDelId(null); }
  };

  const togglePublish = async (p: AdminGalleryPost) => {
    try {
      await updateGalleryPost(p.id, { ...p, published: !p.published });
      await load();
    } catch { showToast("Update failed", false); }
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const published = posts.filter(p => p.published).length;
  const drafts    = posts.length - published;

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
          ${toast.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {toast.ok ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Posts", value: posts.length,  color: "text-slate-700" },
          { label: "Published",   value: published,     color: "text-emerald-600" },
          { label: "Drafts",      value: drafts,        color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Post
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              {editing ? "Edit Post" : "New Gallery Post"}
            </h3>
            <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Title *</label>
                <input
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. RealHubb Annual Meet 2025"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="A short description shown under the image…"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
                  <select
                    value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Date</label>
                  <input
                    type="date" value={form.publishedAt}
                    onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                  className={`w-10 h-5 rounded-full transition-colors ${form.published ? "bg-emerald-500" : "bg-slate-200"} relative`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-slate-600">
                  {form.published ? "Published (visible on site)" : "Draft (hidden)"}
                </span>
              </div>
            </div>

            {/* Right — image upload */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Image *</label>
              <ImageUpload
                folder="gallery"
                label="Gallery Image"
                hint="Recommended: 1200×800px or wider"
                currentUrl={form.image}
                onUploadComplete={r => setForm(f => ({ ...f, image: r.url }))}
                onRemove={() => setForm(f => ({ ...f, image: "" }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={closeForm} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg transition-colors"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editing ? "Save Changes" : "Add Post"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-slate-800">Delete this post?</h3>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDelId(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(delId)} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? "No posts match your search" : "No gallery posts yet — add the first one!"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-44 bg-slate-100">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full
                  ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
                <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white">
                  {p.category}
                </span>
              </div>
              <div className="p-4">
                <p className="font-medium text-slate-800 text-sm line-clamp-1">{p.title}</p>
                {p.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                )}
                <p className="text-[10px] text-slate-300 mt-2">{p.publishedAt}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => togglePublish(p)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    {p.published ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => setDelId(p.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-red-100 hover:bg-red-50 transition-colors text-red-400 ml-auto"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
