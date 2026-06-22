"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Share2,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  MessageCircle,
  ChevronRight,
  List,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslatedTitle, TranslatedExcerpt, LanguageControl } from "./TranslatableArticle";
import CommentSection from "./CommentSection";
import InstantCallbackForm from "@/components/lead/InstantCallbackForm";

interface HeadingItem {
  text: string;
  id: string;
}

interface BlogReaderWrapperProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: string;
    coverImage: string | null;
    tags?: string[];
  };
  blogFaqs: { question: string; answer: string }[];
  related: any[];
  children: ReactNode; // Main translated markdown content
}

export default function BlogReaderWrapper({
  post,
  blogFaqs,
  related,
  children
}: BlogReaderWrapperProps) {
  const [readMode, setReadMode] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("normal");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [showTocMobile, setShowTocMobile] = useState(false);

  // Parse Table of Contents headings from Markdown content
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    const parsedHeadings: HeadingItem[] = [];
    if (post.content) {
      post.content.split("\n").forEach((line) => {
        if (line.startsWith("## ")) {
          const text = line.replace("## ", "").trim();
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
          parsedHeadings.push({ text, id });
        }
      });
      setHeadings(parsedHeadings);
    }
  }, [post.content]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrolled = (window.scrollY / totalHeight) * 100;
        setProgress(scrolled);
      }

      // Highlight active heading based on scroll position
      if (headings.length > 0) {
        let currentActive = "";
        for (const heading of headings) {
          const el = document.getElementById(heading.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If the heading is in the top portion of the viewport, mark active
            if (rect.top <= 120) {
              currentActive = heading.id;
            }
          }
        }
        setActiveHeading(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Handle body class for background transitions and distraction removal
  useEffect(() => {
    if (readMode) {
      document.body.classList.add("read-mode-active");
    } else {
      document.body.classList.remove("read-mode-active");
    }
    return () => {
      document.body.classList.remove("read-mode-active");
    };
  }, [readMode]);

  const toggleReadMode = () => setReadMode((prev) => !prev);
  const increaseFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("xl");
  };
  const decreaseFontSize = () => {
    if (fontSize === "xl") setFontSize("large");
    else if (fontSize === "large") setFontSize("normal");
  };

  // Social sharing logic
  const getPageUrl = () => typeof window !== "undefined" ? window.location.href : "";

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(getPageUrl())}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + getPageUrl())}`;
    window.open(url, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getPageUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setShowTocMobile(false);
    }
  };

  return (
    <div className={cn("transition-colors duration-500", readMode ? "bg-[#050505] min-h-screen text-stone-300" : "bg-cream")}>
      
      {/* ── STICKY TOP READER BAR ─────────────────────────────────────── */}
      {readMode && (
        <div className="fixed top-0 left-0 right-0 z-[10000] bg-black/95 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between text-white animate-fadeIn">
          {/* Close Read Mode */}
          <button
            onClick={() => setReadMode(false)}
            className="flex items-center gap-2 text-stone-400 hover:text-gold transition-colors text-xs md:text-sm font-light cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Exit Reading Mode</span>
          </button>

          {/* Title or category (centered on large screen) */}
          <div className="hidden lg:block text-xs font-normal tracking-wide text-stone-400 line-clamp-1 max-w-xl">
            Category: <span className="text-gold font-medium">{post.category}</span> · {post.title}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language control (Reader mode) */}
            <div className="hidden sm:block border-r border-white/10 pr-4 scale-90 origin-right">
              <LanguageControl dark />
            </div>

            {/* Font Size controls */}
            <div className="flex items-center gap-1 border-r border-white/10 pr-4">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === "normal"}
                className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-20 disabled:hover:text-stone-400 transition-colors cursor-pointer"
                title="Decrease text size"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs text-stone-400 font-medium px-1.5 select-none w-8 text-center">
                {fontSize === "normal" ? "1.0x" : fontSize === "large" ? "1.2x" : "1.4x"}
              </span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize === "xl"}
                className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-20 disabled:hover:text-stone-400 transition-colors cursor-pointer"
                title="Increase text size"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Sharing buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={shareToTwitter}
                className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Share on X"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={copyLink}
                className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white transition-colors flex items-center justify-center relative cursor-pointer"
                title="Copy Link"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied && (
                  <span className="absolute -bottom-8 right-0 bg-stone-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SCROLL PROGRESS BAR (STICKY) ──────────────────────────────── */}
      {readMode && (
        <div className="fixed top-[53px] left-0 right-0 z-[10000] h-1 bg-stone-900 overflow-hidden">
          <div className="h-full bg-gold transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* ── NORMAL HERO (HIDDEN IN READ MODE) ────────────────────────── */}
      {!readMode && (
        <div className="relative bg-navy py-16 page-padding overflow-hidden">
          {post.coverImage && (
            <div className="absolute inset-0 opacity-10">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="section-overline text-gold">{post.category}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50 text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.readTime}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-white/50 text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {post.publishedAt}
              </span>
            </div>
            <TranslatedTitle className="speakable-title font-heading text-3xl md:text-4xl text-white font-normal leading-tight" />
            <TranslatedExcerpt className="speakable-summary text-white/60 text-base mt-4 font-light leading-relaxed" />
          </div>
        </div>
      )}

      {/* ── LAYOUT CONTENT CONTAINER ─────────────────────────────────── */}
      <div className={cn("page-padding py-12 relative", readMode ? "max-w-4xl mx-auto pt-24" : "")}>
        
        {/* Read Mode Floating Table of Contents (Desktop sidebar) */}
        {readMode && headings.length > 0 && (
          <aside className="hidden xl:block absolute -left-64 top-24 w-56 sticky top-28 self-start text-xs pr-4 border-r border-white/5 select-none h-fit">
            <p className="text-gold font-heading tracking-wider uppercase font-semibold mb-3 flex items-center gap-1.5">
              <List className="h-3.5 w-3.5" />
              <span>In this Article</span>
            </p>
            <div className="space-y-2 border-l border-white/10 pl-3 py-1">
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollToHeading(h.id)}
                  className={cn(
                    "block text-left py-1 text-stone-400 hover:text-white transition-all leading-snug cursor-pointer font-light relative",
                    activeHeading === h.id ? "text-gold hover:text-gold font-medium scale-[1.02]" : ""
                  )}
                >
                  {activeHeading === h.id && (
                    <span className="absolute -left-[17px] top-[7px] w-2.5 h-[1.5px] bg-gold" />
                  )}
                  {h.text}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Normal Mode Reader Invitation Prompter */}
        {!readMode && (
          <div className="mb-8 p-4 bg-gold/5 border border-gold/15 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-navy text-sm font-medium">Prefer an distraction-free view?</p>
                <p className="text-gray-400 text-xs font-light">Toggle reader mode for enhanced text, black background, and clean outline.</p>
              </div>
            </div>
            <button
              onClick={toggleReadMode}
              className="px-4 py-2 bg-gold hover:bg-gold-600 text-navy font-heading text-xs font-medium rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Start Reading Mode</span>
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className={cn(readMode ? "" : "grid grid-cols-1 lg:grid-cols-3 gap-10")}>
          
          {/* Main Article Body */}
          <article
            className={cn(
              "transition-all duration-300",
              readMode ? "lg:col-span-3 max-w-2xl mx-auto font-serif" : "lg:col-span-2",
              fontSize === "large" ? "text-lg md:text-xl" : fontSize === "xl" ? "text-xl md:text-2xl" : "text-base"
            )}
          >
            {/* Dark Mode Title Headers */}
            {readMode && (
              <div className="mb-10 pb-8 border-b border-white/10 select-none">
                <span className="text-gold font-heading text-xs uppercase tracking-widest font-semibold block mb-3">
                  {post.category}
                </span>
                <TranslatedTitle className="speakable-title font-heading text-3xl md:text-4xl lg:text-5xl text-white font-normal leading-tight mb-4" />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs text-stone-400 font-light mt-4">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gold/80" /> {post.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gold/80" /> {post.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold/80" /> {post.readTime}
                  </span>
                </div>
              </div>
            )}

            {/* Inline Table of Contents for Mobile or non-expanded layouts */}
            {headings.length > 0 && (
              <div className={cn(
                "mb-8 p-5 bg-white border border-gray-150/80 rounded-2xl shadow-sm",
                readMode ? "xl:hidden bg-stone-900/40 border-white/5 text-stone-300" : ""
              )}>
                <button
                  onClick={() => setShowTocMobile((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <span className={cn("font-heading text-sm font-semibold uppercase tracking-wider", readMode ? "text-gold" : "text-navy")}>
                    Table of Contents ({headings.length} sections)
                  </span>
                  <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", showTocMobile ? "rotate-90" : "")} />
                </button>
                {showTocMobile && (
                  <div className="mt-4 pt-3 border-t border-gray-100/50 space-y-2 text-sm">
                    {headings.map((h, index) => (
                      <button
                        key={h.id}
                        onClick={() => scrollToHeading(h.id)}
                        className="block text-left text-xs hover:text-gold transition-colors py-1 cursor-pointer font-light line-clamp-1"
                      >
                        <span className="text-gold font-mono pr-2">{index + 1}.</span>
                        {h.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Standard Cover Image */}
            {post.coverImage && (
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Inline translation widget (Normal Mode Only) */}
            {!readMode && (
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 select-none">
                <span className="text-xs font-semibold tracking-wider text-navy/40 uppercase">
                  Translate Article
                </span>
                <LanguageControl />
              </div>
            )}

            {/* Markdown Rendered Content */}
            <div className="transition-all duration-300">
              {children}
            </div>

            {/* Tag List */}
            {post.tags && post.tags.length > 0 && (
              <div className={cn("mt-10 pt-8 border-t border-gray-100/80", readMode ? "border-white/5" : "")}>
                <p className={cn("text-xs font-semibold tracking-wider uppercase mb-4", readMode ? "text-stone-500" : "text-navy/40")}>Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-3 py-1 bg-white border border-gray-200 text-navy/70 rounded-xl text-xs transition-all shadow-sm cursor-pointer select-none",
                        readMode
                          ? "bg-stone-900 border-white/5 text-stone-300 hover:border-gold hover:text-gold"
                          : "hover:border-gold hover:text-gold hover:shadow-md hover:-translate-y-0.5"
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author details card */}
            <div className={cn("mt-8 bg-cream rounded-2xl p-5 flex items-center gap-4", readMode ? "bg-stone-900/30 border border-white/5" : "")}>
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-gold font-heading text-lg shrink-0 font-normal">
                {post.author[0]}
              </div>
              <div>
                <p className={cn("text-navy text-sm font-medium", readMode ? "text-stone-200" : "")}>{post.author}</p>
                <p className="text-gray-400 text-xs">Real Estate Expert · RealHubb Ventures</p>
              </div>
            </div>

            {/* Read Mode bottom actions */}
            {readMode && (
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                <p className="text-xs text-stone-500 font-light">Finished reading? You can return back to standard view.</p>
                <button
                  onClick={() => {
                    setReadMode(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-2 bg-gold hover:bg-gold-600 text-navy font-heading text-xs font-medium rounded-xl cursor-pointer shadow-md"
                >
                  Exit Reader Mode
                </button>
              </div>
            )}

            {/* FAQ Accordion Section */}
            {blogFaqs.length > 0 && (
              <div className={cn("mt-12 pt-8 border-t border-gray-100", readMode ? "border-white/5" : "")}>
                <h3 className={cn("font-heading text-xl text-navy font-normal mb-6", readMode ? "text-white" : "")}>
                  Frequently Asked Questions
                </h3>
                <div className={cn(readMode ? "dark-details" : "")}>
                  {blogFaqs.map((faq) => (
                    <details
                      key={faq.question}
                      className={cn(
                        "border border-gray-150/80 rounded-2xl p-5 group transition-all duration-300 mb-4",
                        readMode
                          ? "bg-stone-900/10 border-white/5 hover:border-gold/30"
                          : "bg-white hover:border-gold/30"
                      )}
                    >
                      <summary className="text-sm md:text-base font-normal cursor-pointer list-none flex justify-between items-center select-none">
                        <span className={readMode ? "text-stone-200" : "text-navy"}>{faq.question}</span>
                        <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4">
                          ▾
                        </span>
                      </summary>
                      <p className={cn("text-sm mt-4 leading-relaxed font-light border-t pt-4", readMode ? "text-stone-400 border-white/5" : "text-gray-500 border-gray-100")}>
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Comments (Hides in read mode to prevent distraction, or shown cleanly) */}
            <div className={cn("mt-8", readMode ? "hidden" : "")}>
              <CommentSection slug={post.slug} />
            </div>
          </article>

          {/* Sidebar - Hides completely in readMode */}
          {!readMode && (
            <aside className="animate-fadeIn">
              <div className="sticky top-24 space-y-6">
                <InstantCallbackForm />
                
                {/* Related posts */}
                {related.filter((r) => r.slug !== post.slug).length > 0 && (
                  <div className="bg-white border border-gray-150/80 rounded-3xl p-6 shadow-sm">
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
                            <p className="text-navy text-sm font-normal group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                              {r.title}
                            </p>
                            <p className="text-gray-400 text-[10px] mt-1.5 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {r.readTime}
                            </p>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
