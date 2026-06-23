import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema, howToSchema } from "@/lib/structuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 60 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Home Loan Eligibility Calculator | RealHubb",
  // 148 chars ✅
  description:
    "Check how much home loan you are eligible for based on your salary. Free home loan eligibility calculator for Bangalore, Hyderabad & Chennai buyers.",
  keywords:
    "home loan eligibility calculator, home loan eligibility, how much home loan can i get, india",
  canonical: `${SITE_URL}/home-loan-eligibility`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default function HomeLoanLayout({ children }: { children: React.ReactNode }) {
  const steps = [
    {
      name: "Enter Monthly Salary/Income",
      text: "Input your net monthly take-home salary or corporate business income.",
      url: `${SITE_URL}/home-loan-eligibility#monthly-income`,
    },
    {
      name: "Specify Loan Tenure",
      text: "Select your preferred home loan repayment tenure in years.",
      url: `${SITE_URL}/home-loan-eligibility#loan-tenure`,
    },
    {
      name: "Enter Expected Interest Rate",
      text: "Provide the home loan annual interest rate offered by banks.",
      url: `${SITE_URL}/home-loan-eligibility#interest-rate`,
    },
    {
      name: "Input Existing Loan EMIs",
      text: "List other active monthly commitments (e.g. car loan, personal loan EMIs).",
      url: `${SITE_URL}/home-loan-eligibility#existing-emi`,
    },
    {
      name: "Analyze Eligibility Amount",
      text: "Instantly view the maximum home loan amount you qualify for, estimated EMI, and required downpayment.",
      url: `${SITE_URL}/home-loan-eligibility#eligibility-results`,
    },
  ];

  const eligibilityHowTo = howToSchema(
    "How to Check Home Loan Eligibility",
    "Discover how much home loan you are eligible for based on your income and existing obligations using RealHubb's calculator.",
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
              "Home Loan Eligibility Calculator",
              "Check how much home loan you are eligible for based on your salary.",
              `${SITE_URL}/home-loan-eligibility`
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eligibilityHowTo) }}
      />
      {children}
    </>
  );
}
