import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Globe } from "lucide-react";
import { developerMetadata } from "@/lib/seo";
import {
  getDeveloperBySlug,
  getAllDeveloperSlugs,
  getPropertiesByCity,
} from "@/lib/firestoreServerService";
import { developers as staticDevs } from "@/data/developers";
import { properties as staticProps } from "@/data/properties";
import { breadcrumbSchema } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import PropertyCard from "@/components/property/PropertyCard";
import InstantCallbackForm from "@/components/lead/InstantCallbackForm";

type Params = Promise<{ slug: string }>;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dev =
    (await getDeveloperBySlug(slug).catch(() => null)) ??
    staticDevs.find((d) => d.slug === slug);
  if (!dev) return { title: "Developer Not Found" };
  return developerMetadata(dev.name, dev.slug);
}

export async function generateStaticParams() {
  const fireStoreSlugs = await getAllDeveloperSlugs().catch(() => []);
  const staticSlugs = staticDevs.map((d) => d.slug);
  return [...new Set([...fireStoreSlugs, ...staticSlugs])].map((slug) => ({ slug }));
}

export const revalidate = 3600;

export default async function DeveloperDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const dev =
    (await getDeveloperBySlug(slug).catch(() => null)) ??
    staticDevs.find((d) => d.slug === slug);
  if (!dev) notFound();

  const firestoreProps = await getPropertiesByCity("bangalore").catch(() => []);
  const allProps = firestoreProps.length > 0 ? firestoreProps : staticProps;
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <div className="pt-20">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="bg-navy py-14 page-padding">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            {/* Left — text */}
            <div className="flex-1 min-w-0">
              <BreadcrumbNav items={breadcrumbs} dark />
              <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4 leading-tight">
                {dev.name}
              </h1>
              {metaParts.length > 0 && (
                <p className="text-white/50 text-sm mt-3 flex flex-wrap gap-x-3 gap-y-1">
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
                  className="inline-flex items-center gap-2 mt-4 text-gold text-sm hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  Visit official website
                </a>
              )}
            </div>

            {/* Right — logo card, slides in from left */}
            {dev.logo ? (
              <div className="shrink-0 animate-slide-in-left">
                <div
                  className="relative bg-white rounded-2xl shadow-2xl border border-white/10
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
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-100 pointer-events-none" />
                </div>
                {/* Gold accent line below the card */}
                <div className="mt-2 mx-6 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
              </div>
            ) : (
              /* No logo — show styled name badge instead */
              <div className="shrink-0 animate-slide-in-left">
                <div
                  className="bg-white/5 border border-gold/30 rounded-2xl
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
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {dev.description && (
              <section>
                <p className="text-gray-500 text-sm leading-relaxed">{dev.description}</p>
              </section>
            )}

            {/* Projects */}
            {devProps.length > 0 && (
              <section>
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

              {/* Developer facts card — only rendered when at least one field exists */}
              {(dev.established || dev.headquarters || dev.totalProjects) && (
                <div className="bg-cream rounded-2xl p-5 text-sm space-y-2">
                  {dev.established && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Founded</span>
                      <span className="text-navy">{dev.established}</span>
                    </div>
                  )}
                  {dev.headquarters && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Headquarters</span>
                      <span className="text-navy">{dev.headquarters}</span>
                    </div>
                  )}
                  {dev.totalProjects && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Projects</span>
                      <span className="text-navy">{dev.totalProjects}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
