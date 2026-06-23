// Begriffserklärung im BELLA-Chat → Vertiefungs-Link auf bestehende Ratgeber-Seiten.
// Nur Slugs, die als Route existieren (futtertypen.ts, problems.ts, lebensphase/[slug]).

export interface GlossaryLink {
  label: string;
  url: string;
}

interface TermRule {
  pattern: RegExp;
  label: string;
  url: string;
}

const TERM_RULES: TermRule[] = [
  { pattern: /\bbarf\b/i, label: "Was ist BARF?", url: "/futtertyp/barf" },
  { pattern: /trockenfutter/i, label: "Trockenfutter im Detail", url: "/futtertyp/trockenfutter" },
  { pattern: /nassfutter/i, label: "Nassfutter im Detail", url: "/futtertyp/nassfutter" },
  { pattern: /kaltgepresst/i, label: "Kaltgepresstes Futter", url: "/futtertyp/kaltgepresst" },
  { pattern: /getreidefrei|grain.?free/i, label: "Getreidefrei erklärt", url: "/futtertyp/getreidefrei" },
  { pattern: /hypoallergen/i, label: "Hypoallergenes Futter", url: "/futtertyp/hypoallergen" },
  { pattern: /monoprotein/i, label: "Monoprotein-Futter", url: "/futtertyp/monoprotein" },
  { pattern: /insektenprotein|insektenfutter/i, label: "Insektenfutter für Hunde", url: "/futtertyp/insekten" },
  { pattern: /vegetarisch/i, label: "Vegetarisches Hundefutter", url: "/futtertyp/vegetarisch" },
  { pattern: /\bvegan\b/i, label: "Veganes Hundefutter", url: "/futtertyp/vegan" },
  { pattern: /allergie|allergiker/i, label: "Futterallergien verstehen", url: "/problem/allergie" },
  { pattern: /unvertr[äa]glich/i, label: "Futtermittelunverträglichkeit", url: "/problem/futtermittelunvertraeglichkeit" },
  { pattern: /empfindlich(?:er)?\s*magen|sensib(?:el|ler)\s*magen/i, label: "Empfindlicher Magen", url: "/problem/sensibler-magen" },
  { pattern: /durchfall/i, label: "Durchfall beim Hund", url: "/problem/durchfall" },
  { pattern: /übergewicht|uebergewicht/i, label: "Übergewicht beim Hund", url: "/problem/uebergewicht" },
  { pattern: /gelenkproblem/i, label: "Gelenkprobleme & Futter", url: "/problem/gelenkprobleme" },
  { pattern: /arthrose/i, label: "Arthrose beim Hund", url: "/problem/arthrose" },
  { pattern: /nierenproblem|niereninsuffizienz/i, label: "Nierenprobleme & Futter", url: "/problem/nierenprobleme" },
  { pattern: /pankreatitis/i, label: "Pankreatitis beim Hund", url: "/problem/pankreatitis" },
  { pattern: /diabetes/i, label: "Diabetes beim Hund", url: "/problem/diabetes" },
  { pattern: /haut.{0,3}und.{0,3}fell|fellprobleme/i, label: "Haut & Fell", url: "/problem/haut-und-fell" },
  { pattern: /welpe/i, label: "Welpenfutter richtig wählen", url: "/lebensphase/welpen" },
  { pattern: /senior|ältere[rn]?\s+hund/i, label: "Futter für Senioren", url: "/lebensphase/senior" },
];

/** Scans text for known glossary terms and returns up to `max` deep-link suggestions. */
export function findGlossaryLinks(text: string, max = 2): GlossaryLink[] {
  const seen = new Set<string>();
  const out: GlossaryLink[] = [];
  for (const rule of TERM_RULES) {
    if (out.length >= max) break;
    if (seen.has(rule.url)) continue;
    if (rule.pattern.test(text)) {
      seen.add(rule.url);
      out.push({ label: rule.label, url: rule.url });
    }
  }
  return out;
}
