"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { imagePresets } from "@/lib/cloudinary";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  posts: BlogPost[];
}

export default function BlogListingClient({ posts }: Props) {
  // Unique case-insensitive list of categories, preserving display case
  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => (p.category || "").trim()))).filter(
      (value, index, self) => self.findIndex((t) => t.toLowerCase() === value.toLowerCase()) === index
    )
  ];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleCategory = (cat: string) => {
    const isAll = cat.toLowerCase() === "all";
    if (isAll) {
      setSelectedCategories(["All"]);
    } else {
      const isAlreadySelected = selectedCategories.some(
        (c) => c.toLowerCase() === cat.toLowerCase()
      );
      if (isAlreadySelected) {
        const next = selectedCategories.filter(
          (c) => c.toLowerCase() !== cat.toLowerCase()
        );
        if (next.length === 0) {
          setSelectedCategories(["All"]);
        } else {
          setSelectedCategories(next);
        }
      } else {
        const next = [
          ...selectedCategories.filter((c) => c.toLowerCase() !== "all"),
          cat,
        ];
        setSelectedCategories(next);
      }
    }
  };

  const filtered = posts.filter((p) => {
    const pCat = (p.category || "").trim().toLowerCase();
    const catMatch =
      selectedCategories.some((c) => c.toLowerCase() === "all") ||
      selectedCategories.some((c) => c.trim().toLowerCase() === pCat);
    const searchMatch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="bg-cream min-h-screen pb-24">
      <div className="page-padding relative z-20 -mt-12 md:-mt-16">
        {/* Floating Controls Bar */}
        <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 shadow-xl animate-fadeIn">
          {/* Search and Category Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between relative z-30">
            {/* Custom Multi-Select Dropdown Category Selector */}
            <div ref={dropdownRef} className="relative shrink-0 w-full sm:w-64">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full min-h-[48px] bg-gray-50/50 border border-gray-200 text-navy rounded-xl px-4 py-3 pr-10 text-left focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 shadow-sm cursor-pointer text-sm font-medium relative flex items-center justify-between group hover:border-gold/60"
              >
                <span className="truncate pr-2 font-normal">
                  {selectedCategories.some((c) => c.toLowerCase() === "all")
                    ? "All Categories"
                    : selectedCategories.length === 1
                      ? selectedCategories[0]
                      : `${selectedCategories[0]} (+${selectedCategories.length - 1})`}
                </span>
                <ChevronDown className={`w-4 h-4 text-navy/50 group-hover:text-navy transition-transform duration-250 ml-2 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu List */}
              {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-150 rounded-2xl shadow-xl py-2 z-50 max-h-72 overflow-y-auto">
                  <div className="px-1 py-1 space-y-0.5">
                    {categories.map((cat) => {
                      const isChecked = selectedCategories.some(
                        (c) => c.toLowerCase() === cat.toLowerCase()
                      );
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleToggleCategory(cat)}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-navy hover:text-navy hover:bg-gold/5 rounded-xl text-left transition-colors font-light cursor-pointer"
                        >
                          <span className="truncate pr-2 font-normal">{cat}</span>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isChecked ? 'bg-gold border-gold' : 'border-gray-300 bg-transparent'}`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-navy" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Text Search Input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title or keywords…"
                className="w-full bg-gray-50/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl pl-11 pr-4 py-3 text-sm text-navy focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results grid container */}
        <div className="max-w-7xl mx-auto mt-12">
          {/* Results count info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-navy/50 text-sm">
              Showing <span className="text-navy font-normal">{filtered.length}</span> {filtered.length === 1 ? "article" : "articles"} found
            </p>
          </div>

          {filtered.length > 0 ? (
            <RevealGrid
              key={`${selectedCategories.join("-")}_${search}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((post) => (
                <RevealCard key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between h-full bg-white border border-gray-100 hover:border-gold/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="relative h-52 bg-navy/5 overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={imagePresets.blogCover(post.coverImage)}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/5 to-navy/15">
                            <span className="section-overline text-navy/30 text-lg">{post.category[0]}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-navy text-white uppercase tracking-wider font-normal">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-grow">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <span>{post.publishedAt}</span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-heading text-navy text-lg font-normal group-hover:text-gold transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 mt-auto flex items-center justify-between border-t border-gray-50/50">
                      <span className="text-xs text-gold border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold group-hover:text-navy transition-all ml-auto">
                        Read Article →
                      </span>
                    </div>
                  </Link>
                </RevealCard>
              ))}
            </RevealGrid>
          ) : (
            <div className="text-center bg-white border border-gray-100 rounded-3xl py-24 px-6 shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-heading text-xl text-navy font-normal mb-2">No Articles Found</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                We couldn't find any articles matching your search or category selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategories(["All"]);
                }}
                className="bg-gold text-navy px-6 py-2.5 rounded-xl text-sm font-normal hover:bg-gold/90 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
