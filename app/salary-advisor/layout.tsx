import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 57 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Salary-Based Property Budget Calculator | RealHubb",
  // 148 chars ✅
  description:
    "Find out what property budget you can afford based on your monthly take-home salary. Free salary to property budget calculator for Indian home buyers.",
  keywords:
    "salary to property budget, how much property can i afford, budget calculator, affordability",
  canonical: `${SITE_URL}/salary-advisor`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function SalaryAdvisorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
