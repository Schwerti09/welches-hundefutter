import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // 301-Redirects: alte/verlinkte URLs ohne eigene Seite → kanonische Ziele.
  // Verhindert 404s aus Sitemap-Altlasten, externen Links und KI-Zitaten.
  async redirects() {
    return [
      { source: "/allergie", destination: "/problem/allergie", permanent: true },
      { source: "/test/hundefutter-2026", destination: "/blog/hundefutter-test-2026", permanent: true },
      { source: "/futter/welpen", destination: "/lebensphase/welpen", permanent: true },
      { source: "/futter/senior", destination: "/lebensphase/senior", permanent: true },
      { source: "/futter/:slug", destination: "/lebensphase/:slug", permanent: true },
      { source: "/tools/allergie-rechner", destination: "/problem/allergie", permanent: true },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|css|js)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
