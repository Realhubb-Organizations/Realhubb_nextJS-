import Link from "next/link";
import { MapPin } from "lucide-react";
import { locations } from "@/data/locations";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

export default function LocationLinks() {
  const bangaloreLocations = locations.filter((l) => l.city === "bangalore").slice(0, 9);

  return (
    <section className="py-20 bg-white">
      <div className="page-padding">
        <div className="text-center mb-10">
          <p className="section-overline text-gold-800 mb-2">Locality Guides</p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy font-semibold">
            Top Localities in Bangalore
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
            Explore property prices, connectivity, and investment outlook for every major locality.
          </p>
        </div>

        <RevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {bangaloreLocations.map((loc) => (
            <RevealCard key={loc.areaSlug}>
              <Link
                href={`/real-estate/${loc.city}/${loc.areaSlug}`}
                className="group bg-cream border border-gray-100 rounded-xl p-4 hover:border-gold hover:shadow-md transition-all block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span className="font-heading text-navy text-sm font-normal group-hover:text-gold transition-colors">
                    {loc.area}
                  </span>
                </div>
                <p className="text-slate-500 text-xs">{loc.avgPriceSqft}</p>
              </Link>
            </RevealCard>
          ))}
        </RevealGrid>

        <div className="mt-8 text-center">
          <Link
            href="/real-estate/bangalore"
            className="text-navy/75 text-sm hover:text-gold-800 transition-colors border-b border-navy/25 hover:border-gold-800"
          >
            Explore all Bangalore localities →
          </Link>
        </div>
      </div>
    </section>
  );
}
