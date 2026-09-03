import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fütterung nach Lebensphase – BELLA";

const PHASE_TITLES: Record<string, string> = {
  welpen: "Welpen",
  junghund: "Junghund",
  adult: "Erwachsener Hund",
  senior: "Senior",
};

export function generateStaticParams() {
  return Object.keys(PHASE_TITLES).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return new ImageResponse(
    buildOgImage({
      badge: "LEBENSPHASE",
      title: PHASE_TITLES[slug] ?? "Hundefutter",
      footer: "Fütterung nach Lebensphase – von BELLA",
    }),
    { ...size }
  );
}
