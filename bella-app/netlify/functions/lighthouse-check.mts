import type { Config } from "@netlify/functions";

/**
 * Täglicher Lighthouse-Check über die PageSpeed-Insights-API (Roadmap 6.2 Teil 2).
 * Reine Beobachtung, kein Deploy-Gate: Ergebnisse landen im Netlify-Function-Log
 * (`console.warn`/`console.error`), es gibt keinen Build-Fail. `PAGESPEED_API_KEY`
 * ist optional (höheres Quota) — ohne Key läuft die API im kostenlosen, niedrigeren
 * Kontingent, das für 3 URLs/Tag ausreicht.
 */

const SITE = process.env.SITE_URL || "https://welches-hundefutter.today";
const PSI_KEY = process.env.PAGESPEED_API_KEY;

const PAGES = ["/", "/rassen", "/rasse/labrador-retriever"];

// Akzeptanzschwellen aus BELLA_NEXT_LEVEL.md Roadmap 6.2.
const THRESHOLDS = { performance: 0.95, totalBlockingTimeMs: 200, cls: 0.02 };

interface PsiResult {
  path: string;
  ok: boolean;
  performance?: number;
  totalBlockingTimeMs?: number;
  cls?: number;
  error?: string;
}

async function checkPage(path: string): Promise<PsiResult> {
  const url = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  url.searchParams.set("url", SITE + path);
  url.searchParams.set("category", "performance");
  url.searchParams.set("strategy", "mobile");
  if (PSI_KEY) url.searchParams.set("key", PSI_KEY);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return { path, ok: false, error: `PSI HTTP ${res.status}` };
    const data = await res.json();
    const performance = data?.lighthouseResult?.categories?.performance?.score as number | undefined;
    const totalBlockingTimeMs = data?.lighthouseResult?.audits?.["total-blocking-time"]?.numericValue as number | undefined;
    const cls = data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.numericValue as number | undefined;
    if (performance == null) return { path, ok: false, error: "keine Lighthouse-Daten in PSI-Antwort" };

    const ok =
      performance >= THRESHOLDS.performance &&
      (totalBlockingTimeMs ?? 0) <= THRESHOLDS.totalBlockingTimeMs &&
      (cls ?? 0) <= THRESHOLDS.cls;

    return { path, ok, performance, totalBlockingTimeMs, cls };
  } catch (e) {
    return { path, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export default async () => {
  // Sequenziell statt Promise.all — PSI ist selbst schon langsam (mehrere Sekunden
  // pro URL) und das kostenlose Kontingent ist knapp; kein Grund, es zu parallelisieren.
  const results: PsiResult[] = [];
  for (const path of PAGES) results.push(await checkPage(path));

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.warn("[lighthouse-check] unter Schwelle oder Fehler", JSON.stringify({ site: SITE, failed }));
  } else {
    console.log("[lighthouse-check] OK", JSON.stringify({ site: SITE, results }));
  }

  return new Response(JSON.stringify({ site: SITE, ok: failed.length === 0, results }), {
    status: 200, // Beobachtung, kein Gate — auch bei Warnungen 200
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  schedule: "30 4 * * *", // täglich 04:30 UTC — außerhalb der Hauptlast, versetzt zum stündlichen health-check
};
