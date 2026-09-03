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

// Erweiterter Typ für vollständige Tipp-Artikel mit Bild, SEO und Geo
export interface TipArticle {
  id: number; // fortlaufende Nummer 1..100 innerhalb der Kategorie
  slug: string; // URL-slug für /tipps/[category]/[slug]
  title: string; // kurzer, konkreter Titel
  shortDescription: string; // 1–2 Sätze Erklärung (für Übersicht)
  level: TipLevel;
  tags: string[]; // 1–4 Tags für Filter/Suche
  // Vollständiger Artikel-Content
  imageUrl: string; // Bild-URL (relativ oder absolut)
  imageAlt: string; // Alt-Text für SEO
  content: string; // Vollständiger Artikel-Text (1000+ Wörter, Markdown)
  // SEO
  seoTitle: string; // Meta-Title (60-70 Zeichen)
  seoDescription: string; // Meta-Description (150-160 Zeichen)
  keywords: string[]; // SEO-Keywords
  // Geo-Elemente
  geoRelevant: boolean; // Ist dieser Tipp regional relevant?
  relevantCities?: string[]; // Städte/Regionen für Geo-SEO
  // Verlinkungen
  internalLinks: string[]; // Interne Links zu anderen Tipps/Seiten
  relatedTips?: number[]; // IDs verwandter Tipps
  // Meta
  readingTime: number; // Lesedauer in Minuten
  lastUpdated: string; // ISO-DateString
}

// Export als Type für TypeScript-Kompatibilität
export type TipArticleType = TipArticle;

export interface TipCategory {
  slug: string;
  title: string; // z. B. "Hund abnehmen"
  headline: string; // H1 / SEO-Headline
  description: string; // Meta-Description + Intro-Teaser
  icon: string; // Emoji
  accent: string; // Tailwind-/CSS-Farbe für Theming, z. B. "#f0a73c"
  intro: string; // 2–4 Sätze Einleitung über der Liste
  tips: TipEntry[]; // 100 Einträge (kompakte Liste für Übersicht)
  articles?: TipArticle[]; // Volle Artikel (optional, für Detailseiten)
}

export const TIP_LEVELS: Record<TipLevel, { label: string; color: string }> = {
  0: { label: "Einsteiger", color: "#34d399" },
  1: { label: "Fortgeschritten", color: "#f0a73c" },
  2: { label: "Profi", color: "#ff6b6b" },
};
