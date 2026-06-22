import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { getAllDevelopers } from "@/lib/firestoreServerService";
import { breadcrumbSchema } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Top Real Estate Developers in Bangalore | RealHubb",
  description:
    "Explore projects from Prestige, Godrej, Brigade, Sobha and other top developers. Verified RERA-registered projects. Contact RealHubb for latest pricing.",
  canonical: `${SITE_URL}/developers`,
});

export const dynamic = "force-dynamic";

export default async function DevelopersPage() {
  const devs = await getAllDevelopers().catch(() => []);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Developers", url: `${SITE_URL}/developers` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <div className="pt-20">
        <div className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4">
            Our Developer Partners
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-xl">
            We work with India&apos;s most trusted real estate developers — RERA verified,
            proven track records, on-time delivery.
          </p>
        </div>

        <div className="page-padding py-12">
          <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devs.map((dev) => (
              <RevealCard key={dev.id}>
                <Link
                  href={`/developers/${dev.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-gold hover:shadow-md transition-all block h-full"
                >
                  {dev.logo ? (
                    <div className="relative w-36 h-16 mb-4">
                      <Image
                        src={imagePresets.developerLogo(dev.logo)}
                        alt={dev.name}
                        fill
                        sizes="144px"
                        className="object-contain object-left"
                      />
                    </div>
                  ) : (
                    <div className="h-16 flex items-center mb-4">
                      <span className="font-heading text-navy text-xl group-hover:text-gold transition-colors">
                        {dev.name}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{dev.description}</p>
                  {(dev.established || dev.totalProjects || dev.headquarters) && (
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {dev.established && <span>Est. {dev.established}</span>}
                      {dev.totalProjects && <span>{dev.totalProjects} Projects</span>}
                      {dev.headquarters && <span>{dev.headquarters}</span>}
                    </div>
                  )}
                </Link>
              </RevealCard>
            ))}
          </RevealGrid>
        </div>
      </div>
    </>
  );
}
