import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Affiliate-Hinweis | handytrotzschufa.today",
  description: "Transparenz zu unseren Affiliate-Links: Wie wir Geld verdienen und warum das dich nichts kostet.",
};

export default function AffiliatePage() {
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
            <span className="text-white/70">Affiliate-Hinweis</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-14 w-full">
        <h1 className="text-3xl font-black mb-2">Affiliate-Hinweis</h1>
        <p className="text-white/40 text-sm mb-10">Werbung & Transparenz</p>

        <div className="space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-5">
            <p className="text-indigo-300 font-semibold mb-1">📢 Werbung auf dieser Seite</p>
            <p className="text-white/70 text-sm leading-relaxed">
              handytrotzschufa.today enthält Affiliate-Links zu Online-Händlern. Diese Links sind mit <code className="text-indigo-300 text-xs bg-indigo-500/20 px-1.5 py-0.5 rounded">rel=&quot;sponsored&quot;</code> gekennzeichnet.
            </p>
          </div>

          {[
            { icon: "💶", title: "Wie verdienen wir Geld?", body: "Wenn du über einen unserer Links einen Handyvertrag abschließt, erhalten wir eine Provision vom jeweiligen Anbieter (z. B. Sparhandy, DeinHandy, Samsung Shop). Diese Provision ist ein fest vereinbarter Betrag oder Prozentsatz des Kaufpreises." },
            { icon: "🔒", title: "Entstehen dir Mehrkosten?", body: "Nein, für dich entstehen keinerlei Mehrkosten. Der Preis, den du bezahlst, ist identisch mit dem, den du beim direkten Kauf beim Anbieter zahlen würdest. Manchmal bekommst du sogar bessere Konditionen über unsere Partner-Links." },
            { icon: "🤖", title: "Beeinflusst das HANSIs Empfehlungen?", body: "Nein. HANSI bewertet Angebote nach Preis-Leistungs-Verhältnis, Netzqualität, Datentarif und deinen persönlichen Präferenzen – nicht nach Provisionshöhe. Unsere Empfehlungen sind unabhängig. Vertrauen geht vor kurzfristiger Provision." },
            { icon: "🏢", title: "Unsere Affiliate-Partner", body: "Wir arbeiten mit Affiliate-Netzwerken zusammen, darunter AWIN (awin.com) und CommunicationAds. Unsere Händler-Partner sind u. a. Sparhandy, DeinHandy, Samsung Shop Deutschland und weitere zertifizierte Mobilfunk-Händler." },
            { icon: "📊", title: "Transparenz-Verpflichtung", body: "Alle Affiliate-Links auf dieser Website sind klar als Werbung gekennzeichnet. Wir halten uns an die Richtlinien des Deutschen Werberats, die DSGVO und die TMG-Anforderungen zur Kennzeichnung von Werbung." },
          ].map((s) => (
            <section key={s.title} className="bg-white/[0.03] rounded-2xl p-5">
              <h2 className="font-bold mb-2 flex items-center gap-2"><span>{s.icon}</span>{s.title}</h2>
              <p className="text-white/65 text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
