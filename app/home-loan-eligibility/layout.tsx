import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 60 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Home Loan Eligibility Calculator | RealHubb",
  // 148 chars ✅
  description:
    "Check how much home loan you are eligible for based on your salary. Free home loan eligibility calculator for Bangalore, Hyderabad & Chennai buyers.",
  keywords:
    "home loan eligibility calculator, home loan eligibility, loan eligibility calculator, how much home loan can i get, home loan india",
  canonical: `${SITE_URL}/home-loan-eligibility`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function HomeLoanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
