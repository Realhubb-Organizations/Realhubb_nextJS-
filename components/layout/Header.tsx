"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { company } from "@/data/company";
import { trackWhatsApp } from "@/lib/ga";

const WHATSAPP_MESSAGE = "Hi, I found your website and I'm interested in properties.";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "/projects/ongoing/bangalore",
  },

  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "All Tools Hub", href: "/tools" },
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "Currency Converter", href: "/currency-calculator" },
      { label: "Home Loan Eligibility", href: "/home-loan-eligibility" },
      { label: "Rental Yield Calculator", href: "/rental-yield-calculator" },
      { label: "Salary Advisor", href: "/salary-advisor" },
    ],
  },

  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "FAQ", href: "/faq" },

];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Close timer — gives cursor 150 ms to travel from button into the dropdown
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setDropdown(null), 150);
  }, []);

  // Cancel pending close when cursor re-enters the dropdown itself
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [pathname]);

  const lightPages = [
    "/tools",
    "/emi-calculator",
    "/currency-calculator",
    "/home-loan-eligibility",
    "/rental-yield-calculator",
    "/salary-advisor",
    "/privacy",
    "/terms"
  ];
  const isLightPage = lightPages.includes(pathname) || pathname.startsWith("/admin");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isLightPage
          ? "bg-navy/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-3"
      )}
    >
      <div className="page-padding flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/realhubb-logo-optimized.png"
            alt="RealHubb Ventures"
            width={200}
            height={65}
            priority
            unoptimized
            className="h-12 sm:h-14 w-auto"
            style={{ aspectRatio: "200 / 65" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => openDropdown(link.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-normal transition-colors",
                    dropdown === link.label ? "text-gold" : "text-white/80 hover:text-gold"
                  )}
                  aria-expanded={dropdown === link.label}
                  suppressHydrationWarning
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      dropdown === link.label && "rotate-180"
                    )}
                  />
                </button>

                {dropdown === link.label && (
                  /*
                   * pt-2 is an invisible top padding that bridges the gap between
                   * the nav button and the white panel — cursor never leaves the
                   * hover area while traveling downward.
                   */
                  <div
                    className="absolute top-full left-0 pt-2 w-56 z-50"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center px-4 py-2.5 text-navy text-sm hover:bg-cream hover:text-gold transition-colors gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-normal transition-colors",
                  pathname === link.href
                    ? "text-gold"
                    : "text-white/80 hover:text-gold"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-2 text-white/80 hover:text-gold text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            {company.phone}
          </a>
          <a
            href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsApp}
            aria-label="Chat on WhatsApp"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Image src="/whatsapp.png" alt="" width={24} height={24} unoptimized className="w-5 h-5" />
          </a>
          <Link
            href="/contact-us"
            className="bg-gold text-navy px-4 py-2 rounded-lg text-sm font-normal hover:bg-gold/90 transition-colors"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-8 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="block py-2 text-white/80 text-sm hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-1.5 pl-4 text-white/50 text-xs hover:text-gold transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <a
            href={`tel:${company.phone}`}
            className="mt-3 flex items-center gap-2 text-gold text-sm"
          >
            <Phone className="w-4 h-4" />
            {company.phone}
          </a>
          <a
            href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsApp}
            className="mt-2 flex items-center gap-2 text-white/80 text-sm hover:text-gold transition-colors"
          >
            <Image src="/whatsapp.png" alt="" width={20} height={20} unoptimized className="w-4 h-4" />
            Chat on WhatsApp
          </a>
          <Link
            href="/contact-us"
            className="mt-2 bg-gold text-navy text-center py-2.5 rounded-lg text-sm"
          >
            Free Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
