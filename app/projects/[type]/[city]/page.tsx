import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllProperties } from "@/lib/firestoreServerService";
import { breadcrumbSchema, faqSchema } from "@/lib/structuredData";
import ProjectsClient from "@/components/property/ProjectsClient";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FaqSection from "@/components/faq/FaqSection";



type Params = Promise<{ type: string; city: string }>;
type SearchParams = Promise<{ type?: string; price?: string; q?: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

const cityLabels: Record<string, string> = {
  all: "All Cities",
  bangalore: "Bangalore",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { type, city } = await params;
  const cityLabel = cityLabels[city] ?? city;
  const typeLabel = type === "upcoming" ? "Upcoming" : "Ongoing";

  return buildMetadata({
    title: `${typeLabel} Projects in ${cityLabel} 2026 | RealHubb`,
    description: `Browse ${typeLabel.toLowerCase()} residential projects in ${cityLabel}. Verified by RERA. 2BHK, 3BHK apartments from top builders. Free site visit. Contact RealHubb.`,
    keywords: `${typeLabel.toLowerCase()} projects ${cityLabel.toLowerCase()}, flats ${cityLabel.toLowerCase()}, apartments ${cityLabel.toLowerCase()}, buy property ${cityLabel.toLowerCase()}`,
    canonical: `${SITE_URL}/projects/${type}/${city}`,
  });
}

export const dynamic = "force-dynamic";

function getCityFaqs(cityLabel: string) {
  return [
    {
      question: "What is the difference between Ongoing and Upcoming projects?",
      answer: "Ongoing projects are currently under active construction and have obtained all necessary municipal approvals and a valid RERA registration number. Upcoming projects represent brand-new builder launches that are in the pre-launch or soft-launch phase, which are awaiting final RERA approvals before active construction begins."
    },
    {
      question: "Does RealHubb charge any brokerage or service fees for home buyers?",
      answer: "No, RealHubb operates on a 100% zero brokerage model. Our consultation, site visits, legal documentation review, and home loan assistance are completely free for property buyers."
    },
    {
      question: `How does RealHubb ensure the properties listed in ${cityLabel} are verified?`,
      answer: `Every ongoing and upcoming project listed in ${cityLabel} on our portal undergoes a strict title and RERA-compliance verification. We check the builder's track record, legal land clearances, approval certificates, and physical construction progress before listing a project.`
    },
    {
      question: `How do I arrange a free site visit for a project in ${cityLabel}?`,
      answer: `You can schedule a visit by clicking "Book Free Site Visit" on any property detail page, or by chatting directly with our advisors on WhatsApp. We provide door-step pickup and drop support in ${cityLabel}, and an expert real estate advisor will accompany you to answer all queries.`
    }
  ];
}

export default async function ProjectsCityPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { type, city } = await params;
  const sp = await searchParams;

  const allProps = await getAllProperties().catch(() => []);

  const cityLabel = cityLabels[city] ?? city;
  const typeLabel = type === "upcoming" ? "Upcoming" : "Ongoing";

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Properties", url: `${SITE_URL}/projects/ongoing` },
    { name: cityLabel, url: `${SITE_URL}/projects/${type}/${city}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(getCityFaqs(cityLabel))) }}
      />
      <div className="pt-20 bg-cream min-h-screen">
        <div className="bg-navy pt-20 pb-28 md:pt-24 md:pb-36 page-padding relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
              alt={`${city} Real Estate Projects Banner`}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/55 to-navy/20" />
          </div>

          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10 animate-fadeIn">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight">
              {typeLabel} Projects in <span className="text-gold">{cityLabel}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-white/60 text-xs md:text-sm font-light">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Verified RERA-registered properties
              </span>
              <span className="hidden md:inline text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Zero brokerage
              </span>
              <span className="hidden md:inline text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Free site visit
              </span>
            </div>
          </div>
        </div>
        <ProjectsClient
          allProperties={allProps}
          initialCity={city}
          initialType={type as "ongoing" | "upcoming"}
          initialFilterType={sp.type ?? ""}
          initialPriceRange={sp.price ?? ""}
          initialSearch={sp.q ?? ""}
        />

        {/* FAQs */}
        <div className="page-padding py-24 max-w-4xl mx-auto">
          <FaqSection title={`${typeLabel} Projects FAQs`} icon="🏠" items={getCityFaqs(cityLabel)} />
        </div>
      </div>
    </>
  );
}
