import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";
import { company } from "@/data/company";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import ContactForm from "@/components/contact/ContactForm";
import WhatsAppButton from "@/components/lead/WhatsAppButton";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

// 148 chars ✅
export const metadata: Metadata = buildMetadata({
  title: "Contact Us — Free Property Advice | RealHubb",
  description:
    "Contact RealHubb Ventures for free property advice in Bangalore, Hyderabad & Chennai. Call, WhatsApp or email. Mon–Sat 9am–7pm. Free callback in 15 min.",
  canonical: `${SITE_URL}/contact-us`,
  geoRegion: "IN-KA",
  geoPlacename: "Bangalore",
});

const contactItems = [
  { icon: Phone, label: "Call Us", value: company.phone, href: `tel:${company.phone}` },
  { icon: Mail, label: "Email Us", value: company.email, href: `mailto:${company.email}` },
  { icon: MapPin, label: "Office", value: company.address, href: undefined },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9am–7pm IST", href: undefined },
];

const breadcrumbs = [
  { name: "Home", url: SITE_URL },
  { name: "Contact Us", url: `${SITE_URL}/contact-us` },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <div className="pt-20">
        <div className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4">
            Contact Us
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-lg">
            Our advisors are available Mon–Sat, 9am–7pm. Get a free callback in 15 minutes.
          </p>
        </div>

        <div className="page-padding py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="font-heading text-2xl text-navy font-normal mb-6">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl text-navy font-normal">Get in touch</h2>
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-navy text-sm hover:text-gold transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-navy text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="pt-2">
              <WhatsAppButton label="Chat on WhatsApp" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
