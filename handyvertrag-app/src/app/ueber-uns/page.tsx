import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Über HANSI & R. Schwertfechter | handytrotzschufa.today",
  description: "R. Schwertfechter, Gründer von HANSI: KI-Berater für Handyverträge trotz Schufa. Mission, Expertise und Hintergrund.",
  alternates: { canonical: "https://handytrotzschufa.today/ueber-uns" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "R. Schwertfechter",
  url: "https://handytrotzschufa.today/ueber-uns",
  jobTitle: "Gründer & KI-Berater",
  worksFor: {
    "@type": "Organization",
    "@id": "https://handytrotzschufa.today/#organization",
    name: "HANSI Intelligence System",
  },
  knowsAbout: ["Mobilfunk", "Schufa", "Bonität", "Handyverträge", "KI-Beratung"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karklandsweg 1",
    addressLocality: "Dornum",
    postalCode: "26553",
    addressCountry: "DE",
  },
  email: "support@handytrotzschufa.today",
  sameAs: ["https://github.com/Schwerti09"],
};

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-[#05060f] text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white font-black text-sm">H</span></div>
            <span className="font-bold text-sm">handytrotzschufa<span className="text-indigo-400">.today</span></span>
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-black shrink-0">
            RS
          </div>
          <div>
            <p className="font-bold text-white text-lg">R. Schwertfechter</p>
            <p className="text-indigo-400 text-sm mb-2">Gründer & KI-Berater, HANSI Intelligence System</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              R. Schwertfechter ist Gründer von HANSI und spezialisiert auf KI-gestützte Beratung im
              Mobilfunkbereich. Er entwickelt Algorithmen, die Schufa-freundliche Handyverträge für
              Menschen mit negativen Einträgen zugänglich machen. Wohnhaft in Dornum, Niedersachsen.
            </p>
            <div className="flex gap-3 mt-3 text-xs text-gray-500">
              <span>Expertise: Mobilfunk, Schufa, Bonität, KI</span>
              <span>·</span>
              <a href="mailto:support@handytrotzschufa.today" className="text-indigo-400 hover:text-indigo-300">
                support@handytrotzschufa.today
              </a>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-5 tracking-wide uppercase">
            Über handytrotzschufa.today
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            Wir machen Handyverträge trotz Schufa{" "}
            <span className="text-indigo-400">endlich einfach.</span>
          </h1>
          <p className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
            HANSI ist Deutschlands erster KI-Berater, der basierend auf deiner Schufa-Situation den
            passenden Mobilfunkvertrag findet – in unter 60 Sekunden.
          </p>
        </div>

        {/* Story */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-5">Die Geschichte</h2>
          <div className="bg-white/[0.04] rounded-2xl p-6 space-y-4 text-white/70 leading-relaxed">
            <p>
              Handyvertrag-Vergleichsseiten zeigen dir 300 Angebote. Du weißt nicht, welches passt. Du klickst auf das günstigste. Es ist das falsche. Einen Monat später zahlst du für ein Netz, das in deiner Wohnung nicht funktioniert, und für 100 GB Daten, die du nie verbrauchst.
            </p>
            <p>
              Das ist der Status quo. Und er ist unnötig schlecht.
            </p>
            <p>
              handytrotzschufa.today wurde aus der Überzeugung heraus gebaut, dass ein guter Berater — einer, der wirklich zuhört — dieses Problem lösen kann. Kein Scrollen durch Listen. Kein Verwirrspiel mit Kleinstdrucktext. Stattdessen: ein Gespräch.
            </p>
            <p>
              HANSI ist das Ergebnis. Ein KI-Berater, der aus über 6.000 tagesaktuellen echten Angeboten die 3 besten für dich heraussucht — basierend auf dem, was du ihm sagst.
            </p>
          </div>
        </section>

        {/* Mission cards */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-6">Unsere Prinzipien</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "🎯", title: "Beraten statt listen", body: "HANSI trifft Entscheidungen. Er empfiehlt 3 Angebote — nicht 300. Weil weniger Auswahl bessere Entscheidungen produziert." },
              { icon: "🔒", title: "Unabhängig & neutral", body: "Provision beeinflusst keine Empfehlung. HANSIs Empfehlungen basieren auf Nutzerprofil, Preis-Leistung und Netzqualität." },
              { icon: "📊", title: "Datenbasiert", body: "Wir importieren täglich tausende echte Angebote von Sparhandy, DeinHandy, Samsung und Co. Keine veralteten Preise." },
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
              ["KI-Berater", "Google Gemini + Anthropic Claude – Streaming, Echtzeit-Antworten"],
              ["Datenbank", "PostgreSQL (Neon) – 6.000+ tagesaktuelle Angebote"],
              ["Affiliate-Netzwerke", "AWIN, CommunicationAds – direkte Feed-Integration"],
              ["Hosting", "Netlify Edge Network – globale Verfügbarkeit"],
              ["Framework", "Next.js 16 App Router – schnell, SEO-optimiert"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                <span className="text-sm font-semibold text-white/60 w-36 shrink-0">{k}</span>
                <span className="text-sm text-white/50">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kontakt */}
        <section className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-black mb-2">Kontakt</h2>
          <p className="text-white/60 text-sm mb-4">Fragen, Feedback, Kooperationsanfragen — wir freuen uns.</p>
          <a href="mailto:support@handytrotzschufa.today" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm">
            support@handytrotzschufa.today →
          </a>
          <p className="text-white/30 text-xs mt-4">R. Schwertfechter · Karklandsweg 1 · 26553 Dornum · Deutschland</p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
