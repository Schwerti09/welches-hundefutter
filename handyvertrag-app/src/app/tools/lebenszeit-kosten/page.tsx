import type { Metadata } from "next";
import Link from "next/link";
import { BREEDS } from "@/data/breeds";
import { getAvgPricePerKgDry } from "@/db/queries/foods";
import LifetimeCostCalculator, { type SlimBreed } from "@/components/LifetimeCostCalculator";
import WebMcpTools from "@/components/WebMcpTools";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;
const BASE = "https://welches-hundefutter.today";

export const metadata: Metadata = {
  title: "Was kostet ein Hund? Lebenszeit-Kosten-Rechner (2026)",
  description: "Was kostet dich dein Hund – ein Leben lang? Der kostenlose Rechner schätzt aus echten Futterpreisen, Rasse-Gewicht und Lebenserwartung die gesamten Futterkosten. Mit Rangliste aller 186 Rassen.",
  alternates: {
    canonical: `${BASE}/tools/lebenszeit-kosten`,
    languages: { "de-DE": `${BASE}/tools/lebenszeit-kosten`, "de-AT": `${BASE}/tools/lebenszeit-kosten`, "de-CH": `${BASE}/tools/lebenszeit-kosten`, "x-default": `${BASE}/tools/lebenszeit-kosten` },
  },
  openGraph: {
    title: "Was kostet ein Hund ein Leben lang? — Kosten-Rechner",
    description: "Rasse eingeben, Lebenszeit-Futterkosten sehen. Aus echten Preisen, kostenlos.",
    url: `${BASE}/tools/lebenszeit-kosten`,
    type: "website",
  },
};

const FAQS = [
  {
    question: "Wie berechnet der Rechner die Lebenszeit-Kosten?",
    answer: "Aus dem Gewicht der Rasse wird der Energiebedarf nach der RER-Formel (70 × kg^0,75) berechnet, daraus die tägliche Futtermenge. Multipliziert mit dem Durchschnittspreis pro Kilo und der Lebenserwartung der Rasse ergibt das die gesamten Futterkosten über das Hundeleben.",
  },
  {
    question: "Sind Tierarztkosten enthalten?",
    answer: "Nein. Der Rechner schätzt ausschließlich die Futterkosten. Tierarzt, Versicherung, Zubehör, Steuer und sonstige Ausgaben kommen zusätzlich dazu – die tatsächlichen Gesamtkosten eines Hundes liegen deutlich höher.",
  },
  {
    question: "Wie genau ist die Schätzung?",
    answer: "Es ist eine fundierte Schätzung auf Basis von durchschnittlichem Trockenfutter und mittlerer Aktivität. Die echten Kosten hängen vom gewählten Futter (Budget bis Premium), der Aktivität und der individuellen Fütterungsmenge ab – über das Gewicht und die Lebenserwartung lässt sich der Rahmen aber realistisch abstecken.",
  },
];

export default async function LebenszeitKostenPage() {
  const avg = await getAvgPricePerKgDry();
  const slim: SlimBreed[] = BREEDS.map((b) => ({
    slug: b.slug, name: b.name, size: b.size,
    weightMin: b.weightMin, weightMax: b.weightMax, lifeExpectancy: b.lifeExpectancy,
  }));

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lebenszeit-Kosten-Rechner für Hunde",
    url: `${BASE}/tools/lebenszeit-kosten`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: "Schätzt die gesamten Futterkosten eines Hundes über sein Leben aus Rasse, Gewicht und Lebenserwartung.",
    inLanguage: "de",
  };
  const breadcrumbs = [
    { name: "Start", url: `${BASE}/` },
    { name: "Tools", url: `${BASE}/tools` },
    { name: "Lebenszeit-Kosten", url: `${BASE}/tools/lebenszeit-kosten` },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <StructuredData type="faq" faqs={FAQS} />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <header className="max-w-3xl mx-auto w-full px-5 pt-12 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--honey)]">Kostenloses Tool</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Was kostet dein Hund — <span className="text-accent">ein Leben lang?</span> 🐕
        </h1>
        <p className="mt-4 text-[var(--muted)] leading-relaxed">
          Die meisten unterschätzen es massiv. Wähle deine Rasse und sieh in Sekunden, was allein das Futter
          über das ganze Hundeleben kostet — berechnet aus echten Preisen.
        </p>
      </header>

      <section className="px-5 pb-10">
        <LifetimeCostCalculator breeds={slim} avgPricePerKg={avg} />
      </section>

      <WebMcpTools breeds={slim} avgPricePerKg={avg} />

      <section className="max-w-3xl mx-auto w-full px-5 pb-10">
        <Link href="/ratgeber/was-kostet-ein-hund" className="glass-strong rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-[var(--honey)] transition-colors group">
          <div>
            <p className="font-semibold">Die Rangliste: teuerste &amp; günstigste Rassen</p>
            <p className="text-sm text-[var(--muted)] mt-1">Was kostet dich welche der 186 Rassen über ein Leben? Vom Chihuahua bis zur Dogge.</p>
          </div>
          <span className="text-[var(--honey)] group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </section>

      <section className="max-w-3xl mx-auto w-full px-5 pb-16">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Häufige Fragen</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.question} className="glass rounded-2xl p-5">
              <summary className="font-semibold cursor-pointer text-sm list-none">{f.question}</summary>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
