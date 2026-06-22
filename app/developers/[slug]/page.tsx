import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Globe } from "lucide-react";
import { developerMetadata } from "@/lib/seo";
import {
  getDeveloperBySlug,
  getAllDeveloperSlugs,
  getAllProperties,
} from "@/lib/firestoreServerService";
import { breadcrumbSchema, builderSchema } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";

import PropertyCard from "@/components/property/PropertyCard";
import InstantCallbackForm from "@/components/lead/InstantCallbackForm";

type Params = Promise<{ slug: string }>;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dev = await getDeveloperBySlug(slug).catch(() => null);
  if (!dev) return { title: "Developer Not Found" };
  return developerMetadata(dev.name, dev.slug);
}

export async function generateStaticParams() {
  const fireStoreSlugs = await getAllDeveloperSlugs().catch(() => []);
  return fireStoreSlugs.map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export default async function DeveloperDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const dev = await getDeveloperBySlug(slug).catch(() => null);
  if (!dev) notFound();

  const allProps = await getAllProperties().catch(() => []);
  const devProps = allProps.filter((p) =>
    p.developer.toLowerCase().includes(dev.name.toLowerCase().split(" ")[0])
  );

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Developers", url: `${SITE_URL}/developers` },
    { name: dev.name, url: `${SITE_URL}/developers/${dev.slug}` },
  ];

  const metaParts = [
    dev.established && `Est. ${dev.established}`,
    dev.headquarters,
    dev.totalProjects && `${dev.totalProjects} projects`,
  ].filter(Boolean);

  const developerSchema = builderSchema({
    name: dev.name,
    description: dev.description,
    established: dev.established,
    headquarters: dev.headquarters,
    logo: dev.logo ? imagePresets.developerLogo(dev.logo) : undefined,
    url: dev.website || `${SITE_URL}/developers/${dev.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developerSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <div className="pt-20 bg-cream min-h-screen">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="bg-navy pt-20 pb-24 md:pt-24 md:pb-28 page-padding relative overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
              alt={dev.name}
              className="w-full h-full object-cover opacity-35 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
          </div>

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">

            {/* Left — text */}
            <div className="flex-1 min-w-0">

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal mt-4 leading-tight animate-fadeIn">
                {dev.name}
              </h1>
              {metaParts.length > 0 && (
                <p className="text-white/50 text-sm mt-3 flex flex-wrap gap-x-3 gap-y-1 font-light animate-fadeIn">
                  {metaParts.map((part, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {i > 0 && <span className="text-white/20">·</span>}
                      {part}
                    </span>
                  ))}
                </p>
              )}
              {dev.website && (
                <a
                  href={dev.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-gold text-sm hover:underline font-medium animate-fadeIn"
                >
                  <Globe className="w-4 h-4" />
                  Visit official website
                </a>
              )}
            </div>

            {/* Right — logo card */}
            {dev.logo ? (
              <div className="shrink-0 animate-slide-in-left">
                <div
                  className="relative bg-white rounded-3xl shadow-xl border border-white/10
                             w-56 h-36 md:w-64 md:h-44 flex items-center justify-center
                             overflow-hidden"
                >
                  <Image
                    src={imagePresets.developerLogo(dev.logo)}
                    alt={`${dev.name} logo`}
                    fill
                    sizes="(max-width: 768px) 224px, 256px"
                    className="object-contain p-6"
                    priority
                  />
                  {/* subtle inner glow ring */}
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-gray-100/50 pointer-events-none" />
                </div>
                {/* Gold accent line below the card */}
                <div className="mt-2 mx-6 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
              </div>
            ) : (
              /* No logo — show styled name badge instead */
              <div className="shrink-0 animate-slide-in-left">
                <div
                  className="bg-white/5 border border-gold/30 rounded-3xl
                             w-56 h-36 md:w-64 md:h-44 flex items-center justify-center"
                >
                  <span className="font-heading text-white text-2xl font-normal text-center px-4 leading-snug">
                    {dev.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {dev.description && (
              <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <p className="text-gray-500 text-sm leading-relaxed font-light">{dev.description}</p>
              </div>
            )}

            {/* Projects */}
            {devProps.length > 0 && (
              <section className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-navy font-normal mb-6">
                  {dev.name} Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {devProps.map((p, i) => (
                    <PropertyCard key={p.id} property={p} imagePriority={i < 2} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <InstantCallbackForm />

              {/* Developer facts card */}
              {(dev.established || dev.headquarters || dev.totalProjects) && (
                <div className="bg-[#FAF6F1] border border-gold/20 rounded-3xl p-6 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
                  <p className="font-heading text-lg text-navy font-normal mb-4 relative z-10">Quick Facts</p>
                  <div className="space-y-3 relative z-10 text-sm font-light">
                    {dev.established && (
                      <div className="flex justify-between border-b border-gold/10 pb-2">
                        <span className="text-gray-400">Founded</span>
                        <span className="text-navy font-medium">{dev.established}</span>
                      </div>
                    )}
                    {dev.headquarters && (
                      <div className="flex justify-between border-b border-gold/10 pb-2">
                        <span className="text-gray-400">Headquarters</span>
                        <span className="text-navy font-medium">{dev.headquarters}</span>
                      </div>
                    )}
                    {dev.totalProjects && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Projects</span>
                        <span className="text-navy font-medium">{dev.totalProjects}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
