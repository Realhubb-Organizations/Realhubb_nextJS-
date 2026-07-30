import type { ImageLoaderProps } from "next/image";

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  // Local assets in /public — serve directly, but include width in query to satisfy Next.js loader check
  if (src.startsWith("/")) {
    return `${src}?w=${width}`;
  }

  // Unsplash supports its own resize/quality query params — use them so
  // next/image's responsive srcset actually requests a smaller file per
  // breakpoint instead of the same multi-hundred-KB image every time.
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 60));
    return url.toString();
  }

  // Other external URLs (istockphoto, ftcdn, postimg, etc.)
  // Serve directly to prevent Cloudinary Fetch blocks (400 Bad Request) on restricted accounts
  if (src.startsWith("http") && !src.includes("res.cloudinary.com")) {
    return src;
  }

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dr0fl3ak5";
  // If already a full Cloudinary URL, extract the path after /upload/
  if (src.includes("res.cloudinary.com")) {
    const uploadIdx = src.indexOf("/upload/");
    if (uploadIdx !== -1) {
      let path = src.slice(uploadIdx + 8);
      // Remove any existing transformation blocks (e.g. w_600,h_400...) to prevent double-transformation errors
      path = path.replace(/^(?:[a-zA-Z0-9_]+_[a-zA-Z0-9\.]+,?)+\//, "");
      return `https://res.cloudinary.com/${cloud}/image/upload/w_${width},q_${quality ?? 75},f_auto/${path}`;
    }
  }
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${width},q_${quality ?? 75},f_auto/${src}`;
}
