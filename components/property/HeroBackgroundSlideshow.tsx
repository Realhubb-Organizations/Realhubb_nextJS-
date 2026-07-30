"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  propertyName?: string;
}

export default function HeroBackgroundSlideshow({ images, propertyName }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-65" : "opacity-0"
          }`}
        >
          {/* Only the first slide loads eagerly (it's the LCP candidate on
              first paint) — the rest lazy-load so a 10-photo gallery doesn't
              compete for bandwidth with the visible image. */}
          <Image
            src={src}
            alt={propertyName ? `${propertyName} slideshow image ${i + 1}` : "Property background gallery view"}
            fill
            sizes="100vw"
            quality={55}
            className="object-cover brightness-95"
            {...(i === 0 ? { priority: true } : { loading: "lazy" as const })}
          />
        </div>
      ))}
      {/* Linear navy-dominant gradient overlay to maintain readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/15 z-10" />
    </div>
  );
}
