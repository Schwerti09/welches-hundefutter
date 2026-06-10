import { ImageResponse } from "next/og";
import { TIP_CATEGORIES, TIP_CATEGORY_BY_SLUG } from "@/data/tips";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "BELLA Hunde-Tipp";

export function generateStaticParams() {
  const params: { category: string; "tip-slug": string }[] = [];
  for (const c of TIP_CATEGORIES) {
    for (const a of c.articles ?? []) {
      params.push({ category: c.slug, "tip-slug": a.slug });
    }
  }
  return params;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ category: string; "tip-slug": string }>;
}) {
  const { category, "tip-slug": tipSlug } = await params;
  const cat = TIP_CATEGORY_BY_SLUG[category];
  const article = cat?.articles?.find((a) => a.slug === tipSlug);

  const accent = cat?.accent ?? "#f0a73c";
  const title = article?.title ?? cat?.headline ?? "Hunde-Tipps";
  const catTitle = cat?.title ?? "BELLA";
  const num = article?.id;

  return new ImageResponse(
    (
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
        {/* Riesige Nummer */}
        {num != null && (
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -120,
              fontSize: 460,
              fontWeight: 900,
              color: accent,
              opacity: 0.1,
              display: "flex",
            }}
          >
            {num}
          </div>
        )}

        {/* Top: Brand + Kategorie */}
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
            {catTitle}
          </span>
        </div>

        {/* Mitte: Titel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
          {num != null && (
            <span style={{ color: accent, fontSize: 30, fontWeight: 800, display: "flex" }}>
              Tipp #{num}
            </span>
          )}
          <span
            style={{
              color: "#f4f1ea",
              fontSize: title.length > 55 ? 60 : 74,
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
          <span style={{ color: "#9a93a6", fontSize: 26, display: "flex" }}>
            KI-Ernährungsberatung aus über 8.000 Hundefutter-Sorten
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
