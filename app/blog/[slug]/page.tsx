import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogMetadata } from "@/lib/seo";
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  getLatestBlogPosts,
  getPublishedFaqsByReference,
} from "@/lib/firestoreServerService";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { breadcrumbSchema, articleSchema, faqSchema } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";

import InstantCallbackForm from "@/components/lead/InstantCallbackForm";
import CommentSection from "@/components/blog/CommentSection";
import FaqAccordion from "@/components/faq/FaqAccordion";
import {
  BlogTranslationProvider,
  LanguageControl,
  TranslatedTitle,
  TranslatedExcerpt,
  TranslatedContent,
} from "@/components/blog/TranslatableArticle";

type Params = Promise<{ slug: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post =
    (await getBlogPostBySlug(slug)) ?? staticBlogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return blogMetadata({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage,
    author: post.author,
    publishedAt: post.publishedAt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  });
}

export async function generateStaticParams() {
  const fireStoreSlugs = await getAllBlogSlugs().catch(() => []);
  const staticSlugs = staticBlogPosts.filter((p) => p.published).map((p) => p.slug);
  const all = [...new Set([...fireStoreSlugs, ...staticSlugs])];
  return all.map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post =
    (await getBlogPostBySlug(slug)) ?? staticBlogPosts.find((p) => p.slug === slug && p.published);
  if (!post) notFound();

  const related = await getLatestBlogPosts(3).catch(() =>
    staticBlogPosts.filter((p) => p.published && p.slug !== slug).slice(0, 3)
  );

  const dbFaqs = await getPublishedFaqsByReference("blog", post.id);
  const blogFaqs = dbFaqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.category, url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ];

  const coverImage = post.coverImage ? imagePresets.blogCover(post.coverImage) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema({ title: post.title, excerpt: post.excerpt, author: post.author, publishedAt: post.publishedAt, image: post.coverImage, slug: post.slug })) }} />
      {blogFaqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(blogFaqs)) }} />
      )}

      <BlogTranslationProvider post={{ title: post.title, excerpt: post.excerpt, content: post.content }}>
      <div className="pt-20">
        {/* Hero */}
        <div className="relative bg-navy py-16 page-padding overflow-hidden">
          {coverImage && (
            <div className="absolute inset-0 opacity-10">
              <Image src={coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-start justify-between gap-4">

              <LanguageControl dark />
            </div>
            <div className="flex items-center gap-3 mt-4 mb-4">
              <span className="section-overline text-gold">{post.category}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50 text-xs">{post.readTime}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50 text-xs">{post.publishedAt}</span>
            </div>
            <TranslatedTitle className="font-heading text-3xl md:text-4xl text-white font-normal" />
            <TranslatedExcerpt className="text-white/60 text-base mt-4" />
          </div>
        </div>

        {/* Content */}
        <div className="page-padding py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            {coverImage && (
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <Image src={coverImage} alt={post.title} fill className="object-cover" priority />
              </div>
            )}
            <TranslatedContent />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-cream rounded-full text-xs text-navy/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="mt-8 bg-cream rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-gold font-heading text-lg shrink-0">
                {post.author[0]}
              </div>
              <div>
                <p className="text-navy text-sm font-normal">{post.author}</p>
                <p className="text-gray-400 text-xs">Real Estate Expert · RealHubb Ventures</p>
              </div>
            </div>

            {/* FAQ Section */}
            {blogFaqs.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-heading text-xl text-navy font-normal mb-6">Frequently Asked Questions</h3>
                <FaqAccordion items={blogFaqs} />
              </div>
            )}

            <CommentSection slug={post.slug} />
          </article>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <InstantCallbackForm />
              {/* Related posts */}
              {related.filter((r) => r.slug !== post.slug).length > 0 && (
                <div>
                  <p className="section-overline text-gold mb-4">Related Articles</p>
                  <div className="space-y-4">
                    {related
                      .filter((r) => r.slug !== post.slug)
                      .slice(0, 3)
                      .map((r) => (
                        <Link
                          key={r.id}
                          href={`/blog/${r.slug}`}
                          className="block group"
                        >
                          <p className="text-navy text-sm font-normal group-hover:text-gold transition-colors line-clamp-2">
                            {r.title}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{r.readTime}</p>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      </BlogTranslationProvider>
    </>
  );
}
