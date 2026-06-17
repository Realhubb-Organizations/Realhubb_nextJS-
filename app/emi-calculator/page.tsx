"use client";

import { useState, useCallback } from "react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

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

      <main className="min-h-screen bg-[#faf6f1] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <FadeInOnScroll direction="up">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#00274D] mb-3">
                EMI Calculator
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                Estimate your monthly home loan payment in seconds.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Inputs */}
            <FadeInOnScroll direction="left" delay={100}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">

                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹5 L</span><span>₹5 Cr</span>
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
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rate (%)</label>
                    <input
                      type="number"
                      value={rate}
                      step="0.1"
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tenure (yrs)</label>
                    <input
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Results */}
            <FadeInOnScroll direction="right" delay={150}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between">

                {/* Monthly EMI */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                  <p className="text-4xl font-normal text-[#D7A764]">{formatCurrency(emi)}</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Principal Amount</span>
                    <span className="text-sm font-normal text-gray-900">
                      {formatCurrency(parseFloat(principal) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Interest</span>
                    <span className="text-sm font-normal text-[#D7A764]">
                      {formatCurrency(totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Total Payment</span>
                    <span className="text-sm font-normal text-gray-900">
                      {formatCurrency(totalPayment)}
                    </span>
                  </div>
                </div>

                {/* Visual bar */}
                <div>
                  <div className="flex rounded-full overflow-hidden h-3 mb-2">
                    <div
                      className="bg-[#00274D] transition-all duration-500"
                      style={{ width: `${principalPct}%` }}
                    />
                    <div
                      className="bg-[#D7A764]/60 transition-all duration-500"
                      style={{ width: `${interestPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00274D] inline-block" />
                      Principal {principalPct.toFixed(1)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#D7A764]/60 inline-block" />
                      Interest {interestPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Disclaimer */}
          <FadeInOnScroll direction="up" delay={200}>
            <p className="text-center text-xs text-gray-400 mt-8">
              * This calculator provides an estimate only. Actual EMI may vary based on your lender's terms and conditions.
            </p>
          </FadeInOnScroll>

        </div>
      </main>
    </>
  );
};

export default EMICalculatorPage;
