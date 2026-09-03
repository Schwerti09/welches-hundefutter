import { notFound } from "next/navigation";
import BreedImg from "@/components/BreedImg";

// Nicht-Prod Komponenten-Katalog (Roadmap 3.4). Zum Draufschauen vor/nach
// Design-Änderungen (Tokens, Light/Dark, Motion). Kein SEO, nicht verlinkt.
export const dynamic = "force-static";

export const metadata = { robots: { index: false, follow: false }, title: "Komponenten-Katalog (dev)" };

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-lg border border-white/15" style={{ background: value }} />
      <div className="text-xs">
        <div className="font-mono">{name}</div>
        <div className="text-[var(--muted)] font-mono">{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-4xl mx-auto px-5 py-8 border-b border-white/10">
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--honey)] mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsCatalog() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen text-[var(--ink)]">
      <header className="max-w-4xl mx-auto px-5 pt-10 pb-4">
        <span className="pill">🧪 dev · nicht indexiert</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Komponenten-Katalog</h1>
        <p className="mt-2 text-[var(--muted)] text-sm">Design-Primitive isoliert. Baseline für visuelle Regression (Roadmap 3.4).</p>
      </header>

      <Section title="Farb-Tokens (CSS-Variablen)">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Swatch name="--bg" value="var(--bg)" />
          <Swatch name="--bg-2" value="var(--bg-2)" />
          <Swatch name="--surface" value="var(--surface)" />
          <Swatch name="--ink" value="var(--ink)" />
          <Swatch name="--muted" value="var(--muted)" />
          <Swatch name="--line" value="var(--line)" />
          <Swatch name="--honey" value="var(--honey)" />
          <Swatch name="--honey-2" value="var(--honey-2)" />
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Roadmap 3.1: semantische Tokens (`--surface-raised`, `--text-muted`, `--accent-ink`, `--border`, `--focus`) + Light-Palette + Umschalter.
        </p>
      </Section>

      <Section title="Typografie">
        <h1 className="text-4xl font-extrabold tracking-tight">Überschrift H1 — 4xl extrabold</h1>
        <h2 className="mt-3 text-2xl font-bold">Überschrift H2 — 2xl bold</h2>
        <h3 className="mt-3 text-lg font-semibold">Überschrift H3 — lg semibold</h3>
        <p className="mt-3 text-base">Fließtext — der Mops braucht anderes Futter als ein Husky. <span className="text-accent">text-accent-Verlauf</span>.</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Sekundärtext — sm, --muted.</p>
      </Section>

      <Section title="Buttons & Pills">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary">Primär-Button</button>
          <a className="btn-primary text-sm">Primär (a, sm)</a>
          <span className="pill">🐾 Pill</span>
          <button className="rounded-xl px-6 py-3 text-sm font-semibold border border-white/15 text-[var(--honey)] hover:bg-white/5 transition-colors">
            Sekundär-Button
          </button>
        </div>
      </Section>

      <Section title="Flächen">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="font-bold">.card</div>
            <p className="text-xs text-[var(--muted)] mt-1">Verlaufs-Rand + Schatten.</p>
          </div>
          <div className="card card-hover p-5">
            <div className="font-bold">.card .card-hover</div>
            <p className="text-xs text-[var(--muted)] mt-1">Hover: hebt sich, Honig-Rand.</p>
          </div>
          <div className="glass p-5 rounded-2xl">
            <div className="font-bold">.glass</div>
            <p className="text-xs text-[var(--muted)] mt-1">Backdrop-Blur.</p>
          </div>
        </div>
        <div className="glass-strong p-6 rounded-2xl mt-4">
          <div className="font-bold">.glass-strong</div>
          <p className="text-xs text-[var(--muted)] mt-1">Stärkerer Blur, dunklere Basis.</p>
        </div>
      </Section>

      <Section title="BreedImg (mit Fallback)">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <BreedImg src="/breeds/labrador-retriever.jpg" alt="Labrador Retriever" wrapperClassName="w-full h-28 rounded-xl" />
          <BreedImg src="/breeds/mops.jpg" alt="Mops" wrapperClassName="w-full h-28 rounded-xl" />
          <BreedImg src="/breeds/GIBT-ES-NICHT.jpg" alt="Fehlt → Emoji-Fallback" wrapperClassName="w-full h-28 rounded-xl" />
          <BreedImg src={undefined} alt="Kein src → Emoji-Fallback" wrapperClassName="w-full h-28 rounded-xl" />
        </div>
      </Section>

      <Section title="Advisor-Bubbles (statisch)">
        <div className="max-w-md space-y-3">
          <div className="text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%] bg-white/5 text-white/85">
            Hallo! Ich bin BELLA 🐕 — erzähl von deinem Hund: Rasse, Alter, Allergien?
          </div>
          <div className="text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%] ml-auto bg-orange-500/20 text-white">
            Deutscher Schäferhund, 31 kg, ausgewachsen, Hühnerallergie.
          </div>
        </div>
      </Section>
    </main>
  );
}
