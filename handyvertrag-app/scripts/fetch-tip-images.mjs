// Lädt echte, lizenzfreie Fotos von Pexels für die Tipp-Artikel-Hauptbilder.
// Aufruf: PEXELS_API_KEY="..." node scripts/fetch-tip-images.mjs
//
// Strategie: pro Kategorie ein Pool von ~20 thematisch passenden Fotos,
// jedes Artikel-Bild (imageUrl in src/data/tips/<kategorie>.ts) wird
// deterministisch (nach Reihenfolge) aus dem Pool zugewiesen.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("PEXELS_API_KEY fehlt");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public", "images", "tipps");
const DATA_DIR = path.join(ROOT, "src", "data", "tips");

// Kategorie -> { dataFile, poolSize, queries }
const CATEGORIES = {
  ernaehrung: {
    file: "ernaehrung.ts",
    queries: [
      "dog eating food bowl",
      "dog food kibble",
      "healthy dog food",
      "dog with food bowl",
    ],
  },
  gesundheit: {
    file: "gesundheit.ts",
    queries: [
      "veterinarian dog checkup",
      "dog vet examination",
      "healthy dog portrait",
      "dog health check",
    ],
  },
  welpen: {
    file: "welpen.ts",
    queries: [
      "cute puppy",
      "puppy playing",
      "golden retriever puppy",
      "puppy training",
    ],
  },
  abnehmen: {
    file: "abnehmen.ts",
    queries: [
      "overweight dog",
      "dog walking exercise",
      "dog swimming",
      "dog diet food bowl",
    ],
  },
  allergien: {
    file: "articles/allergien.ts",
    queries: [
      "dog scratching itch",
      "dog vet skin examination",
      "dog allergy grass",
      "dog bath grooming",
    ],
  },
  verdauung: {
    file: "articles/verdauung.ts",
    queries: [
      "dog eating food bowl",
      "dog stomach digestive health",
      "dog vet examination belly",
      "dog drinking water bowl",
    ],
  },
};

async function searchPexels(query, perPage = 6) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} für "${query}"`);
  const data = await res.json();
  return data.photos || [];
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download fehlgeschlagen: ${url} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
}

async function buildPool(categorySlug, queries) {
  const dir = path.join(PUBLIC_DIR, categorySlug);
  await mkdir(dir, { recursive: true });

  const seen = new Set();
  const pool = [];
  let n = 1;

  for (const q of queries) {
    const photos = await searchPexels(q);
    for (const photo of photos) {
      if (seen.has(photo.id)) continue;
      seen.add(photo.id);
      const filename = `${n}.jpg`;
      const dest = path.join(dir, filename);
      await downloadImage(photo.src.large, dest);
      pool.push({
        path: `/images/tipps/${categorySlug}/${filename}`,
        alt: photo.alt || "",
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        pexelsUrl: photo.url,
      });
      console.log(`  ${categorySlug}/${filename} <- "${q}" (${photo.photographer})`);
      n++;
    }
  }
  return pool;
}

async function assignImages(categorySlug, file, pool) {
  const filePath = path.join(DATA_DIR, file);
  let content = await readFile(filePath, "utf-8");

  let i = 0;
  content = content.replace(/imageUrl: "\/images\/tipps\/[^"]*"/g, () => {
    const img = pool[i % pool.length];
    i++;
    return `imageUrl: "${img.path}"`;
  });

  await writeFile(filePath, content, "utf-8");
  console.log(`  ${file}: ${i} imageUrl-Felder aktualisiert (Pool: ${pool.length} Fotos)`);
}

async function main() {
  const filter = process.argv.slice(2);
  const entries = filter.length
    ? Object.entries(CATEGORIES).filter(([slug]) => filter.includes(slug))
    : Object.entries(CATEGORIES);

  let existingCredits = [];
  try {
    existingCredits = JSON.parse(
      await readFile(path.join(PUBLIC_DIR, "credits.json"), "utf-8")
    );
  } catch {
    // credits.json existiert noch nicht
  }

  const processedSlugs = entries.map(([slug]) => slug);
  const credits = existingCredits.filter((c) => !processedSlugs.includes(c.category));

  for (const [slug, cfg] of entries) {
    console.log(`\n=== ${slug} ===`);
    const pool = await buildPool(slug, cfg.queries);
    await assignImages(slug, cfg.file, pool);
    credits.push(...pool.map((p) => ({ category: slug, ...p })));
  }

  await writeFile(
    path.join(PUBLIC_DIR, "credits.json"),
    JSON.stringify(credits, null, 2),
    "utf-8"
  );
  console.log(`\nFertig. ${credits.length} Fotos gesamt, Credits in public/images/tipps/credits.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
