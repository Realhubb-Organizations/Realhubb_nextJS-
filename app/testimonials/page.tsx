"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/seo/SEO";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import { reviewSchema, webPageSchema } from "@/lib/structuredData";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";
import { cn } from "@/lib/utils";
import {
  Star, Quote, CheckCircle, MapPin, Home, Users, TrendingUp, ThumbsUp, Building2,
  ChevronDown, SlidersHorizontal, Search, X,
} from "lucide-react";

const REVIEWS = [
  { id: 1, name: "Krishnanand Kulkarni", role: "Home Buyer", city: "Bangalore", rating: 5, category: "buying", review: "I've worked with the Realhubb Team as both buyer and seller. Their unmatched professionalism, attention to detail, and local market knowledge provided invaluable insights. Whether buying or selling, choose Realhubb for a seamless, successful transaction. Highly recommended.", date: "2025", verified: true, avatar: "KK", avatarColor: "#3b82f6" },
  { id: 2, name: "Manisha Shah", role: "Tenant", city: "Bangalore", rating: 5, category: "rental", review: "Having relocated, I urgently needed a rental. Realhubb Team ensured a smooth process. They understood my budget and preferences, offering suitable options promptly. Thanks to their efficiency, I found my ideal rental within days. Grateful for their exceptional service, I wholeheartedly recommend Realhubb for top-notch rentals.", date: "2025", verified: true, avatar: "MS", avatarColor: "#8b5cf6" },
  { id: 3, name: "Praveen Srivastava", role: "First-Time Home Buyer", city: "Bangalore", rating: 5, category: "buying", review: "As a first-time homebuyer, I was nervous about the process. Yet, Realhubb Team made it positive and enjoyable. Their patience, understanding approach, along with thorough step-by-step explanations, eased my concerns and helped me close the deal with full confidence.", date: "2025", verified: true, avatar: "PS", avatarColor: "#10b981" },
  { id: 4, name: "Priya Venkataraman", role: "Commercial Buyer", city: "Bangalore", rating: 5, category: "commercial", review: "After months of searching for a commercial property, Realhubb Team delivered exactly what I needed. Their proactive, responsive specialists grasped my unique requirements. They secured a great location and negotiated favorable terms. Outstanding service from start to finish — highly satisfied.", date: "2024", verified: true, avatar: "PV", avatarColor: "#f59e0b" },
  { id: 5, name: "Suresh Babu", role: "Property Buyer", city: "Hyderabad", rating: 5, category: "buying", review: "As a first-time home buyer, I was nervous about the entire process. The RealHubb team in Hyderabad held my hand through every step — from shortlisting properties to loan documentation and registration. They never pushed me toward anything; instead, they focused on what was best for my family. Truly a trustworthy team.", date: "2024", verified: true, avatar: "SB", avatarColor: "#ef4444" },
  { id: 6, name: "Anitha Reddy", role: "Property Investor", city: "Hyderabad", rating: 5, category: "investment", review: "I was looking for a solid investment opportunity in Hyderabad and RealHubb helped me identify an excellent pre-launch project in Kokapet. Their market insight and understanding of growth corridors saved me a lot of time. The ROI on this investment has been very promising. Highly knowledgeable team.", date: "2024", verified: true, avatar: "AR", avatarColor: "#06b6d4" },
  { id: 7, name: "Mohammed Farhan", role: "Property Buyer", city: "Chennai", rating: 5, category: "buying", review: "RealHubb's Chennai team was exceptional in helping me find a RERA-approved apartment on OMR within my budget. They arranged multiple site visits, explained every clause in the agreement, and even helped me compare home loan options from different banks. The transparency throughout was refreshing.", date: "2024", verified: true, avatar: "MF", avatarColor: "#84cc16" },
  { id: 8, name: "Deepika Sharma", role: "Tenant", city: "Bangalore", rating: 5, category: "rental", review: "Moving to Bangalore for work was stressful enough, and RealHubb made finding a home the easiest part. They understood my requirements immediately — good locality, close to my office, within budget — and showed me relevant options only. Found a great 2BHK on Sarjapur Road within a week. Zero commission and complete transparency.", date: "2024", verified: true, avatar: "DS", avatarColor: "#ec4899" },
  { id: 9, name: "Venkat Ramaiah", role: "Property Buyer", city: "Bangalore", rating: 5, category: "buying", review: "RealHubb helped me purchase a villa at Devanahalli. The team did thorough due diligence on the RERA registration, builder track record, and site approvals before recommending it to me. That level of care and verification gave me complete confidence. Very professional and dedicated team.", date: "2024", verified: true, avatar: "VR", avatarColor: "#f97316" },
  { id: 10, name: "Lakshmi Prasad", role: "NRI Buyer", city: "Bangalore", rating: 5, category: "buying", review: "Being an NRI, buying property in India remotely is always challenging. RealHubb made the entire process seamless — from virtual site tours to handling all documentation on my behalf. They were available across time zones and kept me updated at every stage. I closed my apartment purchase without visiting India even once.", date: "2024", verified: true, avatar: "LP", avatarColor: "#6366f1" },
  { id: 11, name: "Kavitha Narayanan", role: "Property Buyer", city: "Chennai", rating: 4, category: "buying", review: "Good experience overall with RealHubb. They were very responsive and showed me multiple verified options in Sholinganallur before I zeroed in on the right one. The legal documentation support was thorough and the team was patient with all my questions. Would recommend them to anyone looking for property in Chennai.", date: "2024", verified: true, avatar: "KN", avatarColor: "#14b8a6" },
  { id: 12, name: "Arun Krishnaswamy", role: "Property Investor", city: "Bangalore", rating: 5, category: "investment", review: "I have bought three properties through different brokers over the years, but the experience with RealHubb was distinctly different. They were the first team that actually focused on my investment goals rather than just closing a deal. The advisory on Electronic City's growth potential was spot-on. Very impressed.", date: "2024", verified: true, avatar: "AK", avatarColor: "#f43f5e" },
];

const CATEGORIES = [
  { key: "all",        label: "All Reviews"  },
  { key: "buying",     label: "Home Buying"  },
  { key: "rental",     label: "Rental"       },
  { key: "investment", label: "Investment"   },
  { key: "commercial", label: "Commercial"   },
];

const CITIES = ["All Cities", "Bangalore", "Hyderabad", "Chennai"];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 shrink-0">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} style={{ fill: s <= rating ? "#D7A764" : "transparent", color: s <= rating ? "#D7A764" : "#d1d5db", flexShrink: 0 }} />
    ))}
  </div>
);

const Avatar = ({ initials, color }: { initials: string; color: string }) => (
  <div
    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-heading font-medium shrink-0 shadow-inner border"
    style={{ background: `${color}12`, borderColor: `${color}30`, color: color }}
  >
    {initials}
  </div>
);

const ReviewCard = ({ r }: { r: (typeof REVIEWS)[0] }) => (
  <div className="group flex flex-col h-full bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold/30 shadow-sm hover:shadow-lg transition-all">
    {/* Header: Stars & Badges */}
    <div className="flex items-center justify-between mb-4">
      <Stars rating={r.rating} />
      <div className="flex gap-2">
        {r.verified && (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-normal uppercase tracking-wider bg-green-50 text-green-700 border border-green-200/50">
            Verified
          </span>
        )}
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-normal uppercase tracking-wider bg-gold/5 text-gold border border-gold/20">
          Google
        </span>
      </div>
    </div>

    {/* Quote Icon & Content */}
    <div className="relative mb-5 flex-1 flex flex-col justify-start">
      <Quote size={20} className="text-gold/20 absolute -top-1.5 -left-1 pointer-events-none" />
      <p className="text-gray-500 font-body font-light text-sm leading-relaxed pl-5 italic">
        &ldquo;{r.review}&rdquo;
      </p>
    </div>

    {/* Author Info */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
      <div className="flex items-center gap-3">
        <Avatar initials={r.avatar} color={r.avatarColor} />
        <div>
          <h4 className="font-heading text-navy text-sm font-medium group-hover:text-gold transition-colors">
            {r.name}
          </h4>
          <p className="text-[10px] text-gray-400 font-body flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-gold/80" />
            <span>{r.city} · {r.role}</span>
          </p>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 font-body">{r.date}</span>
    </div>
  </div>
);

const TestimonialsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities]         = useState<string[]>([]);
  const [search, setSearch]                         = useState("");
  const [openDropdown, setOpenDropdown]             = useState<"category" | "city" | null>(null);

  // Calculate review counts per category dynamically
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // "all" counts matches city & search filter
    counts["all"] = REVIEWS.filter((r) => {
      const cityMatch = selectedCities.length === 0 || selectedCities.includes(r.city.toLowerCase());
      const textMatch = !search || 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.review.toLowerCase().includes(search.toLowerCase()) || 
        r.role.toLowerCase().includes(search.toLowerCase());
      return cityMatch && textMatch;
    }).length;

    CATEGORIES.filter((c) => c.key !== "all").forEach((c) => {
      counts[c.key] = REVIEWS.filter((r) => {
        const cityMatch = selectedCities.length === 0 || selectedCities.includes(r.city.toLowerCase());
        const textMatch = !search || 
          r.name.toLowerCase().includes(search.toLowerCase()) || 
          r.review.toLowerCase().includes(search.toLowerCase()) || 
          r.role.toLowerCase().includes(search.toLowerCase());
        const catMatch = r.category.toLowerCase() === c.key.toLowerCase();
        return cityMatch && textMatch && catMatch;
      }).length;
    });
    return counts;
  }, [selectedCities, search]);

  // Calculate review counts per city dynamically
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CITIES.filter((c) => c !== "All Cities").forEach((c) => {
      const key = c.toLowerCase();
      counts[key] = REVIEWS.filter((r) => {
        const catMatch = selectedCategories.length === 0 || selectedCategories.includes(r.category.toLowerCase());
        const textMatch = !search || 
          r.name.toLowerCase().includes(search.toLowerCase()) || 
          r.review.toLowerCase().includes(search.toLowerCase()) || 
          r.role.toLowerCase().includes(search.toLowerCase());
        const cityMatch = r.city.toLowerCase() === key;
        return catMatch && textMatch && cityMatch;
      }).length;
    });
    return counts;
  }, [selectedCategories, search]);

  const handleCategoryToggle = (catKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catKey)
        ? prev.filter((k) => k !== catKey)
        : [...prev, catKey]
    );
  };

  const handleCityToggle = (cityKey: string) => {
    setSelectedCities((prev) =>
      prev.includes(cityKey)
        ? prev.filter((k) => k !== cityKey)
        : [...prev, cityKey]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedCities([]);
    setSearch("");
  };

  const filtered = useMemo(() =>
    REVIEWS.filter((r) => {
      const catMatch = selectedCategories.length === 0 || selectedCategories.includes(r.category.toLowerCase());
      const cityMatch = selectedCities.length === 0 || selectedCities.includes(r.city.toLowerCase());
      const textMatch = !search || 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.review.toLowerCase().includes(search.toLowerCase()) || 
        r.role.toLowerCase().includes(search.toLowerCase());
      return catMatch && cityMatch && textMatch;
    }), [selectedCategories, selectedCities, search]);

  const avgRating = (REVIEWS.reduce((a, b) => a + b.rating, 0) / REVIEWS.length).toFixed(1);
  const fiveStars = REVIEWS.filter((r) => r.rating === 5).length;
  const fivePct   = Math.round((fiveStars / REVIEWS.length) * 100);

  const reviewsData = reviewSchema({
      ratingValue: avgRating,
      reviewCount: REVIEWS.length,
      reviews: REVIEWS.map((r) => ({
        name: r.name,
        rating: r.rating,
        review: r.review,
        date: r.date,
      })),
    });

    const webPage = {
      name: "Customer Reviews & Testimonials | RealHubb Real Estate Bangalore, Hyderabad & Chennai",
      description: "Read verified Google reviews and testimonials from RealHubb customers across Bangalore, Hyderabad and Chennai. Real stories from home buyers, tenants and investors about their property journey with Realhubb Ventures Private Limited.",
      url: "https://www.realhubb.in/testimonials",
      speakableSelectors: [".speakable-title", ".speakable-summary"],
    };

    return (
      <>
        <SEO
          title="Customer Reviews & Testimonials | RealHubb Real Estate"
          description="Read verified Google reviews & testimonials from RealHubb customers across Bangalore, Hyderabad & Chennai. Real home buyer and investor stories."
          keywords="RealHubb reviews, RealHubb testimonials, Google reviews Bangalore, trusted property consultant"
          canonical="https://www.realhubb.in/testimonials"
          image="https://www.realhubb.in/assets/realhubb%20trademark%20logo-DpR5IVGg.png"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(webPage)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsData) }} />

        <div className="min-h-screen bg-cream">

          {/* ── IMMERSIVE HEADER BANNER ── */}
          <section className="bg-navy pt-32 pb-28 md:pt-36 md:pb-36 page-padding relative overflow-hidden text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
                alt="Testimonials"
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-navy/20" />
            </div>

            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
              <FadeInOnScroll direction="up">
                <h1 className="speakable-title font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight animate-fadeIn">
                  Customer <span className="text-gold">Testimonials</span>
                </h1>
                <p className="speakable-summary text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mt-4 font-light animate-fadeIn">
                  Genuine reviews from verified home buyers, investors, and tenants — no paid reviews, no fabricated stories.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-white/60 text-xs md:text-sm font-light">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Verified Google Reviews
                  </span>
                  <span className="hidden md:inline text-white/30">•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    100% Honest Feedback
                  </span>
                  <span className="hidden md:inline text-white/30">•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Real Homebuyer Stories
                  </span>
                </div>
              </FadeInOnScroll>
            </div>
          </section>
        {/* ── FLOATING DASHBOARD & FILTERS BAR ── */}
        <div className="page-padding relative z-20 -mt-12 md:-mt-16">
          <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            
            {/* Top Row: Metric Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-gray-100">
              {[
                { value: avgRating, label: "Average Rating", sub: "out of 5.0 stars", icon: <Star size={16} className="text-[#D7A764]" style={{ fill: "#D7A764" }} /> },
                { value: `${REVIEWS.length}+`, label: "Verified Reviews", sub: "on Google", icon: <ThumbsUp size={16} className="text-[#D7A764]" /> },
                { value: `${fivePct}%`, label: "5-Star Reviews", sub: `${fiveStars} of ${REVIEWS.length} total`, icon: <CheckCircle size={16} className="text-green-500" /> },
                { value: "3", label: "Cities Served", sub: "BLR • HYD • CHN", icon: <MapPin size={16} className="text-[#D7A764]" /> },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center animate-fadeIn">
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    {stat.icon}
                    <span className="font-heading text-2xl font-normal text-navy">{stat.value}</span>
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-navy/70 font-semibold font-body">{stat.label}</span>
                  <span className="text-[9px] text-gray-400 font-body mt-0.5">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Bottom Row: Unified Premium Filter Suite */}
            <div className="flex flex-col gap-5">
              
              {/* Filter controls row */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
                
                {/* Search Box */}
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews by name, keyword or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl pl-11 pr-10 py-3 text-sm text-navy focus:outline-none transition-all"
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy cursor-pointer flex items-center justify-center p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdowns group */}
                <div className="flex flex-wrap items-center gap-3 relative">
                  
                  {/* Category Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer shadow-sm bg-white select-none",
                        selectedCategories.length > 0
                          ? "border-gold text-gold ring-1 ring-gold/20"
                          : "border-gray-200 text-navy/60 hover:border-gold hover:text-navy"
                      )}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>
                        {selectedCategories.length === 0
                          ? "All Reviews"
                          : `Categories (${selectedCategories.length})`}
                      </span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", openDropdown === "category" && "rotate-180")} />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === "category" && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
                        <div className="absolute right-0 md:left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-40 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                            <span className="text-[10px] font-bold text-navy/50 uppercase tracking-wider font-body">Select Categories</span>
                            {selectedCategories.length > 0 && (
                              <button
                                onClick={() => setSelectedCategories([])}
                                className="text-[10px] text-red-500 hover:text-red-700 font-semibold uppercase tracking-wider cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="space-y-1 max-h-60 overflow-y-auto py-1">
                            {CATEGORIES.filter(c => c.key !== "all").map((cat) => {
                              const isChecked = selectedCategories.includes(cat.key);
                              const count = categoryCounts[cat.key] ?? 0;
                              return (
                                <label
                                  key={cat.key}
                                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/70 cursor-pointer transition-colors select-none"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleCategoryToggle(cat.key)}
                                      className="accent-gold h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="text-xs font-semibold text-navy/80">{cat.label}</span>
                                  </div>
                                  <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-semibold font-body">{count}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* City Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "city" ? null : "city")}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer shadow-sm bg-white select-none",
                        selectedCities.length > 0
                          ? "border-gold text-gold ring-1 ring-gold/20"
                          : "border-gray-200 text-navy/60 hover:border-gold hover:text-navy"
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>
                        {selectedCities.length === 0
                          ? "All Cities"
                          : `Cities (${selectedCities.length})`}
                      </span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", openDropdown === "city" && "rotate-180")} />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === "city" && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-40 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                            <span className="text-[10px] font-bold text-navy/50 uppercase tracking-wider font-body">Select Cities</span>
                            {selectedCities.length > 0 && (
                              <button
                                onClick={() => setSelectedCities([])}
                                className="text-[10px] text-red-500 hover:text-red-700 font-semibold uppercase tracking-wider cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="space-y-1 max-h-60 overflow-y-auto py-1">
                            {CITIES.filter(c => c !== "All Cities").map((cityName) => {
                              const key = cityName.toLowerCase();
                              const isChecked = selectedCities.includes(key);
                              const count = cityCounts[key] ?? 0;
                              return (
                                <label
                                  key={cityName}
                                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/70 cursor-pointer transition-colors select-none"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleCityToggle(key)}
                                      className="accent-gold h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="text-xs font-semibold text-navy/80">{cityName}</span>
                                  </div>
                                  <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-semibold font-body">{count}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              </div>

              {/* Active filters pill row */}
              {(selectedCategories.length > 0 || selectedCities.length > 0 || search) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-50 animate-fadeIn">
                  <span className="text-[10px] tracking-wider uppercase text-navy/40 font-bold font-body mr-1">Filters:</span>
                  
                  {search && (
                    <span className="inline-flex items-center gap-1.5 bg-gold/5 text-gold border border-gold/20 px-3 py-1 rounded-full text-xs font-medium">
                      Search: "{search}"
                      <button onClick={() => setSearch("")} className="hover:text-navy cursor-pointer flex items-center">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map((catKey) => {
                    const label = CATEGORIES.find(c => c.key === catKey)?.label ?? catKey;
                    return (
                      <span key={catKey} className="inline-flex items-center gap-1.5 bg-navy/5 text-navy border border-navy/10 px-3 py-1 rounded-full text-xs font-medium">
                        {label}
                        <button onClick={() => handleCategoryToggle(catKey)} className="hover:text-gold cursor-pointer flex items-center">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}

                  {selectedCities.map((cityKey) => {
                    const label = CITIES.find(c => c.toLowerCase() === cityKey) ?? cityKey;
                    return (
                      <span key={cityKey} className="inline-flex items-center gap-1.5 bg-navy/5 text-navy border border-navy/10 px-3 py-1 rounded-full text-xs font-medium">
                        {label}
                        <button onClick={() => handleCityToggle(cityKey)} className="hover:text-gold cursor-pointer flex items-center">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}

                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold uppercase tracking-wider ml-2 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── REVIEWS GRID CONTAINER ── */}
        <section className="pb-20 pt-12 bg-cream page-padding">
          <div className="max-w-7xl mx-auto">
            
            {/* Results Header Count */}
            <div className="flex justify-between items-center mb-6 animate-fadeIn">
              <p className="text-navy/50 text-sm font-body font-light">
                Showing <span className="text-navy font-normal">{filtered.length}</span> verified customer review{filtered.length !== 1 ? "s" : ""}
                {selectedCategories.length > 0 && (
                  <> for <span className="font-normal text-navy">{selectedCategories.map(catKey => CATEGORIES.find(c => c.key === catKey)?.label).join(", ")}</span></>
                )}
                {selectedCities.length > 0 && (
                  <> in <span className="font-normal text-navy capitalize">{selectedCities.map(cityKey => CITIES.find(c => c.toLowerCase() === cityKey)).join(", ")}</span></>
                )}
              </p>
            </div>

            {filtered.length > 0 ? (
              <RevealGrid key={`${selectedCategories.join(",")}-${selectedCities.join(",")}-${search}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((review) => (
                  <RevealCard key={review.id}>
                    <ReviewCard r={review} />
                  </RevealCard>
                ))}
              </RevealGrid>
            ) : (
              <div className="text-center bg-white border border-gray-100 rounded-3xl py-20 px-6 shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-gold" style={{ fill: "none" }} />
                </div>
                <h3 className="font-heading text-xl text-navy font-normal mb-2">No Reviews Found</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                  We couldn't find any verified client reviews matching your current selection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-gold text-navy px-6 py-2.5 rounded-xl text-sm font-normal hover:bg-gold/90 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── WHY TRUST / STORY ── */}
        <section className="py-16 bg-cream page-padding">
          <div className="max-w-7xl mx-auto">
            <FadeInOnScroll direction="up">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
                <p className="text-[#D7A764] text-xs uppercase tracking-wider font-semibold font-body mb-2">
                  Our Story
                </p>
                <h2 className="font-heading text-2xl md:text-3xl text-navy font-normal mb-6">
                  Why customers across India trust <span className="text-gold">RealHubb</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-8 text-gray-500 text-sm md:text-base leading-relaxed font-body font-light">
                  <p>
                    <strong className="text-navy font-normal">Realhubb Ventures Private Limited</strong> is a
                    RERA-compliant real estate advisory firm based in Bangalore, helping
                    property buyers, investors, and tenants find verified homes across
                    Bangalore, Hyderabad, and Chennai. Founded by seasoned real estate
                    professionals with over 17 years of combined industry experience, the
                    company focuses on transparency, buyer education, and honest advisory.
                  </p>
                  <p>
                    Unlike traditional brokers, RealHubb acts as a{" "}
                    <strong className="text-navy font-normal">trusted channel partner</strong> — meaning
                    buyers pay zero brokerage while receiving expert guidance, legal
                    documentation support, and personalised site visits. RealHubb maintains a consistent{" "}
                    <strong className="text-gold font-normal">4.8+ star rating</strong> on Google Reviews.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── THE REALHUBB DIFFERENCE ── */}
        <section className="py-20 bg-cream page-padding">
          <div className="max-w-7xl mx-auto">
            <FadeInOnScroll direction="up">
              <p className="text-gold text-xs uppercase tracking-wider font-semibold font-body mb-2 text-center">
                The RealHubb Difference
              </p>
              <h2 className="font-heading text-3xl text-navy font-normal mb-12 text-center">
                Why customers keep <span className="text-gold">coming back.</span>
              </h2>
            </FadeInOnScroll>

            <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <CheckCircle className="h-5 w-5 text-gold" />, title: "100% Verified Reviews", desc: "Every review is from a genuine RealHubb customer. We display honest feedback — positive and constructive alike." },
                { icon: <TrendingUp className="h-5 w-5 text-gold" />, title: "Expert-Led Advisory", desc: "Our team brings over 17 years of combined real estate experience across Bangalore, Hyderabad, and Chennai." },
                { icon: <Home className="h-5 w-5 text-gold" />, title: "Zero Brokerage. Full Support.", desc: "Buyers pay absolutely zero brokerage when purchasing through RealHubb. Our advice is always in your best interest." },
                { icon: <Users className="h-5 w-5 text-gold" />, title: "NRI & Remote Buyer Friendly", desc: "RealHubb serves NRI buyers and remote investors with virtual site tours, end-to-end documentation handling." },
                { icon: <Building2 className="h-5 w-5 text-gold" />, title: "Only RERA-Verified Projects", desc: "Every project recommended by RealHubb is RERA-registered. Legal due diligence is our default." },
                { icon: <Star className="h-5 w-5 text-gold" style={{ fill: "none" }} />, title: "4.8+ Google Rating", desc: "RealHubb maintains one of the highest customer satisfaction ratings among real estate advisory firms." },
              ].map((item, i) => (
                <RevealCard key={i}>
                  <div className="h-full bg-white border border-gray-100 rounded-2xl p-6 md:p-8 hover:border-gold/30 hover:shadow-lg transition-all flex flex-col group">
                    <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-navy font-heading font-medium text-base mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
                    <span className="block h-px w-8 bg-gold mb-4" />
                    <p className="text-gray-500 font-body font-light text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </RevealCard>
              ))}
            </RevealGrid>
          </div>
        </section>

        {/* ── CALL TO ACTION ── */}
        <section className="py-20 bg-cream page-padding">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll direction="up">
              <div className="bg-white border border-gray-100 rounded-3xl p-10 md:p-16 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
                <p className="text-gold text-xs uppercase tracking-wider font-semibold font-body mb-2">
                  Start Your Journey
                </p>
                <h2 className="font-heading text-2xl md:text-3xl text-navy font-normal mb-3">
                  Ready to write your own <span className="text-gold">RealHubb success story?</span>
                </h2>
                <p className="text-gray-500 font-body font-light text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
                  Join hundreds of satisfied home buyers, investors, and tenants across Bangalore, Hyderabad,
                  and Chennai who found their perfect property through RealHubb.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/projects/ongoing"
                    className="px-8 py-3.5 rounded-full bg-navy hover:bg-navy/95 text-white font-body font-medium text-xs tracking-wider uppercase shadow-md transition-all duration-200 cursor-pointer text-center"
                  >
                    Browse Verified Properties
                  </Link>
                  <Link
                    href="/contact-us"
                    className="px-8 py-3.5 rounded-full border border-gold text-gold hover:bg-gold hover:text-navy font-body font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer text-center"
                  >
                    Talk to an Expert
                  </Link>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

      </div>
    </>
  );
};

export default TestimonialsPage;
