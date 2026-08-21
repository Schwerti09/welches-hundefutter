import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";
import { FUTTERTYP_BY_SLUG } from "@/data/futtertypen";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Futtertyp-Guide von BELLA";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FUTTERTYP_BY_SLUG[slug];

  return new ImageResponse(
    buildOgImage({
      badge: "FUTTERTYP",
      title: f?.name ?? "Hundefutter",
      footer: "Futtertyp-Guide von BELLA",
    }),
    { ...size }
  );
}
