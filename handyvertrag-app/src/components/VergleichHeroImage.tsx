interface Props {
  slug: string;
  alt: string;
}

export default function VergleichHeroImage({ slug, alt }: Props) {
  return (
    <div className="max-w-5xl mx-auto w-full px-5 pt-4">
      <div className="rounded-2xl overflow-hidden h-48 sm:h-64 relative">
        <img
          src={`/images/content/vergleich/${slug}.jpg`}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c]/60 via-transparent to-transparent" />
      </div>
    </div>
  );
}
