/**
 * Intent-Parsing für den BELLA-Berater — regelbasiert, deterministisch.
 * Aus src/app/api/advisor/chat/route.ts ausgelagert (Roadmap Op 1.4), damit
 * es testbar ist. Der LLM-gestützte Ersatz kommt in Op 2.1 — bis dahin
 * Verhalten unverändert.
 */

export type FoodType = "trocken" | "nass" | "barf" | "snack" | "kaltgepresst";
export type LifePhase = "welpen" | "adult" | "senior";

export interface DogIntent {
  foodType?: FoodType;
  lifePhase?: LifePhase;
  sensitive?: boolean; // Allergie / empfindlicher Magen
  grainFree?: boolean;
  protein?: string; // bevorzugtes Protein, z. B. "Lachs"
  breed?: string; // erwähnte Rasse (für Mengen-Hinweis)
  maxPricePerKg?: number; // Budget €/kg
  currentFood?: string; // aktuelles Futter (Marke oder "bekannt")
  wantToSwitch?: boolean; // möchte Futter wechseln
  switchReason?: string; // Grund für Wechsel ("vertraegt nicht", "mag nicht", "besser", "teuer")
}

export type AdvisorTheme = "idle" | "budget" | "allergie" | "welpe" | "senior" | "barf" | "premium";

type HistoryEntry = { role: string; content: string };

// Häufigste Rassen zuerst (kurze Alltagsnamen), gefolgt von allen weiteren ~170
// Rassen aus @/data/breeds.ts (volle Namen, lowercase) für eine vollständige
// Rasse-Erkennung über alle 186 Rassen der Plattform.
// TODO (Op 2.1): aus @/data/breeds.ts ableiten statt Kopie.
export const BREEDS = ["labrador", "schäferhund", "chihuahua", "dackel", "golden retriever", "französische bulldogge",
  "mops", "beagle", "boxer", "border collie", "australian shepherd", "rottweiler", "husky", "pudel",
  "jack russell", "yorkshire", "malteser", "spitz", "dobermann", "berner sennenhund",
  "affenpinscher", "afghane", "airedale terrier", "akita inu",
  "alaskan klee kai", "alaskan malamute", "american akita", "american bulldog",
  "american bully", "american staffordshire terrier", "aussiedoodle", "australian cattle dog",
  "australian kelpie", "azawakh", "barsoi", "basenji",
  "basset hound", "bearded collie", "beauceron", "belgischer schäferhund groenendael",
  "belgischer schäferhund malinois", "belgischer schäferhund tervueren", "berger blanc suisse", "bernedoodle",
  "bernhardiner", "bichon frisé", "bluthund", "bobtail",
  "bolonka zwetna", "bordeauxdogge", "border terrier", "boston terrier",
  "bouvier des flandres", "bracco italiano", "briard", "brusseler griffon",
  "bull terrier", "bullmastiff", "cairn terrier", "cane corso",
  "cardigan welsh corgi", "cavalier king charles spaniel", "cavapoo", "chesapeake bay retriever",
  "chiweenie", "chow-chow", "cockapoo", "cocker spaniel",
  "corgidor", "coton de tulear", "curly coated retriever", "dalmatiner",
  "deutsch drahthaar", "deutsch kurzhaar", "deutsche dogge", "deutscher schäferhund",
  "dogo argentino", "drahthaar fox terrier", "englische bulldogge", "englischer mastiff",
  "english setter", "english springer spaniel", "epagneul breton", "eurasier",
  "finnischer lapphund", "finnischer spitz", "flat coated retriever", "galgo espanol",
  "golden labrador", "goldendoodle", "gordon setter", "greyhound",
  "grosser muensterlaender", "großspitz", "havaneser", "hovawart",
  "husky mix", "irischer wasserspaniel", "irischer wolfshund", "irish setter",
  "irish terrier", "islaendischer schaefer", "jack russell terrier", "jackabee",
  "japanischer spitz", "japanisches chin", "jindo", "kanaan-hund",
  "kangal", "kaukasischer owtscharka", "kleiner italienischer windhund", "kleiner münsterländer",
  "kleinspitz", "komondor", "korthals griffon", "kuvasz",
  "labradoodle", "labrador retriever", "lagotto romagnolo", "landseer",
  "langhaardackel", "leonberger", "lhasa apso", "löwchen",
  "magyar vizsla", "maltese shih tzu", "maltipoo", "miniatur bull terrier",
  "miniature american shepherd", "miniaturschnauzer", "mischling", "morkie",
  "mudi", "neapolitanischer mastiff", "neufundländer", "niederlaendischer schaeferhund",
  "norsk elkhund", "nova scotia duck tolling retriever", "otterhound", "papillon",
  "parson russell terrier", "pekinese", "petit basset griffon vendeen", "pharaonenhund",
  "podenco ibicenco", "pointer", "pomeranian", "zwergspitz",
  "pomsky", "portugiesischer wasserhund", "presa canario", "puggle",
  "puli", "rauhaardackel", "rhodesian ridgeback", "riesenschnauzer",
  "rough collie", "saarloos wolfhund", "saluki", "samojede",
  "schnauzer", "schnoodle", "schottischer deerhound", "schwarzer russischer terrier",
  "schwedischer lapphund", "schäferhund-labrador mix", "scottish terrier", "shetland sheepdog",
  "shiba inu", "shih tzu", "siberian husky", "sloughi",
  "soft coated wheaten terrier", "springador", "staffordshire bullterrier", "thai ridgeback",
  "tibetischer mastiff", "tibetischer spaniel", "tibetischer terrier", "weimaraner",
  "welsh corgi", "welsh springer spaniel", "welsh terrier", "west highland white terrier",
  "whippet", "wolfsspitz", "yorkipoo", "yorkshire terrier",
  "zwerg-dackel", "zwergpinscher"];

export function parseIntent(message: string, history: HistoryEntry[]): DogIntent {
  // NFC zuerst: iOS/macOS liefern Umlaute oft zerlegt (u + ◌̈, NFD). Ohne Normalisierung
  // matcht /ü/ das nicht → "Hühnerallergie" würde nicht als Huhn erkannt → Allergiker
  // bekäme Huhn empfohlen. Tier-Sicherheit: NIE auf stiller Normalisierung beruhen.
  //
  // WICHTIG: Nur User-Nachrichten verwenden — Assistenten-Nachrichten enthalten
  // Fragewörter wie "Ist dein Hund ein Welpe?" die den Lebensphase-Regex fälschlich
  // triggern und die Intent-Erkennung korrumpieren.
  const userOnly = history.filter(h => h.role === "user").map(h => h.content);
  const all = [...userOnly, message].join(" ").normalize("NFC").toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  const intent: DogIntent = {};

  // Lebensphase
  if (/welpe|junior|puppy|baby/.test(all)) intent.lifePhase = "welpen";
  else if (/senior|\balt(er)?\b|aelter|ageing|aging|7\+|8\+/.test(all)) intent.lifePhase = "senior";
  else if (/adult|erwachsen/.test(all)) intent.lifePhase = "adult";

  // Futtertyp
  if (/barf|roh\b|frischfleisch|frostfutter/.test(all)) intent.foodType = "barf";
  else if (/nassfutter|nass\b|dose|dosen|feucht|menue|pastete/.test(all)) intent.foodType = "nass";
  else if (/snack|leckerli|leckerchen|kausnack|kauknochen|kaustange/.test(all)) intent.foodType = "snack";
  else if (/trockenfutter|trocken|kroketten/.test(all)) intent.foodType = "trocken";

  // Allergie / Sensibilität
  if (/allergi|sensibel|empfindlich|unvertraeglich|juckt|juckreiz|durchfall|blaeh|magen|verdauung|sensitiv/.test(all)) intent.sensitive = true;
  if (/getreidefrei|grain.?free|glutenfrei/.test(all)) { intent.grainFree = true; intent.sensitive = true; }

  // Protein/Allergen — beachte: `all` ist umlaut-normalisiert (ü→ue), daher
  // "Hühnerallergie" → "huehnerallergie". Varianten "huehn"/"gefluegel" mitfangen.
  for (const [k, lab] of [["huehn", "Huhn"], ["huhn", "Huhn"], ["haehnchen", "Huhn"], ["gefluegel", "Huhn"],
    ["rind", "Rind"], ["lachs", "Lachs"], ["lamm", "Lamm"], ["ente", "Ente"], ["pute", "Pute"],
    ["wild", "Wild"], ["fisch", "Fisch"], ["kaninchen", "Kaninchen"], ["pferd", "Pferd"]] as [string, string][]) {
    if (new RegExp(`\\b${k}`).test(all)) { intent.protein = lab; break; }
  }

  // Rasse
  for (const b of BREEDS) {
    const bNorm = b.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
    if (all.includes(bNorm)) { intent.breed = b; break; }
  }

  // Budget €/kg
  const ppk = all.match(/(?:unter|max(?:imal)?|bis zu?|hoechstens|<)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|euro)?\s*(?:\/|pro|je)?\s*kg/);
  if (ppk) intent.maxPricePerKg = parseFloat(ppk[1].replace(",", "."));
  else if (/guenstig|billig|sparen|preiswert|wenig geld|kleines budget/.test(all)) intent.maxPricePerKg = intent.maxPricePerKg ?? 6;

  // Aktuelles Futter — erkennt ob Nutzer aktuelles Futter erwähnt (mit oder ohne Markenname)
  const currentFoodCtx = /frisst|bekommt|gebe (ihm|ihr)|fueттere|fuettere|kriegt|hat bisher|aktuell|momentan|bisher|seit (jahren?|monaten?|wochen?)/.test(all);
  if (currentFoodCtx) {
    // Versuche Marke zu extrahieren
    const FOOD_BRANDS = ["royal canin", "hills", "hill's", "animonda", "wolfsblut", "bosch", "brit", "purina", "eukanuba",
      "acana", "orijen", "taste of the wild", "bozita", "josera", "leonardo", "belcando", "platinum", "rinti",
      "happy dog", "julius", "granatapet", "herrmann", "luna", "grau", "tierfreund", "pedigree", "whiskas",
      "chappi", "frolic", "almo nature", "concept for life", "farmina", "advance", "proplan", "pro plan",
      "iams", "science diet", "specific", "mera", "bewi dog", "trixie", "defu", "kokoba", "wolkraft",
      "fleisch", "barf", "selbst zubereitet", "rohe kost"];
    let found = false;
    for (const b of FOOD_BRANDS) {
      if (all.includes(b)) { intent.currentFood = b; found = true; break; }
    }
    if (!found) intent.currentFood = "bekannt"; // Nutzer hat aktuelles Futter erwähnt, aber keine Marke
  }

  // Wechsel-Absicht
  if (/wechsel|umstell|anderes? futter|andere? marke|neues? futter|besseres? futter|probier/.test(all)) {
    intent.wantToSwitch = true;
  }
  if (intent.currentFood) intent.wantToSwitch = intent.wantToSwitch ?? true; // wenn aktuelles Futter bekannt, impliziert Wechsel

  // Wechsel-Grund
  if (/vertraegt (es|das|ihn) nicht|bekommt (ihm|ihr) nicht gut|kriegt davon durchfall|allergi|juckt/.test(all)) intent.switchReason = "vertraegt nicht";
  else if (/mag (es|das|ihn) nicht|frisst (es|das) nicht|will (es|das) nicht|schmeckt ihm nicht/.test(all)) intent.switchReason = "mag nicht";
  else if (/teuer|zu teuer|guenstig|sparen/.test(all) && intent.currentFood) intent.switchReason = "teuer";
  else if (intent.currentFood && !intent.switchReason) intent.switchReason = "optimieren";

  return intent;
}

export function intentSignalCount(i: DogIntent): number {
  let n = 0;
  if (i.lifePhase) n++;
  if (i.foodType) n++;
  if (i.sensitive || i.protein) n++;
  if (i.maxPricePerKg) n++;
  if (i.breed) n++;
  if (i.currentFood) n++;
  return n;
}

// BELLA fragt mindestens 2x nach, bevor sie empfiehlt:
// - Runde 1: Lebensphase / Rasse / Allergie klären
// - Runde 2: aktuelles Futter & Wechselgrund klären (sehr wertvoll!)
// - Ab 4 Signalen ODER nach 3 User-Turns: empfehlen
// Verhindert endloses Nachfragen bei langen Gesprächen (Fallback: 4 Turns).
export function hasEnoughIntent(i: DogIntent, history: HistoryEntry[]): boolean {
  const signals = intentSignalCount(i);
  const userTurns = history.filter(h => h.role === "user").length + 1;
  if (signals >= 4) return true;                   // viele Infos → direkt empfehlen
  if (signals >= 2 && i.currentFood) return true;  // Hund + aktuelles Futter bekannt → empfehlen
  if (signals >= 3 && userTurns >= 2) return true; // viele Signale nach min. 2 Runden
  if (userTurns >= 4) return true;                 // nie länger als 4 Runden fragen
  return false;
}

export function computeConfidence(i: DogIntent, history: { content: string }[]): number {
  let s = 12;
  if (i.lifePhase) s += 18;
  if (i.foodType) s += 14;
  if (i.sensitive) s += 14;
  if (i.protein) s += 10;
  if (i.maxPricePerKg) s += 12;
  if (i.breed) s += 10;
  if (i.currentFood) s += 14;
  if (i.wantToSwitch) s += 4;
  s += Math.min(history.length * 3, 14);
  return Math.min(s, 98);
}

export function classifyTheme(i: DogIntent): AdvisorTheme {
  if (i.sensitive) return "allergie";
  if (i.lifePhase === "welpen") return "welpe";
  if (i.lifePhase === "senior") return "senior";
  if (i.foodType === "barf") return "barf";
  if (i.maxPricePerKg && i.maxPricePerKg <= 6) return "budget";
  return "idle";
}
