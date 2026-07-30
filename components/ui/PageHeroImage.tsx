import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Tailwind classes for opacity/filter, e.g. "opacity-40 brightness-95" */
  className?: string;
}

// Shared full-bleed hero background image used across page headers
// (about, blog, career, contact-us, etc). Renders through next/image so it
// gets a responsive srcset, automatic fetchPriority=high + preload, and a
// reserved layout box — the raw <img> version this replaces was the LCP
// bottleneck on nearly every non-homepage page.
export default function PageHeroImage({ src, alt, className = "object-cover opacity-40" }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      quality={55}
      sizes="100vw"
      className={className}
    />
  );
}
