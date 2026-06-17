import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/data/company";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";
export const metadata: Metadata = buildMetadata({ title: "Privacy Policy | RealHubb", description: "RealHubb Ventures privacy policy — how we collect, use, and protect your personal information.", canonical: `${SITE_URL}/privacy` });

export default function PrivacyPage() {
  return (
    <div className="pt-20 page-padding py-16 max-w-3xl">
      <h1 className="font-heading text-3xl text-navy font-normal mb-8">Privacy Policy</h1>
      <div className="prose prose-sm text-gray-600 space-y-6">
        <p><strong className="text-navy font-normal">Last updated:</strong> June 2026</p>
        <p>{company.name} ("{company.shortName}", "we", "our") is committed to protecting your personal information. This policy explains how we collect, use, and protect data when you use our website at {company.website}.</p>
        <h2 className="font-heading text-xl text-navy font-normal mt-6">Information We Collect</h2>
        <p>We collect information you provide — name, phone, email — when you submit enquiry forms, contact us, or subscribe to notifications. We also collect browsing data via Google Analytics 4.</p>
        <h2 className="font-heading text-xl text-navy font-normal mt-6">How We Use Your Information</h2>
        <p>We use your information solely to respond to property enquiries, provide advisory services, and send relevant property updates you have opted into. We do not sell your data to third parties.</p>
        <h2 className="font-heading text-xl text-navy font-normal mt-6">Contact</h2>
        <p>For privacy-related questions, contact us at <a href={`mailto:${company.email}`} className="text-gold">{company.email}</a>.</p>
      </div>
    </div>
  );
}
