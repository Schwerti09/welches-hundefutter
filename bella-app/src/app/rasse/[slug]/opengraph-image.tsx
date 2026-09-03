import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";
import { BREED_BY_SLUG } from "@/data/breeds";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Rasseporträt & Fütterungs-Guide von BELLA";

const SIZE_LABELS: Record<string, string> = {
  klein: "Kleine Rasse",
  mittel: "Mittelgroße Rasse",
  gross: "Große Rasse",
  sehrgross: "Sehr große Rasse",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const breed = BREED_BY_SLUG[slug];

  return new ImageResponse(
    buildOgImage({
      badge: "RASSEPORTRÄT",
      label: breed ? SIZE_LABELS[breed.size] : undefined,
      title: breed?.name ?? "Hunderasse",
      footer: "Fütterung, Gesundheit & Portionsrechner – von BELLA",
    }),
    { ...size }
  );
}
