export interface AdminDeveloper {
  id: string;
  slug: string;
  name: string;
  description: string;
  about: string;
  logoUrl: string;
  websiteUrl: string;
  awards: string[];
  experience: string;
  featured: boolean;
}

export const EMPTY_DEVELOPER: Omit<AdminDeveloper, "id"> = {
  slug: "",
  name: "",
  description: "",
  about: "",
  logoUrl: "",
  websiteUrl: "",
  awards: [],
  experience: "",
  featured: false,
};
