"use client";

import { useState } from "react";
import { trackLead } from "@/lib/ga";
import { submitLead } from "@/lib/leads";

interface Props {
  propertyName: string;
  propertySlug: string;
}

export default function EnquiryPopup({ propertyName, propertySlug }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitLead({
        ...form,
        type: "enquiry",
        propertyName,
      });

      if (res.success) {
        setSubmitted(true);
        trackLead(`property/${propertySlug}`);
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting enquiry:", err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-green-700 font-heading text-lg mb-1">Thank You!</p>
        <p className="text-green-600 text-sm">
          Our advisor will contact you within 15 minutes for a free consultation about {propertyName}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="section-overline text-gold mb-1">Book Free Site Visit</p>
      <h3 className="font-heading text-navy text-lg font-normal mb-4">{propertyName}</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
        />
        <textarea
          placeholder="Message (optional)"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Sending…" : "Request Site Visit →"}
        </button>
      </form>

      <p className="text-gray-400 text-xs text-center mt-3">
        Free consultation. No spam. Zero brokerage.
      </p>
    </div>
  );
}
