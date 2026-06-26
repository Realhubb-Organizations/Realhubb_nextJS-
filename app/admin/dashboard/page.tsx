"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, Building2, FileText, Users, UserCircle,
  LogOut, ArrowUpRight, ChevronRight, Menu, X,
  Eye, PenLine, Plus, RefreshCw, CheckCircle2,
  AlertTriangle, Zap, BarChart2, Globe, Search, Activity,
  Bell, Loader2, CheckCircle, HelpCircle, Inbox,
} from "lucide-react";
import PropertyManager from "@/admin/components/PropertyManager";
import BlogManager from "@/admin/components/BlogManager";
import DeveloperManager from "@/admin/components/DeveloperManager";
import TeamManager from "@/admin/components/TeamManager";
import GalleryManager from "@/admin/components/GalleryManager";
import FaqManager from "@/admin/components/FaqManager";
import LeadsPanel from "@/admin/components/LeadsPanel";
import AnalyticsSection from "@/admin/components/AnalyticsSection";
import {
  getProperties, getBlogPosts, getDevelopers, getTeamMembers,
} from "@/lib/firestoreService";
import { sendNotification } from "@/lib/sendNotification";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Section = "overview" | "properties" | "blogs" | "developers" | "team" | "analytics" | "gallery" | "faqs" | "leads";

const NAV: { id: Section; label: string; desc: string; icon: React.ReactNode; accent: string }[] = [
  { id: "overview",   label: "Overview",   desc: "Dashboard & SEO",     icon: <LayoutDashboard className="h-4 w-4" />, accent: "#6366f1" },
  { id: "properties", label: "Properties", desc: "Listings & projects", icon: <Building2 className="h-4 w-4" />,       accent: "#0ea5e9" },
  { id: "blogs",      label: "Blog Posts", desc: "Articles & guides",   icon: <FileText className="h-4 w-4" />,        accent: "#10b981" },
  { id: "developers", label: "Developers", desc: "Builder profiles",    icon: <Users className="h-4 w-4" />,           accent: "#f59e0b" },
  { id: "team",       label: "Team",       desc: "Staff & advisors",    icon: <UserCircle className="h-4 w-4" />,      accent: "#ec4899" },
  { id: "analytics",  label: "Analytics",  desc: "GA4 traffic data",    icon: <BarChart2 className="h-4 w-4" />,       accent: "#8b5cf6" },
  { id: "gallery",    label: "Gallery",    desc: "Photos & media",     icon: <Eye className="h-4 w-4" />,             accent: "#14b8a6" },
  { id: "faqs",       label: "FAQs",       desc: "Manage website Q&As", icon: <HelpCircle className="h-4 w-4" />,      accent: "#f97316" },
  { id: "leads",      label: "Resumes/Leads", desc: "View inquiries",  icon: <Inbox className="h-4 w-4" />,           accent: "#64748b" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [active, setActive] = useState<Section>("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      setChecking(false);
    });
    
    // Automatically close sidebar on small screens on initial load
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSideOpen(false);
    }
    
    return unsub;
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = "realhubb-admin-session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading…
        </div>
      </div>
    );
  }

  const nav = NAV.find((n) => n.id === active) || NAV[0];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Backdrop on Mobile */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden transition-opacity"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 shadow-xl lg:shadow-sm
          ${sideOpen ? "translate-x-0 w-64 lg:w-56" : "-translate-x-full lg:translate-x-0 lg:w-14"}`}
      >
        <div className={`flex items-center ${sideOpen ? "justify-between" : "justify-center"} gap-3 px-3 py-4 border-b border-slate-100 min-h-[60px]`}>
          {sideOpen && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shrink-0 shadow shadow-indigo-200">
                <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8L8 20v20h10V28h12v12h10V20L24 8z" fill="white"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-800 font-semibold text-sm leading-tight truncate">RealHubb</p>
                <p className="text-slate-400 text-[10px] tracking-widest uppercase">Admin</p>
              </div>
            </div>
          )}
          <button onClick={() => setSideOpen((v) => !v)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0">
            {sideOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const on = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setSideOpen(false);
                  }
                }}
                title={!sideOpen ? item.label : undefined}
                style={on ? { backgroundColor: item.accent + "12", color: item.accent } : {}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left relative
                  ${on ? "font-normal" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
              >
                {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: item.accent }} />}
                <span className="shrink-0">{item.icon}</span>
                {sideOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight truncate">{item.label}</p>
                    {!on && <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{item.desc}</p>}
                  </div>
                )}
                {on && sideOpen && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
              </button>
            );
          })}
        </nav>

        <div className="px-2 pb-4 pt-3 border-t border-slate-100 space-y-0.5">
          <a href="/" target="_blank" rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition group">
            <Eye className="h-4 w-4 shrink-0" />
            {sideOpen && (
              <>
                <span className="flex-1">View Site</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition" />
              </>
            )}
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
            <LogOut className="h-4 w-4 shrink-0" />
            {sideOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ml-0 ${sideOpen ? "lg:ml-56" : "lg:ml-14"}`}>
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSideOpen(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition lg:hidden shrink-0"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="p-1.5 rounded-lg" style={{ backgroundColor: nav.accent + "15", color: nav.accent }}>
                {nav.icon}
              </span>
              <div>
                <h1 className="text-sm font-semibold text-slate-800 leading-tight">{nav.label}</h1>
                <p className="text-slate-400 text-xs mt-0.5">{nav.desc}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Firestore Live
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {active === "overview"   && <OverviewSection onNavigate={setActive} />}
          {active === "properties" && <PropertyManager />}
          {active === "blogs"      && <BlogManager />}
          {active === "developers" && <DeveloperManager />}
          {active === "team"       && <TeamManager />}
          {active === "analytics"  && <AnalyticsSection />}
          {active === "gallery"    && <GalleryManager />}
          {active === "faqs"       && <FaqManager />}
          {active === "leads"      && <LeadsPanel />}
        </main>
      </div>
    </div>
  );
}

// ── Push Notification Panel ────────────────────────────────────────────────────
function PushNotificationPanel() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [subCount, setSubCount] = useState<number | null>(null);

  // Count subscribers on mount
  useEffect(() => {
    getDocs(collection(db, "pushSubscriptions"))
      .then((snap) => setSubCount(snap.size))
      .catch(() => setSubCount(0));
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await sendNotification({ title, body, url }, token);
      setResult(res);
      setTitle("");
      setBody("");
      setUrl("/");
    } catch (e) {
      console.error(e);
      setResult({ sent: 0, failed: -1 });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-500" />
          <p className="text-sm font-semibold text-slate-700">Send Push Notification</p>
        </div>
        {subCount !== null && (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {subCount} subscriber{subCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="🏠 New Property Alert!"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Message *</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Ramky Fortuna — 1,2,3 BHK in Whitefield from ₹79L"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Link (URL)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="/property/ramky-fortuna-whitefield"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !body.trim()}
          className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium transition flex items-center justify-center gap-2 shadow"
        >
          {sending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
          ) : (
            <><Bell className="h-4 w-4" /> Send to All Subscribers</>
          )}
        </button>

        {result && (
          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
            result.failed === -1 ? "bg-red-50 text-red-600" :
            result.sent > 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            {result.failed === -1 ? (
              "❌ Failed to send. Check server logs."
            ) : (
              <><CheckCircle className="h-4 w-4 shrink-0" /> Sent to {result.sent} device{result.sent !== 1 ? "s" : ""}
                {result.failed > 0 ? ` · ${result.failed} failed` : ""}</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Overview Section ───────────────────────────────────────────────────────────
interface OverviewProps { onNavigate: (s: Section) => void; }

function OverviewSection({ onNavigate }: OverviewProps) {
  const [data, setData] = useState<any[][]>([[], [], [], []]);
  const [loading, setLoading] = useState(true);
  const [ts, setTs] = useState(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const result = await Promise.all([
        getProperties(), getBlogPosts(), getDevelopers(), getTeamMembers(),
      ]);
      setData(result);
      setTs(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const [props, posts, devs, team] = data;

  const ongoing = props.filter((p: any) => (p.projectType || p.status) === "ongoing").length;
  const upcoming = props.filter((p: any) => (p.projectType || p.status) === "upcoming").length;
  const published = posts.filter((p: any) => p.published).length;
  const drafts = posts.filter((p: any) => !p.published).length;

  const cities = ["bangalore", "hyderabad", "chennai"];
  const cityCount = cities.map((c) => ({
    city: c.charAt(0).toUpperCase() + c.slice(1),
    count: props.filter((p: any) => (p.city || "").toLowerCase() === c).length,
  }));

  const catMap: Record<string, number> = {};
  posts.forEach((p: any) => {
    const c = p.category || "Other";
    catMap[c] = (catMap[c] || 0) + 1;
  });
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const seoScore = Math.min(
    100,
    Math.round(
      (props.length > 0 ? 20 : 0) +
      (published > 5 ? 25 : published * 5) +
      (devs.length > 5 ? 20 : devs.length * 4) +
      (team.length > 3 ? 15 : team.length * 5) +
      (props.filter((p: any) => p.description?.length > 50).length > 3 ? 20 : 10)
    )
  );

  const statCards = [
    { label: "Properties",   value: props.length, sub: `${ongoing} ongoing · ${upcoming} upcoming`, color: "text-sky-600",    bg: "bg-sky-50",    border: "border-sky-200",    nav: "properties" as Section },
    { label: "Blog Posts",   value: posts.length, sub: `${published} published · ${drafts} drafts`, color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200",nav: "blogs"       as Section },
    { label: "Developers",   value: devs.length,  sub: "Verified builders",                          color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  nav: "developers"  as Section },
    { label: "Team Members", value: team.length,  sub: "Advisors & staff",                           color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200",   nav: "team"        as Section },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-slate-800">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm mt-0.5">Live content stats + SEO health for RealHubb</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 bg-white transition shadow-sm">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing…" : `Updated ${ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <button key={s.label} onClick={() => onNavigate(s.nav)}
            className={`text-left p-5 rounded-2xl border ${s.border} ${s.bg} hover:shadow-md transition-all group bg-white`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${s.color}`}>{s.label}</span>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition" />
            </div>
            <p className={`text-4xl font-black ${s.color} leading-none`}>
              {loading ? <span className="inline-block w-10 h-8 bg-slate-100 rounded-lg animate-pulse" /> : s.value}
            </p>
            <p className="text-xs text-slate-500 mt-2">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* SEO + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SEO ring */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <Search className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-semibold text-slate-700">SEO Content Score</p>
          </div>
          <ScoreRing score={loading ? 0 : seoScore} />
          <div className="mt-4 space-y-1.5 w-full">
            {[
              { label: "Properties with descriptions", ok: props.filter((p: any) => p.description?.length > 50).length > 0 },
              { label: "Published blog posts",          ok: published >= 5 },
              { label: "Developer profiles",            ok: devs.length >= 5 },
              { label: "Team members listed",           ok: team.length >= 3 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                {item.ok ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                )}
                <span className={item.ok ? "text-slate-600" : "text-slate-400"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City bar chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="h-4 w-4 text-sky-500" />
            <p className="text-sm font-semibold text-slate-700">Properties by City</p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[60, 40, 30].map((w) => <div key={w} className="h-7 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${w}%` }} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {cityCount.map((c) => {
                const pct = props.length > 0 ? Math.round((c.count / props.length) * 100) : 0;
                const colors: Record<string, string> = { Bangalore: "bg-sky-500", Hyderabad: "bg-indigo-500", Chennai: "bg-violet-500" };
                return (
                  <div key={c.city}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{c.city}</span>
                      <span className="text-slate-400">{c.count} · {pct}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[c.city] || "bg-slate-400"} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                <span>Total: {props.length} properties</span>
                <button onClick={() => onNavigate("properties")} className="text-sky-500 hover:underline">Manage →</button>
              </div>
            </div>
          )}
        </div>

        {/* Blog categories */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-700">Top Blog Categories</p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[80, 60, 50, 40, 30].map((w) => <div key={w} className="h-6 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${w}%` }} />)}
            </div>
          ) : topCats.length > 0 ? (
            <div className="space-y-2.5">
              {topCats.map(([cat, count], i) => {
                const pct = Math.round((count / topCats[0][1]) * 100);
                const hues = ["bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-indigo-500"];
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate max-w-[150px] font-medium" title={cat}>{cat}</span>
                      <span className="text-slate-400 shrink-0 ml-2">{count} posts</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${hues[i]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                <span>{posts.length} total posts</span>
                <button onClick={() => onNavigate("blogs")} className="text-emerald-500 hover:underline">Manage →</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No blog posts yet</p>
          )}
        </div>
      </div>

      {/* Content status + Quick actions + Push Notif */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Content completeness */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-semibold text-slate-700">Content Completeness</p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Properties with images",       value: props.filter((p: any) => p.images?.length > 0).length,       total: props.length, color: "bg-sky-500"     },
              { label: "Properties with descriptions", value: props.filter((p: any) => p.description?.length > 30).length,  total: props.length, color: "bg-indigo-500"  },
              { label: "Blog posts published",         value: published,                                                      total: posts.length, color: "bg-emerald-500" },
              { label: "Developers with logos",        value: devs.filter((d: any) => d.logoUrl || d.logo).length,           total: devs.length,  color: "bg-amber-500"   },
              { label: "Team members with photos",     value: team.filter((m: any) => m.image || m.photo).length,           total: team.length,  color: "bg-rose-500"    },
            ].map((item) => {
              const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-500 font-semibold">{item.value}/{item.total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: loading ? "0%" : `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700">Quick Actions</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Property",    desc: "New listing",     icon: <Building2 className="h-5 w-5" />,  color: "text-sky-600",    bg: "bg-sky-50",    border: "border-sky-200",    nav: "properties" as Section },
              { label: "New Blog Post",   desc: "Write article",   icon: <PenLine className="h-5 w-5" />,    color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200",nav: "blogs"       as Section },
              { label: "Add Developer",   desc: "Builder profile", icon: <Plus className="h-5 w-5" />,       color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  nav: "developers"  as Section },
              { label: "Add Team Member", desc: "Staff profile",   icon: <UserCircle className="h-5 w-5" />, color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200",   nav: "team"        as Section },
            ].map((a) => (
              <button key={a.label} onClick={() => onNavigate(a.nav)}
                className={`flex flex-col items-start p-4 rounded-xl border ${a.border} ${a.bg} hover:shadow-md transition-all text-left`}>
                <span className={`${a.color} mb-3`}>{a.icon}</span>
                <p className={`text-sm font-semibold ${a.color}`}>{a.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-indigo-700 mb-1">SEO tip</p>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  {seoScore < 50
                    ? "Add descriptions to properties and publish blog posts to improve SEO."
                    : seoScore < 80
                    ? "Good progress! Add city-specific blog posts to rank higher."
                    : "Excellent! Keep publishing fresh content to maintain rankings."
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            {[
              { label: "Firebase Console",     href: "https://console.firebase.google.com" },
              { label: "Cloudinary Dashboard", href: "https://cloudinary.com/console"      },
              { label: "View Live Site",        href: "https://www.realhubb.in"             },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                className="flex items-center justify-between text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition group">
                <span>{link.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Push Notification Panel ── */}
        <PushNotificationPanel />
      </div>
    </div>
  );
}

// ── SEO Score Ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs work";
  return (
    <div className="flex flex-col items-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="64" y="58" textAnchor="middle" fontSize="26" fontWeight="800"
          fill={color} dominantBaseline="middle">{score}</text>
        <text x="64" y="78" textAnchor="middle" fontSize="11" fill="#94a3b8"
          dominantBaseline="middle">/100</text>
      </svg>
      <span className="text-sm font-semibold mt-1" style={{ color }}>{label}</span>
    </div>
  );
}
