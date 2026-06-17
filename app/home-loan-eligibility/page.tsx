"use client";

import { useState, useCallback } from "react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

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

      <main className="min-h-screen bg-[#faf6f1] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <FadeInOnScroll direction="up">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#00274D] mb-3">
                Home Loan Eligibility
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                Find out how much home loan you qualify for based on your income.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Inputs */}
            <FadeInOnScroll direction="left" delay={100}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">

                {/* Monthly Income */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Monthly Net Income</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹20,000</span><span>₹10,00,000</span>
                  </div>
                </div>

                {/* Existing Obligations */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Existing Monthly EMIs</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹0</span><span>₹2,00,000</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Interest Rate (p.a.)</label>
                    <span className="text-sm font-normal text-[#D7A764]">{rate}%</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>6%</span><span>18%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
                    <span className="text-sm font-normal text-[#D7A764]">{tenure} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 yr</span><span>30 yrs</span>
                  </div>
                </div>

                {/* Manual inputs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Monthly Income (₹)</label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Existing EMIs (₹)</label>
                    <input
                      type="number"
                      value={monthlyObligations}
                      onChange={(e) => setMonthlyObligations(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Results */}
            <FadeInOnScroll direction="right" delay={150}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between">

                {/* Eligible Loan Amount */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">You may be eligible for</p>
                  <p className="text-4xl font-normal text-[#D7A764]">{formatLakh(loanAmount)}</p>
                  <p className="text-xs text-gray-400 mt-1">home loan</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Monthly Net Income</span>
                    <span className="text-sm font-normal text-gray-900">
                      {formatCurrency(parseFloat(monthlyIncome) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Existing EMI Obligations</span>
                    <span className="text-sm font-normal text-orange-500">
                      − {formatCurrency(parseFloat(monthlyObligations) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Max Eligible EMI (50% FOIR)</span>
                    <span className="text-sm font-normal text-green-600">
                      {formatCurrency(maxEMI)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Eligible Loan Amount</span>
                    <span className="text-sm font-normal text-[#D7A764]">{formatLakh(loanAmount)}</span>
                  </div>
                </div>

                {/* FOIR info */}
                <div className="bg-[#D7A764]/10 rounded-xl p-4">
                  <p className="text-xs text-[#00274D] font-medium mb-1">What is FOIR?</p>
                  <p className="text-xs text-[#D7A764] leading-relaxed">
                    Fixed Obligation to Income Ratio (FOIR) is used by banks to assess loan eligibility.
                    Most lenders allow up to <strong>50%</strong> of your net income towards total EMIs.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Disclaimer */}
          <FadeInOnScroll direction="up" delay={200}>
            <p className="text-center text-xs text-gray-400 mt-8">
              * This is an indicative estimate only. Actual loan eligibility depends on your credit score,
              employment type, lender policies, and other factors.
            </p>
          </FadeInOnScroll>

        </div>
      </main>
    </>
  );
};

export default HomeLoanEligibilityPage;
