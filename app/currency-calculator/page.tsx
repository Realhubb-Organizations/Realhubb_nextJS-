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

          <div className="max-w-3xl mx-auto relative z-10 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-normal bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 mb-6 inline-block">
              RealHubb Financial Suite
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-normal text-white max-w-3xl leading-tight mx-auto">
              Currency <span className="text-gold">Converter</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mt-4 leading-relaxed font-light mx-auto">
              Convert between major global currencies (USD, AED, SGD, EUR) to INR for real estate purchase and NRI investments.
            </p>
          </div>
        </section>

        {/* Content Area */}
        <section className="page-padding relative z-20 -mt-16 md:-mt-20 pb-24 pt-4">
          <div className="max-w-2xl mx-auto">
            <FadeInOnScroll direction="up" delay={100}>
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
                {/* Amount input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-normal focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764]"
                    placeholder="Enter amount"
                  />
                </div>

                {/* From / Swap / To */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">From</label>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764] bg-white cursor-pointer"
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
                    className="mt-4 w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-[#D7A764]/10 hover:border-[#D7A764] transition-colors text-gray-500 hover:text-[#D7A764] text-sm font-bold shrink-0 shadow-sm"
                    aria-label="Swap currencies"
                  >
                    ⇄
                  </button>

                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">To</label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D7A764]/50 focus:border-[#D7A764] bg-white cursor-pointer"
                    >
                      {currencies.map((c) => (
                        <option key={c} value={c}>
                          {CURRENCY_FLAGS[c]} {c} — {CURRENCY_LABELS[c]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result Navy Plate */}
                <div className="bg-navy rounded-2xl p-6 text-center text-white relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                  <p className="text-xs text-white/60 mb-1 font-light">
                    {parseFloat(amount) || 0} {CURRENCY_FLAGS[from]} {from} =
                  </p>
                  <p className="text-3xl sm:text-4xl font-normal text-gold">
                    {formatResult(result)}
                  </p>
                  <p className="text-sm text-white/80 font-medium mt-1">
                    {CURRENCY_FLAGS[to]} {to} ({CURRENCY_LABELS[to]})
                  </p>
                </div>

                {/* Rate reference list */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs text-navy font-normal text-center mb-3">
                    Exchange Rate Reference (vs INR)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currencies.filter((c) => c !== "INR").map((c) => (
                      <div key={c} className="flex justify-between items-center bg-gray-50 border border-gray-100/50 rounded-xl px-3 py-2 text-xs">
                        <span className="text-gray-500">{CURRENCY_FLAGS[c]} {c}</span>
                        <span className="font-normal text-navy">₹{RATES_TO_INR[c]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Suite Navigator */}
            <div className="mt-16 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm text-center">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-normal mb-5">
                RealHubb Financial Suite
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {quickLinks.map((link) => {
                  const isCurrent = link.href === "/currency-calculator";
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
                * Rates are approximate and for reference only. NRI purchase transactions are subject to FEMA guidelines and banking terms.
              </p>
            </FadeInOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default CurrencyConverter;
