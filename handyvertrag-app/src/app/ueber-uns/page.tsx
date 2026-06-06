import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Über BELLA & Rolf Schwertfechter | Expertise, Methodik & Quellen",
  description: "Rolf Schwertfechter, Gründer von BELLA — KI-Ernährungsberaterin für Hunde. Über 8.442 analysierte Futtersorten, BELLA-Score-Methodik, peer-reviewed Quellen und vollständige Transparenz.",
  alternates: { canonical: "https://welches-hundefutter.today/ueber-uns" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rolf Schwertfechter",
  url: "https://welches-hundefutter.today/ueber-uns",
  jobTitle: "Gründer, KI-Entwickler & Hundefutter-Analyst",
  worksFor: {
    "@type": "Organization",
    "@id": "https://welches-hundefutter.today/#organization",
    name: "welches-hundefutter.today",
  },
  knowsAbout: [
    "Hundeernährung",
    "Tiergesundheit",
    "Hundefutter-Analyse",
    "Ernaehrungswissenschaft Kleintiere",
    "KI-Beratungssysteme",
    "AWIN Affiliate-Feeds",
  ],
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

const CREDENTIALS = [
  {
    icon: "📊",
    title: "8.442 analysierte Futtersorten",
    body: "Taegliche Auswertung von AWIN-Feeds. Jede Sorte wird anhand von Proteinquelle, Deklarationsguete, Zutatenreihenfolge und Preis-Leistung bewertet.",
  },
  {
    icon: "🔬",
    title: "Wissenschaftsbasierte Ratgeber",
    body: "Alle Gesundheitsratgeber auf dieser Seite stuetzen sich auf peer-reviewed Studien aus Fachzeitschriften wie JAVMA, BMC Vet Res, JVIM und auf Leitlinien von WSAVA, IRIS und ESVCN.",
  },
  {
    icon: "🐕",
    title: "Rassen-spezifisches Expertenwissen",
    body: "54 Rasse-Steckbriefe mit klinisch relevanten Ernaehrungshinweisen. Quellen: rassenspezifische Genetikstudien, Prevalenzdaten zu Erbkrankheiten und tieraerztliche Standardwerke.",
  },
  {
    icon: "🔒",
    title: "Vollstaendige Transparenz",
    body: "Alle verwendeten Studien sind auf der Quellenseite mit DOI und PubMed-ID veroeffentlicht. Die Score-Methodik ist vollstaendig dokumentiert und auditierbar.",
  },
  {
    icon: "⚖️",
    title: "Redaktionelle Unabhaengigkeit",
    body: "Affiliate-Provisionen beeinflussen keine Empfehlung. BELLAs Score basiert ausschliesslich auf Inhaltsstoff- und Preis-Faktoren — nicht auf Kooperationen oder Werbebudgets.",
  },
  {
    icon: "📅",
    title: "Aktualitaet",
    body: "Preisdaten werden taeglich ueber AWIN-Feeds aktualisiert. Ratgeber werden regelmaessig auf Uebereinstimmung mit aktuellem Forschungsstand geprueft.",
  },
];

const STUDIEN_HIGHLIGHTS = [
  {
    zitat: "Haeufigste Nahrungsmittelallergene beim Hund: Huhn (34 %), Rind (17 %), Milchprodukte (17 %).",
    quelle: "Olivry & Mueller, BMC Vet Res, 2017",
    pmid: "28222786",
    url: "https://pubmed.ncbi.nlm.nih.gov/28222786/",
  },
  {
    zitat: "Omega-3-Supplementierung verbesserte Gangqualitaet und reduzierte Lahmheiten bei osteoarthritischen Hunden signifikant.",
    quelle: "Roush et al., JAVMA, 2010",
    pmid: "20044875",
    url: "https://pubmed.ncbi.nlm.nih.gov/20044875/",
  },
  {
    zitat: "EPI betrifft 1-2 % aller Deutschen Schaeferhunde; klinisches Bild: Heisshunger mit Gewichtsverlust.",
    quelle: "Westermarck & Wiberg, Topics Companion Anim Med, 2012",
    pmid: "23415383",
    url: "https://pubmed.ncbi.nlm.nih.gov/23415383/",
  },
  {
    zitat: "Ab CKD-Stadium 2 empfehlen die IRIS-Leitlinien explizit Phosphatrestriktion im Futter.",
    quelle: "IRIS Consensus Guidelines, 2023",
    url: "http://www.iris-kidney.com/guidelines/staging.html",
  },
];

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

        {/* Autor-Box */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-10 flex items-start gap-5 border border-white/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl font-black shrink-0">
            RS
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-lg">Rolf Schwertfechter</p>
            <p className="text-orange-400 text-sm mb-3">Gründer, KI-Entwickler & Hundefutter-Analyst</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Rolf Schwertfechter entwickelt seit 2024 BELLA — die erste deutschsprachige KI-Ernährungsberaterin
              für Hunde. Er analysiert täglich über 8.000 Futtersorten aus dem AWIN-Feed und hat den
              BELLA-Score entwickelt, der Proteinquelle, Deklarationsqualität und Preis-Leistung kombiniert.
              Alle Ratgeber basieren auf peer-reviewed Studien aus internationalen Fachzeitschriften.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <a href="mailto:support@welches-hundefutter.today" className="text-orange-400 hover:text-orange-300 transition-colors">
                support@welches-hundefutter.today
              </a>
              <span className="text-gray-600">·</span>
              <Link href="/quellen" className="text-orange-400 hover:text-orange-300 transition-colors">
                Alle Studienquellen →
              </Link>
              <span className="text-gray-600">·</span>
              <Link href="/analyse/methodik" className="text-orange-400 hover:text-orange-300 transition-colors">
                Score-Methodik →
              </Link>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-5 tracking-wide uppercase">
            EEAT — Expertise · Autorität · Vertrauen
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            Evidenzbasierte Beratung.{" "}
            <span className="text-orange-400">Kein Bauchgefühl.</span>
          </h1>
          <p className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
            Jede Empfehlung auf welches-hundefutter.today basiert auf Studien, nicht auf
            Marketingversprechen. 8.442 Sorten. 16+ peer-reviewed Quellen. Vollständige Transparenz.
          </p>
        </div>

        {/* Kennzahlen */}
        <section className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "8.442", label: "Futtersorten analysiert" },
              { value: "16+", label: "peer-reviewed Studien" },
              { value: "54", label: "Rassen-Steckbriefe" },
              { value: "14", label: "Gesundheitsratgeber" },
            ].map((k) => (
              <div key={k.label} className="bg-white/[0.04] rounded-2xl p-5 text-center border border-white/10">
                <p className="text-3xl font-black text-orange-400 mb-1">{k.value}</p>
                <p className="text-xs text-white/50">{k.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expertise & Credentials */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-6">Expertise & Arbeitsweise</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {CREDENTIALS.map((c) => (
              <div key={c.title} className="bg-white/[0.04] rounded-2xl p-5 border border-white/10">
                <div className="text-2xl mb-3">{c.icon}</div>
                <h3 className="font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Studien-Highlights */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-2">Auszug aus den verwendeten Studien</h2>
          <p className="text-white/50 text-sm mb-6">
            Die vollständige Quellenübersicht mit DOI und PubMed-IDs:{" "}
            <Link href="/quellen" className="text-orange-400 hover:text-orange-300">
              /quellen →
            </Link>
          </p>
          <div className="space-y-4">
            {STUDIEN_HIGHLIGHTS.map((s) => (
              <blockquote key={s.quelle} className="bg-white/[0.04] rounded-2xl p-5 border-l-4 border-orange-500/50 border border-white/10">
                <p className="text-sm text-white/80 leading-relaxed mb-3 italic">
                  &ldquo;{s.zitat}&rdquo;
                </p>
                <footer className="flex items-center gap-3 text-xs text-white/40">
                  <span>{s.quelle}</span>
                  {(s.pmid || s.url) && (
                    <a
                      href={s.url ?? `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      {s.pmid ? `PubMed ${s.pmid}` : "Quelle ansehen"} →
                    </a>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Prinzipien */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-6">Redaktionelle Prinzipien</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: "🎯",
                title: "Beraten statt listen",
                body: "BELLA trifft Entscheidungen. Sie empfiehlt 3 Futtersorten — nicht 300. Weil weniger Auswahl bessere Entscheidungen produziert.",
              },
              {
                icon: "⚖️",
                title: "Affiliate-Transparenz",
                body: "Wir verdienen Geld durch Affiliate-Provisionen. Das ist klar gekennzeichnet (rel=sponsored). Dein Preis aendert sich dadurch nie. Provision beeinflusst keine Empfehlung.",
              },
              {
                icon: "🚫",
                title: "Keine Heilversprechen",
                body: "Futter kann Erkrankungen unterstuetzen, nicht heilen. Alle Formulierungen auf dieser Seite sind klinisch korrekt: 'kann unterstuetzen', nicht 'heilt'.",
              },
              {
                icon: "📅",
                title: "Aktualitaet",
                body: "Preisdaten taeglich aktualisiert. Ratgeber werden regelmaessig auf Uebereinstimmung mit aktuellem Forschungsstand geprueft. Letzte vollstaendige Ueberpruefung: Juni 2026.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white/[0.04] rounded-2xl p-5 border border-white/10">
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
              ["KI-Beraterin BELLA", "Google Gemini 2.5 Flash + Anthropic Claude Haiku 4.5 — Streaming, Echtzeit, Kontextgedaechtnis"],
              ["BELLA-Score", "Proprietaeres Scoring-System — Protein, Deklaration, Preis. Dokumentiert auf /analyse/methodik"],
              ["Datenbank", "PostgreSQL (Neon Serverless) — 8.442 Futtersorten aus AWIN-Feed, taeglich aktualisiert"],
              ["Affiliate-Netzwerk", "AWIN (a=615299) — direkte Feed-Integration, kein Tracking-Pixel, keine PII"],
              ["Hosting", "Netlify Edge Network — SSG + Serverless Functions, globale CDN-Auslieferung"],
              ["Framework", "Next.js 16 App Router (TypeScript, Tailwind v4) — Core Web Vitals optimiert"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                <span className="text-sm font-semibold text-white/60 w-44 shrink-0">{k}</span>
                <span className="text-sm text-white/50">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kontakt */}
        <section className="bg-gradient-to-r from-orange-600/20 to-orange-400/20 border border-orange-500/30 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-black mb-2">Kontakt & Kooperation</h2>
          <p className="text-white/60 text-sm mb-4">
            Fragen zu Methodik, Tierarzt-Kooperation, Korrekturen oder Feedback — wir freuen uns.
          </p>
          <a
            href="mailto:support@welches-hundefutter.today"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm"
          >
            support@welches-hundefutter.today →
          </a>
          <p className="text-white/30 text-xs mt-4">
            Rolf Schwertfechter · Karklandsweg 1 · 26553 Dornum · Deutschland
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
