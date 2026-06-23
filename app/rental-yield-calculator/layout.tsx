import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema, howToSchema } from "@/lib/structuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 58 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Rental Yield Calculator — Best ROI Areas | RealHubb",
  // 149 chars ✅
  description:
    "Calculate annual rental yield and net ROI for any property in Bangalore, Hyderabad or Chennai. Find which areas give best rental returns in 2026.",
  keywords:
    "rental yield calculator, property roi calculator, rental income, best rental yield bangalore",
  canonical: `${SITE_URL}/rental-yield-calculator`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function RentalYieldLayout({ children }: { children: React.ReactNode }) {
  const steps = [
    {
      name: "Enter Purchase Price",
      text: "Input the total purchase price of the property, including registry and other acquisition costs.",
      url: `${SITE_URL}/rental-yield-calculator#property-price`,
    },
    {
      name: "Enter Monthly Rent",
      text: "Input the expected or actual monthly rental income for the property.",
      url: `${SITE_URL}/rental-yield-calculator#monthly-rent`,
    },
    {
      name: "Specify Expenses",
      text: "Enter maintenance charges, property taxes, and other monthly operational expenses.",
      url: `${SITE_URL}/rental-yield-calculator#property-expenses`,
    },
    {
      name: "View Rental Yield",
      text: "Analyze your gross rental yield, net rental yield, and long-term capital appreciation potential instantly.",
      url: `${SITE_URL}/rental-yield-calculator#yield-results`,
    },
  ];

  const yieldHowTo = howToSchema(
    "How to Calculate Property Rental Yield",
    "Learn how to compute gross and net annual rental yields for residential and commercial real estate using RealHubb's calculator.",
    steps,
    "PT1M"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            softwareApplicationSchema(
              "Property Rental Yield Calculator",
              "Calculate annual rental yield and net ROI for any property.",
              `${SITE_URL}/rental-yield-calculator`
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yieldHowTo) }}
      />
      {children}
    </>
  );
}
