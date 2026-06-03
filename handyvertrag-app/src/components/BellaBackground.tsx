"use client";

import { useEffect, useRef } from "react";

export type Theme =
  | "idle" | "gaming" | "camera" | "budget" | "premium" | "data" | "apple" | "samsung" | "speed";

interface Props {
  theme: Theme;
}

interface Palette {
  bg: [string, string];   // radial bg stops
  colors: string[];        // particle colors
  mode: "aurora" | "grid" | "bokeh" | "fall" | "liquid" | "stream" | "orbit" | "warp";
}

const PALETTES: Record<Theme, Palette> = {
  idle:    { bg: ["#161a3d", "#070815"], colors: ["#818cf8", "#c084fc", "#22d3ee", "#a78bfa"], mode: "aurora" },
  gaming:  { bg: ["#1a0726", "#0a0210"], colors: ["#ec4899", "#a855f7", "#22d3ee", "#f472b6"], mode: "grid" },
  camera:  { bg: ["#1c1606", "#0c0a04"], colors: ["#fcd34d", "#fbbf24", "#fffbeb", "#fde68a"], mode: "bokeh" },
  budget:  { bg: ["#06180f", "#04100a"], colors: ["#34d399", "#fbbf24", "#6ee7b7", "#fcd34d"], mode: "fall" },
  premium: { bg: ["#1a1405", "#0a0803"], colors: ["#fcd34d", "#f59e0b", "#fffbeb", "#d4af37"], mode: "liquid" },
  data:    { bg: ["#04141f", "#030a12"], colors: ["#22d3ee", "#38bdf8", "#67e8f9", "#0ea5e9"], mode: "stream" },
  apple:   { bg: ["#14151a", "#070809"], colors: ["#e5e7eb", "#f9fafb", "#9ca3af", "#d1d5db"], mode: "orbit" },
  samsung: { bg: ["#04122a", "#020814"], colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb"], mode: "liquid" },
  speed:   { bg: ["#0a1020", "#04060f"], colors: ["#93c5fd", "#ffffff", "#60a5fa", "#bae6fd"], mode: "warp" },
};

interface P {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; maxLife: number; ci: number; seed: number;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbStr(c: [number, number, number], a: number) { return `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`; }

export default function BellaBackground({ theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<Theme>(theme);
  const progRef = useRef(1); // transition progress 0..1
  const fromRef = useRef<Theme>(theme);

  useEffect(() => {
    if (themeRef.current !== theme) {
      fromRef.current = themeRef.current;
      themeRef.current = theme;
      progRef.current = 0;
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COUNT = reduced ? 0 : (window.innerWidth < 640 ? 70 : 140);
    const particles: P[] = [];

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      canvas!.style.width = W + "px"; canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(reset: boolean): P {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5),
        vy: (Math.random() - 0.5),
        size: 1 + Math.random() * 3,
        life: reset ? Math.random() : 0,
        maxLife: 4 + Math.random() * 6,
        ci: Math.floor(Math.random() * 4),
        seed: Math.random() * 1000,
      };
    }
    for (let i = 0; i < COUNT; i++) particles.push(spawn(true));

    let raf = 0;
    let t = 0;
    let running = true;
    const onVis = () => { running = !document.hidden; if (running) loop(); };
    document.addEventListener("visibilitychange", onVis);

    function curPalettes() {
      const to = PALETTES[themeRef.current];
      const from = PALETTES[fromRef.current];
      const p = progRef.current;
      return { from, to, p };
    }

    function drawBg() {
      const { from, to, p } = curPalettes();
      const c0a = hexToRgb(from.bg[0]), c0b = hexToRgb(to.bg[0]);
      const c1a = hexToRgb(from.bg[1]), c1b = hexToRgb(to.bg[1]);
      const top: [number, number, number] = [lerp(c0a[0], c0b[0], p), lerp(c0a[1], c0b[1], p), lerp(c0a[2], c0b[2], p)];
      const bot: [number, number, number] = [lerp(c1a[0], c1b[0], p), lerp(c1a[1], c1b[1], p), lerp(c1a[2], c1b[2], p)];
      const g = ctx!.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.5, Math.max(W, H) * 0.8);
      g.addColorStop(0, rgbStr(top, 1));
      g.addColorStop(1, rgbStr(bot, 1));
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
    }

    function colorFor(pal: Palette, p: P, alpha: number) {
      return rgbStr(hexToRgb(pal.colors[p.ci % pal.colors.length]), alpha);
    }

    function update(p: P, mode: Palette["mode"], dt: number) {
      p.life += dt;
      switch (mode) {
        case "aurora":
          p.x += Math.sin(t * 0.3 + p.seed) * 0.4;
          p.y += Math.cos(t * 0.2 + p.seed) * 0.3 - 0.1;
          break;
        case "grid":
          p.y += 2 + p.size * 0.6;            // race downward
          p.x += Math.sin(t + p.seed) * 0.3;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
          break;
        case "bokeh":
          p.x += p.vx * 0.2; p.y += p.vy * 0.2 - 0.05;
          break;
        case "fall":
          p.y += 1.2 + p.size * 0.5;          // coins fall
          p.x += Math.sin(t * 2 + p.seed) * 0.5;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
          break;
        case "liquid":
          p.x += Math.sin(t * 0.5 + p.seed) * 0.6;
          p.y += Math.cos(t * 0.4 + p.seed * 0.5) * 0.5;
          break;
        case "stream":
          p.y += 3 + p.size;                  // data rain
          if (p.y > H) { p.y = -20; p.x = Math.random() * W; }
          break;
        case "orbit": {
          const cx = W / 2, cy = H * 0.45;
          const ang = t * 0.2 + p.seed;
          const r = 80 + (p.seed % 300);
          p.x = cx + Math.cos(ang) * r;
          p.y = cy + Math.sin(ang) * r * 0.6;
          break;
        }
        case "warp": {
          const cx = W / 2, cy = H / 2;
          const dx = p.x - cx, dy = p.y - cy;
          p.x += dx * 0.04; p.y += dy * 0.04;
          if (Math.abs(dx) > W / 2 || Math.abs(dy) > H / 2) {
            p.x = cx + (Math.random() - 0.5) * 40;
            p.y = cy + (Math.random() - 0.5) * 40;
          }
          break;
        }
      }
      // wrap
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20 && mode !== "grid" && mode !== "fall" && mode !== "stream") p.y = H + 20;
      if (p.y > H + 20 && mode === "aurora") p.y = -20;
    }

    function draw(p: P, pal: Palette, mode: Palette["mode"]) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + p.seed);
      if (mode === "bokeh") {
        const a = 0.06 + pulse * 0.12;
        const r = p.size * 6 + pulse * 8;
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, colorFor(pal, p, a));
        g.addColorStop(1, colorFor(pal, p, 0));
        ctx!.fillStyle = g;
        ctx!.beginPath(); ctx!.arc(p.x, p.y, r, 0, Math.PI * 2); ctx!.fill();
        return;
      }
      if (mode === "grid" || mode === "stream") {
        ctx!.strokeStyle = colorFor(pal, p, 0.5);
        ctx!.lineWidth = p.size * 0.8;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(p.x, p.y + 8 + p.size * 4);
        ctx!.stroke();
        return;
      }
      if (mode === "warp") {
        const cx = W / 2, cy = H / 2;
        ctx!.strokeStyle = colorFor(pal, p, 0.6);
        ctx!.lineWidth = p.size * 0.6;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(p.x - (p.x - cx) * 0.08, p.y - (p.y - cy) * 0.08);
        ctx!.stroke();
        return;
      }
      // default glow dot with soft halo
      const halo = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      halo.addColorStop(0, colorFor(pal, p, 0.5 + pulse * 0.4));
      halo.addColorStop(1, colorFor(pal, p, 0));
      ctx!.fillStyle = halo;
      ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = colorFor(pal, p, 0.7 + pulse * 0.3);
      ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2); ctx!.fill();
    }

    let last = performance.now();
    function loop() {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      if (progRef.current < 1) progRef.current = Math.min(1, progRef.current + dt * 0.6);

      drawBg();
      if (COUNT === 0) return;

      const { to, p } = curPalettes();
      const mode = to.mode;
      ctx!.globalCompositeOperation = "lighter";
      for (const part of particles) {
        update(part, mode, dt);
        draw(part, to, mode);
      }
      ctx!.globalCompositeOperation = "source-over";

      // Camera lens-flare sweep
      if (themeRef.current === "camera") {
        const sx = ((t * 0.15) % 1.4 - 0.2) * W;
        const fg = ctx!.createLinearGradient(sx - 120, 0, sx + 120, H);
        fg.addColorStop(0, "rgba(252,211,77,0)");
        fg.addColorStop(0.5, `rgba(255,251,235,${0.06 + 0.04 * Math.sin(t)})`);
        fg.addColorStop(1, "rgba(252,211,77,0)");
        ctx!.fillStyle = fg; ctx!.fillRect(0, 0, W, H);
      }
      // Gaming scanlines
      if (themeRef.current === "gaming") {
        ctx!.fillStyle = "rgba(0,0,0,0.06)";
        for (let y = 0; y < H; y += 4) ctx!.fillRect(0, y, W, 1);
      }
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
