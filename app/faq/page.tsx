import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublishedFaqs } from "@/lib/firestoreServerService";
import { faqSchema, breadcrumbSchema, webPageSchema } from "@/lib/structuredData";
import FaqPageClient from "@/components/faq/FaqPageClient";
import { generalFaq, propertyFaq, careerFaq } from "@/data/faqData";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Real Estate Buying Guide India | RealHubb",
  description:
    "Answers to common questions about buying property in Bangalore, RERA verification, home loans and RealHubb's zero-brokerage advisory service.",
  canonical: `${SITE_URL}/faq`,
  keywords: "real estate faq, property buying questions, RERA verification, home loan queries, real estate guide",
});

export default async function FaqPage() {
  const dbFaqs = await getPublishedFaqs();

  const pagesToCategories: Record<string, { id: string; title: string; icon: string; defaultItems: { question: string; answer: string }[] }> = {
    about: { id: "about", title: "About RealHubb", icon: "🏢", defaultItems: generalFaq.slice(0, 4) },
    services: { id: "services", title: "Our Services", icon: "🤝", defaultItems: generalFaq.slice(4) },
    buying: { id: "buying", title: "Property Buying", icon: "🏠", defaultItems: propertyFaq },
    career: { id: "careers", title: "Careers", icon: "💼", defaultItems: careerFaq },
    home: { id: "general", title: "General", icon: "✨", defaultItems: [] },
  };

  const grouped: Record<string, typeof dbFaqs> = {};
  dbFaqs.forEach((f) => {
    const catKey = f.page;
    if (!grouped[catKey]) grouped[catKey] = [];
    grouped[catKey].push(f);
  });

  const categories = Object.entries(pagesToCategories)
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
