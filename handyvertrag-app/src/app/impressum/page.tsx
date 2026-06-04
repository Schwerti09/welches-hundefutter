import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Impressum | welches-hundefutter.today",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG für welches-hundefutter.today",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#05060f] text-white flex flex-col">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white font-black text-sm">H</span></div>
            <span className="font-bold text-sm">hundefutter<span className="text-indigo-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-white/70">Impressum</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-14 w-full">
        <h1 className="text-3xl font-black mb-2">Impressum</h1>
        <p className="text-white/40 text-sm mb-10">Angaben gemäß § 5 DDG</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Diensteanbieter</h2>
            <div className="text-white/70 leading-relaxed">
              <p>R. Schwertfechter</p>
              <p>Karklandsweg 1</p>
              <p>26553 Dornum</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Kontakt</h2>
            <p className="text-white/70">E-Mail: <a href="mailto:support@welches-hundefutter.today" className="text-indigo-400 hover:text-indigo-300 transition-colors">support@welches-hundefutter.today</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <div className="text-white/70 leading-relaxed">
              <p>R. Schwertfechter</p>
              <p>Karklandsweg 1, 26553 Dornum</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Streitbeilegung</h2>
            <p className="text-white/70 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">ec.europa.eu/consumers/odr</a>.
            </p>
            <p className="text-white/70 leading-relaxed mt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Affiliate-Hinweis</h2>
            <p className="text-white/70 leading-relaxed">
              Diese Website enthält Werbelinks zu Online-Händlern (Affiliate-Links, gekennzeichnet mit <code className="text-indigo-300 text-xs">rel=&quot;sponsored&quot;</code>). Bei einem Klick auf einen solchen Link und einem anschließenden Kauf erhalten wir eine Provision vom Händler. Für dich entstehen dabei keine Mehrkosten. Diese Provisionen helfen uns, die Plattform kostenlos und unabhängig zu betreiben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Haftung für Inhalte</h2>
            <p className="text-white/70 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="text-white/70 leading-relaxed mt-2">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Haftung für Links</h2>
            <p className="text-white/70 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Urheberrecht</h2>
            <p className="text-white/70 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-white">Markenhinweise</h2>
            <p className="text-white/70 leading-relaxed">
              Alle genannten Marken-, Hersteller- und Produktnamen sind Eigentum ihrer jeweiligen Inhaber und dienen ausschließlich der Beschreibung. Diese Website steht in keiner offiziellen Verbindung zu den genannten Herstellern. Produktdaten und -bilder stammen aus den Partner-Feeds (AWIN, AdCell) der jeweiligen Shops.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
