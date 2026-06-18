import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";
const SITE_NAME = "RealHubb";
const PUBLISHER = "RealHubb Ventures Pvt. Ltd.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/** Clamp description to maxLen chars, breaking at the last word boundary. */
function clampDesc(text: string, maxLen = 155): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut) + "…";
}

/** Clamp title to maxLen chars. */
function clampTitle(text: string, maxLen = 60): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 30 ? cut.slice(0, lastSpace) : cut) + "…";
}

export function buildMetadata(params: {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  geoRegion?: string;
  geoPlacename?: string;
}): Metadata {
  const {
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    noIndex = false,
    author,
    datePublished,
    dateModified,
    geoRegion,
    geoPlacename,
  } = params;

  // Use { absolute } to prevent the root layout template appending "| RealHubb" again
  const title = { absolute: clampTitle(params.title) };
  const description = clampDesc(params.description);
  const url = canonical ?? SITE_URL;

  return {
    title,
    description,
    keywords: params.keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    authors: author ? [{ name: author }] : [{ name: PUBLISHER }],
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    verification: {
      google: "oGsNb0RCjzrOrewBDOrbwa2ptrTzklvMKhn8sitGkIs",
    },
    openGraph: {
      title: clampTitle(params.title),
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: clampTitle(params.title) }],
      type: ogType,
      locale: "en_IN",
      ...(ogType === "article" && author
        ? {
            authors: [author],
            publishedTime: datePublished,
            modifiedTime: dateModified,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: clampTitle(params.title),
      description,
      images: [ogImage],
      site: "@realhubb",
    },
    other: {
      publisher: PUBLISHER,
      ...(geoRegion ? { "geo.region": geoRegion } : {}),
      ...(geoPlacename ? { "geo.placename": geoPlacename } : {}),
    },
  };
}

// ── Page-specific metadata factories ────────────────────────────────────────

export function propertyMetadata(p: {
  name: string;
  developer: string;
  location: string;
  city: string;
  bedrooms: string;
  type: string;
  price: string;
  area: string;
  rera: string;
  possession: string;
  slug: string;
  image?: string;
}): Metadata {
  // Progressively shorter titles to fit 60 chars
  const t1 = `${p.name} by ${p.developer} in ${p.location} | RealHubb`;
  const t2 = `${p.name} in ${p.location}, ${p.city} | RealHubb`;
  const t3 = `${p.name} | RealHubb`;
  const title = t1.length <= 60 ? t1 : t2.length <= 60 ? t2 : t3;

  const description = clampDesc(
    `${p.bedrooms} ${p.type} starting ${p.price} in ${p.location}, ${p.city}. Possession ${p.possession}. RERA verified. Contact RealHubb for a free site visit.`
  );

  return buildMetadata({
    title,
    description,
    keywords: `${p.bedrooms} flat in ${p.location}, ${p.city} real estate, ${p.developer} projects, property in ${p.location}, buy flat ${p.city}`,
    canonical: `${SITE_URL}/property/${p.slug}`,
    ogImage: p.image,
    geoRegion: cityToGeoRegion(p.city),
    geoPlacename: p.location,
  });
}

export function blogMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}): Metadata {
  const rawTitle = post.metaTitle ?? `${post.title} | RealHubb`;
  return buildMetadata({
    title: clampTitle(rawTitle),
    description: post.metaDescription ?? clampDesc(post.excerpt),
    canonical: `${SITE_URL}/blog/${post.slug}`,
    ogImage: post.coverImage,
    ogType: "article",
    author: post.author ?? "RealHubb Team",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
  });
}

export function locationMetadata(city: string, area?: string): Metadata {
  const cityTitle = toTitle(city);

  if (area) {
    const areaTitle = toTitle(area.replace(/-/g, " "));
    const title = clampTitle(`Flats in ${areaTitle}, ${cityTitle} 2026 | RealHubb`);
    return buildMetadata({
      title,
      description: clampDesc(
        `Buy 2BHK, 3BHK flats in ${areaTitle}, ${cityTitle}. RERA verified projects. Zero brokerage. Free site visit. Call RealHubb.`
      ),
      keywords: `flats in ${areaTitle.toLowerCase()}, apartments ${areaTitle.toLowerCase()} ${cityTitle.toLowerCase()}, 2bhk ${areaTitle.toLowerCase()}, property ${areaTitle.toLowerCase()} for sale`,
      canonical: `${SITE_URL}/real-estate/${city}/${area}`,
      geoRegion: cityToGeoRegion(city),
      geoPlacename: areaTitle,
    });
  }

  return buildMetadata({
    title: clampTitle(`Properties in ${cityTitle} 2026 | Flats & Apartments | RealHubb`),
    description: clampDesc(
      `Verified flats, apartments & villas in ${cityTitle}. RERA registered projects. Zero brokerage. Free site visit with RealHubb.`
    ),
    keywords: `properties in ${cityTitle.toLowerCase()}, flats in ${cityTitle.toLowerCase()}, apartments ${cityTitle.toLowerCase()}, buy property ${cityTitle.toLowerCase()}`,
    canonical: `${SITE_URL}/real-estate/${city}`,
    geoRegion: cityToGeoRegion(city),
    geoPlacename: cityTitle,
  });
}

export function buySegmentMetadata(segment: string): Metadata {
  const label = segment.replace(/-/g, " ");
  return buildMetadata({
    title: clampTitle(`${toTitle(label)} for Sale 2026 | Best Price | RealHubb`),
    description: clampDesc(
      `Find verified ${label} from top builders in 2026. RERA registered. Zero brokerage. Book free site visit with RealHubb experts.`
    ),
    keywords: `${label}, buy ${label}, ${label} price, ${label} bangalore, real estate ${label}`,
    canonical: `${SITE_URL}/buy/${segment}`,
    geoRegion: "IN-KA",
    geoPlacename: "Bangalore",
  });
}

export function developerMetadata(name: string, slug: string): Metadata {
  return buildMetadata({
    title: clampTitle(`${name} Projects in Bangalore 2026 | RealHubb`),
    description: clampDesc(
      `Browse all ${name} residential projects in Bangalore. Ongoing & upcoming apartments and villas. RERA verified. Contact RealHubb.`
    ),
    keywords: `${name} projects bangalore, ${name} apartments, ${name} villas, ${name.toLowerCase()} real estate`,
    canonical: `${SITE_URL}/developers/${slug}`,
    geoRegion: "IN-KA",
    geoPlacename: "Bangalore",
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toTitle(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function cityToGeoRegion(city: string): string {
  const map: Record<string, string> = {
    bangalore: "IN-KA",
    hyderabad: "IN-TG",
    chennai: "IN-TN",
  };
  return map[city.toLowerCase()] ?? "IN";
}
