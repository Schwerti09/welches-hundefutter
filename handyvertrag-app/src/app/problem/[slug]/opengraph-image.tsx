import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";
import { PROBLEMS, PROBLEM_BY_SLUG } from "@/data/problems";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Hundefutter-Empfehlung von BELLA";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PROBLEM_BY_SLUG[slug];

  return new ImageResponse(
    buildOgImage({
      badge: "PROBLEM-GUIDE",
      title: p?.name ?? "Hundefutter",
      footer: "BELLA findet das passende Futter für deinen Hund",
    }),
    { ...size }
  );
}
