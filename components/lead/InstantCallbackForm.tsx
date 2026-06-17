"use client";

import { useState } from "react";
import { trackLead } from "@/lib/ga";

interface Props {
  city?: string;
}

export default function InstantCallbackForm({ city }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          city: city || "",
          type: "callback",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        trackLead(city ? `location/${city}` : "generic");
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting callback form:", err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <p className="text-green-700 font-heading text-base mb-1">We'll call you back!</p>
        <p className="text-green-600 text-xs">
          Our advisor will contact you within 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="section-overline text-gold mb-1">Free Consultation</p>
      <h3 className="font-heading text-navy text-base font-normal mb-1">
        Get a free callback in 15 minutes
      </h3>
      {city && (
        <p className="text-gray-400 text-xs mb-4">
          Property guidance for {city}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3 mt-4">
        <input
          type="text"
          placeholder="Your Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Sending…" : "Get Free Callback →"}
        </button>
      </form>
      <p className="text-gray-400 text-xs text-center mt-2">
        Zero spam · Zero brokerage
      </p>
    </div>
  );
}
