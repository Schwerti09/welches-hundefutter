import type { Metadata } from "next";
import Link from "next/link";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Welches Hundefutter für meinen Hund? ✓ KI-Berater BELLA findet es in 60 Sekunden",
  description: "Welches Hundefutter passt zu deinem Hund? BELLA fragt 5 Dinge und empfiehlt aus 500+ Sorten das beste für Rasse, Alter & Allergien. Kostenlos.",
  alternates: { canonical: "https://welches-hundefutter.today" },
};

const TOP_FUTTER = [
  { platz: "🥇", marke: "Anifit Adult", eignung: "Allrounder, 92 % Fleischanteil", preis: "7,90 €/kg", stars: 5, slug: "anifit-adult" },
  { platz: "🥈", marke: "Wolfsblut Wild Duck", eignung: "Sensible Hunde, Monoprotein", preis: "6,40 €/kg", stars: 5, slug: "wolfsblut-wild-duck" },
  { platz: "🥉", marke: "Futalis Individuell", eignung: "100 % auf deinen Hund", preis: "5,90 €/kg", stars: 5, slug: "futalis-individuell" },
  { platz: "4", marke: "Terra Canis Nassfutter", eignung: "Premium-Nassfutter", preis: "9,80 €/kg", stars: 5, slug: "terra-canis" },
  { platz: "5", marke: "Josera Festival", eignung: "Wählerische Esser", preis: "4,20 €/kg", stars: 4, slug: "josera-festival" },
  { platz: "6", marke: "Bellfor Allergiker", eignung: "Bei Futtermittelallergien", preis: "6,90 €/kg", stars: 4, slug: "bellfor-allergiker" },
  { platz: "7", marke: "MERA Pure Sensitive", eignung: "Sensibler Magen", preis: "5,20 €/kg", stars: 4, slug: "mera-pure-sensitive" },
];

const RASSEN_LINKS = [
  { name: "Labrador Retriever", slug: "labrador-retriever" },
  { name: "Golden Retriever", slug: "golden-retriever" },
  { name: "Französische Bulldogge", slug: "franzoesische-bulldogge" },
  { name: "Deutscher Schäferhund", slug: "deutscher-schaeferhund" },
  { name: "Beagle", slug: "beagle" },
  { name: "Mops", slug: "mops" },
  { name: "Dackel", slug: "dackel" },
  { name: "Chihuahua", slug: "chihuahua" },
];

const SCHEMA_FAQS = [
  { question: "Welches Hundefutter ist das beste?", answer: "Das hängt von Rasse, Alter, Aktivität und Gesundheit ab. Premium-Sorten wie Anifit, Wolfsblut oder Futalis sind 2026 Testsieger. BELLA findet in 60 Sekunden das passende Futter speziell für deinen Hund." },
  { question: "Welches Hundefutter bei Allergie?", answer: "Hypoallergenes Monoprotein-Futter ohne Huhn, Rind, Weizen. Z.B. Wolfsblut Wild Duck oder Bellfor Hypoallergen. Diese drei sind die häufigsten Allergie-Auslöser bei Hunden." },
  { question: "Trockenfutter oder Nassfutter – was ist besser?", answer: "Beides hat Vor- und Nachteile. Trockenfutter ist günstiger und gut für die Zähne. Nassfutter hat mehr Feuchtigkeit. Optimal: Mischfütterung – Frühstück trocken, Abend nass." },
  { question: "Wie viel sollte mein Hund pro Tag fressen?", answer: "Faustregel Trockenfutter: 1,5–2,5 % des Körpergewichts. Ein 20 kg Hund braucht ca. 300–500 g/Tag. Bei Nassfutter Faktor 3. Aktive Hunde mehr, Senioren weniger." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fef6f0] text-gray-900 flex flex-col">
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="software" />
      <StructuredData type="faq" faqs={SCHEMA_FAQS} />

      {/* HERO */}
      <section className="bg-gradient-to-b from-orange-50 to-[#fef6f0] px-5 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            BELLA ist online – kostenlose KI-Beratung
          </div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 text-gray-900">
            Welches Hundefutter für meinen Hund?{" "}
            <span className="text-orange-500">BELLA findet es in 60 Sekunden</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Es gibt 500+ Hundefutter-Sorten in Deutschland. BELLA fragt 5 Dinge und empfiehlt
            dir die 3 besten – abgestimmt auf Rasse, Alter, Aktivität und Allergien. Kostenlos.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-10">
            <span>⭐ 4,9/5 · 312 Bewertungen</span>
            <span>·</span>
            <span>✓ 500+ Futtersorten</span>
            <span>·</span>
            <span>✓ Kostenlos</span>
          </div>

          <div className="max-w-2xl mx-auto">
            <BellaAdvisorWrapper />
          </div>
        </div>
      </section>

      {/* TOP 7 TABELLE */}
      <section className="max-w-5xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-2 text-center">
          Bestes Hundefutter 2026: Die Top-Empfehlungen im Vergleich
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Von BELLA analysiert · Affiliate-Links mit rel=sponsored</p>
        <div className="overflow-x-auto rounded-2xl border border-orange-100 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-orange-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Platz</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Marke & Sorte</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Eignung</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Preis/kg</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {TOP_FUTTER.map((f) => (
                <tr key={f.slug} className="bg-white hover:bg-orange-50/50 transition-colors">
                  <td className="px-4 py-3 text-lg">{f.platz}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{f.marke}</div>
                    <div className="text-xs text-yellow-500">{"⭐".repeat(f.stars)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{f.eignung}</td>
                  <td className="px-4 py-3 font-semibold text-orange-600">{f.preis}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/empfehlung/${f.slug}`}
                      rel="sponsored"
                      className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      Ansehen →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RASSEN */}
      <section className="max-w-5xl mx-auto px-5 pb-16 w-full">
        <h2 className="text-3xl font-black mb-2">
          Hundefutter nach Rasse: Was dein Hund wirklich braucht
        </h2>
        <p className="text-gray-500 mb-6">Jede Rasse hat eigene Anforderungen. BELLA kennt alle 50.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {RASSEN_LINKS.map((r) => (
            <Link
              key={r.slug}
              href={`/rasse/${r.slug}-hundefutter`}
              className="p-4 rounded-xl bg-white border border-orange-100 hover:border-orange-300 hover:shadow-sm transition-all text-sm font-medium text-gray-800"
            >
              🐕 {r.name}
            </Link>
          ))}
        </div>
        <Link href="/rassen" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
          Alle 50 Rassen ansehen →
        </Link>
      </section>

      {/* FUTTERTYPEN */}
      <section className="bg-white px-5 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Trockenfutter, Nassfutter, BARF – was ist besser?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { typ: "🥣 Trockenfutter", text: "Günstig, lange haltbar, gut für Zähne. Qualität: Fleischanteil über 70 % prüfen.", href: "/futtertyp/trockenfutter" },
              { typ: "🥫 Nassfutter", text: "Mehr Feuchtigkeit, schmackhafter. Gut für wählerische Hunde oder bei Nierenproblemen.", href: "/futtertyp/nassfutter" },
              { typ: "🥩 BARF", text: "Rohfütterung. Sehr hochwertig, aber aufwändig und Expertenwissen nötig.", href: "/futtertyp/barf" },
            ].map((t) => (
              <Link key={t.typ} href={t.href} className="p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all">
                <div className="text-2xl mb-3">{t.typ}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALLERGIE */}
      <section className="max-w-5xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-4">Hundefutter bei Allergien & sensiblem Magen</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Häufigste Allergie-Auslöser: <strong>Huhn, Rind, Weizen</strong>.
          Monoprotein-Futter mit exotischer Quelle (Ente, Wild, Insekten) als Lösung.
          Eliminationsdiät: 8–12 Wochen eine Proteinquelle, dann testen.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/allergie" className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
            Hundefutter bei Allergie →
          </Link>
          <Link href="/problem/sensibler-magen" className="px-5 py-2.5 rounded-xl border border-orange-200 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-colors">
            Sensibler Magen →
          </Link>
        </div>
      </section>

      {/* WELPEN vs SENIOR */}
      <section className="bg-orange-50 px-5 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Welpenfutter vs. Seniorfutter: Wann umstellen?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <h3 className="font-bold text-lg mb-2">🐾 Welpenfutter</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Erhöhter Protein- und Kalziumgehalt für Wachstum. Große Rassen: Junior Large Breed – kontrolliertes Wachstum schützt Gelenke. Umstellen auf Adult: kleine Rassen ab 10 Monate, große ab 18–24 Monate.
              </p>
              <Link href="/futter/welpen" className="mt-4 inline-block text-sm text-orange-500 font-medium hover:underline">Welpenfutter →</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <h3 className="font-bold text-lg mb-2">🦴 Seniorfutter</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Weniger Kalorien, mehr Gelenkstoffe (Glucosamin, Chondroitin), leicht verdaulich. Umstellen: kleine Rassen ab 9 Jahren, große Rassen ab 7 Jahren.
              </p>
              <Link href="/futter/senior" className="mt-4 inline-block text-sm text-orange-500 font-medium hover:underline">Seniorfutter →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-8">Häufige Fragen zur Hundeernährung</h2>
        <div className="space-y-4">
          {SCHEMA_FAQS.map((f) => (
            <div key={f.question} className="bg-white rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold mb-2">{f.question}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
        <Link href="/faq" className="mt-6 inline-block text-orange-500 font-medium hover:underline text-sm">
          Alle Fragen ansehen →
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
