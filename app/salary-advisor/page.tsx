import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SalaryAdvisorClient from "@/components/tools/SalaryAdvisorClient";
import SalaryAdvisorFactualData from "@/components/tools/SalaryAdvisorFactualData";
import PageHeroImage from "@/components/ui/PageHeroImage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Salary Advisor | Take-Home Salary & Living Cost Calculator",
  description: "Calculate your estimated monthly take-home salary, tax deductions, and local living costs across major Indian cities including Bangalore, Hyderabad, and Chennai.",
  keywords: "salary advisor, take home salary calculator, living expenses bangalore, in hand salary calculator",
  canonical: `${SITE_URL}/salary-advisor`,
});

export default function SalaryAdvisorPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Immersive Header Banner */}
      <section className="bg-navy pt-28 pb-36 md:pt-32 md:pb-44 page-padding relative overflow-hidden text-white">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0">
          <PageHeroImage
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="RealHubb Financial Suite - Salary Advisor"
            className="object-cover opacity-55 brightness-95"
          />
          {/* Smooth linear gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy" />
        </div>

        {/* Golden glow light effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-normal bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 mb-6 inline-block">
            RealHubb Financial Suite
          </span>
          <h1 className="speakable-title text-3xl sm:text-4xl lg:text-5xl font-heading font-normal text-white max-w-3xl leading-tight mx-auto">
            Salary <span className="text-gold">Advisor</span>
          </h1>
          <p className="speakable-summary text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
            Calculate your estimated monthly take-home salary, tax deductions, and local living costs across major Indian cities including Bangalore, Hyderabad, and Chennai.
          </p>
        </div>
      </section>

      {/* Content Area */}
      <section className="page-padding relative z-20 -mt-16 md:-mt-20 pb-24 pt-4">
        <div className="max-w-4xl mx-auto">
          {/* Interactive Calculator (Client Component) */}
          <SalaryAdvisorClient />

          {/* Server-rendered Comparative Data & Q&A (SEO / GEO / AEO Anchor) */}
          <SalaryAdvisorFactualData />
          
          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-400 mt-12 font-light">
            * Living costs and tax brackets are approximations for reference only.
          </p>
        </div>
      </section>
    </main>
  );
}
