import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { locationMetadata } from "@/lib/seo";
import { breadcrumbSchema, localBusinessSchema, itemListSchema } from "@/lib/structuredData";
import { getLocationsByCity } from "@/data/locations";
import { getPropertiesByCity, getAllProperties } from "@/lib/firestoreServerService";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { properties as staticProperties } from "@/data/properties";
import PropertyCard from "@/components/property/PropertyCard";
import InstantCallbackForm from "@/components/lead/InstantCallbackForm";

type Params = Promise<{ city: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";
const cityLabels: Record<string, string> = {
  bangalore: "Bangalore",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  return locationMetadata(city);
}

export async function generateStaticParams() {
  return ["bangalore", "hyderabad", "chennai"].map((city) => ({ city }));
}

export const dynamic = "force-dynamic";

export default async function CityHubPage({ params }: { params: Params }) {
  const { city } = await params;
  const cityLabel = cityLabels[city] ?? city;
  const areaLocations = getLocationsByCity(city);

  const cityProps = await getPropertiesByCity(city).catch(() => []);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Real Estate", url: `${SITE_URL}/projects/ongoing` },
    { name: cityLabel, url: `${SITE_URL}/real-estate/${city}` },
  ];

  const areaListSchema = itemListSchema(
    areaLocations.map((loc) => ({
      name: `${loc.area}, ${cityLabel}`,
      url: `${SITE_URL}/real-estate/${city}/${loc.areaSlug}`,
      description: loc.avgPriceSqft,
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema(cityLabel)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(areaListSchema) }} />

      <div className="pt-20 bg-cream min-h-screen">
        {/* Hero */}
        <div className="bg-navy pt-20 pb-24 md:pt-24 md:pb-28 page-padding relative overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
              alt={cityLabel}
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
              Properties in <span className="text-gold">{cityLabel}</span> 2026
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl font-light mt-3 animate-fadeIn">
              Explore verified flats, apartments & villas in {cityLabel}. RERA registered
              projects from top builders. Free site visit. Zero brokerage.
            </p>
          </div>
        </div>

        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Area grid */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Top Localities in {cityLabel}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {areaLocations.map((loc) => (
                  <Link
                    key={loc.areaSlug}
                    href={`/real-estate/${city}/${loc.areaSlug}`}
                    className="group bg-cream/35 border border-gray-150/80 rounded-2xl p-5 hover:border-gold hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="font-heading text-navy text-sm font-normal group-hover:text-gold transition-colors">
                        {loc.area}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs pl-5 font-light">{loc.avgPriceSqft}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Properties */}
            {cityProps.length > 0 && (
              <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  Properties in {cityLabel}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cityProps.slice(0, 6).map((p, i) => (
                    <PropertyCard key={p.id} property={p} imagePriority={i < 2} />
                  ))}
                </div>
                {cityProps.length > 6 && (
                  <div className="mt-8 text-center">
                    <Link
                      href={`/projects/ongoing/${city}`}
                      className="inline-block bg-navy text-gold hover:text-white px-8 py-3.5 rounded-xl text-xs font-normal uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02]"
                    >
                      View All {cityLabel} Projects →
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Why invest section */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Why Invest in {cityLabel} Real Estate?
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {city === "bangalore" && (
                  <>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>India's IT capital with 2 million+ tech professionals driving housing demand</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Metro Phase 2 & 3 expansion unlocking new growth corridors</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>10–15% average annual appreciation in premium micro-markets</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Strong rental demand: 3.5–5% annual yields across IT corridors</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>RERA Karnataka strictly enforced — one of India's safest markets</span>
                    </li>
                  </>
                )}
                {city === "hyderabad" && (
                  <>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>No property tax for first 5 years in many new developments</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>20–25% lower property prices than Bangalore for comparable products</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>ORR development driving massive appreciation in western suburbs</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>HITEC City's global tech hub status guaranteeing employment stability</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Government pro-growth policies under TS-iPass investment framework</span>
                    </li>
                  </>
                )}
                {city === "chennai" && (
                  <>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Manufacturing & IT hub with MNCs like Ford, Nokia, Samsung driving demand</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>OMR IT corridor housing 500+ companies with 200,000+ employees</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Stable market with 8–10% annual appreciation over last 5 years</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Metro Phase 2 expansion significantly improving city connectivity</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                      <span>Coastal premium locations offering unique lifestyle + investment value</span>
                    </li>
                  </>
                )}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <InstantCallbackForm city={cityLabel} />
              <div className="bg-[#00274D] border border-gold/30 rounded-3xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                <p className="font-heading text-lg text-gold font-normal mb-4 relative z-10">Quick Links</p>
                <ul className="space-y-3 relative z-10">
                  <li>
                    <Link
                      href={`/projects/ongoing/${city}`}
                      className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                    >
                      <span>Ongoing Projects</span>
                      <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/projects/upcoming/${city}`}
                      className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                    >
                      <span>Upcoming Projects</span>
                      <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                  {city === "bangalore" && (
                    <>
                      <li>
                        <Link
                          href="/buy/2bhk-flats-bangalore"
                          className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                        >
                          <span>2BHK Flats</span>
                          <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/buy/3bhk-flats-bangalore"
                          className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                        >
                          <span>3BHK Flats</span>
                          <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/buy/luxury-apartments-bangalore"
                          className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                        >
                          <span>Luxury Apartments</span>
                          <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
