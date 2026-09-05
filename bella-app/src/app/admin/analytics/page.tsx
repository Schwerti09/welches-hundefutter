"use client";

import { useState } from "react";

interface FunnelRow { name: string; count: string }
interface DailyRow { day: string; name: string; count: string }
interface AiUsageRow { provider: string; ok: boolean; n: string; input_tokens: string | null; output_tokens: string | null; avg_latency_ms: string | null }
interface AnalyticsData {
  generatedAt: string;
  funnel7d: FunnelRow[];
  funnel30d: FunnelRow[];
  daily14d: DailyRow[];
  aiUsage7d: AiUsageRow[];
}

const EVENT_LABELS: Record<string, string> = {
  pageview: "Seitenaufrufe",
  advisor_start: "BELLA gestartet",
  advisor_offers: "Empfehlung erhalten",
  affiliate_click: "Affiliate-Klick",
  alert_subscribe: "Preis-Wecker abonniert",
  refill_click: "Nachschub-Klick",
};

export default function AnalyticsAdmin() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function load() {
    if (!token) { setStatus("Bitte zuerst den Zugangs-Token eintragen."); return; }
    setBusy(true); setStatus("Lade …");
    try {
      const r = await fetch("/api/admin/analytics", { headers: { "x-outreach-token": token } });
      const d = await r.json();
      if (!r.ok) { setStatus("Fehler: " + (d.error ?? r.status)); setData(null); return; }
      setData(d as AnalyticsData);
      setStatus("");
    } catch (e) {
      setStatus("Fehler: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[var(--honey,#f0a73c)] text-[#f4f1ea]";

  // Tage × Event-Namen für die 14-Tage-Tabelle
  const days = data ? Array.from(new Set(data.daily14d.map((r) => r.day))).sort() : [];
  const eventNames = data ? Array.from(new Set(data.daily14d.map((r) => r.name))) : [];
  const cellCount = (day: string, name: string) =>
    data?.daily14d.find((r) => r.day === day && r.name === name)?.count ?? "0";

  return (
    <div style={{ minHeight: "100vh", background: "#08080c", color: "#f4f1ea" }}>
      <div className="max-w-4xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Analytics — First-Party-Funnel</h1>
        <p className="text-sm text-[#9a93a6] mb-6 leading-relaxed">
          Nur Aggregate aus der <code>events</code>-Tabelle (Roadmap 5.2/5.3) — keine einzelnen
          Sitzungen, keine personenbezogenen Daten.
        </p>

        <div className="flex gap-2 mb-8">
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Zugangs-Token (OUTREACH_TOKEN)" className={field} />
          <button onClick={load} disabled={busy} className="rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap" style={{ background: "linear-gradient(135deg,#f0a73c,#ff8a4c)", color: "#000", opacity: busy ? 0.6 : 1 }}>
            {busy ? "…" : "Laden"}
          </button>
        </div>

        {status && <p className="mb-6 text-sm text-[#9a93a6]">{status}</p>}

        {data && (
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#9a93a6] mb-3">Funnel — letzte 7 / 30 Tage</h2>
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] text-left text-[#9a93a6]">
                      <th className="px-4 py-2.5 font-medium">Event</th>
                      <th className="px-4 py-2.5 font-medium text-right">7 Tage</th>
                      <th className="px-4 py-2.5 font-medium text-right">30 Tage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.funnel30d.map((r) => {
                      const c7 = data.funnel7d.find((x) => x.name === r.name)?.count ?? "0";
                      return (
                        <tr key={r.name} className="border-t border-white/5">
                          <td className="px-4 py-2.5">{EVENT_LABELS[r.name] ?? r.name}</td>
                          <td className="px-4 py-2.5 text-right font-semibold">{c7}</td>
                          <td className="px-4 py-2.5 text-right text-[#9a93a6]">{r.count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#9a93a6] mb-3">Tagesverlauf — letzte 14 Tage</h2>
              <div className="rounded-2xl border border-white/10 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-white/[0.03] text-left text-[#9a93a6]">
                      <th className="px-3 py-2 font-medium sticky left-0 bg-[#0c0c11]">Tag</th>
                      {eventNames.map((n) => <th key={n} className="px-3 py-2 font-medium text-right whitespace-nowrap">{EVENT_LABELS[n] ?? n}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day} className="border-t border-white/5">
                        <td className="px-3 py-1.5 sticky left-0 bg-[#08080c] text-[#9a93a6]">{day}</td>
                        {eventNames.map((n) => <td key={n} className="px-3 py-1.5 text-right">{cellCount(day, n)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#9a93a6] mb-3">KI-Nutzung — letzte 7 Tage</h2>
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] text-left text-[#9a93a6]">
                      <th className="px-4 py-2.5 font-medium">Provider</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium text-right">Anfragen</th>
                      <th className="px-4 py-2.5 font-medium text-right">Tokens (in/out)</th>
                      <th className="px-4 py-2.5 font-medium text-right">Ø Latenz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.aiUsage7d.map((r, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="px-4 py-2.5 capitalize">{r.provider}</td>
                        <td className="px-4 py-2.5">{r.ok ? "✓ ok" : "✗ Fehler"}</td>
                        <td className="px-4 py-2.5 text-right">{r.n}</td>
                        <td className="px-4 py-2.5 text-right text-[#9a93a6]">{r.input_tokens ?? "–"} / {r.output_tokens ?? "–"}</td>
                        <td className="px-4 py-2.5 text-right text-[#9a93a6]">{r.avg_latency_ms ? `${r.avg_latency_ms} ms` : "–"}</td>
                      </tr>
                    ))}
                    {data.aiUsage7d.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-3 text-[#9a93a6]">Keine Daten in den letzten 7 Tagen.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="text-[11px] text-[#6b6577]">Stand: {new Date(data.generatedAt).toLocaleString("de-DE")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
