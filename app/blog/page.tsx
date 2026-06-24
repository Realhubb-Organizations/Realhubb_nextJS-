import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/firestoreServerService";
import BlogListingClient from "@/components/blog/BlogListingClient";
import { faqSchema } from "@/lib/structuredData";
import FaqSection from "@/components/faq/FaqSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Real Estate Blog — Guides & Market Reports | RealHubb",
  description:
    "Expert real estate insights for Bangalore, Hyderabad & Chennai. Buying guides, market reports, investment tips and locality reviews from RealHubb.",
  canonical: `${SITE_URL}/blog`,
  keywords: "real estate blog, bangalore real estate, hyderabad property trends, home buying guide",
});

export const dynamic = "force-dynamic";

const blogFaqs = [
  {
    question: "What topics does the RealHubb Blog cover?",
    answer: "Our blog covers a wide range of real estate topics including home buying guides, legal and documentation advice (such as RERA guidelines, stamp duty, khata transfer), home loan eligibility tips, investment market reports, interior design ideas, and locality/neighborhood analysis across Bangalore, Hyderabad, and Chennai."
  },
  {
    question: "How often is the blog updated?",
    answer: "We publish new articles weekly, featuring the latest market trends, policy updates, and property investment advice written by our in-house real estate specialists and market researchers."
  },
  {
    question: "Can I subscribe to get real estate alerts?",
    answer: "Yes, you can subscribe to our newsletter through the enquiry forms on the website. Subscribing will give you access to our weekly blog digest, hot deals on RERA-approved projects, and special pricing updates."
  },
  {
    question: "Is the advice on the RealHubb Blog legally binding?",
    answer: "The content on our blog is for informational and educational purposes. While we strive to present accurate and verified information, real estate laws and rates vary by region, so we recommend consulting with our designated property experts before concluding a purchase."
  }
];

export default async function BlogPage() {
  const posts = await getAllBlogPosts().catch(() => []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(blogFaqs)) }}
      />
      <div className="pt-20 bg-cream min-h-screen">
        {/* Immersive Projects-styled Header Banner */}
        <div className="bg-navy pt-20 pb-28 md:pt-24 md:pb-36 page-padding relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
              alt="Real Estate Insights"
              className="w-full h-full object-cover opacity-40 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/55 to-navy/20" />
          </div>

          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <p className="section-overline text-gold mb-3 uppercase tracking-wider text-xs font-normal animate-fadeIn">
              Expert Insights
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight animate-fadeIn">
              Real Estate <span className="text-gold">Blog</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base mt-4 max-w-xl font-light leading-relaxed animate-fadeIn">
              Buying guides, market reports, investment tips and locality insights from RealHubb's real estate experts.
            </p>
          </div>
        </div>
        <BlogListingClient posts={posts} />

        {/* FAQs */}
        <div className="page-padding py-24 max-w-4xl mx-auto">
          <FaqSection title="Real Estate Insights FAQs" icon="✍️" items={blogFaqs} />
        </div>
      </div>
    </>
  );
}
