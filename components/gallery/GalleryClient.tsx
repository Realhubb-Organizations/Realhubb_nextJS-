"use client";

import { useState } from "react";
import { Images, Search, Calendar, X } from "lucide-react";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import { useGalleryPosts } from "@/hooks/useGalleryPosts";
import Image from "next/image";

const CATEGORIES = ["All", "Events", "Award & Recognition"];

export default function GalleryClient() {
  const { posts, loading } = useGalleryPosts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<null | { image: string; title: string; description: string; category: string }>(null);

  const filtered = posts.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4 text-navy" />
            </button>
            <div className="relative w-full h-[50vh] sm:h-[60vh] bg-slate-900">
              <Image
                src={lightbox.image}
                alt={lightbox.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <div className="p-5">
              <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-normal block mb-1">
                {lightbox.category}
              </span>
              <h3 className="text-[#00274D] font-normal text-lg mb-1">{lightbox.title}</h3>
              {lightbox.description && (
                <p className="text-gray-500 text-sm leading-relaxed">{lightbox.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#faf6f1]">
        {/* ── FILTERS ── */}
        <section className="py-6 bg-[#faf6f1] sticky top-16 z-10 border-b border-gray-100 shadow-sm">
          <div className="page-padding">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search gallery…"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#D7A764]/30 focus:border-[#D7A764] text-navy"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-normal transition-all duration-200 ${
                      category === c
                        ? "bg-[#00274D] text-white"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-[#D7A764]/50 hover:text-[#00274D]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {!loading && (
                <span className="text-xs text-gray-400 sm:ml-auto shrink-0">
                  {filtered.length} post{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <section className="py-12">
          <div className="page-padding">
            {/* Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-56 bg-gray-100 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Posts */}
            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, index) => (
                  <FadeInOnScroll key={post.id} direction="up" delay={Math.min(index * 60, 300)}>
                    <div
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        setLightbox({
                          image: post.image,
                          title: post.title,
                          description: post.description,
                          category: post.category,
                        })
                      }
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={index < 3}
                        />
                        {/* Category badge */}
                        <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#D7A764] text-[#00274D] text-[10px] font-normal uppercase tracking-wider rounded-full">
                          {post.category}
                        </span>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-[#00274D]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                            <Search className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-[#00274D] font-normal text-sm mb-1 line-clamp-1 group-hover:text-[#D7A764] transition-colors duration-200">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {post.description}
                          </p>
                        )}
                        {post.publishedAt && (
                          <p className="flex items-center gap-1 text-[10px] text-gray-300 mt-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Images className="h-10 w-10 text-[#D7A764]" />
                </div>
                <h3 className="text-2xl font-normal text-[#00274D] mb-2">No Posts Found</h3>
                <p className="text-gray-400 text-sm">
                  {search || category !== "All"
                    ? "Try a different search or category."
                    : "Gallery posts will appear here once published."}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
