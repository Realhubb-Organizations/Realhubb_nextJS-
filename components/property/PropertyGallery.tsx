"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand, Camera } from "lucide-react";
import { imagePresets } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const total = images.length;
  const hasMany = total > 1;

  const prev = useCallback(() =>
    setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() =>
    setActive((i) => (i + 1) % total), [total]);

  // Keyboard navigation (active in lightbox)
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (!total) {
    return (
      <div className="h-72 md:h-[480px] bg-gradient-to-br from-navy to-navy/60 flex items-center justify-center">
        <span className="font-heading text-white/20 text-6xl">{propertyName[0]}</span>
      </div>
    );
  }

  const heroSrc = imagePresets.propertyHero(images[active]);
  const thumbSrc = (img: string) => imagePresets.thumbnail(img);

  return (
    <>
      {/* ── Main gallery ─────────────────────────────────────────────── */}
      <div className="relative bg-black group">
        {/* Main image */}
        <div
          className="relative h-72 md:h-[480px] cursor-pointer overflow-hidden"
          onClick={() => setLightbox(true)}
        >
          <Image
            key={images[active]}
            src={heroSrc}
            alt={`${propertyName} — photo ${active + 1}`}
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-300"
            priority={active === 0}
          />
          {/* Subtle darkening gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Expand hint */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="w-3.5 h-3.5" />
            View fullscreen
          </div>

          {/* Photo counter */}
          {hasMany && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white rounded-full px-3 py-1 flex items-center gap-1.5 text-xs">
              <Camera className="w-3 h-3" />
              {active + 1} / {total}
            </div>
          )}
        </div>

        {/* Prev / Next arrows */}
        {hasMany && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2
                         w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm
                         flex items-center justify-center text-white
                         opacity-0 group-hover:opacity-100
                         hover:bg-black/80 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2
                         w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm
                         flex items-center justify-center text-white
                         opacity-0 group-hover:opacity-100
                         hover:bg-black/80 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ───────────────────────────────────────────── */}
      {hasMany && (
        <div className="bg-black px-4 pb-3 pt-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden",
                "border-2 transition-all duration-200",
                i === active
                  ? "border-gold opacity-100 scale-105"
                  : "border-transparent opacity-50 hover:opacity-80 hover:border-white/30"
              )}
            >
              <Image
                src={thumbSrc(img)}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Dot indicators (mobile, when ≤ 8 images) ─────────────────── */}
      {hasMany && total <= 8 && (
        <div className="flex justify-center gap-1.5 bg-black pb-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full transition-all duration-200",
                i === active ? "w-5 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/30"
              )}
            />
          ))}
        </div>
      )}

      {/* ── Lightbox / Fullscreen modal ───────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={() => setLightbox(false)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <p className="font-heading text-base font-normal">{propertyName}</p>
              <p className="text-white/50 text-xs">{active + 1} of {total} photos</p>
            </div>
            <button
              onClick={() => setLightbox(false)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main lightbox image */}
          <div
            className="relative flex-1 mx-4 mb-4 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={`lb-${images[active]}`}
              src={imagePresets.propertyHero(images[active])}
              alt={`${propertyName} photo ${active + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {/* Arrow buttons */}
            {hasMany && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2
                             w-11 h-11 rounded-full bg-black/70 backdrop-blur-sm
                             flex items-center justify-center text-white
                             hover:bg-black/90 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             w-11 h-11 rounded-full bg-black/70 backdrop-blur-sm
                             flex items-center justify-center text-white
                             hover:bg-black/90 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox thumbnails */}
          {hasMany && (
            <div
              className="shrink-0 flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative shrink-0 w-16 h-12 rounded-lg overflow-hidden",
                    "border-2 transition-all",
                    i === active
                      ? "border-gold"
                      : "border-transparent opacity-40 hover:opacity-70"
                  )}
                >
                  <Image
                    src={thumbSrc(img)}
                    alt={`Photo ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
