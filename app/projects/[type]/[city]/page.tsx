import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllProperties } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import { breadcrumbSchema } from "@/lib/structuredData";
import ProjectsClient from "@/components/property/ProjectsClient";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";

type Params = Promise<{ type: string; city: string }>;
type SearchParams = Promise<{ type?: string; price?: string; q?: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

const cityLabels: Record<string, string> = {
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

export const revalidate = 3600;

export default async function ProjectsCityPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { type, city } = await params;
  const sp = await searchParams;

  const firestoreProps = await getAllProperties().catch(() => []);
  const allProps = firestoreProps.length > 0 ? firestoreProps : staticProperties;

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
      <div className="pt-20">
        <div className="bg-navy pt-20 pb-28 md:pt-24 md:pb-36 page-padding relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/55 to-navy/20" />
          </div>

          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight animate-fadeIn">
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
      </div>
    </>
  );
}
