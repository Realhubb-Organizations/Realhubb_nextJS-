import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { imagePresets } from "@/lib/cloudinary";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

interface Props {
  posts: BlogPost[];
}

export default function BlogPreview({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="page-padding">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-overline text-gold-800 mb-2">Expert Insights</p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy font-normal">
              Real Estate Insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:block text-sm text-navy/75 hover:text-gold-800 transition-colors border-b border-navy/25 hover:border-gold-800 pb-0.5"
          >
            View All Articles →
          </Link>
        </div>

        <RevealGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <RevealCard key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-cream rounded-2xl overflow-hidden hover:shadow-lg transition-shadow h-full"
              >
                <div className="relative h-48 bg-navy/10">
                  {post.coverImage ? (
                    <Image
                      src={imagePresets.blogCover(post.coverImage)}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-navy/5">
                      <span className="section-overline text-gold-800">{post.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gold-800 text-xs section-overline">{post.category}</span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-navy text-base font-normal group-hover:text-gold transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </RevealCard>
          ))}
        </RevealGrid>

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="text-navy/75 text-sm hover:text-gold-800 transition-colors">
            Read all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
