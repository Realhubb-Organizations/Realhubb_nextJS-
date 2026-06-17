"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Search, Eye, EyeOff,
  Loader2, HelpCircle, CheckCircle, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import {
  getFaqs, addFaq, updateFaq, deleteFaq,
  AdminFaq,
} from "@/lib/firestoreService";

const PAGES = [
  { value: "home", label: "Home Page" },
  { value: "about", label: "About Page" },
  { value: "services", label: "Our Services (FAQ Page)" },
  { value: "buying", label: "Property Buying (FAQ Page)" },
  { value: "career", label: "Careers Page" },
];

const EMPTY: Omit<AdminFaq, "id"> = {
  question: "",
  answer: "",
  page: "home",
  referenceId: "",
  order: 0,
  published: false,
};

export default function FaqManager() {
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [form, setForm] = useState<Omit<AdminFaq, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const faqsData = await getFaqs();
      // Filter out property/blog FAQs in global manager so they are managed in their own sections
      setFaqs(faqsData.filter(f => f.page !== "property" && f.page !== "blog"));
    } catch {
      showToast("Failed to load FAQs", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (f: AdminFaq) => {
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer,
      page: f.page,
      referenceId: f.referenceId || "",
      order: f.order,
      published: f.published,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.question.trim()) return showToast("Question is required", false);
    if (!form.answer.trim()) return showToast("Answer is required", false);

    setSaving(true);
    try {
      if (editing) {
        await updateFaq(editing.id, form);
        showToast("FAQ updated");
      } else {
        await addFaq(form);
        showToast("FAQ added");
      }
      await load();
      closeForm();
    } catch (err: any) {
      console.error("[FaqManager] save error:", err);
      showToast("Save failed — check console for details", false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq(id);
      showToast("FAQ deleted");
      await load();
    } catch {
      showToast("Delete failed", false);
    } finally {
      setDelId(null);
    }
  };

  const togglePublish = async (f: AdminFaq) => {
    try {
      await updateFaq(f.id, { ...f, published: !f.published });
      await load();
    } catch {
      showToast("Update failed", false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = faqs.filter(f => {
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchPage = pageFilter === "all" || f.page === pageFilter;
    return matchSearch && matchPage;
  });

  const published = faqs.filter(f => f.published).length;
  const drafts = faqs.length - published;

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
          { label: "Total FAQs", value: faqs.length, color: "text-slate-700" },
          { label: "Published", value: published, color: "text-emerald-600" },
          { label: "Drafts", value: drafts, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search FAQs…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <select
            value={pageFilter}
            onChange={e => setPageFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="all">All Locations</option>
            {PAGES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        </div>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              {editing ? "Edit FAQ" : "New FAQ"}
            </h3>
            <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Question *</label>
              <input
                value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                placeholder="e.g. What are the charges for RealHubb's services?"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Answer *</label>
              <textarea
                value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                rows={5}
                placeholder="Write the FAQ answer here…"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Page Location</label>
                <select
                  value={form.page}
                  onChange={e => {
                    const newPage = e.target.value as AdminFaq["page"];
                    setForm(f => ({ ...f, page: newPage, referenceId: "" }));
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  {PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Sort Order</label>
                <input
                  type="number" value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 cursor-pointer select-none pt-2">
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

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={closeForm} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg transition-colors"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editing ? "Save Changes" : "Add FAQ"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-slate-800">Delete this FAQ?</h3>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDelId(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(delId)} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Listing */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-xl">
          <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search || pageFilter !== "all" ? "No FAQs match your search/filters" : "No FAQs yet — add the first one!"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(f => {
            const isExpanded = !!expandedIds[f.id];
            const pageLabel = PAGES.find(p => p.value === f.page)?.label || f.page;

            return (
              <div key={f.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{f.question}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {pageLabel}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Order: {f.order}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                        ${f.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {f.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(f.id)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
                      title={isExpanded ? "Collapse" : "Expand Answer"}
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => togglePublish(f)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
                      title={f.published ? "Unpublish" : "Publish"}
                    >
                      {f.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => openEdit(f)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDelId(f.id)}
                      className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

