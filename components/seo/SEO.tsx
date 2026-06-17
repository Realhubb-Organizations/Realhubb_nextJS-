"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
}

export default function SEO({ title, description }: Props) {
  useEffect(() => {
    document.title = title;
    
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [title, description]);

  return null;
}
