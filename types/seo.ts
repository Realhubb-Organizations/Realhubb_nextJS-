export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  icon: string;
  items: FaqItem[];
}

export interface LocationData {
  city: string;
  area: string;
  areaSlug: string;
  intro: string;
  avgPriceSqft: string;
  popularTypes: string[];
  connectivity: string[];
  nearbyAreas: string[];
  topBuilders: string[];
  faq: FaqItem[];
}
