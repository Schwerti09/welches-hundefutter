/**
 * Feed importer: DeinHandy + Sparhandy pipe-separated CSV → Neon PostgreSQL
 * Usage: DATABASE_URL=... node scripts/import-feeds.mjs
 */
import { createReadStream, existsSync } from "fs";
import { createInterface } from "readline";
import { createGunzip } from "zlib";
import { neon } from "@neondatabase/serverless";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// ─── Create table ─────────────────────────────────────────────────────────────

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      brand TEXT NOT NULL,
      device_name TEXT NOT NULL,
      device_slug TEXT NOT NULL,
      storage TEXT,
      storage_gb INTEGER,
      color TEXT,
      image_url TEXT,
      provider_name TEXT NOT NULL,
      tariff_name TEXT NOT NULL,
      monthly_price NUMERIC(8,2) NOT NULL,
      effective_monthly_price NUMERIC(8,2),
      one_time_price NUMERIC(8,2) DEFAULT 0,
      hardware_only_price NUMERIC(8,2),
      data_volume TEXT,
      data_volume_gb NUMERIC(8,1),
      is_unlimited BOOLEAN DEFAULT false,
      has_5g BOOLEAN DEFAULT false,
      has_lte BOOLEAN DEFAULT true,
      contract_months INTEGER DEFAULT 24,
      affiliate_link TEXT NOT NULL,
      source_feed TEXT,
      availability TEXT DEFAULT 'in stock',
      cashback NUMERIC(8,2),
      network_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS brand_idx ON offers(brand)`;
  await sql`CREATE INDEX IF NOT EXISTS provider_idx ON offers(provider_name)`;
  await sql`CREATE INDEX IF NOT EXISTS device_slug_idx ON offers(device_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS price_idx ON offers(monthly_price)`;
  console.log("✅ Table ready");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePrice(str) {
  if (!str || str === "" || str === "0") return null;
  const n = parseFloat(String(str).replace(",", "."));
  return isNaN(n) ? null : n;
}

// ─── DeinHandy / Sparhandy pipe-separated ────────────────────────────────────

async function importPipeFeed(filePath, sourceFeed) {
  if (!existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return 0;
  }

  console.log(`📥 Importing ${sourceFeed}...`);
  let headers = null;
  let count = 0;
  let batch = [];
  const BATCH_SIZE = 100;

  const stream = createReadStream(filePath, { encoding: "utf8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  async function flushBatch() {
    if (batch.length === 0) return;
    try {
      const values = batch.map(r => ({
        brand: r.brand || "Unknown",
        device_name: r.device_name || "Unknown",
        device_slug: r.device_slug,
        storage: r.storage || null,
        storage_gb: r.storage_gb,
        color: r.color || null,
        image_url: r.image_url || null,
        provider_name: r.provider_name,
        tariff_name: r.tariff_name || "Unknown",
        monthly_price: r.monthly_price,
        effective_monthly_price: r.effective_monthly_price,
        one_time_price: r.one_time_price || 0,
        hardware_only_price: r.hardware_only_price,
        data_volume: r.data_volume || null,
        data_volume_gb: r.data_volume_gb,
        is_unlimited: r.is_unlimited,
        has_5g: r.has_5g,
        has_lte: r.has_lte,
        contract_months: r.contract_months,
        affiliate_link: r.affiliate_link,
        source_feed: sourceFeed,
        availability: r.availability || "in stock",
        cashback: r.cashback,
        network_name: r.network_name || null,
      }));

      // Batch insert using template literal
      for (const v of values) {
        await sql`
          INSERT INTO offers (
            brand, device_name, device_slug, storage, storage_gb, color, image_url,
            provider_name, tariff_name, monthly_price, effective_monthly_price,
            one_time_price, hardware_only_price, data_volume, data_volume_gb,
            is_unlimited, has_5g, has_lte, contract_months, affiliate_link,
            source_feed, availability, cashback, network_name
          ) VALUES (
            ${v.brand}, ${v.device_name}, ${v.device_slug}, ${v.storage}, ${v.storage_gb}, ${v.color}, ${v.image_url},
            ${v.provider_name}, ${v.tariff_name}, ${v.monthly_price}, ${v.effective_monthly_price},
            ${v.one_time_price}, ${v.hardware_only_price}, ${v.data_volume}, ${v.data_volume_gb},
            ${v.is_unlimited}, ${v.has_5g}, ${v.has_lte}, ${v.contract_months}, ${v.affiliate_link},
            ${v.source_feed}, ${v.availability}, ${v.cashback}, ${v.network_name}
          )
          ON CONFLICT DO NOTHING
        `;
      }
    } catch (err) {
      console.error("Batch error:", err.message);
    }
    batch = [];
  }

  for await (const line of rl) {
    if (!line.trim()) continue;

    const cols = line.split("|").map(c => c.replace(/^"|"$/g, ""));

    if (!headers) {
      headers = cols;
      continue;
    }

    const row = {};
    headers.forEach((h, i) => { row[h] = cols[i] || ""; });

    // Skip non-smartphone entries
    const deviceName = row.device_name || row.device_description_short || "";
    if (!deviceName) continue;

    const brand = row.brand || "";
    const provider = row.provider_name || row.tariff_provider_customer || row.network_name || "";
    const affiliateLink = row.bundle_pdp_url || "";
    const monthlyPrice = parsePrice(row.tariff_price_basic_fee || row.price);
    const effectivePrice = parsePrice(row.tariff_price_effective_monthly_fee);
    const oneTimePrice = parsePrice(row.tariff_price_connection_fee);
    const hardwarePrice = parsePrice(row.device_price_hardware_only);
    const cashback = parsePrice(row.tariff_price_monthly_refund);

    if (!affiliateLink || !monthlyPrice || !brand || !provider) continue;
    if (monthlyPrice <= 0 || monthlyPrice > 500) continue;

    const dataVolumeGb = parsePrice(row.tariff_data_volume_in_gb);
    const isUnlimited = row.tariff_is_unlimited === "true" || dataVolumeGb >= 9999;

    batch.push({
      brand: brand.trim(),
      device_name: deviceName.trim(),
      device_slug: slugify(`${brand}-${deviceName}`),
      storage: row.device_capacity || null,
      storage_gb: parseInt(row.device_capacity_in_gb) || null,
      color: (row.color || row.device_color_name || "").trim() || null,
      image_url: row.image_link || row.variant_image_front || null,
      provider_name: provider.trim(),
      tariff_name: (row.tariff_name || "").trim(),
      monthly_price: monthlyPrice,
      effective_monthly_price: effectivePrice,
      one_time_price: oneTimePrice || 0,
      hardware_only_price: hardwarePrice,
      data_volume: (row.tariff_data_volume || "").trim() || null,
      data_volume_gb: dataVolumeGb,
      is_unlimited: isUnlimited,
      has_5g: row.tariff_has_5g === "true",
      has_lte: row.tariff_has_lte !== "false",
      contract_months: parseInt(row.tariff_duration_of_contract_in_months) || 24,
      affiliate_link: affiliateLink.trim(),
      availability: row.availability || "in stock",
      cashback: cashback && cashback > 0 ? cashback : null,
      network_name: (row.network_name || "").trim() || null,
    });

    count++;

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
      process.stdout.write(`\r  ${count} Angebote verarbeitet...`);
    }
  }

  await flushBatch();
  console.log(`\n  ✅ ${count} Angebote aus ${sourceFeed} importiert`);
  return count;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Feed-Import gestartet\n");

  await ensureTable();

  // Clear existing data
  console.log("🗑️  Lösche alte Daten...");
  await sql`DELETE FROM offers`;

  const downloadsDir = "C:/Users/rolli/Downloads";

  let total = 0;
  total += await importPipeFeed(`${downloadsDir}/DEINHANDY_Produktdatenfeed_2026.csv`, "deinhandy");
  total += await importPipeFeed(`${downloadsDir}/Sparhandy_Bundle-Feed_2023 (2).csv`, "sparhandy");

  const [stats] = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(DISTINCT device_slug) as devices,
      COUNT(DISTINCT brand) as brands,
      COUNT(DISTINCT provider_name) as providers,
      MIN(monthly_price) as min_price,
      MAX(monthly_price) as max_price
    FROM offers
  `;

  console.log("\n📊 Import-Statistiken:");
  console.log(`  Gesamt-Angebote: ${stats.total}`);
  console.log(`  Einzigartige Geräte: ${stats.devices}`);
  console.log(`  Marken: ${stats.brands}`);
  console.log(`  Provider: ${stats.providers}`);
  console.log(`  Preisspanne: €${stats.min_price} – €${stats.max_price}/Monat`);
  console.log("\n✅ Import abgeschlossen!");
}

main().catch(console.error);
