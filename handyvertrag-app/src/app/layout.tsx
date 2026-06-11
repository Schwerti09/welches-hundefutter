import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ExitIntent from "@/components/ExitIntent";
import WebVitals from "@/components/WebVitals";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://welches-hundefutter.today"),
  title: {
    default: "Welches Hundefutter für meinen Hund? ✓ KI-Berater BELLA findet es in 60 Sekunden",
    template: "%s | BELLA – KI-Hundefutterberater",
  },
  description: "Welches Hundefutter passt zu deinem Hund? BELLA fragt 5 Dinge und vergleicht über 11.000 echte Sorten und empfiehlt das passende für Rasse, Alter & Allergien. Kostenlos.",
  keywords: [
    "welches hundefutter für meinen hund",
    "hundefutter berater",
    "bestes hundefutter",
    "hundefutter empfehlung",
    "hundefutter test 2026",
    "welches hundefutter bei allergie",
    "welches trockenfutter ist am besten",
    "welches nassfutter für hunde",
  ],
  authors: [{ name: "Rolf Schwertfechter", url: "https://welches-hundefutter.today/ueber-uns" }],
  creator: "BELLA",
  publisher: "BELLA Intelligence System",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "https://welches-hundefutter.today",
    languages: {
      "de-DE": "https://welches-hundefutter.today",
      "de-AT": "https://welches-hundefutter.today",
      "de-CH": "https://welches-hundefutter.today",
      "x-default": "https://welches-hundefutter.today",
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://welches-hundefutter.today",
    siteName: "BELLA – Welches Hundefutter für meinen Hund",
    title: "Welches Hundefutter passt? ✓ BELLA findet es in 60 Sekunden",
    description: "KI-Ernährungsberatung für deinen Hund. über 11.000 Futter, individuell auf Rasse, Alter und Allergien zugeschnitten.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BELLA Hundefutter Berater" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Welches Hundefutter für meinen Hund? ✓ BELLA KI-Beraterin",
    description: "5 Fragen, 60 Sekunden, 3 Empfehlungen. BELLA findet das perfekte Hundefutter für deinen Hund.",
    images: ["/og-image.png"],
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
    google: ["Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I", "TCNbNGc8cJA0Hh5w6f2ojLRVGC4FUAeonQpE5GKwxTM"],
    other: { "msvalidate.01": ["03fce00755d90f20151908f4b591a4bc"] },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`h-full antialiased ${inter.variable}`}>
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I" />
        <meta name="google-site-verification" content="TCNbNGc8cJA0Hh5w6f2ojLRVGC4FUAeonQpE5GKwxTM" />

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

        {/* Additional SEO Tags */}
        <meta name="author" content="R. Schwertfechter" />
        <meta name="copyright" content="© 2026 BELLA Intelligence System" />
        <meta name="language" content="de" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className="min-h-full bg-[#08080c] text-[#f4f1ea]">
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="software" />
        {children}
        <StickyMobileCTA />
        <ExitIntent />
        <WebVitals />
      </body>
    </html>
  );
}
