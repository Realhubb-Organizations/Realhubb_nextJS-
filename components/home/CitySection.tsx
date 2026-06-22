"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";

type CityTab = "all" | "bangalore" | "hyderabad" | "chennai";

const tabs: { label: string; value: CityTab }[] = [
  { label: "All Cities", value: "all" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Chennai", value: "chennai" },
];

interface Props {
  properties: Property[];
}

export default function CitySection({ properties }: Props) {
  const [activeCity, setActiveCity] = useState<CityTab>("all");
  const [animKey, setAnimKey] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCity === "all"
      ? properties.slice(0, 6)
      : properties.filter((p) => p.city === activeCity).slice(0, 6);

  const cityHref =
    activeCity === "all" ? "/projects/ongoing" : `/projects/ongoing/${activeCity}`;

  const handleTabChange = (value: CityTab) => {
    setActiveCity(value);
    setAnimKey((k) => k + 1);
  };

  const isInitialMount = useRef(true);

  // Trigger stagger animation on grid children when animKey changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.children) as HTMLElement[];
    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateX(-30px)";
      card.style.transition = "none";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.transition = `opacity 0.4s ease ${i * 70}ms, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`;
          card.style.opacity = "1";
          card.style.transform = "none";
        });
      });
    });
  }, [animKey]);

  return (
    <section className="py-20 bg-cream">
      <div className="page-padding">
        <div className="text-center mb-10">
          <p className="section-overline text-gold mb-2">Explore by Location</p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
            Properties by City
          </h2>
        </div>

        {/* City tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              suppressHydrationWarning={true}
              className={`px-5 py-2 rounded-full text-sm font-normal transition-all ${
                activeCity === tab.value
                  ? "bg-navy text-white shadow-md"
                  : "bg-white text-navy/60 hover:bg-navy/5 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Property grid */}
        {filtered.length ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((p) => (
              <div key={p.id}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">No properties found in this city yet.</p>
        )}

        <div className="mt-10 text-center">
          <Link
            href={cityHref}
            className="inline-block bg-navy text-white px-8 py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors"
          >
            View All {activeCity === "all" ? "" : tabs.find((t) => t.value === activeCity)?.label}{" "}
            Properties →
          </Link>
        </div>
      </div>
    </section>
  );
}
