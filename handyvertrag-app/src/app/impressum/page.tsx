import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Impressum | BELLA — Neutrale Hundefutterberatung",
  description: "Impressum gemäß § 5 DDG. BELLA ist eine unabhängige, neutrale Hundefutterberatung — keine provisionsgenerierte Empfehlungsliste.",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <nav className="max-w-3xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Impressum</span>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-10 w-full">
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Impressum</h1>
        <p className="text-[var(--muted)] text-sm mb-10">Angaben gemäß § 5 DDG</p>

        {/* Haltung — kurz und klar */}
        <div className="rounded-2xl border border-[rgba(240,167,60,0.25)] bg-[rgba(240,167,60,0.04)] p-6 mb-10">
          <h2 className="text-base font-extrabold tracking-tight mb-3 text-[var(--honey)]">Wofür diese Seite steht</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            <strong className="text-white">BELLA ist eine neutrale Hundefutterberatung.</strong> Keine Werbeshow.
            Kein Vergleichsportal, das Produkte nach der höchsten Provision sortiert.
            Ein KI-Berater, der eine einzige Frage beantwortet: Was ist das richtige Futter für <em>diesen</em> Hund?
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            Ja — wir verdienen Affiliate-Provisionen (wie jedes Vergleichsportal in Deutschland).
            Aber: Welches Produkt wir empfehlen, richtet sich ausschließlich nach dem BELLA Score —
            einem Algorithmus nach vier veröffentlichten Kriterien.
            Kein Hersteller kann seinen Score kaufen. Weder Josera, noch FRESSNAPF, noch Royal Canin.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Das Wohl deiner Fellnase ist das einzige Ziel. Alles andere folgt daraus.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/warum-bella" className="text-xs text-[var(--honey)] hover:underline font-semibold">
              Warum wir anders sind →
            </Link>
            <Link href="/analyse/methodik" className="text-xs text-[var(--honey)] hover:underline font-semibold">
              Score-Methodik →
            </Link>
          </div>
        </div>

        {/* Pflichtangaben */}
        <div className="space-y-8 text-sm text-[var(--muted)]">
          <section>
            <h2 className="text-base font-bold mb-3 text-white">Diensteanbieter</h2>
            <div className="leading-relaxed">
              <p>R. Schwertfechter</p>
              <p>Karklandsweg 1</p>
              <p>26553 Dornum</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a href="mailto:support@welches-hundefutter.today" className="text-[var(--honey)] hover:underline">
                support@welches-hundefutter.today
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <div className="leading-relaxed">
              <p>R. Schwertfechter</p>
              <p>Karklandsweg 1, 26553 Dornum</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Affiliate-Hinweis & redaktionelle Unabhängigkeit</h2>
            <p className="leading-relaxed mb-3">
              Diese Website enthält Werbelinks (Affiliate-Links, gekennzeichnet mit{" "}
              <code className="text-[var(--honey)] text-xs">rel=&quot;sponsored&quot;</code>).
              Bei einem Kauf über einen solchen Link erhalten wir eine Provision vom Händler.
              Für dich entstehen keine Mehrkosten.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">Wichtig:</strong> Die Provision beeinflusst keine Produktempfehlung.
              Der BELLA Score wird algorithmisch berechnet — unabhängig davon, welcher Anbieter
              welche Provision zahlt. Empfehlungen basieren ausschließlich auf Qualitätskriterien
              und dem Profil des Hundes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Tiermedizinischer Haftungsausschluss</h2>
            <p className="leading-relaxed">
              Die Inhalte auf BELLA dienen der allgemeinen Information und ersetzen
              keine tierärztliche Beratung oder Diagnose. Bei gesundheitlichen Problemen
              deines Hundes wende dich an eine Tierärztin oder einen Tierarzt.
              Formulierungen wie „kann unterstützen" beschreiben ernährungswissenschaftliche
              Zusammenhänge — sie stellen keine Heilversprechen dar.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Streitbeilegung</h2>
            <p className="leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--honey)] hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Haftung für Inhalte</h2>
            <p className="leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind
              wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen
              zu überwachen. Bei Bekanntwerden von Rechtsverletzungen entfernen wir
              entsprechende Inhalte umgehend.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Haftung für Links</h2>
            <p className="leading-relaxed">
              Unser Angebot enthält Links zu externen Websites. Auf deren Inhalte haben wir
              keinen Einfluss und übernehmen keine Gewähr. Die verlinkten Seiten wurden
              zum Zeitpunkt der Verlinkung auf Rechtsverstöße geprüft. Rechtswidrige Inhalte
              waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Urheberrecht</h2>
            <p className="leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte auf dieser Website unterliegen dem
              deutschen Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der
              Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 text-white">Markenhinweise</h2>
            <p className="leading-relaxed">
              Alle genannten Marken- und Produktnamen (Josera, FRESSNAPF, Royal Canin, HILLS, Purina, etc.)
              sind Eigentum ihrer jeweiligen Inhaber und dienen ausschließlich der beschreibenden Darstellung.
              Diese Website steht in keiner offiziellen Verbindung zu den genannten Herstellern.
              Produktdaten stammen aus den Partner-Feeds (AWIN) der jeweiligen Shops.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
