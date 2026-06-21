// BELLA Schicht 2 — E-Mail-Versand (Resend via fetch, ohne SDK-Abhängigkeit).
// Graceful degrade: ohne RESEND_API_KEY wird NICHT versendet, sondern geloggt —
// damit Dev/Build funktionieren und nie ein Versand-Fehler den Flow killt.
// Zustellbarkeit (SPF/DKIM/DMARC) regelt die verifizierte Resend-Domain.

export const SITE_URL = process.env.SITE_URL || "https://welches-hundefutter.today";
const FROM = process.env.EMAIL_FROM || "BELLA <bella@welches-hundefutter.today>";
const RESEND_KEY = process.env.RESEND_API_KEY;

type SendResult = { ok: boolean; skipped?: boolean; id?: string; error?: string };

export async function sendEmail(opts: { to: string; subject: string; html: string; text?: string }): Promise<SendResult> {
  if (!RESEND_KEY) {
    console.log(`[email:skipped no RESEND_API_KEY] -> ${opts.to} :: ${opts.subject}`);
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text }),
    });
    if (!res.ok) {
      const error = await res.text().catch(() => String(res.status));
      console.error("[email:error]", res.status, error.slice(0, 200));
      return { ok: false, error };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (e) {
    console.error("[email:exception]", (e as Error).message);
    return { ok: false, error: (e as Error).message };
  }
}

// ─── Layout ────────────────────────────────────────────────────────────────
function shell(inner: string, unsubscribeUrl?: string): string {
  return `<!doctype html><html lang="de"><body style="margin:0;background:#0b0b10;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#f4f1ea">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#fb923c,#ea580c);text-align:center;line-height:36px;color:#fff;font-weight:800">B</div>
      <span style="font-size:18px;font-weight:700">welches-hundefutter<span style="color:#fb923c">.today</span></span>
    </div>
    <div style="background:#15151c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:28px">
      ${inner}
    </div>
    <p style="color:#6b7280;font-size:12px;line-height:1.6;margin-top:20px;text-align:center">
      Du bekommst diese E-Mail, weil du bei BELLA einen Preis-Wecker angefordert hast.${
        unsubscribeUrl ? ` <a href="${unsubscribeUrl}" style="color:#9ca3af">Abmelden</a> ·` : ""
      } <a href="${SITE_URL}/impressum" style="color:#9ca3af">Impressum</a> · <a href="${SITE_URL}/datenschutz" style="color:#9ca3af">Datenschutz</a>
    </p>
  </div></body></html>`;
}
const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#fb923c,#ea580c);color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">${label}</a>`;

// ─── Templates ───────────────────────────────────────────────────────────────
export function doiEmail(confirmUrl: string, foodName?: string) {
  const ctx = foodName ? ` für <strong>${escapeHtml(foodName)}</strong>` : "";
  return {
    subject: "🔔 Bitte bestätige deinen Preis-Wecker",
    html: shell(`
      <h1 style="font-size:20px;margin:0 0 12px">Nur noch ein Klick 🐾</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px">
        Du möchtest, dass BELLA dir Bescheid gibt, wenn dein Hundefutter${ctx} günstiger wird?
        Bestätige kurz deine E-Mail — danach passt BELLA auf den Preis auf.
      </p>
      <p style="margin:0 0 20px">${btn(confirmUrl, "Preis-Wecker bestätigen")}</p>
      <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0">
        Wenn du das nicht warst, ignoriere diese E-Mail einfach — ohne Bestätigung passiert nichts.
      </p>`),
    text: `Bestätige deinen Preis-Wecker${foodName ? ` für ${foodName}` : ""}: ${confirmUrl}`,
  };
}

export function welcomeEmail(unsubscribeUrl: string, foodName?: string) {
  const ctx = foodName ? ` für <strong>${escapeHtml(foodName)}</strong>` : "";
  return {
    subject: "✅ Dein Preis-Wecker ist aktiv",
    html: shell(`
      <h1 style="font-size:20px;margin:0 0 12px">Alles klar — BELLA passt auf 🐶</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 16px">
        Dein Preis-Wecker${ctx} ist aktiv. Sobald der Preis echt fällt — nicht erfunden, sondern
        aus den täglich aktualisierten Daten — schicke ich dir eine kurze Mail. Kein Spam, versprochen.
      </p>
      <p style="margin:0">${btn(`${SITE_URL}/`, "Zu BELLA")}</p>`, unsubscribeUrl),
    text: `Dein Preis-Wecker${foodName ? ` für ${foodName}` : ""} ist aktiv. Abmelden: ${unsubscribeUrl}`,
  };
}

export function priceAlertEmail(p: {
  foodName: string; oldPricePerKg: number; newPricePerKg: number;
  affiliateUrl: string; unsubscribeUrl: string; lowest?: boolean;
}) {
  const pct = Math.round((1 - p.newPricePerKg / p.oldPricePerKg) * 100);
  const tag = p.lowest ? "günstigster Preis seit 30 Tagen" : `${pct}% günstiger`;
  return {
    subject: `📉 ${p.foodName} ist gerade ${tag}`,
    html: shell(`
      <h1 style="font-size:20px;margin:0 0 12px">Preis gefallen 🎉</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 16px">
        <strong>${escapeHtml(p.foodName)}</strong> ist gerade <strong style="color:#34d399">${tag}</strong>.
      </p>
      <table style="width:100%;margin:0 0 20px"><tr>
        <td style="color:#9ca3af;font-size:14px">vorher</td>
        <td style="text-align:right;color:#9ca3af;text-decoration:line-through">${p.oldPricePerKg.toFixed(2)} €/kg</td>
      </tr><tr>
        <td style="font-size:16px;font-weight:700">jetzt</td>
        <td style="text-align:right;font-size:16px;font-weight:700;color:#34d399">${p.newPricePerKg.toFixed(2)} €/kg</td>
      </tr></table>
      <p style="margin:0 0 16px">${btn(p.affiliateUrl, "Zum Angebot")}</p>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0">
        Affiliate-Link (rel=&quot;sponsored&quot;) · Preis inkl. MwSt., kann sich beim Händler ändern · keine Gewähr.
      </p>`, p.unsubscribeUrl),
    text: `${p.foodName} ist jetzt ${p.newPricePerKg.toFixed(2)} €/kg (vorher ${p.oldPricePerKg.toFixed(2)}). ${p.affiliateUrl} — Abmelden: ${p.unsubscribeUrl}`,
  };
}

export function magicLinkEmail(restoreUrl: string, dogName?: string) {
  const ctx = dogName ? ` für <strong>${escapeHtml(dogName)}</strong>` : "";
  return {
    subject: "🐾 Dein BELLA-Profil-Link",
    html: shell(`
      <h1 style="font-size:20px;margin:0 0 12px">Hier ist dein Profil-Link 🐕</h1>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px">
        Du möchtest dein Hunde-Profil${ctx} auf einem neuen Gerät öffnen?
        Klick einfach auf den Button — du bist sofort drin, kein Passwort nötig.
      </p>
      <p style="margin:0 0 20px">${btn(restoreUrl, "Profil öffnen →")}</p>
      <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0">
        Dieser Link funktioniert einmalig und läuft nach 24 Stunden ab.
        Falls du diese E-Mail nicht angefordert hast, ignoriere sie einfach.
      </p>`),
    text: `Dein BELLA-Profil-Link${dogName ? ` für ${dogName}` : ""}: ${restoreUrl}`,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
