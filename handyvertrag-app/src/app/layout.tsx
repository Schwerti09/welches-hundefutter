import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ExitIntent from "@/components/ExitIntent";

export const metadata: Metadata = {
  metadataBase: new URL("https://handytrotzschufa.today"),
  title: {
    default: "Handyvertrag trotz Schufa 2026 ✓ Sofort genehmigt | HANSI",
    template: "%s | HANSI – Handyvertrag trotz Schufa",
  },
  description: "Handyvertrag trotz Schufa: HANSI findet in 3 Fragen deinen Vertrag. ✓ freenet ab 9,99€ ✓ congstar ✓ Prepaid ohne Bonitätsprüfung. Jetzt kostenlos prüfen.",
  keywords: [
    "handyvertrag trotz schufa",
    "handyvertrag ohne schufa",
    "handy trotz schufa",
    "handyvertrag negative schufa",
    "handyvertrag trotz schufa eintrag",
    "handy mit vertrag trotz schufa",
    "handyvertrag schlechte schufa",
    "handyvertrag trotz schufa 2026",
  ],
  authors: [{ name: "R. Schwertfechter", url: "https://handytrotzschufa.today/ueber-uns" }],
  creator: "HANSI",
  publisher: "HANSI Intelligence System",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "https://handytrotzschufa.today",
    languages: { "de-DE": "https://handytrotzschufa.today" },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://handytrotzschufa.today",
    siteName: "HANSI – Handyvertrag trotz Schufa",
    title: "Handyvertrag trotz Schufa 2026 ✓ HANSI findet deinen Vertrag",
    description: "KI-Berater für Handyverträge trotz Schufa. 3 Fragen, 5000+ Angebote, sofortige Genehmigungschancen.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HANSI Handyvertrag trotz Schufa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handyvertrag trotz Schufa ✓ HANSI KI-Berater",
    description: "3 Fragen, sofortige Antwort. Handyvertrag trotz negativer Schufa finden.",
    images: ["/twitter-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I",
    other: { "msvalidate.01": ["03fce00755d90f20151908f4b591a4bc"] },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="h-full antialiased">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />

        {/* Preconnect zu kritischen Third-Party Origins */}
        <link rel="preconnect" href="https://api.anthropic.com" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="preconnect" href="https://neon.tech" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        
        {/* Canonical Link */}
        <link rel="canonical" href="https://handytrotzschufa.today" />
        
        {/* Additional SEO Tags */}
        <meta name="author" content="R. Schwertfechter" />
        <meta name="copyright" content="© 2026 HANSI Intelligence System" />
        <meta name="language" content="de" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className="min-h-full bg-[#05060f] text-white">
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="software" />
        {children}
        <StickyMobileCTA />
        <ExitIntent />
      </body>
    </html>
  );
}
