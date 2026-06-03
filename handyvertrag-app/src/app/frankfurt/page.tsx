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

const frankfurtOffers = [
  {
    id: 1,
    city: "Frankfurt",
    device: "Samsung Galaxy S25 Ultra",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    provider: "Vodafone",
    monthlyPrice: 54.99,
    oneTimeCost: 0,
    dataVolume: "100 GB",
    contractDuration: 24,
    features: ["5G Highspeed", "Allnet Flat", "EU Roaming", "TV+ 6 Monate"],
    stores: 11,
    affiliateLink: "https://www.awin1.com/cread.php?s=YOUR_AWIN_ID&v=12357&p=12345",
    affiliateNetwork: "AWIN",
    trackingId: "awin-frankfurt-12357",
    bonus: "💰 75€ Cashback",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    city: "Frankfurt",
    device: "iPhone 16 Pro",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    provider: "Telekom",
    monthlyPrice: 54.99,
    oneTimeCost: 1.00,
    dataVolume: "Unlimited",
    contractDuration: 24,
    features: ["MagicTech Unlimited", "Allnet Flat", "5G", "EU Roaming"],
    stores: 8,
    affiliateLink: "https://www.awin1.com/cread.php?s=YOUR_AWIN_ID&v=12358&p=12345",
    affiliateNetwork: "AWIN",
    trackingId: "awin-frankfurt-12358",
    bonus: "🎁 50€ Cashback",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 3,
    city: "Frankfurt",
    device: "Xiaomi 14 Ultra",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    provider: "o2",
    monthlyPrice: 39.99,
    oneTimeCost: 49.99,
    dataVolume: "30 GB",
    contractDuration: 24,
    features: ["5G", "Allnet Flat", "EU Roaming", "Leica Kamera"],
    stores: 5,
    affiliateLink: "https://www.awin1.com/cread.php?s=YOUR_AWIN_ID&v=12359&p=12345",
    affiliateNetwork: "AWIN",
    trackingId: "awin-frankfurt-12359",
    bonus: "📸 Leica Kamera",
    rating: 4.6,
    inStock: true,
  },
];

export const metadata = {
  title: "Frankfurt - Handy mit Vertrag | Top Angebote | welches-hundefutter.today",
  description:
    "Die besten Handy-Verträge in Frankfurt. Samsung Galaxy S25 Ultra, iPhone 16 Pro & mehr mit Telekom, Vodafone, o2. Jetzt vergleichen & sparen!",
  alternates: {
    canonical: "https://welches-hundefutter.today/frankfurt",
  },
};

export default function FrankfurtPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-semibold">🏙️ FRANKFURT EXKLUSIV</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
              Handy mit Vertrag
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100 max-w-3xl mx-auto">
              Die besten Angebote in Frankfurt bei {frankfurtOffers.reduce((sum, o) => sum + o.stores, 0)} Stores
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#angebote"
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Jetzt vergleichen
              </a>
              <a
                href="/#advisor"
                className="px-8 py-4 bg-emerald-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-950 transition-all shadow-xl border-2 border-white/30 hover:-translate-y-1"
              >
                🤖 AI Advisor starten
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* City Stats */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-emerald-600 mb-2">24</div>
            <div className="text-gray-600 text-sm">Stores in Frankfurt</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">3</div>
            <div className="text-gray-600 text-sm">Top Provider</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">140+</div>
            <div className="text-gray-600 text-sm">Angebote verfügbar</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
            <div className="text-gray-600 text-sm">Durchschnittsbewertung</div>
          </div>
        </div>
      </section>

      {/* Top Offers */}
      <section id="angebote" className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔥 Top Angebote in Frankfurt
          </h2>
          <p className="text-gray-600 text-lg">Exklusive Deals mit AWIN Affiliate Tracking</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {frankfurtOffers.map((offer) => (
            <Suspense
              key={offer.id}
              fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-96" />}
            >
              <CityOfferCard offer={offer} />
            </Suspense>
          ))}
        </div>
      </section>

      {/* AI Advisor */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🤖 AI Advisor für Frankfurt
              </h2>
              <p className="text-emerald-100 text-lg mb-6">
                Unser KI-Berater findet den perfekten Vertrag für dich in Frankfurt.
              </p>
              <ul className="space-y-3 mb-6">
                {["Persönliche Empfehlungen", "Lokale Verfügbarkeit in Frankfurt", "Budget-optimierte Vorschläge"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="text-green-300 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="flex justify-center">
              <Suspense fallback={<div className="animate-pulse bg-white/20 rounded-2xl h-64 w-full" />}>
                <AIAdvisor city="Frankfurt" />
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
              <h3 className="text-lg font-bold mb-4">Handyvertrag Frankfurt</h3>
              <p className="text-gray-400">
                Deine lokale Quelle für Handy-Verträge in Frankfurt.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Angebote</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Samsung Galaxy S25 Ultra</li>
                <li>iPhone 16 Pro</li>
                <li>Xiaomi 14 Ultra</li>
                <li><a href="/" className="hover:text-white transition-colors">Alle Modelle</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Städte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/berlin" className="hover:text-white transition-colors">Berlin</a></li>
                <li><a href="/hamburg" className="hover:text-white transition-colors">Hamburg</a></li>
                <li><a href="/koeln" className="hover:text-white transition-colors">Köln</a></li>
                <li><a href="/stuttgart" className="hover:text-white transition-colors">Stuttgart</a></li>
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
            <p>© 2026 welches-hundefutter.today · Alle Preise inkl. MwSt. · Affiliate-Links powered by AWIN.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
