import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "BELLA-Score: Unsere Bewertungsmethodik für Hundefutter | BELLA",
  description: "Wie BELLA Hundefutter bewertet: transparente Score-Methodik aus Proteinquelle, Getreidefreiheit, Preis-Qualität und Futtertyp. Verteidigbar, nachvollziehbar, ehrlich.",
  alternates: {
    canonical: "https://welches-hundefutter.today/analyse/methodik",
    languages: {
      "de-DE": "https://welches-hundefutter.today/analyse/methodik",
      "de-AT": "https://welches-hundefutter.today/analyse/methodik",
      "de-CH": "https://welches-hundefutter.today/analyse/methodik",
      "x-default": "https://welches-hundefutter.today/analyse/methodik",
    },
  },
};

const KRITERIEN = [
  {
    label: "Proteinquelle benannt",
    punkte: 18,
    erklaerung: "Steht ein konkretes Tier auf der Verpackung — Huhn, Lachs, Rind, Lamm, Ente? Das ist das wichtigste Qualitätssignal: ein Hersteller, der sein Protein benennt, hat nichts zu verbergen. Generische Angaben wie 'Fleisch' oder 'Tierische Nebenerzeugnisse' werden nicht gewertet.",
    beispiel: "Lachs als einzige Proteinquelle → +18 Punkte",
  },
  {
    label: "Getreidefrei",
    punkte: 12,
    erklaerung: "Kein Weizen, Mais, Gerste oder Roggen. Das ist besonders relevant für Hunde mit Getreide-Unverträglichkeiten. Getreidefrei bedeutet nicht automatisch besser — aber es zeigt, dass der Hersteller eine klar definierte Zielgruppe bedient und die Rezeptur entsprechend angepasst hat.",
    beispiel: "Keine Getreide-Zutaten → +12 Punkte",
  },
  {
    label: "Hypoallergenes Rezept",
    punkte: 10,
    erklaerung: "Das Futter verwendet eine unbekannte oder selten genutzte Proteinquelle (z. B. Insekten, Pferd, Känguru) mit dem Ziel, klassische Allergieauslöser auszuschließen. Relevant für Hunde in der Eliminationsdiät.",
    beispiel: "Insektenprotein als einzige Quelle → +10 Punkte",
  },
  {
    label: "Preis-Qualitäts-Stufe",
    punkte: 15,
    erklaerung: "Preis ist kein perfekter Qualitätsindikator — aber ein Orientierungswert. Unter 4 €/kg sind hochwertige Rohstoffe strukturell schwer darstellbar. Über 8 €/kg ist Premium-Segment, über 15 €/kg Spezialist-Segment (BARF, Kaltgepresst, Monoprotein). Wir werten: ≥15 €/kg = 15 Pkt · ≥8 €/kg = 10 Pkt · ≥4 €/kg = 5 Pkt.",
    beispiel: "12,50 €/kg → +10 Punkte",
  },
  {
    label: "Futtertyp-Bonus",
    punkte: 8,
    erklaerung: "BARF und kaltgepresstes Futter werden schonend verarbeitet und erhalten mehr Nährstoffe als extrudiertes Trockenfutter. Nassfutter hat einen hohen Feuchtigkeitsanteil, der für Nierenpatienten und wählerische Hunde wertvoll ist. Wir werten: BARF/Kaltgepresst = 8 Pkt · Nassfutter = 4 Pkt.",
    beispiel: "Kaltgepresstes Futter → +8 Punkte",
  },
];

export default function Methodik() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Bewertungsmethodik</span>
      </nav>

      <section className="max-w-4xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🔬 Transparenz</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          So bewertet BELLA Hundefutter
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-2">
          Jedes der über 11.000 Produkte in unserem Katalog bekommt einen <strong className="text-white">BELLA-Score von 28 bis 98</strong>.
          Die Formel ist öffentlich, deterministisch und basiert ausschließlich auf nachprüfbaren Produkteigenschaften.
        </p>
        <p className="text-[var(--muted)] text-sm">
          Kein Produkt zahlt für eine bessere Bewertung. Kein Score entsteht durch redaktionelle Willkür.
        </p>
      </section>

      {/* Formel-Übersicht */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Formel auf einen Blick</h2>
          <div className="font-mono text-sm text-emerald-300 bg-black/30 rounded-xl p-4 leading-loose">
            Score = 35 (Basis)<br />
            + 18 · [Protein benannt]<br />
            + 12 · [getreidefrei]<br />
            + 10 · [hypoallergen]<br />
            + 15/10/5 · [Preis ≥15/≥8/≥4 €/kg]<br />
            + 8/4 · [Typ BARF·Kalt / Nassfutter]<br />
            <span className="text-white/40">— Ergebnis: 28–98, ganzzahlig</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { label: "★ Premium", range: "75–98", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "◆ Gut", range: "55–74", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "· Basis", range: "28–54", color: "text-white/50", bg: "bg-white/5 border-white/10" },
          ].map(t => (
            <div key={t.label} className={`rounded-xl border p-4 ${t.bg}`}>
              <p className={`text-lg font-extrabold ${t.color}`}>{t.label}</p>
              <p className="text-sm text-[var(--muted)] mt-1">Score {t.range}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Die fünf Kriterien im Detail</h2>
        <div className="space-y-4">
          {KRITERIEN.map((k) => (
            <div key={k.label} className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-base font-bold">{k.label}</h3>
                <span className="text-sm font-black text-[var(--honey)] flex-shrink-0">+{k.punkte} Pkt.</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">{k.erklaerung}</p>
              <p className="text-xs text-white/40 italic">{k.beispiel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Was der Score NICHT misst */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-lg font-bold mb-3 text-amber-300">Was der Score nicht misst — und warum</h2>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>→ <strong className="text-white">Schmackhaftigkeit</strong> — ob dein Hund das Futter gerne frisst, hängt vom Individuum ab, nicht von der Rezeptur.</li>
            <li>→ <strong className="text-white">Verträglichkeit</strong> — ein hoher Score garantiert keine Verträglichkeit für jeden Hund. Allergien sind individuell.</li>
            <li>→ <strong className="text-white">Fleischanteil in %</strong> — diese Angabe ist nicht standardisiert und wird von Herstellern unterschiedlich deklariert.</li>
            <li>→ <strong className="text-white">Hersteller-Transparenz</strong> — Produktionsort, Lieferkette, Zertifizierungen sind wichtige Faktoren, die wir mangels Datenlage nicht einbeziehen.</li>
          </ul>
          <p className="text-xs text-white/30 mt-4">Der BELLA-Score ist ein Orientierungswert, kein Urteil. Für gesundheitliche Ernährungsentscheidungen immer den Tierarzt einbeziehen.</p>
        </div>
      </section>

      {/* Unabhängigkeit & Finanzierung */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="text-lg font-bold mb-3 text-emerald-300">Unabhängigkeit &amp; Finanzierung</h2>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>→ BELLA finanziert sich über <strong className="text-white">Affiliate-Provisionen</strong>: Kaufst du ein Produkt über einen unserer Links, erhalten wir eine Provision vom Händler. Der Preis für dich ändert sich dadurch nicht.</li>
            <li>→ <strong className="text-white">Die Provision fließt nicht in den Score ein.</strong> Die Formel oben ist vollständig abgebildet und enthält keine Variable für Provisionshöhe, Händler oder Marke — sie kann es technisch nicht, weil der Score per SQL über alle Produkte gleichzeitig berechnet wird.</li>
            <li>→ Hersteller können <strong className="text-white">keine Platzierungen kaufen</strong>. Es gibt keine gesponserten Empfehlungen, keine bezahlten Testsiege, keine Werbedeals mit Futtermarken.</li>
            <li>→ Empfehlungsreihenfolgen entstehen ausschließlich aus Score, Preis pro Kilo und den Angaben zum Hund (Allergien, Alter, Größe).</li>
          </ul>
        </div>
      </section>

      {/* Wissenschaftliche Grundlagen */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-3">Wissenschaftliche Grundlagen</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            Die Empfehlungslogik hinter BELLA stützt sich auf anerkannte veterinärmedizinische
            Standards und Peer-Review-Forschung — unter anderem:
          </p>
          <ul className="space-y-2 text-sm text-[var(--muted)] mb-4">
            <li>→ <strong className="text-white">NRC (2006), Nutrient Requirements of Dogs and Cats</strong> — Quelle der RER-Formel (70 × kg<sup>0,75</sup>), mit der BELLA Tagesrationen berechnet</li>
            <li>→ <strong className="text-white">FEDIAF Nutritional Guidelines</strong> — europäischer Standard für Nährstoffprofile von Alleinfuttermitteln</li>
            <li>→ <strong className="text-white">WSAVA Nutritional Assessment Guidelines</strong> — Rahmenwerk für die Ernährungsbewertung beim Hund</li>
            <li>→ <strong className="text-white">Olivry &amp; Mueller (2017)</strong> — Datenbasis für unsere Allergie-Filter (häufigste Allergene: Huhn, Rind, Milch, Weizen)</li>
          </ul>
          <p className="text-sm">
            <Link href="/quellen" className="text-[var(--honey)] hover:underline">Alle Quellen mit DOI/PubMed-Links →</Link>
          </p>
        </div>
      </section>

      {/* Offener Produktkatalog */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-3">Vollständiger Produktkatalog (offene Daten)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Jedes aktive Produkt aus unserem Katalog — Marke, Name, Futtertyp, Proteinquelle, Preis pro kg,
            BELLA-Score und Eigenschaften (getreidefrei/hypoallergen) — steht als offener,
            täglich aktualisierter Datenfeed unter CC-BY-4.0 zur Verfügung. Gedacht für
            Preisvergleiche, Forschung und KI-/Antwortmaschinen, die BELLA-Daten zitieren möchten.
          </p>
          <p className="text-sm">
            <a href="/data/catalog.json" className="text-[var(--honey)] hover:underline">Katalog als JSON →</a>
            {" · "}
            <a href="/data/catalog.json?format=csv" className="text-[var(--honey)] hover:underline">als CSV →</a>
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-16 text-center">
        <Link href="/#bella-advisor" className="btn-primary">BELLA fragen — personalisierte Empfehlung →</Link>
        <p className="text-xs text-[var(--muted)] mt-3">
          <Link href="/analyse/preisindex-2026" className="hover:text-[var(--honey)] transition-colors">Preisindex 2026 →</Link>
          {" · "}
          <Link href="/faq" className="hover:text-[var(--honey)] transition-colors">FAQ →</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "BELLA Hundefutter-Produktkatalog",
            description:
              "Vollständiger, täglich aktualisierter Katalog aller aktiven Hundefutter-Produkte bei BELLA: Marke, Name, Futtertyp, Proteinquelle, Preis pro Kilogramm, BELLA-Score, Getreidefrei-/Hypoallergen-Kennzeichnung und Partner-Link.",
            url: "https://welches-hundefutter.today/analyse/methodik",
            creator: { "@type": "Organization", "@id": "https://welches-hundefutter.today/#organization" },
            license: "https://creativecommons.org/licenses/by/4.0/",
            isAccessibleForFree: true,
            inLanguage: "de-DE",
            dateModified: new Date().toISOString().slice(0, 10),
            variableMeasured: [
              "Preis pro Kilogramm", "BELLA-Score", "Proteinquelle",
              "Getreidefrei", "Hypoallergen", "Futtertyp",
            ],
            distribution: [
              { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://welches-hundefutter.today/data/catalog.json" },
              { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://welches-hundefutter.today/data/catalog.json?format=csv" },
            ],
          }),
        }}
      />

      <SiteFooter />
    </div>
  );
}
