import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const schema = z.object({
  provider: z.string().min(1),
  monthlyPrice: z.number().positive(),
  dataVolume: z.string().optional(),
  device: z.string().optional(),
});

type BestOffer = { device_name: string; provider_name: string; tariff_name: string; monthly_price: string };

function parseDataGb(vol?: string): number {
  if (!vol) return 0;
  if (/unlimited|unbegrenzt|flatrate/i.test(vol)) return 999;
  const m = vol.match(/(\d+(?:[.,]\d+)?)/);
  return m ? parseFloat(m[1].replace(",", ".")) : 0;
}

function gradeFromScore(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { provider, monthlyPrice, dataVolume } = parsed.data;
  const userGb = parseDataGb(dataVolume);
  const url = process.env.DATABASE_URL;

  let marketAvg = monthlyPrice;
  let bestPrice = monthlyPrice;
  let bestOffer: BestOffer | null = null;

  if (url) {
    const sql = neon(url);
    try {
      const dataFilter = userGb >= 999
        ? "AND is_unlimited = true"
        : userGb > 0
        ? `AND (is_unlimited = true OR data_volume_gb >= ${Math.max(userGb * 0.5, 5)})`
        : "";

      // Market average
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const avgRows: any[] = ((await sql.query(
        `SELECT AVG(monthly_price::numeric) avg_p, MIN(monthly_price::numeric) min_p
         FROM offers
         WHERE availability = 'in stock' AND monthly_price > 0
           AND tariff_name NOT ILIKE '%zuhause%' AND tariff_name NOT ILIKE '%glasfaser%'
           AND device_name NOT ILIKE '%tab%' ${dataFilter}`,
        []
      )) as unknown as { rows: Record<string, string>[] }).rows ?? [];
      if (avgRows[0]) {
        marketAvg = parseFloat(avgRows[0].avg_p ?? String(monthlyPrice));
      }

      // Best alternative
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const altRows: any[] = ((await sql.query(
        `SELECT DISTINCT ON (LOWER(REGEXP_REPLACE(device_name, '[^a-zA-Z0-9]', '', 'g')))
           device_name, provider_name, tariff_name, monthly_price
         FROM offers
         WHERE availability = 'in stock' AND monthly_price > 0
           AND tariff_name NOT ILIKE '%zuhause%' AND tariff_name NOT ILIKE '%glasfaser%'
           AND device_name NOT ILIKE '%tab%' AND device_name NOT ILIKE '%buds%'
           ${dataFilter}
         ORDER BY LOWER(REGEXP_REPLACE(device_name, '[^a-zA-Z0-9]', '', 'g')), monthly_price ASC
         LIMIT 20`,
        []
      )) as unknown as { rows: BestOffer[] }).rows ?? [];

      if (altRows.length) {
        altRows.sort((a, b) => parseFloat(a.monthly_price) - parseFloat(b.monthly_price));
        bestOffer = altRows[0] as BestOffer;
        bestPrice = parseFloat(bestOffer.monthly_price);
      }
    } catch { /* use defaults */ }
  }

  const monthlyOverpay = Math.max(0, monthlyPrice - bestPrice);
  const yearlyOverpay = monthlyOverpay * 24;
  const pricePct = monthlyPrice / Math.max(marketAvg, 1);

  let score = 70;
  if (pricePct <= 0.85) score += 20;
  else if (pricePct <= 1.0) score += 10;
  else if (pricePct <= 1.2) score -= 10;
  else if (pricePct <= 1.4) score -= 20;
  else score -= 30;
  if (userGb >= 50) score += 5;
  if (/telekom/i.test(provider)) score += 5;
  else if (/vodafone/i.test(provider)) score += 3;
  score = Math.max(10, Math.min(95, score));

  const grade = gradeFromScore(score);

  const weaknesses: string[] = [];
  if (monthlyOverpay >= 5) weaknesses.push(`${monthlyOverpay.toFixed(2)} €/Monat über dem günstigsten Marktangebot — entspricht ${yearlyOverpay.toFixed(0)} € über 24 Monate.`);
  if (userGb > 0 && userGb < 20 && monthlyPrice > 25) weaknesses.push("Geringes Datenvolumen für den Preis — besseres Preis-Daten-Verhältnis verfügbar.");
  if (pricePct > 1.3) weaknesses.push("Preis liegt deutlich über dem Marktdurchschnitt für vergleichbare Tarife.");

  const verdictMap: Record<string, string> = {
    A: "Dieser Vertrag ist markteffizient bewertet. Aktuell kein Optimierungsbedarf.",
    B: "Solider Vertrag. Geringes Optimierungspotenzial, kein dringender Handlungsbedarf.",
    C: `Mittelmäßige Markteffizienz. ${monthlyOverpay > 0 ? `Überzahlung: ${monthlyOverpay.toFixed(2)} €/Monat.` : "Bessere Alternativen sind verfügbar."}`,
    D: "Vertrag liegt unter dem optimalen Marktniveau. Wechsel empfohlen.",
    F: `Erhebliche Überteuerung. ${monthlyOverpay > 0 ? `${monthlyOverpay.toFixed(2)} €/Monat Mehrkosten.` : ""} Sofortiger Wechsel empfohlen.`,
  };

  const bestAlt = bestOffer ? {
    device: bestOffer.device_name,
    provider: bestOffer.provider_name,
    tariff: bestOffer.tariff_name,
    price: parseFloat(bestOffer.monthly_price),
    saving: monthlyOverpay,
  } : null;

  const recommendation = bestAlt
    ? `${bestAlt.device} bei ${bestAlt.provider} (${bestAlt.tariff}) für ${bestAlt.price.toFixed(2)} €/Monat liefert vergleichbares Leistungsprofil bei ${bestAlt.saving.toFixed(2)} €/Monat weniger.`
    : "Für präzise Alternativen ein vollständiges BELLA-Profil erstellen.";

  return NextResponse.json({
    grade, gradeScore: score, monthlyOverpay, yearlyOverpay,
    verdict: verdictMap[grade] ?? verdictMap["C"],
    weaknesses, bestAlternative: bestAlt, recommendation,
  });
}
