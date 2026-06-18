import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";
import GalleryClient from "@/components/gallery/GalleryClient";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Gallery | RealHubb Events, Properties & Team | RealHubb",
  description:
    "Explore RealHubb's gallery — property showcases, team moments, awards, and events from our real estate journey across Bangalore, Hyderabad and Chennai.",
  keywords: "RealHubb gallery, real estate events, property photos, RealHubb team, awards RealHubb",
  canonical: `${SITE_URL}/gallery`,
  ogImage: `${SITE_URL}/og/gallery.jpg`,
});

export default function GalleryPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Gallery", url: `${SITE_URL}/gallery` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <div className="pt-20">
        {/* ── HERO ── */}
        <section className="bg-navy py-16 md:py-20 page-padding relative overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
              alt="RealHubb Gallery Showcase"
              className="w-full h-full object-cover opacity-45 filter brightness-95"
            />
            {/* Subtle linear navy-dominant gradient to maintain readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
          </div>

          {/* Subtle top/right glow matching site branding */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <FadeInOnScroll direction="up">
              <p className="text-[#D7A764] text-[10px] tracking-[0.28em] uppercase font-normal mb-4 mt-6 animate-fadeIn">
                Our Gallery
              </p>
              <h1 className="font-heading text-4xl md:text-[56px] text-white font-normal leading-tight mb-4 max-w-2xl animate-fadeIn">
                Moments that <span className="text-[#D7A764]">define us.</span>
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-xl animate-fadeIn">
                A visual journey through our events, properties, team milestones, and community moments.
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <GalleryClient />
      </div>
    </>
  );
}
