import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Tools & Rechner für Hundehalter | BELLA",
  description: "Kostenlose Tools von BELLA: Futter-Finder (5 Fragen, 3 Empfehlungen), Portionsrechner pro Rasse, Preisindex aus über 11.000 Produkten und Futtertyp-Vergleiche.",
  alternates: {
    canonical: "https://welches-hundefutter.today/tools",
    languages: {
      "de-DE": "https://welches-hundefutter.today/tools",
      "de-AT": "https://welches-hundefutter.today/tools",
      "de-CH": "https://welches-hundefutter.today/tools",
      "x-default": "https://welches-hundefutter.today/tools",
    },
  },
};

const tools = [
  {
    href: "/tools/futter-finder",
    emoji: "🔍",
    title: "Futter-Finder",
    description: "5 Fragen zu Rasse, Alter, Gewicht und Empfindlichkeiten — BELLA vergleicht über 11.000 Sorten und empfiehlt 3 passende. Kostenlos, ohne Anmeldung.",
    cta: "Jetzt Futter finden →",
  },
  {
    href: "/tools/lebenszeit-kosten",
    emoji: "🐕",
    title: "Lebenszeit-Kosten-Rechner",
    description: "Was kostet dein Hund über sein ganzes Leben — allein an Futter? Rasse wählen, Gewicht & Alter anpassen, sofort die Summe sehen.",
    cta: "Kosten berechnen →",
  },
  {
    href: "/rassen",
    emoji: "⚖️",
    title: "Portionsrechner",
    description: "Auf jeder der 186 Rassenseiten berechnet BELLA per RER-Formel die passende Tagesmenge nach Gewicht und Aktivitätslevel.",
    cta: "Rasse auswählen →",
  },
  {
    href: "/analyse/preisindex-2026",
    emoji: "📊",
    title: "Preisindex & Datenreport",
    description: "Ø-Fleischanteil, Getreidefrei- und Hypoallergen-Quote, Top-Proteinquellen — aggregiert aus dem kompletten Live-Katalog, täglich aktualisiert.",
    cta: "Report ansehen →",
  },
  {
    href: "/vergleich",
    emoji: "⚔️",
    title: "Futtertyp-Vergleiche",
    description: "BARF vs. Trockenfutter, Trockenfutter vs. Nassfutter — Kosten, Nährwerte und Aufwand datenbasiert gegenübergestellt.",
    cta: "Vergleiche lesen →",
  },
  {
    href: "/data/catalog.json",
    emoji: "🗂️",
    title: "Offener Produktkatalog",
    description: "Der komplette aktive Katalog als JSON/CSV unter CC-BY-4.0 — frei nutzbar für eigene Auswertungen, Tools oder Recherchen.",
    cta: "Datensatz öffnen →",
  },
  {
    href: "/widget",
    emoji: "🎁",
    title: "Hundekosten-Widget zum Einbetten",
    description: "Kostenloser Lebenszeit-Kosten-Rechner für deine eigene Website — Tierheim, Blog oder Ratgeberseite. Eine Zeile Code, kein Tracking.",
    cta: "Widget holen →",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Tools</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🛠️ Kostenlose Tools</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Tools & Rechner für deinen Hund
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl">
          Alle Tools laufen direkt auf dem Live-Katalog mit über 11.000 Sorten — kostenlos,
          unabhängig und ohne Anmeldung.
        </p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="grid sm:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="card card-hover p-6 block">
              <div className="text-3xl mb-3">{t.emoji}</div>
              <h2 className="text-lg font-extrabold tracking-tight mb-2">{t.title}</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{t.description}</p>
              <span className="text-xs text-[var(--honey)] font-semibold">{t.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
