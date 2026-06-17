export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-RXW691N6BH";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function trackPageView(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackLead(sourcePage: string) {
  trackEvent("generate_lead", "lead", sourcePage);
}

export function trackWhatsApp() {
  trackEvent("whatsapp_click", "engagement");
}

export function trackCall() {
  trackEvent("phone_call_click", "engagement");
}
