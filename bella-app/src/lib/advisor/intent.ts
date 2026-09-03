/**
 * Intent-Parsing für den BELLA-Berater — regelbasiert (Fast-Path).
 * Aus src/app/api/advisor/chat/route.ts ausgelagert (Roadmap Op 1.4), testbar.
 * Op 2.1: Rasse-Erkennung über @/data/breeds.ts (matchBreed) statt Kopie-Liste;
 * ein LLM-Pfad ergänzt bei dünnem Ergebnis (src/lib/advisor/intent-llm.ts + merge.ts).
 */
import { matchBreed } from "./breed-match";

export type FoodType = "trocken" | "nass" | "barf" | "snack" | "kaltgepresst";
export type LifePhase = "welpen" | "adult" | "senior";

export interface DogIntent {
  foodType?: FoodType;
  lifePhase?: LifePhase;
  sensitive?: boolean; // Allergie / empfindlicher Magen / Symptome
  grainFree?: boolean;
  protein?: string; // BEVORZUGTES Protein, z. B. "Lachs"
  /**
   * GEMIEDENE Proteine (Allergie/Unverträglichkeit). Hart — kein Produkt mit
   * einem dieser Proteine darf je in die OFFERS-Payload (Roadmap 2A, CLAUDE.md §4a).
   * Getrennt von `protein`: dasselbe Protein steht nie in beiden, `avoidProtein` gewinnt.
   */
  avoidProtein?: string[];
  breed?: string; // erkannte Rasse — kanonischer Name (Anzeige / Prompt)
  breedSlug?: string; // erkannte Rasse — dog_breeds.slug (Futter-Pass-Kopplung)
  maxPricePerKg?: number; // Budget €/kg
  currentFood?: string; // aktuelles Futter (Marke oder "bekannt")
  wantToSwitch?: boolean; // möchte Futter wechseln
  switchReason?: string; // Grund für Wechsel ("vertraegt nicht", "mag nicht", "besser", "teuer")
}

export type AdvisorTheme = "idle" | "budget" | "allergie" | "welpe" | "senior" | "barf" | "premium";

type HistoryEntry = { role: string; content: string };

// Protein-Erkennung: [normalisierter Schlüssel (umlautfrei), Label]. Reihenfolge = Priorität.
// Genutzt für Wunsch-Protein UND Allergen-Ausschluss.
export const PROTEIN_KEYS: [string, string][] = [
  ["huehn", "Huhn"], ["huhn", "Huhn"], ["haehnchen", "Huhn"], ["gefluegel", "Huhn"], ["poulet", "Huhn"],
  ["rind", "Rind"], ["lachs", "Lachs"], ["lamm", "Lamm"], ["ente", "Ente"], ["pute", "Pute"],
  ["truthahn", "Pute"], ["wild", "Wild"], ["hirsch", "Wild"], ["reh", "Wild"], ["fisch", "Fisch"],
  ["kaninchen", "Kaninchen"], ["hase", "Kaninchen"], ["pferd", "Pferd"], ["insekt", "Insekt"],
  ["schwein", "Schwein"],
];

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
  if (/welpe|welpi|junghund|junior|puppy|baby|\d+\s*wochen/.test(all)) intent.lifePhase = "welpen";
  else if (/senior|\balt(er|es)?\b|aelter|ageing|aging|7\+|8\+|9\+|10\s*jahr/.test(all)) intent.lifePhase = "senior";
  else if (/adult|erwachsen|ausgewachsen|ausgewachs/.test(all)) intent.lifePhase = "adult";

  // Futtertyp
  if (/barf|roh\b|frischfleisch|frostfutter/.test(all)) intent.foodType = "barf";
  else if (/nassfutter|nass\b|dose|dosen|feucht|menue|pastete/.test(all)) intent.foodType = "nass";
  else if (/snack|leckerli|leckerchen|kausnack|kauknochen|kaustange/.test(all)) intent.foodType = "snack";
  else if (/trockenfutter|trocken|kroketten/.test(all)) intent.foodType = "trocken";

  // Allergie / Sensibilität / Symptome. Symptomwörter setzen `sensitive` (Scoring
  // bevorzugt dann hypoallergen/getreidefrei), auch ohne benanntes Allergen.
  if (/allergi|sensibel|empfindlich|unvertr(ae)?gl|unvertraeglich|intoleran|juckt|juckreiz|kratzt sich|durchfall|weicher kot|blaeh|magen|verdauung|sensitiv|haut|fell|haarausfall|schuppen|hotspot|hot spot|pfoten (leck|knabber|kau)|ohrenentz|ohren entz|erbrech|uebergibt/.test(all)) intent.sensitive = true;
  if (/getreidefrei|grain.?free|glutenfrei|getreide.?allergie|weizen.?allergie/.test(all)) { intent.grainFree = true; intent.sensitive = true; }

  // ── Wunsch-Protein (Präferenz) — `all` ist umlaut-normalisiert (ü→ue).
  for (const [k, lab] of PROTEIN_KEYS) {
    if (new RegExp(`\\b${k}`).test(all)) { intent.protein = lab; break; }
  }

  // ── Gemiedene Proteine (Allergie) — hart. Zwei Wege:
  //   (a) explizite Meide-/Allergie-Phrase je Protein im Gesamttext
  //   (b) bloßes Protein als Antwort, wenn BELLA zuletzt nach Allergien/Zutaten fragte
  const lastAssistant = [...history].reverse().find(h => h.role === "assistant")?.content ?? "";
  const askedAboutAllergy = /allergi|unvertr|zutat|reagier|vertr(ae|ä)gt|empfindlich|besonderheit|magen/i
    .test(lastAssistant.normalize("NFC").toLowerCase());
  const msgNorm = message.normalize("NFC").toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");

  const avoid = new Set<string>();
  for (const [k, lab] of PROTEIN_KEYS) {
    const explicit = new RegExp(
      `(?:allergi\\w*\\s+(?:auf|gegen)\\s+\\w*${k}` +
      `|reagiert\\s+(?:allergisch\\s+)?auf\\s+\\w*${k}` +
      `|vertr(?:ae|ä)gt\\s+kein\\w*\\s+\\w*${k}` +
      `|unvertr\\w*\\s+(?:auf|gegen)\\s+\\w*${k}` +
      `|(?:^|\\s)(?:ohne|kein|keine|nicht)\\s+\\w*${k}` +
      `|\\w*${k}\\w*[- ]?allergie` +
      `|\\w*${k}\\w*[- ]?unvertr)`,
    );
    if (explicit.test(all)) avoid.add(lab);
    else if (askedAboutAllergy && new RegExp(`\\b${k}`).test(msgNorm)) avoid.add(lab);
  }
  if (avoid.size) {
    intent.avoidProtein = [...avoid];
    intent.sensitive = true;
    if (intent.protein && avoid.has(intent.protein)) intent.protein = undefined; // avoidProtein gewinnt
  }

  // Rasse — aus @/data/breeds.ts abgeleiteter Index (Op 2.1).
  // `message`+User-Turns im Original (nicht das umlaut-zerstörte `all`).
  const breedHit = matchBreed([...userOnly, message].join(" "));
  if (breedHit) { intent.breed = breedHit.name; intent.breedSlug = breedHit.slug; }

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
  if (/vertraegt (es|das|ihn|sein\w*|ihr\w*)? ?(futter )?nicht|bekommt (ihm|ihr) nicht gut|kriegt davon durchfall|reagiert (auf|allergisch)|allergi|juckt/.test(all)) intent.switchReason = "vertraegt nicht";
  else if (/mag (es|das|ihn|sein\w*|ihr\w*)? ?(futter )?nicht|frisst.{0,25}nicht( mehr)?\b|will (es|das)? ?nicht (mehr )?fressen|schmeckt (ihm|ihr) nicht|verschmaeht|ruehrt.{0,15}nicht an|laesst.{0,15}stehen|maekelt|waehlerisch/.test(all)) intent.switchReason = "mag nicht";
  else if (/teuer|zu teuer|guenstig|sparen/.test(all) && intent.currentFood) intent.switchReason = "teuer";
  else if (intent.currentFood && !intent.switchReason) intent.switchReason = "optimieren";

  return intent;
}

export function intentSignalCount(i: DogIntent): number {
  let n = 0;
  if (i.lifePhase) n++;
  if (i.foodType) n++;
  if (i.sensitive || i.protein || (i.avoidProtein?.length ?? 0) > 0) n++;
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
  if (signals >= 3) return true;                   // 3 konkrete Signale → keine Frage stellen, deren Antwort nichts ändert
  if (signals >= 2 && i.currentFood) return true;  // Hund + aktuelles Futter bekannt → empfehlen
  if (userTurns >= 4) return true;                 // nie länger als 4 Runden fragen
  return false;
}

export function computeConfidence(i: DogIntent, history: { content: string }[]): number {
  let s = 12;
  if (i.lifePhase) s += 18;
  if (i.foodType) s += 14;
  if (i.sensitive) s += 14;
  if (i.avoidProtein?.length) s += 8;
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
