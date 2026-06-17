import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/firestoreServerService";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import BlogListingClient from "@/components/blog/BlogListingClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Real Estate Blog — Guides & Market Reports | RealHubb",
  // 149 chars ✅
  description:
    "Expert real estate insights for Bangalore, Hyderabad & Chennai. Buying guides, market reports, investment tips and locality reviews from RealHubb.",
  canonical: `${SITE_URL}/blog`,
});

export const revalidate = 3600;

export default async function BlogPage() {
  const firestorePosts = await getAllBlogPosts().catch(() => []);
  const posts =
    firestorePosts.length > 0
      ? firestorePosts
      : staticBlogPosts.filter((p) => p.published);

  return (
    <div className="pt-20">
      <div className="bg-navy py-14 page-padding">
        <p className="section-overline text-gold mb-3">Expert Insights</p>
        <h1 className="font-heading text-3xl md:text-5xl text-white font-normal">
          Real Estate Blog
        </h1>
        <p className="text-white/60 text-base mt-3 max-w-xl">
          Buying guides, market reports, investment tips and locality insights
          from RealHubb's real estate experts.
        </p>
      </div>
      <BlogListingClient posts={posts} />
    </div>
  );
}
