import type { Metadata } from "next";
import Link from "next/link";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

const BASE = "https://welches-hundefutter.today";

export const metadata: Metadata = {
  title: "Hundefutter-Finder: In 60 Sekunden zum passenden Futter",
  description: "Der kostenlose Hundefutter-Finder: 5 Fragen zu Rasse, Alter, Gewicht und Empfindlichkeiten — BELLA vergleicht über 11.000 Sorten und empfiehlt 3 passende. Unabhängig & ohne Anmeldung.",
  alternates: {
    canonical: `${BASE}/tools/futter-finder`,
    languages: {
      "de-DE": `${BASE}/tools/futter-finder`,
      "de-AT": `${BASE}/tools/futter-finder`,
      "de-CH": `${BASE}/tools/futter-finder`,
      "x-default": `${BASE}/tools/futter-finder`,
    },
  },
  openGraph: {
    title: "Hundefutter-Finder — 5 Fragen, 3 Empfehlungen",
    description: "BELLA findet aus über 11.000 Sorten das passende Futter für deinen Hund. Kostenlos und unabhängig.",
    url: `${BASE}/tools/futter-finder`,
    type: "website",
  },
};

const SCHEMA_FAQS = [
  {
    question: "Wie funktioniert der Hundefutter-Finder?",
    answer: "BELLA stellt dir 5 kurze Fragen zu Rasse, Alter, Gewicht, Aktivität und Empfindlichkeiten deines Hundes. Daraus berechnet sie den Energiebedarf und filtert den Live-Katalog mit über 11.000 Sorten auf 3 passende Empfehlungen — inkl. Preis pro Kilo.",
  },
  {
    question: "Ist der Futter-Finder kostenlos?",
    answer: "Ja, vollständig kostenlos und ohne Anmeldung. Die Seite finanziert sich über Affiliate-Links: Kaufst du ein empfohlenes Futter über einen Link, erhalten wir eine kleine Provision — der Preis für dich bleibt gleich.",
  },
  {
    question: "Berücksichtigt der Finder Allergien?",
    answer: "Ja. Du kannst Unverträglichkeiten wie Huhn, Rind oder Getreide angeben — BELLA filtert dann auf Monoprotein- und hypoallergene Sorten ohne die kritischen Zutaten.",
  },
];

export default function FutterFinderPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BELLA Hundefutter-Finder",
    url: `${BASE}/tools/futter-finder`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: "KI-gestützter Hundefutter-Finder: 5 Fragen, Vergleich von über 11.000 Sorten, 3 individuelle Empfehlungen.",
    inLanguage: "de",
  };

  const breadcrumbs = [
    { name: "Start", url: `${BASE}/` },
    { name: "Tools", url: `${BASE}/tools` },
    { name: "Futter-Finder", url: `${BASE}/tools/futter-finder` },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <StructuredData type="faq" faqs={SCHEMA_FAQS} />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <nav className="max-w-6xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/tools" className="hover:text-[var(--honey)]">Tools</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Futter-Finder</span>
      </nav>

      <header className="max-w-6xl mx-auto w-full px-5 pt-8 pb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--honey)]">Kostenloses Tool</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Der Hundefutter-Finder: <span className="text-accent">5 Fragen, 3 Empfehlungen</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-[var(--muted)] leading-relaxed">
          BELLA vergleicht über 11.000 echte Sorten aus dem Live-Katalog und findet
          das passende Futter für Rasse, Alter, Gewicht und Empfindlichkeiten deines Hundes.
        </p>
      </header>

      <section className="px-5 pb-12">
        <BellaAdvisorWrapper />
      </section>

      <section className="max-w-6xl mx-auto w-full px-5 pb-16">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Häufige Fragen zum Futter-Finder</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {SCHEMA_FAQS.map((f) => (
            <div key={f.question} className="glass rounded-2xl p-5">
              <h3 className="font-semibold text-sm">{f.question}</h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/rassen" className="glass rounded-xl px-4 py-2.5 hover:text-[var(--honey)] transition-colors">Nach Rasse suchen →</Link>
          <Link href="/problem/allergie" className="glass rounded-xl px-4 py-2.5 hover:text-[var(--honey)] transition-colors">Futter bei Allergie →</Link>
          <Link href="/lebensphase/welpen" className="glass rounded-xl px-4 py-2.5 hover:text-[var(--honey)] transition-colors">Welpenfutter →</Link>
          <Link href="/lebensphase/senior" className="glass rounded-xl px-4 py-2.5 hover:text-[var(--honey)] transition-colors">Seniorfutter →</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
