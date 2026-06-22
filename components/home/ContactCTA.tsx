"use client";

import { useState } from "react";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";
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
    <section className="py-20 bg-cream">
      <div className="page-padding">
        <div className="max-w-5xl mx-auto bg-[#00274D] border border-gold/30 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
          {/* Subtle gradient light effects inside the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-stretch relative z-10">
            {/* Left Column: Info */}
            <div className="flex flex-col justify-between text-left md:pr-12 py-2">
              <div className="space-y-4">
                <p className="section-overline text-gold text-xs uppercase tracking-widest">
                  Get Started Today
                </p>
                <h2 className="font-heading text-3xl md:text-[40px] text-white font-normal leading-tight">
                  Ready to Find Your <span className="text-gold">Perfect Home?</span>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-md">
                  Talk to our experts in 15 minutes. Enjoy a free consultation with zero brokerage.
                  Our advisors <span className="text-gold font-medium">{company.advisors.join(" and ")}</span> are here to guide you to the right property.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-6 mt-8 border-t border-white/10">
                <a
                  href={`tel:${company.phone}`}
                  onClick={trackCall}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition-colors text-sm font-medium border border-white/10 px-4 py-2.5 rounded-xl bg-white/5"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  {company.phone}
                </a>
                <a
                  href={`https://wa.me/${company.whatsapp}?text=Hi, I found your website and I'm interested in properties in Bangalore`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsApp}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-all hover:scale-105 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex flex-col justify-center md:border-l md:border-white/10 md:pl-12 py-2">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <h3 className="font-heading text-xl text-white font-normal mb-2">
                    Request a Callback
                  </h3>
                  <div>
                    <label htmlFor="cta-name" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5 font-medium">
                      Name
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      suppressHydrationWarning={true}
                      className="w-full bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-phone" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5 font-medium">
                      Phone Number
                    </label>
                    <input
                      id="cta-phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      suppressHydrationWarning={true}
                      className="w-full bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning={true}
                    className="w-full bg-gold text-navy py-3.5 rounded-xl text-sm font-normal hover:bg-gold/90 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 shrink-0 cursor-pointer shadow-md"
                  >
                    {loading ? "Sending…" : "Get Callback"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="font-heading text-2xl text-gold font-normal mb-2">
                    Request Received!
                  </h3>
                  <p className="text-white/70 text-sm max-w-[260px] mx-auto leading-relaxed">
                    Thank you. We will call you back within 15 minutes.
                  </p>
                </div>
              )}
            </div>
          </div>
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
