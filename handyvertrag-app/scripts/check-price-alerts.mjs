/**
 * BELLA Schicht 2 — Alert-Engine. Prüft aktive Preis-Wecker bestätigter Abonnenten
 * gegen price_history und schickt NUR bei echter Senkung eine Mail. Glaubwürdigkeit
 * ist das Produkt: kein erfundenes Tief, lieber keine Mail.
 *
 * Trigger (alle müssen zutreffen):
 *   - Futter aktiv, aktueller Preis < Baseline (günstiger als bei Anmeldung)
 *   - aktueller Preis ist 30-Tage-Tief
 *   - genug Abstand zur letzten Meldung (Anti-Spam: ≥3% tiefer ODER ≥7 Tage her)
 *
 * Run:  DATABASE_URL=… RESEND_API_KEY=… node scripts/check-price-alerts.mjs [--dry-run]
 */
import { neon } from "@neondatabase/serverless";

const DRY = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1";
const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

const SITE_URL = process.env.SITE_URL || "https://welches-hundefutter.today";
const FROM = process.env.EMAIL_FROM || "BELLA <bella@welches-hundefutter.today>";
const RESEND_KEY = process.env.RESEND_API_KEY;
const MIN_DROP_FROM_BASELINE = 0.05;   // ≥5% unter Anmeldepreis, sonst kein Erst-Alert
const MIN_FURTHER_DROP = 0.03;          // ≥3% unter letzter Meldung für erneuten Alert
const COOLDOWN_DAYS = 7;

async function send(to, subject, html) {
  if (DRY) { console.log(`   [dry-run] -> ${to} :: ${subject}`); return true; }
  if (!RESEND_KEY) { console.log(`   [skip no key] -> ${to} :: ${subject}`); return false; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!r.ok) { console.error("   email-error", r.status, (await r.text()).slice(0, 120)); return false; }
    return true;
  } catch (e) { console.error("   email-exception", e.message); return false; }
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function alertHtml({ foodName, oldP, newP, affiliateUrl, unsubUrl, lowest }) {
  const pct = Math.round((1 - newP / oldP) * 100);
  const tag = lowest ? "günstigster Preis seit 30 Tagen" : `${pct}% günstiger`;
  return `<!doctype html><html lang="de"><body style="margin:0;background:#0b0b10;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#f4f1ea">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="font-size:18px;font-weight:700;margin:0 0 20px">welches-hundefutter<span style="color:#fb923c">.today</span></p>
    <div style="background:#15151c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">Preis gefallen 🎉</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 16px"><strong>${esc(foodName)}</strong> ist gerade <strong style="color:#34d399">${tag}</strong>.</p>
      <table style="width:100%;margin:0 0 20px">
        <tr><td style="color:#9ca3af;font-size:14px">vorher</td><td style="text-align:right;color:#9ca3af;text-decoration:line-through">${oldP.toFixed(2)} €/kg</td></tr>
        <tr><td style="font-size:16px;font-weight:700">jetzt</td><td style="text-align:right;font-size:16px;font-weight:700;color:#34d399">${newP.toFixed(2)} €/kg</td></tr>
      </table>
      <a href="${affiliateUrl}" style="display:inline-block;background:linear-gradient(135deg,#fb923c,#ea580c);color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">Zum Angebot</a>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:16px 0 0">Affiliate-Link (rel=&quot;sponsored&quot;) · Preis inkl. MwSt., kann sich beim Händler ändern · keine Gewähr.</p>
    </div>
    <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center"><a href="${unsubUrl}" style="color:#9ca3af">Abmelden</a> · <a href="${SITE_URL}/impressum" style="color:#9ca3af">Impressum</a></p>
  </div></body></html>`;
}

// ─── Preis-Wecker (mode='price') ─────────────────────────────────────────────
const priceRows = await sql`
  SELECT a.id, a.food_slug, a.food_name, a.baseline_price_per_kg::float AS baseline,
         a.last_notified_at, a.last_notified_price::float AS last_notified_price,
         s.email, s.unsubscribe_token,
         d.name AS cur_name, d.price_per_kg::float AS cur_price, d.affiliate_url, d.is_active AS food_active
  FROM price_alerts a
  JOIN subscribers s ON s.id = a.subscriber_id
  LEFT JOIN dog_foods d ON d.slug = a.food_slug
  WHERE a.is_active = true AND (a.mode = 'price' OR a.mode IS NULL)
    AND s.doi_confirmed_at IS NOT NULL AND s.unsubscribed_at IS NULL`;

console.log(`💰 Preis-Wecker: ${priceRows.length} aktiv${DRY ? " (DRY-RUN)" : ""}`);
let sent = 0, skipped = 0;

for (const a of priceRows) {
  if (!a.food_active || a.cur_price == null) { skipped++; continue; }
  const cur = a.cur_price;
  const agg = await sql`SELECT min(price_per_kg)::float AS min30 FROM price_history
    WHERE food_slug = ${a.food_slug} AND recorded_at > now() - interval '30 days'`;
  const min30 = agg[0]?.min30 ?? cur;
  const baseline = a.baseline ?? cur;

  const cheaperThanSignup = cur < baseline * (1 - 0.0001);
  const isLow = cur <= min30 + 0.0001;
  let worthy;
  if (a.last_notified_price != null) {
    worthy = cur <= a.last_notified_price * (1 - MIN_FURTHER_DROP);
  } else {
    worthy = cur <= baseline * (1 - MIN_DROP_FROM_BASELINE);
  }
  const cooled = !a.last_notified_at || (Date.now() - new Date(a.last_notified_at).getTime()) > COOLDOWN_DAYS * 864e5;

  if (!(cheaperThanSignup && isLow && worthy && cooled)) { skipped++; continue; }

  const oldP = a.last_notified_price && a.last_notified_price > cur ? a.last_notified_price : baseline;
  const foodName = a.cur_name || a.food_name || "Dein Hundefutter";
  const unsubUrl = `${SITE_URL}/api/alerts/unsubscribe?token=${a.unsubscribe_token}`;
  const ok = await send(a.email, `📉 ${foodName} ist gerade günstiger`,
    alertHtml({ foodName, oldP, newP: cur, affiliateUrl: a.affiliate_url || SITE_URL, unsubUrl, lowest: isLow }));
  if (ok) {
    if (!DRY) await sql`UPDATE price_alerts SET last_notified_at = now(), last_notified_price = ${cur} WHERE id = ${a.id}`;
    sent++;
    console.log(`   ✅ ${a.email} :: ${foodName} ${oldP.toFixed(2)}→${cur.toFixed(2)} €/kg`);
  } else skipped++;
}

// ─── Nachschub-Wecker (mode='refill') — Stufe 3 ──────────────────────────────
// Feuert wenn: Sack geht in ≤5 Tagen aus UND aktueller Preis unter 90-Tage-Schnitt
const REFILL_DAYS_AHEAD = 5;   // Wecker X Tage vor Leerung
const REFILL_PRICE_DROP = 0.05; // mind. 5% unter 90-Tage-Schnitt (= echter Tiefpreis)

const refillRowsRaw = await sql.query(
  `SELECT a.id, a.food_slug, a.food_name, a.refill_due_at,
          a.last_notified_at,
          s.email, s.unsubscribe_token,
          p.name AS dog_name,
          d.name AS cur_name, d.price_per_kg::float AS cur_price, d.affiliate_url, d.is_active AS food_active
   FROM price_alerts a
   JOIN subscribers s ON s.id = a.subscriber_id
   LEFT JOIN dog_profiles p ON p.id = a.dog_profile_id
   LEFT JOIN dog_foods d ON d.slug = a.food_slug
   WHERE a.is_active = true AND a.mode = 'refill'
     AND a.refill_due_at IS NOT NULL
     AND a.refill_due_at <= now() + interval '${REFILL_DAYS_AHEAD} days'
     AND s.doi_confirmed_at IS NOT NULL AND s.unsubscribed_at IS NULL`,
  []
);
const refillRows = refillRowsRaw.rows ?? refillRowsRaw;

console.log(`📦 Nachschub-Wecker: ${refillRows.length} fällig${DRY ? " (DRY-RUN)" : ""}`);

for (const a of refillRows) {
  if (!a.food_active || a.cur_price == null) { skipped++; continue; }

  // Cooldown: max. 1 Nachschub-Mail pro Fälligkeit
  const cooled = !a.last_notified_at || (Date.now() - new Date(a.last_notified_at).getTime()) > 3 * 864e5;
  if (!cooled) { skipped++; continue; }

  // 90-Tage-Schnitt für "echter Tiefpreis"-Check
  const agg90 = await sql`SELECT avg(price_per_kg)::float AS avg90 FROM price_history
    WHERE food_slug = ${a.food_slug} AND recorded_at > now() - interval '90 days'`;
  const avg90 = agg90[0]?.avg90 ?? a.cur_price;
  const isGoodPrice = a.cur_price <= avg90 * (1 - REFILL_PRICE_DROP);

  if (!isGoodPrice) {
    console.log(`   ⏭ ${a.email} :: ${a.cur_name} fällig, aber kein Tiefpreis (${a.cur_price.toFixed(2)} vs Ø${avg90.toFixed(2)})`);
    skipped++; continue;
  }

  const dogName = a.dog_name || "dein Hund";
  const foodName = a.cur_name || a.food_name || "Futter";
  const daysLeft = Math.max(0, Math.ceil((new Date(a.refill_due_at) - Date.now()) / 864e5));
  const pct = Math.round((1 - a.cur_price / avg90) * 100);
  const unsubUrl = `${SITE_URL}/api/alerts/unsubscribe?token=${a.unsubscribe_token}`;

  const subject = `📦 ${dogName}s Futter wird knapp – und gerade ${pct}% günstiger`;
  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#0b0b10;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#f4f1ea">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="font-size:18px;font-weight:700;margin:0 0 20px">welches-hundefutter<span style="color:#fb923c">.today</span></p>
    <div style="background:#15151c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">📦 Nachschub-Tipp für ${dogName}</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 16px">
        <strong>${foodName}</strong> geht voraussichtlich in <strong>${daysLeft} Tag${daysLeft !== 1 ? "en" : ""}</strong> zur Neige —
        und der Preis liegt gerade <strong style="color:#34d399">${pct}% unter dem 90-Tage-Schnitt</strong>.
        Guter Moment zum Nachbestellen.
      </p>
      <table style="width:100%;margin:0 0 20px">
        <tr><td style="color:#9ca3af;font-size:14px">90-Tage-Schnitt</td><td style="text-align:right;color:#9ca3af">${avg90.toFixed(2)} €/kg</td></tr>
        <tr><td style="font-size:16px;font-weight:700">aktuell</td><td style="text-align:right;font-size:16px;font-weight:700;color:#34d399">${a.cur_price.toFixed(2)} €/kg</td></tr>
      </table>
      <a href="${a.affiliate_url || SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#fb923c,#ea580c);color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">Jetzt nachbestellen →</a>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:16px 0 0">Affiliate-Link · Preis inkl. MwSt. · kann sich beim Händler ändern · keine Gewähr.</p>
    </div>
    <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center"><a href="${unsubUrl}" style="color:#9ca3af">Abmelden</a> · <a href="${SITE_URL}/impressum" style="color:#9ca3af">Impressum</a></p>
  </div></body></html>`;

  const ok = await send(a.email, subject, html);
  if (ok) {
    if (!DRY) await sql`UPDATE price_alerts SET last_notified_at = now(), last_notified_price = ${a.cur_price} WHERE id = ${a.id}`;
    sent++;
    console.log(`   ✅ ${a.email} :: ${dogName} / ${foodName} — ${daysLeft}d bis leer, ${pct}% Tief`);
  } else skipped++;
}

console.log(`\n📊 Gesamt: ${sent} gesendet, ${skipped} übersprungen.`);
