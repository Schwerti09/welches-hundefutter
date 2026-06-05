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

// Aktive Wecker bestätigter, nicht abgemeldeter Abonnenten + aktueller Preis
const rows = await sql`
  SELECT a.id, a.food_slug, a.food_name, a.baseline_price_per_kg::float AS baseline,
         a.last_notified_at, a.last_notified_price::float AS last_notified_price,
         s.email, s.unsubscribe_token,
         d.name AS cur_name, d.price_per_kg::float AS cur_price, d.affiliate_url, d.is_active AS food_active
  FROM price_alerts a
  JOIN subscribers s ON s.id = a.subscriber_id
  LEFT JOIN dog_foods d ON d.slug = a.food_slug
  WHERE a.is_active = true AND s.doi_confirmed_at IS NOT NULL AND s.unsubscribed_at IS NULL`;

console.log(`🔔 ${rows.length} aktive Wecker bestätigter Abonnenten${DRY ? " (DRY-RUN)" : ""}`);
let sent = 0, skipped = 0;

for (const a of rows) {
  if (!a.food_active || a.cur_price == null) { skipped++; continue; }
  const cur = a.cur_price;
  // 30-Tage-Tief aus price_history
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

console.log(`\n📊 Alerts: ${sent} gesendet, ${skipped} übersprungen (kein echtes Tief / Cooldown).`);
