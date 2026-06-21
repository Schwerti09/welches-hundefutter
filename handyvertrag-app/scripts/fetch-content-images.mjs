// Lädt Pexels-Fotos für Blog, Vergleich-Seiten, Studien-Hubs und Meinungen.
// Aufruf: PEXELS_API_KEY="..." node scripts/fetch-content-images.mjs
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) { console.error("PEXELS_API_KEY fehlt"); process.exit(1); }

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public", "images", "content");

async function fetchPexels(query, count = 1) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${query}`);
  const data = await res.json();
  return data.photos ?? [];
}

async function downloadPhoto(photo, dest) {
  const res = await fetch(photo.src.large2x ?? photo.src.large);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return { id: photo.id, photographer: photo.photographer, url: photo.url };
}

// ── Content to fetch ───────────────────────────────────────────────────────
const BLOG = [
  { slug: "hundefutter-test-2026",          query: "dog food bowl testing quality" },
  { slug: "barf-hund-anfaenger",            query: "raw meat dog food preparation" },
  { slug: "hund-uebergewicht-futter",       query: "overweight dog sitting owner" },
  { slug: "hundefutter-allergie-hund",      query: "dog scratching allergic reaction" },
  { slug: "hundefutter-test-stiftung",      query: "dog food product comparison shelf" },
];

const VERGLEICH = [
  { slug: "barf-vs-trockenfutter",          query: "raw dog food vs dry kibble" },
  { slug: "trockenfutter-vs-nassfutter",    query: "dry dog food wet canned food" },
  { slug: "nassfutter-vs-barf",             query: "wet dog food raw barf" },
  { slug: "getreidefrei-vs-mit-getreide",   query: "grain free dog food comparison" },
  { slug: "monoprotein-vs-mehrkomponenten", query: "single protein dog food ingredient" },
  { slug: "insektenfutter-vs-huehnchen",    query: "insect protein dog food sustainable" },
  { slug: "kaltgepresst-vs-extrudiert",     query: "cold pressed dog food pellets" },
  { slug: "premium-vs-budget",              query: "premium budget dog food price" },
];

const STUDIEN_HUBS = [
  { slug: "allergien",      query: "dog allergy skin itching" },
  { slug: "barf",           query: "raw dog food bowl meat" },
  { slug: "trockenfutter",  query: "dry dog food kibble" },
  { slug: "welpen",         query: "golden retriever puppy playing" },
  { slug: "senioren",       query: "old senior dog resting" },
  { slug: "uebergewicht",   query: "overweight dog on scale" },
  { slug: "verdauung",      query: "dog digestive health vet" },
  { slug: "nachhaltigkeit", query: "sustainable eco pet food packaging" },
];

const MEINUNGEN = [
  { slug: "dog-portrait-1", query: "happy golden retriever portrait" },
  { slug: "dog-portrait-2", query: "labrador dog owner happy" },
  { slug: "dog-portrait-3", query: "border collie dog portrait" },
  { slug: "dog-portrait-4", query: "german shepherd dog portrait" },
];

// ── Main ───────────────────────────────────────────────────────────────────
const credits = {};

async function fetchCategory(items, subfolder) {
  const dir = path.join(PUBLIC, subfolder);
  await mkdir(dir, { recursive: true });
  const results = {};
  for (const item of items) {
    try {
      const photos = await fetchPexels(item.query, 1);
      if (!photos.length) { console.warn(`No photo: ${item.query}`); continue; }
      const dest = path.join(dir, `${item.slug}.jpg`);
      const credit = await downloadPhoto(photos[0], dest);
      results[item.slug] = `/images/content/${subfolder}/${item.slug}.jpg`;
      credits[`${subfolder}/${item.slug}`] = credit;
      console.log(`✓ ${subfolder}/${item.slug}.jpg`);
      await new Promise(r => setTimeout(r, 350)); // rate limit
    } catch (e) {
      console.error(`✗ ${item.slug}: ${e.message}`);
    }
  }
  return results;
}

const [blog, vergleich, studien, meinungen] = await Promise.all([
  fetchCategory(BLOG, "blog"),
  fetchCategory(VERGLEICH, "vergleich"),
  fetchCategory(STUDIEN_HUBS, "studien"),
  fetchCategory(MEINUNGEN, "meinungen"),
]);

// Write image map JSON for use in code
const imageMap = { blog, vergleich, studien, meinungen };
await writeFile(
  path.join(PUBLIC, "map.json"),
  JSON.stringify(imageMap, null, 2)
);
await writeFile(
  path.join(PUBLIC, "credits.json"),
  JSON.stringify(credits, null, 2)
);

console.log("\n✅ Fertig. Pfade in public/images/content/map.json");
