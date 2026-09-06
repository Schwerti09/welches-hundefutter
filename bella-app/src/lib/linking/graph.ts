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

/** Verwandte Seiten je `/futtertyp/[slug]` (Roadmap 4.4 Teil 2). */
export const FUTTERTYP_CLUSTER: Record<string, RelatedLink[]> = {
  trockenfutter: [
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/futtertyp/kaltgepresst", label: "Kaltgepresstes Futter" },
    { href: "/vergleich/trockenfutter-vs-nassfutter", label: "Trocken vs. Nass" },
    { href: "/vergleich/kaltgepresst-vs-extrudiert", label: "Kaltgepresst vs. extrudiert" },
    { href: "/problem/zahnsteine", label: "Zahnstein" },
    { href: "/tipps/zaehne", label: "100 Tipps für die Zähne" },
  ],
  nassfutter: [
    { href: "/futtertyp/trockenfutter", label: "Trockenfutter" },
    { href: "/futtertyp/barf", label: "BARF" },
    { href: "/vergleich/trockenfutter-vs-nassfutter", label: "Trocken vs. Nass" },
    { href: "/vergleich/nassfutter-vs-barf", label: "Nassfutter vs. BARF" },
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/tipps/hydration", label: "100 Tipps zur Flüssigkeitsversorgung" },
  ],
  barf: [
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/vergleich/barf-vs-trockenfutter", label: "BARF vs. Trockenfutter" },
    { href: "/vergleich/nassfutter-vs-barf", label: "Nassfutter vs. BARF" },
    { href: "/problem/untergewicht", label: "Untergewicht" },
    { href: "/tipps/barf", label: "100 BARF-Tipps" },
  ],
  kaltgepresst: [
    { href: "/futtertyp/trockenfutter", label: "Trockenfutter" },
    { href: "/vergleich/kaltgepresst-vs-extrudiert", label: "Kaltgepresst vs. extrudiert" },
    { href: "/problem/sensibler-magen", label: "Sensibler Magen" },
    { href: "/problem/gelenkprobleme", label: "Gelenkprobleme" },
    { href: "/tipps/verdauung", label: "100 Tipps zur Verdauung" },
  ],
  getreidefrei: [
    { href: "/futtertyp/hypoallergen", label: "Hypoallergenes Futter" },
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/vergleich/getreidefrei-vs-mit-getreide", label: "Getreidefrei vs. mit Getreide" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/haut-und-fell", label: "Haut & Fell" },
    { href: "/tipps/allergien", label: "100 Tipps bei Allergien" },
  ],
  hypoallergen: [
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/futtertyp/getreidefrei", label: "Getreidefreies Futter" },
    { href: "/futtertyp/insekten", label: "Insektenfutter" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/futtermittelunvertraeglichkeit", label: "Unverträglichkeit" },
    { href: "/tipps/allergien", label: "100 Tipps bei Allergien" },
  ],
  monoprotein: [
    { href: "/futtertyp/hypoallergen", label: "Hypoallergenes Futter" },
    { href: "/futtertyp/insekten", label: "Insektenfutter" },
    { href: "/vergleich/monoprotein-vs-mehrkomponenten", label: "Mono- vs. Mehrkomponenten" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/problem/haut-und-fell", label: "Haut & Fell" },
    { href: "/tipps/fell-haut", label: "100 Tipps für Fell & Haut" },
  ],
  insekten: [
    { href: "/futtertyp/monoprotein", label: "Monoprotein-Futter" },
    { href: "/futtertyp/hypoallergen", label: "Hypoallergenes Futter" },
    { href: "/vergleich/insektenfutter-vs-huehnchen", label: "Insekt vs. Huhn" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/tipps/allergien", label: "100 Tipps bei Allergien" },
  ],
  vegetarisch: [
    { href: "/futtertyp/vegan", label: "Veganes Hundefutter" },
    { href: "/futtertyp/insekten", label: "Insektenfutter" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/tipps/ernaehrung", label: "100 Tipps zur Ernährung" },
  ],
  vegan: [
    { href: "/futtertyp/vegetarisch", label: "Vegetarisches Hundefutter" },
    { href: "/futtertyp/insekten", label: "Insektenfutter" },
    { href: "/problem/allergie", label: "Futtermittelallergie" },
    { href: "/tipps/ernaehrung", label: "100 Tipps zur Ernährung" },
  ],
};

export function relatedForFuttertyp(slug: string): RelatedLink[] {
  return FUTTERTYP_CLUSTER[slug] ?? [
    { href: "/futtertyp/trockenfutter", label: "Trockenfutter" },
    { href: "/futtertyp/nassfutter", label: "Nassfutter" },
    { href: "/futtertyp/barf", label: "BARF" },
    { href: "/vergleich/trockenfutter-vs-nassfutter", label: "Trocken vs. Nass" },
  ];
}

/** Verwandte Seiten je `/lebensphase/[slug]` (Roadmap 4.4 Teil 2). */
export const LEBENSPHASE_CLUSTER: Record<string, RelatedLink[]> = {
  welpen: [
    { href: "/lebensphase/junghund", label: "Junghund" },
    { href: "/lebensphase/adult", label: "Erwachsener Hund" },
    { href: "/futtertyp/trockenfutter", label: "Trockenfutter" },
    { href: "/problem/durchfall", label: "Durchfall" },
    { href: "/tipps/welpen", label: "100 Welpen-Tipps" },
  ],
  junghund: [
    { href: "/lebensphase/welpen", label: "Welpen" },
    { href: "/lebensphase/adult", label: "Erwachsener Hund" },
    { href: "/futtertyp/barf", label: "BARF" },
    { href: "/tipps/sport-bewegung", label: "100 Tipps zu Sport & Bewegung" },
    { href: "/tipps/ernaehrung", label: "100 Tipps zur Ernährung" },
  ],
  adult: [
    { href: "/lebensphase/junghund", label: "Junghund" },
    { href: "/lebensphase/senior", label: "Senior" },
    { href: "/problem/uebergewicht", label: "Übergewicht" },
    { href: "/futtertyp/trockenfutter", label: "Trockenfutter" },
    { href: "/vergleich/premium-vs-budget", label: "Premium vs. Budget" },
    { href: "/tipps/ernaehrung", label: "100 Tipps zur Ernährung" },
  ],
  senior: [
    { href: "/lebensphase/adult", label: "Erwachsener Hund" },
    { href: "/problem/gelenkprobleme", label: "Gelenkprobleme" },
    { href: "/problem/arthrose", label: "Arthrose" },
    { href: "/problem/nierenprobleme", label: "Nierenprobleme" },
    { href: "/futtertyp/kaltgepresst", label: "Kaltgepresstes Futter" },
    { href: "/tipps/senior-hund", label: "100 Tipps für Senioren" },
  ],
};

export function relatedForLebensphase(slug: string): RelatedLink[] {
  return LEBENSPHASE_CLUSTER[slug] ?? [
    { href: "/lebensphase/welpen", label: "Welpen" },
    { href: "/lebensphase/adult", label: "Erwachsener Hund" },
    { href: "/lebensphase/senior", label: "Senior" },
    { href: "/tipps/ernaehrung", label: "100 Tipps zur Ernährung" },
  ];
}
