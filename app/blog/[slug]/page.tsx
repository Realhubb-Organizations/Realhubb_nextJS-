import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogMetadata } from "@/lib/seo";
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  getLatestBlogPosts,
  getPublishedFaqsByReference,
} from "@/lib/firestoreServerService";
import { generatePageGraph } from "@/lib/structuredData";
import { imagePresets } from "@/lib/cloudinary";

import BlogReaderWrapper from "@/components/blog/BlogReaderWrapper";
import BlogMarkdown from "@/components/blog/BlogMarkdown";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type Params = Promise<{ slug: string }>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://realhubb.in";

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

export const revalidate = 3600;

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
      {/* JSON-LD Master Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generatePageGraph({
              url: `${SITE_URL}/blog/${post.slug}`,
              title: post.metaTitle ?? `${post.title} | RealHubb`,
              description: post.metaDescription ?? post.excerpt,
              breadcrumbs,
              faq: blogFaqs.length > 0 ? blogFaqs : undefined,
              article: {
                title: post.title,
                excerpt: post.excerpt,
                author: post.author,
                publishedAt: post.publishedAt,
                image: post.coverImage,
                slug: post.slug,
              },
            })
          ),
        }}
      />

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
          <BlogMarkdown content={post.content} />
        </BlogReaderWrapper>
      </div>
    </>
  );
}
