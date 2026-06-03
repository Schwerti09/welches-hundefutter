import type { Metadata } from "next";
import Link from "next/link";
import { products, getBestOffer, getProviderColor } from "@/data/products";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Alle Smartphones mit Vertrag 2026 | welches-hundefutter.today",
  description: "iPhone 17 Pro, Samsung Galaxy S25 Ultra, Google Pixel 10 und mehr — alle Smartphones im Vertragsvergleich. Telekom, Vodafone, o2. Preise ab 9,99 €/Monat.",
  alternates: { canonical: "https://welches-hundefutter.today/handys" },
};

const BRANDS = [
  { name: "Apple", icon: "", ids: products.filter(p => p.brand === "Apple").map(p => p.id) },
  { name: "Samsung", icon: "", ids: products.filter(p => p.brand === "Samsung").map(p => p.id) },
  { name: "Google", icon: "", ids: products.filter(p => p.brand === "Google").map(p => p.id) },
  { name: "Xiaomi", icon: "", ids: products.filter(p => p.brand === "Xiaomi").map(p => p.id) },
];

export default function HandysPage() {
  return (
    <div className="min-h-screen bg-[#05060f] text-white flex flex-col">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-bold text-sm">handyvertrag<span className="text-indigo-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-white/70">Alle Handys</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-5 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-3">Smartphones mit Vertrag</h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            {products.length} Geräte im Vergleich — jedes mit allen Provider-Angeboten. Oder lass BELLA das Richtige für dich finden.
          </p>
        </div>

        {/* Brand filter quick links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {BRANDS.filter(b => b.ids.length > 0).map(b => (
            <a key={b.name} href={`#${b.name.toLowerCase()}`}
              className="px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
              {b.name} ({b.ids.length})
            </a>
          ))}
        </div>

        {/* Product grid per brand */}
        {BRANDS.filter(b => b.ids.length > 0).map(brand => (
          <section key={brand.name} id={brand.name.toLowerCase()} className="mb-12">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <span className="text-white/60 text-base">·</span>
              {brand.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.filter(p => p.brand === brand.name).map(product => {
                const best = getBestOffer(product);
                return (
                  <Link key={product.id} href={`/handys/${product.id}`}
                    className="group block bg-white/[0.04] rounded-2xl border border-white/8 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {product.badge && (
                          <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full mb-2 ${
                            product.badge === "NEU 2025" || product.badge === "NEU 2026" || product.badge === "NEU" ? "bg-green-500/20 text-green-300" :
                            product.badge === "BESTSELLER" ? "bg-amber-400/20 text-amber-300" :
                            "bg-indigo-500/20 text-indigo-300"
                          }`}>{product.badge}</span>
                        )}
                        <p className="font-bold text-white leading-tight">{product.name}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? "text-amber-400" : "text-white/15"}`}>★</span>
                          ))}
                          <span className="text-[10px] text-white/35 ml-1">({product.reviews.toLocaleString("de-DE")})</span>
                        </div>
                      </div>
                    </div>

                    {/* Specs preview */}
                    <div className="space-y-1 mb-4">
                      <p className="text-[11px] text-white/40">{product.specs.display}</p>
                      <p className="text-[11px] text-white/40">{product.specs.camera.split("+")[0].trim()}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-white/35">ab</p>
                        <p className="text-xl font-black text-indigo-300 leading-none">
                          {best.monthlyPrice.toFixed(2).replace(".", ",")} €<span className="text-xs font-normal text-white/30">/Mo.</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Provider buttons */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {["telekom", "vodafone", "o2"].map(prov => (
                        <span key={prov} className={`text-[9px] font-bold text-white px-2 py-0.5 rounded bg-gradient-to-r ${getProviderColor(prov)} opacity-70 group-hover:opacity-100 transition-opacity`}>
                          {prov.charAt(0).toUpperCase() + prov.slice(1)}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* BELLA CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 p-7 text-center mt-4">
          <p className="text-xl font-black mb-2">Nicht sicher welches Handy passt?</p>
          <p className="text-white/50 mb-5">BELLA analysiert Budget, Nutzung und Netz — und findet dein Optimal-Gerät in Sekunden.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
            BELLA fragen →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
