import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";
import VoucherBadge from "@/components/VoucherBadge";
import { getTopFoodsByScore, getFoodCount } from "@/db/queries/foods";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hundefutter online kaufen & bestellen — günstig, ohne Abo-Zwang | BELLA",
  description:
    "Hundefutter online kaufen, ohne dich in ein Abo zu drängen oder den teuersten Shop zuerst zu sehen. Live-Preisvergleich über 11.000+ Sorten, täglich aktualisiert.",
  alternates: {
    canonical: "https://welches-hundefutter.today/hundefutter-online-kaufen",
    languages: {
      "de-DE": "https://welches-hundefutter.today/hundefutter-online-kaufen",
      "de-AT": "https://welches-hundefutter.today/hundefutter-online-kaufen",
      "de-CH": "https://welches-hundefutter.today/hundefutter-online-kaufen",
      "x-default": "https://welches-hundefutter.today/hundefutter-online-kaufen",
    },
  },
};

const faqItems = [
  {
    question: "Wo kann ich Hundefutter günstig online kaufen?",
    answer: "Über unseren Live-Preisvergleich — wir zeigen täglich aktualisierte Preise aus über 11.000 Sorten verschiedener Händler, sortiert nach BELLA-Score und Preis, nicht nach Provision. Auf /deals stehen die aktuell günstigsten Sorten.",
  },
  {
    question: "Ist Hundefutter online bestellen günstiger als im Laden?",
    answer: "Oft ja, weil Online-Händler geringere Ladenkosten haben und häufiger Mengenrabatte/Aktionen anbieten. Versandkosten können das aber wieder ausgleichen — deshalb lohnt sich ein Preis-pro-kg-Vergleich inklusive Versand, nicht nur der Listenpreis.",
  },
  {
    question: "Brauche ich ein Abo, um online günstig Hundefutter zu kaufen?",
    answer: "Nein. Abo-Modelle bieten oft 5-10% Rabatt, binden dich aber meist an Mindestlaufzeiten und feste Liefertermine. Eine ehrliche Einordnung dazu findest du auf unserer Abo-Seite — wir empfehlen Abos nur, wenn sie wirklich günstiger UND flexibel kündbar sind.",
  },
  {
    question: "Wie finde ich das richtige Futter, statt nur das günstigste?",
    answer: "Das günstigste Futter ist nicht automatisch das richtige für deinen Hund. BELLA fragt nach Rasse, Alter, Allergien und Budget und filtert daraus die wirklich passenden Sorten aus dem Live-Katalog — kostenlos, ohne Anmeldung.",
  },
];

export default async function HundefutterOnlineKaufenPage() {
  const [topFoods, foodCount] = await Promise.all([getTopFoodsByScore(8), getFoodCount()]);

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hundefutter online kaufen — günstig, ohne Abo-Zwang",
          description: "Live-Preisvergleich über 11.000+ Sorten, täglich aktualisiert.",
          url: "https://welches-hundefutter.today/hundefutter-online-kaufen",
          dateModified: new Date().toISOString(),
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Online kaufen</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🛒 Live-Preisvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl">
          Hundefutter online kaufen — ohne dich in ein Abo zu drängen
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mb-8">
          Die meisten Shops zeigen dir zuerst, was am meisten Provision bringt — oder
          drängen dich gleich ins Abo. Wir zeigen dir den echten Preis pro kg, über{" "}
          {foodCount.toLocaleString("de-DE")} Sorten, täglich aktualisiert.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm">
            🐕 BELLA fragen — das passende finden
          </Link>
          <Link href="/deals" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm hover:border-[rgba(240,167,60,0.4)] transition-all">
            Günstigste Deals heute →
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Aktuell starke Preis-Leistung</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topFoods.map((f) => (
            <a key={f.id} href={f.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer"
              className="card card-hover p-4 block">
              <p className="font-bold text-sm truncate mb-0.5">{f.brand}</p>
              <p className="text-xs text-[var(--muted)] truncate mb-2">{f.name}</p>
              <p className="text-[var(--honey)] font-black text-lg">
                {f.pricePerKg != null ? `${f.pricePerKg.toFixed(2)} €/kg` : "—"}
              </p>
              <VoucherBadge affiliateUrl={f.affiliateUrl} className="mt-2" />
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Drei Wege, online Hundefutter zu kaufen</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/deals" className="card card-hover p-5 block">
            <p className="text-2xl mb-2">💰</p>
            <p className="font-bold text-sm mb-1.5">Einzelkauf, günstigster Preis</p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Beste Kontrolle, kein Abo-Risiko. Für alle, die flexibel bleiben wollen.</p>
          </Link>
          <Link href="/hundefutter-abo" className="card card-hover p-5 block">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-bold text-sm mb-1.5">Abo — wenn es sich wirklich lohnt</p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Praktisch, aber nicht immer günstiger. Wir zeigen ehrlich, wann sich's lohnt.</p>
          </Link>
          <Link href="/probierpakete-hundefutter" className="card card-hover p-5 block">
            <p className="text-2xl mb-2">🎁</p>
            <p className="font-bold text-sm mb-1.5">Probierpaket vor dem Kauf</p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Bevor du einen großen Sack kaufst: erst testen, ob der Hund es mag.</p>
          </Link>
        </div>
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

      <AuthorBox reviewedAt="2026-06-25" />
      <SiteFooter />
    </div>
  );
}
