import type { Config } from "@netlify/functions";

/**
 * Stündlicher Produktions-Smoke (Roadmap 6.1). Prüft die wichtigsten Routen der
 * Live-Seite auf Status + Inhalts-Marker. Fehler landen im Netlify-Function-Log
 * (`console.error`) — eine echte Alerting-Anbindung folgt mit 6.1.
 */

const SITE = process.env.SITE_URL || "https://welches-hundefutter.today";

const CHECKS: { path: string; needle?: string }[] = [
  { path: "/", needle: "BELLA" },
  { path: "/rassen", needle: "Rasse" },
  { path: "/rasse/labrador-retriever", needle: "Labrador" },
  { path: "/problem/allergie", needle: "Allergie" },
  { path: "/sitemap.xml", needle: "<urlset" },
  { path: "/robots.txt", needle: "Sitemap" },
  { path: "/llms.txt", needle: "welches-hundefutter" },
  { path: "/api/advisor/chat", needle: undefined }, // GET → erwartet 405, kein 5xx
];

async function check(path: string, needle?: string) {
  const started = Date.now();
  try {
    const res = await fetch(SITE + path, { headers: { "user-agent": "bella-health-check" } });
    const ms = Date.now() - started;
    const body = needle ? await res.text() : "";
    const serverError = res.status >= 500;
    const missingNeedle = needle ? !body.includes(needle) : false;
    const ok = !serverError && !missingNeedle;
    return { path, status: res.status, ms, ok, missingNeedle };
  } catch (e) {
    return { path, status: 0, ms: Date.now() - started, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export default async () => {
  const results = await Promise.all(CHECKS.map((c) => check(c.path, c.needle)));
  const failed = results.filter((r) => !r.ok);

  if (failed.length) {
    console.error("[health-check] FAIL", JSON.stringify({ site: SITE, failed }));
  } else {
    console.log("[health-check] OK", JSON.stringify({ site: SITE, checks: results.length, maxMs: Math.max(...results.map((r) => r.ms)) }));
  }

  return new Response(JSON.stringify({ site: SITE, ok: failed.length === 0, results }), {
    status: failed.length ? 500 : 200,
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  schedule: "0 * * * *", // stündlich
};
