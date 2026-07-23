import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import RentalYieldClient from "@/components/tools/RentalYieldClient";
import RentalYieldFactualData from "@/components/tools/RentalYieldFactualData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Rental Yield Calculator | Invest in Bangalore, Hyderabad & Chennai",
  description: "Calculate gross and net rental yields on your property investments instantly. Compare average yields across high-growth micro-markets in Bangalore, Hyderabad, and Chennai.",
  keywords: "rental yield calculator, rental yield bangalore, property returns hyderabad, net yield calculator chennai",
  canonical: `${SITE_URL}/rental-yield-calculator`,
});

export default function RentalYieldPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Immersive Header Banner */}
      <section className="bg-navy pt-28 pb-36 md:pt-32 md:pb-44 page-padding relative overflow-hidden text-white">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="RealHubb Financial Suite - Rental Yield Calculator"
            className="w-full h-full object-cover opacity-55 filter brightness-95"
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
            Rental Yield <span className="text-gold">Calculator</span>
          </h1>
          <p className="speakable-summary text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
            Evaluate gross yields, net rental income, and estimate payback timelines on your property investments across major Indian cities.
          </p>
        </div>
      </section>

      {/* Content Area */}
      <section className="page-padding relative z-20 -mt-16 md:-mt-20 pb-24 pt-4">
        <div className="max-w-4xl mx-auto">
          {/* Interactive Calculator (Client Component) */}
          <RentalYieldClient />

          {/* Server-rendered Comparative Data & Q&A (SEO / GEO / AEO Anchor) */}
          <RentalYieldFactualData />
          
          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-400 mt-12 font-light">
            * Figures are indicative. Actual returns depend on market conditions, occupancy rates, and local regulations.
          </p>
        </div>
      </section>
    </main>
  );
}
