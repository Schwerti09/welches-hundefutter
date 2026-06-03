import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const NON_PHONE = [
  // Audio
  "airpods", "buds", "freeclip", "freebuds", "kopfhörer", "headphone", "earphone",
  "soundbar", "speaker", "beats", "earbuds", "openrun", "soundcore",
  // Wearables
  "watch", "%band%", "tracker", "airtag", "fitbit", "smartwatch", "fitness",
  // Tablets
  "ipad", "galaxy tab", "matepad", "redmi pad", "mi pad", "%pad 7%", "%pad 6%", "tablet",
  // Computers
  "macbook", "notebook", "laptop", "imac", "surface", "chromebook", "%book pro%", "%book air%",
  // Consoles / toys / appliances
  "switch", "playstation", " ps5", "xbox", "nintendo", "scooter", "dyson",
  "hot cool", "staubsauger", "%am09%", "%am07%", "drohne", "drone", "gopro",
  // Accessories
  "hülle", "cover", "kabel", "adapter", "ladegerät", "charger", "pencil", "stylus",
  "keyboard", "tastatur", "maus", "%dock%", "halterung", "powerbank", "schutzglas",
  "%case%", "ladekabel", "netzteil", "%sim-karte%", "%simkarte%",
  // Routers / home
  "fritzbox", "router", "repeater", "speedport", "homespot", "fernseher", "% tv ",
  "monitor", "%soundsystem%",
];

const HOME_TARIFF = ["zuhause", "glasfaser", "%dsl%", "festnetz", "%kabel%", "gigazuhause", "magentazuhause"];

async function main() {
  const [before] = await sql`SELECT COUNT(*)::int n FROM offers`;
  console.log("Vorher:", before.n);

  // Delete non-phone devices
  for (const pat of NON_PHONE) {
    const like = pat.includes("%") ? pat : `%${pat}%`;
    await sql`DELETE FROM offers WHERE device_name ILIKE ${like}`;
  }
  const [afterDev] = await sql`SELECT COUNT(*)::int n FROM offers`;
  console.log("Nach Geräte-Cleanup:", afterDev.n);

  // Delete home-internet tariffs
  for (const pat of HOME_TARIFF) {
    const like = pat.includes("%") ? pat : `%${pat}%`;
    await sql`DELETE FROM offers WHERE tariff_name ILIKE ${like}`;
  }
  const [afterTariff] = await sql`SELECT COUNT(*)::int n FROM offers`;
  console.log("Nach Tarif-Cleanup:", afterTariff.n);

  // Stats
  const [stats] = await sql`
    SELECT COUNT(*)::int total, COUNT(DISTINCT device_name)::int devices,
           COUNT(DISTINCT brand)::int brands, MIN(monthly_price)::numeric minp, MAX(monthly_price)::numeric maxp
    FROM offers`;
  console.log("\nFINAL:", JSON.stringify(stats));

  // Verify no junk remains
  const junk = await sql`
    SELECT device_name, COUNT(*)::int n FROM offers
    WHERE device_name ILIKE '%tab%' OR device_name ILIKE '%airpods%'
       OR device_name ILIKE '%watch%' OR device_name ILIKE '%buds%'
       OR device_name ILIKE '%ipad%' OR device_name ILIKE '%macbook%'
    GROUP BY device_name ORDER BY n DESC LIMIT 10`;
  console.log("\nVerbleibender Verdacht:", junk.length ? JSON.stringify(junk) : "KEINER ✓");

  const cheap = await sql`SELECT brand, device_name, provider_name, monthly_price FROM offers ORDER BY monthly_price ASC LIMIT 6`;
  console.log("\nGünstigste:");
  cheap.forEach(c => console.log(`  ${c.monthly_price}€ ${c.brand} ${c.device_name} (${c.provider_name})`));
}

main().then(() => console.log("\n✓ Fertig")).catch(e => { console.error(e); process.exit(1); });
