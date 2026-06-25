import { company } from "@/data/company";

export default function HomeSEOContent() {
  return (
    <section className="py-20 bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="page-padding max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3">
            Real Estate Advisory
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
            Your Trusted Guide to <span className="text-gold">Indian Real Estate</span>
          </h2>
        </div>

        {/* Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-sm md:text-[15px] text-gray-500 font-light leading-relaxed mb-16">
          <div className="space-y-6">
            <h3 className="font-heading text-xl text-navy font-normal">
              Navigating Bangalore, Hyderabad & Chennai Property Markets
            </h3>
            <p>
              Buying a home is one of the most significant financial and emotional milestones in a person's life. 
              At RealHubb Ventures, we simplify this journey. Operating in India's leading tech corridors—Bangalore, 
              Hyderabad, and Chennai—we connect home buyers with verified residential apartments, luxury villas, 
              and premium plots.
            </p>
            <p>
              Our portfolio comprises only RERA-registered projects, ensuring complete regulatory compliance, 
              transparency, and security for your investment. Whether you are looking for a ready-to-move 2BHK 
              flat near Manyata Tech Park in Hebbal, a spacious 3BHK villa in Whitefield, or a smart investment 
              in Gachibowli, Hyderabad, our team of seasoned advisors is here to help.
            </p>
            <h3 className="font-heading text-xl text-navy font-normal">
              Why Zero Brokerage Matters
            </h3>
            <p>
              Traditional property hunting often involves heavy brokerage fees and hidden charges that inflate 
              your purchase price. RealHubb operates on a **zero brokerage** policy for buyers. Our consultation, 
              accompanied site visits, loan assistance, and legal document coordination are 100% free of charge 
              to you. We partner directly with reputed developers to bring you builder-direct pricing and exclusive 
              inventory.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-heading text-xl text-navy font-normal">
              E-E-A-T and RERA Compliance: Safe Home Buying
            </h3>
            <p>
              With over 17 years of experience in the real estate sector, our co-founders Sanjeev Ranjan Singh 
              and Srikanth Baddila have established a benchmark of trust and reliability. Every project listed 
              on RealHubb undergoes rigorous verification against the official RERA database. We check land titles, 
              escrow accounts, building plan approvals, and delivery timelines so you don't face possession delays.
            </p>
            <p>
              In addition to property search, we provide end-to-end transaction support. This includes helping you 
              calculate your EMI using our advanced financial tools, advising on home loan eligibility, and 
              guiding you through the final registration and stamp duty processes.
            </p>
            <h3 className="font-heading text-xl text-navy font-normal">
              Investment Outlook & Rental Yields
            </h3>
            <p>
              Real estate remains a highly secure asset class in India. In 2026, tech-driven regions like Bangalore 
              East (Whitefield, Sarjapur Road) and Hyderabad (Financial District) continue to offer stable rental yields 
              of 4% to 5% alongside 10% to 12% annual capital appreciation. We publish regular market reports 
              and locality guides to help you make data-driven investment decisions.
            </p>
          </div>
        </div>

        {/* Deep Dive Micro-Markets */}
        <div className="space-y-12 text-sm md:text-[15px] text-gray-500 font-light leading-relaxed mb-16">
          <h3 className="font-heading text-2xl text-navy font-normal border-b border-gray-100 pb-3">
            Deep Dive: Top Property Micro-Markets
          </h3>
          
          <div className="space-y-6">
            <h4 className="font-heading text-lg text-navy font-normal">
              1. Bangalore's Top High-Growth Localities
            </h4>
            <p>
              Bangalore's real estate market is heavily driven by its thriving technology sector. Whitefield remains 
              the crown jewel of Bangalore East, attracting thousands of IT professionals annually. The presence of 
              large IT parks like International Tech Park Bangalore (ITPB) and Vydehi, combined with the seamlessly 
              functioning Namma Metro Purple Line extension, has kept demand robust. Homebuyers can find options ranging 
              from premium 2BHK apartments starting at ₹80 Lakhs to ultra-luxury gated community villas costing ₹4 Crores 
              and above.
            </p>
            <p>
              Further south, Sarjapur Road has evolved into a premier residential hub. Its proximity to Outer Ring Road (ORR) 
              tech parks, HSR Layout, and Electronic City makes it highly desirable for families. The area boasts excellent 
              educational institutions, making it a hotspot for double-income families seeking 3BHK premium residences. 
              Meanwhile, North Bangalore, particularly Hebbal and Devanahalli, represents the future of Bangalore's expansion. 
              Driven by the Kempegowda International Airport corridor, upcoming business parks, and excellent connectivity 
              via the National Highway (NH-44), Hebbal is experiencing high demand for luxury high-rises, while Devanahalli 
              is preferred for premium villa plots and gated communities.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading text-lg text-navy font-normal">
              2. Hyderabad's High-Rise IT Corridors
            </h4>
            <p>
              Hyderabad's real estate market is characterized by spectacular high-rise developments, planned infrastructure, 
              and spacious layouts. The western zone, comprising Gachibowli, Kokapet, and Kondapur, forms the epicenter 
              of this growth. Gachibowli, a major financial and tech district, offers direct access to international IT giants, 
              rendering it exceptionally convenient for walk-to-work lifestyles. The locality features highly developed retail 
              and social infrastructure, catering to corporate executives.
            </p>
            <p>
              Kokapet, designated as the "Golden Mile," has emerged as Hyderabad's most premium luxury destination. Characterized 
              by skyscrapers exceeding 40 to 50 floors, Kokapet offers panoramic lake views, state-of-the-art clubhouses, and 
              gated communities with advanced security systems. The Outer Ring Road (ORR) provides excellent connectivity from 
              Kokapet to the airport and other parts of the city. Kondapur and neighboring Tellapur are highly favored by buyers 
              seeking relatively affordable options without compromising on modern amenities and IT corridor accessibility.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading text-lg text-navy font-normal">
              3. Chennai's IT Expressways and Coastal Localities
            </h4>
            <p>
              Chennai's property market blends commercial dynamism with traditional living. Old Mahabalipuram Road (OMR), 
              often termed the IT Corridor, is the primary destination for professionals working in Tidel Park and surrounding 
              IT SEZs. Localities like Sholinganallur and Karapakkam on OMR offer high-rise apartment complexes with modern 
              recreational spaces, sewage treatment plants, and backup power facilities. These apartments offer solid rental 
              demand and stable asset appreciation.
            </p>
            <p>
              East Coast Road (ECR), running parallel to OMR, is the city's premier leisure and luxury corridor. Buyers seeking 
              beachfront villas, independent bungalows, and serene environments choose ECR for its clean air, scenic beauty, 
              and proximity to top-tier resorts. Connecting roads like Medavakkam and Pallikaranai provide excellent mid-segment 
              housing options, linking the IT expressway to suburban railway stations and the international airport, making them 
              prime targets for middle-income buyers.
            </p>
          </div>
        </div>

        {/* Homebuyer's Checklist */}
        <div className="space-y-8 text-sm md:text-[15px] text-gray-500 font-light leading-relaxed mb-16">
          <h3 className="font-heading text-2xl text-navy font-normal border-b border-gray-100 pb-3">
            The Essential Indian Homebuyer's Checklist
          </h3>
          <p>
            Buying a home requires careful legal, financial, and physical due diligence. Below is the checklist 
            every homebuyer must follow to ensure their investment is secure and hassle-free:
          </p>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong className="text-navy font-normal">RERA Verification:</strong> Never buy a property that does not 
              have a valid RERA registration number from the respective state authority (RERA Karnataka, TS RERA, or TN RERA). 
              Verify the developer's registered documents, approved layout plan, quarterly progress reports, and expected 
              possession date on the official RERA portal.
            </li>
            <li>
              <strong className="text-navy font-normal">Clear Land Title & Deeds:</strong> Ensure the developer owns the 
              land or has a registered Joint Development Agreement (JDA) with the landowners. Review the Mother Deed (tracing 
              ownership history for at least 30 years) and obtain an Encumbrance Certificate (EC) to confirm the land is free 
              from legal disputes, unpaid loans, or monetary liabilities.
            </li>
            <li>
              <strong className="text-navy font-normal">Commencement & Occupancy Certificates:</strong> Before construction 
              starts, the builder must obtain a Commencement Certificate (CC) from the local municipal body (BBMP, GHMC, or CMDA). 
              Upon completion, the developer must secure an Occupancy Certificate (OC), which proves the building complies 
              with all safety regulations, structural codes, and civic laws. Living in a property without an OC is illegal and 
              makes obtaining water and electricity connections highly difficult.
            </li>
            <li>
              <strong className="text-navy font-normal">Understanding Area Metrics:</strong> Carefully distinguish between 
              Carpet Area (the actual usable floor area inside the walls), Built-up Area (carpet area plus the thickness of 
              internal and external walls), and Super Built-up Area (built-up area plus proportionate common areas like lobbies, 
              elevators, stairs, and clubhouses). The RERA Act mandates that builders charge buyers strictly based on Carpet Area.
            </li>
          </ul>
        </div>

        {/* Property Configurations */}
        <div className="space-y-8 text-sm md:text-[15px] text-gray-500 font-light leading-relaxed mb-16">
          <h3 className="font-heading text-2xl text-navy font-normal border-b border-gray-100 pb-3">
            Choosing Your Configuration: Apartments vs. Villas vs. Plots
          </h3>
          <p>
            Your choice of property configuration determines your lifestyle, monthly maintenance costs, and long-term 
            financial returns. RealHubb helps you evaluate these options based on your personal needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-cream/40 border border-gray-100 rounded-2xl p-6 space-y-3">
              <h4 className="font-heading text-base text-navy font-medium">Apartments (2BHK / 3BHK)</h4>
              <p className="text-xs leading-relaxed">
                Ideal for young professionals and nuclear families. Apartments offer robust security, shared amenities 
                (gym, pool, power backup), lower entry prices, and ease of renting out. However, they offer limited 
                privacy and zero ownership of the land beneath the structure.
              </p>
            </div>
            
            <div className="bg-cream/40 border border-gray-100 rounded-2xl p-6 space-y-3">
              <h4 className="font-heading text-base text-navy font-medium">Luxury Villas</h4>
              <p className="text-xs leading-relaxed">
                Perfect for large families or buyers seeking complete privacy, independent spaces, and personal gardens. 
                Villas provide high status, spacious layouts, and full ownership of the plot. They require higher 
                initial investments and ongoing maintenance fees.
              </p>
            </div>

            <div className="bg-cream/40 border border-gray-100 rounded-2xl p-6 space-y-3">
              <h4 className="font-heading text-base text-navy font-medium">Gated Community Plots</h4>
              <p className="text-xs leading-relaxed">
                Preferred by investors and buyers wanting to construct their customized dream home in the future. Plots 
                offer maximum capital appreciation, low initial maintenance costs, and absolute design flexibility. 
                They do not generate immediate rental income.
              </p>
            </div>
          </div>
        </div>

        {/* Home Loans & Financial Planning */}
        <div className="space-y-8 text-sm md:text-[15px] text-gray-500 font-light leading-relaxed">
          <h3 className="font-heading text-2xl text-navy font-normal border-b border-gray-100 pb-3">
            Navigating Home Loans & Financial Planning
          </h3>
          <p>
            Financial preparedness is key to a smooth property purchase. RealHubb recommends starting your home loan 
            application process early by securing a pre-approval letter from leading banks (such as SBI, HDFC, or ICICI). 
            A pre-approval gives you a clear understanding of your maximum budget, increases your bargaining power with 
            developers, and speeds up the final disbursal of funds.
          </p>
          <p>
            When calculating your budget, remember to account for additional expenses beyond the base property cost. 
            These include GST (5% for under-construction properties, 0% for ready-to-move properties with an OC), Stamp 
            Duty and Registration Charges (typically 5% to 7% of the property value, depending on the state), advance 
            maintenance fees, electricity/water deposit charges, and clubhouse membership fees. Our expert advisors 
            help you structure these costs so you don't face unexpected financial stress.
          </p>
        </div>

      </div>
    </section>
  );
}
