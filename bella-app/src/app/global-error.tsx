"use client";

import { useEffect } from "react";

// Greift nur, wenn das Root-Layout selbst wirft (Roadmap 6.1). Muss eigenes
// <html>/<body> rendern, da es das Layout ersetzt. Bewusst minimal + ohne
// Abhängigkeiten (Design-Tokens sind hier evtl. nicht geladen).
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global-error]", error?.digest ?? "", error?.message);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#08080c",
          color: "#f4f1ea",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: 44 }} aria-hidden>🐕</div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>Da hat sich BELLA verschluckt</h1>
        <p style={{ color: "#9a93a6", maxWidth: 420 }}>
          Ein technischer Fehler. Lade die Seite neu — oder versuch es später nochmal.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.7rem 1.3rem",
            borderRadius: "0.8rem",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            color: "#1a1206",
            background: "linear-gradient(180deg, #ffc164, #f0a73c)",
          }}
        >
          Neu laden
        </button>
      </body>
    </html>
  );
}
