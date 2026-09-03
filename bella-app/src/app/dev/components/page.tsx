import { notFound } from "next/navigation";
import BreedImg from "@/components/BreedImg";
import ThemeToggle from "@/components/ThemeToggle";
import BellaMascot from "@/components/bella/BellaMascot";

// Nicht-Prod Komponenten-Katalog (Roadmap 3.4 / 3.1). Zum Draufschauen vor/nach
// Design-Änderungen (Tokens, Light/Dark, Motion). Kein SEO, nicht verlinkt.
// Sichtbar in `npm run dev` ODER wenn NEXT_PUBLIC_DEV_PAGES=1 (visual.yml setzt das
// beim Build, damit die visuelle Regression diese Seite screenshotten kann).
// Auf der Live-Seite (Netlify, ohne Flag) → 404.
export const dynamic = "force-static";
export const metadata = { robots: { index: false, follow: false }, title: "Komponenten-Katalog (dev)" };

const DEV_PAGES_ENABLED =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEV_PAGES === "1";

// No-FOUC: gespeichertes Theme setzen, bevor gerendert wird.
const NO_FOUC = `try{var t=localStorage.getItem('bella-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-lg border border-[var(--border)]" style={{ background: value }} />
      <div className="text-xs">
        <div className="font-mono">{name}</div>
        <div className="text-[var(--text-muted)] font-mono">{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-4xl mx-auto px-5 py-8 border-b border-[var(--border)]">
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent)] mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsCatalog() {
  if (!DEV_PAGES_ENABLED) notFound();

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <script dangerouslySetInnerHTML={{ __html: NO_FOUC }} />
      <header className="max-w-4xl mx-auto px-5 pt-10 pb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="pill">🧪 dev · nicht indexiert</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Komponenten-Katalog</h1>
          <p className="mt-2 text-[var(--text-muted)] text-sm">Design-Primitive isoliert. Baseline für visuelle Regression (3.4), Token-Test für Light/Dark (3.1).</p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Semantische Tokens">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Swatch name="--bg" value="var(--bg)" />
          <Swatch name="--bg-2" value="var(--bg-2)" />
          <Swatch name="--surface" value="var(--surface)" />
          <Swatch name="--surface-raised" value="var(--surface-raised)" />
          <Swatch name="--text" value="var(--text)" />
          <Swatch name="--text-muted" value="var(--text-muted)" />
          <Swatch name="--border" value="var(--border)" />
          <Swatch name="--accent" value="var(--accent)" />
          <Swatch name="--accent-ink" value="var(--accent-ink)" />
          <Swatch name="--focus" value="var(--focus)" />
          <Swatch name="--honey / --honey-2" value="var(--honey)" />
          <Swatch name="--amber-glow" value="var(--amber-glow)" />
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Umschalter oben → „Hell". Live-Seite bleibt vorerst Dark; die site-weite Umstellung
          von <code>bg-white/x</code> / <code>text-white/x</code> auf diese Tokens ist der nächste Schritt.
        </p>
      </Section>

      <Section title="Typografie">
        <h1 className="text-4xl font-extrabold tracking-tight">Überschrift H1 — 4xl extrabold</h1>
        <h2 className="mt-3 text-2xl font-bold">Überschrift H2 — 2xl bold</h2>
        <h3 className="mt-3 text-lg font-semibold">Überschrift H3 — lg semibold</h3>
        <p className="mt-3 text-base">Fließtext — der Mops braucht anderes Futter als ein Husky. <span className="text-accent">text-accent-Verlauf</span>.</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Sekundärtext — sm, --text-muted.</p>
      </Section>

      <Section title="Buttons & Pills">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary">Primär-Button</button>
          <span className="pill">🐾 Pill</span>
          <button className="rounded-xl px-6 py-3 text-sm font-semibold border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--surface)] transition-colors">
            Sekundär-Button
          </button>
        </div>
      </Section>

      <Section title="Flächen">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="font-bold">.card</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">Verlaufs-Rand + Schatten.</p>
          </div>
          <div className="card card-hover p-5">
            <div className="font-bold">.card .card-hover</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">Hover: hebt sich, Honig-Rand.</p>
          </div>
          <div className="p-5 rounded-2xl border border-[var(--border)]" style={{ background: "var(--surface-raised)" }}>
            <div className="font-bold">--surface-raised</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">Token-Fläche (Light/Dark).</p>
          </div>
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

      <Section title="BELLA-Maskottchen (3.2)">
        <div className="flex flex-wrap items-end gap-8">
          {(["idle", "sniff", "found", "hmm"] as const).map((p) => (
            <div key={p} className="flex flex-col items-center gap-2">
              <BellaMascot pose={p} size={88} title={`BELLA ${p}`} />
              <code className="text-xs text-[var(--text-muted)]">{p}</code>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Reines SVG, server-renderbar, Token-Palette (Honig), Idle-Animation nur bei
          <code> prefers-reduced-motion: no-preference</code>. Im Einsatz: 404, Loading,
          Hundepass-Popup, Profil-Avatare.
        </p>
      </Section>

      <Section title="OG-Bild — Rasse (3.3)">
        <div className="max-w-xl overflow-hidden rounded-xl border border-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rasse/labrador-retriever/opengraph-image"
            alt="OG-Bild-Vorschau Labrador Retriever"
            width={1200}
            height={630}
            className="w-full h-auto"
          />
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          1200×630, Rassefoto + Name + BELLA-Marke. On-demand generiert (kein Prebuild für 186
          Rassen), dann 24&nbsp;h gecacht.
        </p>
      </Section>

      <Section title="Advisor-Bubbles (statisch)">
        <div className="max-w-md space-y-3">
          <div className="text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%]" style={{ background: "var(--surface)" }}>
            Hallo! Ich bin BELLA 🐕 — erzähl von deinem Hund: Rasse, Alter, Allergien?
          </div>
          <div className="text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%] ml-auto bg-orange-500/20">
            Deutscher Schäferhund, 31 kg, ausgewachsen, Hühnerallergie.
          </div>
        </div>
      </Section>
    </main>
  );
}
