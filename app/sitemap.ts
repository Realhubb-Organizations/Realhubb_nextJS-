import type { MetadataRoute } from "next";
import { getAllPropertySlugs, getAllBlogSlugs, getAllDeveloperSlugs } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { developers as staticDevs } from "@/data/developers";
import { locations } from "@/data/locations";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [firePropertySlugs, fireBlogSlugs, fireDevSlugs] = await Promise.allSettled([
    getAllPropertySlugs(),
    getAllBlogSlugs(),
    getAllDeveloperSlugs(),
  ]);

  const propertySlugs = firePropertySlugs.status === "fulfilled" && firePropertySlugs.value.length > 0
    ? firePropertySlugs.value
    : staticProperties.map((p) => p.slug);

  const blogSlugs = fireBlogSlugs.status === "fulfilled" && fireBlogSlugs.value.length > 0
    ? fireBlogSlugs.value
    : staticBlogPosts.filter((p) => p.published).map((p) => p.slug);

  const devSlugs = fireDevSlugs.status === "fulfilled" && fireDevSlugs.value.length > 0
    ? fireDevSlugs.value
    : staticDevs.map((d) => d.slug);

  const now = new Date().toISOString();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/projects/ongoing/bangalore`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/projects/ongoing/hyderabad`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/projects/ongoing/chennai`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/projects/upcoming/bangalore`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/real-estate/bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/real-estate/hyderabad`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/real-estate/chennai`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/buy/2bhk-flats-bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/buy/3bhk-flats-bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/buy/luxury-apartments-bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/buy/villas-bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/buy/plots-bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/developers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/career`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/emi-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/home-loan-eligibility`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/rental-yield-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/salary-advisor`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/currency-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const locationUrls: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${SITE_URL}/real-estate/${loc.city}/${loc.areaSlug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const propertyUrls: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: `${SITE_URL}/property/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const devUrls: MetadataRoute.Sitemap = devSlugs.map((slug) => ({
    url: `${SITE_URL}/developers/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...locationUrls, ...propertyUrls, ...blogUrls, ...devUrls];
}
