"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/types/property";
import { normalizeProperty } from "@/types/property";
import { imagePresets } from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

function applyPresets(p: Property): Property {
  return {
    ...p,
    images: p.images.map((img) => imagePresets.propertyCard(img)),
  };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromFirestore, setFromFirestore] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs
            .map((d) => applyPresets(normalizeProperty({ id: d.id, ...d.data() })));
          setProperties(data);
          setFromFirestore(true);
        }
      } catch {
        // silently fall back to static data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const ongoing = properties.filter((p) => p.projectType === "ongoing");
  const upcoming = properties.filter((p) => p.projectType === "upcoming");
  const featured = properties.filter((p) => p.featured);

  return { properties, ongoing, upcoming, featured, loading, fromFirestore };
}
