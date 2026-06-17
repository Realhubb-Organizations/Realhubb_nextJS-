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
        <div className="bg-navy py-12 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-4xl text-white font-normal mt-4">
            {typeLabel} Projects in {cityLabel}
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Verified RERA-registered properties. Zero brokerage. Free site visit.
          </p>
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
