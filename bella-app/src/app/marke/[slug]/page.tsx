import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScoreBadge from "@/components/ScoreBadge";
import AuthorBox from "@/components/AuthorBox";
import ProductSchemaBlock from "@/components/ProductSchemaBlock";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import { getBrandsWithCounts, getFoodsByBrand } from "@/db/queries/foods";

export const revalidate = 3600;

export async function generateStaticParams() {
  const brands = await getBrandsWithCounts(3);
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brands = await getBrandsWithCounts(3);
  const entry = brands.find((b) => b.slug === slug);
  if (!entry) return {};

  const avgStr = entry.avgScore != null ? `Ø ${entry.avgScore}/100` : "";
  const priceStr =
    entry.minPricePerKg != null ? `, ab ${entry.minPricePerKg.toFixed(2)} €/kg` : "";

  return {
    title: `${entry.brand} Hundefutter: ${entry.count} Sorten im Test & Preisvergleich 2026`,
    description: `Alle ${entry.count} ${entry.brand}-Sorten im BELLA-Score-Vergleich${avgStr ? ` (${avgStr})` : ""}${priceStr}. Täglich aktuelle Preise, unabhängig bewertet.`,
    alternates: {
      canonical: `https://welches-hundefutter.today/marke/${slug}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/marke/${slug}`,
        "de-AT": `https://welches-hundefutter.today/marke/${slug}`,
        "de-CH": `https://welches-hundefutter.today/marke/${slug}`,
        "x-default": `https://welches-hundefutter.today/marke/${slug}`,
      },
    },
  };
}

export default async function MarkePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brands = await getBrandsWithCounts(3);
  const entry = brands.find((b) => b.slug === slug);
  if (!entry) notFound();

  const foods = await getFoodsByBrand(entry.brand);

  const heute = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const topFood = foods[0];

  const faqItems = [
    {
      question: `Ist ${entry.brand} ein gutes Hundefutter?`,
      answer:
        entry.avgScore != null
          ? `${entry.brand} erreicht im BELLA-Score-Vergleich durchschnittlich ${entry.avgScore}/100 Punkte über alle ${entry.count} Sorten. ${topFood ? `Die beste Sorte ist derzeit „${topFood.name}" mit einem Score von ${topFood.score ?? "k.A."}/100.` : ""} BELLA bewertet Fleischanteil, Deklarationsqualität und Zusammensetzung unabhängig.`
          : `${entry.brand} hat ${entry.count} aktive Sorten im BELLA-Katalog. BELLA bewertet Fleischanteil, Deklarationsqualität und Zusammensetzung unabhängig.`,
    },
    {
      question: `Was kostet ${entry.brand} Hundefutter?`,
      answer:
        entry.minPricePerKg != null
          ? `${entry.brand} Hundefutter ist ab ${entry.minPricePerKg.toFixed(2)} €/kg erhältlich. Die genaue Preisspanne hängt von Futtertyp, Packungsgröße und Händler ab — BELLA zeigt täglich aktualisierte Live-Preise.`
          : `${entry.brand} bietet ${entry.count} Sorten im Katalog. BELLA zeigt täglich aktualisierte Live-Preise aus dem AWIN-Netzwerk.`,
    },
    {
      question: `Welche ${entry.brand}-Sorte ist die beste?`,
      answer: topFood
        ? `Nach BELLA-Score ist „${topFood.name}" die beste ${entry.brand}-Sorte${topFood.score != null ? ` mit ${topFood.score}/100 Punkten` : ""}${topFood.pricePerKg != null ? ` zu ${topFood.pricePerKg.toFixed(2)} €/kg` : ""}. BELLA empfiehlt das optimale Produkt auf Basis von Rasse, Alter und Gesundheitsprofil deines Hundes.`
        : `BELLA wählt die passende ${entry.brand}-Sorte anhand des Profils deines Hundes aus — Rasse, Alter, Gewicht und Gesundheitsthemen fließen in die Empfehlung ein.`,
    },
    ...(entry.brand === "Mera" ? [{
      question: "Ist Mera dasselbe wie FRESSNAPF-Hundefutter?",
      answer: "Mera ist die Tiernahrungs-Eigenmarke der FRESSNAPF-Gruppe — wer online oder im Laden nach \"FRESSNAPF-Hundefutter\" sucht, landet meist bei Mera. BELLA bewertet Mera nach denselben Kriterien wie jede andere Marke, unabhängig vom Vertriebsweg.",
    }] : []),
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: `${entry.brand} Hundefutter im Test`,
          description: `${entry.count} ${entry.brand}-Sorten im BELLA-Score-Vergleich. Täglich aktuelle Preise.`,
          url: `https://welches-hundefutter.today/marke/${slug}`,
          dateModified: new Date().toISOString().slice(0, 10),
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Start", url: "https://welches-hundefutter.today/" },
          { name: "Marken", url: "https://welches-hundefutter.today/marke" },
          { name: entry.brand, url: `https://welches-hundefutter.today/marke/${slug}` },
        ]}
      />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/marke" className="hover:text-[var(--honey)]">Marken</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{entry.brand}</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🏷️ Marken-Vergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          {entry.brand} Hundefutter im Test
        </h1>
        <p className="bella-answer text-lg sm:text-xl font-semibold text-[var(--ink)] leading-snug max-w-2xl mb-4">
          Von {entry.brand} sind aktuell {entry.count} Sorten im Katalog
          {entry.avgScore != null ? ` — im Schnitt ${entry.avgScore}/100 im BELLA-Score` : ""}
          {entry.minPricePerKg != null ? `, ab ${entry.minPricePerKg.toFixed(2)} €/kg` : ""}.
        </p>
        <p className="text-[var(--muted)] text-sm mb-4">
          {entry.brand} erreicht über {entry.count} Sorten
          {entry.avgScore != null ? ` im Schnitt ${entry.avgScore}/100 Punkte im BELLA-Score` : " aktive Produkte im Katalog"}
          {" "}(Stand {heute}). Preise täglich via AWIN-Feed aktualisiert.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/#bella-advisor" className="btn-primary">
            BELLA findet die beste {entry.brand}-Sorte für deinen Hund →
          </Link>
        </div>
      </section>

      <ProductSchemaBlock
        foods={foods.map((f) => ({
          name: f.name, brand: f.brand, type: f.foodType, protein: f.protein,
          price_per_kg: f.pricePerKg != null ? String(f.pricePerKg) : null,
          affiliate_url: f.affiliateUrl, image_url: f.imageUrl,
        }))}
        listName={`${entry.brand} Hundefutter im Vergleich`}
      />

      {/* BELLA CHAT */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          BELLA findet die beste {entry.brand}-Sorte für deinen Hund
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          Erzähl BELLA von deinem Hund — sie wählt aus {entry.count} {entry.brand}-Sorten und 11.000+ weiteren Produkten.
        </p>
        <BellaAdvisorWrapper
          introMessage={`Hallo! Ich bin BELLA 🐕 — deine KI-Ernährungsberaterin.\n\nDu interessierst dich für ${entry.brand}. Damit ich die passende Sorte für euch finde:\n\n• Welche Rasse ist dein Hund?\n• Wie alt und wie schwer?\n• Gibt es Allergien oder Gesundheitsthemen?\n\nDann zeige ich dir sofort die optimale Empfehlung aus 11.000+ Produkten!`}
          pageQuickOptions={[
            { label: `🏆 Bestes ${entry.brand}`, msg: `Welches ${entry.brand}-Futter ist das beste für meinen Hund?` },
            { label: "🐶 Rasse + Alter nennen", msg: `Ich habe einen [Rasse], [Alter] Jahre alt — was empfiehlst du von ${entry.brand}?` },
            { label: "💰 Günstig & gut", msg: `Welches ${entry.brand}-Futter ist günstig aber trotzdem hochwertig?` },
            { label: "🩺 Bei Allergie", msg: `Gibt es ${entry.brand}-Futter das auch bei Allergie / empfindlichem Magen passt?` },
          ]}
        />
      </section>

      {/* PRODUKTE */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <h3 className="text-lg font-bold tracking-tight mb-2">
          {entry.brand} im Preisvergleich — {entry.count} Sorten
        </h3>
        <p className="text-[var(--muted)] text-sm mb-7">
          Live-Preise aus dem AWIN-Katalog · täglich aktualisiert · Affiliate-Links (rel=sponsored)
        </p>
        {foods.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {foods.map((f, i) => (
              <a key={i} href={f.affiliateUrl} target="_blank"
                rel="sponsored nofollow noopener noreferrer" className="card card-hover p-5 block">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] capitalize">
                    {f.foodType}
                  </span>
                  {f.protein && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">
                      {f.protein}
                    </span>
                  )}
                  {f.grainFree && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
                      getreidefrei
                    </span>
                  )}
                  {f.score != null && <ScoreBadge score={f.score} />}
                </div>
                <p className="font-semibold text-sm leading-tight">{f.name}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{f.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-black">
                    {f.pricePerKg != null ? `${f.pricePerKg.toFixed(2)} €` : ""}
                    <span className="text-xs font-medium text-[var(--muted)]">/kg</span>
                  </span>
                  <span className="text-xs text-[var(--honey)] font-semibold">Ansehen →</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)] mb-10">
            BELLA findet live die passende Sorte — frag jetzt oben.
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">
          Häufige Fragen zu {entry.brand} Hundefutter
        </h2>
        <div className="space-y-4">
          {faqItems.map((faq, i) => (
            <div key={i} className="card p-6">
              <h3 className="font-bold text-base mb-2">{faq.question}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Welches {entry.brand}-Futter passt genau zu deinem Hund?
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Alter, Gewicht und Allergien und empfiehlt
            in 60 Sekunden die optimale Sorte aus {entry.count} {entry.brand}-Produkten — kostenlos.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">
            🐕 BELLA jetzt fragen — Empfehlung in 60 s →
          </Link>
        </div>
      </section>

      <AuthorBox />
      <SiteFooter />
    </div>
  );
}
