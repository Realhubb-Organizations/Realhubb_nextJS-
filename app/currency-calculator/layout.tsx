import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 57 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Currency Converter for NRI Property Buyers | RealHubb",
  // 149 chars ✅
  description:
    "Convert USD, GBP, AED, EUR to Indian Rupees for property purchases. Free currency converter for NRI buyers in Bangalore, Hyderabad & Chennai.",
  keywords:
    "currency converter india property, nri property calculator, usd to inr property, aed to inr property, nri home buyer calculator",
  canonical: `${SITE_URL}/currency-calculator`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function CurrencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
