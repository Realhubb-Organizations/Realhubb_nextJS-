import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema, howToSchema } from "@/lib/structuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 58 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Home Loan EMI Calculator — Free & Accurate | RealHubb",
  // 149 chars ✅
  description:
    "Calculate your monthly home loan EMI instantly. Enter loan amount, interest rate & tenure. Free EMI calculator for Bangalore home buyers.",
  keywords:
    "emi calculator, home loan emi calculator, emi calculator bangalore, home loan calculator india",
  canonical: `${SITE_URL}/emi-calculator`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function EMILayout({ children }: { children: React.ReactNode }) {
  const emiSteps = [
    {
      name: "Enter Loan Amount",
      text: "Input the total home loan amount you wish to borrow in Rupees.",
      url: `${SITE_URL}/emi-calculator#loan-amount`,
    },
    {
      name: "Set Interest Rate",
      text: "Enter the annual interest rate offered by the bank or financial institution.",
      url: `${SITE_URL}/emi-calculator#interest-rate`,
    },
    {
      name: "Specify Tenure",
      text: "Enter the repayment period in years (e.g., 20 or 30 years).",
      url: `${SITE_URL}/emi-calculator#loan-tenure`,
    },
    {
      name: "Analyze Monthly EMI",
      text: "View your computed monthly EMI breakdown, total interest payable, and amortization schedule instantly.",
      url: `${SITE_URL}/emi-calculator#emi-result`,
    },
  ];

  const emiHowTo = howToSchema(
    "How to Calculate Home Loan EMI",
    "Learn how to calculate your home loan monthly instalments step-by-step using RealHubb's free EMI calculator.",
    emiSteps,
    "PT1M"
  );

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(emiHowTo) }}
      />
      {children}
    </>
  );
}
