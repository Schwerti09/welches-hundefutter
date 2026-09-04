// Interner Themen-Cluster-Graph (Roadmap 4.4).
//
// Zweck: bewusste, kuratierte Hub→Spoke→Sibling-Verlinkung, die Autorität auf
// die Money-Keywords bündelt — statt „erste 8 aus dem Array". Der alte
// `PROBLEMS.slice(0, 8)` ließ `/problem/leberprobleme` etc. verwaisen.
//
// Regeln pro Liste: 4–7 Einträge, gemischte Typen (Geschwister-Problem +
// Futtertyp + Vergleich + Tipp-Kategorie), jeder Money-Slug taucht in ≥ 3
// anderen Listen auf. Prüfbar mit `npm run audit:links`.

export interface RelatedLink {
  href: string;
  label: string;
}

/** Verwandte Seiten je `/problem/[slug]`. */
export const PROBLEM_CLUSTER: Record<string, RelatedLink[]> = {
  allergie: [
    { href: "/problem/futtermittelunvertraeglichkeit", label: "Futtermittelunverträglichkeit" },
    { href: "/problem/haut-und-fell", label: "Haut & Fell" },
    { href: "/futtertyp/hypoallergen", label: "Hypoallergenes Futter" },
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/vergleich/getreidefrei-vs-mit-getreide", label: "Getreidefrei vs. mit Getreide" },
    { href: "/tipps/allergien", label: "100 Tipps bei Allergien" },
  ],
  futtermittelunvertraeglichkeit: [
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/problem/durchfall", label: "Durchfall" },
    { href: "/problem/haut-und-fell", label: "Haut & Fell" },
    { href: "/futtertyp/hypoallergen", label: "Hypoallergenes Futter" },
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/tipps/allergien", label: "100 Tipps bei Allergien" },
  ],
  "sensibler-magen": [
    { href: "/problem/durchfall", label: "Durchfall" },
    { href: "/problem/futtermittelunvertraeglichkeit", label: "Unverträglichkeit" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/untergewicht", label: "Untergewicht" },
    { href: "/problem/pankreatitis", label: "Pankreatitis" },
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/tipps/verdauung", label: "100 Tipps zur Verdauung" },
  ],
  durchfall: [
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/problem/pankreatitis", label: "Pankreatitis" },
    { href: "/problem/futtermittelunvertraeglichkeit", label: "Unverträglichkeit" },
    { href: "/problem/haut-und-fell", label: "Haut & Fell" },
    { href: "/problem/untergewicht", label: "Untergewicht" },
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/tipps/verdauung", label: "100 Tipps zur Verdauung" },
  ],
  uebergewicht: [
    { href: "/problem/untergewicht", label: "Untergewicht" },
    { href: "/problem/diabetes", label: "Diabetes" },
    { href: "/problem/gelenkprobleme", label: "Gelenkprobleme" },
    { href: "/problem/arthrose", label: "Arthrose" },
    { href: "/problem/zahnsteine", label: "Zahnstein" },
    { href: "/vergleich/premium-vs-budget", label: "Premium vs. Budget" },
    { href: "/tipps/abnehmen", label: "100 Tipps zum Abnehmen" },
  ],
  untergewicht: [
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/futtertyp/barf", label: "BARF" },
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/tipps/ernaehrung", label: "100 Tipps zur Ernährung" },
  ],
  gelenkprobleme: [
    { href: "/problem/arthrose", label: "Arthrose" },
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/lebensphase/senior", label: "Seniorfutter" },
    { href: "/futtertyp/kaltgepresst", label: "Kaltgepresstes Futter" },
    { href: "/tipps/senior-hund", label: "100 Tipps für Senioren" },
  ],
  arthrose: [
    { href: "/problem/gelenkprobleme", label: "Gelenkprobleme" },
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/problem/nierenprobleme", label: "Nierenprobleme" },
    { href: "/problem/zahnsteine", label: "Zahnstein" },
    { href: "/lebensphase/senior", label: "Seniorfutter" },
    { href: "/tipps/senior-hund", label: "100 Tipps für Senioren" },
  ],
  nierenprobleme: [
    { href: "/problem/leberprobleme", label: "Leberprobleme" },
    { href: "/problem/pankreatitis", label: "Pankreatitis" },
    { href: "/problem/arthrose", label: "Arthrose" },
    { href: "/problem/gelenkprobleme", label: "Gelenkprobleme" },
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/lebensphase/senior", label: "Seniorfutter" },
  ],
  leberprobleme: [
    { href: "/problem/nierenprobleme", label: "Nierenprobleme" },
    { href: "/problem/pankreatitis", label: "Pankreatitis" },
    { href: "/problem/diabetes", label: "Diabetes" },
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/tipps/gesundheit", label: "100 Tipps zur Gesundheit" },
  ],
  diabetes: [
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/problem/leberprobleme", label: "Leberprobleme" },
    { href: "/problem/pankreatitis", label: "Pankreatitis" },
    { href: "/problem/zahnsteine", label: "Zahnstein" },
    { href: "/futtertyp/getreidefrei", label: "Getreidefreies Futter" },
    { href: "/tipps/abnehmen", label: "100 Tipps zum Abnehmen" },
  ],
  pankreatitis: [
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/problem/durchfall", label: "Durchfall" },
    { href: "/problem/leberprobleme", label: "Leberprobleme" },
    { href: "/problem/nierenprobleme", label: "Nierenprobleme" },
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/tipps/verdauung", label: "100 Tipps zur Verdauung" },
  ],
  "haut-und-fell": [
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/futtermittelunvertraeglichkeit", label: "Unverträglichkeit" },
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/vergleich/insektenfutter-vs-huehnchen", label: "Insekt vs. Huhn" },
    { href: "/tipps/fell-haut", label: "100 Tipps für Fell & Haut" },
  ],
  zahnsteine: [
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/problem/diabetes", label: "Diabetes" },
    { href: "/futtertyp/trockenfutter", label: "Trockenfutter" },
    { href: "/vergleich/trockenfutter-vs-nassfutter", label: "Trocken vs. Nass" },
    { href: "/tipps/zaehne", label: "100 Tipps für die Zähne" },
  ],
};

/** Fallback, falls ein Slug (noch) nicht im Cluster steht. */
export function relatedForProblem(slug: string): RelatedLink[] {
  return PROBLEM_CLUSTER[slug] ?? [
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/tipps/gesundheit", label: "100 Tipps zur Gesundheit" },
  ];
}
