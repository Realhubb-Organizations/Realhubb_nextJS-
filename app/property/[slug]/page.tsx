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
import {
  breadcrumbSchema,
  propertyListingSchema,
  faqSchema,
} from "@/lib/structuredData";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyGallery from "@/components/property/PropertyGallery";
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

export const revalidate = 3600;

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

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyListingSchema({ name: p.name, description: p.description, location: p.location, city: p.city, price: p.price, images: p.images, slug: p.slug, rera: p.rera })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(propertyFaqs)) }} />

      <div className="pt-20">
        {/* ── Header bar (navy) ──────────────────────────────────────── */}
        <div className="bg-navy py-6 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase tracking-wider ${
              p.projectType === "upcoming" ? "bg-gold text-navy" : "bg-white/20 text-white"
            }`}>
              {p.projectType}
            </span>
            {p.rera && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full">
                <Shield className="w-2.5 h-2.5" /> RERA Verified
              </span>
            )}
          </div>
          <h1 className="font-heading text-2xl md:text-4xl text-white font-normal mt-2">
            {p.name}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {p.developer} · {p.location}, {cityLabel}
          </p>
        </div>

        {/* ── Image Gallery ──────────────────────────────────────────── */}
        <PropertyGallery images={p.images} propertyName={p.name} />

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="page-padding py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

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
                  <div key={f.label} className="bg-cream rounded-xl p-4">
                    <Icon className="w-4 h-4 text-gold mb-1.5" />
                    <p className="text-gray-400 text-xs">{f.label}</p>
                    <p className="text-navy text-sm font-normal mt-0.5">{f.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Price */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="section-overline text-gold mb-1">Starting Price</p>
                <p className="font-heading text-3xl text-navy font-normal">{p.price}</p>
                {p.rera && <p className="text-gray-400 text-xs mt-1">RERA: {p.rera}</p>}
              </div>
              {p.images.length > 1 && (
                <div className="text-right">
                  <p className="section-overline text-gold mb-1">Photos</p>
                  <p className="font-heading text-2xl text-navy font-normal">{p.images.length}</p>
                  <p className="text-gray-400 text-xs">available</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading text-xl text-navy font-normal mb-3">
                About {p.name}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
            </div>

            {/* Amenities */}
            {p.amenities.length > 0 && (
              <div>
                <h2 className="font-heading text-xl text-navy font-normal mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {p.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {p.mapEmbedUrl && (
              <div>
                <h2 className="font-heading text-xl text-navy font-normal mb-4">Location Map</h2>
                <div className="rounded-2xl overflow-hidden h-64 border border-gray-100">
                  <iframe
                    src={p.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    title={`Map: ${p.name}`}
                  />
                </div>
              </div>
            )}

            {/* Area link */}
            <div className="bg-cream rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Explore this locality</p>
                <p className="text-navy text-sm font-normal">
                  {p.location} Real Estate Guide
                </p>
              </div>
              <Link
                href={`/real-estate/${p.city}/${p.location.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gold text-xs border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold hover:text-navy transition-all"
              >
                View Guide →
              </Link>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-heading text-xl text-navy font-normal mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {propertyFaqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="bg-white border border-gray-100 rounded-xl p-4 group"
                  >
                    <summary className="text-navy text-sm font-normal cursor-pointer list-none flex justify-between items-center">
                      {faq.question}
                      <span className="text-gold group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Lead sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <EnquiryPopup propertyName={p.name} propertySlug={p.slug} />
              <div className="bg-navy rounded-2xl p-5 text-center">
                <p className="text-white/60 text-xs mb-3">Have questions? Call us directly</p>
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="flex items-center justify-center gap-2 text-gold text-sm"
                >
                  <Phone className="w-4 h-4" />
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
