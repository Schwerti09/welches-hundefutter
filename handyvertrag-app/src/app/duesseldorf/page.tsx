import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";

const CityOfferCard = dynamic(() => import("@/components/CityOfferCard"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-2xl h-96" />,
  ssr: true,
});

export const metadata: Metadata = {
  title: "Handyvertrag Düsseldorf 2026 | Beste Angebote | welches-hundefutter.today",
  description: "Die besten Handyverträge in Düsseldorf. Samsung Galaxy S25, iPhone 17 Pro & mehr mit Telekom, Vodafone, o2. Jetzt vergleichen & bis zu 200 € sparen!",
  alternates: { canonical: "https://welches-hundefutter.today/duesseldorf" },
};

const offers = [
  { id: 1, city: "Düsseldorf", device: "Samsung Galaxy S25 Ultra", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", provider: "Telekom", monthlyPrice: 39.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, features: ["5G Unlimited", "Allnet-Flat", "EU-Roaming", "100 GB Cloud"], stores: 18, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", affiliateNetwork: "AWIN", trackingId: "awin-ddorf-001", bonus: "💰 100€ Cashback", rating: 4.8, inStock: true },
  { id: 2, city: "Düsseldorf", device: "iPhone 17 Pro", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", provider: "Vodafone", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "100 GB", contractDuration: 24, features: ["5G Highspeed", "Allnet-Flat", "EU-Roaming", "Apple Music"], stores: 14, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", affiliateNetwork: "AWIN", trackingId: "awin-ddorf-002", bonus: "🎁 3 Monate gratis", rating: 4.9, inStock: true },
  { id: 3, city: "Düsseldorf", device: "Google Pixel 10 Pro", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", provider: "o2", monthlyPrice: 44.99, oneTimeCost: 0, dataVolume: "50 GB", contractDuration: 24, features: ["5G", "Allnet-Flat", "EU-Roaming", "Google One"], stores: 9, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", affiliateNetwork: "AWIN", trackingId: "awin-ddorf-003", bonus: "🎮 Spotify Premium", rating: 4.7, inStock: true },
];

export default function DuesseldorfPage() {
  const totalStores = offers.reduce((s, o) => s + o.stores, 0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">🏙️ DÜSSELDORF EXKLUSIV</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Handyvertrag <span className="text-orange-200">Düsseldorf</span></h1>
          <p className="text-xl text-red-100 mb-6">Top Angebote in Düsseldorf – {totalStores} Stores, alle Provider</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-black">{totalStores}</div><div className="text-sm text-red-200">Stores</div></div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-black">3</div><div className="text-sm text-red-200">Provider</div></div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-black">150+</div><div className="text-sm text-red-200">Angebote</div></div>
          </div>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">🔥 Top Angebote in Düsseldorf</h2>
        <p className="text-gray-500 text-center mb-8">Aktuelle Deals mit AWIN Affiliate Tracking</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Suspense key={offer.id} fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-96" />}>
              <CityOfferCard offer={offer} />
            </Suspense>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-6">Mehr Städte</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[["Hamburg","/hamburg"],["Berlin","/berlin"],["München","/muenchen"],["Köln","/koeln"],["Frankfurt","/frankfurt"],["Stuttgart","/stuttgart"]].map(([c,h]) => (
              <Link key={c} href={h} className="px-4 py-2 bg-white rounded-xl shadow-sm border text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium">{c}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
