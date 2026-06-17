"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/property/PropertyCard";

type CityTab = "all" | "bangalore" | "hyderabad" | "chennai";

const tabs: { label: string; value: CityTab }[] = [
  { label: "All Cities", value: "all" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Chennai", value: "chennai" },
];

export default function CitySection() {
  const [activeCity, setActiveCity] = useState<CityTab>("all");
  const { properties, loading } = useProperties();

  const filtered =
    activeCity === "all"
      ? properties.slice(0, 6)
      : properties.filter((p) => p.city === activeCity).slice(0, 6);

  const cityHref =
    activeCity === "all" ? "/projects/ongoing" : `/projects/ongoing/${activeCity}`;

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
              onClick={() => setActiveCity(tab.value)}
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -52 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
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
