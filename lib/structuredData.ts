import { companyInfo } from "@/data/company";
import { ensureISOString } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: "RealHubb Ventures Pvt. Ltd.",
    alternateName: "RealHubb",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "RealHubb Ventures is a leading real estate channel partner operating across Bangalore, Hyderabad, and Chennai. Verified properties, RERA registered, zero brokerage.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bangalore",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
      contactType: "sales",
      areaServed: ["Bangalore", "Hyderabad", "Chennai"],
      availableLanguage: ["English", "Hindi", "Kannada", "Telugu"],
    },
    areaServed: [
      { "@type": "City", name: "Bangalore" },
      { "@type": "City", name: "Hyderabad" },
      { "@type": "City", name: "Chennai" },
    ],
    sameAs: [
      "https://www.instagram.com/realhubb",
      "https://www.facebook.com/realhubb",
      "https://www.linkedin.com/company/realhubb",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RealHubb",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/projects/ongoing/bangalore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function propertyListingSchema(p: {
  name: string;
  description: string;
  location: string;
  city: string;
  price: string;
  images: string[];
  slug: string;
  rera?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.name,
    description: p.description,
    url: `${SITE_URL}/property/${p.slug}`,
    image: p.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: p.location,
      addressLocality: p.city,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    ...(p.rera ? { identifier: { "@type": "PropertyValue", name: "RERA", value: p.rera } } : {}),
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  slug: string;
}) {
  const publishedDateISO = ensureISOString(post.publishedAt) ?? post.publishedAt;
  const modifiedDateISO = ensureISOString(post.updatedAt ?? post.publishedAt) ?? post.publishedAt;

  // Check if the author matches a registered team expert for E-E-A-T Person mapping
  const matchingMember = companyInfo.team.find(
    (t) => t.name.toLowerCase() === post.author.toLowerCase()
  );

  const authorSchema = matchingMember
    ? {
        "@type": "Person",
        name: matchingMember.name,
        jobTitle: matchingMember.designation,
        worksFor: {
          "@type": "Organization",
          name: "RealHubb Ventures Pvt. Ltd.",
          url: SITE_URL,
        },
        sameAs: matchingMember.linkedin ? [matchingMember.linkedin] : [],
      }
    : {
        "@type": "Organization",
        name: post.author,
        url: SITE_URL,
      };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: authorSchema,
    publisher: {
      "@type": "Organization",
      name: "RealHubb",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    datePublished: publishedDateISO,
    dateModified: modifiedDateISO,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable-title", ".speakable-summary"],
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function personSchema(member: {
  name: string;
  role: string;
  linkedin?: string;
  specialisation?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      "@type": "Organization",
      name: "RealHubb Ventures Pvt. Ltd.",
      url: SITE_URL,
    },
    url: `${SITE_URL}/team`,
    ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
    ...(member.specialisation
      ? {
          knowsAbout: member.specialisation
            .split(",")
            .map((s) => s.trim())
            .concat(["Real Estate", "Property Investment", "Bangalore Real Estate"]),
        }
      : {}),
  };
}

export function jobPostingListSchema(
  jobs: { title: string; description: string; location: string; datePosted: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: job.datePosted,
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: "RealHubb Ventures Pvt Ltd",
          sameAs: SITE_URL,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        },
      },
    })),
  };
}

export function localBusinessSchema(city: string, area?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RealHubb Ventures Pvt. Ltd.",
    url: SITE_URL,
    areaServed: area
      ? { "@type": "Place", name: `${area}, ${city}` }
      : { "@type": "City", name: city },
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "IN",
    },
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  };
}

export function itemListSchema(
  items: { name: string; url: string; image?: string; description?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
      ...(item.image ? { image: item.image } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function softwareApplicationSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };
}

export function webPageSchema(p: {
  name: string;
  description: string;
  url: string;
  speakableSelectors?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: p.name,
    description: p.description,
    url: p.url,
    ...(p.speakableSelectors && p.speakableSelectors.length > 0
      ? {
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: p.speakableSelectors,
          },
        }
      : {}),
  };
}

export function howToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string; url: string }[],
  totalTime?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      url: s.url,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: s.text,
        },
      ],
    })),
  };
}

export function videoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
    ...(video.duration ? { duration: video.duration } : {}),
  };
}

export function reviewSchema(p: {
  ratingValue: string;
  reviewCount: number;
  reviews: { name: string; rating: number; review: string; date: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RealHubb — Realhubb Ventures Private Limited",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No.96/110, Markondaiah Layout, Thanisandra Village",
      addressLocality: "Bangalore North",
      addressRegion: "Karnataka",
      postalCode: "560064",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.ratingValue,
      reviewCount: p.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: p.reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
      reviewBody: r.review,
      datePublished: r.date,
    })),
  };
}

export function builderSchema(dev: {
  name: string;
  description: string;
  established?: string;
  headquarters?: string;
  logo?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dev.name,
    description: dev.description,
    ...(dev.logo ? { logo: dev.logo } : {}),
    ...(dev.url ? { url: dev.url } : {}),
    ...(dev.established ? { foundingDate: dev.established } : {}),
    ...(dev.headquarters
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: dev.headquarters,
            addressCountry: "IN",
          },
        }
      : {}),
  };
}
