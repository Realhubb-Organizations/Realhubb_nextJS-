"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Eye, EyeOff, Loader2, HelpCircle, Check, ChevronDown, ChevronUp
} from "lucide-react";
import {
  getFaqs, addFaq, updateFaq, deleteFaq,
  AdminFaq,
} from "@/lib/firestoreService";

interface InlineFaqManagerProps {
  page: "property" | "blog";
  referenceId: string;
}

const EMPTY_FORM = {
  question: "",
  answer: "",
  order: 0,
  published: true,
};

export default function InlineFaqManager({ page, referenceId }: InlineFaqManagerProps) {
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const loadFaqs = async () => {
    try {
      setLoading(true);
      setError("");
      const allFaqs = await getFaqs();
      // Filter FAQs matching this reference ID and page type, sorted by order
      const filtered = allFaqs
        .filter((f) => f.page === page && f.referenceId === referenceId)
        .sort((a, b) => a.order - b.order);
      setFaqs(filtered);
    } catch (err: any) {
      console.error("Failed to load inline FAQs:", err);
      if (err.code === "permission-denied" || err.message?.includes("permission")) {
        setError("permission-denied");
      } else {
        setError("Failed to load FAQs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (referenceId) {
      loadFaqs();
    }
  }, [page, referenceId]);

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      question: "",
      answer: "",
      order: faqs.length > 0 ? Math.max(...faqs.map((f) => f.order)) + 1 : 1,
      published: true,
    });
    setShowForm(true);
    setError("");
  };

  const handleOpenEdit = (faq: AdminFaq) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      published: faq.published,
    });
    setShowForm(true);
    setError("");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSave = async () => {
    if (!form.question.trim()) {
      setError("Question is required");
      return;
    }
    if (!form.answer.trim()) {
      setError("Answer is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const faqData: Omit<AdminFaq, "id"> = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        page,
        referenceId,
        order: form.order,
        published: form.published,
      };

      if (editing) {
        await updateFaq(editing.id, faqData);
      } else {
        await addFaq(faqData);
      }

      await loadFaqs();
      handleCloseForm();
    } catch (err: any) {
      console.error("Failed to save inline FAQ:", err);
      if (err.code === "permission-denied" || err.message?.includes("permission")) {
        setError("permission-denied");
      } else {
        setError("Failed to save FAQ");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      setError("");
      await deleteFaq(id);
      await loadFaqs();
    } catch (err: any) {
      console.error("Failed to delete FAQ:", err);
      if (err.code === "permission-denied" || err.message?.includes("permission")) {
        setError("permission-denied");
      } else {
        setError("Failed to delete FAQ");
      }
    }
  };

  const handleTogglePublish = async (faq: AdminFaq) => {
    try {
      setError("");
      await updateFaq(faq.id, { ...faq, published: !faq.published });
      await loadFaqs();
    } catch (err: any) {
      console.error("Failed to toggle publish status:", err);
      if (err.code === "permission-denied" || err.message?.includes("permission")) {
        setError("permission-denied");
      } else {
        setError("Failed to update status");
      }
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        Loading FAQs...
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-border pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            FAQ Section ({faqs.length})
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage custom questions and answers for this {page}.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition"
          >
            <Plus className="h-3 w-3" /> Add FAQ
          </button>
        )}
      </div>

      {error === "permission-denied" ? (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-2 text-xs">
          <p className="font-semibold text-amber-800 flex items-center gap-1.5">
            ⚠️ Firebase Permission Error
          </p>
          <p>
            The <code>faqs</code> collection is missing or restricted in your Firestore Security Rules.
          </p>
          <p>
            Please go to the <strong>Firebase Console</strong> → <strong>Firestore Database</strong> → <strong>Rules</strong> tab, and add the following match block:
          </p>
          <pre className="bg-white/80 p-2 rounded border border-amber-200/50 font-mono text-[10px] select-all overflow-x-auto">
{`match /faqs/{document} {
  allow read, write: if request.auth != null;
}`}
          </pre>
          <p className="text-[10px] text-amber-700">
            Once added, click <strong>Publish</strong> in the Firebase Console and refresh this page.
          </p>
        </div>
      ) : error ? (
        <div className="p-2.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs">
          {error}
        </div>
      ) : null}

      {showForm && (
        <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              {editing ? "Edit FAQ" : "New FAQ"}
            </span>
            <button
              type="button"
              onClick={handleCloseForm}
              className="p-1 text-muted-foreground hover:bg-muted rounded transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Question *
              </label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="e.g. Is there parking available?"
                className="w-full px-3 py-2 text-xs border border-input rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Answer *
              </label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="Write the FAQ answer..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-input rounded-lg bg-background resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-32 px-3 py-1.5 text-xs border border-input rounded-lg bg-background"
                />
              </div>

              <div className="flex items-center gap-2 mt-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="inline-faq-published"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <label htmlFor="inline-faq-published" className="text-xs text-muted-foreground">
                  Published (visible on website)
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-3 py-1.5 border border-input rounded-lg hover:bg-muted text-xs transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 disabled:opacity-50 text-xs font-medium transition"
            >
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              {editing ? "Save" : "Add"}
            </button>
          </div>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
          No FAQs created for this {page} yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {faqs.map((faq) => {
            const isExpanded = !!expandedIds[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-muted/20 border border-border rounded-lg overflow-hidden text-xs"
              >
                <div className="p-3 flex items-center justify-between gap-3">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedIds((prev) => ({ ...prev, [faq.id]: !isExpanded }))}
                  >
                    <p className="font-medium text-foreground line-clamp-1">{faq.question}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span>Order: {faq.order}</span>
                      <span>•</span>
                      <span className={faq.published ? "text-emerald-600 font-medium" : "text-amber-600"}>
                        {faq.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedIds((prev) => ({ ...prev, [faq.id]: !isExpanded }))}
                      className="p-1 hover:bg-muted rounded text-muted-foreground"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(faq)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground"
                      title={faq.published ? "Set Draft" : "Publish"}
                    >
                      {faq.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(faq)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id)}
                      className="p-1 hover:bg-destructive/10 hover:text-destructive rounded text-muted-foreground"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-border/60 bg-muted/10 text-muted-foreground whitespace-pre-line leading-relaxed">
                    {faq.answer}
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
