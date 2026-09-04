import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import EmbedCodeBox from "@/components/EmbedCodeBox";
import WidgetPreview from "@/components/WidgetPreview";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Kostenloses Hundekosten-Widget zum Einbetten | welches-hundefutter.today",
  description: "Lebenszeit-Kosten-Rechner für Hunde — kostenlos für jede Website. Kein Tracking, kein iframe, eine Zeile Code. Für Tierheime, Hundeblogs und Ratgeberseiten.",
  alternates: {
    canonical: "https://welches-hundefutter.today/widget",
    languages: {
      "de-DE": "https://welches-hundefutter.today/widget",
      "de-AT": "https://welches-hundefutter.today/widget",
      "de-CH": "https://welches-hundefutter.today/widget",
      "x-default": "https://welches-hundefutter.today/widget",
    },
  },
};

const EMBED_CODE = `<div id="whf-lebenszeit-rechner"></div>
<script src="https://welches-hundefutter.today/embed/lebenszeit-rechner.js" async></script>`;

export default function WidgetPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Lebenszeit-Kosten-Rechner für Hunde",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any (Web)",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          description: "Kostenloses Embed-Widget, das die Futterkosten eines Hundes über sein ganzes Leben berechnet.",
        }}
      />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Widget</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🎁 Kostenlos für jede Website</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundekosten-Rechner zum Einbetten
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Für Tierheime, Vermittlungsseiten, Hundeblogs und Ratgeberseiten: ein interaktiver
          Rechner, der zeigt, was ein Hund über sein ganzes Leben allein an Futter kostet.
          Läuft komplett im Browser deiner Besucher — keine Daten verlassen die Seite.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">Kein Tracking</span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">Kein iframe</span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">&lt; 6 KB</span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">Eine Zeile Code</span>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-3">So sieht's aus</h2>
            <WidgetPreview />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-3">So bindest du es ein</h2>
            <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
              Ein <code className="text-[var(--honey)]">&lt;div&gt;</code> an der Stelle, wo der Rechner
              erscheinen soll, plus ein Script-Tag. Das war's — kein Build-Schritt, keine Abhängigkeiten.
            </p>
            <EmbedCodeBox code={EMBED_CODE} />
            <div className="card p-5 mt-5 border-l-4 border-amber-500/60">
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                <strong className="text-[var(--ink)]">Einzige Bedingung:</strong> der Marken-Link im
                Footer des Widgets bleibt sichtbar und ohne <code>rel=&quot;nofollow&quot;</code> — das
                ist die Gegenleistung fürs kostenlose Tool. Der Ankertext ist nur der Markenname,
                kein Keyword-Spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Häufige Fragen</h2>
        <div className="space-y-4">
          <div className="card p-5">
            <p className="font-semibold text-sm mb-1.5">Kostet das was?</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Nein, komplett kostenlos, keine Anmeldung, kein Abo.</p>
          </div>
          <div className="card p-5">
            <p className="font-semibold text-sm mb-1.5">Sammelt das Widget Daten von meinen Besuchern?</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Nein. Die Berechnung läuft komplett lokal im Browser, es gibt keine externen Requests außer dem einmaligen Laden des Scripts selbst.</p>
          </div>
          <div className="card p-5">
            <p className="font-semibold text-sm mb-1.5">Beeinflusst es das Design meiner Seite?</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Nein, alle Styles sind gescoped (<code>all: initial</code>) und beeinflussen nichts außerhalb des Widgets.</p>
          </div>
          <div className="card p-5">
            <p className="font-semibold text-sm mb-1.5">Kann ich das Widget anpassen (Farben, Größe)?</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Aktuell nicht — das Widget ist bewusst minimal und einheitlich gehalten. Bei Bedarf einfach kurz Kontakt aufnehmen.</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
