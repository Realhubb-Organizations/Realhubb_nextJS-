"use client";

import { useState } from "react";
import { trackLead } from "@/lib/ga";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          type: "contact",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        trackLead("contact-us");
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="font-heading text-green-700 text-xl mb-2">Message Received!</p>
        <p className="text-green-600 text-sm">
          We'll contact you within 15 minutes during business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Name *</label>
          <input type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Phone *</label>
          <input type="tel" required value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Email</label>
        <input type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">City of Interest</label>
        <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold">
          <option value="">Select city</option>
          <option>Bangalore</option>
          <option>Hyderabad</option>
          <option>Chennai</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Message</label>
        <textarea rows={4} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us what you're looking for…"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gold resize-none" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-navy text-white py-3 rounded-xl text-sm hover:bg-navy/90 transition-colors disabled:opacity-60">
        {loading ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}
