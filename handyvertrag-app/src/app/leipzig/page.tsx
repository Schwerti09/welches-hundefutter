import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";

const CityOfferCard = dynamic(() => import("@/components/CityOfferCard"), { ssr: true });

export const metadata: Metadata = {
  title: "Handyvertrag Leipzig 2026 | Beste Angebote | handytrotzschufa.today",
  description: "Die besten Handyverträge in Leipzig. iPhone 17, Samsung Galaxy & mehr mit Telekom, Vodafone, o2. Günstigste Deals in Sachsen!",
  alternates: { canonical: "https://handytrotzschufa.today/leipzig" },
};

const offers = [
  { id: 1, city: "Leipzig", device: "Samsung Galaxy S25", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", provider: "o2", monthlyPrice: 19.99, oneTimeCost: 0, dataVolume: "20 GB", contractDuration: 24, features: ["5G", "Allnet-Flat", "EU-Roaming"], stores: 8, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", affiliateNetwork: "AWIN", trackingId: "awin-le-001", bonus: "💚 Günstigster Preis", rating: 4.6, inStock: true },
  { id: 2, city: "Leipzig", device: "iPhone 17 Pro", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", provider: "Telekom", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, features: ["5G Unlimited", "Allnet-Flat", "EU-Roaming"], stores: 11, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", affiliateNetwork: "AWIN", trackingId: "awin-le-002", bonus: "⭐ Bestseller", rating: 4.9, inStock: true },
  { id: 3, city: "Leipzig", device: "Google Pixel 10a", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", provider: "Vodafone", monthlyPrice: 24.99, oneTimeCost: 0, dataVolume: "30 GB", contractDuration: 24, features: ["5G", "Allnet-Flat", "EU-Roaming"], stores: 6, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", affiliateNetwork: "AWIN", trackingId: "awin-le-003", bonus: "🎓 Student Deal", rating: 4.7, inStock: true },
];

export default function LeipzigPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="relative bg-gradient-to-r from-green-700 via-emerald-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">🏙️ LEIPZIG EXKLUSIV</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Handyvertrag <span className="text-green-200">Leipzig</span></h1>
          <p className="text-xl text-green-100 mb-6">Beste Deals in Sachsen – günstig, schnell, zuverlässig</p>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">🔥 Top Angebote in Leipzig</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Suspense key={offer.id} fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-96" />}>
              <CityOfferCard offer={offer} />
            </Suspense>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-black mb-4">Weitere Städte</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[["Hamburg","/hamburg"],["Berlin","/berlin"],["Düsseldorf","/duesseldorf"],["Köln","/koeln"],["Frankfurt","/frankfurt"],["Stuttgart","/stuttgart"]].map(([c,h]) => (
              <Link key={c} href={h} className="px-4 py-2 bg-white rounded-xl shadow-sm border text-gray-700 hover:border-green-400 hover:text-green-600 transition-colors text-sm">{c}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
