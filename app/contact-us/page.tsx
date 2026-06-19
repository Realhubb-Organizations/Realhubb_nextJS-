import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";
import { company } from "@/data/company";
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
        <div className="bg-navy relative overflow-hidden py-16 page-padding">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="Contact RealHubb"
              className="w-full h-full object-cover opacity-35 filter brightness-95"
            />
            {/* Smooth linear top-to-bottom gradient overlay to maintain readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy" />
          </div>

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-0">
              Contact Us
            </h1>
            <p className="text-white/60 text-base mt-3 max-w-lg">
              Our advisors are available Mon–Sat, 9am–7pm. Get a free callback in 15 minutes.
            </p>
          </div>
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

        {/* ── GOOGLE MAP EMBED ── */}
        <div className="mt-8 mb-16 max-w-7xl mx-auto">
          <div className="bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-heading text-2xl text-navy font-normal mb-6">
              Our Office Location
            </h2>
            <div className="rounded-2xl overflow-hidden h-96 border border-gray-150/80 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.272186791227!2d77.63973947594589!3d13.018336687301292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1766a504ef53%3A0xe4d31498b0f80757!2sRealhubb%20Ventures%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1718712000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="RealHubb Ventures Office Location"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
