import type { Metadata } from "next";
import Link from "next/link";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import HeroLiving from "@/components/HeroLiving";
import BreedGallery from "@/components/BreedGallery";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import TopFoodsTable from "@/components/TopFoodsTable";
import { getTopFoods, getTopFoodsByScore, getFoodCount } from "@/db/queries/foods";
import breedGallery from "@/data/breed-gallery.json";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Welches Hundefutter für meinen Hund? ✓ KI-Berater BELLA findet es in 60 Sekunden",
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

export default async function HomePage() {
  const [topFoods, topFoodsByScore, foodCount] = await Promise.all([
    getTopFoods(7),
    getTopFoodsByScore(7),
    getFoodCount(),
  ]);
  const countLabel = foodCount > 0 ? foodCount.toLocaleString("de-DE") : "11.000+";
  const cheapest = topFoods[0]
    ? { brand: topFoods[0].brand, name: topFoods[0].name, pricePerKg: topFoods[0].pricePerKg, affiliateUrl: topFoods[0].affiliateUrl }
    : null;
  const heroBreeds = (breedGallery as { name: string; slug: string; img: string }[]).slice(0, 8);
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="faq" faqs={SCHEMA_FAQS} />

      {/* HERO — lebende BELLA · Bento-Universum · Schnüffel-Scan */}
      <HeroLiving foodCount={foodCount} topFood={cheapest} breeds={heroBreeds} />

      {/* BELLA-Berater — Ziel des Hero-Einstiegs (Schnüffel-Scan landet hier) */}
      <section id="bella-advisor" className="px-5 pb-10 scroll-mt-4">
        <BellaAdvisorWrapper />
      </section>

      {/* FINDE DEINEN HUND — Rasse-Galerie mit echten Fotos */}
      <BreedGallery />

      {/* TOP 7 TABELLE — BELLA-Score / Günstigste */}
      <TopFoodsTable byScore={topFoodsByScore} byPrice={topFoods} countLabel={countLabel} />


      {/* FUTTERTYPEN */}
      <section className="px-5 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Trockenfutter, Nassfutter, BARF – was ist besser?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { typ: "Trockenfutter", text: "Günstig, lange haltbar, gut für die Zähne. Achte auf einen Fleischanteil über 70 %.", href: "/futtertyp/trockenfutter" },
              { typ: "Nassfutter", text: "Mehr Feuchtigkeit, schmackhafter. Ideal für wählerische Hunde oder bei Nierenthemen.", href: "/futtertyp/nassfutter" },
              { typ: "BARF", text: "Rohfütterung. Sehr hochwertig, aber aufwändig und mit Expertenwissen verbunden.", href: "/futtertyp/barf" },
            ].map((t) => (
              <Link key={t.typ} href={t.href} className="card card-hover p-6 block">
                <div className="text-lg font-bold tracking-tight mb-2 text-[var(--ink)]">{t.typ}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{t.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALLERGIE */}
      <section className="max-w-5xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-4">Hundefutter bei Allergien & sensiblem Magen</h2>
        <p className="text-[var(--muted)] leading-relaxed mb-6">
          Häufigste Allergie-Auslöser: <strong>Huhn, Rind, Weizen</strong>.
          Monoprotein-Futter mit exotischer Quelle (Ente, Wild, Insekten) als Lösung.
          Eliminationsdiät: 8–12 Wochen eine Proteinquelle, dann testen.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/allergie" className="px-5 py-2.5 rounded-xl btn-primary text-sm">
            Hundefutter bei Allergie →
          </Link>
          <Link href="/problem/sensibler-magen" className="px-5 py-2.5 rounded-xl border border-white/15 text-[var(--honey)] text-sm font-semibold hover:bg-white/5 transition-colors">
            Sensibler Magen →
          </Link>
        </div>
      </section>

      {/* WELPEN vs SENIOR */}
      <section className="bg-white/[0.02] px-5 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Welpenfutter vs. Seniorfutter: Wann umstellen?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2 tracking-tight">Welpenfutter</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Erhöhter Protein- und Kalziumgehalt für Wachstum. Große Rassen: Junior Large Breed – kontrolliertes Wachstum schützt Gelenke. Umstellen auf Adult: kleine Rassen ab 10 Monate, große ab 18–24 Monate.
              </p>
              <Link href="/futter/welpen" className="mt-4 inline-block text-sm text-[var(--honey)] font-medium hover:underline">Welpenfutter →</Link>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2 tracking-tight">Seniorfutter</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Weniger Kalorien, mehr Gelenkstoffe (Glucosamin, Chondroitin), leicht verdaulich. Umstellen: kleine Rassen ab 9 Jahren, große Rassen ab 7 Jahren.
              </p>
              <Link href="/futter/senior" className="mt-4 inline-block text-sm text-[var(--honey)] font-medium hover:underline">Seniorfutter →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      <SiteFooter />
    </div>
  );
}
