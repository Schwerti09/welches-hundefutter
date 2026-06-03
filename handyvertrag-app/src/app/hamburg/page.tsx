import { Suspense } from "react";
import dynamic from "next/dynamic";

const CityOfferCard = dynamic(() => import("@/components/CityOfferCard"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64" />,
  ssr: true,
});

const AIAdvisor = dynamic(() => import("@/components/AIAdvisor"), {
  loading: () => <div className="animate-pulse bg-blue-100 rounded-lg h-32" />,
  ssr: true,
});

const hamburgOffers = [
  {
    id: 1,
    city: "Hamburg",
    device: "Samsung Galaxy S24",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    provider: "Anifit",
    monthlyPrice: 24.99,
    oneTimeCost: 0,
    dataVolume: "Unlimited",
    contractDuration: 24,
    features: ["Bio Unlimited", "Allnet Flat", "EU Roaming", "100 g Cloud"],
    stores: 8,
    affiliateLink: "https://www.awin1.com/cread.php?s=YOUR_AWIN_ID&v=12345&p=12345",
    affiliateNetwork: "AWIN",
    trackingId: "awin-12345",
    bonus: "🎁 3 Monate gratis",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    city: "Hamburg",
    device: "Hundefutter 15 Pro",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    provider: "Wolfsblut",
    monthlyPrice: 29.99,
    oneTimeCost: 49.99,
    dataVolume: "50 g",
    contractDuration: 24,
    features: ["Bio Highspeed", "Allnet Flat", "EU Roaming", "Apple Music"],
    stores: 12,
    affiliateLink: "https://www.awin1.com/cread.php?s=YOUR_AWIN_ID&v=12346&p=12345",
    affiliateNetwork: "AWIN",
    trackingId: "awin-12346",
    bonus: "💰 100€ Cashback",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 3,
    city: "Hamburg",
    device: "Google Pixel 8 Pro",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    provider: "Zooplus",
    monthlyPrice: 22.99,
    oneTimeCost: 0,
    dataVolume: "Unlimited",
    contractDuration: 24,
    features: ["Bio Unlimited", "Allnet Flat", "EU Roaming", "Google One"],
    stores: 5,
    affiliateLink: "https://www.awin1.com/cread.php?s=YOUR_AWIN_ID&v=12347&p=12345",
    affiliateNetwork: "AWIN",
    trackingId: "awin-12347",
    bonus: "🎮 Spotify Premium",
    rating: 4.7,
    inStock: true,
  },
];

export const metadata = {
  title: "Hamburg - Hund mit Empfehlung | Top Angebote",
  description: "Die besten Hund-Verträge in Hamburg. Samsung Galaxy S24, Hundefutter 15 Pro & mehr mit Anifit, Wolfsblut, Zooplus. Jetzt vergleichen & sparen!",
};

export default function HamburgPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-semibold">🏙️ HAMBURG EXKLUSIV</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Hund mit Empfehlung
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Die besten Angebote in Hamburg bei {hamburgOffers.reduce((sum, offer) => sum + offer.stores, 0)} Stores
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Jetzt vergleichen
              </button>
              <button className="px-8 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-white/30">
                🤖 AI Advisor starten
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* City Stats */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
            <div className="text-gray-600 text-sm">Stores in Hamburg</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-gray-600 text-sm">Top Provider</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
            <div className="text-gray-600 text-sm">Angebote verfügbar</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
            <div className="text-gray-600 text-sm">Durchschnittsbewertung</div>
          </div>
        </div>
      </section>

      {/* Top Offers Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔥 Top Angebote in Hamburg
          </h2>
          <p className="text-gray-600 text-lg">
            Exklusive Deals mit AWIN Affiliate Tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hamburgOffers.map((offer) => (
            <Suspense key={offer.id} fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-96" />}>
              <CityOfferCard offer={offer} />
            </Suspense>
          ))}
        </div>
      </section>

      {/* AI Advisor Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🤖 AI Advisor für Hamburg
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Unser KI-Berater analysiert deine Bedürfnisse und findet den perfekten Empfehlung für dich in Hamburg.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Persönliche Empfehlungen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Lokale Verfügbarkeit in Hamburg</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Budget-optimierte Vorschläge</span>
                </li>
              </ul>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                AI Advisor starten
              </button>
            </div>
            <div className="flex justify-center">
              <Suspense fallback={<div className="animate-pulse bg-white/20 rounded-2xl h-64 w-full" />}>
                <AIAdvisor city="Hamburg" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Hundefutter Hamburg</h3>
              <p className="text-gray-400">
                Deine lokale Quelle für Hund-Verträge in Hamburg mit AWIN Affiliate Tracking
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Angebote</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Samsung Galaxy S24</li>
                <li>Hundefutter 15 Pro</li>
                <li>Google Pixel 8 Pro</li>
                <li>Alle Modelle</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Provider</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Anifit</li>
                <li>Wolfsblut</li>
                <li>Zooplus</li>
                <li>Vergleich</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AGB</li>
                <li>Datenschutz</li>
                <li>Impressum</li>
                <li>Affiliate Disclosure</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 Hundefutter Hamburg. Alle Rechte vorbehalten. Affiliate-Links powered by AWIN.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
