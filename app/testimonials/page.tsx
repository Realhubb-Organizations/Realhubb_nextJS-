"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/seo/SEO";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import {
  Star, Quote, ArrowRight, CheckCircle,
  MapPin, Home, Users, TrendingUp, ThumbsUp, Building2,
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
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} style={{ fill: s <= rating ? "#D7A764" : "transparent", color: s <= rating ? "#D7A764" : "#d1d5db", flexShrink: 0 }} />
    ))}
  </div>
);

const Avatar = ({ initials, color }: { initials: string; color: string }) => (
  <div
    className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-normal shrink-0"
    style={{ background: `${color}22`, border: `2px solid ${color}44`, color: color, letterSpacing: 0.5 }}
  >
    {initials}
  </div>
);

const ReviewCard = ({ r }: { r: (typeof REVIEWS)[0] }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col h-full relative overflow-hidden">
    {/* Gold top accent */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D7A764]" />

    {/* Stars + badges */}
    <div className="flex items-center justify-between mb-4 mt-1">
      <Stars rating={r.rating} />
      <div className="flex gap-2">
        {r.verified && (
          <span className="inline-flex items-center gap-1 text-[10px] font-normal text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
            <CheckCircle size={10} /> Verified
          </span>
        )}
        <span className="text-[10px] font-normal text-[#D7A764] bg-[#D7A764]/10 border border-[#D7A764]/20 rounded-full px-2.5 py-0.5">
          Google
        </span>
      </div>
    </div>

    {/* Quote */}
    <Quote size={18} className="text-[#D7A764] opacity-40 mb-3 shrink-0" />
    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5 italic">
      "{r.review}"
    </p>

    {/* Author */}
    <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
      <Avatar initials={r.avatar} color={r.avatarColor} />
      <div className="flex-1 min-w-0">
        <p className="font-normal text-[#00274D] text-sm">{r.name}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="shrink-0" />
          {r.city} · {r.role}
        </p>
      </div>
      <p className="text-[11px] text-gray-400 shrink-0">{r.date}</p>
    </div>
  </div>
);

const TestimonialsPage = () => {
  const [category, setCategory] = useState("all");
  const [city, setCity]         = useState("All Cities");

  const filtered = useMemo(() =>
    REVIEWS.filter((r) => {
      const catMatch  = category === "all" || r.category === category;
      const cityMatch = city === "All Cities" || r.city === city;
      return catMatch && cityMatch;
    }), [category, city]);

  const avgRating = (REVIEWS.reduce((a, b) => a + b.rating, 0) / REVIEWS.length).toFixed(1);
  const fiveStars = REVIEWS.filter((r) => r.rating === 5).length;
  const fivePct   = Math.round((fiveStars / REVIEWS.length) * 100);

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RealHubb — Realhubb Ventures Private Limited",
    url: "https://www.realhubb.in",
    address: { "@type": "PostalAddress", streetAddress: "No.96/110, Markondaiah Layout, Thanisandra Village", addressLocality: "Bangalore North", addressRegion: "Karnataka", postalCode: "560064", addressCountry: "IN" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: avgRating, reviewCount: REVIEWS.length, bestRating: "5", worstRating: "1" },
    review: REVIEWS.map((r) => ({ "@type": "Review", author: { "@type": "Person", name: r.name }, reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" }, reviewBody: r.review, datePublished: r.date })),
  };

  return (
    <>
      <SEO
        title="Customer Reviews & Testimonials | RealHubb Real Estate Bangalore, Hyderabad & Chennai"
        description="Read verified Google reviews and testimonials from RealHubb customers across Bangalore, Hyderabad and Chennai. Real stories from home buyers, tenants and investors about their property journey with Realhubb Ventures Private Limited."
        keywords="RealHubb reviews, RealHubb testimonials, Realhubb Ventures reviews, real estate reviews Bangalore, property buyer reviews Hyderabad, RealHubb Google reviews, trusted real estate agent Bangalore, property consultant reviews Chennai, best real estate company Bangalore"
        canonical="https://www.realhubb.in/testimonials"
        image="https://www.realhubb.in/assets/realhubb%20trademark%20logo-DpR5IVGg.png"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      <div className="min-h-screen bg-[#faf6f1]">

        {/* ── HERO ── */}
        <section className="pt-32 pb-20 bg-[#00274D]">
          <div className="px-8 md:px-14 lg:px-20 xl:px-28">
            <FadeInOnScroll direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D7A764]/10 border border-[#D7A764]/20 text-[#D7A764] text-xs font-normal mb-5">
                <Star size={13} style={{ fill: "#D7A764", color: "#D7A764" }} />
                Verified Google Reviews
              </div>
              <h1 className="text-4xl md:text-[52px] font-normal text-white leading-tight mb-4 max-w-3xl">
                What our customers say about{" "}
                <span className="text-[#D7A764]">RealHubb.</span>
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-10">
                Genuine reviews from verified home buyers, investors, and tenants — no paid reviews, no fabricated stories.
              </p>

              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
                {[
                  { top: avgRating, mid: "Average Rating", sub: "out of 5.0 stars",           icon: <Star size={16} style={{ fill: "#D7A764", color: "#D7A764" }} /> },
                  { top: `${REVIEWS.length}+`, mid: "Verified Reviews", sub: "on Google",     icon: <ThumbsUp size={16} className="text-[#D7A764]" /> },
                  { top: `${fivePct}%`, mid: "5-Star Reviews", sub: `${fiveStars} of ${REVIEWS.length} total`, icon: <CheckCircle size={16} className="text-green-400" /> },
                  { top: "3", mid: "Cities Served", sub: "BLR · HYD · CHN",                  icon: <MapPin size={16} className="text-[#D7A764]" /> },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">{s.icon}</div>
                    <p className="text-2xl font-normal text-white leading-none">{s.top}</p>
                    <p className="text-xs font-normal text-white/70 mt-1.5">{s.mid}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── WHY TRUST ── */}
        <section className="py-16 bg-[#faf6f1]">
          <div className="px-8 md:px-14 lg:px-20 xl:px-28">
            <FadeInOnScroll direction="up">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
                <p className="text-[#D7A764] text-[10px] tracking-[0.28em] uppercase font-normal mb-3">
                  Our Story
                </p>
                <h2 className="text-2xl font-normal text-[#00274D] mb-6">
                  Why customers across India trust <span className="text-[#D7A764]">RealHubb</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-500 text-sm leading-relaxed">
                  <p>
                    <strong className="text-[#00274D]">Realhubb Ventures Private Limited</strong> is a
                    RERA-compliant real estate advisory firm based in Bangalore, helping
                    property buyers, investors, and tenants find verified homes across
                    Bangalore, Hyderabad, and Chennai. Founded by seasoned real estate
                    professionals with over 17 years of combined industry experience, the
                    company focuses on transparency, buyer education, and honest advisory.
                  </p>
                  <p>
                    Unlike traditional brokers, RealHubb acts as a{" "}
                    <strong className="text-[#00274D]">trusted channel partner</strong> — meaning
                    buyers pay zero brokerage while receiving expert guidance, legal
                    documentation support, and personalised site visits. RealHubb maintains a consistent{" "}
                    <strong className="text-[#D7A764]">4.8+ star rating</strong> on Google Reviews.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── FILTERS ── */}
        <section className="pb-6 bg-[#faf6f1]">
          <div className="px-8 md:px-14 lg:px-20 xl:px-28">
            <FadeInOnScroll direction="up">
              <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c.key} type="button" onClick={() => setCategory(c.key)} aria-pressed={category === c.key}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        category === c.key
                          ? "bg-[#00274D] text-white border-[#00274D]"
                          : "bg-white border-gray-200 text-gray-500 hover:border-[#D7A764]/50 hover:text-[#D7A764]"
                      }`}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 md:ml-auto">
                  {CITIES.map((c) => (
                    <button key={c} type="button" onClick={() => setCity(c)} aria-pressed={city === c}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        city === c
                          ? "bg-[#00274D] text-white border-[#00274D]"
                          : "bg-white border-gray-200 text-gray-500 hover:border-[#D7A764]/50 hover:text-[#D7A764]"
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-8">
                Showing <span className="font-normal text-[#00274D]">{filtered.length}</span>{" "}
                review{filtered.length !== 1 ? "s" : ""}
                {category !== "all" && <> in <span className="font-normal text-[#D7A764] capitalize">{category}</span></>}
                {city !== "All Cities" && <> from <span className="font-normal text-[#D7A764]">{city}</span></>}
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── REVIEWS GRID ── */}
        <section className="pb-20 bg-[#faf6f1]">
          <div className="px-8 md:px-14 lg:px-20 xl:px-28">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((review, index) => (
                  <FadeInOnScroll key={review.id} delay={index * 55} direction="up">
                    <ReviewCard r={review} />
                  </FadeInOnScroll>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Star className="h-10 w-10 text-[#D7A764]" style={{ fill: "none" }} />
                </div>
                <h3 className="text-xl font-normal text-[#00274D] mb-2">No Reviews Found</h3>
                <p className="text-gray-400 text-sm mb-4">Try a different filter combination.</p>
                <button
                  onClick={() => { setCategory("all"); setCity("All Cities") }}
                  className="px-6 py-2.5 rounded-full border border-[#D7A764] text-[#D7A764] text-sm font-normal hover:bg-[#D7A764] hover:text-[#00274D] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── WHY TRUST STRIP ── */}
        <section className="py-24 bg-[#00274D]">
          <div className="px-8 md:px-14 lg:px-20 xl:px-28">
            <FadeInOnScroll direction="up">
              <p className="text-[#D7A764] text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                The RealHubb Difference
              </p>
              <h2 className="text-3xl md:text-[40px] font-normal text-white leading-tight mb-10 text-center">
                Why customers keep <span className="text-[#D7A764]">coming back.</span>
              </h2>
            </FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: <CheckCircle className="h-5 w-5 text-[#D7A764]" />, title: "100% Verified & Transparent Reviews", desc: "Every review is from a genuine RealHubb customer. We display honest feedback — positive and constructive alike — because our reputation is built on truth." },
                { icon: <TrendingUp className="h-5 w-5 text-[#D7A764]" />, title: "Expert-Led Property Advisory", desc: "Our team brings over 17 years of combined real estate experience across Bangalore, Hyderabad, and Chennai." },
                { icon: <Home className="h-5 w-5 text-[#D7A764]" />, title: "Zero Brokerage. Full Support.", desc: "Buyers pay absolutely zero brokerage when purchasing through RealHubb. Our advice is always in your best interest." },
                { icon: <Users className="h-5 w-5 text-[#D7A764]" />, title: "NRI & Remote Buyer Friendly", desc: "RealHubb serves NRI buyers and remote investors with virtual site tours, end-to-end documentation handling, and cross-timezone availability." },
                { icon: <Building2 className="h-5 w-5 text-[#D7A764]" />, title: "Only RERA-Verified Projects", desc: "Every project recommended by RealHubb is RERA-registered. Legal due diligence is our default — not an optional add-on." },
                { icon: <Star className="h-5 w-5 text-[#D7A764]" style={{ fill: "none" }} />, title: "Consistent 4.8+ Google Rating", desc: "RealHubb maintains one of the highest customer satisfaction ratings among real estate advisory firms in South India." },
              ].map((item, i) => (
                <FadeInOnScroll key={i} delay={i * 60} direction="up">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors duration-200">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-white font-normal text-sm mb-2">{item.title}</h3>
                    <span className="block h-px w-8 bg-[#D7A764] mb-3" />
                    <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-[#faf6f1]">
          <div className="px-8 md:px-14 lg:px-20 xl:px-28">
            <FadeInOnScroll direction="up">
              <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                <p className="text-[#D7A764] text-[10px] tracking-[0.28em] uppercase font-normal mb-3">
                  Start Your Journey
                </p>
                <h2 className="text-2xl font-normal text-[#00274D] mb-3">
                  Ready to write your own <span className="text-[#D7A764]">RealHubb success story?</span>
                </h2>
                <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">
                  Join hundreds of satisfied home buyers, investors, and tenants across Bangalore, Hyderabad,
                  and Chennai who found their perfect property through RealHubb.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/projects/ongoing"
                    className="px-8 py-3 rounded-full bg-[#00274D] hover:bg-[#001d3d] text-white font-normal text-sm flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    Browse Verified Properties
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="px-8 py-3 rounded-full border border-[#D7A764] text-[#D7A764] hover:bg-[#D7A764] hover:text-[#00274D] font-normal text-sm text-center transition-colors duration-200"
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
