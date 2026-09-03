"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import BellaMascot from "@/components/bella/BellaMascot";

const STORAGE_KEY = "dogPassPopupShown";
const SHOW_DELAY_MS = 1300;

function randomCardSuffix(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

export default function DogPassPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [cardSuffix, setCardSuffix] = useState("••••-••••");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (pathname?.startsWith("/hund/")) return;
    const t = setTimeout(() => {
      setCardSuffix(randomCardSuffix());
      setShow(true);
    }, SHOW_DELAY_MS);
    return () => clearTimeout(t);
    // nur beim ersten Mount auswerten — die Sperre gilt für die ganze Session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (show) setTimeout(() => inputRef.current?.focus(), 150);
  }, [show]);

  function close() {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  function createPass() {
    const trimmed = name.trim().slice(0, 24);
    sessionStorage.setItem(STORAGE_KEY, "1");
    const target = trimmed
      ? `/?ctx=profil&name=${encodeURIComponent(trimmed)}#bella-advisor`
      : `/#bella-advisor`;
    window.location.href = target;
  }

  function declineToBella() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    window.location.href = "/#bella-advisor";
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Schließen"
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center text-sm backdrop-blur-sm border border-white/10"
        >
          ✕
        </button>

        <p className="text-center text-white font-extrabold text-lg mb-1">
          Bevor wir starten — <span className="text-amber-400">wie heißt dein Hund?</span> 🐾
        </p>
        <p className="text-center text-white/50 text-xs mb-4 leading-relaxed px-2">
          Mit Namen gibt dir BELLA noch genauere Empfehlungen — und du bekommst direkt seinen eigenen Hundepass.
        </p>

        {/* Live-Pass — füllt sich beim Tippen vor den Augen des Users */}
        <div className="rounded-[26px] p-[2px] bg-[linear-gradient(135deg,#f0a73c,#ff8a4c,#a855f7,#f0a73c)] shadow-[0_30px_70px_-30px_rgba(240,167,60,0.5)]">
          <div className="rounded-[24px] bg-gradient-to-br from-[#1a1410] via-[#15110f] to-[#1a1410] relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.12),transparent_55%)]" />

            <div className="relative flex items-center justify-between mb-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">BELLA Hundepass</span>
              <span className={`text-[10px] font-mono tracking-wider transition-colors ${name ? "text-orange-300/80" : "text-white/20"}`}>
                BF-{cardSuffix}
              </span>
            </div>

            <div className="relative flex flex-col items-center gap-3">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  name ? "bg-gradient-to-br from-orange-400 to-amber-500 ring-2 ring-orange-400/40 shadow-lg shadow-orange-500/25" : "bg-white/5 ring-1 ring-white/10"
                }`}
              >
                <BellaMascot pose={name ? "found" : "idle"} size={44} />
              </div>

              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createPass()}
                placeholder="Bello, Luna, Rex …"
                maxLength={24}
                className="w-full bg-transparent text-center text-2xl font-black text-white placeholder:text-white/20 placeholder:font-bold border-b-2 border-dashed border-white/15 focus:border-orange-400/60 focus:outline-none py-1 transition-colors"
              />

              <p className={`text-[10px] uppercase tracking-wider transition-opacity ${name ? "text-emerald-400 opacity-100" : "text-white/20 opacity-0"}`}>
                ✓ wird sofort ausgestellt
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={createPass}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm py-3.5 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
        >
          {name.trim() ? `Pass für ${name.trim()} erstellen →` : "Pass erstellen & Empfehlung holen →"}
        </button>
        <button
          onClick={declineToBella}
          className="mt-3 w-full text-center text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          Nein danke, direkt zu BELLA →
        </button>
      </div>
    </div>
  );
}
