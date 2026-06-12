import type { Metadata } from "next";
import Link from "next/link";
import { BREEDS } from "@/data/breeds";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

const BASE = "https://welches-hundefutter.today";

export const metadata: Metadata = {
  title: `Hunderassen-Lexikon: Futterempfehlung für ${BREEDS.length} Rassen`,
  description: `Welches Futter passt zu welcher Rasse? ${BREEDS.length} Hunderassen von Labrador bis Zwergpinscher — mit Größe, typischen Gesundheitsproblemen und passenden Futterempfehlungen aus über 11.000 Sorten.`,
  alternates: {
    canonical: `${BASE}/rassen`,
    languages: {
      "de-DE": `${BASE}/rassen`,
      "de-AT": `${BASE}/rassen`,
      "de-CH": `${BASE}/rassen`,
      "x-default": `${BASE}/rassen`,
    },
  },
  openGraph: {
    title: `Hunderassen-Lexikon: ${BREEDS.length} Rassen mit Futterempfehlung`,
    description: "Finde deine Rasse und erhalte individuelle Futterempfehlungen — nach Größe, Aktivität und typischen Gesundheitsthemen.",
    url: `${BASE}/rassen`,
    type: "website",
  },
};

const SIZE_GROUPS: { key: string; label: string; sub: string }[] = [
  { key: "klein", label: "Kleine Rassen", sub: "bis ca. 10 kg — Chihuahua, Malteser, Dackel & Co." },
  { key: "mittel", label: "Mittelgroße Rassen", sub: "ca. 10–25 kg — Beagle, Cocker Spaniel, Border Collie & Co." },
  { key: "gross", label: "Große Rassen", sub: "ca. 25–45 kg — Labrador, Schäferhund, Boxer & Co." },
  { key: "sehrgross", label: "Sehr große Rassen", sub: "über 45 kg — Berner Sennenhund, Dogge & Co." },
];

export default function RassenHubPage() {
  const sorted = [...BREEDS].sort((a, b) => a.name.localeCompare(b.name, "de"));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Hunderassen-Lexikon mit Futterempfehlungen (${BREEDS.length} Rassen)`,
    description: "Rasseprofile mit Größe, typischen Gesundheitsproblemen und passenden Futterempfehlungen.",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      url: `${BASE}/rasse/${b.slug}`,
    })),
  };

  const breadcrumbs = [
    { name: "Start", url: `${BASE}/` },
    { name: "Rassen", url: `${BASE}/rassen` },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <nav className="max-w-6xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Rassen</span>
      </nav>

      <header className="max-w-6xl mx-auto w-full px-5 pt-8 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--honey)]">Rassen-Lexikon</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          {BREEDS.length} Hunderassen — <span className="text-accent">welches Futter passt zu deiner?</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)] leading-relaxed">
          Jede Rasse hat eigene Bedürfnisse: Ein Mops braucht anderes Futter als ein Husky.
          Wähle deine Rasse und erhalte ein Profil mit Größe, typischen Gesundheitsthemen
          und konkreten Futterempfehlungen aus dem Live-Katalog.
        </p>
      </header>

      <main className="max-w-6xl mx-auto w-full px-5 pb-16 space-y-12">
        {SIZE_GROUPS.map((group) => {
          const breeds = sorted.filter((b) => b.size === group.key);
          if (breeds.length === 0) return null;
          return (
            <section key={group.key} aria-labelledby={`gruppe-${group.key}`}>
              <h2 id={`gruppe-${group.key}`} className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {group.label} <span className="text-sm font-medium text-[var(--muted)]">({breeds.length})</span>
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.sub}</p>
              <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {breeds.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/rasse/${b.slug}`}
                      className="glass block rounded-xl px-4 py-3 text-sm font-medium hover:border-[var(--honey)] hover:text-[var(--honey)] transition-colors"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="glass-strong rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-extrabold tracking-tight">Rasse nicht dabei — oder Mischling?</h2>
          <p className="mt-2 text-[var(--muted)] max-w-2xl">
            Kein Problem: BELLA fragt nach Gewicht, Alter, Aktivität und Empfindlichkeiten
            und findet in 60 Sekunden passende Sorten — ganz ohne Rasse-Schublade.
          </p>
          <Link href="/tools/futter-finder" className="btn-primary mt-5 inline-block rounded-xl px-6 py-3 text-sm font-semibold">
            Futter-Finder starten →
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
