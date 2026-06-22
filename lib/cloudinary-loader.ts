import type { ImageLoaderProps } from "next/image";

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  // Local assets in /public — serve directly, but include width in query to satisfy Next.js loader check
  if (src.startsWith("/")) {
    return `${src}?w=${width}`;
  }

  // External URLs (like postimg, unsplash, istock, ftcdn)
  if (src.startsWith("http") && !src.includes("res.cloudinary.com")) {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cloud) {
      return `https://res.cloudinary.com/${cloud}/image/fetch/w_${width},q_${quality ?? 75},f_auto/${encodeURIComponent(src)}`;
    }
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}`;
  }

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return src;
  // If already a full Cloudinary URL, extract the path after /upload/
  if (src.includes("res.cloudinary.com")) {
    const uploadIdx = src.indexOf("/upload/");
    if (uploadIdx !== -1) {
      const path = src.slice(uploadIdx + 8);
      return `https://res.cloudinary.com/${cloud}/image/upload/w_${width},q_${quality ?? 75},f_auto/${path}`;
    }
  }
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${width},q_${quality ?? 75},f_auto/${src}`;
}
