import type { NextConfig } from "next";

// Content-Security-Policy (Roadmap Op 1.2, Weg B):
// - strikt bei default/object/base/form/frame-ancestors
// - script/style: 'unsafe-inline' nötig, weil Next + Tailwind Inline-Code/-Styles
//   ausliefern und eine Nonce-Middleware alle 2.372 SSG-Seiten dynamisch machen würde.
//   Trade-off bewusst: verhindert die häufigsten Injection-Vektoren, ist aber kein
//   'strict-dynamic'. Strikte Variante bleibt in Op 1.2 als Folgeschritt notiert.
// - img-src https: — Produktbilder kommen aus vielen AWIN-Händler-Hosts.
// - connect/script: nur Google Analytics (gtag) zusätzlich erlaubt.
const CSP = [
  "default-src 'self'",
  "base-uri 'none'", // die Seite nutzt kein <base> → 'none' schließt <base>-Injection komplett aus
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' data: https:",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

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
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.dog.ceo",
        port: "",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
    cssChunking: true,
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
          { key: "Content-Security-Policy", value: CSP },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
