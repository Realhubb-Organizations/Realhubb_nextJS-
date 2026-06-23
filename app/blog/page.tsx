import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/firestoreServerService";
import BlogListingClient from "@/components/blog/BlogListingClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Real Estate Blog — Guides & Market Reports | RealHubb",
  // 149 chars ✅
  description:
    "Expert real estate insights for Bangalore, Hyderabad & Chennai. Buying guides, market reports, investment tips and locality reviews from RealHubb.",
  canonical: `${SITE_URL}/blog`,
  keywords: "real estate blog, bangalore real estate, hyderabad property trends, home buying guide",
});

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getAllBlogPosts().catch(() => []);

  return (
    <div className="pt-20">
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
    </div>
  );
}
