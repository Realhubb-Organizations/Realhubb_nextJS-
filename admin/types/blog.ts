export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  published: boolean;
}

export const EMPTY_BLOG_POST: Omit<AdminBlogPost, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  authorName: "",
  authorImage: "",
  category: "Real Estate",
  tags: [],
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  published: false,
};
