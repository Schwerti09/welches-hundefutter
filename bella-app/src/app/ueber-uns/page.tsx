import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Über BELLA: Wir sind kein Affiliate-Vergleich. Wir sind ein Berater.",
  description:
    "Rolf Schwertfechter & BELLA — warum wir anders sind als 10.000 andere Hundefutter-Seiten. Kein Vergleich nach Provision. Nur das Wohl deiner Fellnase zählt.",
  alternates: {
    canonical: "https://welches-hundefutter.today/ueber-uns",
    languages: {
      "de-DE": "https://welches-hundefutter.today/ueber-uns",
      "de-AT": "https://welches-hundefutter.today/ueber-uns",
      "de-CH": "https://welches-hundefutter.today/ueber-uns",
      "x-default": "https://welches-hundefutter.today/ueber-uns",
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://welches-hundefutter.today/#person-rolf-schwertfechter",
  name: "Rolf Schwertfechter",
  alternateName: "Rolf Peter Schwertfechter",
  url: "https://welches-hundefutter.today/ueber-uns",
  jobTitle: "Gründer, KI-Entwickler & Hundefutter-Analyst",
  worksFor: { "@id": "https://welches-hundefutter.today/#organization" },
  knowsAbout: ["Hundeernährung", "Tiergesundheit", "Hundefutter-Analyse", "KI-Beratungssysteme"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karklandsweg 1",
    addressLocality: "Dornum",
    postalCode: "26553",
    addressCountry: "DE",
  },
  email: "support@welches-hundefutter.today",
  sameAs: [
    "https://github.com/Schwerti09",
    "https://www.linkedin.com/in/r-peter-schwertfechter-4a750a416/",
  ],
};

const STUDIEN_HIGHLIGHTS = [
  {
    zitat: "Häufigste Nahrungsmittelallergene beim Hund: Huhn (34 %), Rind (17 %), Milchprodukte (17 %).",
    quelle: "Olivry & Mueller, BMC Vet Res, 2017",
    pmid: "28222786",
    url: "https://pubmed.ncbi.nlm.nih.gov/28222786/",
  },
  {
    zitat: "Omega-3-Supplementierung verbesserte Gangqualität und reduzierte Lahmheiten bei osteoarthritischen Hunden signifikant.",
    quelle: "Roush et al., JAVMA, 2010",
    pmid: "20044875",
    url: "https://pubmed.ncbi.nlm.nih.gov/20044875/",
  },
  {
    zitat: "EPI betrifft 1–2 % aller Deutschen Schäferhunde; klinisches Bild: Heißhunger mit Gewichtsverlust.",
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
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <JsonLd data={personSchema} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Über uns</span>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-5 py-10 w-full">

        {/* Das Manifest — ganz oben */}
        <section className="hero-glow mb-14 pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-6">
            ⚠️ Was hier niemand sonst sagt
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl leading-tight">
            Wir sind nicht wie 10.000 andere Hundefutter-Seiten.{" "}
            <span className="text-[var(--honey)]">Absichtlich nicht.</span>
          </h1>
          <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mb-6">
            Die meisten Hundefutter-Vergleiche sortieren nach Provision. Was oben steht,
            zahlt am besten — nicht was das beste Futter für deinen Hund ist.
            Fake-Tests. Empfehlungen für Abos weil Abos wiederkehrende Provisionen bringen.
            Kein Wort über die Fellnase selbst.
          </p>
          <p className="text-white font-bold text-lg leading-relaxed max-w-2xl mb-8">
            BELLA macht das Gegenteil: Wir beginnen mit deinem Hund.
            Rasse, Alter, Gewicht, Allergien. Dann erst suchen wir aus 11.065 Produkten —
            gefiltert nach echten Qualitätskriterien, nicht nach Provision.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/warum-bella" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Das vollständige Manifest lesen →
            </Link>
            <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm hover:border-[rgba(240,167,60,0.4)] transition-all">
              🐕 BELLA jetzt fragen
            </Link>
          </div>
        </section>

        {/* Wer wir sind */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Wer steckt hinter BELLA</h2>
          <div className="card p-6 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-base font-black shrink-0 text-white">
              RS
            </div>
            <div>
              <p className="font-extrabold text-white text-lg">Rolf Schwertfechter</p>
              <p className="text-[var(--honey)] text-sm mb-4">Gründer, KI-Entwickler & Hundefutter-Analyst · Dornum, Deutschland</p>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
                Ich habe BELLA entwickelt, weil ich selbst verstehen wollte, was in Hundefutter steckt —
                und keine Antwort gefunden habe, der ich vertrauen konnte. Jeder "Test" hatte Affiliate-Links.
                Jede "Empfehlung" war eine bezahlte Platzierung. Also habe ich den einzigen Weg gewählt,
                der mir sinnvoll erschien: Einen Algorithmus bauen, der Marken-neutral bewertet.
                Täglich. Für alle 11.065 Produkte, die im DACH-Markt aktiv gelistet sind.
              </p>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
                Das Ergebnis ist BELLA — benannt nach meiner eigenen Hündin. Sie hat nie gewählt,
                was sie frisst. Wir wählen für sie. Das ist eine Verantwortung, die mir wichtig ist.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <a href="mailto:support@welches-hundefutter.today" className="text-[var(--honey)] hover:underline">
                  support@welches-hundefutter.today
                </a>
                <span className="text-[var(--muted)]">·</span>
                <Link href="/quellen" className="text-[var(--honey)] hover:underline">Studienquellen →</Link>
                <span className="text-[var(--muted)]">·</span>
                <Link href="/analyse/methodik" className="text-[var(--honey)] hover:underline">Score-Methodik →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Was BELLA ist und nicht ist */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Was BELLA ist — und was nicht</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">BELLA ist NICHT</p>
              <ul className="space-y-3">
                {[
                  "Ein Affiliate-Vergleich der nach Provision sortiert",
                  "Ein \"Test\" ohne Lab und ohne transparente Methodik",
                  "Eine Werbeplattform für Marken wie Josera oder FRESSNAPF",
                  "Eine statische Liste, die einmal im Jahr aktualisiert wird",
                  "Ein Abo-Pusher der wiederkehrende Provisionen maximiert",
                  "Ein Berater, dem das Wohl der Fellnase egal ist",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                    <span className="text-red-400 shrink-0">✗</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">BELLA IST</p>
              <ul className="space-y-3">
                {[
                  "Ein algorithmischer Berater mit transparenter Methodik",
                  "11.065 Produkte bewertet nach 4 messbaren Kriterien",
                  "Täglich aktualisierte Preise — kein 6 Monate alter Preisvergleich",
                  "Personalisiert auf deinen Hund: Rasse, Alter, Allergien",
                  "Affiliate-Provisionen offen kommuniziert, Einfluss auf Empfehlung: null",
                  "Empathisch — weil eine Fellnase nicht selbst wählen kann",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                    <span className="text-emerald-400 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Zahlen */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Zahlen, die für uns sprechen</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: "11.065", label: "bewertete Produkte", sub: "täglich aktualisiert" },
              { value: "0", label: "gekaufte Platzierungen", sub: "Algorithmus entscheidet" },
              { value: "16+", label: "peer-reviewed Quellen", sub: "alle mit DOI/PubMed" },
              { value: "186", label: "Rassen-Steckbriefe", sub: "mit echten Fotos" },
            ].map((k) => (
              <div key={k.label} className="card p-4 text-center">
                <p className="text-2xl font-black text-[var(--honey)]">{k.value}</p>
                <p className="text-xs font-bold text-white mt-1">{k.label}</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prinzipien */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Die Prinzipien hinter BELLA</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🎯",
                title: "Das Wohl der Fellnase zuerst",
                body: "Jede Entscheidung beginnt mit der Frage: Was braucht dieser Hund? Nicht: Was bringt die höchste Provision? Das klingt selbstverständlich — es ist es in dieser Branche nicht.",
              },
              {
                icon: "🔍",
                title: "Volle Transparenz über die Methodik",
                body: "Der BELLA Score ist dokumentiert, auditierbar, veröffentlicht. Kein Geheimnis. Weil wer die Wahrheit sagt, sie nicht verstecken muss.",
              },
              {
                icon: "🤝",
                title: "Ehrlichkeit über Provisionen",
                body: "Wir verdienen Geld durch Affiliate-Provisionen — das sagen wir laut. Aber wir sagen auch: Sie beeinflussen keine Empfehlung. Das ist der Unterschied.",
              },
              {
                icon: "🐕",
                title: "Empathie statt Conversion-Optimierung",
                body: "BELLA fragt nach. Hört zu. Sagt auch: Kein perfektes Futter gefunden — hier sind die besten Kompromisse. Das kostet manchmal einen Klick. Es gewinnt Vertrauen.",
              },
              {
                icon: "📊",
                title: "Daten statt Meinungen",
                body: "11.065 Produkte. Täglich aktuell. Kein redaktionelles Bauchgefühl, keine bezahlte Meinung. Nur Daten — und ein Algorithmus, der sie auswertet.",
              },
              {
                icon: "🚫",
                title: "Keine Heilversprechen",
                body: "Futter kann Erkrankungen unterstuetzen, nicht heilen. Alle Formulierungen auf BELLA sind klinisch korrekt: 'kann unterstuetzen', nicht 'heilt'.",
              },
            ].map((c) => (
              <div key={c.title} className="card p-5">
                <div className="flex gap-3">
                  <span className="text-2xl shrink-0">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1.5">{c.title}</h3>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wissenschaftliche Basis */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Wissenschaftliche Grundlage</h2>
          <p className="text-[var(--muted)] text-sm mb-6">
            Alle Gesundheitsratgeber basieren auf peer-reviewed Studien aus JAVMA, BMC Vet Res, JVIM
            und Leitlinien von WSAVA, IRIS und ESVCN. Vollständige Quellenübersicht:{" "}
            <Link href="/quellen" className="text-[var(--honey)] hover:underline">/quellen →</Link>
          </p>
          <div className="space-y-4">
            {STUDIEN_HIGHLIGHTS.map((s) => (
              <blockquote
                key={s.quelle}
                className="card p-5 border-l-4 border-[rgba(240,167,60,0.4)]"
              >
                <p className="text-sm text-white leading-relaxed mb-3 italic">
                  &ldquo;{s.zitat}&rdquo;
                </p>
                <footer className="flex items-center gap-3 text-xs text-[var(--muted)]">
                  <span>{s.quelle}</span>
                  {(s.pmid ?? s.url) && (
                    <a
                      href={s.url ?? `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--honey)] hover:underline"
                    >
                      {s.pmid ? `PubMed ${s.pmid}` : "Quelle →"}
                    </a>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Technologie */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Technologie</h2>
          <div className="card p-6 space-y-3">
            {[
              ["KI-Beraterin BELLA", "Gemini 2.5 Flash + Claude Haiku 4.5 — Streaming, Echtzeit, Kontextgedächtnis"],
              ["BELLA Score", "Proprietäres Scoring (4 Kriterien) — dokumentiert auf /analyse/methodik"],
              ["Datenbank", "PostgreSQL (Neon Serverless) — 11.065+ Produkte, täglich via AWIN-Feed"],
              ["Affiliate-Netzwerk", "AWIN (a=615299) — Feed-Integration, kein On-Load-Tracking-Pixel"],
              ["Hosting", "Netlify Edge — Next.js ISR, Live-Daten täglich neu gerendert"],
              ["Preis-Wecker", "Double-Opt-In E-Mail — kein Spam, kein PII-Missbrauch"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4 py-2 border-b border-white/5 last:border-0">
                <span className="text-xs font-semibold text-[var(--muted)] w-36 shrink-0 mt-0.5">{k}</span>
                <span className="text-xs text-[var(--muted)]">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kontakt */}
        <section className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-7 text-center">
          <h2 className="text-xl font-extrabold tracking-tight mb-2">Kontakt & Feedback</h2>
          <p className="text-[var(--muted)] text-sm mb-5">
            Fragen zur Methodik, Kooperationsanfragen, Korrekturen, Tierarzt-Kooperationen —
            wir freuen uns über echten Austausch.
          </p>
          <a
            href="mailto:support@welches-hundefutter.today"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            support@welches-hundefutter.today →
          </a>
          <p className="text-[var(--muted)] text-xs mt-4">
            Rolf Schwertfechter · Karklandsweg 1 · 26553 Dornum · Deutschland
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
