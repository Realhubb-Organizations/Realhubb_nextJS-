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

export const dynamic = "force-dynamic";

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

      <div className="pt-20 bg-cream min-h-screen">
        {/* Hero */}
        <div className="bg-navy pt-20 pb-24 md:pt-24 md:pb-28 page-padding relative overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
              alt={loc.area}
              className="w-full h-full object-cover opacity-40 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
          </div>

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <BreadcrumbNav items={breadcrumbs} dark />
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal mt-4 leading-tight animate-fadeIn">
              Flats & Properties in <span className="text-gold">{loc.area}</span>, {cityLabel}
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl font-light mt-3 animate-fadeIn">
              {loc.avgPriceSqft} · {loc.popularTypes.join(", ")}
            </p>
          </div>
        </div>

        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">

            {/* Intro */}
            <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-gray-500 text-sm leading-relaxed font-light">{loc.intro}</p>
            </div>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-150/80 rounded-2xl p-5 shadow-sm">
                <p className="section-overline text-gold mb-1">Avg Price</p>
                <p className="font-heading text-navy text-lg font-normal">{loc.avgPriceSqft}</p>
              </div>
              <div className="bg-white border border-gray-150/80 rounded-2xl p-5 shadow-sm">
                <p className="section-overline text-gold mb-1">Popular Types</p>
                <p className="text-navy text-sm font-light mt-0.5">{loc.popularTypes.slice(0, 2).join(", ")}</p>
              </div>
              <div className="bg-white border border-gray-150/80 rounded-2xl p-5 shadow-sm">
                <p className="section-overline text-gold mb-1">Top Builders</p>
                <p className="text-navy text-sm font-light mt-0.5">{loc.topBuilders.slice(0, 2).join(", ")}</p>
              </div>
            </section>

            {/* Properties */}
            {areaProps.length > 0 ? (
              <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
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
              <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-4">
                  Properties in {loc.area}
                </h2>
                <div className="bg-cream/40 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    No listed projects yet — contact us for upcoming launches in {loc.area}.
                  </p>
                  <Link href="/contact-us" className="text-gold text-sm hover:underline font-medium">
                    Enquire about {loc.area} →
                  </Link>
                </div>
              </section>
            )}

            {/* Connectivity */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Connectivity &amp; Infrastructure
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loc.connectivity.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Nearby areas */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Nearby Localities
              </h2>
              <div className="flex flex-wrap gap-3">
                {nearbyLocations.map((n) => (
                  <Link
                    key={n.areaSlug}
                    href={`/real-estate/${city}/${n.areaSlug}`}
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy/70 hover:border-gold hover:text-gold transition-all duration-300 shadow-sm"
                  >
                    {n.area} →
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
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
              <div className="bg-[#00274D] border border-gold/30 rounded-3xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                <p className="font-heading text-lg text-gold font-normal mb-4 relative z-10">Explore {cityLabel}</p>
                <ul className="space-y-3 relative z-10">
                  <li>
                    <Link
                      href={`/real-estate/${city}`}
                      className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                    >
                      <span>All {cityLabel} Localities</span>
                      <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/projects/ongoing/${city}`}
                      className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                    >
                      <span>Ongoing Projects</span>
                      <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                  {loc.topBuilders.slice(0, 2).map((b) => (
                    <li key={b}>
                      <Link
                        href={`/developers/${b.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                      >
                        <span>{b} Projects</span>
                        <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
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
