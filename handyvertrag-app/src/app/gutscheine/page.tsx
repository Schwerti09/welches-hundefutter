import type { Metadata } from "next";
import Link from "next/link";
import { PARTNER_VOUCHERS, PARTNER_LINKS } from "@/data/partners";
import VoucherCard from "@/components/VoucherCard";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter Gutscheine & Rabattcodes 2026 — alle Codes auf einen Blick | BELLA",
  description:
    "Alle aktuellen Gutscheincodes für Hundefutter, BARF, Zubehör und Pflegeprodukte — geprüft, kuratiert, ein Klick zum Kopieren. Kein Code verloren, keine Fake-Rabatte.",
  alternates: {
    canonical: "https://welches-hundefutter.today/gutscheine",
    languages: {
      "de-DE": "https://welches-hundefutter.today/gutscheine",
      "de-AT": "https://welches-hundefutter.today/gutscheine",
      "de-CH": "https://welches-hundefutter.today/gutscheine",
      "x-default": "https://welches-hundefutter.today/gutscheine",
    },
  },
};

const CATEGORY_ORDER = ["ernaehrung", "pflege", "zubehoer", "sonstiges"] as const;
const CATEGORY_TITLE: Record<(typeof CATEGORY_ORDER)[number], string> = {
  ernaehrung: "🍖 Futter & Ernährung",
  pflege: "🩺 Pflege & Gesundheit",
  zubehoer: "🦴 Zubehör",
  sonstiges: "🛍️ Sonstiges",
};

export default function GutscheinePage() {
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    vouchers: PARTNER_VOUCHERS.filter((v) => v.category === cat),
  })).filter((g) => g.vouchers.length > 0);

  const schemaItems = PARTNER_VOUCHERS.map((v, i) => ({
    "@type": "Offer",
    position: i + 1,
    name: `${v.shopName} — ${v.discount}`,
    seller: { "@type": "Organization", name: v.shopName, url: `https://${v.domain}` },
    ...(v.code ? { discountCode: v.code } : {}),
    url: v.affiliateUrl,
  }));

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Hundefutter Gutscheine & Rabattcodes",
            numberOfItems: PARTNER_VOUCHERS.length,
            itemListElement: schemaItems,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Sind die Gutscheincodes auf welches-hundefutter.today aktuell gültig?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Wir listen nur Codes, die wir direkt von den Partner-Shops über unser Affiliate-Netzwerk (AWIN/AdCell) erhalten. Trotzdem können Codes auslaufen — bitte prüfe den Rabatt direkt im Warenkorb des Shops.",
                },
              },
              {
                "@type": "Question",
                name: "Verdient BELLA Provision, wenn ich einen Gutschein nutze?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ja. Wir erhalten bei einem Kauf über diese Links eine Provision vom Shop — dein Preis ändert sich dadurch nicht. So finanzieren wir die kostenlose Futterberatung von BELLA.",
                },
              },
            ],
          }),
        }}
      />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">.</span>
        <span className="text-[var(--ink)]">Gutscheine</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">Geprüfte Rabattcodes</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundefutter-Gutscheine & Rabattcodes
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Alle aktuellen Codes für Futter, BARF, Pflege und Zubehör — ein Klick zum Kopieren.
          Keine Fake-Rabatte, keine abgelaufenen Codes von Drittseiten: jeder Gutschein hier
          stammt direkt aus unserem eigenen Partner-Netzwerk.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">
            {PARTNER_VOUCHERS.length} aktive Gutscheine
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">
            {PARTNER_VOUCHERS.filter((v) => v.hasFeed).length} Shops auch im Produktkatalog
          </span>
        </div>
      </section>

      {byCategory.map(({ cat, vouchers }) => (
        <section key={cat} className="max-w-5xl mx-auto w-full px-5 py-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">{CATEGORY_TITLE[cat]}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map((v) => (
              <VoucherCard key={v.slug} voucher={v} />
            ))}
          </div>
        </section>
      ))}

      {PARTNER_LINKS.length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 py-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-2">Weitere Partner-Shops</h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Aktuell ohne eigenen Rabattcode, aber Teil unseres geprüften Partner-Netzwerks.
          </p>
          <div className="flex flex-wrap gap-3">
            {PARTNER_LINKS.map((p) => (
              <a
                key={p.slug}
                href={p.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition-colors"
              >
                {p.shopName} →
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto w-full px-5 pb-8">
        <div className="card p-5 border-l-4 border-amber-500/60">
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--ink)]">Affiliate-Transparenz:</strong> Alle Links auf
            dieser Seite sind Partner-Links (<code>rel=&quot;sponsored&quot;</code>). Wenn du über
            einen Link kaufst, erhalten wir eine Provision — dein Preis bleibt dabei unverändert.
            Das finanziert die kostenlose KI-Futterberatung von BELLA.
          </p>
        </div>
      </section>

      <AuthorBox reviewedAt="2026-06-23" />
      <SiteFooter />
    </div>
  );
}
