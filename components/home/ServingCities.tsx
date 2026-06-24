"use client";

import Link from "next/link";
import Image from "next/image";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

const CITIES = [
  {
    name: "Bangalore",
    projectCount: "120+",
    description: "India's leading IT hub and fastest-growing real estate market.",
    image: "/real-estate-projects-bangalore.webp",
    alt: "Verified real estate projects and luxury flats in Bangalore",
    href: "/projects/ongoing/bangalore",
  },
  {
    name: "Hyderabad",
    projectCount: "110+",
    description: "Booming tech city with excellent investment potential.",
    image: "/verified-apartments-hyderabad.webp",
    alt: "Verified residential apartments and gated communities in Hyderabad",
    href: "/projects/ongoing/hyderabad",
  },
  {
    name: "Chennai",
    projectCount: "90+",
    description: "Known for beachfront living and a strong industrial base.",
    image: "/premium-villas-chennai.webp",
    alt: "Premium villas and beachfront residential projects in Chennai",
    href: "/projects/ongoing/chennai",
  },
];

export default function ServingCities() {
  return (
    <section className="py-20 bg-cream">
      <div className="page-padding">

        {/* Header section with rich SEO content */}
        <div className="text-center mb-16">
          <p className="section-overline text-gold mb-2">02 — Cities</p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
            Real Estate Services in Bangalore, Hyderabad, and Chennai
          </h2>
          <p className="text-gray-600 text-sm max-w-3xl mx-auto mt-4 leading-relaxed">
            RealHubb is a trusted real estate platform helping home buyers, investors, and tenants
            find verified RERA-approved properties in Bangalore, Hyderabad, and Chennai. Browse residential
            apartments, premium villas, and plotted developments across India's fastest-growing real estate
            markets. Each city listing is handpicked, legally verified, and backed by expert advisory — making
            your property search transparent and reliable.
          </p>
        </div>

        {/* 3-Column Grid of Cities */}
        <RevealGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CITIES.map((city) => (
            <RevealCard key={city.name} className="relative h-[380px] md:h-[430px] rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
              <Link href={city.href} className="block w-full h-full relative">
                {/* Background City Image */}
                <Image
                  src={city.image}
                  alt={city.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 z-10 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Content Container */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
                  {/* Top: Projects Badge */}
                  <span className="self-start bg-navy/80 border border-white/10 text-[#D7A764] rounded px-2.5 py-1 text-[10px] uppercase tracking-wider font-normal shadow-sm">
                    {city.projectCount} Projects
                  </span>

                  {/* Bottom: Title, Subtext, & CTA */}
                  <div>
                    <h3 className="text-white font-heading text-2xl font-normal group-hover:text-gold transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-white/90 text-xs mt-2 max-w-[260px] leading-relaxed">
                      {city.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-gold font-normal">
                      Browse Projects
                      <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealCard>
          ))}
        </RevealGrid>

      </div>
    </section>
  );
}
