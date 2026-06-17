"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Phone, HelpCircle } from "lucide-react";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import FaqSection from "@/components/faq/FaqSection";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";
import { company } from "@/data/company";
import type { BreadcrumbItem, FaqCategory } from "@/types/seo";

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
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-14 page-padding">
        <BreadcrumbNav items={breadcrumbs} dark />
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-normal px-3 py-1.5 rounded-full mt-4 mb-5">
          <HelpCircle className="h-3.5 w-3.5" />
          Help Center
        </div>
        <h1 className="font-heading text-3xl md:text-5xl text-white font-normal max-w-2xl">
          Frequently asked <span className="text-gold">questions.</span>
        </h1>
        <p className="text-white/60 text-base mt-3 max-w-xl">
          Everything you need to know about buying property, RERA compliance, home loans, and how
          RealHubb works.
        </p>
        <p className="text-white/40 text-sm mt-2">
          <span className="text-white/70">{totalQuestions} answers</span> across{" "}
          {categories.length} categories
        </p>

        {/* Search */}
        <div className="relative mt-8 max-w-xl">
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
      </div>

      {/* Body */}
      <section className="py-12 page-padding">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-[10px] font-normal text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">
                Categories
              </p>
              <button
                onClick={() => scrollToCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-normal transition-colors ${
                  activeCategory === "all" && !activeSectionId
                    ? "bg-gold/10 text-gold"
                    : "text-gray-500 hover:bg-white hover:text-navy"
                }`}
              >
                All Questions
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-normal transition-colors flex items-center gap-2 ${
                    activeSectionId === cat.id
                      ? "bg-gold/10 text-gold"
                      : "text-gray-500 hover:bg-white hover:text-navy"
                  }`}
                >
                  <span aria-hidden>{cat.icon}</span>
                  <span className="truncate flex-1">{cat.title}</span>
                  <span className="text-[10px] bg-gray-100 rounded-full px-1.5 py-0.5 shrink-0 text-gray-400">
                    {cat.items.length}
                  </span>
                </button>
              ))}

              {/* Contact card */}
              <div className="mt-6 p-4 rounded-2xl bg-white shadow-sm space-y-3">
                <p className="text-xs font-normal text-navy">Still need help?</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Advisors available Mon–Sat, 9 AM – 7 PM IST.
                </p>
                <Link
                  href="/contact-us"
                  className="w-full mt-1 px-3 py-2 rounded-full bg-gold text-navy text-xs font-normal flex items-center justify-center gap-1.5 hover:bg-gold/90 transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  Talk to an Advisor
                </Link>
              </div>
            </div>
          </aside>

          {/* Category pills — mobile */}
          <div className="lg:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="flex gap-2 overflow-x-auto pb-3"
              role="tablist"
              aria-label="FAQ categories"
            >
              <button
                role="tab"
                aria-selected={activeCategory === "all"}
                onClick={() => scrollToCategory("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-normal whitespace-nowrap shrink-0 border transition-colors ${
                  activeCategory === "all"
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gold/50"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-normal whitespace-nowrap shrink-0 border transition-colors ${
                    activeCategory === cat.id
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gold/50"
                  }`}
                >
                  {cat.icon} {cat.title}
                </button>
              ))}
            </div>
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
              <RevealGrid className="space-y-6">
                {visibleCategories.map((category) => (
                  <RevealCard key={category.id}>
                    <div
                      ref={(el) => {
                        sectionRefs.current[category.id] = el;
                      }}
                      className="scroll-mt-28 bg-white rounded-2xl shadow-sm p-6 md:p-8"
                    >
                      <FaqSection title={category.title} icon={category.icon} items={category.items} />
                    </div>
                  </RevealCard>
                ))}
              </RevealGrid>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-5xl mb-5">🔍</p>
                <p className="font-normal text-navy text-xl mb-2">
                  No results for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-sm text-gray-400 mb-6 max-w-sm">
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
            <div className="mt-10 bg-navy rounded-2xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-normal text-white mb-2">
                    Didn&apos;t find what you were looking for?
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Our advisors are happy to answer specific questions — completely free of
                    charge.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link
                    href="/contact-us"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gold hover:bg-gold/90 text-navy font-normal text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Talk to an Advisor
                  </Link>
                  <a
                    href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/20 text-white/80 hover:bg-white/10 font-normal text-sm flex items-center justify-center gap-2 transition-colors"
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
