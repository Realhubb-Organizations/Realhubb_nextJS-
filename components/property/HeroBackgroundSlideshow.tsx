"use client";

import { useEffect, useState } from "react";

interface Props {
  images: string[];
}

export default function HeroBackgroundSlideshow({ images }: Props) {
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
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover filter brightness-95"
          />
        </div>
      ))}
      {/* Linear navy-dominant gradient overlay to maintain readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/15 z-10" />
    </div>
  );
}
