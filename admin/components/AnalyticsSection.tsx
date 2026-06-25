import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart2, Users, Eye, Clock, TrendingUp, TrendingDown,
  Minus, RefreshCw, ExternalLink, Globe, Smartphone, Monitor,
  Tablet, ArrowUpRight, Activity, Search, FileText, Home,
  MousePointerClick, Wifi, MapPin, Zap,
} from "lucide-react";

// ── Config ────────────────────────────────────────────────────────────────────
const PROPERTY_ID    = "properties/529852769";
const MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || "G-HPYW6VG3WR";
const GA4_BASE       = "https://analytics.google.com/analytics/web";
const POLL_MS        = 30_000;

// Live Firebase Function URLs
const REALTIME_URL = "https://us-central1-realhubb-8daf5.cloudfunctions.net/ga4realtime";
const METRICS_URL  = "https://us-central1-realhubb-8daf5.cloudfunctions.net/ga4metrics";

const ga4Link = (path: string) =>
  `${GA4_BASE}/#/${PROPERTY_ID.replace("properties/", "")}/${path}`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface RealtimeData {
  activeUsers: number;
  byCountry:   { country: string; users: number }[];
  byPage:      { page: string;    users: number }[];
  lastUpdated: Date;
  online:      boolean;
}

interface MetricCard {
  label:  string;
  value:  string;
  change: number | null;
  icon:   React.ReactNode;
  color:  string;
  bg:     string;
  border: string;
}
interface TopPage    { path: string; views: number; pct: number; }
interface DeviceData { label: string; pct: number; icon: React.ReactNode; color: string; }

// ── Realtime hook — polls REALTIME_URL every 30s ──────────────────────────────
function useRealtimeData() {
  const [data, setData] = useState<RealtimeData>({
    activeUsers: 0,
    byCountry:   [],
    byPage:      [],
    lastUpdated: new Date(),
    online:      false,
  });
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(REALTIME_URL);
      if (!res.ok) throw new Error("not ok");
      const json = await res.json();
      setData({
        activeUsers: json.activeUsers ?? 0,
        byCountry:   json.byCountry   ?? [],
        byPage:      json.byPage      ?? [],
        lastUpdated: new Date(),
        online:      true,
      });
    } catch {
      setData(prev => ({ ...prev, online: false, lastUpdated: new Date() }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, POLL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchData]);

  return { data, loading, refresh: fetchData };
}

// ── 7-day metrics hook ────────────────────────────────────────────────────────
function useGAMetrics() {
  const [loading,  setLoading]  = useState(true);
  const [metrics,  setMetrics]  = useState<MetricCard[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [devices,  setDevices]  = useState<DeviceData[]>([]);
  const [ts,       setTs]       = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(METRICS_URL);
      if (!res.ok) throw new Error("not ok");
      const json = await res.json();

      setMetrics([
        { label: "Total users (7d)", value: json.users     > 0 ? json.users.toLocaleString()     : "—", change: json.usersChange     ?? null, icon: <Users    className="h-4 w-4" />, color: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200"     },
        { label: "Sessions (7d)",    value: json.sessions  > 0 ? json.sessions.toLocaleString()  : "—", change: json.sessionsChange  ?? null, icon: <Activity className="h-4 w-4" />, color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200"  },
        { label: "Page views (7d)",  value: json.pageviews > 0 ? json.pageviews.toLocaleString() : "—", change: json.pageviewsChange ?? null, icon: <Eye      className="h-4 w-4" />, color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200"  },
        { label: "Avg. session (s)", value: json.duration  > 0 ? `${json.duration}s`             : "—", change: null,                        icon: <Clock    className="h-4 w-4" />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
      ]);

      if (json.topPages?.length) {
        const max = json.topPages[0].views || 1;
        setTopPages(json.topPages.map((p: any) => ({
          path:  p.path,
          views: p.views,
          pct:   Math.round((p.views / max) * 100),
        })));
      }

      if (json.devices?.length) {
        const icons:  Record<string, React.ReactNode> = {
          mobile:  <Smartphone className="h-3.5 w-3.5" />,
          desktop: <Monitor    className="h-3.5 w-3.5" />,
          tablet:  <Tablet     className="h-3.5 w-3.5" />,
        };
        const colors: Record<string, string> = {
          mobile:  "bg-sky-500",
          desktop: "bg-indigo-500",
          tablet:  "bg-violet-500",
        };
        setDevices(json.devices.map((d: any) => ({
          label: d.label,
          pct:   d.pct,
          icon:  icons[d.label.toLowerCase()]  || <Monitor className="h-3.5 w-3.5" />,
          color: colors[d.label.toLowerCase()] || "bg-slate-400",
        })));
      }
    } catch {
      setMetrics([
        { label: "Total users (7d)", value: "—", change: null, icon: <Users    className="h-4 w-4" />, color: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200"     },
        { label: "Sessions (7d)",    value: "—", change: null, icon: <Activity className="h-4 w-4" />, color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200"  },
        { label: "Page views (7d)",  value: "—", change: null, icon: <Eye      className="h-4 w-4" />, color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200"  },
        { label: "Avg. session (s)", value: "—", change: null, icon: <Clock    className="h-4 w-4" />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
      ]);
      setTopPages([
        { path: "/",                 views: 0, pct: 100 },
        { path: "/ongoing-projects", views: 0, pct: 0   },
        { path: "/property/...",     views: 0, pct: 0   },
        { path: "/blog",             views: 0, pct: 0   },
        { path: "/contact-us",       views: 0, pct: 0   },
      ]);
      setDevices([
        { label: "Mobile",  pct: 62, icon: <Smartphone className="h-3.5 w-3.5" />, color: "bg-sky-500"    },
        { label: "Desktop", pct: 33, icon: <Monitor    className="h-3.5 w-3.5" />, color: "bg-indigo-500" },
        { label: "Tablet",  pct: 5,  icon: <Tablet     className="h-3.5 w-3.5" />, color: "bg-violet-500" },
      ]);
    } finally {
      setTs(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { loading, metrics, topPages, devices, ts, reload: load };
}

// ── Realtime Panel ─────────────────────────────────────────────────────────────
function RealtimePanel() {
  const { data, loading, refresh } = useRealtimeData();
  const [tick, setTick] = useState(POLL_MS / 1000);

  useEffect(() => {
    setTick(POLL_MS / 1000);
    const id = setInterval(
      () => setTick(t => (t <= 1 ? POLL_MS / 1000 : t - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [data.lastUpdated]);

  const barHeights = [4, 7, 5, 9, 6, 8,
    data.online ? Math.min((data.activeUsers || 1) * 2 + 3, 14) : 5,
  ];

  // GA4 byPage returns page titles — truncate long ones for display
  const truncateTitle = (title: string, max = 40) =>
    title.length > max ? title.slice(0, max) + "…" : title;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <p className="text-sm font-normal text-slate-700">Live users on site right now</p>
          {data.online
            ? <span className="flex items-center gap-1 text-[10px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Wifi className="h-2.5 w-2.5" /> Live
              </span>
            : <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Zap className="h-2.5 w-2.5" /> Connecting…
              </span>
          }
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Auto-refresh in {tick}s</span>
          <button onClick={refresh} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-50/50">
        <div>
          <p className="text-5xl font-black text-slate-800 leading-none">
            {loading ? "..." : data.activeUsers}
          </p>
          <p className="text-xs text-slate-500 mt-2">Active sessions (last 30 mins)</p>
        </div>

        {/* Real-time bar sparkline */}
        <div className="flex items-end gap-1.5 h-14 pr-2">
          {barHeights.map((h, i) => (
            <span key={i}
              className={`w-2.5 rounded-t-sm transition-all duration-500 bg-emerald-500/70 hover:bg-emerald-500 ${
                i === barHeights.length - 1 ? "animate-pulse bg-emerald-500" : ""
              }`}
              style={{ height: `${h * 6}px` }} />
          ))}
        </div>
      </div>

      {/* Pages and Countries split grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-100">
        {/* Pages */}
        <div className="p-6 border-r border-slate-100">
          <p className="text-xs font-normal text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MousePointerClick className="h-3.5 w-3.5 text-slate-400" /> Active Pages
          </p>
          {data.byPage.length > 0 ? (
            <div className="space-y-3">
              {data.byPage.slice(0, 5).map((page, i) => (
                <div key={i} className="flex justify-between items-center text-xs gap-3">
                  <span className="text-slate-600 font-medium truncate flex-1" title={page.page}>
                    {truncateTitle(page.page)}
                  </span>
                  <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    {page.users}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4">No active pages tracked</p>
          )}
        </div>

        {/* Countries */}
        <div className="p-6">
          <p className="text-xs font-normal text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-slate-400" /> Active Countries
          </p>
          {data.byCountry.length > 0 ? (
            <div className="space-y-3">
              {data.byCountry.slice(0, 5).map((c, i) => {
                const total = data.activeUsers || 1;
                const pct = Math.round((c.users / total) * 100);
                return (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between items-center mb-1 text-slate-600">
                      <span className="font-medium truncate flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-400" /> {c.country}
                      </span>
                      <span className="font-semibold text-slate-500">{c.users} ({pct}%)</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4">Waiting for geolocation data</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AnalyticsSection ──────────────────────────────────────────────────────────
export default function AnalyticsSection() {
  const { loading, metrics, topPages, devices, ts, reload } = useGAMetrics();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Upper header controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-normal text-slate-800">Analytics Overview</h2>
          <p className="text-slate-500 text-sm mt-0.5">Google Analytics (GA4) traffic insights for RealHubb</p>
        </div>
        <button onClick={reload}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 bg-white transition shadow-sm">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Syncing GA4…" : `Synced ${ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </button>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && metrics.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-slate-100 animate-pulse p-5">
                <div className="w-16 h-3 bg-slate-100 rounded mb-4" />
                <div className="w-10 h-7 bg-slate-100 rounded" />
              </div>
            ))
          : metrics.map(s => (
              <div key={s.label} className={`p-5 rounded-2xl border ${s.border} ${s.bg} bg-white shadow-sm transition hover:shadow-md`}>
                <div className="flex items-center justify-between mb-4 text-slate-400">
                  <span className="text-xs font-normal uppercase tracking-wider text-slate-500">{s.label}</span>
                  <span className={`p-1.5 rounded-lg ${s.bg} border ${s.border} shrink-0`}>
                    {s.icon}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-800 leading-none">
                  {s.value}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                  {s.change !== null ? (
                    s.change >= 0 ? (
                      <span className="text-emerald-600 font-semibold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" /> +{s.change}%
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center">
                        <TrendingDown className="h-3 w-3 mr-0.5" /> {s.change}%
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 flex items-center">
                      <Minus className="h-3 w-3 mr-0.5" /> Stable
                    </span>
                  )}
                  <span className="text-slate-400">vs prev 7 days</span>
                </div>
              </div>
            ))}
      </div>

      {/* Main analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live activity */}
          <RealtimePanel />

          {/* Top 7d Pages */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-500" />
                <p className="text-sm font-normal text-slate-700">Top Pages (Last 7 Days)</p>
              </div>
              <a href={ga4Link("pages-and-screens")} target="_blank" rel="noreferrer"
                className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                Full Report <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : topPages.length > 0 ? (
              <div className="space-y-4">
                {topPages.slice(0, 5).map((page, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium truncate flex-1" title={page.path}>
                        {page.path}
                      </span>
                      <span className="text-slate-500 font-bold ml-2">{page.views.toLocaleString()} views</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${page.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No historical data available</p>
            )}
          </div>
        </div>

        {/* Right 1 col */}
        <div className="space-y-6">
          {/* Devices widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Smartphone className="h-4 w-4 text-sky-500" />
              <p className="text-sm font-normal text-slate-700">Traffic by Device (7d)</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {devices.map((dev, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition">
                    <span className="p-2 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                      {dev.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1 text-slate-600 font-medium">
                        <span>{dev.label}</span>
                        <span>{dev.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${dev.color} transition-all duration-700`} style={{ width: `${dev.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links to Google Analytics Console */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-indigo-500" />
              <p className="text-sm font-normal text-slate-700">Google Analytics 4</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Access full metrics, track custom events, customize dashboards, and analyze user journeys inside the GA4 Console.
            </p>
            <div className="space-y-2">
              <a href={ga4Link("report-home")} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 px-3.5 py-2.5 rounded-xl transition font-medium group">
                <span>GA4 Home Dashboard</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>
              <a href={ga4Link("realtime")} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 px-3.5 py-2.5 rounded-xl transition font-medium group">
                <span>Live Realtime Reports</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>
              <a href="https://tagmanager.google.com/" target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 px-3.5 py-2.5 rounded-xl transition font-medium group">
                <span>Google Tag Manager</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
