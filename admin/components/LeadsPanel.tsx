'use client';

import { useState, useEffect } from 'react';
import { FileText, Mail, Phone, Briefcase, Calendar, Download, RefreshCw } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  type: string;
  position?: string;
  experience?: string;
  resumeUrl?: string;
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(false);
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/leads', { headers });
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      if (data.success && data.leads) {
        const resumesOnly = data.leads.filter((lead: Lead) => lead.type === 'career');
        setLeads(resumesOnly);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error loading resumes from API:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading resumes…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
          Failed to load resumes from the server. Please try again.
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-normal">Resumes ({leads.length})</h2>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition shrink-0"
          title="Refresh Resumes List"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {leads.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No resumes uploaded yet</p>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-3 border border-border rounded-lg hover:bg-muted/30 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm">{lead.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lead.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {lead.type}
                </span>
              </div>

              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <a href={`mailto:${lead.email}`} className="hover:text-primary">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <a href={`tel:${lead.phone}`} className="hover:text-primary">
                    {lead.phone}
                  </a>
                </div>
              </div>

              {lead.message && (
                <p className="text-sm text-foreground bg-muted/30 p-2 rounded max-h-20 overflow-y-auto">
                  <strong>Message / Cover Letter:</strong><br />
                  {lead.message}
                </p>
              )}

              {lead.type === 'career' && (
                <div className="mt-3 p-3 bg-gold/5 rounded-xl border border-gold/10 space-y-2 text-sm text-foreground/85">
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
                    <p className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gold shrink-0" />
                      <strong>Position:</strong> {lead.position || 'N/A'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
                      <strong>Experience:</strong> {lead.experience || 'N/A'}
                    </p>
                  </div>
                  {lead.resumeUrl && lead.resumeUrl !== 'No file uploaded' && (
                    <div className="pt-2 border-t border-gold/10 flex items-center justify-between gap-4">
                      <span className="text-xs text-muted-foreground truncate">
                        Resume: {lead.resumeUrl.split('/').pop() || 'file'}
                      </span>
                      <a
                        href={lead.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-navy text-white hover:bg-navy/90 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
