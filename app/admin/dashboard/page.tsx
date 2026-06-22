"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Building2, FileText, Users, Image, BarChart3, LogOut, UserCircle, Newspaper, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import PropertyManager from "@/admin/components/PropertyManager";
import BlogManager from "@/admin/components/BlogManager";
import TeamManager from "@/admin/components/TeamManager";
import DeveloperManager from "@/admin/components/DeveloperManager";
import GalleryManager from "@/admin/components/GalleryManager";
import FaqManager from "@/admin/components/FaqManager";
import LeadsPanel from "@/admin/components/LeadsPanel";

type Tab = "properties" | "blog" | "team" | "developers" | "gallery" | "faq" | "resumes";

const tabs = [
  { id: "properties" as Tab, label: "Properties", icon: Building2 },
  { id: "blog" as Tab, label: "Blog", icon: Newspaper },
  { id: "team" as Tab, label: "Team", icon: UserCircle },
  { id: "developers" as Tab, label: "Developers", icon: Users },
  { id: "gallery" as Tab, label: "Gallery", icon: Image },
  { id: "faq" as Tab, label: "FAQs", icon: HelpCircle },
  { id: "resumes" as Tab, label: "Resumes", icon: FileText },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("properties");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      setChecking(false);
    });
    return unsub;
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    document.cookie = "realhubb-admin-session=; path=/; max-age=0";
    router.push("/admin/login");
  }

  if (checking) {
    return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-56 bg-navy flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <span className="font-heading text-lg text-white">Real<span className="text-gold">Hubb</span></span>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-normal transition-all", activeTab === tab.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5")}>
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <h1 className="font-heading text-2xl text-navy font-normal mb-6 capitalize">
          {tabs.find((t) => t.id === activeTab)?.label}
        </h1>
        {activeTab === "properties" && <PropertyManager />}
        {activeTab === "blog" && <BlogManager />}
        {activeTab === "team" && <TeamManager />}
        {activeTab === "developers" && <DeveloperManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "faq" && <FaqManager />}
        {activeTab === "resumes" && <LeadsPanel />}
      </main>
    </div>
  );
}
