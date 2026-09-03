"use client";

import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

/** Core-Web-Vitals-RUM: schickt echte Messwerte an /api/vitals (Netlify-Log). */
export default function WebVitals() {
  const pathname = usePathname();

  const report: ReportWebVitalsCallback = (metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      page: pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/vitals", body);
    } else {
      fetch("/api/vitals", { body, method: "POST", keepalive: true });
    }
  };

  useReportWebVitals(report);

  return null;
}
