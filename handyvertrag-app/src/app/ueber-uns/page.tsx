import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Über BELLA & Rolf Schwertfechter | welches-hundefutter.today",
  description: "Rolf Schwertfechter, Gründer von BELLA: KI-Ernährungsberaterin für Hunde. Mission, Expertise und Hintergrund.",
  alternates: { canonical: "https://welches-hundefutter.today/ueber-uns" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rolf Schwertfechter",
  url: "https://welches-hundefutter.today/ueber-uns",
  jobTitle: "Gründer & KI-Entwickler",
  worksFor: {
    "@type": "Organization",
    "@id": "https://welches-hundefutter.today/#organization",
    name: "BELLA Intelligence System",
  },
  knowsAbout: ["Hundeernährung", "Hundefutter", "Tiergesundheit", "KI-Beratung", "Affiliate-Marketing"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karklandsweg 1",
    addressLocality: "Dornum",
    postalCode: "26553",
    addressCountry: "DE",
  },
  email: "support@welches-hundefutter.today",
  sameAs: ["https://github.com/Schwerti09"],
};

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-sm">welches-hundefutter<span className="text-orange-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-white/70">Über uns</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-5 py-14 w-full">
        {/* Autor-Box (E-E-A-T) */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-10 flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-black shrink-0">
            RS
          </div>
          <div>
            <p className="font-bold text-white text-lg">Rolf Schwertfechter</p>
            <p className="text-orange-400 text-sm mb-2">Gründer & KI-Entwickler, BELLA Intelligence System</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rolf Schwertfechter ist Gründer von BELLA und spezialisiert auf KI-gestützte Ernährungsberatung
              für Hunde. Er entwickelt Algorithmen, die Hundebesitzern helfen, aus 500+ Futtersorten das
              richtige für ihre Rasse, ihr Alter und ihre gesundheitlichen Besonderheiten zu finden.
              Wohnhaft in Dornum, Niedersachsen.
            </p>
            <div className="flex gap-3 mt-3 text-xs text-gray-500">
              <span>Expertise: Hundeernährung, Tiergesundheit, KI</span>
              <span>·</span>
              <a href="mailto:support@welches-hundefutter.today" className="text-orange-400 hover:text-orange-300">
                support@welches-hundefutter.today
              </a>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-5 tracking-wide uppercase">
            Über welches-hundefutter.today
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            Wir finden das{" "}
            <span className="text-orange-400">perfekte Futter</span>{" "}
            für deinen Hund.
          </h1>
          <p className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
            BELLA ist Deutschlands erste KI-Ernährungsberaterin für Hunde: 5 Fragen,
            500+ Sorten, 1 perfekte Empfehlung — in unter 60 Sekunden. Kostenlos.
          </p>
        </div>

        {/* Story */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-5">Die Geschichte</h2>
          <div className="bg-white/[0.04] rounded-2xl p-6 space-y-4 text-white/70 leading-relaxed">
            <p>
              Hundefutter-Vergleichsseiten zeigen dir 300 Angebote. Du weißt nicht, welches passt. Du klickst auf das
              günstigste. Es ist das falsche. Einen Monat später frisst dein Hund immer noch schlecht — und du weißt
              nicht warum.
            </p>
            <p>
              Das ist der Status quo. Und er ist unnötig schlecht.
            </p>
            <p>
              welches-hundefutter.today wurde aus der Überzeugung heraus gebaut, dass ein guter Berater —
              einer, der wirklich zuhört — dieses Problem lösen kann. Kein Scrollen durch Listen. Kein Verwirrspiel
              mit Inhaltsstoffen. Stattdessen: ein Gespräch.
            </p>
            <p>
              BELLA ist das Ergebnis. Eine KI-Beraterin, die aus 500+ Futtersorten die 3 besten für deinen
              Hund heraussucht — basierend auf Rasse, Alter, Aktivität und gesundheitlichen Besonderheiten.
            </p>
          </div>
        </section>

        {/* Mission cards */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-6">Unsere Prinzipien</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "🎯", title: "Beraten statt listen", body: "BELLA trifft Entscheidungen. Sie empfiehlt 3 Futtersorten — nicht 300. Weil weniger Auswahl bessere Entscheidungen produziert." },
              { icon: "🔒", title: "Unabhängig & neutral", body: "Provision beeinflusst keine Empfehlung. BELLAs Empfehlungen basieren auf Hundeprofil, Inhaltsstoffen und Preis-Leistung." },
              { icon: "📊", title: "Datenbasiert", body: "Wir pflegen 500+ Futtersorten mit Nährwerten, Preisen und Eignung. Täglich aktualisiert. Keine veralteten Daten." },
              { icon: "🤝", title: "Transparent", body: "Wir verdienen Geld durch Affiliate-Provisionen. Das ist klar gekennzeichnet. Dein Preis ändert sich dadurch nie." },
            ].map((c) => (
              <div key={c.title} className="bg-white/[0.04] rounded-2xl p-5">
                <div className="text-2xl mb-3">{c.icon}</div>
                <h3 className="font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technologie */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-6">Technologie</h2>
          <div className="space-y-3">
            {[
              ["Entscheidungs-Engine", "HANSI Decision Intelligence Engine™ – proprietäres Empfehlungssystem"],
              ["KI-Beraterin", "Google Gemini 2.0 + Anthropic Claude Haiku 4.5 – Streaming, Echtzeit"],
              ["Datenbank", "PostgreSQL (Neon) – 500+ Futtersorten, täglich aktualisiert"],
              ["Affiliate-Netzwerk", "AWIN – direkte Feed-Integration mit Anifit, Futalis, Bellfor u.a."],
              ["Hosting", "Netlify Edge Network – globale Verfügbarkeit"],
              ["Framework", "Next.js 16 App Router – schnell, SEO-optimiert"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                <span className="text-sm font-semibold text-white/60 w-40 shrink-0">{k}</span>
                <span className="text-sm text-white/50">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kontakt */}
        <section className="bg-gradient-to-r from-orange-600/20 to-orange-400/20 border border-orange-500/30 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-black mb-2">Kontakt</h2>
          <p className="text-white/60 text-sm mb-4">Fragen, Feedback, Tierarzt-Kooperation — wir freuen uns.</p>
          <a href="mailto:support@welches-hundefutter.today" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm">
            support@welches-hundefutter.today →
          </a>
          <p className="text-white/30 text-xs mt-4">Rolf Schwertfechter · Karklandsweg 1 · 26553 Dornum · Deutschland</p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
