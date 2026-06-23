"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
}

export default function SEO({ title, description, keywords, canonical, image }: Props) {
  useEffect(() => {
    const clampedTitle = title.length <= 60 ? title : title.slice(0, 59) + "…";
    document.title = clampedTitle;
    
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    const clampedDesc = description.length <= 155 ? description : description.slice(0, 154) + "…";
    metaDesc.setAttribute("content", clampedDesc);

    // Update or create meta keywords
    if (keywords) {
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement("meta");
        metaKey.setAttribute("name", "keywords");
        document.head.appendChild(metaKey);
      }
      let clampedKeywords = keywords;
      if (keywords.length > 99) {
        const cut = keywords.slice(0, 99);
        const lastComma = cut.lastIndexOf(",");
        clampedKeywords = lastComma > 30 ? cut.slice(0, lastComma).trim() : cut.trim();
      }
      metaKey.setAttribute("content", clampedKeywords);
    }

    // Update or create canonical link
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", canonical);
    }

    // Update or create og:image meta
    if (image) {
      let metaImage = document.querySelector('meta[property="og:image"]');
      if (!metaImage) {
        metaImage = document.createElement("meta");
        metaImage.setAttribute("property", "og:image");
        document.head.appendChild(metaImage);
      }
      metaImage.setAttribute("content", image);
    }
  }, [title, description, keywords, canonical, image]);

  return null;
}
