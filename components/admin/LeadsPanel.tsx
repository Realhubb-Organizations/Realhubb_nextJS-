"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface Lead { id: string; name: string; phone: string; email?: string; city?: string; projectName?: string; source?: string; createdAt?: { seconds: number }; }

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc")));
        setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead));
      } catch { setLeads([]); } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-white rounded-xl" />)}</div>;

  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">{leads.length} leads captured</p>
      {leads.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl"><p>No leads yet. Leads from all forms appear here.</p></div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-cream">
              <tr>{["Name", "Phone", "City", "Source", "Date"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-normal">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3 text-navy">{l.name}</td>
                  <td className="px-4 py-3"><a href={`tel:${l.phone}`} className="text-gold hover:underline">{l.phone}</a></td>
                  <td className="px-4 py-3 text-gray-500">{l.city ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.source ?? l.projectName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{l.createdAt ? new Date(l.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
