"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Maximize2, Shield, Camera } from "lucide-react";
import type { Property } from "@/types/property";
import { imagePresets } from "@/lib/cloudinary";

interface Props {
  property: Property;
  imagePriority?: boolean;
}

export default function PropertyCard({ property: p, imagePriority = false }: Props) {
  const img = p.images[0] ? imagePresets.propertyCard(p.images[0]) : null;
  const photoCount = p.images.length;

  return (
    <Link
      href={`/property/${p.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-gold/30"
    >
      {/* Image */}
      <div className="relative h-52 bg-navy/5 overflow-hidden shrink-0">
        {img ? (
          <Image
            src={img}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={imagePriority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/5 to-navy/15">
            <span className="font-heading text-navy/30 text-lg">{p.name[0]}</span>
          </div>
        )}

        {/* Status + featured badges — top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-normal uppercase tracking-wider ${
              p.projectType === "upcoming"
                ? "bg-gold text-navy"
                : "bg-navy text-white"
            }`}
          >
            {p.projectType === "upcoming" ? "Upcoming" : "Ongoing"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-navy/70 text-white uppercase tracking-wider">
            {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
          </span>
          {p.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/90 text-navy uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Photo count badge — bottom right */}
        {photoCount > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white rounded-full px-2 py-0.5 text-[10px]">
            <Camera className="w-2.5 h-2.5" />
            {photoCount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="section-overline text-gold mb-1">{p.developer}</p>
        <h3 className="font-heading text-navy text-lg font-normal group-hover:text-gold transition-colors mb-2 line-clamp-1">
          {p.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{p.location}, {p.city.charAt(0).toUpperCase() + p.city.slice(1)}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          {p.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" /> {p.bedrooms}
            </span>
          )}
          {p.area && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" /> {p.area}
            </span>
          )}
          {p.rera && (
            <span className="flex items-center gap-1 text-green-600">
              <Shield className="w-3.5 h-3.5" /> RERA
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            <p className="font-heading text-navy text-lg font-normal">{p.price}</p>
            {p.possession && (
              <p className="text-gray-400 text-xs">Possession: {p.possession}</p>
            )}
          </div>
          <span className="text-xs text-gold border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold group-hover:text-navy transition-all shrink-0">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
