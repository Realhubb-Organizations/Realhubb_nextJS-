"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { clean } from "@/lib/utils";

const EMPTY: Omit<BlogPost, "id"> = { slug: "", title: "", excerpt: "", content: "", coverImage: "", category: "Buying Guide", author: "RealHubb Team", readTime: "5 min read", publishedAt: new Date().toISOString().split("T")[0], published: false, tags: [] };

export default function BlogManager() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "blogPosts"), orderBy("publishedAt", "desc")));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost));
    } catch { setItems([]); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        const { id, ...rest } = editing as BlogPost;
        await updateDoc(doc(db, "blogPosts", id), clean({ ...rest, updatedAt: serverTimestamp() }));
      } else {
        await addDoc(collection(db, "blogPosts"), clean({ ...editing, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
      }
      setEditing(null); await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete post?")) return;
    await deleteDoc(doc(db, "blogPosts", id)); await load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{items.length} posts</p>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-sm hover:bg-navy/90 transition-colors">
          <Plus className="w-4 h-4" />New Post
        </button>
      </div>
      {loading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />)}</div> : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-navy text-sm font-normal truncate">{p.title}</p>
                <p className="text-gray-400 text-xs">{p.category} · {p.publishedAt} · {p.published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center hover:bg-navy/10 transition-colors"><Pencil className="w-3.5 h-3.5 text-navy" /></button>
                <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg text-navy font-normal">{editing.id ? "Edit" : "New"} Post</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {(["title", "slug", "excerpt", "publishedAt", "author", "readTime"] as const).map((f) => (
                <div key={f}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">{f}</label>
                  <input type={f === "publishedAt" ? "date" : "text"} value={(editing as Record<string, unknown>)[f] as string ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Content (Markdown)</label>
                <textarea rows={8} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold resize-none font-mono text-xs" />
              </div>
              <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                <input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-navy text-white py-3 rounded-xl text-sm disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
