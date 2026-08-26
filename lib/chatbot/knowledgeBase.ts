import { getAllProperties, getAllBlogPosts, getPublishedFaqs } from "@/lib/firestoreServerService";
import { generalFaq, propertyFaq, careerFaq } from "@/data/faqData";
import { locations } from "@/data/locations";
import type { FaqItem } from "@/types/seo";

export type KnowledgeDocType = "faq" | "property" | "blog" | "location";

export interface KnowledgeDoc {
  id: string;
  type: KnowledgeDocType;
  title: string;
  /** Normalized, searchable text — question+answer, property summary, etc. */
  text: string;
  /** Verbatim answer to show the user directly when this doc is a confident FAQ match. Undefined for non-FAQ types. */
  answer?: string;
  url?: string;
}

export const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "in", "on", "at", "of", "for",
  "to", "and", "or", "but", "with", "about", "what", "which", "who", "whom", "this", "that", "it",
  "i", "you", "your", "my", "me", "can", "will", "would", "should", "how", "please", "tell",
  "where", "when", "why", "whose", "have", "has", "had", "could", "shall", "be", "been", "being",
  "get", "gets", "got", "give", "gives", "gave", "make", "makes", "made", "go", "goes", "went",
  "take", "takes", "took", "tell", "tells", "told", "ask", "asks", "asked", "find", "finds", "found",
  "look", "looks", "looked", "show", "shows", "showed", "see", "sees", "saw", "know", "knows", "knew",
  "want", "wants", "wanted", "like", "likes", "liked", "love", "loves", "loved", "need", "needs", "needed",
  "use", "uses", "used", "work", "works", "worked", "come", "comes", "came", "call", "calls", "called",
  "guys", "us", "we", "our", "them", "they", "he", "she", "their", "his", "her", "its", "there", "here",
  "about", "any", "some", "every", "all", "no", "yes", "ok", "okay", "thanks", "thank", "hello", "hi", "hey",
  "sorry", "excuse", "pardon", "okey", "yeah", "yep", "nah", "just", "actually", "basically", "pls"
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₹%\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function faqToDoc(id: string, item: FaqItem, url?: string): KnowledgeDoc {
  return {
    id,
    type: "faq",
    title: item.question,
    text: `${item.question} ${item.answer}`,
    answer: item.answer,
    url,
  };
}

let cache: { docs: KnowledgeDoc[]; builtAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // rebuild at most every 10 minutes

/** Builds (or returns the cached) in-memory knowledge corpus. Server-only — never bundled to the client. */
export async function getKnowledgeBase(): Promise<KnowledgeDoc[]> {
  if (cache && Date.now() - cache.builtAt < CACHE_TTL_MS) {
    return cache.docs;
  }

  const docs: KnowledgeDoc[] = [];

  // Static + admin-managed FAQs
  generalFaq.forEach((f, i) => docs.push(faqToDoc(`faq-general-${i}`, f, "/faq")));
  propertyFaq.forEach((f, i) => docs.push(faqToDoc(`faq-property-${i}`, f, "/faq")));
  careerFaq.forEach((f, i) => docs.push(faqToDoc(`faq-career-${i}`, f, "/career")));

  try {
    const adminFaqs = await getPublishedFaqs();
    adminFaqs.forEach((f) => {
      docs.push(faqToDoc(`faq-admin-${f.id}`, { question: f.question, answer: f.answer }));
    });
  } catch (e) {
    console.error("[chatbot] Failed to load admin FAQs:", e);
  }

  // Locality guides + their own per-area FAQs
  locations.forEach((loc) => {
    const url = `/real-estate/${loc.city}/${loc.areaSlug}`;
    docs.push({
      id: `location-${loc.city}-${loc.areaSlug}`,
      type: "location",
      title: `${loc.area}, ${loc.city}`,
      text: `${loc.area} ${loc.city} ${loc.intro} Average price ${loc.avgPriceSqft}. Popular types: ${loc.popularTypes.join(", ")}. Nearby: ${loc.nearbyAreas.join(", ")}. Top builders: ${loc.topBuilders.join(", ")}.`,
      url,
    });
    loc.faq.forEach((f, i) => docs.push(faqToDoc(`faq-location-${loc.city}-${loc.areaSlug}-${i}`, f, url)));
  });

  // Live property listings
  try {
    const properties = await getAllProperties();
    properties.forEach((p) => {
      docs.push({
        id: `property-${p.id}`,
        type: "property",
        title: p.name,
        text: `${p.name} by ${p.developer} in ${p.location}, ${p.city}. ${p.bedrooms} ${p.type}, ${p.area}. Price ${p.price}. Possession ${p.possession}. RERA ${p.rera}. ${p.projectType} project. Amenities: ${p.amenities.join(", ")}. ${p.description}`,
        url: `/property/${p.slug}`,
      });
    });
  } catch (e) {
    console.error("[chatbot] Failed to load properties:", e);
  }

  // Blog posts (title + excerpt only — full content would bloat the prompt)
  try {
    const posts = await getAllBlogPosts();
    posts.forEach((post) => {
      if (!post.published) return;
      docs.push({
        id: `blog-${post.id}`,
        type: "blog",
        title: post.title,
        text: `${post.title} ${post.excerpt} ${post.category}`,
        url: `/blog/${post.slug}`,
      });
    });
  } catch (e) {
    console.error("[chatbot] Failed to load blog posts:", e);
  }

  cache = { docs, builtAt: Date.now() };
  return docs;
}

export interface ScoredDoc {
  doc: KnowledgeDoc;
  score: number; // 0..1, roughly "fraction of query tokens found, weighted toward title matches"
}

/**
 * TF-IDF term weighted scorer — title/question matches are weighted
 * higher than body matches, and rare tokens are weighted higher than
 * common tokens (like "project").
 */
export function searchKnowledgeBase(query: string, docs: KnowledgeDoc[], limit = 5): ScoredDoc[] {
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (queryTokens.length === 0) return [];

  // Compute document frequency (DF) for each token to build IDF map on the fly
  const docCount = docs.length;
  const tokenDocCounts = new Map<string, number>();
  docs.forEach((doc) => {
    const tokens = new Set([...tokenize(doc.title), ...tokenize(doc.text)]);
    tokens.forEach((t) => {
      tokenDocCounts.set(t, (tokenDocCounts.get(t) ?? 0) + 1);
    });
  });

  const getIDF = (t: string) => {
    const freq = tokenDocCounts.get(t) ?? 0;
    if (freq === 0) return 1.0;
    return Math.log(docCount / freq) + 1.0;
  };

  const scored: ScoredDoc[] = docs.map((doc) => {
    const titleTokens = new Set(tokenize(doc.title));
    const bodyTokens = new Set(tokenize(doc.text));

    let hits = 0;
    let maxPossibleHits = 0;

    for (const t of queryTokens) {
      const idf = getIDF(t);
      maxPossibleHits += 1.5 * idf;

      if (titleTokens.has(t)) {
        hits += 1.5 * idf;
      } else if (bodyTokens.has(t)) {
        hits += 1.0 * idf;
      }
    }

    const score = maxPossibleHits > 0 ? hits / maxPossibleHits : 0;
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
