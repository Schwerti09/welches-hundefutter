"use client";

import { useEffect, useRef } from "react";

interface Props {
  size?: number;
}

/**
 * Premium intelligence scanner. Calm, alive, not flashy.
 * A slow radar sweep reveals data nodes; connections form between matches.
 */
export default function BellaRadar({ size = 360 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 8;

    // Data nodes scattered in the field (polar). A few are "matches".
    interface Node { ang: number; r: number; born: number; match: boolean; }
    const nodes: Node[] = [];
    const NODE_COUNT = reduced ? 10 : 26;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        ang: Math.random() * Math.PI * 2,
        r: 30 + Math.random() * (R - 40),
        born: Math.random(),
        match: Math.random() < 0.18,
      });
    }

    let sweep = -Math.PI / 2;
    let raf = 0;
    let running = true;
    let t = 0;

    const onVis = () => { running = !document.hidden; if (running) loop(); };
    document.addEventListener("visibilitychange", onVis);

    function polar(ang: number, r: number): [number, number] {
      return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);

      // Concentric rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(129,140,248,${0.06 + i * 0.012})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Cross hairs
      ctx.strokeStyle = "rgba(129,140,248,0.05)";
      ctx.beginPath();
      ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // Sweep gradient wedge
      const wedge = 0.55;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, sweep - wedge, sweep);
      ctx.closePath();
      const lg = ctx.createLinearGradient(cx, cy, ...polar(sweep, R));
      lg.addColorStop(0, "rgba(99,102,241,0)");
      lg.addColorStop(1, "rgba(139,92,246,0.16)");
      ctx.fillStyle = lg;
      ctx.fill();
      ctx.restore();

      // Leading sweep line
      const [lx, ly] = polar(sweep, R);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(lx, ly);
      ctx.strokeStyle = "rgba(167,139,250,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Nodes: brighten as the sweep passes them
      const matchPts: [number, number][] = [];
      for (const n of nodes) {
        const [nx, ny] = polar(n.ang, n.r);
        let diff = sweep - n.ang;
        while (diff < 0) diff += Math.PI * 2;
        const recent = diff < 0.9; // recently swept
        const glow = recent ? 1 - diff / 0.9 : 0.12;
        const base = n.match ? "52,211,153" : "129,140,248";
        const radius = (n.match ? 3 : 2) + glow * 2.5;
        // halo
        const h = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius * 4);
        h.addColorStop(0, `rgba(${base},${0.5 * glow + 0.05})`);
        h.addColorStop(1, `rgba(${base},0)`);
        ctx.fillStyle = h;
        ctx.beginPath(); ctx.arc(nx, ny, radius * 4, 0, Math.PI * 2); ctx.fill();
        // core
        ctx.fillStyle = `rgba(${base},${0.4 + glow * 0.6})`;
        ctx.beginPath(); ctx.arc(nx, ny, radius, 0, Math.PI * 2); ctx.fill();
        if (n.match && recent) matchPts.push([nx, ny]);
      }

      // Connections between recently-found matches → "intelligence forming"
      ctx.strokeStyle = "rgba(52,211,153,0.22)";
      ctx.lineWidth = 1;
      for (let i = 0; i < matchPts.length; i++) {
        for (let j = i + 1; j < matchPts.length; j++) {
          ctx.beginPath();
          ctx.moveTo(...matchPts[i]);
          ctx.lineTo(...matchPts[j]);
          ctx.stroke();
        }
      }

      // Center core
      const pulse = 0.5 + 0.5 * Math.sin(t * 2);
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26 + pulse * 6);
      cg.addColorStop(0, "rgba(167,139,250,0.55)");
      cg.addColorStop(0.5, "rgba(99,102,241,0.18)");
      cg.addColorStop(1, "rgba(99,102,241,0)");
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx, cy, 26 + pulse * 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI * 2); ctx.fill();
    }

    let last = performance.now();
    function loop() {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      if (!reduced) sweep += dt * 0.9;        // ~7s per full revolution
      if (sweep > Math.PI * 1.5) sweep -= Math.PI * 2;
      draw();
    }
    draw();
    if (!reduced) loop();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [size]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} className="block" aria-hidden="true" />
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="mt-16 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] tracking-[0.2em] text-white/50 font-medium uppercase">Analyse läuft</span>
        </div>
      </div>
    </div>
  );
}
