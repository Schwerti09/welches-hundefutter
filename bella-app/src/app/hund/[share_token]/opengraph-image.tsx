import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";
import { getSharedDogProfile, buildCardNumber } from "@/lib/dog-profile";
import { getBreedImage } from "@/lib/breed-image";
import { BREED_BY_SLUG } from "@/data/breeds";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Hunde-Pass von BELLA";

export default async function Image({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params;
  const data = await getSharedDogProfile(share_token);

  if (!data) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080c", color: "#f4f1ea", fontSize: 48 }}>
          BELLA Hundepass
        </div>
      ),
      { ...size }
    );
  }

  const { profile, food } = data;
  const breed = profile.breed_slug ? BREED_BY_SLUG[profile.breed_slug] : undefined;
  const photo = profile.photo_data ?? (profile.breed_slug ? getBreedImage(profile.breed_slug) : null);
  const pricePerKg = food?.price_per_kg ? parseFloat(food.price_per_kg) : null;
  const monthlyEuro = profile.est_daily_grams && pricePerKg
    ? Math.round((profile.est_daily_grams / 1000) * 30 * pricePerKg)
    : null;
  const cardNumber = buildCardNumber(profile.id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "56px",
          background: "linear-gradient(135deg, #f0a73c, #ff8a4c, #a855f7)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
            borderRadius: 32,
            background: "linear-gradient(160deg, #1a1410, #15110f)",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, borderRadius: 999, background: "#f0a73c", opacity: 0.18, filter: "blur(10px)", display: "flex" }} />

          {/* Kopfzeile */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #f0a73c, #ff8a4c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#08080c", fontSize: 28, fontWeight: 900 }}>B</div>
              <span style={{ color: "#9a93a6", fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>BELLA Hundepass</span>
            </div>
            <span style={{ color: "#f0a73c", fontSize: 20, fontFamily: "monospace", letterSpacing: 1 }}>{cardNumber}</span>
          </div>

          {/* Mitte: Foto + Stammdaten */}
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: 28,
                background: photo ? undefined : "linear-gradient(135deg, #f0a73c, #ff8a4c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
                fontSize: 90,
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={profile.name} width={220} height={220} style={{ objectFit: "cover" }} />
              ) : (
                "🐕"
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ color: "#f4f1ea", fontSize: 64, fontWeight: 900, display: "flex" }}>
                {profile.name}{profile.gender ? ` ${profile.gender === "m" ? "♂" : "♀"}` : ""}
              </span>
              {breed?.name && (
                <span style={{ color: "#ffcd8a", fontSize: 30, fontWeight: 700, display: "flex" }}>{breed.name}</span>
              )}
              <span style={{ color: "#9a93a6", fontSize: 24, display: "flex" }}>
                {profile.birth_or_age ? `${profile.birth_or_age} · ` : ""}{profile.weight_kg ? `${profile.weight_kg} kg` : ""}
              </span>
            </div>
          </div>

          {/* Unten: Kosten + Claim */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {monthlyEuro ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#9a93a6", fontSize: 18, textTransform: "uppercase", letterSpacing: 2 }}>Futter · Monat</span>
                <span style={{ color: "#f0a73c", fontSize: 48, fontWeight: 900 }}>~{monthlyEuro} €</span>
              </div>
            ) : (
              <span style={{ color: "#9a93a6", fontSize: 26 }}>Futter-Steckbrief von BELLA</span>
            )}
            <span style={{ color: "#9a93a6", fontSize: 22 }}>welches-hundefutter.today</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
