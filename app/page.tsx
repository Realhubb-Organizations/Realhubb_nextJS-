import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProperties, getLatestBlogPosts, getAllDevelopers, getPublishedFaqsByPage, getAllProperties } from "@/lib/firestoreServerService";
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

// Skeletons
function FeaturedPropertiesSkeleton() {
  return (
    <div className="py-20 bg-white">
      <div className="page-padding">
        <div className="h-10 bg-gray-100 rounded-lg w-1/3 mb-10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeveloperStripSkeleton() {
  return (
    <div className="py-12 bg-white/50 border-y border-gray-100">
      <div className="page-padding flex items-center justify-between gap-6 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg w-28 animate-pulse shrink-0" />
        ))}
      </div>
    </div>
  );
}

function BlogPreviewSkeleton() {
  return (
    <div className="py-20 bg-white">
      <div className="page-padding">
        <div className="h-10 bg-gray-100 rounded-lg w-1/4 mb-10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeFaqsSkeleton() {
  return (
    <div className="py-20 bg-cream">
      <div className="page-padding max-w-4xl mx-auto">
        <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto mb-10 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CitySectionSkeleton() {
  return (
    <section className="py-20 bg-cream">
      <div className="page-padding animate-pulse">
        <div className="text-center mb-10">
          <p className="section-overline text-gold mb-2">Explore by Location</p>
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-80" />
          ))}
        </div>
      </div>
    </section>
  );
}

// Wrapper Components to Fetch Data
async function FeaturedPropertiesWrapper() {
  let featured = staticProperties.filter((p) => p.featured);
  try {
    const data = await getFeaturedProperties();
    if (data && data.length > 0) {
      featured = data;
    }
  } catch (err) {
    console.error("Error fetching featured properties:", err);
  }
  return <FeaturedProperties properties={featured} />;
}

async function DeveloperStripWrapper() {
  let developers = staticDevelopers;
  try {
    const data = await getAllDevelopers();
    if (data && data.length > 0) {
      developers = data;
    }
  } catch (err) {
    console.error("Error fetching developers:", err);
  }
  return <DeveloperStrip developers={developers} />;
}

async function BlogPreviewWrapper() {
  let blogPosts = staticBlogPosts.filter((p) => p.published).slice(0, 3);
  try {
    const data = await getLatestBlogPosts(3);
    if (data && data.length > 0) {
      blogPosts = data;
    }
  } catch (err) {
    console.error("Error fetching blog posts:", err);
  }
  return <BlogPreview posts={blogPosts} />;
}

async function HomeFaqsWrapper() {
  let homeFaqs: any[] = [];
  try {
    const data = await getPublishedFaqsByPage("home");
    if (data) {
      homeFaqs = data;
    }
  } catch (err) {
    console.error("Error fetching homepage FAQs:", err);
  }
  return <HomeFaqs faqs={homeFaqs} />;
}

async function CitySectionWrapper() {
  let properties: any[] = [];
  try {
    properties = await getAllProperties();
  } catch (err) {
    console.error("Error fetching properties for CitySection:", err);
  }
  return <CitySection properties={properties} />;
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServingCities />
      
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedPropertiesWrapper />
      </Suspense>
      
      <Suspense fallback={<CitySectionSkeleton />}>
        <CitySectionWrapper />
      </Suspense>
      
      <LocationLinks />
      
      <Suspense fallback={<DeveloperStripSkeleton />}>
        <DeveloperStripWrapper />
      </Suspense>
      
      <WhyRealHubb />
      <TestimonialsStrip />
      
      <Suspense fallback={<BlogPreviewSkeleton />}>
        <BlogPreviewWrapper />
      </Suspense>
      
      <ToolsPromo />
      
      <Suspense fallback={<HomeFaqsSkeleton />}>
        <HomeFaqsWrapper />
      </Suspense>
      
      <ContactCTA />
    </>
  );
}
