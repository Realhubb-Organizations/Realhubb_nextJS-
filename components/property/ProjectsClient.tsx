"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import type { Property, PropertyType } from "@/types/property";
import { cn } from "@/lib/utils";

const cityTabs = [
  { label: "All Cities", value: "all" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Chennai", value: "chennai" },
];

const typeTabs = [
  { label: "Ongoing", value: "ongoing" },
  { label: "Upcoming", value: "upcoming" },
];

const priceRanges = [
  { label: "Any Price", value: "" },
  { label: "Under ₹50L", value: "0-5000000" },
  { label: "₹50L–₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr–₹2Cr", value: "10000000-20000000" },
  { label: "₹2Cr+", value: "20000000-999999999" },
];

const propTypes = [
  { label: "All Types", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
];

interface Props {
  allProperties: Property[];
  initialCity: string;
  initialType: "ongoing" | "upcoming";
  initialFilterType?: string;
  initialPriceRange?: string;
  initialSearch?: string;
}

export default function ProjectsClient({
  allProperties,
  initialCity,
  initialType,
  initialFilterType = "",
  initialPriceRange = "",
  initialSearch = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeType, setActiveType] = useState(initialType);
  const [activeCity, setActiveCity] = useState(initialCity);
  const [filterType, setFilterType] = useState(initialFilterType);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  const navigateTo = useCallback(
    (type: string, city: string) => {
      const base = `/projects/${type}/${city}`;
      router.push(base);
    },
    [router]
  );

  const filtered = useMemo(() => {
    let list = allProperties.filter((p) => p.projectType === activeType);

    if (activeCity !== "all") {
      list = list.filter((p) => p.city === activeCity);
    }
    if (filterType) {
      list = list.filter((p) => p.type === (filterType as PropertyType));
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      list = list.filter((p) => p.priceValue >= min && p.priceValue <= max);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.developer.toLowerCase().includes(q)
      );
    }

    // Featured first
    return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [allProperties, activeType, activeCity, filterType, priceRange, search]);

  function handleTypeChange(t: string) {
    setActiveType(t as "ongoing" | "upcoming");
    navigateTo(t, activeCity);
  }

  function handleCityChange(c: string) {
    setActiveCity(c);
    navigateTo(activeType, c);
  }

  function clearFilters() {
    setFilterType("");
    setPriceRange("");
    setSearch("");
  }

  const hasActiveFilters = filterType || priceRange || search;

  return (
    <div className="bg-cream min-h-screen pb-24">
      <div className="page-padding relative z-20 -mt-12 md:-mt-16">
        {/* Floating Controls Bar */}
        <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-6">

          {/* Top Row: Selectors and Search */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">

            {/* Left side: Type controls (Ongoing/Upcoming sliding switcher) */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl self-start">
              {typeTabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleTypeChange(t.value)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                    activeType === t.value
                      ? "bg-navy text-white shadow-sm"
                      : "text-navy/60 hover:text-navy"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Center: Search input */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project, location or developer…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl pl-11 pr-4 py-3 text-sm text-navy focus:outline-none transition-all"
              />
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer shadow-sm",
                  showFilters
                    ? "bg-navy text-white border-navy"
                    : "bg-white border-gray-200 text-navy/60 hover:border-gold hover:text-navy"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-100 bg-red-50/50 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold font-medium mb-3">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {propTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setFilterType(t.value)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-normal border transition-all cursor-pointer",
                        filterType === t.value
                          ? "bg-navy text-white border-navy shadow-sm"
                          : "bg-white border-gray-200 text-navy/60 hover:border-navy hover:text-navy"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold font-medium mb-3">Budget Range</label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setPriceRange(r.value)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-normal border transition-all cursor-pointer",
                        priceRange === r.value
                          ? "bg-gold text-navy border-gold shadow-sm"
                          : "bg-white border-gray-200 text-navy/60 hover:border-gold hover:text-navy"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Row: City Navigation tabs (Sleek text link style) */}
          <div className="pt-5 border-t border-gray-100 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Select City:</span>
            <div className="flex flex-wrap gap-6">
              {cityTabs.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleCityChange(c.value)}
                  className={cn(
                    "text-sm font-medium transition-all relative pb-1.5 cursor-pointer",
                    activeCity === c.value
                      ? "text-gold"
                      : "text-navy/60 hover:text-navy"
                  )}
                >
                  {c.label}
                  {activeCity === c.value && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results grid container */}
        <div className="max-w-7xl mx-auto mt-12">
          {/* Results count info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-navy/50 text-sm">
              Showing <span className="text-navy font-normal">{filtered.length}</span> {filtered.length === 1 ? "property" : "properties"} found in <span className="font-normal text-navy">{cityTabs.find(c => c.value === activeCity)?.label || activeCity}</span>
            </p>
          </div>

          {/* Grid of properties (cards are NOT modified) */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} property={p} imagePriority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-gray-100 rounded-3xl py-24 px-6 shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-heading text-xl text-navy font-normal mb-2">No Properties Found</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                We couldn't find any properties matching your current filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gold text-navy px-6 py-2.5 rounded-xl text-sm font-normal hover:bg-gold/90 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
