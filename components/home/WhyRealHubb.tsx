import { Shield, BadgeCheck, Users2, HeartHandshake } from "lucide-react";
import { company } from "@/data/company";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

const usps = [
  {
    icon: Shield,
    title: "RERA Verified",
    desc: "Every property we list is verified against the official RERA database. No unregistered projects, ever.",
  },
  {
    icon: BadgeCheck,
    title: "Zero Brokerage",
    desc: "Our advisory service — site visits, documentation, loan assistance — is completely free for buyers.",
  },
  {
    icon: Users2,
    title: "Expert Advisors",
    desc: `Guided by specialists like ${company.advisors.join(" and ")} with ${company.stats.experience} years of combined market expertise.`,
  },
  {
    icon: HeartHandshake,
    title: "End-to-End Support",
    desc: "From shortlisting to registration and beyond — we're with you at every step of the property journey.",
  },
];

export default function WhyRealHubb() {
  return (
    <section className="py-20 bg-cream">
      <div className="page-padding">
        <div className="text-center mb-12">
          <p className="section-overline text-gold-800 mb-2">Why Choose Us</p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
            Why 1,000+ Families Trust RealHubb
          </h2>
        </div>

        <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp) => {
            const Icon = usp.icon;
            return (
              <RevealCard key={usp.title}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group h-full">
                  <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                    <Icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="font-heading text-lg text-navy font-normal mb-2">{usp.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{usp.desc}</p>
                </div>
              </RevealCard>
            );
          })}
        </RevealGrid>
      </div>
    </section>
  );
}
