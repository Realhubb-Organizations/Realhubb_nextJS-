import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locationMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/structuredData";
import { getLocationBySlug, getLocationsByCity, locations } from "@/data/locations";
import { getPropertiesByCityAndLocation } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import PropertyCard from "@/components/property/PropertyCard";
import InstantCallbackForm from "@/components/lead/InstantCallbackForm";
import FaqAccordion from "@/components/faq/FaqAccordion";

type Params = Promise<{ city: string; area: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";
const cityLabels: Record<string, string> = {
  bangalore: "Bangalore",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, area } = await params;
  return locationMetadata(city, area);
}

export async function generateStaticParams() {
  return locations.map((l) => ({ city: l.city, area: l.areaSlug }));
}

export const revalidate = 3600;

export default async function AreaPage({ params }: { params: Params }) {
  const { city, area } = await params;
  const loc = getLocationBySlug(city, area);
  if (!loc) notFound();

  const cityLabel = cityLabels[city] ?? city;

  const firestoreProps = await getPropertiesByCityAndLocation(city, area).catch(() => []);
  const areaProps =
    firestoreProps.length > 0
      ? firestoreProps
      : staticProperties.filter(
            (p) =>
              p.city === city &&
              p.location.toLowerCase().replace(/\s+/g, "-") === area
          );

  const nearbyLocations = getLocationsByCity(city).filter((l) => l.areaSlug !== area).slice(0, 5);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: `${cityLabel} Real Estate`, url: `${SITE_URL}/real-estate/${city}` },
    { name: loc.area, url: `${SITE_URL}/real-estate/${city}/${area}` },
  ];

  const propertyListItems = areaProps.slice(0, 6).map((p) => ({
    name: p.name,
    url: `${SITE_URL}/property/${p.slug}`,
    image: p.images[0],
    description: p.price,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema(cityLabel, loc.area)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(loc.faq)) }} />
      {propertyListItems.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema(propertyListItems)) }} />
      )}

      <div className="pt-20">
        {/* Hero */}
        <div className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4">
            Flats & Properties in {loc.area}, {cityLabel}
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-xl">
            {loc.avgPriceSqft} · {loc.popularTypes.join(", ")}
          </p>
        </div>

        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* Intro */}
            <section>
              <p className="text-gray-500 text-sm leading-relaxed">{loc.intro}</p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-cream rounded-xl p-4">
                <p className="section-overline text-gold mb-1">Avg Price</p>
                <p className="font-heading text-navy text-lg font-normal">{loc.avgPriceSqft}</p>
              </div>
              <div className="bg-cream rounded-xl p-4">
                <p className="section-overline text-gold mb-1">Popular Types</p>
                <p className="text-navy text-sm">{loc.popularTypes.slice(0, 2).join(", ")}</p>
              </div>
              <div className="bg-cream rounded-xl p-4">
                <p className="section-overline text-gold mb-1">Top Builders</p>
                <p className="text-navy text-sm">{loc.topBuilders.slice(0, 2).join(", ")}</p>
              </div>
            </section>

            {/* Properties */}
            {areaProps.length > 0 ? (
              <section>
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  Properties in {loc.area}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {areaProps.slice(0, 6).map((p, i) => (
                    <PropertyCard key={p.id} property={p} imagePriority={i < 2} />
                  ))}
                </div>
              </section>
            ) : (
              <section>
                <h2 className="font-heading text-2xl text-navy font-normal mb-4">
                  Properties in {loc.area}
                </h2>
                <div className="bg-cream rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    No listed projects yet — contact us for upcoming launches in {loc.area}.
                  </p>
                  <Link href="/contact-us" className="text-gold text-sm hover:underline">
                    Enquire about {loc.area} →
                  </Link>
                </div>
              </section>
            )}

            {/* Connectivity */}
            <section className="bg-cream rounded-2xl p-6">
              <h2 className="font-heading text-xl text-navy font-normal mb-4">
                Connectivity &amp; Infrastructure
              </h2>
              <ul className="space-y-2">
                {loc.connectivity.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="text-gold mt-0.5 shrink-0">→</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            {/* Nearby areas */}
            <section>
              <h2 className="font-heading text-xl text-navy font-normal mb-4">
                Nearby Localities
              </h2>
              <div className="flex flex-wrap gap-3">
                {nearbyLocations.map((n) => (
                  <Link
                    key={n.areaSlug}
                    href={`/real-estate/${city}/${n.areaSlug}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy/70 hover:border-gold hover:text-gold transition-all"
                  >
                    {n.area} →
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                FAQs — {loc.area} Real Estate
              </h2>
              <FaqAccordion items={loc.faq} />
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <InstantCallbackForm city={`${loc.area}, ${cityLabel}`} />
              <div className="bg-navy rounded-2xl p-5">
                <p className="section-overline text-gold mb-3">Explore {cityLabel}</p>
                <ul className="space-y-2">
                  <li>
                    <Link href={`/real-estate/${city}`} className="text-white/60 hover:text-gold text-sm transition-colors">
                      All {cityLabel} Localities →
                    </Link>
                  </li>
                  <li>
                    <Link href={`/projects/ongoing/${city}`} className="text-white/60 hover:text-gold text-sm transition-colors">
                      Ongoing Projects →
                    </Link>
                  </li>
                  {loc.topBuilders.slice(0, 2).map((b) => (
                    <li key={b}>
                      <Link
                        href={`/developers/${b.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-white/60 hover:text-gold text-sm transition-colors"
                      >
                        {b} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
