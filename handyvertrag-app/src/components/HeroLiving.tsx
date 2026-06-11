"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Bella from "@/components/Bella";

type Breed = { name: string; slug: string; img: string };
type TopFood = { brand: string; name: string; pricePerKg: number | null; affiliateUrl: string } | null;

const PLACEHOLDERS = [
  "Labrador, 9 Jahre, steife Gelenke…",
  "Welpe mit empfindlichem Magen…",
  "Allergie gegen Huhn — was jetzt?",
  "Französische Bulldogge, was ist das beste?",
  "Senior, soll ein bisschen abnehmen…",
  "Border Collie, super aktiv…",
];

const QUICK: { label: string; msg: string }[] = [
  { label: "🐶 Welpe", msg: "Welches Futter ist das richtige für meinen Welpen?" },
  { label: "🦴 Allergie", msg: "Mein Hund hat Allergien und einen empfindlichen Magen — welches Futter passt?" },
  { label: "🥩 BARF", msg: "Ich interessiere mich für BARF bzw. Frischfutter für meinen Hund." },
  { label: "👴 Senior", msg: "Welches Futter ist gut für meinen älteren Hund (Senior)?" },
  { label: "💰 Günstig", msg: "Ich suche ein gutes, aber günstiges Hundefutter." },
];

export default function HeroLiving({ foodCount, topFood, breeds }: { foodCount: number; topFood: TopFood; breeds: Breed[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ph, setPh] = useState("");
  const [count, setCount] = useState(foodCount);

  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ── Cursor-Spotlight: --mx/--my auf den Hero setzen ──
  useEffect(() => {
    const el = heroRef.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  // ── Count-up: 0 → foodCount ──
  useEffect(() => {
    if (reduced || foodCount <= 0) { setCount(foodCount); return; }
    let raf = 0; const t0 = performance.now(); const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * foodCount));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [foodCount, reduced]);

  // ── Typewriter-Placeholder (pausiert bei Fokus/Eingabe) ──
  useEffect(() => {
    if (reduced) { setPh(PLACEHOLDERS[0]); return; }
    if (focused || value) return;
    let i = 0, ci = 0, phase: 0 | 1 | 2 = 1, hold = 0; let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = PLACEHOLDERS[i];
      if (phase === 1) { ci++; if (ci >= full.length) { phase = 0; hold = 16; } }
      else if (phase === 0) { if (--hold <= 0) phase = 2; }
      else { ci--; if (ci <= 0) { phase = 1; i = (i + 1) % PLACEHOLDERS.length; } }
      setPh(full.slice(0, Math.max(0, ci)));
      t = setTimeout(tick, phase === 2 ? 26 : phase === 1 ? 52 : 64);
    };
    t = setTimeout(tick, 450);
    return () => clearTimeout(t);
  }, [focused, value, reduced]);

  // ── Pfoten-/Funken-Canvas (rAF, pausiert offscreen) ──
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current, host = heroRef.current; if (!canvas || !host) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1), raf = 0, running = true;
    const N = window.innerWidth < 640 ? 9 : 16;
    type P = { x: number; y: number; vy: number; s: number; rot: number; vr: number; a: number };
    let parts: P[] = [];
    const resize = () => {
      const r = host.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: N }, () => ({
        x: Math.random() * w, y: Math.random() * h, vy: 0.18 + Math.random() * 0.4,
        s: 10 + Math.random() * 16, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.01, a: 0.05 + Math.random() * 0.14,
      }));
    };
    const paw = (x: number, y: number, s: number, rot: number, a: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = "#f0a73c";
      ctx.beginPath(); ctx.ellipse(0, s * 0.18, s * 0.32, s * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      for (const [dx, dy] of [[-s * 0.34, -s * 0.28], [-s * 0.12, -s * 0.44], [s * 0.12, -s * 0.44], [s * 0.34, -s * 0.28]]) {
        ctx.beginPath(); ctx.ellipse(dx, dy, s * 0.12, s * 0.16, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };
    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy; p.rot += p.vr;
        if (p.y < -30) { p.y = h + 20; p.x = Math.random() * w; }
        paw(p.x, p.y, p.s, p.rot, p.a);
      }
      raf = requestAnimationFrame(loop);
    };
    resize(); loop();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) { raf = requestAnimationFrame(loop); } else cancelAnimationFrame(raf);
    }, { threshold: 0 });
    io.observe(host);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); io.disconnect(); };
  }, [reduced]);

  // ── Absenden → Schnüffel-Scan → an den Advisor übergeben ──
  const launch = useCallback((text: string) => {
    const q = text.trim(); if (!q) return;
    const go = () => {
      window.dispatchEvent(new CustomEvent("bella:ask", { detail: q }));
      document.getElementById("bella-advisor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setScanning(false); setValue("");
    };
    if (reduced) { go(); return; }
    setScanning(true);
    setTimeout(go, 1150);
  }, [reduced]);

  return (
    <section ref={heroRef} className="relative overflow-hidden px-4 sm:px-5 pt-10 pb-14 md:pt-14" style={{ "--mx": "50%", "--my": "26%" } as React.CSSProperties}>
      {/* Lebende Hintergründe */}
      <div className="aurora" aria-hidden>
        <div className="aurora__blob aurora__blob--1" />
        <div className="aurora__blob aurora__blob--2" />
        <div className="aurora__blob aurora__blob--3" />
      </div>
      <div className="spotlight" aria-hidden />
      <canvas ref={canvasRef} className="paw-canvas" aria-hidden />

      <div className="relative z-[2] max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <span className="pill"><span className="w-1.5 h-1.5 rounded-full bg-[var(--honey)] live-dot" />KI-Ernährungsberatung · die erste lebende Hundefutter-Beraterin</span>
        </div>

        {/* BENTO-UNIVERSUM */}
        <div className="grid gap-3.5 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[minmax(0,1fr)]">

          {/* ── Herz-Kachel: lebende BELLA + Gespräch ── */}
          <div className="tile tile__sheen lg:col-span-2 lg:row-span-2 p-6 sm:p-8 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="absolute inset-0 -z-10 blur-2xl rounded-full" style={{ background: "radial-gradient(circle, rgba(240,167,60,.35), transparent 60%)" }} />
                <Bella mood={scanning ? "thinking" : "happy"} size={150} track className="animate-[breathe_5s_ease-in-out_infinite]" />
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Das richtige Futter für deinen Hund —{" "}
                <span className="text-accent">in 60 Sekunden</span>
              </h1>
              <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-md leading-relaxed">
                Erzähl BELLA von deinem Hund. Sie schnüffelt durch{" "}
                <span className="count-shimmer font-bold">{count.toLocaleString("de-DE")}</span> echte Sorten und findet die wirklich passenden.
              </p>
            </div>

            {/* Gesprächs-Einstieg */}
            <form onSubmit={(e) => { e.preventDefault(); launch(value); }} className="mt-6 relative">
              <div className="relative glow-border rounded-2xl">
                <input
                  value={value} onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  aria-label="Erzähl BELLA von deinem Hund"
                  className="w-full bg-black/40 rounded-2xl pl-5 pr-32 py-4 text-[15px] text-white placeholder:text-transparent focus:outline-none"
                  placeholder="Erzähl mir von deinem Hund…"
                />
                {!value && (
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[15px] text-white/35">
                    {ph || "Erzähl mir von deinem Hund…"}{!focused && <span className="caret" />}
                  </div>
                )}
                <button type="submit" disabled={!value.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                  Schnüffeln →
                </button>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center">
                {QUICK.map((q) => (
                  <button key={q.label} type="button" onClick={() => launch(q.msg)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-[rgba(240,167,60,.5)] transition-colors">
                    {q.label}
                  </button>
                ))}
              </div>
            </form>

            {/* Schnüffel-Scan-Overlay */}
            {scanning && (
              <div className="scan" aria-hidden>
                <div className="scan__grid" />
                <div className="scan__line" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--honey)] text-sm font-semibold tracking-wide animate-pulse">🐾 BELLA schnüffelt…</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Live-Zähler ── */}
          <div className="tile p-5 flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl font-black count-shimmer leading-none">{count.toLocaleString("de-DE")}</div>
            <div className="text-white/55 text-sm mt-1.5">echte Sorten im Live-Katalog</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />Preise täglich aktualisiert
            </div>
          </div>

          {/* ── Preis-Radar (Schicht 2) ── */}
          <div className="tile tile__sheen p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--honey)] uppercase tracking-wide">📉 Preis-Radar</div>
            {topFood ? (
              <a href={topFood.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="group block mt-2">
                <div className="text-white font-semibold text-sm truncate">{topFood.brand}</div>
                <div className="text-white/45 text-xs truncate">{topFood.name}</div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-2xl font-black text-white">{topFood.pricePerKg != null ? `${topFood.pricePerKg.toFixed(2)} €` : "—"}<span className="text-xs text-white/40 font-medium">/kg</span></span>
                  <span className="text-[var(--honey)] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">ansehen →</span>
                </div>
              </a>
            ) : <div className="text-white/40 text-sm mt-2">Günstigste Sorten live</div>}
            <div className="mt-3 text-[11px] text-white/35 leading-snug">BELLA wacht über Preise — stell dir einen <span className="text-white/55">Preis-Wecker</span>.</div>
          </div>

          {/* ── Rassen-Galerie (echte Fotos) ── */}
          <div className="tile p-4">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2.5 px-1">🐕 Finde deinen Hund</div>
            <div className="grid grid-cols-4 gap-1.5">
              {breeds.slice(0, 8).map((b) => (
                <Link key={b.slug} href={`/rasse/${b.slug}`} title={b.name}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[rgba(240,167,60,.6)] transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.img} alt={b.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Trust ── */}
          <div className="tile p-5 flex flex-col justify-center gap-2.5">
            {[["⚖️", "Unabhängig & werbefrei beraten"], ["🆓", "Kostenlos · ohne Anmeldung"], ["🐾", "Kuratiert, nicht zugemüllt"]].map(([i, t]) => (
              <div key={t} className="flex items-center gap-2.5 text-sm text-white/70"><span className="text-base">{i}</span>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
