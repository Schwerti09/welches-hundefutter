// Ehrliche Datums-Quellen (Roadmap 4.3).
//
// Regel: KEIN `new Date()` in `dateModified` — das lügt bei jedem Build und ist
// ein Freshness-Gaming-Signal. Content-Seiten nutzen ein echtes Redaktionsdatum,
// datengetriebene Seiten das Deploy-Datum (= letzter Commit).

import { BUILD_DATE } from "./generated-build-date";

/**
 * Letzte substanzielle redaktionelle Überarbeitung der immergrünen Inhalte
 * (Ratgeber, Vergleiche, „warum BELLA" …). Hier zentral bumpen, wenn Texte
 * wirklich überarbeitet wurden — nicht automatisch.
 */
export const CONTENT_REVISED = "2026-06-01";

/**
 * Letzter Daten-Refresh = letzter Deploy (Git-Commit-Datum, per `prebuild`
 * erzeugt). Für Seiten, deren Wert aus Live-DB-Daten kommt: Preisanalysen,
 * Marken-Übersichten, Katalog-Datasets, dynamische Marken-Vergleiche.
 */
export const DATA_REFRESHED = BUILD_DATE;
