import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProperties, getLatestBlogPosts, getAllDevelopers, getPublishedFaqsByPage, getAllProperties } from "@/lib/firestoreServerService";
import { properties as staticProperties } from "@/data/properties";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { developers as staticDevelopers } from "@/data/developers";
import { generalFaq } from "@/data/faqData";
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
import HomeSEOContent from "@/components/home/HomeSEOContent";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

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
export const metadata: Metadata = buildMetadata({
  title: "RealHubb — Real Estate Bangalore, Hyderabad & Chennai",
  description:
    "Find verified flats & villas in Bangalore, Hyderabad & Chennai. RERA-registered projects, zero brokerage, expert advisory & free site visits. Get started!",
  keywords:
    "real estate bangalore, flats bangalore, buy flat bangalore, hyderabad, chennai property",
  canonical: SITE_URL,
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
            <div key={i} className="bg-gray-100 rounded-2xl h-[390px] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}


function DeveloperStripSkeleton() {
  return (
    <div className="py-16 bg-navy overflow-hidden">
      <div className="page-padding text-center mb-10">
        <p className="section-overline text-gold/30 mb-2 animate-pulse">Trusted Developer Partners</p>
        <p className="text-white/20 text-xs animate-pulse">
          We work exclusively with RERA-verified, track-record-proven builders
        </p>
      </div>
      <div className="page-padding flex items-center justify-center gap-5 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 w-44 bg-white/5 rounded-xl animate-pulse shrink-0" />
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
            <div key={i} className="bg-gray-100 rounded-2xl h-[328px] animate-pulse" />
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
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CitySectionSkeleton() {
  return (
    <section className="py-20 bg-cream">
      <div className="page-padding">
        <div className="text-center mb-10 animate-pulse">
          <p className="section-overline text-gold mb-2">Explore by Location</p>
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6" />
        </div>
        
        {/* Mocked tab buttons */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-28 bg-white border border-gray-200 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl h-[390px]" />
          ))}
        </div>

        {/* Mocked bottom button */}
        <div className="mt-10 text-center animate-pulse">
          <div className="inline-block bg-white border border-gray-200 h-11 w-44 rounded-xl" />
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
    if (data && data.length > 0) {
      homeFaqs = data;
    } else {
      homeFaqs = generalFaq;
    }
  } catch (err) {
    console.error("Error fetching homepage FAQs:", err);
    homeFaqs = generalFaq;
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
  const staticFaqItems = generalFaq.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(staticFaqItems)) }}
      />
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
      <HomeSEOContent />
      
      <Suspense fallback={<HomeFaqsSkeleton />}>
        <HomeFaqsWrapper />
      </Suspense>
      
      <ContactCTA />
    </>
  );
}
