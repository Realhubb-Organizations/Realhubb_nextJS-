import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  getPublishedFaqs,
  getAllProperties,
  getAllBlogPosts,
} from "@/lib/firestoreServerService";
import { faqSchema, breadcrumbSchema, webPageSchema } from "@/lib/structuredData";
import FaqPageClient from "@/components/faq/FaqPageClient";
import { generalFaq, propertyFaq, careerFaq } from "@/data/faqData";
import { galleryFaqs } from "@/app/gallery/page";
import { blogFaqs } from "@/app/blog/page";
import { developerFaqs } from "@/app/developers/page";
import { segmentFaqs } from "@/app/buy/[segment]/page";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Real Estate Buying Guide India | RealHubb",
  description:
    "Answers to common questions about buying property in Bangalore, RERA verification, home loans and RealHubb's zero-brokerage advisory service.",
  canonical: `${SITE_URL}/faq`,
  keywords: "real estate faq, property buying questions, RERA verification, home loan queries, real estate guide",
});

export default async function FaqPage() {
  const [dbFaqs, properties, blogs] = await Promise.all([
    getPublishedFaqs(),
    getAllProperties(),
    getAllBlogPosts(),
  ]);

  const blogMap = new Map(blogs.map((b) => [b.id, b]));

  const pagesToCategories: Record<string, { id: string; title: string; icon: string; defaultItems: { question: string; answer: string }[] }> = {
    about: { id: "about", title: "About RealHubb", icon: "🏢", defaultItems: generalFaq.slice(0, 4) },
    services: { id: "services", title: "Our Services", icon: "🤝", defaultItems: generalFaq.slice(4) },
    buying: { id: "buying", title: "Property Buying", icon: "🏠", defaultItems: propertyFaq },
    career: { id: "careers", title: "Careers", icon: "💼", defaultItems: careerFaq },
    home: { id: "general", title: "General", icon: "✨", defaultItems: [] },
  };

  const grouped: Record<string, typeof dbFaqs> = {};
  const propertyGroups: Record<string, typeof dbFaqs> = {};
  const blogGroups: Record<string, typeof dbFaqs> = {};

  dbFaqs.forEach((f) => {
    if (f.page === "property" && f.referenceId) {
      if (!propertyGroups[f.referenceId]) propertyGroups[f.referenceId] = [];
      propertyGroups[f.referenceId].push(f);
    } else if (f.page === "blog" && f.referenceId) {
      if (!blogGroups[f.referenceId]) blogGroups[f.referenceId] = [];
      blogGroups[f.referenceId].push(f);
    } else {
      const catKey = f.page;
      if (!grouped[catKey]) grouped[catKey] = [];
      grouped[catKey].push(f);
    }
  });

  // 1. Static Page Categories (General / About / Services etc)
  const staticCategories = Object.entries(pagesToCategories)
    .map(([key, cat]) => {
      const dbItems = grouped[key] || [];
      const items = dbItems.length > 0
        ? dbItems.map((i) => ({ question: i.question, answer: i.answer }))
        : cat.defaultItems;
      return {
        id: cat.id,
        title: cat.title,
        icon: cat.icon,
        items,
      };
    })
    .filter((cat) => cat.items.length > 0);

  // 2. Hardcoded Page FAQs
  const galleryCategory = {
    id: "gallery-page",
    title: "Gallery FAQs",
    icon: "📸",
    items: galleryFaqs,
  };

  const blogPageCategory = {
    id: "blog-page",
    title: "Blog & Newsletter FAQs",
    icon: "📰",
    items: blogFaqs,
  };

  const developersCategory = {
    id: "developers-page",
    title: "Partner Developers",
    icon: "🏗️",
    items: developerFaqs,
  };

  const buySegmentCategories = Object.entries(segmentFaqs).map(([segment, faqs]) => {
    const title = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      id: `segment-${segment}`,
      title,
      icon: "🏠",
      items: faqs,
    };
  });

  // 3. Property-specific Categories (incorporating both hardcoded property questions and custom FAQs)
  const propertyCategories = properties.map((prop) => {
    const cityLabel = prop.city ? prop.city.charAt(0).toUpperCase() + prop.city.slice(1) : "";
    
    // Sourced from property details page FAQ layout
    const defaultFaqs = [
      {
        question: `What is the price of ${prop.name}?`,
        answer: `${prop.name} by ${prop.developer} is priced ${prop.price} in ${prop.location}, ${cityLabel}.`,
      },
      {
        question: `What configurations are available in ${prop.name}?`,
        answer: `${prop.name} offers ${prop.bedrooms} configurations with area ranging ${prop.area}.`,
      },
      {
        question: `What is the possession date of ${prop.name}?`,
        answer: `The expected possession date for ${prop.name} is ${prop.possession}.`,
      },
      {
        question: `Is ${prop.name} RERA registered?`,
        answer: prop.rera
          ? `Yes, ${prop.name} is RERA registered with number ${prop.rera}.`
          : `${prop.name} is pending RERA registration. Contact RealHubb for the latest status.`,
      },
      {
        question: `What amenities does ${prop.name} offer?`,
        answer: prop.amenities && prop.amenities.length
          ? `${prop.name} offers: ${prop.amenities.join(", ")}.`
          : `Contact RealHubb for the complete amenity list for ${prop.name}.`,
      },
    ];

    const customFaqs = (propertyGroups[prop.id] || []).map((f) => ({ question: f.question, answer: f.answer }));
    return {
      id: `property-${prop.id}`,
      title: prop.name,
      icon: "🏢",
      items: [...defaultFaqs, ...customFaqs],
    };
  });

  // 4. Blog-specific Categories
  const blogCategories = Object.entries(blogGroups).map(([blogId, faqs]) => {
    const blog = blogMap.get(blogId);
    const title = blog ? `${blog.title}` : "Blog FAQs";
    return {
      id: `blog-${blogId}`,
      title,
      icon: "📝",
      items: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    };
  });

  // Combine everything
  const categories = [
    ...staticCategories,
    galleryCategory,
    blogPageCategory,
    developersCategory,
    ...buySegmentCategories,
    ...propertyCategories,
    ...blogCategories,
  ].filter((cat) => cat.items.length > 0);

  const allFaqs = categories.flatMap((category) => category.items);
  const breadcrumbs = [{ name: "Home", url: SITE_URL }, { name: "FAQ", url: `${SITE_URL}/faq` }];

  const webPage = {
    name: "FAQ — Real Estate Buying Guide India | RealHubb",
    description: "Answers to common questions about buying property in Bangalore, RERA verification, home loans and RealHubb's zero-brokerage advisory service.",
    url: `${SITE_URL}/faq`,
    speakableSelectors: [".speakable-title", ".speakable-summary"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(webPage)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(allFaqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <FaqPageClient categories={categories} breadcrumbs={breadcrumbs} />
    </>
  );
}
