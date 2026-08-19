import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BELLA Handwerkerservice | Regional, persönlich, zuverlässig",
  description:
    "Moderner Handwerkerservice für Reparatur, Montage und Objektbetreuung. Regional vor Ort, fair kalkuliert und alles aus einer Hand.",
  alternates: {
    canonical: "/handwerkerservice",
  },
};

const SERVICES = [
  {
    title: "Reparieren",
    text: "Wir beheben Schäden sauber und nachhaltig – von kleinen Defekten bis zu komplexeren Instandsetzungen.",
  },
  {
    title: "Montieren",
    text: "Möbel, Einbauten, Technik und Ausstattung montieren wir präzise, sicher und termintreu.",
  },
  {
    title: "Verschönern",
    text: "Mit durchdachten Modernisierungen geben wir Wohn- und Gewerbeobjekten ein frisches, gepflegtes Erscheinungsbild.",
  },
  {
    title: "Objektbetreuung",
    text: "Regelmäßige Betreuung, klare Zuständigkeiten und schnelle Reaktion – ideal für Eigentümer und Verwalter.",
  },
];

const BENEFITS = [
  "Regional & persönlich: kurze Wege, feste Ansprechpartner",
  "Freundlicher & zuverlässiger Service mit klaren Zeitfenstern",
  "Faire und transparente Preise ohne versteckte Kosten",
  "Alles aus einer Hand – von der Anfrage bis zur Ausführung",
];

export default function HandwerkerservicePage() {
  return (
    <div className="min-h-screen text-[var(--ink)]">
      <main>
        <section className="px-5 pt-16 pb-14">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <span className="pill mb-5">Regionaler Handwerkerservice</span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Reparieren, montieren, verschönern –
                <span className="text-accent"> modern & zuverlässig.</span>
              </h1>
              <p className="text-[var(--muted)] text-base sm:text-lg mt-5 max-w-2xl leading-relaxed">
                BELLA Service unterstützt Privatkunden, Vermieter und Unternehmen bei allen typischen
                Arbeiten rund ums Objekt. Persönlich betreut, sauber ausgeführt und transparent kalkuliert.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#kontakt"
                  className="btn-primary rounded-xl px-6 py-3 text-sm sm:text-base"
                  aria-label="Zum Kontaktbereich springen"
                >
                  Jetzt unverbindlich anfragen
                </Link>
                <Link
                  href="#kontakt"
                  className="rounded-xl px-6 py-3 text-sm sm:text-base font-semibold border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Kontakt & Angaben
                </Link>
              </div>
            </div>

            <aside className="card rounded-3xl p-6 sm:p-7" aria-label="Schnellübersicht">
              <h2 className="text-xl font-bold mb-4">Warum Kunden mit uns arbeiten</h2>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                {BENEFITS.map((item) => (
                  <li key={item} className="flex gap-2 leading-relaxed">
                    <span className="text-accent">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="px-5 py-14 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Unsere Leistungen</h2>
            <p className="text-[var(--muted)] max-w-2xl mb-8">
              Ob Einzelauftrag oder laufende Objektpflege: Wir kombinieren Handwerk, Organisation und Service in einem klaren Ablauf.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {SERVICES.map((service) => (
                <article key={service.title} className="card card-hover rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed text-sm sm:text-base">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            <article className="card rounded-3xl p-7">
              <h2 className="text-2xl sm:text-3xl font-black mb-4">Über BELLA Service</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                Wir arbeiten bodenständig, digital organisiert und mit hoher Verbindlichkeit. Das Ergebnis:
                weniger Abstimmungsaufwand, schnellere Umsetzung und ein Service, der wirklich entlastet.
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                Unser Fokus liegt auf regionaler Präsenz, klarer Kommunikation und Qualität, die man sieht.
              </p>
            </article>

            <article id="kontakt" className="glass-strong rounded-3xl p-7">
              <h2 className="text-2xl sm:text-3xl font-black mb-3">Kontakt & nächster Schritt</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                Sende uns kurz dein Anliegen. Du erhältst eine ehrliche Ersteinschätzung und auf Wunsch ein
                transparentes Angebot.
              </p>
              <div className="space-y-3 text-sm sm:text-base">
                <p><strong>Kontaktweg:</strong> Direkt über unsere Angaben im Impressum</p>
                <p>
                  <strong>Einsatzgebiet:</strong> Norden, Landkreis Aurich & Ostfriesland
                </p>
              </div>
              <div className="mt-7">
                <Link href="/impressum" className="text-sm font-medium text-[var(--honey)] hover:underline">
                  Impressum & rechtliche Angaben
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
