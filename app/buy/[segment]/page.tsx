import type { Metadata } from "next";
import Link from "next/link";
import { buySegmentMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/structuredData";
import { getAllProperties } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
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

export const revalidate = 3600;

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      )}

      <div className="pt-20">
        <div className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4">
            {label} for Sale 2026
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-xl">
            Verified RERA-registered properties · Zero brokerage · Free site visit
          </p>
        </div>

        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Intro */}
            <p className="text-gray-500 text-sm leading-relaxed">{intro}</p>

            {/* Properties */}
            <section>
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
                <div className="bg-cream rounded-2xl p-8 text-center">
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
            <section className="bg-cream rounded-2xl p-6">
              <h2 className="font-heading text-xl text-navy font-normal mb-4">
                Buying Guide Checklist
              </h2>
              <ul className="space-y-2 text-sm text-gray-500">
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
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQs */}
            {faqs.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="bg-white border border-gray-100 rounded-xl p-4 group">
                      <summary className="text-navy text-sm font-normal cursor-pointer list-none flex justify-between">
                        {faq.question}
                        <span className="text-gold ml-4 shrink-0">▾</span>
                      </summary>
                      <p className="text-gray-400 text-sm mt-3 leading-relaxed">{faq.answer}</p>
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
              <div className="bg-navy rounded-2xl p-5">
                <p className="section-overline text-gold mb-3">Similar Searches</p>
                <ul className="space-y-2 text-sm">
                  {[
                    { label: "2BHK Flats in Bangalore", href: "/buy/2bhk-flats-bangalore" },
                    { label: "3BHK Flats in Bangalore", href: "/buy/3bhk-flats-bangalore" },
                    { label: "Luxury Apartments", href: "/buy/luxury-apartments-bangalore" },
                    { label: "Villas in Bangalore", href: "/buy/villas-bangalore" },
                  ]
                    .filter((l) => l.href !== `/buy/${segment}`)
                    .map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-white/60 hover:text-gold transition-colors">
                          {l.label} →
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
