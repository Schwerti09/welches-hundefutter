import breedGallery from "@/data/breed-gallery.json";

const GALLERY_BY_SLUG: Record<string, string> = Object.fromEntries(
  (breedGallery as { slug: string; img: string }[]).map((b) => [b.slug, b.img]),
);

/** Echtes Rassefoto als Fallback, wenn der Halter kein eigenes Foto hochgeladen hat. */
export function getBreedImage(breedSlug: string | null | undefined): string | null {
  if (!breedSlug) return null;
  return GALLERY_BY_SLUG[breedSlug] ?? null;
}
