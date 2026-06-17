import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 58 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Rental Yield Calculator — Best ROI Areas | RealHubb",
  // 149 chars ✅
  description:
    "Calculate annual rental yield and net ROI for any property in Bangalore, Hyderabad or Chennai. Find which areas give best rental returns in 2026.",
  keywords:
    "rental yield calculator, rental yield bangalore, property roi calculator, rental income calculator, best rental yield bangalore 2026",
  canonical: `${SITE_URL}/rental-yield-calculator`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function RentalYieldLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
