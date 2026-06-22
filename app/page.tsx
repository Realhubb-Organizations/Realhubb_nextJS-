import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProperties, getLatestBlogPosts, getAllDevelopers, getPublishedFaqsByPage } from "@/lib/firestoreServerService";
import { webPageSchema, videoSchema, faqSchema } from "@/lib/structuredData";
import HeroSection from "@/components/home/HeroSection";
import ServingCities from "@/components/home/ServingCities";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import CitySection from "@/components/home/CitySection";
import LocationLinks from "@/components/home/LocationLinks";
import DeveloperStrip from "@/components/home/DeveloperStrip";
import WhyRealHubb from "@/components/home/WhyRealHubb";
import TestimonialsStrip from "@/components/home/TestimonialsStrip";
import BlogPreview from "@/components/home/BlogPreview";
import ToolsPromo from "@/components/home/ToolsPromo";
import HomeFaqs from "@/components/home/HomeFaqs";
import ContactCTA from "@/components/home/ContactCTA";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "RealHubb — Real Estate Bangalore, Hyderabad & Chennai",
  // 135 chars ✅
  description:
    "Find verified flats & apartments in Bangalore, Hyderabad & Chennai. RERA registered. Zero brokerage. Expert advisors. Free site visit.",
  keywords:
    "real estate bangalore, flats in bangalore, buy flat bangalore, apartments bangalore, property bangalore hyderabad chennai",
  canonical: SITE_URL,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

export default async function HomePage() {
  const [firestoreFeatured, firestoreBlog, firestoreDevelopers, firestoreFaqs] = await Promise.allSettled([
    getFeaturedProperties(),
    getLatestBlogPosts(3),
    getAllDevelopers(),
    getPublishedFaqsByPage("home"),
  ]);

  const featured =
    firestoreFeatured.status === "fulfilled"
      ? firestoreFeatured.value
      : [];

  const blogPosts =
    firestoreBlog.status === "fulfilled"
      ? firestoreBlog.value
      : [];

  const developers =
    firestoreDevelopers.status === "fulfilled"
      ? firestoreDevelopers.value
      : [];

  const homeFaqs =
    firestoreFaqs.status === "fulfilled"
      ? firestoreFaqs.value
      : [];

  const faqItems = homeFaqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  const homeVideo = {
    name: "RealHubb Ventures Real Estate Walkthrough",
    description: "Discover verified, RERA-approved properties in Bangalore, Hyderabad, and Chennai with RealHubb.",
    thumbnailUrl: "https://ik.imagekit.io/o72k8hn7h/realhubb%20/269354_large.mp4/ik-thumbnail.jpg?tr=w-1280,q-60,f-webp",
    uploadDate: "2026-01-01T00:00:00Z",
    contentUrl: "https://ik.imagekit.io/o72k8hn7h/realhubb%20/269354_large.mp4",
  };

  const webPage = {
    name: "RealHubb — Real Estate Bangalore, Hyderabad & Chennai",
    description: "Find verified flats & apartments in Bangalore, Hyderabad & Chennai. RERA registered. Zero brokerage. Expert advisors. Free site visit.",
    url: SITE_URL,
    speakableSelectors: [".speakable-title", ".speakable-summary"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(webPage)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema(homeVideo)) }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }}
        />
      )}
      <HeroSection />
      <ServingCities />
      <FeaturedProperties properties={featured} />
      <CitySection />
      <LocationLinks />
      <DeveloperStrip developers={developers} />
      <WhyRealHubb />
      <TestimonialsStrip />
      <BlogPreview posts={blogPosts} />
      <ToolsPromo />
      <HomeFaqs faqs={homeFaqs} />
      <ContactCTA />
    </>
  );
}
