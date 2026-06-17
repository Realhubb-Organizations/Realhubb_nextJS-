import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
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
        <section className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <FadeInOnScroll direction="up">
            <p className="text-[#D7A764] text-[10px] tracking-[0.28em] uppercase font-normal mb-4 mt-6">
              Our Gallery
            </p>
            <h1 className="font-heading text-4xl md:text-[56px] text-white font-normal leading-tight mb-4 max-w-2xl">
              Moments that <span className="text-[#D7A764]">define us.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xl">
              A visual journey through our events, properties, team milestones, and community moments.
            </p>
          </FadeInOnScroll>
        </section>

        <GalleryClient />
      </div>
    </>
  );
}
