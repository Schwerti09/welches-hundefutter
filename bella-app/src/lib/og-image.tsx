export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function buildOgImage({
  badge,
  label,
  title,
  footer,
  accent = "#f0a73c",
}: {
  badge: string;
  label?: string;
  title: string;
  footer: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        background: "#08080c",
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

      {/* Top: Brand + Kategorie-Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #f0a73c, #ff8a4c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#08080c",
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            B
          </div>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
        {label && (
          <span style={{ color: accent, fontSize: 30, fontWeight: 800, display: "flex" }}>
            {label}
          </span>
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
}
