import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandsWithCounts, getFoodsByBrand } from "@/db/queries/foods";
import ScoreBadge from "@/components/ScoreBadge";
import AuthorBox from "@/components/AuthorBox";
import ProductSchemaBlock from "@/components/ProductSchemaBlock";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import type { BrandSummary } from "@/db/queries/foods";
import type { DogFood } from "@/lib/types";
import { DATA_REFRESHED } from "@/lib/site-dates";

export const revalidate = 3600;

const TOP_N = 15;

async function getTopBrands(): Promise<BrandSummary[]> {
  const all = await getBrandsWithCounts(3);
  return all.slice(0, TOP_N);
}

export async function generateStaticParams(): Promise<{ pair: string }[]> {
  const brands = await getTopBrands();
  const pairs: { pair: string }[] = [];
  for (let i = 0; i < brands.length; i++) {
    for (let j = i + 1; j < brands.length; j++) {
      pairs.push({ pair: `${brands[i].slug}-vs-${brands[j].slug}` });
    }
  }
  return pairs;
}

function parsePair(pair: string): { slugA: string; slugB: string } | null {
  const idx = pair.indexOf("-vs-");
  if (idx < 1 || idx >= pair.length - 4) return null;
  return { slugA: pair.slice(0, idx), slugB: pair.slice(idx + 4) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};

  const brands = await getBrandsWithCounts(1);
  const a = brands.find((b) => b.slug === parsed.slugA);
  const b = brands.find((b) => b.slug === parsed.slugB);
  if (!a || !b) return {};

  const heute = new Date().getFullYear();
  return {
    title: `${a.brand} vs. ${b.brand} Hundefutter: Direktvergleich ${heute}`,
    description: `${a.brand} oder ${b.brand}? Wir vergleichen BELLA-Score, Preise und Qualität beider Marken direkt — mit täglich aktuellen Live-Daten aus 11.000+ Produkten.`,
    alternates: {
      canonical: `https://welches-hundefutter.today/vergleich/${pair}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/vergleich/${pair}`,
        "de-AT": `https://welches-hundefutter.today/vergleich/${pair}`,
        "de-CH": `https://welches-hundefutter.today/vergleich/${pair}`,
        "x-default": `https://welches-hundefutter.today/vergleich/${pair}`,
      },
    },
  };
}

function AutoFazit({
  a, b, foodsA, foodsB,
}: {
  a: BrandSummary; b: BrandSummary;
  foodsA: DogFood[]; foodsB: DogFood[];
}) {
  const scoreA = a.avgScore ?? 0;
  const scoreB = b.avgScore ?? 0;
  const priceA = a.minPricePerKg ?? 999;
  const priceB = b.minPricePerKg ?? 999;
  const qualityWinner = scoreA >= scoreB ? a.brand : b.brand;
  const budgetWinner = priceA <= priceB ? a.brand : b.brand;
  const sensitiveA = foodsA.filter((f) => f.grainFree || f.hypoallergenic).length;
  const sensitiveB = foodsB.filter((f) => f.grainFree || f.hypoallergenic).length;
  const sensitiveWinner = sensitiveA >= sensitiveB ? a.brand : b.brand;

  return (
    <div className="card p-6 my-8">
      <h2 className="text-xl font-extrabold mb-4">Unser Fazit</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">Höchste Qualität</p>
          <p className="font-bold text-lg text-white">{qualityWinner}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Besser im BELLA-Score (Fleischanteil + Deklaration)</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--honey)]/10 border border-[var(--honey)]/20">
          <p className="text-xs text-[var(--honey)] font-semibold uppercase tracking-wide mb-1">Günstigster Einstieg</p>
          <p className="font-bold text-lg text-white">{budgetWinner}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Niedrigerer Einstiegspreis pro kg</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Sensitive Hunde</p>
          <p className="font-bold text-lg text-white">{sensitiveWinner}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Mehr getreidfreie / hypoallergene Sorten</p>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] mt-4">
        Bewertung auf Basis aktueller Katalogdaten. Beste Empfehlung hängt von Rasse, Alter und
        Gesundheitsprofil deines Hundes ab — BELLA personalisiert die Auswahl in 60 Sekunden.
      </p>
    </div>
  );
}

function FoodCard({ food }: { food: DogFood }) {
  return (
    <div className="card p-4 flex gap-4 items-start">
      {food.score != null && (
        <div className="shrink-0">
          <ScoreBadge score={food.score} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--muted)] mb-0.5">{food.brand}</p>
        <p className="font-semibold text-sm text-white leading-tight mb-1 truncate">{food.name}</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 capitalize">{food.foodType}</span>
          {food.grainFree && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">getreidefrei</span>}
          {food.hypoallergenic && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300">hypoallergen</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          {food.pricePerKg != null && (
            <span className="text-[var(--honey)] font-bold text-sm">{food.pricePerKg.toFixed(2)} €/kg</span>
          )}
          <a
            href={food.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg btn-primary shrink-0"
          >
            Angebot →
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function MarkenVergleichPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const brands = await getBrandsWithCounts(1);
  const brandA = brands.find((b) => b.slug === parsed.slugA);
  const brandB = brands.find((b) => b.slug === parsed.slugB);
  if (!brandA || !brandB) notFound();

  const [foodsA, foodsB] = await Promise.all([
    getFoodsByBrand(brandA.brand, 6),
    getFoodsByBrand(brandB.brand, 6),
  ]);

  const heute = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const topA = foodsA[0];
  const topB = foodsB[0];

  const faqItems = [
    {
      question: `Ist ${brandA.brand} oder ${brandB.brand} besser?`,
      answer: (() => {
        const sA = brandA.avgScore ?? 0;
        const sB = brandB.avgScore ?? 0;
        const winner = sA >= sB ? brandA.brand : brandB.brand;
        const loser = sA >= sB ? brandB.brand : brandA.brand;
        return `Im BELLA-Score liegt ${winner} mit durchschnittlich ${Math.max(sA, sB)}/100 Punkten vor ${loser} (${Math.min(sA, sB)}/100). Der Score bewertet Proteinquelle, Deklarationsqualität, Getreidefreiheit und Preis-Leistung. Die beste Wahl hängt jedoch von Rasse, Alter und Gesundheitsprofil deines Hundes ab.`;
      })(),
    },
    {
      question: `Was kostet ${brandA.brand} vs. ${brandB.brand}?`,
      answer: [
        brandA.minPricePerKg != null ? `${brandA.brand} ist ab ${brandA.minPricePerKg.toFixed(2)} €/kg erhältlich (${brandA.count} Sorten).` : `${brandA.brand} bietet ${brandA.count} Sorten im Katalog.`,
        brandB.minPricePerKg != null ? `${brandB.brand} startet bei ${brandB.minPricePerKg.toFixed(2)} €/kg (${brandB.count} Sorten).` : `${brandB.brand} bietet ${brandB.count} Sorten im Katalog.`,
        "BELLA zeigt täglich aktualisierte Live-Preise aus dem AWIN-Netzwerk — der günstigste Händler für deinen Hund wird automatisch hervorgehoben.",
      ].join(" "),
    },
    {
      question: `Für welche Hunde eignet sich ${brandA.brand}, für welche ${brandB.brand}?`,
      answer: `Beide Marken bieten Sorten für unterschiedliche Bedürfnisse. ${topA ? `${brandA.brand}s beste Sorte nach BELLA-Score ist „${topA.name}"` : `${brandA.brand} hat ${brandA.count} Sorten im Katalog`}. ${topB ? `${brandB.brand}s Spitzenreiter ist „${topB.name}"` : `${brandB.brand} bietet ${brandB.count} Sorten`}. BELLA wählt basierend auf Rasse, Alter, Gewicht und Gesundheitsthemen die optimale Sorte aus — unabhängig von der Marke.`,
    },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: `${brandA.brand} vs. ${brandB.brand} Hundefutter: Direktvergleich`,
          description: `${brandA.brand} oder ${brandB.brand}? BELLA vergleicht Score, Preise und Qualität beider Marken mit Live-Daten.`,
          url: `https://welches-hundefutter.today/vergleich/${pair}`,
          dateModified: DATA_REFRESHED,
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Start", url: "https://welches-hundefutter.today/" },
          { name: "Vergleiche", url: "https://welches-hundefutter.today/vergleich" },
          { name: `${brandA.brand} vs. ${brandB.brand}`, url: `https://welches-hundefutter.today/vergleich/${pair}` },
        ]}
      />
      <ProductSchemaBlock
        foods={[...foodsA.slice(0, 3), ...foodsB.slice(0, 3)].map((f) => ({
          name: f.name, brand: f.brand, type: f.foodType, protein: f.protein,
          price_per_kg: f.pricePerKg != null ? String(f.pricePerKg) : null,
          affiliate_url: f.affiliateUrl, image_url: f.imageUrl,
        }))}
        listName={`${brandA.brand} vs. ${brandB.brand} Hundefutter`}
      />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/vergleich" className="hover:text-[var(--honey)]">Vergleiche</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{brandA.brand} vs. {brandB.brand}</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-10">
        <span className="pill mb-4">⚖️ Marken-Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          {brandA.brand} vs. {brandB.brand}
        </h1>
        <p className="bella-answer text-lg sm:text-xl font-semibold text-[var(--ink)] leading-snug max-w-2xl mb-4">
          Direktvergleich zweier Marken mit Live-Daten — BELLA-Score, aktuelle Preise, Sorten-Analyse.
        </p>
        <p className="text-[var(--muted)] text-sm">Stand {heute} · Preise täglich aktualisiert via AWIN · {brandA.count + brandB.count} Sorten ausgewertet</p>
      </section>

      {/* SCORECARD */}
      <section className="max-w-5xl mx-auto w-full px-5 mb-10">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { brand: brandA, foods: foodsA },
            { brand: brandB, foods: foodsB },
          ].map(({ brand, foods }) => (
            <div key={brand.slug} className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-extrabold">{brand.brand}</h2>
                  <p className="text-sm text-[var(--muted)]">{brand.count} Sorten im Katalog</p>
                </div>
                {brand.avgScore != null && (
                  <div className="text-center shrink-0">
                    <div className="text-3xl font-black text-[var(--honey)]">{brand.avgScore}</div>
                    <div className="text-xs text-[var(--muted)]">∅ Score</div>
                  </div>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Ab Preis</span>
                  <span className="font-semibold">{brand.minPricePerKg != null ? `${brand.minPricePerKg.toFixed(2)} €/kg` : "k.A."}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Getreidefrei</span>
                  <span className="font-semibold">{foods.filter((f) => f.grainFree).length} Sorten</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Hypoallergen</span>
                  <span className="font-semibold">{foods.filter((f) => f.hypoallergenic).length} Sorten</span>
                </div>
              </div>
              <Link
                href={`/marke/${brand.slug}`}
                className="text-xs text-[var(--honey)] hover:underline"
              >
                Alle {brand.brand}-Sorten ansehen →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* AUTO-FAZIT */}
      <div className="max-w-5xl mx-auto w-full px-5">
        <AutoFazit a={brandA} b={brandB} foodsA={foodsA} foodsB={foodsB} />
      </div>

      {/* TOP PRODUKTE A */}
      {foodsA.length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 mb-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">
            Top-{Math.min(foodsA.length, 6)} {brandA.brand}-Sorten
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {foodsA.slice(0, 6).map((f) => (
              <FoodCard key={f.slug} food={f} />
            ))}
          </div>
          <Link
            href={`/marke/${brandA.slug}`}
            className="mt-3 text-sm text-[var(--honey)] hover:underline inline-block"
          >
            Alle {brandA.count} {brandA.brand}-Sorten →
          </Link>
        </section>
      )}

      {/* TOP PRODUKTE B */}
      {foodsB.length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 mb-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">
            Top-{Math.min(foodsB.length, 6)} {brandB.brand}-Sorten
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {foodsB.slice(0, 6).map((f) => (
              <FoodCard key={f.slug} food={f} />
            ))}
          </div>
          <Link
            href={`/marke/${brandB.slug}`}
            className="mt-3 text-sm text-[var(--honey)] hover:underline inline-block"
          >
            Alle {brandB.count} {brandB.brand}-Sorten →
          </Link>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-5xl mx-auto w-full px-5 mb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Häufige Fragen</h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="card p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {item.question}
                <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BELLA CTA */}
      <section className="max-w-5xl mx-auto w-full px-5 py-8">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          Was ist besser für <em>deinen</em> Hund?
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          BELLA berücksichtigt Rasse, Alter, Gewicht und Gesundheitsthemen — und wählt die optimale Sorte
          aus {brandA.brand}, {brandB.brand} und 11.000+ weiteren Produkten.
        </p>
        <BellaAdvisorWrapper
          introMessage={`Hallo! Ich bin BELLA 🐕\n\nDu vergleichst gerade ${brandA.brand} und ${brandB.brand}. Damit ich dir sagen kann, welche Marke und welche Sorte am besten zu eurem Hund passt:\n\n• Welche Rasse ist dein Hund?\n• Wie alt und wie schwer?\n• Gibt es Allergien oder Gesundheitsthemen?\n\nIch zeige dir dann sofort die optimale Empfehlung!`}
          pageQuickOptions={[
            { label: `🏆 Beste Sorte empfehlen`, msg: `Was ist das beste Futter für meinen Hund — ${brandA.brand} oder ${brandB.brand}?` },
            { label: "🐶 Rasse nennen", msg: `Ich habe einen [Rasse] und überlege zwischen ${brandA.brand} und ${brandB.brand}. Was empfiehlst du?` },
            { label: "🩺 Bei Allergie", msg: `Welche Sorte von ${brandA.brand} oder ${brandB.brand} eignet sich bei Allergie / empfindlichem Magen?` },
            { label: "💰 Günstig & gut", msg: `Welche ist die günstigste hochwertige Sorte von ${brandA.brand} oder ${brandB.brand}?` },
          ]}
        />
      </section>

      <div className="max-w-5xl mx-auto w-full px-5 mb-10">
        <AuthorBox />
      </div>

      <SiteFooter />
    </div>
  );
}
