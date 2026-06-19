import type { Metadata } from "next";
import Link from "next/link";
import { buySegmentMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/structuredData";
import { getAllProperties } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";

import PropertyCard from "@/components/property/PropertyCard";
import InstantCallbackForm from "@/components/lead/InstantCallbackForm";

type Params = Promise<{ segment: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

const segmentConfig: Record<
  string,
  { label: string; city: string; type?: string; minPrice?: number; maxPrice?: number; intro: string }
> = {
  "2bhk-flats-bangalore": {
    label: "2BHK Flats in Bangalore",
    city: "bangalore",
    type: "apartment",
    maxPrice: 10000000,
    intro:
      "Find the best 2BHK flats for sale in Bangalore. With prices starting from ₹40 Lakh in Electronic City to ₹1.5 Crore in premium areas like Koramangala and HSR Layout, Bangalore has a 2BHK apartment for every budget. All listed properties are RERA verified.",
  },
  "3bhk-flats-bangalore": {
    label: "3BHK Flats in Bangalore",
    city: "bangalore",
    type: "apartment",
    minPrice: 8000000,
    intro:
      "Explore premium 3BHK flats for sale in Bangalore from top developers like Prestige, Godrej, Brigade and Sobha. Ideal for growing families, these spacious apartments offer world-class amenities and strong appreciation potential.",
  },
  "villas-bangalore": {
    label: "Villas in Bangalore",
    city: "bangalore",
    type: "villa",
    intro:
      "Discover luxury villas for sale in Bangalore. From plotted villa communities in North Bangalore to premium villa apartments in Whitefield and Sarjapur Road — explore independent living with all community amenities.",
  },
  "luxury-apartments-bangalore": {
    label: "Luxury Apartments in Bangalore",
    city: "bangalore",
    type: "apartment",
    minPrice: 15000000,
    intro:
      "Explore luxury apartments above ₹1.5 Crore in Bangalore's most prestigious addresses — Indiranagar, Koramangala, HSR Layout, and Whitefield. Premium developments from top-tier developers with concierge services, smart homes, and world-class amenities.",
  },
  "plots-bangalore": {
    label: "Plots in Bangalore",
    city: "bangalore",
    type: "plot",
    intro:
      "Browse RERA-approved residential and commercial plots for sale in Bangalore. From affordable BDA sites in North Bangalore to premium layouts in Sarjapur Road and Devanahalli — find the right land investment.",
  },
};

const segmentFaqs: Record<string, { question: string; answer: string }[]> = {
  "2bhk-flats-bangalore": [
    { question: "What is the price range for 2BHK flats in Bangalore?", answer: "2BHK flats in Bangalore range from ₹40 Lakh (Electronic City, Yelahanka) to ₹1.5 Crore (Koramangala, HSR Layout, Indiranagar). The average price for a 1,200 sq.ft 2BHK is ₹75–85 Lakh." },
    { question: "Which area is best for buying a 2BHK in Bangalore?", answer: "For investment: Electronic City and Yelahanka offer highest rental yields (4–5%). For end-use near IT parks: Whitefield and Sarjapur Road. For premium lifestyle: Koramangala and HSR Layout." },
    { question: "What is the registration charge for a 2BHK flat in Bangalore?", answer: "In Karnataka, stamp duty is 5% and registration charge is 1% of the property value. For a ₹75 Lakh flat, total registration cost is approximately ₹4.5 Lakh." },
    { question: "Is it better to buy a ready-to-move or under-construction 2BHK?", answer: "Ready-to-move offers immediate possession and no GST. Under-construction is 15–25% cheaper but carries delivery risk. For first-time buyers, RealHubb recommends ready-to-move from reputed developers." },
    { question: "How can RealHubb help me buy a 2BHK in Bangalore?", answer: "RealHubb provides free property search, site visits, RERA verification, home loan assistance, and negotiation support — all at zero brokerage to buyers." },
  ],
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { segment } = await params;
  return buySegmentMetadata(segment);
}

export async function generateStaticParams() {
  return Object.keys(segmentConfig).map((segment) => ({ segment }));
}

export const dynamic = "force-dynamic";

export default async function BuySegmentPage({ params }: { params: Params }) {
  const { segment } = await params;
  const config = segmentConfig[segment];

  const firestoreProps = await getAllProperties().catch(() => []);
  const allProps = firestoreProps.length > 0 ? firestoreProps : staticProperties;

  const filtered = allProps.filter((p) => {
    if (config?.city && p.city !== config.city) return false;
    if (config?.type && p.type !== config.type) return false;
    if (config?.minPrice && p.priceValue < config.minPrice) return false;
    if (config?.maxPrice && p.priceValue > config.maxPrice) return false;
    return true;
  });

  const label = config?.label ?? segment.replace(/-/g, " ");
  const intro = config?.intro ?? `Browse verified ${label} listings with RERA-registered projects from top builders.`;
  const faqs = segmentFaqs[segment] ?? [];

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Buy Property", url: `${SITE_URL}/projects/ongoing` },
    { name: label, url: `${SITE_URL}/buy/${segment}` },
  ];

  const segmentImages: Record<string, string> = {
    "2bhk-flats-bangalore": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    "3bhk-flats-bangalore": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    "villas-bangalore": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
    "luxury-apartments-bangalore": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "plots-bangalore": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
  };
  const bgImage = segmentImages[segment] ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      )}

      <div className="pt-20 bg-cream min-h-screen">
        <div className="bg-navy pt-20 pb-24 md:pt-24 md:pb-28 page-padding relative overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt={label}
              className="w-full h-full object-cover opacity-40 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
          </div>

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal mt-4 leading-tight animate-fadeIn">
              {label} for Sale <span className="text-gold">2026</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl font-light mt-3 animate-fadeIn">
              Verified RERA-registered properties · Zero brokerage · Free site visit
            </p>
          </div>
        </div>

        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Intro */}
            <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-gray-500 text-sm leading-relaxed font-light">{intro}</p>
            </div>

            {/* Properties */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Available {label}
              </h2>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((p, i) => (
                    <PropertyCard key={p.id} property={p} imagePriority={i < 2} />
                  ))}
                </div>
              ) : (
                <div className="bg-cream/40 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    New listings loading. Contact us for the latest {label} options.
                  </p>
                  <Link href="/contact-us" className="text-gold text-sm hover:underline">
                    Request personalised shortlist →
                  </Link>
                </div>
              )}
            </section>

            {/* Buying guide */}
            <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                Buying Guide Checklist
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Verify RERA registration at the official state RERA website",
                  "Check builder's track record: on-time delivery, quality, complaints",
                  "Review the sale agreement — no hidden charges or one-sided clauses",
                  "Get a legal opinion on land title and encumbrance certificate",
                  "Compare home loan rates from at least 3 banks",
                  "Visit the site in person — don't rely only on brochures",
                  "Check possession timeline in writing with penalty clauses",
                  "Calculate total cost: base price + GST + registration + maintenance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQs */}
            {faqs.length > 0 && (
              <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="border border-gray-150/80 rounded-2xl p-5 group transition-all duration-300 hover:border-gold/30"
                    >
                      <summary className="text-navy text-sm md:text-base font-normal cursor-pointer list-none flex justify-between items-center select-none">
                        <span>{faq.question}</span>
                        <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4">
                          ▾
                        </span>
                      </summary>
                      <p className="text-gray-500 text-sm mt-4 leading-relaxed font-light border-t border-gray-100 pt-4">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <InstantCallbackForm city={config?.city ? config.city.charAt(0).toUpperCase() + config.city.slice(1) : undefined} />
              <div className="bg-[#00274D] border border-gold/30 rounded-3xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                <p className="font-heading text-lg text-gold font-normal mb-4 relative z-10">Similar Searches</p>
                <ul className="space-y-3 relative z-10">
                  {[
                    { label: "2BHK Flats in Bangalore", href: "/buy/2bhk-flats-bangalore" },
                    { label: "3BHK Flats in Bangalore", href: "/buy/3bhk-flats-bangalore" },
                    { label: "Luxury Apartments", href: "/buy/luxury-apartments-bangalore" },
                    { label: "Villas in Bangalore", href: "/buy/villas-bangalore" },
                  ]
                    .filter((l) => l.href !== `/buy/${segment}`)
                    .map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="flex items-center justify-between text-white/70 hover:text-gold text-sm font-light transition-colors group"
                        >
                          <span>{l.label}</span>
                          <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
