import { useState } from "react";
import { X, Plus, ImageIcon } from "lucide-react";
import { uploadToCloudinary, validateImageFile, formatBytes } from "@/lib/uploadToCloudinary";

export interface MultiImageUploadProps {
  folder: "properties" | "blogs" | "developers" | "team";
  images: string[];
  onImagesChange: (urls: string[]) => void;
  max?: number;
}

export default function MultiImageUpload({
  folder,
  images,
  onImagesChange,
  max = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, {
        folder,
        onProgress: setProgress,
      });
      onImagesChange([...images, result.url]);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const moveFirst = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
          Property Images ({images.length}/{max})
        </label>
        <p className="text-xs text-muted-foreground">First image = cover photo</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted"
            >
              <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />

              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-medium">
                  Cover
                </span>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => moveFirst(index)}
                    title="Set as cover"
                    className="bg-white/90 text-foreground text-[10px] font-medium px-2 py-1 rounded hover:bg-white transition"
                  >
                    Set cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-destructive text-white p-1 rounded-full hover:bg-destructive/80 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < max && (
        <div>
          {uploading ? (
            <div className="space-y-2 p-4 border border-input rounded-lg bg-muted/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Uploading to Cloudinary…
                </span>
                <span className="font-normal">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Add image {images.length > 0 ? `(${images.length}/${max})` : ""}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          )}

          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      )}

      <div>
        <label className="text-xs text-muted-foreground block mb-1">Or paste image URL directly</label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://res.cloudinary.com/…"
            className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && images.length < max) {
                  onImagesChange([...images, val]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <span className="text-xs text-muted-foreground self-center">↵ Enter</span>
        </div>
      </div>
    </div>
  );
}
