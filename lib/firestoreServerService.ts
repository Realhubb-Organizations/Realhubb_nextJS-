import { getAdminDb } from "@/lib/firebase-admin";
import { normalizeProperty } from "@/types/property";
import type { Property } from "@/types/property";
import type { BlogPost } from "@/types/blog";
import type { Developer } from "@/types/developer";
import type { TeamMember } from "@/types/team";

/**
 * Recursively convert Firestore Timestamp instances (and any other class instances
 * with a `toMillis` method) to plain { seconds, nanoseconds } objects so that data
 * can safely cross the Next.js Server → Client Component boundary.
 */
function serialize<T>(data: Record<string, unknown>): T {
  const plain: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      plain[key] = value;
    } else if (
      typeof value === "object" &&
      typeof (value as { toMillis?: unknown }).toMillis === "function"
    ) {
      // Firestore Timestamp — convert to plain, serialisable shape
      const ts = value as { seconds: number; nanoseconds: number };
      plain[key] = { seconds: ts.seconds, nanoseconds: ts.nanoseconds };
    } else if (Array.isArray(value)) {
      plain[key] = value.map((item) =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as { toMillis?: unknown }).toMillis === "function"
          ? {
              seconds: (item as { seconds: number }).seconds,
              nanoseconds: (item as { nanoseconds: number }).nanoseconds,
            }
          : item
      );
    } else if (typeof value === "object") {
      plain[key] = serialize(value as Record<string, unknown>);
    } else {
      plain[key] = value;
    }
  }

  return plain as T;
}

/** Safely flatten a Firestore doc snapshot to a plain object ready for serialisation. */
function docToPlain(docId: string, data: Record<string, unknown>): Record<string, unknown> {
  return serialize<Record<string, unknown>>({ id: docId, ...data });
}

// ── Properties ───────────────────────────────────────────────────────────────

export async function getAllProperties(): Promise<Property[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("properties").get();
    const list = snap.docs.map((d) => normalizeProperty(docToPlain(d.id, d.data())));
    return list.sort((a, b) => {
      const timeA = a.createdAt?.seconds ?? 0;
      const timeB = b.createdAt?.seconds ?? 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    return [];
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("properties").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return normalizeProperty(docToPlain(doc.id, doc.data()));
  } catch (error) {
    console.error("Error in getPropertyBySlug:", error);
    return null;
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("properties")
      .where("featured", "==", true)
      .limit(8)
      .get();
    return snap.docs.map((d) => normalizeProperty(docToPlain(d.id, d.data())));
  } catch (error) {
    console.error("Error in getFeaturedProperties:", error);
    return [];
  }
}

export async function getPropertiesByCity(city: string): Promise<Property[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("properties").where("city", "==", city).get();
    return snap.docs.map((d) => normalizeProperty(docToPlain(d.id, d.data())));
  } catch (error) {
    console.error("Error in getPropertiesByCity:", error);
    return [];
  }
}

export async function getPropertiesByCityAndLocation(
  city: string,
  location: string
): Promise<Property[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("properties").where("city", "==", city).get();
    const all = snap.docs.map((d) => normalizeProperty(docToPlain(d.id, d.data())));
    const slug = location.toLowerCase();
    return all.filter(
      (p) =>
        p.location.toLowerCase().replace(/\s+/g, "-") === slug ||
        p.location.toLowerCase().includes(slug.replace(/-/g, " "))
    );
  } catch (error) {
    console.error("Error in getPropertiesByCityAndLocation:", error);
    return [];
  }
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

function normalizeBlogPost(raw: Record<string, unknown>): BlogPost {
  return {
    id: (raw.id as string) ?? "",
    slug: (raw.slug as string) ?? "",
    title: (raw.title as string) ?? "",
    excerpt: (raw.excerpt as string) ?? "",
    content: (raw.content as string) ?? "",
    coverImage: (raw.coverImage as string) ?? "",
    category: (raw.category as string) ?? "General",
    author: (raw.author as string) ?? "RealHubb Team",
    readTime: (raw.readTime as string) ?? "5 min read",
    publishedAt: (raw.publishedAt as string) ?? "",
    published: (raw.published as boolean) ?? false,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    metaTitle: raw.metaTitle as string | undefined,
    metaDescription: raw.metaDescription as string | undefined,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("blogPosts")
      .orderBy("publishedAt", "desc")
      .get();
    const all = snap.docs.map((d) => normalizeBlogPost(docToPlain(d.id, d.data())));
    return all.filter((post) => post.published);
  } catch (error) {
    console.error("Error fetching blog posts from Firestore:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("blogPosts")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const post = normalizeBlogPost(docToPlain(snap.docs[0].id, snap.docs[0].data()));
    return post.published ? post : null;
  } catch (error) {
    console.error(`Error fetching blog post by slug (${slug}) from Firestore:`, error);
    return null;
  }
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("blogPosts")
      .orderBy("publishedAt", "desc")
      .get();
    const all = snap.docs.map((d) => normalizeBlogPost(docToPlain(d.id, d.data())));
    return all.filter((post) => post.published).slice(0, limit);
  } catch (error) {
    console.error("Error fetching latest blog posts from Firestore:", error);
    return [];
  }
}

// ── Developers ────────────────────────────────────────────────────────────────

function normalizeDeveloper(raw: Record<string, unknown>): Developer {
  return {
    id: (raw.id as string) ?? "",
    name: (raw.name as string) ?? "",
    slug: (raw.slug as string) ?? "",
    logo: (raw.logo as string) ?? (raw.logoUrl as string) ?? "",
    description: (raw.description as string) ?? "",
    established: (raw.established as string) ?? "",
    headquarters: (raw.headquarters as string) ?? "",
    totalProjects: (raw.totalProjects as string) ?? "",
    website: (raw.website as string) ?? "",
  };
}


export async function getAllDevelopers(): Promise<Developer[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("developers").get();
    return snap.docs.map((d) => normalizeDeveloper(docToPlain(d.id, d.data())));
  } catch (error) {
    console.error("Error in getAllDevelopers:", error);
    return [];
  }
}

export async function getDeveloperBySlug(slug: string): Promise<Developer | null> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("developers")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return normalizeDeveloper(docToPlain(snap.docs[0].id, snap.docs[0].data()));
  } catch (error) {
    console.error("Error in getDeveloperBySlug:", error);
    return null;
  }
}

// ── Team ──────────────────────────────────────────────────────────────────────

function normalizeTeamMember(raw: Record<string, unknown>): TeamMember {
  return {
    id: (raw.id as string) ?? "",
    name: (raw.name as string) ?? "",
    nameSlug: (raw.nameSlug as string) ?? ((raw.name as string) ?? "").toLowerCase().replace(/\s+/g, "-"),
    role: (raw.role as string) ?? "",
    specialisation: (raw.specialisation as string) ?? "",
    city: (raw.city as string) ?? "Bangalore",
    experience: (raw.experience as string) ?? "",
    languages: Array.isArray(raw.languages) ? (raw.languages as string[]) : [],
    achievements: Array.isArray(raw.achievements) ? (raw.achievements as string[]) : [],
    photo: (raw.photo as string) ?? (raw.image as string) ?? "",
    bio: (raw.bio as string) ?? "",
    email: (raw.email as string) ?? "",
    phone: (raw.phone as string) ?? "",
    linkedin: (raw.linkedin as string) ?? "",
    order: (raw.order as number) ?? 99,
  };
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("team").get();
    const members = snap.docs.map((d) => normalizeTeamMember(docToPlain(d.id, d.data())));
    return members.sort((a, b) => {
      const orderA = a.order ?? 99;
      const orderB = b.order ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error in getAllTeamMembers:", error);
    return [];
  }
}


// ── Slugs for generateStaticParams ───────────────────────────────────────────

export async function getAllPropertySlugs(): Promise<string[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("properties").select("slug").get();
    return snap.docs.map((d) => d.data().slug as string).filter(Boolean);
  } catch (error) {
    console.error("Error in getAllPropertySlugs:", error);
    return [];
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("blogPosts")
      .where("published", "==", true)
      .select("slug")
      .get();
    return snap.docs.map((d) => d.data().slug as string).filter(Boolean);
  } catch (error) {
    console.error("Error in getAllBlogSlugs:", error);
    return [];
  }
}

export async function getAllDeveloperSlugs(): Promise<string[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("developers").select("slug").get();
    return snap.docs.map((d) => d.data().slug as string).filter(Boolean);
  } catch (error) {
    console.error("Error in getAllDeveloperSlugs:", error);
    return [];
  }
}

// ── FAQs ─────────────────────────────────────────────────────────────────────

import type { AdminFaq } from "@/admin/types/faq";

export async function getPublishedFaqs(): Promise<AdminFaq[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("faqs").get();
    const all = snap.docs.map((d) => docToPlain(d.id, d.data()) as unknown as AdminFaq);
    return all
      .filter((f) => f.published === true)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (e) {
    console.error("Error fetching FAQs:", e);
    return [];
  }
}

export async function getPublishedFaqsByPage(
  page: "home" | "about" | "services" | "buying" | "career"
): Promise<AdminFaq[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("faqs").get();
    const all = snap.docs.map((d) => docToPlain(d.id, d.data()) as unknown as AdminFaq);
    return all
      .filter((f) => f.published === true && f.page === page)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (e) {
    console.error(`Error fetching FAQs for page ${page}:`, e);
    return [];
  }
}

export async function getPublishedFaqsByReference(
  page: "property" | "blog",
  referenceId: string
): Promise<AdminFaq[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("faqs").get();
    const all = snap.docs.map((d) => docToPlain(d.id, d.data()) as unknown as AdminFaq);
    return all
      .filter((f) => f.published === true && f.page === page && f.referenceId === referenceId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (e) {
    console.error(`Error fetching FAQs for page ${page} reference ${referenceId}:`, e);
    return [];
  }
}
