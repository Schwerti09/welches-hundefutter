/**
 * BELLA Wirkungs-Tracker — Versand-Engine. Schickt 3 Wochen nach einer
 * Futter-Empfehlung mit Problem-Kontext (Allergie/empfindlicher Magen) eine
 * Eine-Klick-Frage: hat's geholfen? Antwort fließt in problem_tags+food_slug-
 * Statistik, die KEIN Vergleichsportal hat (entsteht nur aus echten Gesprächen).
 *
 * Kein DOI nötig — das ist eine direkte Rückfrage zur eigenen Anfrage des
 * Nutzers, kein Massen-Marketing (gleiche Begründung wie beim Profil-Link-Mail).
 * Respektiert aber unsubscribed_at, falls der Nutzer sich seitdem abgemeldet hat.
 */
import { neon } from "@neondatabase/serverless";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function outcomeEmailHtml({ dogName, foodName, respondUrl, unsubUrl, siteUrl }) {
  const btn = (outcome, label, color) =>
    `<a href="${respondUrl(outcome)}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:10px;margin:4px">${label}</a>`;
  return `<!doctype html><html lang="de"><body style="margin:0;background:#0b0b10;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#f4f1ea">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="font-size:18px;font-weight:700;margin:0 0 20px">welches-hundefutter<span style="color:#fb923c">.today</span></p>
    <div style="background:#15151c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">Kurze Frage zu ${esc(dogName || "deinem Hund")} 🐾</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 18px">
        Vor etwa 3 Wochen hat BELLA ${esc(foodName ? `„${foodName}“` : "ein Futter")} empfohlen.
        Würde uns ehrlich interessieren: hat's geholfen?
      </p>
      <div style="text-align:center;margin:0 0 18px">
        ${btn("besser", "👍 Ja, deutlich besser", "#16a34a")}
        ${btn("gleich", "🤷 Kaum verändert", "#6b7280")}
        ${btn("schlechter", "👎 Nein, eher schlechter", "#dc2626")}
      </div>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0">
        Ein Klick reicht, kein Login nötig. Deine Antwort ist eine Erfahrung von dir —
        kein Ersatz für tierärztlichen Rat, falls sich etwas verschlechtert hat.
      </p>
    </div>
    <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center"><a href="${unsubUrl}" style="color:#9ca3af">Keine weiteren Mails</a> · <a href="${siteUrl}/impressum" style="color:#9ca3af">Impressum</a></p>
  </div></body></html>`;
}

export async function runOutcomeChecks({ dryRun = false } = {}) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL fehlt");
  const sql = neon(url);

  const SITE_URL = process.env.SITE_URL || "https://welches-hundefutter.today";
  const FROM = process.env.EMAIL_FROM || "BELLA <bella@welches-hundefutter.today>";
  const RESEND_KEY = process.env.RESEND_API_KEY;

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

  const rows = await sql`
    SELECT oc.id, oc.dog_name, oc.food_name, oc.email, oc.response_token,
           s.unsubscribed_at, s.unsubscribe_token
    FROM outcome_checks oc
    LEFT JOIN subscribers s ON s.id = oc.subscriber_id
    WHERE oc.sent_at IS NULL AND oc.scheduled_at <= now()
  `;

  console.log(`🐾 Wirkungs-Tracker: ${rows.length} fällig${dryRun ? " (DRY-RUN)" : ""}`);
  let sent = 0, skipped = 0;

  for (const r of rows) {
    if (r.unsubscribed_at) { skipped++; continue; }

    const unsubUrl = r.unsubscribe_token
      ? `${SITE_URL}/api/alerts/unsubscribe?token=${r.unsubscribe_token}`
      : `${SITE_URL}/impressum`;
    const respondUrl = (outcome) => `${SITE_URL}/api/outcome/respond?token=${r.response_token}&outcome=${outcome}`;

    const html = outcomeEmailHtml({ dogName: r.dog_name, foodName: r.food_name, respondUrl, unsubUrl, siteUrl: SITE_URL });
    const ok = await send(r.email, `Kurze Frage zu ${r.dog_name || "deinem Hund"} 🐾`, html);

    if (ok) {
      if (!dryRun) await sql`UPDATE outcome_checks SET sent_at = now() WHERE id = ${r.id}`;
      sent++;
      console.log(`   ✅ ${r.email} :: ${r.dog_name || "?"} / ${r.food_name || "?"}`);
    } else skipped++;
  }

  console.log(`\n📊 Gesamt: ${sent} gesendet, ${skipped} übersprungen.`);
  return { sent, skipped };
}
