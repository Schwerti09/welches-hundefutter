/**
 * Pflanzt ein vollständiges Testprofil für den Nachschub-Wecker-Dry-Run:
 *   - confirmed Subscriber (rolli.peter123@gmail.com)
 *   - dog_profile "Bello" (Labrador, 30 kg, adult)
 *   - price_alert mode=refill, refill_due_at = jetzt + 3 Tage
 *   - 90-Tage Preishistorie: avg ~14 €/kg
 *   - aktueller dog_foods-Preis: 12.50 €/kg (≈ 10.7% unter Schnitt → Wecker feuert)
 *
 * Run: DATABASE_URL=... node scripts/seed-test-refill.mjs
 * Danach: DATABASE_URL=... node scripts/check-price-alerts.mjs --dry-run
 */
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

// ── 1. Test-Futter sicherstellen ──────────────────────────────────────────────
const FOOD_SLUG = "bella-test-labrador-trockenfutter";
await sql`
  INSERT INTO dog_foods (slug, brand, name, type, protein, price_per_kg, affiliate_url, is_active)
  VALUES (
    ${FOOD_SLUG}, 'BELLA Test', 'Premium Trockenfutter Labrador 15 kg', 'trocken',
    'Huhn', 12.50,
    'https://welches-hundefutter.today',
    true
  )
  ON CONFLICT (slug) DO UPDATE SET price_per_kg = 12.50, is_active = true
`;
console.log("✅ dog_foods: Testfutter gesetzt (12.50 €/kg)");

// ── 2. Preishistorie: 90-Tage-Schnitt ~14 €/kg ────────────────────────────────
await sql`DELETE FROM price_history WHERE food_slug = ${FOOD_SLUG}`;
const prices = [14.80, 14.20, 13.90, 14.50, 14.10, 13.80, 14.30, 14.70, 14.00, 13.60];
for (let i = 0; i < prices.length; i++) {
  const daysAgo = 10 + i * 7;
  await sql`
    INSERT INTO price_history (food_slug, price_per_kg, recorded_at)
    VALUES (${FOOD_SLUG}, ${prices[i]}, now() - (${daysAgo} || ' days')::interval)
  `;
}
const avg = prices.reduce((a, b) => a + b) / prices.length;
console.log(`✅ price_history: ${prices.length} Einträge, Ø ${avg.toFixed(2)} €/kg`);
console.log(`   Aktueller Preis 12.50 = ${((1 - 12.50/avg)*100).toFixed(1)}% unter Schnitt (Schwelle: 5%)`);

// ── 3. Subscriber anlegen (mit doi_confirmed_at) ──────────────────────────────
const EMAIL = "rolli.peter123@gmail.com";
const UNSUB_TOKEN = "test-unsub-token-bello-2026";
const DOI_TOKEN = "test-doi-token-bello-2026";

const subRows = await sql`
  INSERT INTO subscribers (email, doi_token, unsubscribe_token, doi_confirmed_at, source)
  VALUES (${EMAIL}, ${DOI_TOKEN}, ${UNSUB_TOKEN}, now(), 'test-seed')
  ON CONFLICT (email) DO UPDATE SET doi_confirmed_at = now(), unsubscribed_at = NULL
  RETURNING id
`;
const subId = subRows[0]?.id ?? (await sql`SELECT id FROM subscribers WHERE email = ${EMAIL}`)[0].id;
console.log(`✅ subscriber: ${EMAIL} (id: ${subId})`);

// ── 4. dog_profile "Bello" ────────────────────────────────────────────────────
const profileRows = await sql`
  INSERT INTO dog_profiles (subscriber_id, name, breed_slug, weight_kg, activity_level, current_food_slug, est_daily_grams, est_bag_days, share_token, share_enabled)
  VALUES (${subId}, 'Bello', 'labrador-retriever', 30, 'mittel', ${FOOD_SLUG}, 350, 43, 'test-share-bello-2026', true)
  ON CONFLICT (share_token) DO UPDATE SET name = 'Bello', current_food_slug = ${FOOD_SLUG}
  RETURNING id
`;
const profileId = profileRows[0]?.id ?? (await sql`SELECT id FROM dog_profiles WHERE share_token = 'test-share-bello-2026'`)[0].id;
console.log(`✅ dog_profile: Bello (id: ${profileId})`);

// ── 5. price_alert mode=refill, fällig in 3 Tagen ────────────────────────────
await sql`
  INSERT INTO price_alerts (subscriber_id, food_slug, food_name, mode, dog_profile_id,
    refill_due_at, baseline_price_per_kg, is_active)
  VALUES (
    ${subId}, ${FOOD_SLUG}, 'Premium Trockenfutter Labrador 15 kg', 'refill', ${profileId},
    now() + interval '3 days', 14.00, true
  )
  ON CONFLICT DO NOTHING
`;
console.log("✅ price_alert: mode=refill, fällig in 3 Tagen");

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Testdaten gesetzt. Jetzt Dry-Run:

  node scripts/check-price-alerts.mjs --dry-run

Erwartetes Ergebnis:
  📦 Nachschub-Wecker: 1 fällig
  ✅ ${EMAIL} :: Bello / Premium Trockenfutter ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
