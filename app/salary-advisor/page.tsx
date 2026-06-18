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

const SalaryAdvisorPage = () => {
  const [ctc, setCtc] = useState<string>("1200000");
  const [city, setCity] = useState<string>("bangalore");
  const [experience, setExperience] = useState<string>("3");

  const cityData: Record<string, { label: string; rentIndex: number }> = {
    mumbai:    { label: "Mumbai",    rentIndex: 1.0 },
    delhi:     { label: "Delhi NCR", rentIndex: 0.85 },
    bangalore: { label: "Bangalore", rentIndex: 0.80 },
    hyderabad: { label: "Hyderabad", rentIndex: 0.65 },
    pune:      { label: "Pune",      rentIndex: 0.70 },
    chennai:   { label: "Chennai",   rentIndex: 0.65 },
    kolkata:   { label: "Kolkata",   rentIndex: 0.55 },
    ahmedabad: { label: "Ahmedabad", rentIndex: 0.50 },
  };

  const calculate = useCallback(() => {
    const annual = parseFloat(ctc) || 0;
    const monthly = annual / 12;

    const basic = monthly * 0.4;
    const hra = basic * 0.5;
    const pf = basic * 0.12;
    const professionalTax = 200;
    const grossMonthly = monthly;

    let annualTax = 0;
    if (annual > 1500000) annualTax = (annual - 1500000) * 0.3 + 150000 * 0.2 + 150000 * 0.15 + 100000 * 0.1 + 300000 * 0.05;
    else if (annual > 1200000) annualTax = (annual - 1200000) * 0.2 + 150000 * 0.15 + 100000 * 0.1 + 300000 * 0.05;
    else if (annual > 900000) annualTax = (annual - 900000) * 0.15 + 100000 * 0.1 + 300000 * 0.05;
    else if (annual > 700000) annualTax = (annual - 700000) * 0.1 + 300000 * 0.05;
    else if (annual > 300000) annualTax = (annual - 300000) * 0.05;

    const monthlyTax = annualTax / 12;
    const inHand = grossMonthly - pf - professionalTax - monthlyTax;

    const idx = cityData[city]?.rentIndex ?? 0.7;
    const rentEstimate = 25000 * idx;
    const foodEstimate = 8000 * idx;
    const transportEstimate = 4000 * idx;
    const totalLiving = rentEstimate + foodEstimate + transportEstimate + 5000;
    const savingsEstimate = inHand - totalLiving;
    const savingsPct = inHand > 0 ? (savingsEstimate / inHand) * 100 : 0;

    return {
      monthly,
      basic,
      hra,
      pf,
      monthlyTax,
      inHand,
      rentEstimate,
      foodEstimate,
      transportEstimate,
      totalLiving,
      savingsEstimate,
      savingsPct,
    };
  }, [ctc, city]);

  const r = calculate();

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

  const livingPct = r.inHand > 0 ? (r.totalLiving / r.inHand) * 100 : 0;
  const savingPctFormatted = r.inHand > 0 ? Math.max(0, r.savingsPct) : 0;

  return (
    <>
      <SEO
        title="Salary Advisor | RealHubb"
        description="Understand your take-home salary, tax deductions, and estimated living costs for major Indian cities."
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
              Salary <span className="text-gold">Advisor</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
              Break down your CTC into take-home pay, estimated local living expenses, and home budget limits.
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
                  {/* Annual CTC */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Annual CTC</label>
                      <span className="text-sm font-semibold text-gold">
                        {formatLakh(parseFloat(ctc) || 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="300000"
                      max="10000000"
                      step="50000"
                      value={ctc}
                      onChange={(e) => setCtc(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>₹3 L</span>
                      <span>₹1 Cr</span>
                    </div>
                  </div>

                  {/* Manual CTC input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Manual CTC Input (₹)</label>
                    <input
                      type="number"
                      value={ctc}
                      onChange={(e) => setCtc(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                    />
                  </div>

                  {/* City Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764] bg-white cursor-pointer"
                    >
                      {Object.entries(cityData).map(([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                      <span className="text-sm font-semibold text-gold">{experience} yrs</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                      style={{ accentColor: '#D7A764' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-light">
                      <span>Fresher</span>
                      <span>30 yrs</span>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* Results */}
              <FadeInOnScroll direction="right" delay={150}>
                <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gold/10 rounded-[24px] shadow-xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  {/* Monthly In-Hand Navy Plate */}
                  <div className="text-center bg-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Estimated Take-Home</p>
                    <p className="text-3xl sm:text-4xl font-normal text-gold">{formatCurrency(r.inHand)}</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">monthly in-hand pay</p>
                  </div>

                  {/* Salary breakdown */}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-semibold text-navy text-xs uppercase tracking-wider mb-2">Salary Breakdown</p>
                    {[
                      { label: "Gross Monthly", value: r.monthly, color: "text-navy font-semibold" },
                      { label: "Basic Salary (40%)", value: r.basic, color: "text-gray-500" },
                      { label: "House Rent Allowance (HRA)", value: r.hra, color: "text-gray-500" },
                      { label: "PF Deduction (Provident Fund)", value: -r.pf, color: "text-orange-500" },
                      { label: "Estimated Income Tax (Monthly)", value: -r.monthlyTax, color: "text-orange-500" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500">{label}</span>
                        <span className={`font-medium ${color}`}>
                          {value < 0 ? `− ${formatCurrency(Math.abs(value))}` : formatCurrency(value)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Living Costs Estimate */}
                  <div className="space-y-1 text-xs sm:text-sm pt-2">
                    <p className="font-semibold text-navy text-xs uppercase tracking-wider mb-2">Estimated Expenses in {cityData[city]?.label}</p>
                    {[
                      { label: "Rent / PG Accommodation", value: r.rentEstimate },
                      { label: "Food & Groceries", value: r.foodEstimate },
                      { label: "Local Commute & Fuel", value: r.transportEstimate },
                      { label: "Misc & Entertainment", value: 5000 },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-navy">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 font-medium">
                      <span className="text-navy">Total Living Cost</span>
                      <span className="font-semibold text-navy">{formatCurrency(r.totalLiving)}</span>
                    </div>
                  </div>

                  {/* Savings & Affordability Advice */}
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-navy border-t border-gray-200 pt-3">
                      <span>Monthly Surplus</span>
                      <span className={r.savingsEstimate >= 0 ? "text-green-600" : "text-red-500"}>
                        {formatCurrency(r.savingsEstimate)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {r.inHand > 0 && (
                      <div>
                        <div className="flex rounded-full overflow-hidden h-3 mb-2 bg-gray-100">
                          <div
                            className="bg-navy transition-all duration-500"
                            style={{ width: `${Math.max(0, Math.min(100, livingPct))}%` }}
                          />
                          <div
                            className="bg-gold transition-all duration-500"
                            style={{ width: `${Math.max(0, Math.min(100, savingPctFormatted))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 font-light">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-navy inline-block" />
                            Expenses {livingPct.toFixed(0)}%
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                            Savings {savingPctFormatted.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Affordability Advice Box */}
                    {r.savingsEstimate > 0 && (
                      <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-center">
                        <p className="text-xs text-navy font-semibold mb-1">Affordability Advisor</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-light mb-3">
                          Based on your monthly surplus of <strong>{formatCurrency(r.savingsEstimate)}</strong>, you could easily support an EMI for a home loan of up to <strong>{formatLakh(r.savingsEstimate * 100)}</strong>!
                        </p>
                        <Link
                          href="/projects/ongoing/bangalore"
                          className="inline-block bg-navy text-white px-4 py-2 rounded-lg text-[10px] hover:bg-navy/90 font-medium transition-colors"
                        >
                          Browse Properties →
                        </Link>
                      </div>
                    )}
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
                  const isCurrent = link.href === "/salary-advisor";
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
                * Living costs and tax brackets are approximations for reference only.
              </p>
            </FadeInOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default SalaryAdvisorPage;
