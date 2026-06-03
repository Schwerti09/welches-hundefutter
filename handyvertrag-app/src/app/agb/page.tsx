import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "AGB | welches-hundefutter.today",
  description: "Allgemeine Geschäftsbedingungen von welches-hundefutter.today",
  robots: { index: false, follow: true },
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-[#05060f] text-white flex flex-col">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white font-black text-sm">H</span></div>
            <span className="font-bold text-sm">handyvertrag<span className="text-indigo-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-white/70">AGB</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-14 w-full">
        <h1 className="text-3xl font-black mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-white/40 text-sm mb-10">Stand: Mai 2026</p>

        <div className="space-y-7">
          {(
            [
              ["§ 1 Geltungsbereich", "Diese AGB gelten für die Nutzung von welches-hundefutter.today, betrieben von R. Schwertfechter, Karklandsweg 1, 26553 Dornum."],
              ["§ 2 Leistungsbeschreibung", "welches-hundefutter.today ist ein kostenloser KI-Vergleichsdienst für Mobilfunkverträge. Wir vermitteln keine Verträge selbst, sondern verlinken auf Angebote von Drittanbietern. Preisangaben sind ohne Gewähr."],
              ["§ 3 Nutzungsbedingungen", "Die Nutzung ist kostenlos und setzt keine Registrierung voraus. Automatisierte Zugriffe (Scraping, Bots) und rechtswidrige Nutzung sind nicht gestattet."],
              ["§ 4 Affiliate-Links", "Diese Website enthält Affiliate-Links. Bei Vertragsabschluss über diese Links erhalten wir eine Provision vom Händler. Für Nutzer entstehen keine Mehrkosten. Empfehlungen sind provisionsneutral."],
              ["§ 5 Haftung", "Wir übernehmen keine Gewähr für Richtigkeit und Aktualität der Informationen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, ausgenommen Personenschäden und wesentliche Vertragspflichten."],
              ["§ 6 Änderungen", "Wir behalten uns vor, diese AGB jederzeit zu ändern. Die fortgesetzte Nutzung gilt als Zustimmung."],
              ["§ 7 Recht und Gerichtsstand", "Es gilt deutsches Recht. Gerichtsstand ist Dornum, soweit gesetzlich zulässig."],
            ] as [string, string][]
          ).map(([title, body]) => (
            <section key={title}>
              <h2 className="text-base font-bold mb-2 text-white">{title}</h2>
              <p className="text-white/65 leading-relaxed text-sm">{body}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
