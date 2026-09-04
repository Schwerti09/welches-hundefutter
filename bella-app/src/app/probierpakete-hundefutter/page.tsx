import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";
import VoucherBadge from "@/components/VoucherBadge";
import { CONTENT_REVISED } from "@/lib/site-dates";

export const revalidate = 86400;

interface ProbierRow {
  id: string;
  brand: string;
  name: string;
  price_per_kg: number | null;
  price: number | null;
  affiliate_url: string;
  image_url: string | null;
}

async function getProbierpakete(): Promise<ProbierRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, brand, name, price_per_kg, price, affiliate_url, image_url
      FROM dog_foods
      WHERE is_active = true AND affiliate_url IS NOT NULL
        AND (name ILIKE '%probier%' OR name ILIKE '%schnupper%')
      ORDER BY price ASC NULLS LAST
      LIMIT 24
    `;
    return (rows as unknown as ProbierRow[]).map((r) => ({
      ...r,
      price_per_kg: r.price_per_kg != null ? parseFloat(String(r.price_per_kg)) : null,
      price: r.price != null ? parseFloat(String(r.price)) : null,
    }));
  } catch (e) {
    console.error("[probierpakete]", (e as Error).message);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Probierpakete Hundefutter — testen, bevor der große Sack kommt | BELLA",
  description:
    "Echte Probierpakete und Schnupperboxen aus dem Live-Katalog — verschiedene Sorten in kleinen Mengen testen, bevor du dich auf einen großen Sack festlegst.",
  alternates: {
    canonical: "https://welches-hundefutter.today/probierpakete-hundefutter",
    languages: {
      "de-DE": "https://welches-hundefutter.today/probierpakete-hundefutter",
      "de-AT": "https://welches-hundefutter.today/probierpakete-hundefutter",
      "de-CH": "https://welches-hundefutter.today/probierpakete-hundefutter",
      "x-default": "https://welches-hundefutter.today/probierpakete-hundefutter",
    },
  },
};

const faqItems = [
  {
    question: "Wofür sind Probierpakete bei Hundefutter sinnvoll?",
    answer: "Um herauszufinden, ob dein Hund eine Sorte überhaupt mag oder verträgt, bevor du einen 10-15 kg Sack kaufst. Besonders sinnvoll beim Wechsel auf BARF oder bei der Suche nach der richtigen Proteinquelle bei Allergien.",
  },
  {
    question: "Wie lange sollte ich eine neue Sorte testen?",
    answer: "Mindestens 5-7 Tage bei einer langsamen Umstellung (Futter mischen, Anteil schrittweise erhöhen), damit du Verdauungsreaktionen wirklich der neuen Sorte zuordnen kannst und nicht nur eine kurzfristige Umstellungsreaktion siehst.",
  },
  {
    question: "Sind Probierpakete teurer pro kg als normale Packungen?",
    answer: "Meistens ja, weil kleinere Mengen pro kg mehr kosten (höhere Verpackungs- und Versandkostenanteil). Das ist der Preis fürs Risiko-freie Testen — lohnt sich trotzdem, wenn du sonst einen großen Sack riskierst, den dein Hund nicht mag.",
  },
];

export default async function ProbierpaketePage() {
  const pakete = await getProbierpakete();

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Probierpakete Hundefutter — testen, bevor der große Sack kommt",
          description: "Echte Probierpakete aus dem Live-Katalog.",
          url: "https://welches-hundefutter.today/probierpakete-hundefutter",
          dateModified: CONTENT_REVISED,
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Probierpakete</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🎁 {pakete.length} echte Probierpakete</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl">
          Probierpakete Hundefutter
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl">
          Bevor du einen 10-kg-Sack kaufst, den dein Hund vielleicht nicht mag: kleine
          Mengen testen. Hier sind echte Probierpakete und Schnupperboxen aus dem
          Live-Katalog.
        </p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        {pakete.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pakete.map((p) => (
              <a key={p.id} href={p.affiliate_url} target="_blank" rel="sponsored nofollow noopener noreferrer"
                className="card card-hover p-5 block">
                <p className="font-bold text-sm mb-1">{p.brand}</p>
                <p className="text-xs text-[var(--muted)] mb-3 leading-snug">{p.name}</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-[var(--honey)] font-black text-lg">
                    {p.price != null ? `${p.price.toFixed(2)} €` : p.price_per_kg != null ? `${p.price_per_kg.toFixed(2)} €/kg` : "—"}
                  </p>
                  <span className="text-xs text-[var(--honey)] font-semibold">Ansehen →</span>
                </div>
                <VoucherBadge affiliateUrl={p.affiliate_url} className="mt-2" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-[var(--muted)]">Probierpakete werden gerade aktualisiert.</p>
        )}
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Häufige Fragen</h2>
        <div className="space-y-4">
          {faqItems.map((f, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-bold text-base mb-2">{f.question}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <Link href="/hundefutter-online-kaufen" className="text-sm text-[var(--honey)] hover:underline">
          ← Zurück zu „Hundefutter online kaufen"
        </Link>
      </section>

      <AuthorBox reviewedAt="2026-06-25" />
      <SiteFooter />
    </div>
  );
}
