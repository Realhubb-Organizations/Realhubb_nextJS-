const yieldComparisons = [
  { city: "Bangalore", area: "Sarjapur Road", avgValue: "₹85 L - 1.2 Cr", monthlyRent: "₹35,000 - 45,000", yieldRange: "4.2% - 4.6%", drivers: "Tech Parks, Elite Schools" },
  { city: "Bangalore", area: "Whitefield", avgValue: "₹90 L - 1.4 Cr", monthlyRent: "₹38,000 - 48,000", yieldRange: "4.0% - 4.5%", drivers: "Metro Line, ITPL Hub" },
  { city: "Hyderabad", area: "Gachibowli", avgValue: "₹1.1 Cr - 1.6 Cr", monthlyRent: "₹42,000 - 55,000", yieldRange: "4.3% - 4.7%", drivers: "Financial District, Outer Ring Road" },
  { city: "Hyderabad", area: "Kokapet", avgValue: "₹1.3 Cr - 2.2 Cr", monthlyRent: "₹48,000 - 65,000", yieldRange: "4.0% - 4.4%", drivers: "High-end Luxury, ORR connectivity" },
  { city: "Chennai", area: "OMR (Sholinganallur)", avgValue: "₹65 L - 95 L", monthlyRent: "₹22,000 - 28,000", yieldRange: "3.8% - 4.2%", drivers: "ELCOT SEZ, Affordable Gated" },
  { city: "Chennai", area: "Pallikaranai", avgValue: "₹70 L - 1.1 Cr", monthlyRent: "₹24,000 - 32,000", yieldRange: "3.7% - 4.1%", drivers: "Proximity to Velachery, Tech hubs" },
];

export default function RentalYieldFactualData() {
  return (
    <section className="mt-16 space-y-12">
      {/* Yield table */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl p-6 sm:p-8">
        <h2 className="speakable-title font-heading text-xl md:text-2xl text-navy font-normal mb-3">
          Local Micro-Market Rental Yield Benchmarks (2026)
        </h2>
        <p className="speakable-summary text-sm text-gray-500 font-light mb-6">
          A comparative server-rendered study of average rental yields, residential property valuations, and monthly rental cash flow rates across key high-growth micro-markets.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-150 text-gray-400 font-semibold bg-gray-50/50">
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Micro-Market</th>
                <th className="py-3 px-4">Avg Property Price</th>
                <th className="py-3 px-4">Average Rent/mo</th>
                <th className="py-3 px-4">Typical Rental Yield</th>
                <th className="py-3 px-4">Growth Drivers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-navy font-light">
              {yieldComparisons.map((row, idx) => (
                <tr key={`${row.area}_${idx}`} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-normal">{row.city}</td>
                  <td className="py-3.5 px-4 font-normal text-gold">{row.area}</td>
                  <td className="py-3.5 px-4">{row.avgValue}</td>
                  <td className="py-3.5 px-4">{row.monthlyRent}</td>
                  <td className="py-3.5 px-4 font-medium text-navy">{row.yieldRange}</td>
                  <td className="py-3.5 px-4 text-gray-500">{row.drivers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AEO conversational Q&A */}
      <div className="bg-white rounded-[24px] border border-gray-150/80 shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="speakable-title font-heading text-xl md:text-2xl text-navy font-normal mb-1">
          Rental Yield & Property Appreciation Advisory
        </h2>
        <p className="text-xs text-gray-400 font-light mb-6">
          Answers to critical investor questions regarding recurring rental returns and RERA timeline compliance.
        </p>

        <div className="space-y-6 divide-y divide-gray-100">
          <div className="pt-0 space-y-2">
            <h3 className="speakable-title text-sm md:text-base font-medium text-navy">
              Which area gives the best rental returns across South India?
            </h3>
            <p className="speakable-summary text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              Currently, micro-markets like Gachibowli in Hyderabad and Sarjapur Road in Bangalore offer the highest residential rental yields in South India, ranging from 4.2% to 4.7% per annum. This is driven by high density IT parks, a large population of young corporate tenants, and well-developed social infrastructure.
            </p>
          </div>

          <div className="pt-6 space-y-2">
            <h3 className="speakable-title text-sm md:text-base font-medium text-navy">
              What are the average rental yields for properties near Bangalore metro lines?
            </h3>
            <p className="speakable-summary text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              Properties situated within 1 km of active Namma Metro stations in Bangalore (such as Kanakapura Road, Indiranagar, or Whitefield) command a 15-20% rent premium. The rental yields for these transit-oriented developments hover around 4.1% to 4.5% compared to 3.2% in non-metro areas, with minimal occupancy vacancy risk.
            </p>
          </div>

          <div className="pt-6 space-y-2">
            <h3 className="speakable-title text-sm md:text-base font-medium text-navy">
              How do RERA timelines affect the rental yield calculations for investors?
            </h3>
            <p className="speakable-summary text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              Construction delays directly destroy investor returns by postponing the rental cash flow while interest on home loans continues. Always check the RERA-committed possession date on the state portal. RealHubb recommends under-construction properties only if they are from RERA-compliant builders with a proven delivery track record.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
