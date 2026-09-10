import { getAdminDb } from "@/lib/firebase-admin";
import { normalizeProperty } from "@/types/property";
import type { Property } from "@/types/property";
import type { BlogPost } from "@/types/blog";
import type { Developer } from "@/types/developer";
import type { TeamMember } from "@/types/team";
import { cached } from "@/lib/serverCache";

const MIN = 60 * 1000;

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
// getAllProperties is the single source of truth — every other "view" of
// properties (featured, by city, slugs) derives from this same cached read
// instead of issuing its own separate Firestore query. A separate query per
// view was costing a full extra read set for each one; deriving in memory
// costs zero extra reads once the base list is warm.

export async function getAllProperties(): Promise<Property[]> {
  return cached(
    "properties:all",
    async () => {
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
        return [] as Property[];
      }
    },
    5 * MIN
  );
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return cached(
    `properties:slug:${slug}`,
    async () => {
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
    },
    5 * MIN
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const all = await getAllProperties();
  return all.filter((p) => p.featured).slice(0, 8);
}

export async function getPropertiesByCity(city: string): Promise<Property[]> {
  const all = await getAllProperties();
  return all.filter((p) => p.city === city);
}

export async function getPropertiesByCityAndLocation(
  city: string,
  location: string
): Promise<Property[]> {
  const all = await getPropertiesByCity(city);
  const slug = location.toLowerCase();
  return all.filter(
    (p) =>
      p.location.toLowerCase().replace(/\s+/g, "-") === slug ||
      p.location.toLowerCase().includes(slug.replace(/-/g, " "))
  );
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
  return cached(
    "blogs:all",
    async () => {
      try {
        const db = getAdminDb();
        const snap = await db.collection("blogPosts").orderBy("publishedAt", "desc").get();
        const all = snap.docs.map((d) => normalizeBlogPost(docToPlain(d.id, d.data())));
        return all.filter((post) => post.published);
      } catch (error) {
        console.error("Error fetching blog posts from Firestore:", error);
        return [] as BlogPost[];
      }
    },
    5 * MIN
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return cached(
    `blogs:slug:${slug}`,
    async () => {
      try {
        const db = getAdminDb();
        const snap = await db.collection("blogPosts").where("slug", "==", slug).limit(1).get();
        if (snap.empty) return null;
        const post = normalizeBlogPost(docToPlain(snap.docs[0].id, snap.docs[0].data()));
        return post.published ? post : null;
      } catch (error) {
        console.error(`Error fetching blog post by slug (${slug}) from Firestore:`, error);
        return null;
      }
    },
    5 * MIN
  );
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const all = await getAllBlogPosts();
  return all.slice(0, limit);
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
  return cached(
    "developers:all",
    async () => {
      try {
        const db = getAdminDb();
        const snap = await db.collection("developers").get();
        return snap.docs.map((d) => normalizeDeveloper(docToPlain(d.id, d.data())));
      } catch (error) {
        console.error("Error in getAllDevelopers:", error);
        return [] as Developer[];
      }
    },
    10 * MIN
  );
}

export async function getDeveloperBySlug(slug: string): Promise<Developer | null> {
  const all = await getAllDevelopers();
  return all.find((d) => d.slug === slug) ?? null;
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
  return cached(
    "team:all",
    async () => {
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
        return [] as TeamMember[];
      }
    },
    10 * MIN
  );
}

// ── Slugs for generateStaticParams ───────────────────────────────────────────
// Derived from the already-cached full lists above rather than separate
// `.select("slug")` queries — Firestore bills a read per matched document
// regardless of field projection, so a "slug-only" query costs the same as
// fetching the full docs. Deriving from the cached list costs nothing extra.

export async function getAllPropertySlugs(): Promise<string[]> {
  const all = await getAllProperties();
  return all.map((p) => p.slug).filter(Boolean);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const all = await getAllBlogPosts();
  return all.map((p) => p.slug).filter(Boolean);
}

export async function getAllDeveloperSlugs(): Promise<string[]> {
  const all = await getAllDevelopers();
  return all.map((d) => d.slug).filter(Boolean);
}

// ── FAQs ─────────────────────────────────────────────────────────────────────

import type { AdminFaq } from "@/admin/types/faq";

export async function getPublishedFaqs(): Promise<AdminFaq[]> {
  return cached(
    "faqs:all",
    async () => {
      try {
        const db = getAdminDb();
        const snap = await db.collection("faqs").get();
        const all = snap.docs.map((d) => docToPlain(d.id, d.data()) as unknown as AdminFaq);
        return all
          .filter((f) => f.published === true)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      } catch (e) {
        console.error("Error fetching FAQs:", e);
        return [] as AdminFaq[];
      }
    },
    10 * MIN
  );
}

export async function getPublishedFaqsByPage(
  page: "home" | "about" | "services" | "buying" | "career"
): Promise<AdminFaq[]> {
  const all = await getPublishedFaqs();
  return all.filter((f) => f.page === page);
}

export async function getPublishedFaqsByReference(
  page: "property" | "blog",
  referenceId: string
): Promise<AdminFaq[]> {
  const all = await getPublishedFaqs();
  return all.filter((f) => f.page === page && f.referenceId === referenceId);
}
