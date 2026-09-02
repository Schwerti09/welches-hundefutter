"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const DISMISS_KEY = "bella-sticky-cta-dismissed";

/**
 * Mobile-CTA am unteren Rand. Bewusst zurückhaltend:
 * - Marken-Farbe statt Signal-Blau
 * - erscheint erst nach echtem Scrollen (600px)
 * - blendet sich in Scrollrichtung nach unten aus (stört nicht beim Lesen),
 *   kommt beim Hochscrollen zurück
 * - schließbar; Entscheidung gilt für die Session
 * - verschwindet im Fußbereich der Seite
 */
function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  // Lazy-Init statt setState-im-Effect: läuft serverseitig als `false`, im Browser
  // mit echtem Wert. Da initial ohnehin nichts gerendert wird (visible=false),
  // gibt es keinen Hydration-Mismatch.
  const [dismissed, setDismissed] = useState<boolean>(readDismissed);

  useEffect(() => {
    if (dismissed) return;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = y + window.innerHeight >= doc.scrollHeight - 720;
      const scrollingDown = y > lastY + 4;
      const scrollingUp = y < lastY - 4;

      if (y < 600 || nearBottom) {
        setVisible(false);
      } else if (scrollingDown) {
        setVisible(false);
      } else if (scrollingUp) {
        setVisible(true);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 md:hidden px-3 pb-3 pt-2 bg-gradient-to-t from-[#08080c] via-[#08080c]/90 to-transparent transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-[130%]"
      }`}
    >
      <div className="flex items-stretch gap-2">
        <Link
          href="/#bella-advisor"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-orange-900/30 active:brightness-95"
        >
          <span>Futter für deinen Hund finden</span>
          <span aria-hidden>→</span>
        </Link>
        <button
          type="button"
          aria-label="Hinweis ausblenden"
          onClick={() => {
            try {
              sessionStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* ignore */
            }
            setDismissed(true);
          }}
          className="flex w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-lg text-white/60 active:bg-white/10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
