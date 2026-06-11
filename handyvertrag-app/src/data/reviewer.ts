// Tiermedizinischer Reviewer für die Gesundheitsratgeber.
// Wird erst befüllt, wenn ein echter Review-Vertrag mit einer/einem approbierten
// Tierärztin/Tierarzt steht. Bis dahin: REVIEWER = null — alle Badges, Schemata
// und die Profilseite rendern dann nichts. Ein Name ohne echten Review wäre
// derselbe Fake wie das frühere aggregateRating 4.8/247.

export interface ReviewedArticle {
  title: string;
  href: string;
  reviewedAt: string; // ISO-Datum (YYYY-MM-DD)
}

export interface Reviewer {
  name: string; // "Dr. med. vet. Vorname Nachname"
  slug: string; // "dr-vorname-nachname"
  title: string; // "Tierärztin, Zusatzbezeichnung Ernährungsberatung"
  approbation: string; // z. B. "Approbation als Tierärztin (Deutschland)"
  bio: string; // Werdegang, 2-3 Sätze
  imageUrl: string; // echtes Foto, mit Einverständnis
  profileUrl: string; // eigene Profilseite auf unserer Domain (/experten/[slug])
  sameAs: string[]; // Praxis-Website, LinkedIn, Publikationen
  reviewedArticles: ReviewedArticle[];
}

export const REVIEWER: Reviewer | null = null;
