import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "BARF vs. Trockenfutter – Vergleich von BELLA";

export default function Image() {
  return new ImageResponse(
    buildOgImage({
      badge: "VERGLEICH",
      title: "BARF vs. Trockenfutter",
      footer: "Direktvergleich für deinen Hund – von BELLA",
    }),
    { ...size }
  );
}
