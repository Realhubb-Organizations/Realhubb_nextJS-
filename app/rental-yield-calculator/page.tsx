"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

const quickLinks = [
  { name: "EMI Calculator", href: "/emi-calculator" },
  { name: "Home Loan Eligibility", href: "/home-loan-eligibility" },
  { name: "Salary Advisor", href: "/salary-advisor" },
  { name: "Rental Yield", href: "/rental-yield-calculator" },
  { name: "Currency Converter", href: "/currency-calculator" },
];

const RentalYieldPage = () => {
  const [propertyValue, setPropertyValue] = useState<string>("5000000");
  const [monthlyRent, setMonthlyRent] = useState<string>("25000");
  const [annualExpenses, setAnnualExpenses] = useState<string>("30000");

  const calculate = useCallback(() => {
    const value = parseFloat(propertyValue) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    const expenses = parseFloat(annualExpenses) || 0;

    const annualRent = rent * 12;
    const grossYield = value > 0 ? (annualRent / value) * 100 : 0;
    const netAnnualIncome = annualRent - expenses;
    const netYield = value > 0 ? (netAnnualIncome / value) * 100 : 0;
    const paybackYears = netAnnualIncome > 0 ? value / netAnnualIncome : 0;

    return { annualRent, grossYield, netAnnualIncome, netYield, paybackYears };
  }, [propertyValue, monthlyRent, annualExpenses]);

  const { annualRent, grossYield, netAnnualIncome, netYield, paybackYears } = calculate();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatLakh = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return formatCurrency(value);
  };

  const yieldColor = (y: number) =>
    y >= 5 ? "text-green-600" : y >= 3 ? "text-orange-500" : "text-red-500";

  return (
    <>
      <SEO
        title="Rental Yield Calculator | RealHubb"
        description="Calculate gross and net rental yield on your property investment instantly."
      />

      <main className="min-h-screen bg-cream">
        {/* Immersive Header Banner */}
        <section className="bg-navy pt-28 pb-36 md:pt-32 md:pb-44 page-padding relative overflow-hidden text-white">
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

          {/* Golden glow light effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-normal bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 mb-6 inline-block">
              RealHubb Financial Suite
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-normal text-white max-w-3xl leading-tight mx-auto">
              Rental Yield <span className="text-gold">Calculator</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
              Evaluate gross yields, net rental income, and estimate payback timelines on your property investments.
            </p>
          </div>
        </section>

        {/* Content Area */}
        <section className="page-padding relative z-20 -mt-16 md:-mt-20 pb-24 pt-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <FadeInOnScroll direction="left" delay={100}>
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
                  {/* Property Value */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Property Value</label>
                      <span className="text-sm font-normal text-gold">
                        {formatLakh(parseFloat(propertyValue) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="100000000"
                      step="100000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹5 L</span>
                      <span>₹10 Cr</span>
                    </div>
                  </div>

                  {/* Monthly Rent */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Monthly Rent</label>
                      <span className="text-sm font-normal text-gold">
                        {formatCurrency(parseFloat(monthlyRent) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="500000"
                      step="1000"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹5,000</span>
                      <span>₹5 L</span>
                    </div>
                  </div>

                  {/* Annual Expenses */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Annual Expenses</label>
                      <span className="text-sm font-normal text-gold">
                        {formatCurrency(parseFloat(annualExpenses) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹0</span>
                      <span>₹5 L</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-light">
                      Includes maintenance, property tax, insurance, vacancy buffers, etc.
                    </p>
                  </div>

                  {/* Manual inputs */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Property (₹)</label>
                      <input
                        type="number"
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Rent/mo (₹)</label>
                      <input
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Expenses/yr (₹)</label>
                      <input
                        type="number"
                        value={annualExpenses}
                        onChange={(e) => setAnnualExpenses(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* Results */}
              <FadeInOnScroll direction="right" delay={150}>
                <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gold/10 rounded-[24px] shadow-xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  {/* Gross Yield Navy Plate */}
                  <div className="text-center bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Gross Rental Yield</p>
                    <p className="text-3xl sm:text-4xl font-normal text-gold">{grossYield.toFixed(2)}%</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">gross returns per annum</p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Annual Rental Income</span>
                      <span className="font-normal text-navy">
                        {formatCurrency(annualRent)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Annual Expenses</span>
                      <span className="font-normal text-orange-500">
                        − {formatCurrency(parseFloat(annualExpenses) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Net Annual Income</span>
                      <span className="font-normal text-green-600">
                        {formatCurrency(netAnnualIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Net Rental Yield</span>
                      <span className={`font-normal ${yieldColor(netYield)}`}>
                        {netYield.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-500">Payback Period</span>
                      <span className="font-normal text-navy">
                        {paybackYears > 0 ? `${paybackYears.toFixed(1)} years` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Benchmark Guide Box */}
                  <div className="bg-[#D7A764]/5 border border-gold/10 rounded-xl p-4 space-y-2">
                    <p className="text-xs text-navy font-normal">Yield Benchmark Guides</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        ≥ 5% — Excellent rental yield
                      </div>
                      <div className="flex items-center gap-2 text-xs text-orange-500 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
                        3% to 5% — Moderate rental yield
                      </div>
                      <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                        &lt; 3% — Low rental yield
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>

            {/* Suite Navigator */}
            <div className="mt-16 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm text-center">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-normal mb-5">
                RealHubb Financial Suite
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {quickLinks.map((link) => {
                  const isCurrent = link.href === "/rental-yield-calculator";
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-2 text-xs md:text-sm font-medium border rounded-xl transition-all duration-200 ${isCurrent
                          ? "bg-navy border-navy text-white"
                          : "border-gray-200 text-navy hover:text-gold hover:border-gold"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <FadeInOnScroll direction="up" delay={200}>
              <p className="text-center text-xs text-gray-400 mt-8 font-light">
                * Figures are indicative. Actual returns depend on market conditions, occupancy rates, and local regulations.
              </p>
            </FadeInOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default RentalYieldPage;
