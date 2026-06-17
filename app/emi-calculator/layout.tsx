import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema } from "@/lib/structuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 58 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Home Loan EMI Calculator — Free & Accurate | RealHubb",
  // 149 chars ✅
  description:
    "Calculate your monthly home loan EMI instantly. Enter loan amount, interest rate & tenure. Free EMI calculator for Bangalore home buyers.",
  keywords:
    "emi calculator, home loan emi calculator, emi calculator bangalore, monthly emi calculator, home loan calculator india",
  canonical: `${SITE_URL}/emi-calculator`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function EMILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            softwareApplicationSchema(
              "Home Loan EMI Calculator",
              "Calculate your monthly home loan EMI instantly.",
              `${SITE_URL}/emi-calculator`
            )
          ),
        }}
      />
      {children}
    </>
  );
}
