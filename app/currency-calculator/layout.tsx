import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema, howToSchema } from "@/lib/structuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 57 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Currency Converter for NRI Property Buyers | RealHubb",
  // 149 chars ✅
  description:
    "Convert USD, GBP, AED, EUR to Indian Rupees for property purchases. Free currency converter for NRI buyers in Bangalore, Hyderabad & Chennai.",
  keywords:
    "currency converter, nri property calculator, usd to inr, aed to inr, nri home buyer calculator",
  canonical: `${SITE_URL}/currency-calculator`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function CurrencyLayout({ children }: { children: React.ReactNode }) {
  const steps = [
    {
      name: "Select Source Currency",
      text: "Choose the foreign currency you wish to convert (e.g. USD, AED, GBP, EUR).",
      url: `${SITE_URL}/currency-calculator#source-currency`,
    },
    {
      name: "Enter Foreign Currency Amount",
      text: "Input the foreign currency amount to convert.",
      url: `${SITE_URL}/currency-calculator#currency-amount`,
    },
    {
      name: "View Converted Value in INR",
      text: "Instantly view the converted Indian Rupee value based on current exchange rates.",
      url: `${SITE_URL}/currency-calculator#conversion-result`,
    },
  ];

  const currencyHowTo = howToSchema(
    "How to Convert Foreign Currency for Indian Property Purchase",
    "Learn how NRI property buyers can convert USD, AED, GBP, and EUR to INR instantly using RealHubb's converter tool.",
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
              "Currency Converter for NRI Property Buyers",
              "Convert foreign currency to Indian Rupees for property purchases.",
              `${SITE_URL}/currency-calculator`
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(currencyHowTo) }}
      />
      {children}
    </>
  );
}
