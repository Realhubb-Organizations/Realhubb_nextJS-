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

const EMICalculatorPage = () => {
  const [principal, setPrincipal] = useState<string>("5000000");
  const [rate, setRate] = useState<string>("8.5");
  const [tenure, setTenure] = useState<string>("20");

  const calculateEMI = useCallback(() => {
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    if (P <= 0 || R <= 0 || N <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest };
  }, [principal, rate, tenure]);

  const { emi, totalPayment, totalInterest } = calculateEMI();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const principalPct = totalPayment > 0 ? (parseFloat(principal) / totalPayment) * 100 : 0;
  const interestPct = 100 - principalPct;

  return (
    <>
      <SEO
        title="EMI Calculator | RealHubb"
        description="Calculate your home loan EMI instantly. Plan your property investment with our easy-to-use EMI calculator."
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
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 mb-6 inline-block">
              RealHubb Financial Suite
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-normal text-white max-w-3xl leading-tight mx-auto">
              Home Loan <span className="text-gold">EMI Calculator</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
              Estimate your monthly home loan payments, total interest, and outstanding payments in seconds.
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
                  {/* Loan Amount */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                      <span className="text-sm font-semibold text-gold">
                        {formatCurrency(parseFloat(principal) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="50000000"
                      step="100000"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹5 L</span>
                      <span>₹5 Cr</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Interest Rate (p.a.)</label>
                      <span className="text-sm font-semibold text-gold">{rate}%</span>
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
                      <span className="text-sm font-semibold text-gold">{tenure} yrs</span>
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
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Rate (%)</label>
                      <input
                        type="number"
                        value={rate}
                        step="0.1"
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Tenure (yrs)</label>
                      <input
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                      />
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* Results */}
              <FadeInOnScroll direction="right" delay={150}>
                <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gold/10 rounded-[24px] shadow-xl p-6 sm:p-8 flex flex-col justify-between h-full">
                  {/* Monthly EMI Navy Plate */}
                  <div className="text-center bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md mb-6">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Monthly EMI</p>
                    <p className="text-3xl sm:text-4xl font-normal text-gold">{formatCurrency(emi)}</p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-1 mb-6 text-sm">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Principal Amount</span>
                      <span className="font-semibold text-navy">
                        {formatCurrency(parseFloat(principal) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500">Total Interest</span>
                      <span className="font-semibold text-gold">
                        {formatCurrency(totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-medium text-navy">Total Payment</span>
                      <span className="font-semibold text-navy">
                        {formatCurrency(totalPayment)}
                      </span>
                    </div>
                  </div>

                  {/* Visual bar */}
                  <div className="pt-2">
                    <div className="flex rounded-full overflow-hidden h-3 mb-3 bg-gray-100">
                      <div
                        className="bg-navy transition-all duration-500"
                        style={{ width: `${principalPct}%` }}
                      />
                      <div
                        className="bg-gold transition-all duration-500"
                        style={{ width: `${interestPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-light">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-navy inline-block" />
                        Principal {principalPct.toFixed(1)}%
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                        Interest {interestPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>

            {/* Suite Navigator */}
            <div className="mt-16 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm text-center">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-5">
                RealHubb Financial Suite
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {quickLinks.map((link) => {
                  const isCurrent = link.href === "/emi-calculator";
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-2 text-xs md:text-sm font-medium border rounded-xl transition-all duration-200 ${
                        isCurrent
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
                * This calculator provides an estimate only. Actual EMI may vary based on your lender's terms and conditions.
              </p>
            </FadeInOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default EMICalculatorPage;
