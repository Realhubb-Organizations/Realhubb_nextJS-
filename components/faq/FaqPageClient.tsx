"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Phone, HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import FaqSection from "@/components/faq/FaqSection";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import { company } from "@/data/company";
import type { BreadcrumbItem, FaqCategory } from "@/types/seo";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";

const WHATSAPP_MESSAGE = "Hi, I have a question about RealHubb's services.";

interface Props {
  categories: FaqCategory[];
  breadcrumbs: BreadcrumbItem[];
}

export default function FaqPageClient({ categories, breadcrumbs }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSectionId, setActiveSectionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentActiveId = activeCategory === "all" ? (activeSectionId || "all") : activeCategory;

  const totalQuestions = categories.reduce((acc, c) => acc + c.items.length, 0);

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const visibleCategories = searchQuery
    ? filteredCategories
    : activeCategory === "all"
      ? categories
      : categories.filter((c) => c.id === activeCategory);

  const totalResults = filteredCategories.reduce((acc, c) => acc + c.items.length, 0);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    if (id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useEffect(() => {
    if (searchQuery) return;
    const observers: IntersectionObserver[] = [];
    categories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSectionId(cat.id);
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [searchQuery, activeCategory, categories]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-navy overflow-hidden text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
            alt="RealHubb Help Center"
            className="w-full h-full object-cover opacity-45 filter brightness-95"
          />
          {/* Smooth linear top-to-bottom gradient overlay to maintain readability for centered text */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy" />
        </div>

        {/* Symmetrical branding glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="page-padding relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <BreadcrumbNav items={breadcrumbs} dark />
          <FadeInOnScroll direction="up" className="flex flex-col items-center text-center mt-6">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-normal px-3.5 py-1.5 rounded-full mb-5">
              <HelpCircle className="h-3.5 w-3.5" />
              Help Center
            </div>
            <h1 className="speakable-title text-4xl md:text-[56px] font-heading font-normal text-white leading-tight mb-6 animate-fadeIn">
              Frequently asked <span className="text-gold">questions.</span>
            </h1>
            <p className="speakable-summary text-white/60 text-base leading-relaxed max-w-xl mb-4 font-light animate-fadeIn">
              Everything you need to know about buying property, RERA compliance, home loans, and how RealHubb works.
            </p>
            <p className="text-white/40 text-xs tracking-wider uppercase font-light animate-fadeIn">
              <span className="text-white/70">{totalQuestions} answers</span> across {categories.length} categories
            </p>

            {/* Search */}
            <div className="relative mt-8 max-w-xl mx-auto w-full animate-fadeIn">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search questions… e.g. RERA, home loan, site visit"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory("all");
                }}
                className="w-full pl-11 pr-10 py-3.5 text-sm rounded-xl border-0 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/30 text-navy placeholder-gray-400"
                aria-label="Search FAQ"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy text-xs transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-cream">
        <div className="page-padding max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Category Selector Column — Desktop Sidebar (Sticky, Open List) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-2.5 z-20">
              <p className="section-overline text-gray-400 mb-3 px-1 text-left block">
                Category
              </p>

              <button
                onClick={() => scrollToCategory("all")}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl text-[14px] font-normal transition-all duration-300 flex items-center justify-between cursor-pointer border",
                  currentActiveId === "all"
                    ? "bg-gold/10 text-gold border-gold/30 font-medium shadow-sm"
                    : "bg-white text-gray-500 border-gray-150 hover:bg-gold/5 hover:text-gold hover:border-gold/20 hover:translate-x-1 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base shrink-0" aria-hidden>✨</span>
                  <span>All Questions</span>
                </div>
                <span className={cn(
                  "text-[10px] rounded-full px-2 py-0.5 font-light shrink-0 transition-colors duration-300",
                  currentActiveId === "all" ? "bg-gold/25 text-gold" : "bg-gray-100/80 text-gray-400"
                )}>
                  {totalQuestions}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-2xl text-[14px] font-normal transition-all duration-300 flex items-center justify-between cursor-pointer border",
                    currentActiveId === cat.id
                      ? "bg-gold/10 text-gold border-gold/30 font-medium shadow-sm"
                      : "bg-white text-gray-500 border-gray-150 hover:bg-gold/5 hover:text-gold hover:border-gold/20 hover:translate-x-1 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base shrink-0" aria-hidden>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] rounded-full px-2 py-0.5 font-light shrink-0 transition-colors duration-300",
                    currentActiveId === cat.id ? "bg-gold/25 text-gold" : "bg-gray-100/80 text-gray-400"
                  )}>
                    {cat.items.length}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Category Selector Bar — Mobile/Tablet (Horizontal Pills) */}
          <div className="lg:hidden w-full mb-8 overflow-x-auto scrollbar-hide flex gap-2.5 pb-2">
            <button
              onClick={() => scrollToCategory("all")}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-normal whitespace-nowrap shrink-0 border transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm",
                currentActiveId === "all"
                  ? "bg-gold text-navy border-gold font-medium"
                  : "bg-white text-gray-500 border-gray-150 hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
              )}
            >
              ✨ All Questions
              <span className={cn(
                "text-[10px] rounded-full px-1.5 py-0.5",
                currentActiveId === "all" ? "bg-navy/20 text-navy" : "bg-gray-100 text-gray-400"
              )}>
                {totalQuestions}
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-normal whitespace-nowrap shrink-0 border transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm",
                  currentActiveId === cat.id
                    ? "bg-gold text-navy border-gold font-medium"
                    : "bg-white text-gray-500 border-gray-150 hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
                )}
              >
                {cat.icon} {cat.title}
                <span className={cn(
                  "text-[10px] rounded-full px-1.5 py-0.5",
                  currentActiveId === cat.id ? "bg-navy/20 text-navy" : "bg-gray-100 text-gray-400"
                )}>
                  {cat.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ content */}
          <div className="flex-1 min-w-0">
            {searchQuery && (
              <p className="text-xs text-gray-400 mb-6">
                <span className="font-normal text-navy">{totalResults}</span> result
                {totalResults !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {visibleCategories.length > 0 ? (
              <RevealGrid
                key={`${activeCategory}_${searchQuery}`}
                className="space-y-6"
              >
                {visibleCategories.map((category) => (
                  <RevealCard key={category.id}>
                    <div
                      ref={(el) => {
                        sectionRefs.current[category.id] = el;
                      }}
                      className="scroll-mt-28 mb-12"
                    >
                      <FaqSection title={category.title} icon={category.icon} items={category.items} />
                    </div>
                  </RevealCard>
                ))}
              </RevealGrid>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-150/80 shadow-sm">
                <p className="text-5xl mb-5">🔍</p>
                <p className="font-normal text-navy text-xl mb-2">
                  No results for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-sm text-gray-400 mb-6 max-w-sm font-light leading-relaxed">
                  Try a different keyword, or contact our advisors for personalised help.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2.5 rounded-full border border-gold text-gold text-sm font-normal hover:bg-gold hover:text-navy transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-16 bg-[#00274D] border border-gold/30 rounded-[32px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-white text-center">
              {/* Subtle absolute glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-4">
                  Still Need Help?
                </p>
                <h2 className="text-3xl md:text-[40px] font-heading font-normal text-white leading-tight mb-6">
                  Didn&apos;t find what you were looking for?
                </h2>
                <p className="text-white/60 text-base mb-10 font-light leading-relaxed">
                  Our expert real estate advisors are happy to answer your specific questions — completely free of charge.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact-us"
                    className="px-8 py-3.5 rounded-full bg-gold hover:bg-gold/90 text-navy font-normal text-sm transition-all duration-200 hover:scale-105 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    Talk to an Advisor
                  </Link>
                  <a
                    href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 font-medium text-sm transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Image src="/whatsapp.png" alt="" width={16} height={16} unoptimized className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
