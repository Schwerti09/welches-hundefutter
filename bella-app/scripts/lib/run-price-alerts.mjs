/**
 * BELLA Schicht 2 — Alert-Engine. Prüft aktive Preis-Wecker bestätigter Abonnenten
 * gegen price_history und schickt NUR bei echter Senkung eine Mail. Glaubwürdigkeit
 * ist das Produkt: kein erfundenes Tief, lieber keine Mail.
 *
 * Trigger (alle müssen zutreffen):
 *   - Futter aktiv, aktueller Preis < Baseline (günstiger als bei Anmeldung)
 *   - aktueller Preis ist 30-Tage-Tief
 *   - genug Abstand zur letzten Meldung (Anti-Spam: ≥3% tiefer ODER ≥7 Tage her)
 */
import { neon } from "@neondatabase/serverless";

const MIN_DROP_FROM_BASELINE = 0.05;   // ≥5% unter Anmeldepreis, sonst kein Erst-Alert
const MIN_FURTHER_DROP = 0.03;          // ≥3% unter letzter Meldung für erneuten Alert
const COOLDOWN_DAYS = 7;
const REFILL_DAYS_AHEAD = 5;   // Wecker X Tage vor Leerung
const REFILL_PRICE_DROP = 0.05; // mind. 5% unter 90-Tage-Schnitt (= echter Tiefpreis)

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function alertHtml({ foodName, oldP, newP, affiliateUrl, unsubUrl, lowest, siteUrl }) {
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
    <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center"><a href="${unsubUrl}" style="color:#9ca3af">Abmelden</a> · <a href="${siteUrl}/impressum" style="color:#9ca3af">Impressum</a></p>
  </div></body></html>`;
}

function refillHtml({ dogName, foodName, daysLeft, pct, avg90, curPrice, affiliateUrl, unsubUrl, siteUrl }) {
  return `<!doctype html><html lang="de"><body style="margin:0;background:#0b0b10;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#f4f1ea">
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
        <tr><td style="font-size:16px;font-weight:700">aktuell</td><td style="text-align:right;font-size:16px;font-weight:700;color:#34d399">${curPrice.toFixed(2)} €/kg</td></tr>
      </table>
      <a href="${affiliateUrl}" style="display:inline-block;background:linear-gradient(135deg,#fb923c,#ea580c);color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">Jetzt nachbestellen →</a>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:16px 0 0">Affiliate-Link · Preis inkl. MwSt. · kann sich beim Händler ändern · keine Gewähr.</p>
    </div>
    <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center"><a href="${unsubUrl}" style="color:#9ca3af">Abmelden</a> · <a href="${siteUrl}/impressum" style="color:#9ca3af">Impressum</a></p>
  </div></body></html>`;
}

export async function runPriceAlerts({ dryRun = false } = {}) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL fehlt");
  const sql = neon(url);

  const SITE_URL = process.env.SITE_URL || "https://welches-hundefutter.today";
  const FROM = process.env.EMAIL_FROM || "BELLA <bella@welches-hundefutter.today>";
  const RESEND_KEY = process.env.RESEND_API_KEY;

  // Nachschub-/Lebensphasen-Mails über /empfehlung/[slug] verlinken statt direkt auf die
  // AWIN-URL, damit der Klick als eigenes Event (refill_click/lifecycle_click) statt gar
  // nicht erfasst wird (Roadmap 5.3). Ohne Slug lieber die rohe Affiliate-URL als kaputter Link.
  const trackedLink = (foodSlug, rawAffiliateUrl, src) =>
    foodSlug ? `${SITE_URL}/empfehlung/${foodSlug}?src=${src}` : (rawAffiliateUrl || SITE_URL);

  async function send(to, subject, html) {
    if (dryRun) { console.log(`   [dry-run] -> ${to} :: ${subject}`); return true; }
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

  console.log(`💰 Preis-Wecker: ${priceRows.length} aktiv${dryRun ? " (DRY-RUN)" : ""}`);
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
      alertHtml({ foodName, oldP, newP: cur, affiliateUrl: a.affiliate_url || SITE_URL, unsubUrl, lowest: isLow, siteUrl: SITE_URL }));
    if (ok) {
      if (!dryRun) await sql`UPDATE price_alerts SET last_notified_at = now(), last_notified_price = ${cur} WHERE id = ${a.id}`;
      sent++;
      console.log(`   ✅ ${a.email} :: ${foodName} ${oldP.toFixed(2)}→${cur.toFixed(2)} €/kg`);
    } else skipped++;
  }

  // ─── Nachschub-Wecker (mode='refill') — Stufe 3 ──────────────────────────────
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

  console.log(`📦 Nachschub-Wecker: ${refillRows.length} fällig${dryRun ? " (DRY-RUN)" : ""}`);

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
    const html = refillHtml({
      dogName, foodName, daysLeft, pct, avg90, curPrice: a.cur_price,
      affiliateUrl: trackedLink(a.food_slug, a.affiliate_url, "refill"), unsubUrl, siteUrl: SITE_URL,
    });

    const ok = await send(a.email, subject, html);
    if (ok) {
      if (!dryRun) await sql`UPDATE price_alerts SET last_notified_at = now(), last_notified_price = ${a.cur_price} WHERE id = ${a.id}`;
      sent++;
      console.log(`   ✅ ${a.email} :: ${dogName} / ${foodName} — ${daysLeft}d bis leer, ${pct}% Tief`);
    } else skipped++;
  }

  // ─── Lebensphasen-Wecker (mode='lifecycle') — Stufe 4 ────────────────────────
  // Sendet 30 Tage VOR der Transition, damit der Halter Zeit hat, umzustellen.
  const LIFECYCLE_LEAD_DAYS = 30;
  const lifecycleRowsRaw = await sql.query(
    `SELECT a.id, a.food_slug, a.food_name, a.refill_due_at AS transition_at,
            a.last_notified_at,
            s.email, s.unsubscribe_token,
            p.name AS dog_name, p.weight_kg,
            d.affiliate_url, d.is_active AS food_active
     FROM price_alerts a
     JOIN subscribers s ON s.id = a.subscriber_id
     LEFT JOIN dog_profiles p ON p.id = a.dog_profile_id
     LEFT JOIN dog_foods d ON d.slug = a.food_slug
     WHERE a.is_active = true AND a.mode = 'lifecycle'
       AND a.refill_due_at IS NOT NULL
       AND a.refill_due_at <= now() + interval '${LIFECYCLE_LEAD_DAYS} days'
       AND a.refill_due_at > now()
       AND s.doi_confirmed_at IS NOT NULL AND s.unsubscribed_at IS NULL`,
    []
  );
  const lifecycleRows = lifecycleRowsRaw.rows ?? lifecycleRowsRaw;

  console.log(`🐾 Lebensphasen-Wecker: ${lifecycleRows.length} fällig${dryRun ? " (DRY-RUN)" : ""}`);

  for (const a of lifecycleRows) {
    // Cooldown: max. 1 Lebensphasen-Mail, nie doppelt senden
    const cooled = !a.last_notified_at;
    if (!cooled) { skipped++; continue; }

    const dogName = a.dog_name || "dein Hund";
    const transitionDate = new Date(a.transition_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
    const daysLeft = Math.max(1, Math.ceil((new Date(a.transition_at) - Date.now()) / 864e5));
    const isLarge = a.weight_kg && parseFloat(a.weight_kg) >= 25;
    const unsubUrl = `${SITE_URL}/api/alerts/unsubscribe?token=${a.unsubscribe_token}`;
    const affiliateUrl = a.food_slug ? trackedLink(a.food_slug, a.affiliate_url, "lifecycle") : `${SITE_URL}/#bella-advisor`;

    const subject = `🐾 ${dogName} wird bald Senior — jetzt vorbereiten`;
    const html = `<!doctype html><html lang="de"><body style="margin:0;background:#0b0b10;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#f4f1ea">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="font-size:18px;font-weight:700;margin:0 0 20px">welches-hundefutter<span style="color:#fb923c">.today</span></p>
    <div style="background:#15151c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">🐾 ${dogName} wird Senior</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 16px">
        In <strong>${daysLeft} Tagen</strong> (ca. ${transitionDate}) erreicht ${dogName} die Senior-Phase.
        Jetzt ist der richtige Moment, das Futter anzupassen — bevor die Gelenke es verlangen.
      </p>
      <div style="background:#0f172a;border-radius:12px;padding:16px;margin:0 0 20px">
        <p style="margin:0 0 8px;font-size:14px;color:#94a3b8">Was Senior-Futter können sollte:</p>
        <ul style="margin:0;padding:0 0 0 18px;color:#cbd5e1;font-size:14px;line-height:1.8">
          <li>Omega-3 (EPA/DHA) für die Gelenke</li>
          <li>Reduzierter Phosphorgehalt (schont die Nieren)</li>
          <li>Leicht verdauliches Protein${isLarge ? " — besonders wichtig bei großen Rassen" : ""}</li>
          <li>L-Carnitin für Muskelmasse im Alter</li>
        </ul>
      </div>
      <a href="${affiliateUrl}" style="display:inline-block;background:linear-gradient(135deg,#fb923c,#ea580c);color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">Senior-Futter von BELLA empfehlen lassen →</a>
      <div style="background:#1a1a24;border:1px solid rgba(251,146,60,.25);border-radius:12px;padding:16px;margin:20px 0 0">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#fbbf24">🛡️ Noch kein Versicherungsschutz?</p>
        <p style="margin:0 0 12px;font-size:13px;color:#94a3b8;line-height:1.6">Die meisten Tierversicherer nehmen keine Neukunden mehr ab dem 8. Lebensjahr an. Jetzt ist der letzte gute Zeitpunkt, ${dogName} zu versichern — bevor Vorerkrankungen entstehen, die ausgeschlossen werden.</p>
        <a href="${SITE_URL}/versicherung" style="display:inline-block;background:rgba(251,146,60,.15);border:1px solid rgba(251,146,60,.3);color:#fbbf24;text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px">Hunde-Krankenversicherung vergleichen →</a>
      </div>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:16px 0 0">Affiliate-Link · BELLA-Empfehlung basiert auf echten Produktdaten · keine Heilversprechen · Tierarzt bei Fragen hinzuziehen.</p>
    </div>
    <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center"><a href="${unsubUrl}" style="color:#9ca3af">Abmelden</a> · <a href="${SITE_URL}/impressum" style="color:#9ca3af">Impressum</a></p>
  </div></body></html>`;

    const ok = await send(a.email, subject, html);
    if (ok) {
      if (!dryRun) await sql`UPDATE price_alerts SET last_notified_at = now() WHERE id = ${a.id}`;
      sent++;
      console.log(`   ✅ ${a.email} :: ${dogName} Senior in ${daysLeft}d (${transitionDate})`);
    } else skipped++;
  }

  console.log(`\n📊 Gesamt: ${sent} gesendet, ${skipped} übersprungen.`);
  return { sent, skipped };
}
