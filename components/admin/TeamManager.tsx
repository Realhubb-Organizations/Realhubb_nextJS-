"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { clean } from "@/lib/utils";

const EMPTY: Omit<TeamMember, "id"> = { name: "", nameSlug: "", role: "", specialisation: "", city: "Bangalore", experience: "", languages: [], achievements: [], photo: "", bio: "", email: "", phone: "", linkedin: "", order: 99 };

export default function TeamManager() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "team"), orderBy("order", "asc")));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamMember));
    } catch { setItems([]); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        const { id, ...rest } = editing as TeamMember;
        await updateDoc(doc(db, "team", id), clean({ ...rest, updatedAt: serverTimestamp() }));
      } else {
        await addDoc(collection(db, "team"), clean({ ...editing, createdAt: serverTimestamp() }));
      }
      setEditing(null); await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete team member?")) return;
    await deleteDoc(doc(db, "team", id)); await load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{items.length} members</p>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-sm hover:bg-navy/90 transition-colors">
          <Plus className="w-4 h-4" />Add Member
        </button>
      </div>
      {loading ? <div className="animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-white rounded-xl" />)}</div> : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-navy text-sm font-normal">{m.name}</p>
                <p className="text-gray-400 text-xs">{m.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(m)} className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center"><Pencil className="w-3.5 h-3.5 text-navy" /></button>
                <button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg text-navy font-normal">{editing.id ? "Edit" : "Add"} Member</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {(["name", "role", "specialisation", "experience", "bio", "email", "phone", "linkedin"] as const).map((f) => (
                <div key={f}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">{f}</label>
                  {f === "bio" ? (
                    <textarea rows={4} value={editing[f] ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold resize-none" />
                  ) : (
                    <input type="text" value={editing[f] ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold" />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Order (sort)</label>
                <input type="number" value={editing.order ?? 99} onChange={(e) => setEditing({ ...editing, order: +e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-gold" />
              </div>
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
