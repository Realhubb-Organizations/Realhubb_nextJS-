"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackLead } from "@/lib/ga";

export default function LeadPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if popup should run at all
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
    
    // Check for query parameter to reset or force test the popup
    let isTest = false;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("test_popup") === "true" || params.get("reset_popup") === "true") {
        isTest = true;
        try {
          localStorage.removeItem("realhubb_popup_submitted");
        } catch (e) {
          console.warn("Could not clear localStorage:", e);
        }
      }
    }

    // Check if user has already submitted the lead popup in the past
    let isSubmitted = "false";
    try {
      isSubmitted = localStorage.getItem("realhubb_popup_submitted") || "false";
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
    }
    
    if (isSubmitted === "true" || isAdminPage) {
      return;
    }

    // Delay is 1 second in test mode, 10 seconds otherwise
    const delay = isTest ? 1000 : 10000;

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAdminPage]);

  // Handle closing the popup
  const handleClose = () => {
    setIsOpen(false);

    // If already submitted, do not restart timers
    let isSubmitted = "false";
    try {
      isSubmitted = localStorage.getItem("realhubb_popup_submitted") || "false";
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
    }
    if (isSubmitted === "true" || isAdminPage) return;

    // Clear any active timer and start a new 30 seconds timer
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 30000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          type: "popup",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        try {
          localStorage.setItem("realhubb_popup_submitted", "true");
        } catch (e) {
          console.warn("Could not write to localStorage:", e);
        }
        trackLead("popup_modal");
        
        // Auto-close popup after 3 seconds of success message
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || isAdminPage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-navy/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-navy border border-gold/30 rounded-3xl p-8 shadow-2xl text-white overflow-hidden"
          >
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-white/60 hover:text-gold transition-colors p-1.5 rounded-full hover:bg-white/5"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-heading text-2xl text-gold font-normal">
                  Thank You, {form.name.split(" ")[0]}!
                </h3>
                <p className="text-white/70 text-sm max-w-xs mx-auto">
                  Your details have been registered. A property advisor will contact you within 15 minutes.
                </p>
              </motion.div>
            ) : (
              <div>
                <p className="section-overline text-gold mb-2 text-xs uppercase tracking-widest text-center">
                  Exclusive Offers
                </p>
                <h3 className="font-heading text-2xl font-normal text-white text-center mb-1">
                  Find Your Dream Home
                </h3>
                <p className="text-white/60 text-xs text-center mb-6 max-w-xs mx-auto">
                  Get a free site visit & consulting callback in 15 minutes. Zero brokerage.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="popup-name" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5">
                      Name *
                    </label>
                    <input
                      id="popup-name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="popup-phone" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5">
                        Phone *
                      </label>
                      <input
                        id="popup-phone"
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="popup-city" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5">
                        City of Interest
                      </label>
                      <select
                        id="popup-city"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-navy text-white/50">Select city</option>
                        <option value="Bangalore" className="bg-navy">Bangalore</option>
                        <option value="Hyderabad" className="bg-navy">Hyderabad</option>
                        <option value="Chennai" className="bg-navy">Chennai</option>
                        <option value="Other" className="bg-navy">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="popup-email" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5">
                      Email Address (For Acknowledgment)
                    </label>
                    <input
                      id="popup-email"
                      type="email"
                      placeholder="your.name@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="popup-message" className="block text-[10px] uppercase tracking-wider text-gold mb-1.5">
                      Message / Requirement (Optional)
                    </label>
                    <textarea
                      id="popup-message"
                      placeholder="Tell us what you're looking for..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold text-navy py-3.5 rounded-xl text-sm font-medium hover:bg-gold/90 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {loading ? (
                      "Sending details..."
                    ) : (
                      <>
                        Get Callback Now <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-white/40 text-center">
                    Zero Spam · Zero Brokerage · Secure Connection
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
