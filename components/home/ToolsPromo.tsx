import Link from "next/link";
import { Calculator, Home, TrendingUp } from "lucide-react";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

const tools = [
  {
    icon: Calculator,
    title: "EMI Calculator",
    desc: "Calculate your monthly home loan EMI instantly with accurate results.",
    href: "/emi-calculator",
    cta: "Calculate EMI",
  },
  {
    icon: Home,
    title: "Loan Eligibility",
    desc: "Find out how much home loan you're eligible for based on your income.",
    href: "/home-loan-eligibility",
    cta: "Check Eligibility",
  },
  {
    icon: TrendingUp,
    title: "Rental Yield",
    desc: "Calculate annual rental yield and ROI for any property in seconds.",
    href: "/rental-yield-calculator",
    cta: "Calculate Yield",
  },
];

export default function ToolsPromo() {
  return (
    <section className="py-20 bg-cream">
      <div className="page-padding">
        <div className="text-center mb-10">
          <p className="section-overline text-gold mb-2">Free Financial Tools</p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
            Tools for Smarter Home Buying
          </h2>
        </div>

        <RevealGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <RevealCard key={tool.title}>
                <Link
                  href={tool.href}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-gold block h-full"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-navy text-lg font-normal mb-2">{tool.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tool.desc}</p>
                  <span className="text-sm text-navy group-hover:text-gold transition-colors border-b border-navy/20 group-hover:border-gold">
                    {tool.cta} →
                  </span>
                </Link>
              </RevealCard>
            );
          })}
        </RevealGrid>
      </div>
    </section>
  );
}
