"use client";

import { useState } from "react";

type OType = "tierarzt" | "studienautor" | "blogger";

const TYPE_LABELS: Record<OType, string> = {
  tierarzt: "Tierarzt / Praxis",
  studienautor: "Studienautor:in / Wissenschaft",
  blogger: "Blogger:in / Creator",
};

export default function OutreachAdmin() {
  const [token, setToken] = useState("");
  const [type, setType] = useState<OType>("tierarzt");
  const [recipientName, setRecipientName] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function draft() {
    if (!token) { setStatus("Bitte zuerst den Zugangs-Token eintragen."); return; }
    setBusy(true); setStatus("BELLA schreibt einen Entwurf …");
    try {
      const r = await fetch("/api/outreach/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-outreach-token": token },
        body: JSON.stringify({ type, recipientName, context }),
      });
      const d = await r.json();
      if (!r.ok) { setStatus("Fehler: " + (d.error ?? r.status)); return; }
      setSubject(d.subject ?? "");
      setBodyText(d.body ?? "");
      setStatus("Entwurf erstellt — bitte prüfen und persönlich anpassen, bevor du sendest.");
    } catch (e) {
      setStatus("Fehler: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(`Betreff: ${subject}\n\n${bodyText}`);
    setStatus("In die Zwischenablage kopiert.");
  }

  async function send() {
    if (!email || !subject || !bodyText) { setStatus("E-Mail, Betreff und Text sind nötig."); return; }
    if (!window.confirm(`Wirklich an ${email} senden?\n\nNur nach echter Sichtprüfung — diese Mail geht an eine reale Person.`)) return;
    setBusy(true); setStatus("Sende …");
    try {
      const r = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-outreach-token": token },
        body: JSON.stringify({ to: email, subject, text: bodyText }),
      });
      const d = await r.json();
      setStatus(r.ok ? "✓ Gesendet." : "Fehler: " + (d.error ?? r.status));
    } catch (e) {
      setStatus("Fehler: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[var(--honey,#f0a73c)] text-[#f4f1ea]";

  return (
    <div style={{ minHeight: "100vh", background: "#08080c", color: "#f4f1ea" }}>
      <div className="max-w-2xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Outreach-Generator</h1>
        <p className="text-sm text-[#9a93a6] mb-6 leading-relaxed">
          Schreibt dir individuelle Erstkontakt-Mails. <strong>Du prüfst und sendest selbst, einzeln.</strong>{" "}
          Kein Massenversand — das schützt Domain-Reputation und ist DSGVO-konform.
        </p>

        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Zugangs-Token (OUTREACH_TOKEN)" className={field + " mb-5"} />

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <select value={type} onChange={(e) => setType(e.target.value as OType)} className={field}>
            {(Object.keys(TYPE_LABELS) as OType[]).map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Name / Anrede (z. B. Dr. Müller)" className={field} />
        </div>
        <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="Echter Aufhänger: worüber schreibt die Person? Spezialisierung, ein Artikel, Praxis-Schwerpunkt … (je konkreter, desto besser die Mail)" className={field + " mb-3"} />

        <button onClick={draft} disabled={busy} className="rounded-xl px-5 py-2.5 text-sm font-semibold mb-6" style={{ background: "linear-gradient(135deg,#f0a73c,#ff8a4c)", color: "#000", opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : "Entwurf generieren"}
        </button>

        {(subject || bodyText) && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Betreff" className={field} />
            <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={12} className={field + " leading-relaxed"} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Empfänger-E-Mail (genau eine)" className={field} />
            <div className="flex flex-wrap gap-2">
              <button onClick={copy} className="rounded-xl px-4 py-2 text-sm font-semibold border border-white/15 text-[#f0a73c]">In Zwischenablage</button>
              <button onClick={send} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "#f0a73c", color: "#000", opacity: busy ? 0.6 : 1 }}>Per Resend senden (nach Prüfung)</button>
            </div>
          </div>
        )}

        {status && <p className="mt-4 text-sm text-[#9a93a6]">{status}</p>}
      </div>
    </div>
  );
}
