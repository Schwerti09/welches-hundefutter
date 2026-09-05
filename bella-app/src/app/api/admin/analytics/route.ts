import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reines Lese-Dashboard über die First-Party-Events (Roadmap 5.2/5.3 Teil 2).
 * Nur Aggregate (Counts) — nie einzelne Event-Zeilen mit `props`/`sessionId`,
 * damit hier kein PII-Leck durch die Hintertür entsteht (AGENTS.md §133).
 * Auth: dasselbe Bearer-Token-Muster wie /api/outreach/* (§101 — kein zweites
 * Admin-Token-Konzept nur für diese eine Route).
 */
function authed(req: NextRequest): boolean {
  const token = process.env.OUTREACH_TOKEN;
  if (!token) return false;
  return req.headers.get("x-outreach-token") === token;
}

interface FunnelRow { name: string; count: string }
interface DailyRow { day: string; name: string; count: string }
interface AiUsageRow { provider: string; ok: boolean; n: string; input_tokens: string | null; output_tokens: string | null; avg_latency_ms: string | null }
interface OutcomeFunnelRow { scheduled: string; sent: string; responded: string }
interface OutcomeResultRow { outcome: string | null; count: string }
interface OutcomeTagRow { tag: string; outcome: string | null; count: string }

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL fehlt" }, { status: 500 });

  try {
    const sql = neon(dbUrl);

    const [funnel7d, funnel30d, daily14d, aiUsage7d, outcomeFunnel, outcomeResults, outcomeByTag] = await Promise.all([
      sql`SELECT name, COUNT(*)::text AS count FROM events WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY name ORDER BY count DESC` as unknown as Promise<FunnelRow[]>,
      sql`SELECT name, COUNT(*)::text AS count FROM events WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY name ORDER BY count DESC` as unknown as Promise<FunnelRow[]>,
      sql`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, name, COUNT(*)::text AS count
          FROM events WHERE created_at >= NOW() - INTERVAL '14 days'
          GROUP BY day, name ORDER BY day ASC` as unknown as Promise<DailyRow[]>,
      sql`SELECT provider, ok, COUNT(*)::text AS n,
                 SUM(input_tokens)::text AS input_tokens, SUM(output_tokens)::text AS output_tokens,
                 ROUND(AVG(latency_ms))::text AS avg_latency_ms
          FROM ai_usage WHERE created_at >= NOW() - INTERVAL '7 days'
          GROUP BY provider, ok ORDER BY provider, ok` as unknown as Promise<AiUsageRow[]>,
      // Roadmap 5.4 "Outcome-Checks sichtbar": Trichter über den gesamten Bestand
      // (nicht zeitgefenstert — bei den erwarteten Fallzahlen macht ein 7/30-Tage-
      // Fenster hier keinen Sinn).
      sql`SELECT COUNT(*)::text AS scheduled,
                 COUNT(*) FILTER (WHERE sent_at IS NOT NULL)::text AS sent,
                 COUNT(*) FILTER (WHERE responded_at IS NOT NULL)::text AS responded
          FROM outcome_checks` as unknown as Promise<OutcomeFunnelRow[]>,
      sql`SELECT outcome, COUNT(*)::text AS count FROM outcome_checks WHERE responded_at IS NOT NULL GROUP BY outcome` as unknown as Promise<OutcomeResultRow[]>,
      // Roh-Tags wie tatsächlich gespeichert (aktuell: gemiedene Proteine + Lebensphase,
      // NICHT die /problem/[slug]-Taxonomie — siehe Roadmap-Nachtrag). Nur zur internen
      // Einordnung, deshalb kein n-Schwellwert wie bei einer öffentlichen Aussage nötig.
      sql`SELECT unnest(problem_tags) AS tag, outcome, COUNT(*)::text AS count
          FROM outcome_checks WHERE responded_at IS NOT NULL
          GROUP BY tag, outcome ORDER BY tag` as unknown as Promise<OutcomeTagRow[]>,
    ]);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      funnel7d,
      funnel30d,
      daily14d,
      aiUsage7d,
      outcomeFunnel: outcomeFunnel[0] ?? { scheduled: "0", sent: "0", responded: "0" },
      outcomeResults,
      outcomeByTag,
    });
  } catch (e) {
    return NextResponse.json({ error: "Abfrage fehlgeschlagen: " + (e as Error).message }, { status: 500 });
  }
}
