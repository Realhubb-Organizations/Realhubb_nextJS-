export type CloudinaryFolder =
  | "properties"
  | "blogs"
  | "developers"
  | "team"
  | "gallery";

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dr0fl3ak5",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "realhubb",
};

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export function optimizeUrl(url: string, transforms = "w_800,q_75,f_auto"): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dr0fl3ak5";
  if (!url) return url;
  if (url.includes("res.cloudinary.com")) {
    const uploadIdx = url.indexOf("/upload/");
    if (uploadIdx !== -1) {
      const path = url.slice(uploadIdx + 8);
      return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${path}`;
    }
  }
  return url;
}

export const imagePresets = {
  propertyCard: (url: string) => optimizeUrl(url, "w_600,h_400,c_fill,q_75,f_auto"),
  propertyHero: (url: string) => optimizeUrl(url, "w_1200,h_675,c_fill,q_80,f_auto"),
  blogCover: (url: string) => optimizeUrl(url, "w_800,h_450,c_fill,q_75,f_auto"),
  developerLogo: (url: string) => optimizeUrl(url, "w_200,h_120,c_fit,q_80,f_auto"),
  teamPhoto: (url: string) => optimizeUrl(url, "w_400,h_400,c_thumb,g_face,q_80,f_auto"),
  thumbnail: (url: string) => optimizeUrl(url, "w_150,h_150,c_thumb,q_75,f_auto"),
  ogImage: (url: string) => optimizeUrl(url, "w_1200,h_630,c_fill,q_80,f_auto"),
};
