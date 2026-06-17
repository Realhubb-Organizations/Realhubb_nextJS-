import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/projects/ongoing", permanent: true },
      { source: "/ongoing-projects", destination: "/projects/ongoing", permanent: true },
      { source: "/upcoming-projects", destination: "/projects/upcoming", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/tools/emi-calculator", destination: "/emi-calculator", permanent: true },
      { source: "/tools/home-loan-eligibility", destination: "/home-loan-eligibility", permanent: true },
      { source: "/tools/rental-yield-calculator", destination: "/rental-yield-calculator", permanent: true },
      { source: "/tools/salary-advisor", destination: "/salary-advisor", permanent: true },
      { source: "/tools/currency-calculator", destination: "/currency-calculator", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
