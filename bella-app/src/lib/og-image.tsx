export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Statische BELLA-Marke fürs OG-Bild (Roadmap 3.2 / 3.3).
 * Bewusst NICHT `BellaMascot` — Satori (`next/og`) rendert kein `<style>`,
 * keine Animation, keine `className`. Nur pure SVG-Primitive.
 */
function bellaMark(px: number) {
  return (
    <svg width={px} height={px} viewBox="0 0 96 96">
      <path d="M29 30C19 27 13 40 16 52c3 11 13 12 18 5 4-6 3-22-5-27Z" fill="#e07f2e" />
      <path d="M67 30C77 27 83 40 80 52c-3 11-13 12-18 5-4-6-3-22 5-27Z" fill="#e07f2e" />
      <path d="M48 18c16 0 27 12 27 29 0 18-12 31-27 31S21 65 21 47c0-17 11-29 27-29Z" fill="#f0a73c" />
      <ellipse cx="48" cy="60" rx="16" ry="13" fill="#fbe4c2" />
      <circle cx="39" cy="45" r="3.6" fill="#2a1c0d" />
      <circle cx="57" cy="45" r="3.6" fill="#2a1c0d" />
      <path d="M43 57h10c2 0 3 2 2 4l-5 5c-1 1-3 1-4 0l-5-5c-1-2 0-4 2-4Z" fill="#2a1c0d" />
    </svg>
  );
}

export function buildOgImage({
  badge,
  label,
  title,
  footer,
  accent = "#f0a73c",
  imageUrl,
}: {
  badge: string;
  label?: string;
  title: string;
  footer: string;
  accent?: string;
  /** Optionales Foto (absolute URL) — rechte Bild-Spalte, z. B. Rassefoto. */
  imageUrl?: string;
}) {
  const content = (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        position: "relative",
      }}
    >
      {/* Akzent-Glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -120,
          width: 640,
          height: 640,
          borderRadius: 999,
          background: accent,
          opacity: 0.22,
          filter: "blur(40px)",
          display: "flex",
        }}
      />

      {/* Top: Marke + Kategorie-Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bellaMark(64)}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#f4f1ea", fontSize: 30, fontWeight: 800 }}>BELLA</span>
            <span style={{ color: "#9a93a6", fontSize: 20 }}>welches-hundefutter.today</span>
          </div>
        </div>
        <span
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            color: accent,
            border: `2px solid ${accent}`,
            borderRadius: 999,
            padding: "10px 26px",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {badge}
        </span>
      </div>

      {/* Mitte: Titel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: imageUrl ? 620 : 1000 }}>
        {label && (
          <span style={{ color: accent, fontSize: 30, fontWeight: 800, display: "flex" }}>{label}</span>
        )}
        <span
          style={{
            color: "#f4f1ea",
            fontSize: title.length > 34 ? 46 : title.length > 20 ? 60 : 82,
            fontWeight: 900,
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          {title}
        </span>
      </div>

      {/* Unten: Claim */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 6, borderRadius: 999, background: accent, display: "flex" }} />
        <span style={{ color: "#9a93a6", fontSize: 26, display: "flex" }}>{footer}</span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: "#08080c",
      }}
    >
      {content}
      {imageUrl && (
        <div style={{ display: "flex", width: 430, height: "100%", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" width={430} height={630} style={{ objectFit: "cover" }} />
          {/* weicher Übergang zur dunklen Textspalte */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background: "linear-gradient(90deg, #08080c 0%, rgba(8,8,12,0) 38%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
