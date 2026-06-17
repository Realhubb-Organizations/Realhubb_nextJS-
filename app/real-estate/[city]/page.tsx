import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { locationMetadata } from "@/lib/seo";
import { breadcrumbSchema, localBusinessSchema, itemListSchema } from "@/lib/structuredData";
import { getLocationsByCity } from "@/data/locations";
import { getPropertiesByCity, getAllProperties } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
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

export const revalidate = 3600;

export default async function CityHubPage({ params }: { params: Params }) {
  const { city } = await params;
  const cityLabel = cityLabels[city] ?? city;
  const areaLocations = getLocationsByCity(city);

  const firestoreProps = await getPropertiesByCity(city).catch(() => []);
  const cityProps = firestoreProps.length > 0
    ? firestoreProps
    : staticProperties.filter((p) => p.city === city);

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

      <div className="pt-20">
        {/* Hero */}
        <div className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4">
            Properties in {cityLabel} 2026
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-xl">
            Explore verified flats, apartments & villas in {cityLabel}. RERA registered
            projects from top builders. Free site visit. Zero brokerage.
          </p>
        </div>

        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Area grid */}
            <section>
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Top Localities in {cityLabel}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {areaLocations.map((loc) => (
                  <Link
                    key={loc.areaSlug}
                    href={`/real-estate/${city}/${loc.areaSlug}`}
                    className="group bg-cream border border-gray-100 rounded-xl p-4 hover:border-gold hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="font-heading text-navy text-sm font-normal group-hover:text-gold transition-colors">
                        {loc.area}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs pl-5">{loc.avgPriceSqft}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Properties */}
            {cityProps.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  Properties in {cityLabel}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cityProps.slice(0, 6).map((p, i) => (
                    <PropertyCard key={p.id} property={p} imagePriority={i < 2} />
                  ))}
                </div>
                {cityProps.length > 6 && (
                  <div className="mt-6 text-center">
                    <Link
                      href={`/projects/ongoing/${city}`}
                      className="inline-block bg-navy text-white px-8 py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors"
                    >
                      View All {cityLabel} Projects →
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Why invest section */}
            <section className="bg-cream rounded-2xl p-6">
              <h2 className="font-heading text-xl text-navy font-normal mb-4">
                Why Invest in {cityLabel} Real Estate?
              </h2>
              <ul className="space-y-2 text-sm text-gray-500">
                {city === "bangalore" && (
                  <>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> India's IT capital with 2 million+ tech professionals driving housing demand</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Metro Phase 2 & 3 expansion unlocking new growth corridors</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> 10–15% average annual appreciation in premium micro-markets</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Strong rental demand: 3.5–5% annual yields across IT corridors</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> RERA Karnataka strictly enforced — one of India's safest markets</li>
                  </>
                )}
                {city === "hyderabad" && (
                  <>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> No property tax for first 5 years in many new developments</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> 20–25% lower property prices than Bangalore for comparable products</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> ORR development driving massive appreciation in western suburbs</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> HITEC City's global tech hub status guaranteeing employment stability</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Government pro-growth policies under TS-iPass investment framework</li>
                  </>
                )}
                {city === "chennai" && (
                  <>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Manufacturing & IT hub with MNCs like Ford, Nokia, Samsung driving demand</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> OMR IT corridor housing 500+ companies with 200,000+ employees</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Stable market with 8–10% annual appreciation over last 5 years</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Metro Phase 2 expansion significantly improving city connectivity</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Coastal premium locations offering unique lifestyle + investment value</li>
                  </>
                )}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24">
              <InstantCallbackForm city={cityLabel} />
              <div className="mt-4 bg-navy rounded-2xl p-5">
                <p className="section-overline text-gold mb-3">Quick Links</p>
                <ul className="space-y-2">
                  <li><Link href={`/projects/ongoing/${city}`} className="text-white/60 hover:text-gold text-sm transition-colors">Ongoing Projects →</Link></li>
                  <li><Link href={`/projects/upcoming/${city}`} className="text-white/60 hover:text-gold text-sm transition-colors">Upcoming Projects →</Link></li>
                  {city === "bangalore" && (
                    <>
                      <li><Link href="/buy/2bhk-flats-bangalore" className="text-white/60 hover:text-gold text-sm transition-colors">2BHK Flats →</Link></li>
                      <li><Link href="/buy/3bhk-flats-bangalore" className="text-white/60 hover:text-gold text-sm transition-colors">3BHK Flats →</Link></li>
                      <li><Link href="/buy/luxury-apartments-bangalore" className="text-white/60 hover:text-gold text-sm transition-colors">Luxury Apartments →</Link></li>
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
