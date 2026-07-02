const cityComparisons = [
  { city: "Mumbai", rent: "₹45,000", costOfLiving: "High", yield: "3.5% - 4.2%", profile: "Financial Hub" },
  { city: "Delhi NCR", rent: "₹32,500", costOfLiving: "Moderate-High", yield: "3.2% - 3.8%", profile: "Administrative / Corporate" },
  { city: "Bangalore", rent: "₹28,000", costOfLiving: "Moderate", yield: "4.0% - 4.5%", profile: "IT & Startups" },
  { city: "Pune", rent: "₹24,000", costOfLiving: "Moderate", yield: "3.8% - 4.3%", profile: "Automotive & Tech" },
  { city: "Chennai", rent: "₹22,000", costOfLiving: "Low-Moderate", yield: "3.6% - 4.1%", profile: "Manufacturing & SaaS" },
  { city: "Hyderabad", rent: "₹22,000", costOfLiving: "Low-Moderate", yield: "4.2% - 4.8%", profile: "Pharma & IT Parks" },
];

export default function SalaryAdvisorFactualData() {
  return (
    <section className="mt-16 space-y-12">
      {/* Table Section */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl p-6 sm:p-8">
        <h2 className="speakable-title font-heading text-xl md:text-2xl text-navy font-normal mb-3">
          Comparative Rent & Cost of Living Matrix (2026)
        </h2>
        <p className="speakable-summary text-sm text-gray-500 font-light mb-6">
          A server-rendered analysis of average rental budgets, cost indices, and rental yields across major Indian micro-markets. Use this guide to assess property affordability relative to take-home pay.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-150 text-gray-400 font-semibold bg-gray-50/50">
                <th className="py-3 px-4">Target City</th>
                <th className="py-3 px-4">Average 2BHK Rent</th>
                <th className="py-3 px-4">Cost of Living</th>
                <th className="py-3 px-4">Average Rental Yield</th>
                <th className="py-3 px-4">Economic Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-navy font-light">
              {cityComparisons.map((row) => (
                <tr key={row.city} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-normal">{row.city}</td>
                  <td className="py-3.5 px-4">{row.rent}</td>
                  <td className="py-3.5 px-4">{row.costOfLiving}</td>
                  <td className="py-3.5 px-4 text-gold font-normal">{row.yield}</td>
                  <td className="py-3.5 px-4 text-gray-500">{row.profile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Semantic Advisory QA Nodes */}
      <div className="bg-white rounded-[24px] border border-gray-150/80 shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="speakable-title font-heading text-xl md:text-2xl text-navy font-normal mb-1">
          Hyper-Local Salary & Real Estate Advisory FAQs
        </h2>
        <p className="text-xs text-gray-400 font-light mb-6">
          Expert recommendations for matching career relocations, monthly take-home salary, and property investments.
        </p>

        <div className="space-y-6 divide-y divide-gray-100">
          <div className="pt-0 space-y-2">
            <h3 className="speakable-title text-sm md:text-base font-medium text-navy">
              Is there a groundwater shortage risk for high-rises on Hennur Road, Bangalore?
            </h3>
            <p className="speakable-summary text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              Yes, parts of Hennur Road and nearby Thanisandra experience seasonal groundwater depletion. When purchasing a flat in these high-rise communities, verify if the builder provides dedicated BWSSB Cauvery water connections, has rainwater harvesting systems in place, and check the community&apos;s reliance on private water tankers.
            </p>
          </div>

          <div className="pt-6 space-y-2">
            <h3 className="speakable-title text-sm md:text-base font-medium text-navy">
              How do I align my take-home salary to a home loan limit in Kokapet, Hyderabad?
            </h3>
            <p className="speakable-summary text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              Kokapet is a premium market with properties starting around ₹1.2 Cr. Under conservative lending guidelines, your monthly home loan EMI should not exceed 45% of your net monthly take-home pay. For a loan of ₹1 Cr (at 8.5% interest for 20 years), the EMI is approx ₹86,800, which requires a minimum net take-home salary of ₹1.9L per month.
            </p>
          </div>

          <div className="pt-6 space-y-2">
            <h3 className="speakable-title text-sm md:text-base font-medium text-navy">
              Are there properties in Chennai with high rental yields near OMR IT parks?
            </h3>
            <p className="speakable-summary text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              OMR (Old Mahabalipuram Road) is Chennai&apos;s primary tech corridor. Studio apartments and 2BHK properties near Thoraipakkam and Sholinganallur offer steady rental yields of 3.8% to 4.2% due to robust demand from tech professionals. Check properties that offer gated security and backup power as they fetch 15% higher rent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
