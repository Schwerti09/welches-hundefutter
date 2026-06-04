import type { Metadata } from "next";
import Link from "next/link";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import BreedGallery from "@/components/BreedGallery";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import { getTopFoods, getFoodCount } from "@/db/queries/foods";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Welches Hundefutter für meinen Hund? ✓ KI-Berater BELLA findet es in 60 Sekunden",
  description: "Welches Hundefutter passt zu deinem Hund? BELLA vergleicht über 8.000 echte Sorten und empfiehlt das passende für Rasse, Alter & Allergien. Kostenlos & unabhängig.",
  alternates: { canonical: "https://welches-hundefutter.today" },
};

const SCHEMA_FAQS = [
  { question: "Welches Hundefutter ist das beste?", answer: "Das hängt von Rasse, Alter, Aktivität und Gesundheit ab. Premium-Sorten wie Anifit, Wolfsblut oder Futalis sind 2026 Testsieger. BELLA findet in 60 Sekunden das passende Futter speziell für deinen Hund." },
  { question: "Welches Hundefutter bei Allergie?", answer: "Hypoallergenes Monoprotein-Futter ohne Huhn, Rind, Weizen. Z.B. Wolfsblut Wild Duck oder Bellfor Hypoallergen. Diese drei sind die häufigsten Allergie-Auslöser bei Hunden." },
  { question: "Trockenfutter oder Nassfutter – was ist besser?", answer: "Beides hat Vor- und Nachteile. Trockenfutter ist günstiger und gut für die Zähne. Nassfutter hat mehr Feuchtigkeit. Optimal: Mischfütterung – Frühstück trocken, Abend nass." },
  { question: "Wie viel sollte mein Hund pro Tag fressen?", answer: "Faustregel Trockenfutter: 1,5–2,5 % des Körpergewichts. Ein 20 kg Hund braucht ca. 300–500 g/Tag. Bei Nassfutter Faktor 3. Aktive Hunde mehr, Senioren weniger." },
];

export default async function HomePage() {
  const [topFoods, foodCount] = await Promise.all([getTopFoods(7), getFoodCount()]);
  const countLabel = foodCount > 0 ? foodCount.toLocaleString("de-DE") : "8.000+";
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="software" />
      <StructuredData type="faq" faqs={SCHEMA_FAQS} />

      {/* HERO */}
      <section className="relative hero-glow px-5 pt-16 pb-20 text-center overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <div className="pill mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--honey)] animate-pulse" />
            KI-Ernährungsberatung · unabhängig & kostenlos
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.06] mb-6">
            Das richtige Futter für deinen Hund —{" "}
            <span className="text-accent">in 60 Sekunden gefunden</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-9 leading-relaxed">
            Über 8.000 Futter, analysiert von BELLA. Sag ihr kurz, was deinen Hund ausmacht —
            Rasse, Alter, Allergien — und erhalte die wirklich passenden Empfehlungen.
            Keine endlosen Vergleichslisten.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)] mb-12">
            <span className="font-semibold text-[var(--ink)]">8.000+ Futter analysiert</span>
            <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
            <span>Unabhängig & werbefrei beraten</span>
            <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
            <span>Ohne Anmeldung</span>
          </div>

          <div id="bella-advisor" className="max-w-3xl mx-auto scroll-mt-6">
            <BellaAdvisorWrapper />
          </div>
        </div>
      </section>

      {/* FINDE DEINEN HUND — Rasse-Galerie mit echten Fotos */}
      <BreedGallery />

      {/* TOP 7 TABELLE */}
      <section className="max-w-5xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-2 text-center">
          Hundefutter im Preisvergleich — günstige Top-Sorten
        </h2>
        <p className="text-[var(--muted)] text-center mb-8 text-sm">
          Aus {countLabel} echten Sorten im Live-Katalog · günstigste zuerst · Affiliate-Links (rel=sponsored)
        </p>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-white/70">Platz</th>
                <th className="text-left px-4 py-3 font-semibold text-white/70">Marke & Sorte</th>
                <th className="text-left px-4 py-3 font-semibold text-white/70 hidden sm:table-cell">Eignung</th>
                <th className="text-left px-4 py-3 font-semibold text-white/70">Preis/kg</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {topFoods.map((f, i) => (
                <tr key={f.id} className="bg-transparent hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 text-lg">{["🥇", "🥈", "🥉"][i] ?? i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--ink)]">{f.brand}</div>
                    <div className="text-xs text-[var(--muted)]">{f.name}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)] hidden sm:table-cell">
                    <span className="capitalize">{f.foodType}</span>
                    {f.protein ? ` · ${f.protein}` : ""}
                    {f.grainFree ? " · getreidefrei" : ""}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--honey)] whitespace-nowrap">
                    {f.pricePerKg != null ? `${f.pricePerKg.toFixed(2)} €/kg` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={f.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg btn-primary whitespace-nowrap"
                    >
                      Ansehen →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* FUTTERTYPEN */}
      <section className="px-5 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Trockenfutter, Nassfutter, BARF – was ist besser?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { typ: "Trockenfutter", text: "Günstig, lange haltbar, gut für die Zähne. Achte auf einen Fleischanteil über 70 %.", href: "/futtertyp/trockenfutter" },
              { typ: "Nassfutter", text: "Mehr Feuchtigkeit, schmackhafter. Ideal für wählerische Hunde oder bei Nierenthemen.", href: "/futtertyp/nassfutter" },
              { typ: "BARF", text: "Rohfütterung. Sehr hochwertig, aber aufwändig und mit Expertenwissen verbunden.", href: "/futtertyp/barf" },
            ].map((t) => (
              <Link key={t.typ} href={t.href} className="card card-hover p-6 block">
                <div className="text-lg font-bold tracking-tight mb-2 text-[var(--ink)]">{t.typ}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{t.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALLERGIE */}
      <section className="max-w-5xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-4">Hundefutter bei Allergien & sensiblem Magen</h2>
        <p className="text-[var(--muted)] leading-relaxed mb-6">
          Häufigste Allergie-Auslöser: <strong>Huhn, Rind, Weizen</strong>.
          Monoprotein-Futter mit exotischer Quelle (Ente, Wild, Insekten) als Lösung.
          Eliminationsdiät: 8–12 Wochen eine Proteinquelle, dann testen.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/allergie" className="px-5 py-2.5 rounded-xl btn-primary text-sm">
            Hundefutter bei Allergie →
          </Link>
          <Link href="/problem/sensibler-magen" className="px-5 py-2.5 rounded-xl border border-white/15 text-[var(--honey)] text-sm font-semibold hover:bg-white/5 transition-colors">
            Sensibler Magen →
          </Link>
        </div>
      </section>

      {/* WELPEN vs SENIOR */}
      <section className="bg-white/[0.02] px-5 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Welpenfutter vs. Seniorfutter: Wann umstellen?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2 tracking-tight">Welpenfutter</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Erhöhter Protein- und Kalziumgehalt für Wachstum. Große Rassen: Junior Large Breed – kontrolliertes Wachstum schützt Gelenke. Umstellen auf Adult: kleine Rassen ab 10 Monate, große ab 18–24 Monate.
              </p>
              <Link href="/futter/welpen" className="mt-4 inline-block text-sm text-[var(--honey)] font-medium hover:underline">Welpenfutter →</Link>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2 tracking-tight">Seniorfutter</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Weniger Kalorien, mehr Gelenkstoffe (Glucosamin, Chondroitin), leicht verdaulich. Umstellen: kleine Rassen ab 9 Jahren, große Rassen ab 7 Jahren.
              </p>
              <Link href="/futter/senior" className="mt-4 inline-block text-sm text-[var(--honey)] font-medium hover:underline">Seniorfutter →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 py-16 w-full">
        <h2 className="text-3xl font-black mb-8">Häufige Fragen zur Hundeernährung</h2>
        <div className="space-y-4">
          {SCHEMA_FAQS.map((f) => (
            <div key={f.question} className="card p-5">
              <h3 className="font-bold mb-2">{f.question}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
        <Link href="/faq" className="mt-6 inline-block text-[var(--honey)] font-medium hover:underline text-sm">
          Alle Fragen ansehen →
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
