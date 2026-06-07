// Datenmodell für die 100-Tipps-Seiten (/tipps + /tipps/[slug])
//
// Ein TipEntry ist bewusst ein Tuple, damit die ~1400 Einträge kompakt bleiben
// und die Datei klein verschickt werden kann:
//   [nummer, titel, beschreibung, level, tags]
//
// level: 0 = Einsteiger · 1 = Fortgeschritten · 2 = Profi
export type TipLevel = 0 | 1 | 2;

export type TipEntry = [
  number, // fortlaufende Nummer 1..100 innerhalb der Kategorie
  string, // kurzer, konkreter Titel
  string, // 1–2 Sätze Erklärung (Du-Form, kein Heilversprechen)
  TipLevel,
  string[] // 1–4 Tags für Filter/Suche
];

export interface TipCategory {
  slug: string;
  title: string; // z. B. "Hund abnehmen"
  headline: string; // H1 / SEO-Headline
  description: string; // Meta-Description + Intro-Teaser
  icon: string; // Emoji
  accent: string; // Tailwind-/CSS-Farbe für Theming, z. B. "#f0a73c"
  intro: string; // 2–4 Sätze Einleitung über der Liste
  tips: TipEntry[]; // 100 Einträge
}

export const TIP_LEVELS: Record<TipLevel, { label: string; color: string }> = {
  0: { label: "Einsteiger", color: "#34d399" },
  1: { label: "Fortgeschritten", color: "#f0a73c" },
  2: { label: "Profi", color: "#ff6b6b" },
};
