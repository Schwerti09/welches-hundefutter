"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * Sendet bei jedem Pfadwechsel einen anonymen `pageview` ans First-Party-Beacon
 * (Roadmap 5.2). Kein Cookie, kein PII. Läuft parallel zu GA4.
 */
export default function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track("pageview");
  }, [pathname]);
  return null;
}
