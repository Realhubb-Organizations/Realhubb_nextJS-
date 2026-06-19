import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { organizationSchema, webSiteSchema } from "@/lib/structuredData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/lead/ChatWidget";
import LeadPopup from "@/components/lead/LeadPopup";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-RXW691N6BH";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";
const PUBLISHER = "RealHubb Ventures Pvt. Ltd.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RealHubb — Real Estate in Bangalore, Hyderabad & Chennai",
    template: "%s | RealHubb",
  },
  // 148 chars — within 150-155 target
  description:
    "Trusted real estate channel partner in Bangalore, Hyderabad & Chennai. Verified RERA properties. Zero brokerage. Expert advisors. Free site visit.",
  keywords:
    "real estate bangalore, flats in bangalore, apartments bangalore, property bangalore, buy flat bangalore, real estate hyderabad, real estate chennai",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }}
        />
      </head>
      <body className="bg-cream font-body text-navy antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <LeadPopup />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
      </body>
    </html>
  );
}
