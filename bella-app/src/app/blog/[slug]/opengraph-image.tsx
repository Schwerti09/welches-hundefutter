import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from "@/lib/og-image";
import { getArticleBySlug } from "@/data/blogArticles";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Ratgeber von BELLA — welches-hundefutter.today";

// On-demand statt Prebuild (analog rasse/[slug]): leeres generateStaticParams,
// beim ersten Aufruf gerendert und dann für `revalidate` Sekunden gecacht.
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams(): { slug: string }[] {
  return [];
}

const SITE_URL = process.env.SITE_URL || "https://welches-hundefutter.today";

function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "Hundefutter-Ratgeber";
  return new ImageResponse(
    buildOgImage({
      badge: "RATGEBER",
      title: title.length > 72 ? title.slice(0, 71).trimEnd() + "…" : title,
      footer: "welches-hundefutter.today",
      imageUrl: absolute(article?.imageUrl),
    }),
    { ...size },
  );
}
