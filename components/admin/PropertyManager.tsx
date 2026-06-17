"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query,
} from "firebase/firestore";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Property } from "@/types/property";
import { EMPTY_PROPERTY, normalizeProperty } from "@/types/property";
import { clean } from "@/lib/utils";

export default function PropertyManager() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Property> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => normalizeProperty({ id: d.id, ...d.data() })));
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        const { id, createdAt, ...rest } = editing as Property;
        await updateDoc(doc(db, "properties", id), clean({ ...rest, updatedAt: serverTimestamp() }));
      } else {
        await addDoc(collection(db, "properties"), clean({ ...editing, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
      }
      setEditing(null);
      await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this property?")) return;
    await deleteDoc(doc(db, "properties", id));
    await load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{items.length} properties</p>
        <button onClick={() => setEditing({ ...EMPTY_PROPERTY })}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-sm hover:bg-navy/90 transition-colors">
          <Plus className="w-4 h-4" />Add Property
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-navy text-sm font-normal truncate">{p.name}</p>
                <p className="text-gray-400 text-xs">{p.developer} · {p.location} · {p.projectType}</p>
              </div>
              <p className="text-gold text-sm shrink-0">{p.price}</p>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center hover:bg-navy/10 transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-navy" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg text-navy font-normal">{editing.id ? "Edit" : "Add"} Property</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {(["name", "slug", "developer", "location", "price", "area", "bedrooms", "rera", "possession"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">{field}</label>
                  <input type="text" value={(editing as Record<string, unknown>)[field] as string ?? ""} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold" />
                </div>
              ))}
              {(["city", "type", "projectType"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">{field}</label>
                  <select value={(editing as Record<string, unknown>)[field] as string ?? ""}
                    onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold">
                    {field === "city" && ["bangalore", "hyderabad", "chennai"].map((v) => <option key={v}>{v}</option>)}
                    {field === "type" && ["apartment", "villa", "plot", "commercial"].map((v) => <option key={v}>{v}</option>)}
                    {field === "projectType" && ["ongoing", "upcoming"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured property
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-navy text-white py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
