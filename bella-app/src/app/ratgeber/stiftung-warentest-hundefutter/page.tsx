import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Stiftung Warentest Hundefutter: Methodik, Befunde & BELLA-Vergleich",
  description:
    "Was prüft Stiftung Warentest bei Hundefutter – und was nicht? Methodik, Schadstoffe, Deklaration und wie BELLA die Lücken schließt. Der vollständige Ratgeber.",
  keywords: [
    "stiftung warentest hundefutter",
    "hundefutter test stiftung warentest",
    "stiftung warentest hundefutter 2023",
    "stiftung warentest hundefutter 2026",
    "hundefutter mineralölrückstände",
  ],
  alternates: {
    canonical: "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
    languages: {
      "de-DE": "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
      "de-AT": "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
      "de-CH": "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
      "x-default": "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
    },
  },
  openGraph: {
    title: "Stiftung Warentest Hundefutter: Was der Test zeigt – und was BELLA ergänzt",
    description:
      "Schadstoffanalyse, Deklarationsprüfung, Nährwertanalyse: Stiftung Warentest testet 50–100 Sorten. Der Markt hat 11.000+. So nutzt du beides klug.",
    type: "article",
    publishedTime: "2026-06-19",
    modifiedTime: "2026-06-19",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Stiftung Warentest Hundefutter: Methodik, Befunde und BELLA-Vergleich",
      description:
        "Was prüft Stiftung Warentest bei Hundefutter – und was bleibt unbeantwortet? Methodik, Schadstoffe, Deklaration und wie BELLA die Lücken schließt.",
      url: "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
      datePublished: "2026-06-19",
      dateModified: "2026-06-19",
      author: { "@type": "Person", name: "R. Schwertfechter" },
      publisher: {
        "@type": "Organization",
        name: "BELLA – Hundefutter Berater",
        url: "https://welches-hundefutter.today",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://welches-hundefutter.today" },
        { "@type": "ListItem", position: 2, name: "Ratgeber", item: "https://welches-hundefutter.today/ratgeber" },
        {
          "@type": "ListItem",
          position: 3,
          name: "Stiftung Warentest Hundefutter",
          item: "https://welches-hundefutter.today/ratgeber/stiftung-warentest-hundefutter",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was prüft Stiftung Warentest beim Hundefutter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Stiftung Warentest prüft Hundefutter auf Schadstoffe (Mineralölrückstände MOSH/MOAH, Pestizide, Schwermetalle), Nährwertanalyse (Ist-Werte vs. Etikettangaben), Deklarationsqualität (spezifische Fleischbenennung) und teils Schmackhaftigkeit. Tests erfolgen in akkreditierten Laboren unabhängig von Herstellern.",
          },
        },
        {
          "@type": "Question",
          name: "Wie oft testet Stiftung Warentest Hundefutter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Stiftung Warentest testet Hundefutter nicht in einem festen Rhythmus. Größere Testrunden erscheinen alle 2–4 Jahre. Den aktuellsten Stand findest du auf stiftung-warentest.de.",
          },
        },
        {
          "@type": "Question",
          name: "Was deckt Stiftung Warentest nicht ab?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Stiftung Warentest bewertet nicht, welches Futter zu einem bestimmten Hund (Rasse, Alter, Gewicht, Allergien) passt. Außerdem werden nur 50–100 Produkte pro Test geprüft – der Markt hat über 11.000. Aktuelle Preise und Rezepturänderungen nach dem Test sind ebenfalls nicht erfasst.",
          },
        },
        {
          "@type": "Question",
          name: "Wie ergänzt BELLA den Stiftung Warentest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "BELLA filtert aus über 11.000 tagesaktuellen Produkten die passenden Empfehlungen nach Rasse, Alter, Gewicht, Allergien und Budget. StiWa sagt, welche Produkte sicher sind; BELLA sagt, welches davon zu deinem Hund passt. Beide kombiniert ergeben die beste Entscheidungsgrundlage.",
          },
        },
      ],
    },
  ],
};

const STIWA_CRITERIA = [
  { label: "Schadstoffanalyse", detail: "MOSH/MOAH, Pestizide, Schwermetalle, Mykotoxine im akkreditierten Labor" },
  { label: "Nährwertanalyse", detail: "Rohprotein, Rohfett, Rohfaser, Feuchtigkeit – Ist-Wert vs. Etikettangabe" },
  { label: "Deklarationsqualität", detail: "Reihenfolge, Spezifität der Fleischbenennung, Zulässigkeit von Werbeaussagen" },
  { label: "Sensorik & Akzeptanz", detail: "Schmackhaftigkeit durch Hundepanels (nicht immer Bestandteil)" },
];

const BELLA_CRITERIA = [
  { label: "Rassepassung", detail: "186 Rassen mit spezifischen Ernährungsanforderungen – von Bulldog bis Greyhound" },
  { label: "Alters- & Gewichtsbedarf", detail: "Welpe, Adult, Senior – Kalorienbedarf nach RER-Formel + Aktivitätsfaktor" },
  { label: "Allergie-Filterung", detail: "Monoprotein, getreidefrei, hypoallergen – auf Basis deiner Angaben" },
  { label: "Echtzeit-Preise", detail: "Tagesaktuell aus AWIN-Feeds – kein Testdatum-Problem, kein veralteter Preis" },
  { label: "BELLA-Score", detail: "Deklarationsqualität, Fleischanteil, Verarbeitungstyp, Preis-Leistung – transparent" },
  { label: "Katalogbreite", detail: "11.000+ Produkte – nicht 50–100. Das ist der entscheidende Unterschied" },
];

const KEY_FINDINGS = [
  {
    icon: "🔬",
    title: "Mineralölrückstände",
    text: "MOSH/MOAH wurden in mehreren getesteten Produkten nachgewiesen. Für Heimtierfutter gibt es noch keine EU-Grenzwerte – externe Tests sind derzeit die einzige Kontrollinstanz.",
  },
  {
    icon: "📋",
    title: "Deklarations-Schwachstelle",
    text: `Viele Produkte nutzen erlaubte Sammelbegriffe wie „Fleisch und tierische Nebenerzeugnisse“. Das erschwert Qualitätsvergleiche und ist für Allergiker problematisch.`,
  },
  {
    icon: "💰",
    title: "Preis ≠ Qualität",
    text: "Ab ca. 6–9 €/kg Trockenfutter entkoppelt sich die Preis-Qualitäts-Korrelation. Im Mittelsegment entscheiden Deklaration und Rohstoffqualität – nicht der Markenname.",
  },
  {
    icon: "📉",
    title: "Nur 1 % des Markts",
    text: "50–100 Produkte pro Test. Über 11.000 aktive Produkte am Markt. Die überwiegende Mehrheit wurde nie getestet – darunter viele hervorragende Alternativen.",
  },
];

const FAQS = [
  {
    question: "Kann ich den Stiftung Warentest Hundefutter-Test kostenlos lesen?",
    answer:
      "Der vollständige Testbericht erfordert ein Abonnement oder einen Einzelkauf auf stiftung-warentest.de. Kostenlos abrufbar sind meist die Testübersicht und eine Zusammenfassung der wichtigsten Befunde – das reicht für die Kernentscheidungen.",
  },
  {
    question: "Was bedeutet \"Mangelhaft\" im Hundefutter-Test?",
    answer:
      `Ein Mangelhaft ist ein ernstes Signal: Es deutet auf schwerwiegende Inhaltsstoffabweichungen, unzulässige Werbeaussagen oder tatsächliche Schadstoffbelastung hin. Solche Produkte solltest du konsequent meiden. Ein „Befriedigend“ dagegen ist kein Notfall – oft liegt nur eine Deklarationsschwäche vor.`,
  },
  {
    question: "Was ist nach einem schlechten StiWa-Ergebnis zu tun?",
    answer:
      "Nicht sofort und abrupt wechseln – das verursacht Magenbeschwerden. Bewerte zunächst den Schweregrad. Bei ernstem Befund (Mangelhaft, Schadstoffbelastung): über 7–10 Tage schrittweise auf eine Alternative umstellen. BELLA hilft dir, aus über 11.000 Optionen die passende zu finden.",
  },
  {
    question: "Wie aktuell sind StiWa-Testergebnisse?",
    answer:
      "Hersteller dürfen Rezepturen ändern, ohne den Produktnamen zu ändern. Ein Test aus 2023 spiegelt möglicherweise nicht die Rezeptur von 2026 wider. Nutze aktuelle Futterforen und Verbraucher-Rezensionen als Ergänzung, um Rezepturänderungen zu erkennen.",
  },
];

export default function StiftungWarentestRatgeberPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <span className="hover:text-gray-300">Ratgeber</span>
          <span className="mx-2">›</span>
          <span className="text-gray-300">Stiftung Warentest Hundefutter</span>
        </nav>

        {/* Hero */}
        <header className="mb-14">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <span>Von <Link href="/ueber-uns" className="text-indigo-400 hover:text-indigo-300">R. Schwertfechter</Link></span>
            <span>·</span>
            <time dateTime="2026-06-19">19. Juni 2026</time>
            <span>·</span>
            <span>13 Min. Lesezeit</span>
            <span>·</span>
            <span className="text-green-500">✓ Geprüft</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Stiftung Warentest Hundefutter:<br />
            <span className="text-indigo-400">Was der Test zeigt – und was er nicht beantwortet</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Stiftung Warentest ist Deutschlands verlässlichste Testinstanz – und testet Hundefutter auf Schadstoffe,
            Deklaration und Nährwerte. Aber 50–100 getestete Sorten stehen 11.000+ Produkten am Markt gegenüber.
            Wie du beides klug kombinierst, erklärt dieser Ratgeber.
          </p>
        </header>

        {/* Was StiWa testet vs. was BELLA kennt — zwei Spalten */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">Zwei verschiedene Fragen – zwei verschiedene Antworten</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* StiWa Spalte */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔬</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Stiftung Warentest fragt</p>
                  <p className="font-semibold text-white">„Ist dieses Produkt sicher?"</p>
                </div>
              </div>
              <ul className="space-y-3">
                {STIWA_CRITERIA.map((c) => (
                  <li key={c.label} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-indigo-300 mb-0.5">{c.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-600 italic">Testet 50–100 Produkte pro Runde · Akkreditierte Labore · Unabhängig finanziert</p>
            </div>

            {/* BELLA Spalte */}
            <div className="bg-gray-900 rounded-xl p-6 border border-indigo-900/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐾</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">BELLA fragt</p>
                  <p className="font-semibold text-white">„Welches passt zu meinem Hund?"</p>
                </div>
              </div>
              <ul className="space-y-3">
                {BELLA_CRITERIA.map((c) => (
                  <li key={c.label} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-indigo-300 mb-0.5">{c.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-600 italic">11.000+ Produkte · Tagesaktuell · Persönlich auf deinen Hund zugeschnitten</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 text-center">
            StiWa kommt zuerst: Negativfilter. BELLA kommt danach: personalisierte Auswahl. Beides zusammen ist die klügste Strategie.
          </p>
        </section>

        {/* Notenskala */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">Die StiWa-Notenskala erklärt</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-3 text-left border border-gray-700 text-gray-300">Note</th>
                  <th className="px-4 py-3 text-left border border-gray-700 text-gray-300">Bezeichnung</th>
                  <th className="px-4 py-3 text-left border border-gray-700 text-gray-300">Was das bedeutet</th>
                  <th className="px-4 py-3 text-left border border-gray-700 text-gray-300">Deine Reaktion</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  ["1,5 und besser", "Sehr gut", "Überdurchschnittlich in allen Kriterien", "Behalte es auf dem Radar"],
                  ["1,6 – 2,5", "Gut", "Solide Leistung, geringfügige Schwächen", "Solide Wahl"],
                  ["2,6 – 3,5", "Befriedigend", "Deutliche Schwächen, kein schwerwiegender Mangel", "Kritisch prüfen"],
                  ["3,6 – 4,5", "Ausreichend", "Erhebliche Mängel, aber nicht gefährlich", "Besser ersetzen"],
                  ["4,6+", "Mangelhaft", "Schadstoffe, Täuschung oder schwere Mängel", "Sofort vermeiden"],
                ].map(([note, name, desc, action]) => (
                  <tr key={note} className="border-b border-gray-800">
                    <td className="px-4 py-3 border border-gray-700 font-mono text-white">{note}</td>
                    <td className="px-4 py-3 border border-gray-700 font-medium">{name}</td>
                    <td className="px-4 py-3 border border-gray-700">{desc}</td>
                    <td className="px-4 py-3 border border-gray-700 text-indigo-400 text-xs font-medium">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Findings */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-2">Was unabhängige Hundefutter-Tests zeigen</h2>
          <p className="text-gray-500 text-sm mb-6">Generelle Befunde aus externen Testberichten – kein spezifisches Produkt, keine kopierten Testtabellen.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {KEY_FINDINGS.map((f) => (
              <div key={f.title} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-white mb-1">{f.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* So nutzt du beides */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">Der kluge 4-Schritte-Ansatz</h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "StiWa-Test aufrufen",
                desc: `stiftung-warentest.de → Suche "Hundefutter" → aktuellsten Test öffnen. Kostenlose Kurzübersicht reicht für die wichtigsten Entscheidungen.`,
              },
              {
                step: "2",
                title: "Negativliste erstellen",
                desc: `Produkte mit "Mangelhaft" oder bekannten Schadstoffbefunden notierst du als Ausschluss. Das ist dein Sicherheitsfilter.`,
              },
              {
                step: "3",
                title: "Testdatum beachten",
                desc: "Ein Test aus 2023 deckt möglicherweise Rezepturänderungen bis heute nicht ab. Futterforen und aktuelle Rezensionen geben Hinweise.",
              },
              {
                step: "4",
                title: "BELLA für die Auswahl nutzen",
                desc: "Jetzt kommt BELLA: Rasse, Alter, Gewicht, Allergien, Budget eingeben – und BELLA filtert aus 11.000+ Produkten die drei besten heraus, mit tagesaktuellen Preisen.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{s.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BELLA CTA */}
        <section className="mb-14 bg-indigo-900/30 rounded-2xl p-8 text-center border border-indigo-800/40">
          <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2">Schritt 4 – jetzt</p>
          <h2 className="text-2xl font-bold text-white mb-3">
            BELLA kennt über 11.000 Sorten.<br />
            Welche passt zu deinem Hund?
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Rasse, Alter, Gewicht, Allergien, Budget – BELLA fragt 5 Dinge und empfiehlt in 60 Sekunden
            die drei besten Sorten mit Tagespreisen. Kostenlos.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
          >
            Jetzt BELLA fragen →
          </Link>
          <p className="text-xs text-gray-600 mt-4">Kein Account erforderlich · Keine versteckten Kosten</p>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">Häufige Fragen</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.question} className="bg-gray-900 rounded-xl group border border-gray-800">
                <summary className="flex justify-between items-start cursor-pointer list-none px-5 py-4">
                  <span className="font-semibold text-white text-sm pr-4">{faq.question}</span>
                  <span className="text-gray-500 mt-0.5 shrink-0 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Weiterführende Links */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Weiterführende Ratgeber</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                href: "/blog/stiftung-warentest-hundefutter",
                title: "Stiftung Warentest Hundefutter – Der vollständige Blog-Artikel",
                sub: "13 Min. · Methodik, Befunde, BELLA-Vergleich im Detail",
              },
              {
                href: "/blog/hundefutter-test-2026",
                title: "BELLA Hundefutter Test 2026: Score-Ranking für 8.442 Sorten",
                sub: "9 Min. · BELLA-Score-Methodik, Kategoriensieger, Preisanalyse",
              },
              {
                href: "/blog/hundefutter-allergie-hund",
                title: "Hundefutter bei Allergie: Was wirklich hilft",
                sub: "9 Min. · Eliminationsdiät, Monoprotein, häufige Auslöser",
              },
              {
                href: "/blog/barf-hund-anfaenger",
                title: "BARF für Anfänger: Die komplette Anleitung",
                sub: "11 Min. · Zusammensetzung, Portionen, Hygiene, Einstieg",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block bg-gray-900 hover:bg-gray-800 rounded-xl p-4 transition-colors border border-gray-800"
              >
                <p className="text-white font-medium text-sm mb-1 leading-snug">{l.title}</p>
                <p className="text-gray-500 text-xs">{l.sub}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
