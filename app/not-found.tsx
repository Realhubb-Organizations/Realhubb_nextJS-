import Link from "next/link";
import { Home, Search, Phone } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center page-padding">
      <div className="text-center max-w-lg">
        <p className="font-heading text-8xl text-white/10 font-normal">404</p>
        <h1 className="font-heading text-3xl text-white font-normal mt-4 mb-3">Page Not Found</h1>
        <p className="text-white/60 text-base mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let us help you find the right property.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-xl text-sm hover:bg-gold hover:text-navy transition-colors">
            <Home className="w-4 h-4" />Go Home
          </Link>
          <Link href="/projects/ongoing/bangalore" className="flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-xl text-sm hover:bg-gold/90 transition-colors">
            <Search className="w-4 h-4" />Browse Properties
          </Link>
          <Link href="/contact-us" className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl text-sm hover:border-gold hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />Contact Us
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {[
            { label: "Bangalore Properties", href: "/real-estate/bangalore" },
            { label: "Hyderabad Properties", href: "/real-estate/hyderabad" },
            { label: "2BHK Flats Bangalore", href: "/buy/2bhk-flats-bangalore" },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="block bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm hover:border-gold hover:text-gold transition-all">
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
