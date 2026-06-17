import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProperties, getLatestBlogPosts, getAllDevelopers, getPublishedFaqsByPage } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { developers as staticDevelopers } from "@/data/developers";
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

export const metadata: Metadata = buildMetadata({
  title: "RealHubb — Real Estate Bangalore, Hyderabad & Chennai",
  // 135 chars ✅
  description:
    "Find verified flats & apartments in Bangalore, Hyderabad & Chennai. RERA registered. Zero brokerage. Expert advisors. Free site visit.",
  keywords:
    "real estate bangalore, flats in bangalore, buy flat bangalore, apartments bangalore, property bangalore hyderabad chennai",
  canonical: "https://www.realhubb.in",
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
    firestoreFeatured.status === "fulfilled" && firestoreFeatured.value.length > 0
      ? firestoreFeatured.value
      : staticProperties.filter((p) => p.featured);

  const blogPosts =
    firestoreBlog.status === "fulfilled" && firestoreBlog.value.length > 0
      ? firestoreBlog.value
      : staticBlogPosts.filter((p) => p.published).slice(0, 3);

  const developers =
    firestoreDevelopers.status === "fulfilled" && firestoreDevelopers.value.length > 0
      ? firestoreDevelopers.value
      : staticDevelopers;

  const homeFaqs =
    firestoreFaqs.status === "fulfilled"
      ? firestoreFaqs.value
      : [];

  return (
    <>
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
