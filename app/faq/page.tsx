import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { faqCategories as staticCategories } from "@/data/faqData";
import { getPublishedFaqs } from "@/lib/firestoreServerService";
import { faqSchema, breadcrumbSchema } from "@/lib/structuredData";
import FaqPageClient from "@/components/faq/FaqPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Real Estate Buying Guide India | RealHubb",
  description:
    "Answers to common questions about buying property in Bangalore, RERA verification, home loans and RealHubb's zero-brokerage advisory service.",
  canonical: `${SITE_URL}/faq`,
});

export default async function FaqPage() {
  const dbFaqs = await getPublishedFaqs();

  let categories = staticCategories;
  if (dbFaqs.length > 0) {
    const pagesToCategories: Record<string, { id: string; title: string; icon: string }> = {
      about: { id: "about", title: "About RealHubb", icon: "🏢" },
      services: { id: "services", title: "Our Services", icon: "🤝" },
      buying: { id: "buying", title: "Property Buying", icon: "🏠" },
      career: { id: "careers", title: "Careers", icon: "💼" },
      home: { id: "general", title: "General", icon: "✨" },
    };

    const grouped: Record<string, typeof dbFaqs> = {};
    dbFaqs.forEach((f) => {
      const catKey = f.page;
      if (!grouped[catKey]) grouped[catKey] = [];
      grouped[catKey].push(f);
    });

    categories = Object.entries(pagesToCategories)
      .map(([key, cat]) => {
        const items = grouped[key] || [];
        return {
          id: cat.id,
          title: cat.title,
          icon: cat.icon,
          items: items.map((i) => ({ question: i.question, answer: i.answer })),
        };
      })
      .filter((cat) => cat.items.length > 0);

    if (categories.length === 0) {
      categories = staticCategories;
    }
  }

  const allFaqs = categories.flatMap((category) => category.items);
  const breadcrumbs = [{ name: "Home", url: SITE_URL }, { name: "FAQ", url: `${SITE_URL}/faq` }];

  return (
    <>
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
