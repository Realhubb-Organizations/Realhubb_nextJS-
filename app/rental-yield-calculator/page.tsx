"use client";

import { useState, useCallback } from "react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

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

      <main className="min-h-screen bg-[#faf6f1] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <FadeInOnScroll direction="up">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#00274D] mb-3">
                Rental Yield Calculator
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                Evaluate the return on your rental property investment.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Inputs */}
            <FadeInOnScroll direction="left" delay={100}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">

                {/* Property Value */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Property Value</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹5 L</span><span>₹10 Cr</span>
                  </div>
                </div>

                {/* Monthly Rent */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Monthly Rent</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹5,000</span><span>₹5,00,000</span>
                  </div>
                </div>

                {/* Annual Expenses */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Annual Expenses</label>
                    <span className="text-sm font-normal text-[#D7A764]">
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
                    className="w-full"
                    style={{ accentColor: '#D7A764' }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹0</span><span>₹5,00,000</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Maintenance, taxes, insurance, vacancies, etc.
                  </p>
                </div>

                {/* Manual inputs */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Property (₹)</label>
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rent/mo (₹)</label>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Expenses/yr (₹)</label>
                    <input
                      type="number"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                    />
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Results */}
            <FadeInOnScroll direction="right" delay={150}>
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between">

                {/* Gross Yield */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Gross Rental Yield</p>
                  <p className={`text-4xl font-normal ${yieldColor(grossYield)}`}>
                    {grossYield.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">per annum</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Annual Rental Income</span>
                    <span className="text-sm font-normal text-gray-900">
                      {formatCurrency(annualRent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Annual Expenses</span>
                    <span className="text-sm font-normal text-orange-500">
                      − {formatCurrency(parseFloat(annualExpenses) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Net Annual Income</span>
                    <span className="text-sm font-normal text-green-600">
                      {formatCurrency(netAnnualIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Net Rental Yield</span>
                    <span className={`text-sm font-normal ${yieldColor(netYield)}`}>
                      {netYield.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-gray-600">Investment Payback Period</span>
                    <span className="text-sm font-normal text-gray-900">
                      {paybackYears > 0 ? `${paybackYears.toFixed(1)} yrs` : "—"}
                    </span>
                  </div>
                </div>

                {/* Yield guide */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <p className="text-xs text-gray-500 font-medium mb-2">Yield Benchmark</p>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    ≥ 5% — Good return
                  </div>
                  <div className="flex items-center gap-2 text-xs text-orange-500">
                    <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                    3–5% — Average return
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    &lt; 3% — Below average
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          <FadeInOnScroll direction="up" delay={200}>
            <p className="text-center text-xs text-gray-400 mt-8">
              * Figures are indicative. Actual returns depend on market conditions, occupancy rates, and local regulations.
            </p>
          </FadeInOnScroll>

        </div>
      </main>
    </>
  );
};

export default RentalYieldPage;
