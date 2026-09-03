/**
 * Rasse-Erkennung im Freitext — abgeleitet aus @/data/breeds.ts (EINE Quelle,
 * Roadmap Op 2.1). Ersetzt die früher in der Chat-Route hartkodierte 180-Zeilen-
 * Kopie. Gibt den kanonischen Namen + Slug zurück, damit der Futter-Pass korrekt
 * an `dog_breeds.slug` gekoppelt wird.
 */
import { BREEDS } from "@/data/breeds";

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type Entry = { needle: string; slug: string; name: string };

// Umgangssprachliche Kurzformen → dominante Rasse. Nur Fälle, wo der bloße
// Begriff sonst gar nicht träfe UND eine Rasse klar überwiegt. Bewusst kein
// "Terrier"/"Schnauzer"/"Spitz" (zu mehrdeutig).
const COLLOQUIAL: Record<string, string> = {
  schaeferhund: "deutscher-schaeferhund",
  retriever: "labrador-retriever",
  bulldogge: "franzoesische-bulldogge",
  sennenhund: "berner-sennenhund",
  dogge: "deutsche-dogge",
  collie: "border-collie",
  spaniel: "cocker-spaniel",
  setter: "irish-setter",
  pinscher: "zwergpinscher",
  wolfshund: "irischer-wolfshund",
};

// Index: pro Rasse Name + alternativeNames + slug-als-Worte, normalisiert,
// nach Länge absteigend → längster Match zuerst ("japanischer spitz" vor "spitz").
const INDEX: Entry[] = (() => {
  const bySlug = new Map(BREEDS.map((b) => [b.slug, b]));
  const seen = new Set<string>();
  const out: Entry[] = [];
  const add = (needle: string, slug: string, name: string) => {
    if (needle.length < 4 || seen.has(needle)) return;
    seen.add(needle);
    out.push({ needle, slug, name });
  };
  for (const b of BREEDS) {
    for (const f of [b.name, ...(b.alternativeNames ?? []), b.slug.replace(/-/g, " ")]) {
      add(norm(f), b.slug, b.name);
    }
  }
  for (const [word, slug] of Object.entries(COLLOQUIAL)) {
    const b = bySlug.get(slug);
    if (b) add(word, b.slug, b.name);
  }
  return out.sort((a, z) => z.needle.length - a.needle.length);
})();

/**
 * Erste (längste) Rasse, deren Schreibweise als Wort im Text beginnt.
 * Prefix-nach-Wortgrenze: matcht "labrador", "labradore", "labradoren",
 * aber nicht "xlabrador".
 */
export function matchBreed(text: string): { slug: string; name: string } | null {
  const hay = ` ${norm(text)} `;
  for (const e of INDEX) {
    if (hay.includes(` ${e.needle}`)) return { slug: e.slug, name: e.name };
  }
  return null;
}

/** Nur für Tests/Debug: Größe des Erkennungsindex. */
export const BREED_INDEX_SIZE = INDEX.length;
