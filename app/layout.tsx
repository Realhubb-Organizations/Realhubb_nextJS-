import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  // Restrict to only the weights used across the site to reduce font download size
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});



const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-M9B4MV6C";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://realhubb.in";
const PUBLISHER = "RealHubb Ventures Pvt. Ltd.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RealHubb — Real Estate in Bangalore, Hyderabad & Chennai",
    template: "%s | RealHubb",
  },
  description:
    "RealHubb is a trusted real estate partner in Bangalore, Hyderabad & Chennai. Discover verified RERA properties & flats with zero brokerage and free site visits.",
  keywords:
    "real estate bangalore, flats in bangalore, apartments bangalore, hyderabad, chennai",
  authors: [{ name: PUBLISHER, url: SITE_URL }],
  openGraph: {
    type: "website",
    siteName: "RealHubb",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "oGsNb0RCjzrOrewBDOrbwa2ptrTzklvMKhn8sitGkIs",
  },
  alternates: {
    canonical: "./",
  },
  other: {
    publisher: PUBLISHER,
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        {/* ── Preconnect to external CDN domains ─────────────────────────────
            These eliminate DNS + TCP handshake latency BEFORE the browser
            starts parsing the body and discovering image URLs.
        ─────────────────────────────────────────────────────────────────── */}
        {/* ImageKit — hero poster & video */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        {/* Cloudinary — property / developer images */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        {/* Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* External city images */}
        <link rel="dns-prefetch" href="https://media.istockphoto.com" />
        <link rel="dns-prefetch" href="https://t4.ftcdn.net" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Google Analytics */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ── Hero LCP image preload (mobile + desktop) ──────────────────── */}
        <link
          rel="preload"
          as="image"
          href="https://ik.imagekit.io/o72k8hn7h/realhubb%20/269354_large.mp4/ik-thumbnail.jpg?tr=w-640,q-60,f-webp"
          media="(max-width: 1023px)"
        />
        <link
          rel="preload"
          as="image"
          href="https://ik.imagekit.io/o72k8hn7h/realhubb%20/269354_large.mp4/ik-thumbnail.jpg?tr=w-1280,q-60,f-webp"
          media="(min-width: 1024px)"
        />

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="bg-cream font-body text-navy antialiased flex flex-col min-h-screen">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
