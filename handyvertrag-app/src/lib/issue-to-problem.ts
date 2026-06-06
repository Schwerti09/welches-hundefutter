/**
 * Mappt Gesundheitsproblem-Texte (aus breeds.ts) auf Problem-Slugs.
 * Robust gegen Umlaute, Mojibake und Schreibvarianten.
 */

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/ü|ue|ã¼/g, "u")
    .replace(/ö|oe|ã¶/g, "o")
    .replace(/ä|ae|ã¤/g, "a")
    .replace(/ß|ss|ãÿ/g, "s")
    .replace(/ú|ù|û/g, "u")
    .replace(/[^a-z0-9]/g, "");
}

const RULES: [RegExp, string][] = [
  [/arthros/, "arthrose"],
  [/huftdys|ellenbog|gelenkdys|hip|dysplasie/, "gelenkprobleme"],
  [/gelenk/, "gelenkprobleme"],
  [/hautallerg|hautproblem|fell|haut/, "haut-und-fell"],
  [/allergi/, "allergie"],
  [/unvertragl|unvertr|intolera/, "futtermittelunvertraeglichkeit"],
  [/magen|darm|verdau|kolitis|pankrea/, "sensibler-magen"],
  [/pankreat|bauchspeich/, "pankreatitis"],
  [/ubergewi|fettleib|adips/, "uebergewicht"],
  [/untergewi|abmager/, "untergewicht"],
  [/nieren|renal/, "nierenprobleme"],
  [/leber|hepat/, "leberprobleme"],
  [/diabet|zuck/, "diabetes"],
  [/zahn|karies|periodont/, "zahnsteine"],
  [/durchfall|diarrh/, "durchfall"],
];

/** Gibt den Problem-Slug für einen Gesundheitstext zurück, oder null wenn kein Match. */
export function issueToProblemSlug(issue: string): string | null {
  const n = norm(issue);
  for (const [re, slug] of RULES) {
    if (re.test(n)) return slug;
  }
  return null;
}

/** Deduplizierte Problem-Slugs für eine Liste von Gesundheitsissues. */
export function issuesToProblemSlugs(issues: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const issue of issues) {
    const slug = issueToProblemSlug(issue);
    if (slug && !seen.has(slug)) { seen.add(slug); result.push(slug); }
  }
  return result;
}

/** Mapping: Problem-Slug → passende Futtertyp-Slugs (für Cross-Links). */
export const PROBLEM_TO_FUTTERTYPEN: Record<string, string[]> = {
  allergie: ["hypoallergen", "monoprotein", "getreidefrei", "insekten"],
  futtermittelunvertraeglichkeit: ["hypoallergen", "monoprotein", "getreidefrei"],
  "sensibler-magen": ["nassfutter", "kaltgepresst"],
  durchfall: ["nassfutter", "kaltgepresst"],
  uebergewicht: ["trockenfutter", "getreidefrei"],
  untergewicht: ["trockenfutter"],
  gelenkprobleme: ["trockenfutter", "nassfutter"],
  arthrose: ["trockenfutter", "nassfutter"],
  nierenprobleme: ["nassfutter"],
  leberprobleme: ["trockenfutter"],
  diabetes: ["trockenfutter", "getreidefrei"],
  pankreatitis: ["kaltgepresst"],
  "haut-und-fell": ["barf", "kaltgepresst", "monoprotein"],
  zahnsteine: ["trockenfutter"],
};

/** Mapping: Futtertyp-Slug → passende Problem-Slugs (für Cross-Links). */
export const FUTTERTYP_TO_PROBLEME: Record<string, string[]> = {
  trockenfutter: ["uebergewicht", "zahnsteine", "gelenkprobleme"],
  nassfutter: ["nierenprobleme", "sensibler-magen", "arthrose"],
  barf: ["allergie", "haut-und-fell", "futtermittelunvertraeglichkeit"],
  kaltgepresst: ["sensibler-magen", "pankreatitis", "haut-und-fell"],
  getreidefrei: ["allergie", "diabetes", "uebergewicht"],
  hypoallergen: ["allergie", "futtermittelunvertraeglichkeit"],
  monoprotein: ["allergie", "futtermittelunvertraeglichkeit", "haut-und-fell"],
  insekten: ["allergie", "futtermittelunvertraeglichkeit"],
  vegetarisch: ["allergie"],
  vegan: ["allergie"],
};
