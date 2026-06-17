"use client";

import Link from "next/link";
import { Calculator, DollarSign, Percent, TrendingUp, Briefcase } from "lucide-react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import SEO from "@/components/seo/SEO";

const tools = [
  {
    name: "EMI Calculator",
    description: "Estimate your monthly home loan payments based on principal, rate, and loan tenure.",
    href: "/emi-calculator",
    icon: Calculator,
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Currency Converter",
    description: "Convert major global currencies (USD, AED, SGD, etc.) to INR for real estate planning.",
    href: "/currency-calculator",
    icon: DollarSign,
    color: "bg-green-50 text-green-600",
  },
  {
    name: "Home Loan Eligibility",
    description: "Find out your maximum eligible home loan amount based on your net income and obligations.",
    href: "/home-loan-eligibility",
    icon: TrendingUp,
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Rental Yield Calculator",
    description: "Analyze the gross and net returns on your property investment to estimate payback years.",
    href: "/rental-yield-calculator",
    icon: Percent,
    color: "bg-orange-50 text-orange-600",
  },
  {
    name: "Salary Advisor",
    description: "Break down your CTC to estimate in-hand income, city living costs, and home budget.",
    href: "/salary-advisor",
    icon: Briefcase,
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function ToolsHubPage() {
  return (
    <>
      <SEO
        title="Investment & Property Calculators | RealHubb"
        description="Access our suite of financial planning tools: Home Loan EMI Calculator, Currency Converter, Home Loan Eligibility, Rental Yield, and Salary Advisor."
      />

      <main className="min-h-screen bg-[#faf6f1] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <FadeInOnScroll direction="up">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-[#D7A764] font-semibold">RealHubb Tools</span>
              <h1 className="text-4xl sm:text-5xl font-normal text-[#00274D] mt-3 mb-4">
                Financial Planning Suite
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Evaluate budgets, calculate loan payments, and optimize property investment returns with our tailored financial calculators.
              </p>
            </div>
          </FadeInOnScroll>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <FadeInOnScroll key={tool.name} direction="up" delay={index * 100}>
                  <Link
                    href={tool.href}
                    className="group flex flex-col justify-between h-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-normal text-[#00274D] group-hover:text-[#D7A764] transition-colors duration-200 mb-3">
                        {tool.name}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {tool.description}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="flex items-center text-sm font-medium text-[#00274D] group-hover:text-[#D7A764] transition-colors duration-200">
                      Open Tool <span className="ml-2 transition-transform group-hover:translate-x-1 duration-200">→</span>
                    </div>
                  </Link>
                </FadeInOnScroll>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}
