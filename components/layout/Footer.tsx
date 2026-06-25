import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { company } from "@/data/company";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="page-padding pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-10">

          {/* Brand column */}
          <div className="md:col-span-3 lg:col-span-2 pb-8 lg:pb-0 border-b lg:border-0 border-white/10">
            <Link href="/" className="block mb-5">
              <Image
                src="/realhubb-logo-optimized.png"
                alt="RealHubb Ventures"
                width={200}
                height={65}
                unoptimized
                className="h-12 w-auto"
                style={{ aspectRatio: "200 / 65" }}
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted RERA-compliant real estate channel partner across Bangalore, Hyderabad &amp; Chennai.
              Verified properties. Zero brokerage. Expert advisor support.
            </p>
            <div className="flex gap-3">
              {[
                { href: company.social.instagram, label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { href: company.social.facebook, label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: company.social.linkedin, label: "LinkedIn", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { href: company.social.youtube, label: "YouTube", d: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all duration-200">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Properties by City */}
          <div className="col-span-1">
            <p className="section-overline text-gold mb-4">Properties by City</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/real-estate/bangalore" className="text-white/60 hover:text-gold transition-colors block">Flats in Bangalore</Link></li>
              <li><Link href="/real-estate/hyderabad" className="text-white/60 hover:text-gold transition-colors block">Flats in Hyderabad</Link></li>
              <li><Link href="/real-estate/chennai" className="text-white/60 hover:text-gold transition-colors block">Flats in Chennai</Link></li>
              <li><Link href="/projects/ongoing/bangalore" className="text-white/60 hover:text-gold transition-colors block">Ongoing — Bangalore</Link></li>
              <li><Link href="/projects/upcoming/bangalore" className="text-white/60 hover:text-gold transition-colors block">Upcoming — Bangalore</Link></li>
            </ul>
          </div>

          {/* Column 3 — Popular Localities */}
          <div className="col-span-1">
            <p className="section-overline text-gold mb-4">Popular Localities</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/real-estate/bangalore/koramangala" className="text-white/60 hover:text-gold transition-colors block">Koramangala</Link></li>
              <li><Link href="/real-estate/bangalore/whitefield" className="text-white/60 hover:text-gold transition-colors block">Whitefield</Link></li>
              <li><Link href="/real-estate/bangalore/hsr-layout" className="text-white/60 hover:text-gold transition-colors block">HSR Layout</Link></li>
              <li><Link href="/real-estate/bangalore/yelahanka" className="text-white/60 hover:text-gold transition-colors block">Yelahanka</Link></li>
              <li><Link href="/real-estate/hyderabad/gachibowli" className="text-white/60 hover:text-gold transition-colors block">Gachibowli</Link></li>
            </ul>
          </div>

          {/* Column 4 — Property Types */}
          <div className="col-span-1">
            <p className="section-overline text-gold mb-4">Property Types</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/buy/2bhk-flats-bangalore" className="text-white/60 hover:text-gold transition-colors block">2BHK Flats in Bangalore</Link></li>
              <li><Link href="/buy/3bhk-flats-bangalore" className="text-white/60 hover:text-gold transition-colors block">3BHK Flats in Bangalore</Link></li>
              <li><Link href="/buy/luxury-apartments-bangalore" className="text-white/60 hover:text-gold transition-colors block">Luxury Apartments</Link></li>
              <li><Link href="/buy/villas-bangalore" className="text-white/60 hover:text-gold transition-colors block">Villas in Bangalore</Link></li>
              <li><Link href="/buy/plots-bangalore" className="text-white/60 hover:text-gold transition-colors block">Plots in Bangalore</Link></li>
            </ul>
          </div>

          {/* Column 5 — Company */}
          <div className="col-span-1">
            <p className="section-overline text-gold mb-4">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-white/60 hover:text-gold transition-colors block">About Us</Link></li>
              <li>
                <Link href="/team" className="text-white/60 hover:text-gold transition-colors block">
                  Our Team
                </Link>
                {/* <span className="block text-white/30 text-[10px] mt-0.5 font-light leading-none">
                  incl. {company.advisors.join(", ")}
                </span> */}
              </li>
              <li><Link href="/career" className="text-white/60 hover:text-gold transition-colors block">Careers</Link></li>
              <li><Link href="/contact-us" className="text-white/60 hover:text-gold transition-colors block">Contact Us</Link></li>
              <li><Link href="/blog" className="text-white/60 hover:text-gold transition-colors block">Blog</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-gold transition-colors block">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 6 — Free Tools */}
          <div className="col-span-1">
            <p className="section-overline text-gold mb-4">Free Tools</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tools" className="text-white/60 hover:text-gold transition-colors font-medium block">All Tools Hub</Link></li>
              <li><Link href="/emi-calculator" className="text-white/60 hover:text-gold transition-colors block">EMI Calculator</Link></li>
              <li><Link href="/currency-calculator" className="text-white/60 hover:text-gold transition-colors block">Currency Converter</Link></li>
              <li><Link href="/home-loan-eligibility" className="text-white/60 hover:text-gold transition-colors block">Loan Eligibility</Link></li>
              <li><Link href="/rental-yield-calculator" className="text-white/60 hover:text-gold transition-colors block">Rental Yield</Link></li>
              <li><Link href="/salary-advisor" className="text-white/60 hover:text-gold transition-colors block">Salary Advisor</Link></li>
            </ul>
          </div>

        </div>

        {/* Contact strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/60">
          <a href={`tel:${company.phone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
            <Phone className="w-4 h-4 shrink-0 text-gold" />
            <span>{company.phone}</span>
          </a>
          <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
            <Mail className="w-4 h-4 shrink-0 text-gold" />
            <span>{company.email}</span>
          </a>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 text-gold mt-0.5" />
            <span className="leading-relaxed">{company.address}</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 page-padding py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <p>
          © {year} {company.name}. All rights reserved. RERA: {company.rera}
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
        </div>
      </div>

      {/* Organization JSON-LD reinforcement in footer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.name,
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: company.phone,
              contactType: "sales",
            },
          }),
        }}
      />
    </footer>
  );
}
