import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip/Brotli compression for all responses
  compress: true,
  // Remove X-Powered-By header (minor security + saves bytes)
  poweredByHeader: false,

  // Tree-shake large packages to reduce mobile JS bundle
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "gsap",
      "@gsap/react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
    ],
  },

  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "t4.ftcdn.net" },
    ],
    // Serve modern formats where supported
    formats: ["image/avif", "image/webp"],
    // Aggressive device sizes for mobile-first delivery
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  async redirects() {
    return [
      { source: "/projects", destination: "/projects/ongoing/bangalore", permanent: true },
      { source: "/ongoing-projects", destination: "/projects/ongoing/bangalore", permanent: true },
      { source: "/upcoming-projects", destination: "/projects/upcoming/bangalore", permanent: true },
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
      // Security + SEO headers for all routes
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
      // 1-year immutable cache for public folder assets (images, fonts, icons)
      {
        source: "/(.+\\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|otf|eot))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
