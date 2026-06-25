import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { getAllDevelopers } from "@/lib/firestoreServerService";
import { breadcrumbSchema, faqSchema } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";
import FaqSection from "@/components/faq/FaqSection";

import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Top Real Estate Developers in Bangalore | RealHubb",
  description:
    "Explore projects from Prestige, Godrej, Brigade, Sobha and other top developers. Verified RERA-registered projects. Contact RealHubb for latest pricing.",
  canonical: `${SITE_URL}/developers`,
  keywords: "real estate builders, property developers bangalore, RERA approved builders, prestige projects",
});

export const revalidate = 3600;

export const developerFaqs = [
  {
    question: "Who are the top real estate developers partnered with RealHubb?",
    answer: "RealHubb partners with India's most trusted and reputed Grade-A developers, including Prestige Group, Godrej Properties, Brigade Group, Sobha Limited, Birla Estates, Puravankara, and Tata Housing."
  },
  {
    question: "How does RealHubb verify the developers and their projects?",
    answer: "Every developer and project on our platform undergoes a rigorous due diligence process. We verify RERA registration status, land titles, municipal approvals, construction quality history, and the builder's track record of timely delivery."
  },
  {
    question: "Do I get better deals or discounts by booking through RealHubb instead of directly with the developer?",
    answer: "Yes, because of our institutional partnerships and high transaction volumes with top builders, we are often able to negotiate exclusive pricing, launch offers, and flexible payment plans that are not directly available to individual buyers. Additionally, we charge zero brokerage."
  },
  {
    question: "Is RealHubb an official channel partner for these builders?",
    answer: "Yes, RealHubb Ventures Pvt. Ltd. is an officially authorized and RERA-registered channel partner for all the developers listed on our website, ensuring all bookings and transactions are fully compliant and builder-certified."
  }
];

export default async function DevelopersPage() {
  const devs = await getAllDevelopers().catch(() => []);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Developers", url: `${SITE_URL}/developers` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(developerFaqs)) }}
      />
      <div className="pt-20 bg-cream min-h-screen">
        {/* Immersive Header Banner */}
        <div className="bg-navy pt-20 pb-24 md:pt-24 md:pb-28 page-padding relative overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
              alt="Developers"
              className="w-full h-full object-cover opacity-35 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
          </div>

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal mt-4 leading-tight animate-fadeIn">
              Our Developer <span className="text-gold">Partners</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl font-light mt-3 animate-fadeIn">
              We work with India&apos;s most trusted real estate developers — RERA verified,
              proven track records, and on-time delivery.
            </p>
          </div>
        </div>

        <div className="page-padding py-16">
          <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devs.map((dev) => (
              <RevealCard key={dev.id}>
                <Link
                  href={`/developers/${dev.slug}`}
                  className="group flex flex-col justify-between h-full bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 hover:border-gold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex-1">
                    {dev.logo ? (
                      <div className="relative w-36 h-16 mb-6">
                        <Image
                          src={imagePresets.developerLogo(dev.logo)}
                          alt={dev.name}
                          fill
                          sizes="144px"
                          className="object-contain object-left filter brightness-95 contrast-105"
                        />
                      </div>
                    ) : (
                      <div className="h-16 flex items-center mb-6">
                        <span className="font-heading text-navy text-xl group-hover:text-gold transition-colors">
                          {dev.name}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-500 text-sm leading-relaxed font-light line-clamp-3 mb-6">
                      {dev.description}
                    </p>
                  </div>

                  {(dev.established || dev.totalProjects || dev.headquarters) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-400 font-light mb-6">
                      {dev.established && (
                        <span className="flex items-center gap-1">
                          Est. {dev.established}
                        </span>
                      )}
                      {dev.totalProjects && (
                        <>
                          <span className="text-gray-250">•</span>
                          <span>{dev.totalProjects} Projects</span>
                        </>
                      )}
                      {dev.headquarters && (
                        <>
                          <span className="text-gray-250">•</span>
                          <span>{dev.headquarters}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-navy group-hover:text-gold transition-colors pt-4 border-t border-gray-100 mt-auto">
                    <span className="font-medium">View Developer Profile</span>
                    <span className="text-xs transition-transform group-hover:translate-x-1 duration-200">→</span>
                  </div>
                </Link>
              </RevealCard>
            ))}
          </RevealGrid>
        </div>

        {/* FAQs */}
        <div className="page-padding pb-24 max-w-4xl mx-auto">
          <FaqSection title="Developer Partner FAQs" icon="🏢" items={developerFaqs} />
        </div>
      </div>
    </>
  );
}
