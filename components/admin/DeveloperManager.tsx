"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Developer } from "@/types/developer";
import { clean } from "@/lib/utils";

const EMPTY: Omit<Developer, "id"> = { name: "", slug: "", logo: "", description: "", established: "", headquarters: "", totalProjects: "", website: "" };

export default function DeveloperManager() {
  const [items, setItems] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Developer> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "developers"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Developer));
    } catch { setItems([]); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        const { id, ...rest } = editing as Developer;
        await updateDoc(doc(db, "developers", id), clean({ ...rest, updatedAt: serverTimestamp() }));
      } else {
        await addDoc(collection(db, "developers"), clean({ ...editing, createdAt: serverTimestamp() }));
      }
      setEditing(null); await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete developer?")) return;
    await deleteDoc(doc(db, "developers", id)); await load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{items.length} developers</p>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-sm hover:bg-navy/90 transition-colors">
          <Plus className="w-4 h-4" />Add Developer
        </button>
      </div>
      {loading ? <div className="animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-white rounded-xl" />)}</div> : (
        <div className="space-y-3">
          {items.map((d) => (
            <div key={d.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-navy text-sm font-normal">{d.name}</p>
                <p className="text-gray-400 text-xs">{d.headquarters} · {d.totalProjects} projects</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(d)} className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center"><Pencil className="w-3.5 h-3.5 text-navy" /></button>
                <button onClick={() => handleDelete(d.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg text-navy font-normal">{editing.id ? "Edit" : "Add"} Developer</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {(["name", "slug", "description", "established", "headquarters", "totalProjects", "website"] as const).map((f) => (
                <div key={f}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">{f}</label>
                  {f === "description" ? (
                    <textarea rows={3} value={editing[f] ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold resize-none" />
                  ) : (
                    <input type="text" value={editing[f] ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold" />
                  )}
                </div>
              ))}
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
