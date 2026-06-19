import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, MapPin, BedDouble, Maximize2, Calendar, Phone } from "lucide-react";
import { propertyMetadata } from "@/lib/seo";
import {
  getPropertyBySlug,
  getAllPropertySlugs,
  getPropertiesByCity,
  getPublishedFaqsByReference,
} from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import { getLocationBySlug } from "@/data/locations";
import {
  breadcrumbSchema,
  propertyListingSchema,
  faqSchema,
} from "@/lib/structuredData";
import PropertyCard from "@/components/property/PropertyCard";
import HeroBackgroundSlideshow from "@/components/property/HeroBackgroundSlideshow";
import EnquiryPopup from "@/components/property/EnquiryPopup";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

type Params = Promise<{ slug: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p =
    (await getPropertyBySlug(slug)) ??
    staticProperties.find((x) => x.slug === slug);
  if (!p) return { title: "Property Not Found" };
  return propertyMetadata({
    name: p.name,
    developer: p.developer,
    location: p.location,
    city: p.city.charAt(0).toUpperCase() + p.city.slice(1),
    bedrooms: p.bedrooms,
    type: p.type,
    price: p.price,
    area: p.area,
    rera: p.rera,
    possession: p.possession,
    slug: p.slug,
    image: p.images[0],
  });
}

export async function generateStaticParams() {
  const fireStoreSlugs = await getAllPropertySlugs().catch(() => []);
  const staticSlugs = staticProperties.map((p) => p.slug);
  return [...new Set([...fireStoreSlugs, ...staticSlugs])].map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const p =
    (await getPropertyBySlug(slug)) ??
    staticProperties.find((x) => x.slug === slug);

  if (!p) notFound();

  const relatedRaw = await getPropertiesByCity(p.city).catch(() => []);
  const related = (
    relatedRaw.length > 0
      ? relatedRaw
      : staticProperties.filter((s) => s.city === p.city)
  )
    .filter((r) => r.slug !== p.slug)
    .slice(0, 3);

  const cityLabel = p.city.charAt(0).toUpperCase() + p.city.slice(1);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Properties", url: `${SITE_URL}/projects/ongoing` },
    { name: cityLabel, url: `${SITE_URL}/projects/ongoing/${p.city}` },
    { name: p.name, url: `${SITE_URL}/property/${p.slug}` },
  ];

  const dbFaqs = await getPublishedFaqsByReference("property", p.id);
  const customFaqs = dbFaqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  const propertyFaqs = [
    {
      question: `What is the price of ${p.name}?`,
      answer: `${p.name} by ${p.developer} is priced ${p.price} in ${p.location}, ${cityLabel}.`,
    },
    {
      question: `What configurations are available in ${p.name}?`,
      answer: `${p.name} offers ${p.bedrooms} configurations with area ranging ${p.area}.`,
    },
    {
      question: `What is the possession date of ${p.name}?`,
      answer: `The expected possession date for ${p.name} is ${p.possession}.`,
    },
    {
      question: `Is ${p.name} RERA registered?`,
      answer: p.rera
        ? `Yes, ${p.name} is RERA registered with number ${p.rera}.`
        : `${p.name} is pending RERA registration. Contact RealHubb for the latest status.`,
    },
    {
      question: `What amenities does ${p.name} offer?`,
      answer: p.amenities.length
        ? `${p.name} offers: ${p.amenities.join(", ")}.`
        : `Contact RealHubb for the complete amenity list for ${p.name}.`,
    },
    ...customFaqs,
  ];

  // Fallback and normalization for map embed URLs
  let mapEmbedUrl = p.mapEmbedUrl;
  if (mapEmbedUrl && !mapEmbedUrl.includes("/embed") && !mapEmbedUrl.includes("embed?pb=")) {
    if (p.name.toLowerCase().includes("harmony")) {
      mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7523956637843!2d77.63552137594411!3d12.892838390772714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15f07a70b4ef%3A0xa27a1092cbf233da!2sHeart+of+Harmony+by+CKPC!5e0!3m2!1sen!2sin!4v1718712000000!5m2!1sen!2sin";
    } else {
      mapEmbedUrl = "";
    }
  }
  if (!mapEmbedUrl && p.name.toLowerCase().includes("harmony")) {
    mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7523956637843!2d77.63552137594411!3d12.892838390772714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15f07a70b4ef%3A0xa27a1092cbf233da!2sHeart+of+Harmony+by+CKPC!5e0!3m2!1sen!2sin!4v1718712000000!5m2!1sen!2sin";
  }

  const hasGuidePage = p.location ? !!getLocationBySlug(p.city, p.location.toLowerCase().replace(/\s+/g, "-")) : false;

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyListingSchema({ name: p.name, description: p.description, location: p.location, city: p.city, price: p.price, images: p.images, slug: p.slug, rera: p.rera })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(propertyFaqs)) }} />

      <div className="pt-20">
        {/* ── HERO ── */}
        <section className="bg-navy pt-20 pb-24 md:pt-24 md:pb-28 page-padding relative overflow-hidden text-white">
          {/* Slideshow Background */}
          <HeroBackgroundSlideshow images={p.images} />

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-4 animate-fadeIn">
              Premium Property Showcase
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight mb-4 max-w-3xl animate-fadeIn">
              {p.name}
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl font-light animate-fadeIn">
              Developed by <span className="text-gold font-normal">{p.developer}</span> in {p.location}, {cityLabel}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 mt-6 text-white/70 text-xs md:text-sm font-light animate-fadeIn">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="capitalize">{p.projectType} Project</span>
              </span>
              {p.rera && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1.5 text-green-400">
                    <Shield className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>RERA Verified: {p.rera}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="page-padding py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Key facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BedDouble, label: "Configurations", value: p.bedrooms },
                { icon: Maximize2, label: "Area", value: p.area },
                { icon: Calendar, label: "Possession", value: p.possession },
                { icon: MapPin, label: "Location", value: `${p.location}, ${cityLabel}` },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="bg-white border border-gray-150/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-gray-400 text-xs font-light">{f.label}</p>
                    <p className="text-navy text-sm md:text-base font-normal mt-1 leading-tight">{f.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Price & Media Card */}
            <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-normal mb-2">Starting Price</p>
                <p className="font-heading text-3xl md:text-4xl text-navy font-normal leading-none">{p.price}</p>
                {p.rera && <p className="text-gray-400 text-xs mt-2 font-light">RERA Reg No. {p.rera}</p>}
              </div>
              {p.images.length > 1 && (
                <div className="sm:text-right">
                  <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-normal mb-2">Visual Gallery</p>
                  <p className="font-heading text-2xl text-navy font-normal leading-none">{p.images.length} High-Res Photos</p>
                  <p className="text-gray-400 text-xs mt-2 font-light">Available below</p>
                </div>
              )}
            </div>

            {/* About description */}
            <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-navy font-normal mb-4">
                About <span className="text-gold">{p.name}</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">{p.description}</p>
            </div>

            {/* Amenities */}
            {p.amenities.length > 0 && (
              <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">World-Class Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {p.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 text-sm text-gray-500 font-light hover:text-gold transition-colors duration-200">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {mapEmbedUrl && (
              <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-4">Location Map & Connectivity</h2>
                <div className="rounded-2xl overflow-hidden h-72 border border-gray-150/80 shadow-inner">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    title={`Map: ${p.name}`}
                  />
                </div>
              </div>
            )}

            {/* Area link */}
            {hasGuidePage && (
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-light">Explore this locality</p>
                  <p className="text-navy text-base font-normal mt-1">
                    {p.location} Real Estate Guide
                  </p>
                </div>
                <Link
                  href={`/real-estate/${p.city}/${p.location.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gold text-xs font-semibold border border-gold/30 hover:border-gold px-5 py-2.5 rounded-xl hover:bg-gold hover:text-navy transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  View Guide →
                </Link>
              </div>
            )}

            {/* FAQ */}
            <div>
              <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {propertyFaqs.map((faq) => (
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
              </div>
            </div>
          </div>

          {/* Lead sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <EnquiryPopup propertyName={p.name} propertySlug={p.slug} />
              <div className="bg-[#00274D] border border-gold/30 rounded-3xl p-6 text-center relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-white/60 text-xs font-light mb-3 relative z-10">Have questions? Call us directly</p>
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="flex items-center justify-center gap-2.5 text-gold hover:text-gold/90 font-heading text-lg font-normal transition-colors relative z-10"
                >
                  <Phone className="w-5 h-5 text-gold" />
                  {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                    ? `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
                    : "+91 99801 89914"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related properties */}
        {related.length > 0 && (
          <div className="page-padding pb-16">
            <h2 className="font-heading text-2xl text-navy font-normal mb-6">
              More Properties in {cityLabel}
            </h2>
            <RevealGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <RevealCard key={r.id}>
                  <PropertyCard property={r} />
                </RevealCard>
              ))}
            </RevealGrid>
          </div>
        )}
      </div>
    </>
  );
}
