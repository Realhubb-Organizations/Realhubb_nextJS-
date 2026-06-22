import Link from "next/link";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

interface Props {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: Props) {
  if (!properties.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="page-padding">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-overline text-gold mb-2">Handpicked for You</p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/projects/ongoing"
            className="hidden md:block text-sm text-navy/60 hover:text-gold transition-colors border-b border-navy/20 hover:border-gold pb-0.5"
          >
            View All Properties →
          </Link>
        </div>

        <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((p) => (
            <RevealCard key={p.id}>
              <PropertyCard property={p} />
            </RevealCard>
          ))}
        </RevealGrid>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/projects/ongoing"
            className="inline-block bg-navy text-white px-8 py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
