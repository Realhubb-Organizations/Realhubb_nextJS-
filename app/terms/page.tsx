import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/data/company";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";
export const metadata: Metadata = buildMetadata({ title: "Terms of Service | RealHubb", description: "Terms of service for RealHubb Ventures — your rights, obligations, and our service terms.", canonical: `${SITE_URL}/terms` });

export default function TermsPage() {
  return (
    <div className="pt-20 page-padding py-16 max-w-3xl">
      <h1 className="font-heading text-3xl text-navy font-normal mb-8">Terms of Service</h1>
      <div className="prose prose-sm text-gray-600 space-y-6">
        <p><strong className="text-navy font-normal">Last updated:</strong> June 2026</p>
        <p>By using {company.website}, you agree to these terms. {company.name} provides property advisory services as a channel partner and does not itself sell properties.</p>
        <h2 className="font-heading text-xl text-navy font-normal mt-6">Services</h2>
        <p>RealHubb provides free property search, site visit coordination, and advisory services to buyers. We earn a commission from developers — buyers pay zero brokerage.</p>
        <h2 className="font-heading text-xl text-navy font-normal mt-6">Disclaimers</h2>
        <p>Property information is sourced from developers and may change without notice. Always verify RERA registration independently. RealHubb is not responsible for developer delays, price changes, or construction defects.</p>
        <h2 className="font-heading text-xl text-navy font-normal mt-6">Contact</h2>
        <p>Questions? Email <a href={`mailto:${company.email}`} className="text-gold">{company.email}</a>.</p>
      </div>
    </div>
  );
}
