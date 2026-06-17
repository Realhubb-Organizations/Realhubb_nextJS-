export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  page: "home" | "about" | "services" | "buying" | "career" | "property" | "blog";
  referenceId?: string;
  order: number;
  published: boolean;
}

export const EMPTY_FAQ: Omit<AdminFaq, "id"> = {
  question: "",
  answer: "",
  page: "home",
  referenceId: "",
  order: 0,
  published: false,
};
