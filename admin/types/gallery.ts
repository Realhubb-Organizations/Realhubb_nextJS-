export interface AdminGalleryPost {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  published: boolean;
  publishedAt: string;
}

export const EMPTY_GALLERY_POST: Omit<AdminGalleryPost, "id"> = {
  title: "",
  description: "",
  image: "",
  category: "Events",
  published: false,
  publishedAt: new Date().toISOString().split("T")[0],
};
