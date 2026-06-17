"use client";

import { useState, useCallback } from "react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

const SalaryAdvisorPage = () => {
  const [ctc, setCtc] = useState<string>("1200000");
  const [city, setCity] = useState<string>("bangalore");
  const [experience, setExperience] = useState<string>("3");

  // Approximate cost-of-living multipliers for major Indian cities
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

    // Standard Indian salary structure approximation
    const basic = monthly * 0.4;
    const hra = basic * 0.5;
    const pf = basic * 0.12;
    const professionalTax = 200; // ₹200/mo typical
    const grossMonthly = monthly;

    // Rough income tax (new regime FY2024-25)
    let annualTax = 0;
    if (annual > 1500000) annualTax = (annual - 1500000) * 0.3 + 150000 * 0.2 + 150000 * 0.15 + 100000 * 0.1 + 300000 * 0.05;
    else if (annual > 1200000) annualTax = (annual - 1200000) * 0.2 + 150000 * 0.15 + 100000 * 0.1 + 300000 * 0.05;
    else if (annual > 900000) annualTax = (annual - 900000) * 0.15 + 100000 * 0.1 + 300000 * 0.05;
    else if (annual > 700000) annualTax = (annual - 700000) * 0.1 + 300000 * 0.05;
    else if (annual > 300000) annualTax = (annual - 300000) * 0.05;

    const monthlyTax = annualTax / 12;
    const inHand = grossMonthly - pf - professionalTax - monthlyTax;

    // Living cost estimate based on city
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

      <main className="min-h-screen bg-[#faf6f1] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <FadeInOnScroll direction="up">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#00274D] mb-3">
                Salary Advisor
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                Break down your CTC into take-home pay and estimated living costs.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Inputs */}
            <FadeInOnScroll direction="left" delay={100}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">

                {/* CTC */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Annual CTC</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹3 L</span><span>₹1 Cr</span>
                  </div>
                </div>

                {/* Manual CTC input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Enter CTC (₹)</label>
                  <input
                    type="number"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30 bg-white"
                  >
                    {Object.entries(cityData).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                    <span className="text-sm font-normal text-[#D7A764]">{experience} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Fresher</span><span>30 yrs</span>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Results */}
            <FadeInOnScroll direction="right" delay={150}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-4">

                <div className="text-center mb-2">
                  <p className="text-sm text-gray-500 mb-1">Estimated Monthly In-Hand</p>
                  <p className="text-4xl font-normal text-[#D7A764]">{formatCurrency(r.inHand)}</p>
                </div>

                {/* Salary breakdown */}
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Salary Breakdown</p>
                  {[
                    { label: "Gross Monthly", value: r.monthly, color: "text-gray-900 font-medium" },
                    { label: "Basic Salary", value: r.basic, color: "text-gray-600" },
                    { label: "House Rent Allowance (HRA)", value: r.hra, color: "text-gray-600" },
                    { label: "PF Deduction (Provident Fund)", value: -r.pf, color: "text-orange-500" },
                    { label: "Est. Income Tax (Monthly)", value: -r.monthlyTax, color: "text-orange-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                      <span className="text-gray-600 text-xs sm:text-sm">{label}</span>
                      <span className={`font-normal text-xs sm:text-sm ${color}`}>
                        {value < 0 ? `− ${formatCurrency(Math.abs(value))}` : formatCurrency(value)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Living Costs Estimate */}
                <div className="space-y-2 text-sm pt-2">
                  <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Estimated Expenses in {cityData[city]?.label}</p>
                  {[
                    { label: "Rent / PG Accomodation", value: r.rentEstimate },
                    { label: "Food & Groceries", value: r.foodEstimate },
                    { label: "Local Commute & Fuel", value: r.transportEstimate },
                    { label: "Misc & Entertainment", value: 5000 },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50 text-xs sm:text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-normal text-gray-700">{formatCurrency(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-1.5 text-xs sm:text-sm font-medium">
                    <span className="text-gray-700">Total Living Cost</span>
                    <span className="text-gray-900">{formatCurrency(r.totalLiving)}</span>
                  </div>
                </div>

                {/* Savings & Surplus */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
                    <span className="text-gray-700">Monthly Savings / Surplus</span>
                    <span className={r.savingsEstimate >= 0 ? "text-green-600" : "text-red-500"}>
                      {formatCurrency(r.savingsEstimate)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {r.inHand > 0 && (
                    <div className="pt-2">
                      <div className="flex rounded-full overflow-hidden h-3 mb-2">
                        <div
                          className="bg-[#00274D] transition-all duration-500"
                          style={{ width: `${Math.max(0, Math.min(100, livingPct))}%` }}
                        />
                        <div
                          className="bg-[#D7A764] transition-all duration-500"
                          style={{ width: `${Math.max(0, Math.min(100, savingPctFormatted))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#00274D] inline-block" />
                          Expenses {livingPct.toFixed(0)}%
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#D7A764] inline-block" />
                          Savings {savingPctFormatted.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buying potential advice */}
                {r.savingsEstimate > 0 && (
                  <div className="bg-[#D7A764]/10 rounded-xl p-4 text-center mt-3">
                    <p className="text-xs sm:text-sm text-navy font-semibold mb-1">Affordability Advisor</p>
                    <p className="text-xs text-navy/80 leading-relaxed mb-3">
                      Based on your monthly surplus of <strong>{formatCurrency(r.savingsEstimate)}</strong>, you could easily support an EMI for a home loan of up to <strong>{formatLakh(r.savingsEstimate * 100)}</strong>!
                    </p>
                    <a href="/projects/ongoing/bangalore" className="inline-block bg-[#00274D] text-white px-4 py-2 rounded-lg text-xs hover:bg-[#00274D]/90 transition-colors">
                      Browse Properties →
                    </a>
                  </div>
                )}
              </div>
            </FadeInOnScroll>
          </div>

          <FadeInOnScroll direction="up" delay={200}>
            <p className="text-center text-xs text-gray-400 mt-8">
              * Living costs and tax brackets are approximations for reference only.
            </p>
          </FadeInOnScroll>

        </div>
      </main>
    </>
  );
};

export default SalaryAdvisorPage;
