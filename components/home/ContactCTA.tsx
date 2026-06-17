"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { company } from "@/data/company";
import { trackLead, trackWhatsApp } from "@/lib/ga";

export default function ContactCTA() {
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
          type: "homepage_cta",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        trackLead("homepage_cta");
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting homepage CTA:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-navy">
      <div className="page-padding text-center">
        <p className="section-overline text-gold mb-4">Get Started Today</p>
        <h2 className="font-heading text-3xl md:text-4xl text-white font-normal mb-4">
          Ready to Find Your Perfect Home?
        </h2>
        <p className="text-white/60 text-base mb-10 max-w-lg mx-auto">
          Talk to our experts in 15 minutes. Free consultation. Zero brokerage.
          Our advisors {company.advisors.join(" and ")} are ready to help.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              suppressHydrationWarning={true}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              suppressHydrationWarning={true}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning={true}
              className="bg-gold text-navy px-6 py-3 rounded-xl text-sm font-normal hover:bg-gold/90 transition-colors disabled:opacity-60 shrink-0"
            >
              {loading ? "Sending…" : "Get Callback"}
            </button>
          </form>
        ) : (
          <div className="bg-white/10 border border-gold/30 rounded-xl px-6 py-4 max-w-md mx-auto mb-8 text-gold">
            ✓ We'll call you back within 15 minutes!
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:${company.phone}`}
            onClick={trackCall}
            className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            {company.phone}
          </a>
          <a
            href={`https://wa.me/${company.whatsapp}?text=Hi, I found your website and I'm interested in properties in Bangalore`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsApp}
            className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#20bd5a] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

function trackCall() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "phone_call_click", { event_category: "engagement" });
  }
}
