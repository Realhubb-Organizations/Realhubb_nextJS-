import Clarity from "@microsoft/clarity";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-RXW691N6BH";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// Every tracking call in this file pushes to dataLayer instead of calling
// gtag directly. GTM (see app/layout.tsx) is the single place that decides
// what happens with each event — GA4, Google Ads conversions, Meta Pixel,
// etc. — so new destinations get added in the GTM UI, not in this codebase.
function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

// Fired on initial load AND on every client-side route change (see
// ClientLayoutWrapper) — Next.js App Router navigations don't trigger a new
// page load, so without this GTM's default "All Pages" trigger only ever
// sees the very first URL of the session.
export function trackPageView(path: string) {
  pushToDataLayer({ event: "page_view", page_path: path });
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  pushToDataLayer({
    event: action,
    event_category: category,
    event_label: label,
    value,
  });
}

// Fires both GA and Clarity for one-off engagement actions (chat widget, search, CTA clicks, etc.)
export function trackAction(action: string, category: string, label?: string) {
  trackEvent(action, category, label);
  clarityEvent(action, label ? { [`${action}_label`]: label } : undefined);
}

/**
 * Fires a Clarity custom event + tag, guarded so it's a no-op when the
 * Clarity project ID isn't configured (e.g. local dev without the env var).
 */
function clarityEvent(name: string, tags?: Record<string, string>) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) return;
  Clarity.event(name);
  if (tags) {
    Object.entries(tags).forEach(([key, value]) => Clarity.setTag(key, value));
  }
}

// Fired on every successful lead form submission (contact, popup, enquiry, etc.)
export function trackLead(sourcePage: string, phone?: string) {
  trackEvent("generate_lead", "lead", sourcePage);
  clarityEvent("generate_lead", { lead_source: sourcePage });
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) return;
  if (phone) Clarity.identify(phone);
  Clarity.upgrade("lead_submitted");
}

// Fired on every WhatsApp click-to-chat link
export function trackWhatsApp(context?: string) {
  trackEvent("whatsapp_click", "engagement", context);
  clarityEvent("whatsapp_click", context ? { whatsapp_context: context } : undefined);
}

// Fired on every tel: phone call link
export function trackCall(context?: string) {
  trackEvent("phone_call_click", "engagement", context);
  clarityEvent("phone_call_click", context ? { call_context: context } : undefined);
}

// Fired on every mailto: email link
export function trackEmail(context?: string) {
  trackEvent("email_click", "engagement", context);
  clarityEvent("email_click", context ? { email_context: context } : undefined);
}
