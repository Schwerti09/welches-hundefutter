import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

// Real German mobile networks / MVNOs we trust as "provider"
const REAL = ["telekom", "vodafone", "o2", "otelo", "congstar", "freenet", "klarmobil",
  "blau", "ay yildiz", "ayyildiz", "1&1", "1und1", "winsim", "premiumsim", "sim.de",
  "fraenk", "lidl", "aldi", "mobilcup", "smartmobil", "high"];

function normProvider(raw) {
  const l = (raw || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9& ]/g, "").trim();
  if (l.includes("telekom") || l.includes("magenta")) return "Telekom";
  if (l.includes("vodafone")) return "Vodafone";
  if (l.includes("otelo")) return "otelo";
  if (l === "o2" || l.includes("o2 ") || l.startsWith("o2")) return "o2";
  if (l.includes("congstar")) return "congstar";
  if (l.includes("freenet")) return "freenet";
  if (l.includes("klarmobil")) return "klarmobil";
  if (l.includes("ayyildiz") || l.includes("ay yildiz")) return "ay yildiz";
  if (l.includes("blau")) return "blau";
  if (l.includes("1&1") || l.includes("1und1") || l.includes("1 1")) return "1&1";
  if (l.includes("winsim")) return "winSIM";
  if (l.includes("premiumsim")) return "PremiumSIM";
  if (l.includes("smartmobil")) return "smartmobil";
  if (l.includes("high")) return "HIGH";
  return null; // not a real network
}

async function main() {
  const [before] = await sql`SELECT COUNT(*)::int n FROM offers`;
  console.log("Vorher:", before.n);

  // Pull distinct providers, normalize, update or mark for deletion
  const provs = await sql`SELECT DISTINCT provider_name FROM offers`;
  let updated = 0, deletedProviders = [];
  for (const { provider_name } of provs) {
    const norm = normProvider(provider_name);
    if (norm === null) {
      deletedProviders.push(provider_name);
    } else if (norm !== provider_name) {
      await sql`UPDATE offers SET provider_name = ${norm} WHERE provider_name = ${provider_name}`;
      updated++;
    }
  }
  console.log("Normalisierte Provider-Namen:", updated);

  // Delete offers whose provider is not a real network (manufacturer feeds etc.)
  for (const bad of deletedProviders) {
    await sql`DELETE FROM offers WHERE provider_name = ${bad}`;
  }
  console.log("Gelöschte Fake-Provider:", deletedProviders.length, deletedProviders.slice(0, 20).join(", "));

  const after = await sql`SELECT provider_name, COUNT(*)::int n FROM offers GROUP BY provider_name ORDER BY n DESC`;
  let out = "\nFINALE PROVIDER:\n";
  after.forEach(p => out += `  ${p.provider_name}: ${p.n}\n`);
  const [tot] = await sql`SELECT COUNT(*)::int n, COUNT(DISTINCT device_name)::int d, COUNT(DISTINCT brand)::int b FROM offers`;
  out += `\nGESAMT: ${tot.n} Angebote · ${tot.d} Geräte · ${tot.b} Marken`;
  console.log(out);
}

main().then(() => console.log("\n✓ Fertig")).catch(e => { console.error(e); process.exit(1); });
