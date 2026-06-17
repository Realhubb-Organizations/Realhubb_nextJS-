export type City = "bangalore" | "hyderabad" | "chennai";
export type PropertyStatus = "ongoing" | "upcoming";
export type PropertyType = "apartment" | "villa" | "plot" | "commercial";

export interface Property {
  id: string;
  slug: string;
  name: string;
  developer: string;
  city: City;
  location: string;
  status: PropertyStatus;
  type: PropertyType;
  price: string;
  priceValue: number;
  area: string;
  bedrooms: string;
  images: string[];
  rera: string;
  possession: string;
  description: string;
  featured: boolean;
  amenities: string[];
  mapEmbedUrl: string;
  projectType: PropertyStatus;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}

export const EMPTY_PROPERTY: Omit<Property, "id"> = {
  slug: "",
  name: "",
  developer: "",
  city: "bangalore",
  location: "",
  status: "ongoing",
  type: "apartment",
  price: "",
  priceValue: 0,
  area: "",
  bedrooms: "",
  images: [],
  rera: "",
  possession: "",
  description: "",
  featured: false,
  amenities: [],
  mapEmbedUrl: "",
  projectType: "ongoing",
};

export function normalizeProperty(raw: Record<string, unknown>): Property {
  const images: string[] = Array.isArray(raw.images)
    ? (raw.images as string[])
    : raw.photos
    ? (raw.photos as string[])
    : raw.thumbnailUrl
    ? [raw.thumbnailUrl as string]
    : [];

  const projectType =
    raw.projectType === "upcoming" || raw.status === "upcoming"
      ? "upcoming"
      : "ongoing";

  return {
    id: (raw.id as string) ?? "",
    slug: (raw.slug as string) ?? "",
    name: ((raw.name || raw.title) as string) ?? "",
    developer: (raw.developer as string) ?? "",
    city: (raw.city as City) ?? "bangalore",
    location: (raw.location as string) ?? "",
    status: projectType,
    type: ((raw.type || raw.propertyType || "apartment") as PropertyType),
    price: (raw.price as string) ?? "",
    priceValue: (raw.priceValue as number) ?? 0,
    area: ((raw.area || raw.sqft) as string) ?? "",
    bedrooms: ((raw.bedrooms || raw.bhk || raw.beds) as string) ?? "",
    images: images.filter(Boolean),
    rera: ((raw.rera || raw.reraNumber) as string) ?? "",
    possession: (raw.possession as string) ?? "",
    description: (raw.description as string) ?? "",
    featured: (raw.featured as boolean) ?? false,
    amenities: Array.isArray(raw.amenities) ? (raw.amenities as string[]) : [],
    mapEmbedUrl: (raw.mapEmbedUrl as string) ?? "",
    projectType,
    createdAt: toPlainTimestamp(raw.createdAt),
    updatedAt: toPlainTimestamp(raw.updatedAt),
  };
}

/** Convert a Firestore Timestamp instance OR plain object to { seconds, nanoseconds }. */
function toPlainTimestamp(
  v: unknown
): { seconds: number; nanoseconds: number } | undefined {
  if (!v || typeof v !== "object") return undefined;
  const ts = v as Record<string, unknown>;
  // Firestore Admin Timestamp uses .seconds / .nanoseconds
  // Firestore Client Timestamp uses ._seconds / ._nanoseconds internally
  const seconds =
    typeof ts.seconds === "number"
      ? ts.seconds
      : typeof ts._seconds === "number"
      ? (ts._seconds as number)
      : undefined;
  const nanoseconds =
    typeof ts.nanoseconds === "number"
      ? ts.nanoseconds
      : typeof ts._nanoseconds === "number"
      ? (ts._nanoseconds as number)
      : 0;
  return seconds !== undefined ? { seconds, nanoseconds } : undefined;
}
