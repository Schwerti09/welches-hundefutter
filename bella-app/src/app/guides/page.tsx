import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import AuthorBox from "@/components/AuthorBox";
import { FUTTERTYPEN } from "@/data/futtertypen";
import { PROBLEMS } from "@/data/problems";

export const metadata: Metadata = {
  title: "Ratgeber: Das richtige Hundefutter finden | BELLA",
  description: "Alle BELLA-Ratgeber an einem Ort: nach Lebensphase, Futtertyp oder gesundheitlichem Problem — plus über 1.400 Tipps. Datenbasiert, ohne Hersteller-Bias.",
  alternates: {
    canonical: "https://welches-hundefutter.today/guides",
    languages: {
      "de-DE": "https://welches-hundefutter.today/guides",
      "de-AT": "https://welches-hundefutter.today/guides",
      "de-CH": "https://welches-hundefutter.today/guides",
      "x-default": "https://welches-hundefutter.today/guides",
    },
  },
};

const LEBENSPHASEN = [
  { slug: "welpen", name: "Welpen", emoji: "🐶", tagline: "Höherer Energie- und Kalziumbedarf für gesundes Wachstum" },
  { slug: "junghund", name: "Junghund", emoji: "🦴", tagline: "Übergang vom Welpen- zum Erwachsenenfutter" },
  { slug: "adult", name: "Erwachsener Hund", emoji: "🐕", tagline: "Ausgewogenes Futter, Portionskontrolle gegen Übergewicht" },
  { slug: "senior", name: "Senior", emoji: "🐾", tagline: "Kalorienreduziert, gelenkfreundlich, leicht verdaulich" },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Ratgeber</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">📚 Ratgeber</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Das richtige Hundefutter finden
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl">
          Wähle einen Einstiegspunkt — nach Lebensphase, Futtertyp oder gesundheitlichem
          Thema — oder lass dich von BELLA in 5 Fragen direkt zu 3 passenden Sorten führen.
        </p>
        <Link href="/tools/futter-finder" className="inline-block mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold bg-[var(--honey)] text-black hover:opacity-90 transition-opacity">
          Zum Futter-Finder →
        </Link>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Nach Lebensphase</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {LEBENSPHASEN.map((p) => (
            <Link key={p.slug} href={`/lebensphase/${p.slug}`} className="card card-hover p-5 block">
              <div className="text-2xl mb-2">{p.emoji}</div>
              <h3 className="font-bold text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Nach Futtertyp</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FUTTERTYPEN.map((f) => (
            <Link key={f.slug} href={`/futtertyp/${f.slug}`} className="card card-hover p-5 block">
              <div className="text-2xl mb-2">{f.emoji}</div>
              <h3 className="font-bold text-sm mb-1">{f.name}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{f.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Bei gesundheitlichen Themen</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PROBLEMS.map((p) => (
            <Link key={p.slug} href={`/problem/${p.slug}`} className="card card-hover p-4 block">
              <h3 className="font-bold text-sm">{p.name}</h3>
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Kaufen & Bestellen</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/hundefutter-online-kaufen" className="card card-hover p-5 block">
            <div className="text-2xl mb-2">🛒</div>
            <h3 className="font-bold text-sm mb-1">Online kaufen</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Günstig bestellen, ohne Abo-Zwang</p>
          </Link>
          <Link href="/hundefutter-abo" className="card card-hover p-5 block">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-bold text-sm mb-1">Abo-Modelle</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Lohnt sich das wirklich? Ehrliche Einordnung</p>
          </Link>
          <Link href="/probierpakete-hundefutter" className="card card-hover p-5 block">
            <div className="text-2xl mb-2">🎁</div>
            <h3 className="font-bold text-sm mb-1">Probierpakete</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">Testen, bevor der große Sack kommt</p>
          </Link>
          <Link href="/hochwertiges-hundefutter" className="card card-hover p-5 block">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold text-sm mb-1">Hochwertig erkennen</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">4 messbare Kriterien, nicht der Preis</p>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight mb-1">Über 1.400 Tipps</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Kompakte Antworten zu Ernährung, Training, Gesundheit und Alltag — in 14 Kategorien sortiert.
            </p>
          </div>
          <Link href="/tipps" className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold bg-[var(--honey)] text-black hover:opacity-90 transition-opacity">
            Tipps durchsuchen →
          </Link>
        </div>
      </section>

      <AuthorBox />
      <SiteFooter />
    </div>
  );
}
