"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function ExitIntent() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (dismissed || show) return;
      if (e.clientY <= 5) {
        setShow(true);
      }
    },
    [dismissed, show]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem("exitShown");
    if (alreadyShown) return;
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("exitShown", "1");
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={dismiss}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-2xl font-black text-white mb-2">Warte kurz!</p>
        <p className="text-gray-400 mb-6 leading-relaxed">
          BELLA kennt <strong className="text-white">3 Marke</strong>, die deinen Empfehlung trotz
          Allergien durchwinken. Frag in 10 Sekunden.
        </p>
        <Link
          href="/#bella-chat"
          onClick={dismiss}
          className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl mb-3 transition-colors"
        >
          Jetzt Empfehlung für deinen Hund finden →
        </Link>
        <button
          onClick={dismiss}
          className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
        >
          Nein danke
        </button>
      </div>
    </div>
  );
}
