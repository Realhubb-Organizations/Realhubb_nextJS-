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
import { breadcrumbSchema, articleSchema, faqSchema } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";

import InstantCallbackForm from "@/components/lead/InstantCallbackForm";
import CommentSection from "@/components/blog/CommentSection";
import FaqAccordion from "@/components/faq/FaqAccordion";
import BlogReaderWrapper from "@/components/blog/BlogReaderWrapper";
import {
  BlogTranslationProvider,
  TranslatedContent,
} from "@/components/blog/TranslatableArticle";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type Params = Promise<{ slug: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
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
    keywords: post.tags && post.tags.length > 0 ? post.tags.join(", ") : undefined,
  });
}

export async function generateStaticParams() {
  const fireStoreSlugs = await getAllBlogSlugs().catch(() => []);
  return fireStoreSlugs.map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = await getLatestBlogPosts(3).catch(() => []);

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
          <div className="page-padding max-w-7xl mx-auto pt-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <BlogReaderWrapper
            post={{
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              category: post.category,
              readTime: post.readTime,
              publishedAt: post.publishedAt,
              author: post.author,
              coverImage: coverImage,
              tags: post.tags,
            }}
            blogFaqs={blogFaqs}
            related={related}
          >
            <TranslatedContent />
          </BlogReaderWrapper>
        </div>
      </BlogTranslationProvider>
    </>
  );
}
