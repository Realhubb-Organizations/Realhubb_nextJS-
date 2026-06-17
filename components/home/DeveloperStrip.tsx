"use client";

import Link from "next/link";
import Image from "next/image";
import type { Developer } from "@/types/developer";
import { imagePresets } from "@/lib/cloudinary";

interface Props {
  developers: Developer[];
}

export default function DeveloperStrip({ developers }: Props) {
  if (!developers.length) return null;

  // Duplicate items so the second copy is in position the moment the first copy scrolls off
  const track = [...developers, ...developers];

  return (
    <section className="py-16 bg-navy overflow-hidden">
      {/* Header */}
      <div className="page-padding text-center mb-10">
        <p className="section-overline text-gold mb-2">Trusted Developer Partners</p>
        <p className="text-white/40 text-xs">
          We work exclusively with RERA-verified, track-record-proven builders
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative group">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-navy to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-navy to-transparent" />

        {/* Scrolling container — `group-hover:pause` pauses the animation */}
        <div className="flex overflow-hidden">
          <div
            className="flex gap-5 animate-marquee group-hover:[animation-play-state:paused]"
            style={{ width: "max-content" }}
          >
            {track.map((dev, idx) => (
              <Link
                key={`${dev.id}-${idx}`}
                href={`/developers/${dev.slug}`}
                aria-label={dev.name}
                className="shrink-0 flex items-center justify-center
                           w-44 h-20 rounded-xl
                           bg-white hover:bg-cream
                           shadow-sm hover:shadow-md
                           border border-gray-100 hover:border-gold/40
                           transition-all duration-200 px-4"
              >
                {dev.logo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagePresets.developerLogo(dev.logo)}
                      alt={dev.name}
                      fill
                      sizes="176px"
                      className="object-contain p-2"
                      // No filter — show actual brand colors
                    />
                  </div>
                ) : (
                  <span className="text-navy text-sm font-normal text-center leading-snug line-clamp-2 px-1">
                    {dev.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="page-padding mt-10 text-center">
        <Link
          href="/developers"
          className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm transition-colors group/link"
        >
          View all{" "}
          <span className="text-gold font-normal">{developers.length}+</span>{" "}
          developer partners
          <span className="group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </section>
  );
}
