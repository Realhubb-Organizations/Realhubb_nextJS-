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

const HomeLoanEligibilityPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<string>("100000");
  const [monthlyObligations, setMonthlyObligations] = useState<string>("10000");
  const [rate, setRate] = useState<string>("8.5");
  const [tenure, setTenure] = useState<string>("20");

  const calculateEligibility = useCallback(() => {
    const income = parseFloat(monthlyIncome) || 0;
    const obligations = parseFloat(monthlyObligations) || 0;
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    if (income <= 0 || R <= 0 || N <= 0) return { maxEMI: 0, loanAmount: 0 };

    // Banks typically allow up to 50% of net income as EMI (FOIR)
    const maxEMI = Math.max(income * 0.5 - obligations, 0);
    const loanAmount =
      maxEMI > 0 ? (maxEMI * (Math.pow(1 + R, N) - 1)) / (R * Math.pow(1 + R, N)) : 0;

    return { maxEMI, loanAmount };
  }, [monthlyIncome, monthlyObligations, rate, tenure]);

  const { maxEMI, loanAmount } = calculateEligibility();

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

  return (
    <>
      <SEO
        title="Home Loan Eligibility Calculator | RealHubb"
        description="Check how much home loan you are eligible for based on your income and existing obligations."
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
              Home Loan <span className="text-gold">Eligibility</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
              Find out how much home loan you qualify for based on your current net income and monthly commitments.
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
                  {/* Monthly Net Income */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Monthly Net Income</label>
                      <span className="text-sm font-normal text-gold">
                        {formatCurrency(parseFloat(monthlyIncome) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="1000000"
                      step="5000"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹20,000</span>
                      <span>₹10 L</span>
                    </div>
                  </div>

                  {/* Existing Obligations */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Existing Monthly EMIs</label>
                      <span className="text-sm font-normal text-gold">
                        {formatCurrency(parseFloat(monthlyObligations) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={monthlyObligations}
                      onChange={(e) => setMonthlyObligations(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹0</span>
                      <span>₹2 L</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Interest Rate (p.a.)</label>
                      <span className="text-sm font-normal text-gold">{rate}%</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="18"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>6%</span>
                      <span>18%</span>
                    </div>
                  </div>

                  {/* Tenure */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
                      <span className="text-sm font-normal text-gold">{tenure} yrs</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>1 yr</span>
                      <span>30 yrs</span>
                    </div>
                  </div>

                  {/* Manual inputs */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Monthly Income (₹)</label>
                      <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Existing EMIs (₹)</label>
                      <input
                        type="number"
                        value={monthlyObligations}
                        onChange={(e) => setMonthlyObligations(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* Results */}
              <FadeInOnScroll direction="right" delay={150}>
                <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gold/10 rounded-[24px] shadow-xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  {/* Monthly EMI Navy Plate */}
                  <div className="text-center bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Eligible Loan Amount</p>
                    <p className="text-3xl sm:text-4xl font-normal text-gold">{formatLakh(loanAmount)}</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">at {rate}% rate for {tenure} years</p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Monthly Net Income</span>
                      <span className="font-normal text-navy">
                        {formatCurrency(parseFloat(monthlyIncome) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Existing EMIs</span>
                      <span className="font-normal text-orange-500">
                        − {formatCurrency(parseFloat(monthlyObligations) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Max Eligible EMI (50% FOIR)</span>
                      <span className="font-normal text-green-600">
                        {formatCurrency(maxEMI)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-medium text-navy">Eligible Loan Limit</span>
                      <span className="font-normal text-gold">{formatLakh(loanAmount)}</span>
                    </div>
                  </div>

                  {/* FOIR Info Box */}
                  <div className="bg-[#D7A764]/5 border border-gold/10 rounded-xl p-4">
                    <p className="text-xs text-navy font-normal mb-1">What is FOIR?</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                      Fixed Obligation to Income Ratio (FOIR) is used by banks to assess loan eligibility. Most lenders restrict total EMI liabilities to a maximum of <strong>50%</strong> of your net monthly income.
                    </p>
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
                  const isCurrent = link.href === "/home-loan-eligibility";
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
                * This is an indicative estimate only. Actual loan eligibility depends on your credit score, employment type, lender policies, and other factors.
              </p>
            </FadeInOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomeLoanEligibilityPage;
