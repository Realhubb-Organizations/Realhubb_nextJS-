"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { imagePresets } from "@/lib/cloudinary";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

interface Props {
  posts: BlogPost[];
}

export default function BlogListingClient({ posts }: Props) {
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const catMatch = active === "All" || p.category === active;
    const searchMatch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="page-padding py-10">
      {/* Search */}
      <input
        type="text"
        placeholder="Search articles…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold mb-6"
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-normal transition-all ${
              active === cat
                ? "bg-navy text-white"
                : "bg-white border border-gray-200 text-navy/60 hover:border-navy"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <RevealCard key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 block h-full"
              >
                <div className="relative h-48 bg-navy/5">
                  {post.coverImage ? (
                    <Image
                      src={imagePresets.blogCover(post.coverImage)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/5 to-navy/15">
                      <span className="section-overline text-navy/30">{post.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="section-overline text-gold text-[9px]">{post.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="font-heading text-navy text-base font-normal group-hover:text-gold transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
                  <p className="text-gray-300 text-xs mt-3">{post.publishedAt}</p>
                </div>
              </Link>
            </RevealCard>
          ))}
        </RevealGrid>
      ) : (
        <p className="text-center text-gray-400 py-16">No articles match your search.</p>
      )}
    </div>
  );
}
