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
      const base =
        city === "all" ? `/projects/${type}` : `/projects/${type}/${city}`;
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
    <div className="page-padding py-10">
      {/* Type tabs */}
      <div className="flex gap-2 mb-6">
        {typeTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTypeChange(t.value)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-normal transition-all",
              activeType === t.value
                ? "bg-navy text-white shadow"
                : "bg-white border border-gray-200 text-navy/60 hover:bg-navy/5"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* City tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cityTabs.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCityChange(c.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-normal transition-all",
              activeCity === c.value
                ? "bg-gold text-navy shadow"
                : "bg-white border border-gray-200 text-navy/60 hover:bg-gold/10"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by project, location or developer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all",
            showFilters
              ? "bg-navy text-white border-navy"
              : "bg-white border-gray-200 text-navy/60 hover:border-navy"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFilterType(t.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-normal border transition-all",
                    filterType === t.value
                      ? "bg-navy text-white border-navy"
                      : "border-gray-200 text-navy/60 hover:border-navy"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2">Budget Range</label>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setPriceRange(r.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-normal border transition-all",
                    priceRange === r.value
                      ? "bg-gold text-navy border-gold"
                      : "border-gray-200 text-navy/60 hover:border-gold"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-gray-400 text-sm mb-6">
        {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} imagePriority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No properties match your filters.</p>
          <button onClick={clearFilters} className="text-gold text-sm hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
