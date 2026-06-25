"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/lead/ChatWidget";
import LeadPopup from "@/components/lead/LeadPopup";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

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
