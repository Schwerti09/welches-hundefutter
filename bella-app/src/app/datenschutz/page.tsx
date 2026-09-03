import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Datenschutz | welches-hundefutter.today",
  description: "Datenschutzerklärung von welches-hundefutter.today gemäß DSGVO",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
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
            <span className="text-white/70">Datenschutz</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-14 w-full">
        <h1 className="text-3xl font-black mb-2">Datenschutzerklärung</h1>
        <p className="text-white/40 text-sm mb-10">Stand: Mai 2026 · Gemäß DSGVO, BDSG und TTDSG</p>

        <div className="space-y-8">
          {[
            {
              title: "1. Verantwortlicher",
              body: "R. Schwertfechter, Karklandsweg 1, 26553 Dornum, Deutschland. E-Mail: support@welches-hundefutter.today"
            },
            {
              title: "2. Allgemeines zur Datenverarbeitung",
              body: "Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 DSGVO."
            },
            {
              title: "3. Bereitstellung der Website und Logfiles",
              body: "Bei jedem Aufruf unserer Website erfasst unser System automatisiert Daten (IP-Adresse, Datum/Uhrzeit, Browser, Betriebssystem, Referrer-URL). Diese Daten werden im Rahmen des Hostings durch Netlify, Inc. (San Francisco, USA) verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Speicherdauer: max. 30 Tage."
            },
            {
              title: "4. KI-Beratungsfunktion (BELLA)",
              body: "Wenn du BELLA nutzt, werden deine eingegebenen Nachrichten an unsere API-Server übermittelt. Zur Beantwortung werden KI-Dienste genutzt (Google Gemini / Anthropic Claude). Deine Nachrichten werden verschlüsselt übertragen und anonymisiert in unserer Neon-Datenbank gespeichert (keine Klarnamen, keine IP-Adressen). Zweck: Verbesserung der Beratungsqualität. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Empfehlungserfüllung) bzw. lit. f DSGVO (berechtigtes Interesse)."
            },
            {
              title: "5. Cookies",
              body: "Diese Website verwendet ausschließlich technisch notwendige Cookies für den Betrieb. Es werden keine Tracking-Cookies oder Marketing-Cookies ohne Einwilligung gesetzt. Affiliate-Links können Cookies der jeweiligen Partner setzen (AWIN, CommunicationAds). Diese unterliegen den Datenschutzbestimmungen der jeweiligen Marke."
            },
            {
              title: "6. Affiliate-Marketing (AWIN)",
              body: "Diese Website nimmt am AWIN-Affiliate-Programm teil. Bei Klick auf Affiliate-Links wird eine Tracking-ID übermittelt, um Verkäufe zuzuordnen. AWIN verarbeitet diese Daten gemäß ihrer Datenschutzerklärung (awin.com/privacy-policy)."
            },
            {
              title: "7. Hosting (Netlify)",
              body: "Unser Hoster Netlify, Inc. (44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA) verarbeitet Daten in unserem Auftrag. Es besteht ein Auftragsverarbeitungsempfehlung (DPA). Netlify ist nach dem EU-US Data Privacy Framework zertifiziert."
            },
            {
              title: "8. Datenbank (Neon)",
              body: "Wir nutzen Neon, Inc. (USA) als Datenbankdienst. Anonymisierte Gesprächsdaten werden in der EU-Region (AWS us-east-1) gespeichert. Es besteht ein DPA nach Standardempfehlungsklauseln (Art. 46 DSGVO)."
            },
            {
              title: "9. Ihre Rechte",
              body: "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Anfragen an: support@welches-hundefutter.today. Sie haben zudem das Recht, sich bei einer Datenschutzbehörde zu beschweren."
            },
            {
              title: "10. Preis-Wecker & E-Mail-Benachrichtigungen",
              body: "Wenn du einen Preis-Wecker abonnierst, speichern wir deine E-Mail-Adresse sowie – zum gesetzlich erforderlichen Nachweis deiner Einwilligung – Zeitpunkt und IP-Adresse der Anmeldung (Double-Opt-in). Der Versand erfolgt erst, nachdem du die Anmeldung über den Bestätigungslink in der ersten E-Mail bestätigt hast; ohne Bestätigung erfolgt kein Versand. Für den Versand nutzen wir Resend (Resend, Inc., USA) als Auftragsverarbeiter. Über den Abmeldelink in jeder E-Mail kannst du dich jederzeit abmelden; deine Daten werden dann gelöscht bzw. gesperrt. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)."
            },
            {
              title: "11. Änderungen dieser Datenschutzerklärung",
              body: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie aktuellen rechtlichen Anforderungen oder Änderungen unserer Leistungen zu entsprechen. Es gilt stets die zum Zeitpunkt des Besuchs aktuelle Fassung."
            },
          ].map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-bold mb-2 text-white">{s.title}</h2>
              <p className="text-white/65 leading-relaxed text-sm">{s.body}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
