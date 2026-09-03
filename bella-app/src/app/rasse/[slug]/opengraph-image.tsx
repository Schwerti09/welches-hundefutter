import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";
import { BREED_BY_SLUG } from "@/data/breeds";
import gallery from "@/data/breed-gallery.json";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Rasseporträt & Fütterungs-Guide von BELLA";

// On-demand statt Prebuild: sonst würden 186 OG-Bilder (inkl. Foto-Fetch) bei
// jedem Build gerendert. Leeres generateStaticParams → beim ersten Aufruf
// erzeugt und dann für `revalidate` Sekunden gecacht (Roadmap 3.3).
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams(): { slug: string }[] {
  return [];
}

const SITE_URL = process.env.SITE_URL || "https://welches-hundefutter.today";

const PHOTO: Record<string, string> = Object.fromEntries(
  (gallery as { slug: string; img: string; localImg?: string }[]).map((g) => [g.slug, g.localImg ?? g.img]),
);

const SIZE_LABELS: Record<string, string> = {
  klein: "Kleine Rasse",
  mittel: "Mittelgroße Rasse",
  gross: "Große Rasse",
  sehrgross: "Sehr große Rasse",
};

function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const breed = BREED_BY_SLUG[slug];

  return new ImageResponse(
    buildOgImage({
      badge: "RASSEPORTRÄT",
      label: breed ? SIZE_LABELS[breed.size] : undefined,
      title: breed?.name ?? "Hunderasse",
      footer: "Futter, Portionen & Gesundheit",
      imageUrl: absolute(PHOTO[slug]),
    }),
    { ...size },
  );
}
