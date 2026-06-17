"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Search, ChevronDown } from "lucide-react";

const VIDEO_SRC =
  "https://ik.imagekit.io/o72k8hn7h/realhubb%20/269354_large.mp4";

const POSTER_SRC =
  "https://ik.imagekit.io/o72k8hn7h/realhubb%20/269354_large.mp4/ik-thumbnail.jpg?tr=w-1280,q-60,f-webp";

const CITIES = ["Bangalore", "Hyderabad", "Chennai"];

const PROPERTY_TYPES = [
  { label: "Any Type",  value: ""          },
  { label: "Apartment", value: "apartment" },
  { label: "Villa",     value: "villa"     },
  { label: "Plot",      value: "plot"      },
];

const BUDGETS = [
  { label: "Any Budget",   value: ""                   },
  { label: "Under ₹50L",   value: "0-5000000"          },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000"   },
  { label: "₹1Cr – ₹2Cr", value: "10000000-20000000"  },
  { label: "₹2Cr – ₹5Cr", value: "20000000-50000000"  },
  { label: "Above ₹5Cr",   value: "50000000-999999999" },
];

const STATS = [
  { value: "1000+",   label: "Properties Sold"  },
  { value: "2000+", label: "Happy Clients"      },
  { value: "17+",    label: "Years Experience" },
  { value: "5000+",   label: "Expert Advisors"      },
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  const [city, setCity] = useState("Bangalore");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const router = useRouter();

  // Retrieve user reduced motion preference on mount to avoid Next.js hydration mismatches
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  // Lazy-load the video source when the hero section intersects the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const loadVideo = () => { if (!videoSrc) setVideoSrc(VIDEO_SRC); };
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { loadVideo(); observer.disconnect(); } },
      { threshold: 0.01 }
    );
    observer.observe(section);
    const raf = requestAnimationFrame(loadVideo);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [videoSrc]);

  // Autoplay/pause control based on video visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, [videoSrc]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("price", budget);
    const qs = params.toString();
    router.push(`/projects/ongoing/${city.toLowerCase()}${qs ? `?${qs}` : ""}`);
  };

  return (
    <>
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden="true"
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoLoaded ? 0 : 1, transition: "opacity 0.2s ease" }}
        />
        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={POSTER_SRC}
            width="1280"
            height="720"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover"
            style={{
              opacity: videoLoaded ? 0.55 : 0,
              filter: "brightness(0.7) saturate(0.9)",
              transition: "opacity 0.2s ease",
            }}
            onCanPlay={() => setVideoLoaded(true)}
          />
        )}
        {/* Dark navy overlay */}
        <div className="absolute inset-0 bg-[#00274D]/60" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 md:px-14 lg:px-20 xl:px-28 py-24 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid lg:grid-cols-[58%_42%] gap-8 lg:gap-10 items-center w-full">

          {/* ── Left column ── */}
          <div className="space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/20 rounded-full text-[#D7A764] text-[11px] tracking-[0.18em] uppercase font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7A764] shrink-0" />
               Trusted Real Estate Partner Across Major Indian Cities
            </div>

            {/* Headline */}
            <h1 className="text-[35px] md:text-[45px] xl:text-[56px] font-normal text-white leading-[1.08] tracking-tight">
              Find your <span className="text-[#D7A764]">Dream Home</span>
              <br />
              in India's Fast-Growing Cities
            </h1>

            {/* Subtitle */}
            <p className="text-white/65 text-[15px] max-w-[480px] leading-relaxed">
              Discover verified properties across Bangalore, Hyderabad, and Chennai. 
              Find RERA-compliant homes from trusted developers. Enjoy transparent buying 
              and renting support across cities with expert real estate guidance you can rely on. 
              Your trusted path to safe property.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/projects/ongoing"
                id="hero-cta-explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D7A764] hover:bg-[#c4954a] text-[#00274D] font-normal text-sm transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Explore Properties
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact-us"
                id="hero-cta-talk"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/35 text-[#D7A764] font-normal text-sm hover:bg-white/10 transition-all duration-200 hover:scale-105"
              >
                Talk to a Property Expert
              </Link>
            </div>
          </div>

          {/* ── Right column: search card ── */}
          <div className="flex lg:justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-5 w-full max-w-[310px]">
              {/* Card header */}
              <p className="text-[#D7A764] text-[10px] font-normal tracking-[0.2em] uppercase">
                01 — Quick Search
              </p>
              <h2 className="text-[#00274D] text-xl font-normal mb-5">
                Discover your dream home.
              </h2>

              {/* City */}
              <div className="mb-4">
                <label htmlFor="hero-city-select" className="block text-[9px] font-normal tracking-[0.18em] uppercase text-gray-400 mb-1.5">
                  City
                </label>
                <div className="relative flex items-center border-b border-gray-200 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D7A764] mr-2 shrink-0" />
                  <select
                    id="hero-city-select"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    suppressHydrationWarning={true}
                    className="w-full appearance-none bg-transparent text-[#00274D] font-medium text-sm focus:outline-none cursor-pointer pr-5"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-4">
                <label htmlFor="hero-type-select" className="block text-[9px] font-normal tracking-[0.18em] uppercase text-gray-400 mb-1.5">
                  Property Type
                </label>
                <div className="relative flex items-center border-b border-gray-200 pb-2">
                  <Search className="w-3.5 h-3.5 text-[#D7A764] mr-2 shrink-0" />
                  <select
                    id="hero-type-select"
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value)}
                    suppressHydrationWarning={true}
                    className="w-full appearance-none bg-transparent text-[#00274D] font-medium text-sm focus:outline-none cursor-pointer pr-5"
                  >
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Budget */}
              <div className="mb-5">
                <label htmlFor="hero-budget-select" className="block text-[9px] font-normal tracking-[0.18em] uppercase text-gray-400 mb-1.5">
                  Budget
                </label>
                <div className="relative flex items-center border-b border-gray-200 pb-2">
                  <select
                    id="hero-budget-select"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    suppressHydrationWarning={true}
                    className="w-full appearance-none bg-transparent text-[#00274D] font-medium text-sm focus:outline-none cursor-pointer pr-5"
                  >
                    {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>

              {/* Search button */}
              <button
                id="hero-search-button"
                onClick={handleSearch}
                suppressHydrationWarning={true}
                className="w-full py-3.5 rounded-full bg-[#D7A764] hover:bg-[#c4954a] text-[#00274D] font-normal text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] shadow-md cursor-pointer"
              >
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats Bar ── */}
    <section className="bg-[#00274D] py-12 px-8 md:px-10 lg:px-10 xl:px-28 border-t border-white/5">
      {/* BY THE NUMBERS label */}
      <div className="flex items-center justify-center gap-5 mb-2">
        <span className="h-px w-14 bg-[#D7A764]/50" />
        <p className="text-[#D7A764] text-[10px] tracking-[0.10em] uppercase font-medium">
          By the Numbers
        </p>
        <span className="h-px w-14 bg-[#D7A764]/50" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-y-0">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`relative px-6 lg:px-10 py-4 ${
              i < STATS.length - 1 ? "border-r border-[#D7A764]/15" : ""
            }`}
          >
            {/* Ordinal number */}
            <span className="absolute top-0 right-4 text-[11px] text-white/20 font-light tracking-wide">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Big stat value */}
            <div className="text-[36px] lg:text-[48px] xl:text-[56px] font-normal text-[#D7A764] leading-none tracking-tight">
              {stat.value}
            </div>

            {/* Label with leading dash */}
            <div className="flex items-center gap-2.5 mt-3">
              <span className="h-px w-5 bg-[#D7A764] shrink-0" />
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#D7A764]/75 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
