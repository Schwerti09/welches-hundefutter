// Findet Rassen ohne Gallery-Bild und ergänzt sie via dog.ceo API
// Aufruf: node scripts/fill-breed-gallery.mjs
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Breeds aus breeds.ts parsen (Slugs + Namen)
const breedsTs = readFileSync(resolve(ROOT, "src/data/breeds.ts"), "utf-8");
const slugMatches = [...breedsTs.matchAll(/slug:\s*'([^']+)'/g)];
const nameMatches = [...breedsTs.matchAll(/name:\s*'([^']+)'/g)];

const breeds = slugMatches.map((m, i) => ({
  slug: m[1],
  name: nameMatches[i]?.[1] ?? m[1],
}));

console.log(`BREEDS total: ${breeds.length}`);

// Gallery laden
const galleryPath = resolve(ROOT, "src/data/breed-gallery.json");
const gallery = JSON.parse(readFileSync(galleryPath, "utf-8"));
const galleryBySlug = new Set(gallery.map(g => g.slug));

// Fehlende finden
const missing = breeds.filter(b => !galleryBySlug.has(b.slug));
console.log(`Gallery hat: ${gallery.length} Einträge`);
console.log(`Fehlende Rassen: ${missing.length}`);
missing.forEach(b => console.log(`  - ${b.slug}: ${b.name}`));

// dog.ceo Breed-Liste laden
const listResp = await fetch("https://dog.ceo/api/breeds/list/all");
const listData = await listResp.json();
const dogCeoBreeds = listData.message; // { breed: [subbreeds] }

// Einfaches Mapping: Rassen-Slug → dog.ceo Breed
// Strategie: Keyword-Matching gegen dog.ceo Breed-Namen
function findDogCeoBreed(slug, name) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const slugNorm = norm(slug);
  const nameNorm = norm(name);

  // Direkte Mappings für bekannte Sonderfälle
  const MANUAL = {
    "mischling": "mix",
    "husky-mix": "mix",
    "husky": "husky",
    "westie": "terrier/westhighland",
    "sheltie": "sheepdog/shetland",
    "malinois": "malinois",
    "tervueren": "tervuren",
    "bobtail": "sheepdog/english",
    "borzoi": "borzoi",
    "langhaardackel": "dachshund",
    "rauhaardackel": "dachshund",
    "zwerg-dackel": "dachshund",
    "wolfsspitz": "keeshond",
    "deutschen-spitz": "keeshond",
    "cavalier-king-charles": "spaniel/blenheim",
    "cavalier-king-charles-spaniel": "spaniel/blenheim",
    "pomeranian": "pomeranian",
    "zwergspitz": "pomeranian",
    "belgischer-schaeferhund-malinois": "malinois",
    "belgischer-schaeferhund-groenendael": "groenendael",
    "belgischer-schaeferhund-tervueren": "tervuren",
    "english-springer-spaniel": "springer/english",
    "ibizenhund": "hound/ibizan",
    "galgo-espanol": "hound/ibizan",
    "amerikanischer-staffordshire-terrier": "bullterrier/staffordshire",
    "american-staffordshire-terrier": "bullterrier/staffordshire",
    "american-bully": "pitbull",
    "amerikanischer-akita": "akita",
    "american-akita": "akita",
    "kaukasischer-owtscharka": "ovcharka/caucasian",
    "wire-fox-terrier": "terrier/fox",
    "drahthaar-fox-terrier": "terrier/fox",
    "norsk-elkhund": "elkhound/norwegian",
    "kleiner-italienischer-windhund": "greyhound/italian",
    "cane-corso": "mix",
    "dogo-argentino": "mix",
    "bracco-italiano": "mix",
    "lagotto-romagnolo": "mix",
    "alaskan-klee-kai": "mix",
    "berger-blanc-suisse": "mix",
    "thai-ridgeback": "mix",
    "azawakh": "mix",
    "pharaonenhund": "mix",
    "kanaan-hund": "mix",
    "kangal": "mix",
    "mudi": "mix",
    "puli": "mix",
    "bolonka-zwetna": "mix",
    "bernedoodle": "mix",
    "goldendoodle": "mix",
    "aussiedoodle": "mix",
    "schnoodle": "mix",
    "morkie": "mix",
    "maltipoo": "mix",
    "springador": "mix",
    "chiweenie": "mix",
    "jackabee": "mix",
    "pomsky": "mix",
    "yorkipoo": "mix",
    "corgidor": "mix",
    "jindo": "mix",
    "sloughi": "mix",
    "schottischer-deerhound": "deerhound/scottish",
    "schwarzer-russischer-terrier": "terrier/russian",
    "schwedischer-lapphund": "mix",
    "nova-scotia-duck-tolling-retriever": "retriever/golden",
    "hovawart": "mix",
    "eurasier": "mix",
    "saarloos-wolfhund": "mix",
    "islaendischer-schaefer": "mix",
    "schaeferhund-labrador-mix": "mix",
    "tibetischer-spaniel": "spaniel/japanese",
    "kleinspitz": "pomeranian",
    "grosser-muensterlaender": "mix",
    "kleiner-muensterlaender": "mix",
    "miniature-american-shepherd": "australian/shepherd",
    "neapolitanischer-mastiff": "mastiff/bull",
    "korthals-griffon": "mix",
    "brüsseler-griffon": "mix",
    "brusseler-griffon": "mix",
    "finnischer-spitz": "spitz/finnish",
    "welsh-corgi": "corgi/cardigan",
    "portugiesischer-wasserhund": "mix",
    "presa-canario": "mix",
    "bearded-collie": "mix",
    "beauceron": "mix",
    "bernedoodle": "mix",
    "cockapoo": "cockapoo",
    "cavapoo": "cavapoo",
    "labradoodle": "labradoodle",
    "puggle": "puggle",
    "deutsch-kurzhaar": "pointer/german",
    "deutsch-drahthaar": "pointer/germanlonghair",
    "weimaraner": "weimaraner",
    "hound-basset": "hound/basset",
    "pointer": "pointer/german",
    "schottischer-deerhound": "deerhound/scottish",
    "petit-basset-griffon-vendeen": "hound/basset",
    "otterhound": "otterhound",
    "gordon-setter": "setter/gordon",
    "chesapeake-bay-retriever": "retriever/chesapeake",
    "curly-coated-retriever": "retriever/curly",
    "welsh-springer-spaniel": "spaniel/welsh",
    "affenpinscher": "affenpinscher",
    "boston-terrier": "terrier/boston",
    "japanisches-chin": "spaniel/japanese",
    "tibetischer-terrier": "terrier/tibetan",
  };

  if (MANUAL[slug]) return MANUAL[slug];

  // Auto-Match gegen dog.ceo Breed-Liste
  for (const [breed, subs] of Object.entries(dogCeoBreeds)) {
    if (norm(breed) === slugNorm || nameNorm.includes(norm(breed))) {
      if (subs.length === 0) return breed;
      if (subs.length > 0) return `${breed}/${subs[0]}`;
    }
    for (const sub of subs) {
      const full = `${breed}/${sub}`;
      if (norm(full) === slugNorm || (nameNorm.includes(norm(breed)) && nameNorm.includes(norm(sub)))) {
        return full;
      }
    }
  }
  return "mix"; // Fallback
}

// Für jede fehlende Rasse ein Bild holen
const newEntries = [];
for (const { slug, name } of missing) {
  const breedPath = findDogCeoBreed(slug, name);
  let img = null;
  try {
    const apiUrl = `https://dog.ceo/api/breed/${breedPath}/images/random`;
    const resp = await fetch(apiUrl);
    if (resp.ok) {
      const data = await resp.json();
      if (data.status === "success") img = data.message;
    }
  } catch (e) {
    console.warn(`Fehler für ${slug}: ${e.message}`);
  }
  if (!img) {
    img = `https://images.dog.ceo/breeds/mix/xeshaBelka_(27).jpg`; // Fallback
    console.log(`  ⚠ Fallback für ${slug} (${breedPath})`);
  } else {
    console.log(`  ✓ ${slug} → ${breedPath}`);
  }
  newEntries.push({ slug, name, img, dogCeoBreed: breedPath });
  // Rate-Limiting
  await new Promise(r => setTimeout(r, 100));
}

// Gallery erweitern und speichern
const updatedGallery = [...gallery, ...newEntries];
writeFileSync(galleryPath, JSON.stringify(updatedGallery, null, 2) + "\n", "utf-8");
console.log(`\n✅ ${newEntries.length} neue Einträge hinzugefügt. Gallery hat jetzt ${updatedGallery.length} Einträge.`);
