"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/lead/ChatWidget";
import LeadPopup from "@/components/lead/LeadPopup";
import { trackPageView } from "@/lib/ga";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Fires on mount (first load) and on every client-side route change —
  // the only reliable pageview signal in an App Router SPA. GTM's GA4
  // Configuration tag should trigger on this "page_view" dataLayer event,
  // not on "All Pages" (see GTM setup notes).
  useEffect(() => {
    if (isAdmin || !pathname) return;
    trackPageView(pathname);
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 min-h-[85vh]">{children}</main>
      <Footer />
      <ChatWidget />
      <LeadPopup />
    </>
  );
}
