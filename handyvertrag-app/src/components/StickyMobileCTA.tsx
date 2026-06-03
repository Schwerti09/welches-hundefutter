"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-[#05060f] to-transparent">
      <Link
        href="/#hansi-chat"
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/50 transition-colors text-sm"
      >
        <span>Jetzt Vertrag trotz Schufa finden</span>
        <span>→</span>
      </Link>
    </div>
  );
}
