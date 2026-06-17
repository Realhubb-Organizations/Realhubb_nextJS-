import {
  CLOUDINARY_CONFIG,
  CLOUDINARY_UPLOAD_URL,
  CloudinaryUploadResponse,
  CloudinaryFolder,
} from "./cloudinary";

export interface UploadOptions {
  folder: CloudinaryFolder;
  fileName?: string;
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export function validateImageFile(file: File): string | null {
  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File size must be under ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const { folder, fileName, onProgress } = options;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", `realhubb/${folder}`);

  if (fileName) {
    formData.append("public_id", fileName);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          sizeBytes: data.bytes,
        });
      } else {
        const error = JSON.parse(xhr.responseText);
        reject(new Error(error.error?.message ?? "Upload failed"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error — upload failed. Check your connection."));
    });

    xhr.open("POST", CLOUDINARY_UPLOAD_URL);
    xhr.send(formData);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
