"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, DollarSign, Percent, TrendingUp, Briefcase, ChevronRight, ArrowRight, Search, X } from "lucide-react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

const buyerTools = [
  {
    name: "EMI Calculator",
    description: "Estimate your monthly home loan payments based on principal, rate, and loan tenure.",
    href: "/emi-calculator",
    icon: Calculator,
    tags: ["Tenure", "Interest", "Monthly Pay"],
  },
  {
    name: "Home Loan Eligibility",
    description: "Find out your maximum eligible home loan amount based on your net income and obligations.",
    href: "/home-loan-eligibility",
    icon: TrendingUp,
    tags: ["Income", "Debt Ratio", "Max Loan"],
  },
  {
    name: "Salary Advisor",
    description: "Break down your CTC to estimate in-hand income, city living costs, and home budget.",
    href: "/salary-advisor",
    icon: Briefcase,
    tags: ["CTC Breakdown", "Living Costs", "Home Budget"],
  },
];

const investmentTools = [
  {
    name: "Rental Yield Calculator",
    description: "Analyze the gross and net returns on your property investment to estimate payback years.",
    href: "/rental-yield-calculator",
    icon: Percent,
    tags: ["Gross & Net ROI", "Payback Tenure"],
  },
  {
    name: "Currency Converter",
    description: "Convert major global currencies (USD, AED, SGD, etc.) to INR for real estate planning.",
    href: "/currency-calculator",
    icon: DollarSign,
    tags: ["Global Rates", "NRI Planning"],
  },
];

const categories = [
  { id: "all", name: "All Suite" },
  { id: "buying", name: "Home Buying & Budgeting" },
  { id: "investment", name: "Investment & NRI" },
];

function ToolCard({
  name,
  description,
  href,
  icon: Icon,
  tags,
}: {
  name: string;
  description: string;
  href: string;
  icon: any;
  tags: string[];
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      href={href}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between h-full bg-gradient-to-br from-white to-gray-50/50 border border-gold/10 hover:border-gold/30 rounded-[24px] p-6 md:p-8 shadow-md hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
    >
      {/* Spotlight dynamic hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 200px at ${coords.x}px ${coords.y}px, rgba(215, 167, 100, 0.08), transparent)`,
        }}
      />

      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/10 transition-colors duration-500" />

      <div className="relative z-10">
        {/* Icon Container with gold gradient */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 text-gold flex items-center justify-center mb-6 group-hover:from-gold group-hover:to-[#B38F44] group-hover:text-navy group-hover:border-gold group-hover:scale-110 shadow-sm transition-all duration-500">
          <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
        </div>

        {/* Title */}
        <h3 className="font-heading text-navy text-xl font-normal group-hover:text-[#B38F44] transition-colors duration-300 mb-3 tracking-wide">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-light">
          {description}
        </p>

        {/* Dynamic helper tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] md:text-xs bg-navy/5 text-navy/70 px-3 py-1.5 rounded-lg border border-navy/5 font-medium group-hover:bg-gold/10 group-hover:text-gold-dark group-hover:border-gold/20 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Link with animated slide icon */}
      <div className="relative z-10 flex items-center text-xs md:text-sm font-medium text-navy group-hover:text-gold transition-colors duration-300 pt-3 border-t border-gray-100 mt-auto">
        Launch Calculator
        <ChevronRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1.5 duration-300" />
      </div>
    </Link>
  );
}

export default function ToolsHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredBuyerTools = buyerTools.filter(
    (tool) =>
      (activeCategory === "all" || activeCategory === "buying") &&
      (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredInvestmentTools = investmentTools.filter(
    (tool) =>
      (activeCategory === "all" || activeCategory === "investment") &&
      (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const totalResults = filteredBuyerTools.length + filteredInvestmentTools.length;

  return (
    <>
      <SEO
        title="Investment & Property Calculators | RealHubb"
        description="Access our suite of financial planning tools: Home Loan EMI Calculator, Currency Converter, Home Loan Eligibility, Rental Yield, and Salary Advisor."
      />
      <main className="min-h-screen bg-cream">
        {/* Header Hero */}
        <section className="relative bg-navy pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden text-white">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Real Estate"
              className="w-full h-full object-cover opacity-55 filter brightness-95"
            />
            {/* Smooth linear gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy" />
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-normal bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 mb-6">
              RealHubb Financial Suite
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal text-white max-w-3xl leading-tight">
              Smart Property <span className="text-gold">Calculators</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-light">
              Evaluate home loan EMIs, estimate borrowing capacity, calculate rental returns, and plan your home budget with our suite of tailored real estate planning tools.
            </p>

            {/* Premium Interactive Search & Filter Bar */}
            <div className="mt-8 w-full max-w-xl flex flex-col sm:flex-row gap-3 items-stretch relative z-30">
              {/* Category Dropdown Selector */}
              <div className="relative group shrink-0">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full sm:w-48 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl px-4 py-4 pr-10 focus:outline-none focus:border-gold/80 focus:ring-1 focus:ring-gold/80 transition-all duration-300 shadow-xl cursor-pointer text-sm font-medium appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-navy bg-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 group-hover:text-white transition-colors duration-250">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Text Search Input */}
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search calculators (e.g. EMI, Loan, Yield)..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-sm md:text-base rounded-2xl pl-12 pr-10 py-4 focus:outline-none focus:border-gold/80 focus:ring-1 focus:ring-gold/80 transition-all duration-300 shadow-xl"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-gold transition-colors duration-300">
                  <Search className="w-5 h-5" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="page-padding relative z-20 pb-24 pt-12">
          <div className="max-w-6xl mx-auto">

            {/* Dynamic Results Grid */}
            <div className="space-y-16">
              {/* Category 1: Buyer Tools */}
              {filteredBuyerTools.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                    <h2 className="text-sm font-normal uppercase tracking-wider text-navy/70">
                      Home Buying &amp; Budgeting
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBuyerTools.map((tool, index) => (
                      <FadeInOnScroll key={tool.name} direction="up" delay={index * 100}>
                        <ToolCard {...tool} />
                      </FadeInOnScroll>
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2: Investment Tools */}
              {filteredInvestmentTools.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                    <h2 className="text-sm font-normal uppercase tracking-wider text-navy/70">
                      Investment &amp; Cross-Border Analysis
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvestmentTools.map((tool, index) => (
                      <FadeInOnScroll key={tool.name} direction="up" delay={index * 100}>
                        <ToolCard {...tool} />
                      </FadeInOnScroll>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results State */}
              {totalResults === 0 && (
                <div className="text-center py-16 px-4 bg-white/40 border border-gray-100 rounded-3xl backdrop-blur-sm shadow-sm max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-heading text-navy font-normal mb-2">No tools match your query</h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                    We couldn't find any calculators matching "{searchQuery}". Try using different terms or browse all categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="bg-navy hover:bg-navy/90 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Premium Advisory Section */}
            <FadeInOnScroll direction="up">
              <div className="bg-[#00274D] border border-gold/30 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl mt-24">
                {/* Glow effects inside advisory */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl text-left">
                    <span className="text-gold text-xs uppercase tracking-wider font-normal bg-gold/10 border border-gold/20 px-3 py-1 rounded-full inline-block">
                      Custom Financial Advisory
                    </span>
                    <h3 className="text-2xl md:text-3xl font-heading font-normal">
                      Need custom financial modeling?
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed font-light">
                      Home loan parameters and tax returns can get complex. Talk to our real estate advisors today for customized budgeting advice and seamless loan processing support.
                    </p>
                  </div>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-normal px-6 py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-105 shrink-0 self-start md:self-auto shadow-md"
                  >
                    Consult an Advisor <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>
    </>
  );
}
