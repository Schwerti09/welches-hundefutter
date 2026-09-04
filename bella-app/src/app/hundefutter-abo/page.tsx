import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";
import { CONTENT_REVISED } from "@/lib/site-dates";

export const metadata: Metadata = {
  title: "Hundefutter im Abo bestellen — lohnt sich das wirklich? | BELLA",
  description:
    "Hundefutter-Abos versprechen Rabatt und Bequemlichkeit. Was sie wirklich kosten, wo die Fallstricke liegen (Mindestlaufzeit, Liefertermine) — eine ehrliche Einordnung.",
  alternates: {
    canonical: "https://welches-hundefutter.today/hundefutter-abo",
    languages: {
      "de-DE": "https://welches-hundefutter.today/hundefutter-abo",
      "de-AT": "https://welches-hundefutter.today/hundefutter-abo",
      "de-CH": "https://welches-hundefutter.today/hundefutter-abo",
      "x-default": "https://welches-hundefutter.today/hundefutter-abo",
    },
  },
};

const faqItems = [
  {
    question: "Lohnt sich ein Hundefutter-Abo?",
    answer: "Nur wenn drei Dinge gleichzeitig stimmen: der Abo-Preis ist wirklich niedriger als der Einzelpreis (nicht nur der erste Bestellung), die Mindestlaufzeit ist kurz oder es gibt keine, und du kannst die Liefermenge/-frequenz anpassen, wenn dein Hund das Futter wechselt oder mehr/weniger braucht.",
  },
  {
    question: "Warum pushen viele Seiten Hundefutter-Abos?",
    answer: "Abo-Bestellungen bedeuten für Vergleichsportale wiederkehrende Provisionen statt einer einmaligen Zahlung — das macht Abos für den Betreiber lukrativer, unabhängig davon, ob es für deinen Hund die beste Lösung ist.",
  },
  {
    question: "Was sind die größten Abo-Fallen?",
    answer: "Lange Mindestlaufzeiten, automatische Verlängerung ohne klare Kündigungserinnerung, und Liefertermine, die sich nicht an den tatsächlichen Verbrauch deines Hundes anpassen — du bekommst Nachschub, bevor der alte Sack leer ist, oder erst Wochen danach.",
  },
  {
    question: "Gibt es eine Alternative zum Abo, die automatisch erinnert?",
    answer: "Ja — BELLAs Nachschub-Wecker berechnet aus Hundegewicht und Futtermenge, wann der Sack ungefähr leer ist, und erinnert dich per Mail genau dann. Kein Abo, keine Mindestlaufzeit, du bestellst jedes Mal frei, wo der Preis gerade am besten ist.",
  },
];

export default function HundefutterAboPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hundefutter im Abo — lohnt sich das wirklich?",
          description: "Was Hundefutter-Abos wirklich kosten und wo die Fallstricke liegen.",
          url: "https://welches-hundefutter.today/hundefutter-abo",
          dateModified: CONTENT_REVISED,
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Hundefutter-Abo</span>
      </nav>

      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">📦 Ehrliche Einordnung</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl">
          Hundefutter im Abo — lohnt sich das wirklich?
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mb-8">
          Kurze Antwort: manchmal. Abos sind für Anbieter besonders lukrativ —
          wiederkehrende Provision statt einmaliger Zahlung. Das heißt nicht, dass
          sie schlecht für dich sind, aber es heißt, dass du genauer hinschauen solltest,
          bevor du eins abschließt.
        </p>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Was ein Abo wirklich bringt — und was nicht</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
            <p className="font-bold text-sm mb-2 text-emerald-300">✓ Echte Vorteile</p>
            <ul className="text-sm text-[var(--muted)] space-y-1.5 leading-relaxed">
              <li>Kein Vergessen — Futter kommt automatisch</li>
              <li>Oft 5–10% Rabatt gegenüber Einzelkauf</li>
              <li>Manche Anbieter: jederzeit pausierbar</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
            <p className="font-bold text-sm mb-2 text-red-300">⚠ Worauf du achten musst</p>
            <ul className="text-sm text-[var(--muted)] space-y-1.5 leading-relaxed">
              <li>Mindestlaufzeiten von 3–12 Monaten sind üblich</li>
              <li>Liefertermine passen oft nicht zum echten Verbrauch</li>
              <li>Rabatt gilt manchmal nur für die erste Lieferung</li>
              <li>Futterwechsel (z.B. bei Allergie) wird umständlich</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="card p-7">
          <h2 className="text-xl font-extrabold tracking-tight mb-3">
            Die Alternative: ein Wecker statt eines Abos
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">
            BELLA berechnet aus Hundegewicht und Futtermenge, wann der aktuelle Sack
            ungefähr leer ist, und schickt dir genau dann eine Erinnerung — mit dem
            aktuellen Preis. Kein Abo, keine Mindestlaufzeit, du entscheidest jedes
            Mal neu, wo du bestellst.
          </p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm">
            🐕 BELLA fragen — Futter-Pass anlegen
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
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

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="flex flex-wrap gap-3">
          <Link href="/hundefutter-online-kaufen" className="text-sm text-[var(--honey)] hover:underline">
            ← Zurück zu „Hundefutter online kaufen"
          </Link>
          <Link href="/probierpakete-hundefutter" className="text-sm text-[var(--honey)] hover:underline">
            Probierpakete ansehen →
          </Link>
        </div>
      </section>

      <AuthorBox reviewedAt="2026-06-25" />
      <SiteFooter />
    </div>
  );
}
