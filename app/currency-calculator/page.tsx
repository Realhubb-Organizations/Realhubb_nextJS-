"use client";

import { useState, useCallback } from "react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

// Static approximate rates relative to INR (as of early 2025)
// These are fallback rates; in production you'd fetch from an API
const RATES_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 83.5,
  EUR: 90.2,
  GBP: 105.8,
  AED: 22.7,
  SGD: 61.5,
  CAD: 61.0,
  AUD: 54.5,
  JPY: 0.56,
  CHF: 93.0,
  HKD: 10.7,
};

const CURRENCY_LABELS: Record<string, string> = {
  INR: "Indian Rupee",
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  AED: "UAE Dirham",
  SGD: "Singapore Dollar",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  HKD: "Hong Kong Dollar",
};

const CURRENCY_FLAGS: Record<string, string> = {
  INR: "🇮🇳", USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧",
  AED: "🇦🇪", SGD: "🇸🇬", CAD: "🇨🇦", AUD: "🇦🇺",
  JPY: "🇯🇵", CHF: "🇨🇭", HKD: "🇭🇰",
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("INR");

  const convert = useCallback((value: string, fromCcy: string, toCcy: string) => {
    const num = parseFloat(value) || 0;
    const inINR = num * (RATES_TO_INR[fromCcy] ?? 1);
    return inINR / (RATES_TO_INR[toCcy] ?? 1);
  }, []);

  const result = convert(amount, from, to);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const formatResult = (value: number) => {
    if (value === 0) return "0";
    if (value >= 1000000) return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    if (value >= 1) return value.toLocaleString("en-IN", { maximumFractionDigits: 4 });
    return value.toFixed(6);
  };

  const currencies = Object.keys(RATES_TO_INR);

  return (
    <>
      <SEO
        title="Currency Converter | RealHubb"
        description="Convert currencies instantly with our easy-to-use currency calculator for real estate and investment planning."
      />

      <main className="min-h-screen bg-[#faf6f1] pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          <FadeInOnScroll direction="up">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#00274D] mb-3">
                Currency Converter
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                Convert between major currencies for your investment planning.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="up" delay={100}>
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">

              {/* Amount input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-normal focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30"
                  placeholder="Enter amount"
                />
              </div>

              {/* From / Swap / To */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30 bg-white"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {CURRENCY_FLAGS[c]} {c} — {CURRENCY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swap}
                  className="mt-5 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-[#D7A764]/10 hover:border-[#D7A764] transition-colors text-gray-500 hover:text-[#D7A764] text-lg"
                  aria-label="Swap currencies"
                >
                  ⇄
                </button>

                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30 bg-white"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {CURRENCY_FLAGS[c]} {c} — {CURRENCY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="bg-[#00274D] rounded-2xl p-6 text-center">
                <p className="text-sm text-white/60 mb-2">
                  {parseFloat(amount) || 0} {CURRENCY_FLAGS[from]} {from} =
                </p>
                <p className="text-4xl font-normal text-[#D7A764]">
                  {formatResult(result)}
                </p>
                <p className="text-lg text-white/80 font-medium mt-1">
                  {CURRENCY_FLAGS[to]} {to}
                </p>
              </div>

              {/* Rate reference */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 text-center mb-3 font-medium">
                  Exchange Rate Reference (vs INR)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currencies.filter((c) => c !== "INR").map((c) => (
                    <div key={c} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-xs">
                      <span className="text-gray-600">{CURRENCY_FLAGS[c]} {c}</span>
                      <span className="font-normal text-gray-800">₹{RATES_TO_INR[c]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="up" delay={200}>
            <p className="text-center text-xs text-gray-400 mt-8">
              * Rates are approximate and for reference only. For live rates, please check your bank or a financial platform.
            </p>
          </FadeInOnScroll>

        </div>
      </main>
    </>
  );
};

export default CurrencyConverter;
