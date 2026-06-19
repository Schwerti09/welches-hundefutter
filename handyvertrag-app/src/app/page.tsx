import type { Metadata } from "next";
import Link from "next/link";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import CostHook from "@/components/CostHook";
import BreedGallery from "@/components/BreedGallery";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import TopFoodsTable from "@/components/TopFoodsTable";
import { getTopFoods, getTopFoodsByScore, getFoodCount, getAvgPricePerKgDry } from "@/db/queries/foods";
import { getBreedsSlim } from "@/lib/breeds-slim";
import { DogInfoProvider } from "@/contexts/DogInfoContext";
import { BREEDS } from "@/data/breeds";
import { lifetimeFoodCost, representativeWeight, lifespanYears, fmtEur } from "@/lib/dogCost";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Welches Hundefutter? 11.000+ Sorten im Preis-Check | BELLA",
  description: "Welches Hundefutter passt zu deinem Hund? BELLA vergleicht über 11.000 echte Sorten und empfiehlt das passende für Rasse, Alter & Allergien. Kostenlos & unabhängig.",
  alternates: {
    canonical: "https://welches-hundefutter.today",
    languages: {
      "de-DE": "https://welches-hundefutter.today",
      "de-AT": "https://welches-hundefutter.today",
      "de-CH": "https://welches-hundefutter.today",
      "x-default": "https://welches-hundefutter.today",
    },
  },
};

const SCHEMA_FAQS = [
  { question: "Welches Hundefutter ist das beste?", answer: "Das perfekte Futter für alle Hunde gibt es nicht — es hängt von Rasse, Alter, Aktivität und Gesundheit ab. Wichtig sind ein hoher Fleischanteil, eine klare Deklaration der Zutaten und keine unnötigen Füllstoffe. BELLA fragt nach den Bedürfnissen deines Hundes und findet in 60 Sekunden passende Sorten aus dem Live-Katalog." },
  { question: "Welches Hundefutter bei Allergie?", answer: "Bei Allergien hilft hypoallergenes Monoprotein-Futter mit nur einer, möglichst ungewöhnlichen Fleischquelle (z. B. Ente, Pferd oder Insekt) und ohne Getreide. Häufigste Auslöser sind Huhn, Rind und Weizen. BELLA sortiert dir verträgliche, getreidefreie Sorten heraus." },
  { question: "Trockenfutter oder Nassfutter – was ist besser?", answer: "Beides hat Vor- und Nachteile. Trockenfutter ist günstiger und gut für die Zähne. Nassfutter hat mehr Feuchtigkeit. Optimal: Mischfütterung – Frühstück trocken, Abend nass." },
  { question: "Wie viel sollte mein Hund pro Tag fressen?", answer: "Faustregel Trockenfutter: 1,5–2,5 % des Körpergewichts. Ein 20 kg Hund braucht ca. 300–500 g/Tag. Bei Nassfutter Faktor 3. Aktive Hunde mehr, Senioren weniger." },
];

const NAV_TILES = [
  { label: "Trockenfutter", sub: "Günstig, gut für die Zähne", href: "/futtertyp/trockenfutter" },
  { label: "Nassfutter", sub: "Mehr Feuchtigkeit", href: "/futtertyp/nassfutter" },
  { label: "BARF", sub: "Rohfütterung", href: "/futtertyp/barf" },
  { label: "Bei Allergie", sub: "Monoprotein, getreidefrei", href: "/problem/allergie" },
  { label: "Sensibler Magen", sub: "Leicht verdaulich", href: "/problem/sensibler-magen" },
  { label: "Welpenfutter", sub: "Für gesundes Wachstum", href: "/lebensphase/welpen" },
  { label: "Seniorfutter", sub: "Gelenkschonend", href: "/lebensphase/senior" },
  { label: "Alle Vergleiche", sub: "Sorten gegenüberstellen", href: "/vergleich" },
];

export default async function HomePage() {
  const [topFoods, topFoodsByScore, foodCount, avgPricePerKgDry] = await Promise.all([
    getTopFoods(7),
    getTopFoodsByScore(7),
    getFoodCount(),
    getAvgPricePerKgDry(),
  ]);
  const countLabel = foodCount > 0 ? foodCount.toLocaleString("de-DE") : "11.000+";
  const breedsSlim = getBreedsSlim();

  // "Das hat kein anderer": Lebenszeit-Kosten-Extremwerte aus echten Preisen (serverseitig).
  const ranked = BREEDS
    .map((b) => ({ name: b.name, cost: lifetimeFoodCost(representativeWeight(b), lifespanYears(b), avgPricePerKgDry) }))
    .sort((a, b) => b.cost - a.cost);
  const most = ranked[0];
  const least = ranked[ranked.length - 1];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="faq" faqs={SCHEMA_FAQS} />

      <main>
      <DogInfoProvider>
        {/* 1 — HERO: Kosten-Hook (einziger Hero) */}
        <CostHook breeds={breedsSlim} avgPricePerKgDry={avgPricePerKgDry} countLabel={countLabel} />

        {/* 2 — VERTRAUENS-LEISTE (absorbiert die Live-Daten des alten Heros) */}
        <div className="px-5">
          <div className="max-w-4xl mx-auto mt-1 mb-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">🔄</span> {countLabel} Preise täglich aktualisiert</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">🐾</span> 186 Rassen</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">⚖️</span> unabhängig — keine gekauften Testsieger</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">🇩🇪</span> für Deutschland, Österreich & Schweiz</span>
          </div>
        </div>

        {/* 3 — BERATER (nach oben gezogen, Hund schon aus dem Hook bekannt) */}
        <section id="bella-advisor" className="px-5 pt-4 pb-10 scroll-mt-4">
          <BellaAdvisorWrapper />
        </section>
      </DogInfoProvider>

      {/* 4 — DAS HAT KEIN ANDERER: Lebenszeit-Daten-Teaser */}
      <section className="px-5 py-14">
        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-8 sm:p-10 text-center">
          <span className="pill mb-5">✨ Das hat kein anderer</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Was kostet dich dein Hund — <span className="text-accent">ein Leben lang?</span>
          </h2>
          <p className="text-[var(--muted)] leading-relaxed max-w-2xl mx-auto mb-3">
            Aus echten, täglich aktualisierten Preisen haben wir die Lebenszeit-Futterkosten aller 186 Rassen berechnet — etwas, das kein statisches Testportal liefern kann.
          </p>
          <p className="text-lg sm:text-xl font-bold mb-7">
            Ein {most.name} kostet rund <span className="text-accent">{fmtEur(most.cost)} €</span>, ein {least.name} nur <span className="text-accent">{fmtEur(least.cost)} €</span> — allein an Futter.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/ratgeber/was-kostet-ein-hund" className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold">
              Ganze Rangliste ansehen →
            </Link>
            <Link href="/tools/lebenszeit-kosten" className="rounded-xl px-6 py-3 text-sm font-semibold border border-white/15 text-[var(--honey)] hover:bg-white/5 transition-colors">
              Eigene Rasse berechnen →
            </Link>
          </div>
        </div>
      </section>

      {/* 5 — FINDE FUTTER NACH… : visuelle Rasse-Galerie + kompaktes Bedarfs-Raster */}
      <BreedGallery />
      <section className="max-w-5xl mx-auto px-5 pb-16 w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-center">
          … oder finde Futter nach <span className="text-accent">Bedarf</span>
        </h2>
        <p className="text-[var(--muted)] text-center mb-8 text-sm">
          Futtertyp, Allergie oder Lebensphase — direkt zum passenden Bereich.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {NAV_TILES.map((t) => (
            <Link key={t.href} href={t.href} className="card card-hover p-4 sm:p-5 block">
              <div className="font-bold tracking-tight text-[var(--ink)] flex items-center justify-between gap-2">
                <span>{t.label}</span> <span className="text-[var(--honey)]">→</span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{t.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 6 — TOP-FUTTER (Beweis, mit Live-Preisen) */}
      <TopFoodsTable byScore={topFoodsByScore} byPrice={topFoods} countLabel={countLabel} />

      {/* 7 — FAQ */}
      <section className="max-w-3xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-8">Häufige Fragen zur Hundeernährung</h2>
        <div className="space-y-4">
          {SCHEMA_FAQS.map((f) => (
            <div key={f.question} className="card p-5">
              <h3 className="font-bold mb-2">{f.question}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
        <Link href="/faq" className="mt-6 inline-block text-[var(--honey)] font-medium hover:underline text-sm">
          Alle Fragen ansehen →
        </Link>
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}
