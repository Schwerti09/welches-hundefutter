import Link from "next/link";
import type { RelatedLink } from "@/lib/linking/graph";

/**
 * Kuratierte kontextuelle Verlinkung (Roadmap 4.4). Bündelt Autorität auf die
 * Money-Keywords — bewusst gemischte Zieltypen (Problem + Futtertyp + Vergleich
 * + Ratgeber), nicht nur Geschwister desselben Typs.
 */
export default function RelatedLinks({
  items,
  title = "Passend dazu",
  className = "",
}: {
  items: RelatedLink[];
  title?: string;
  className?: string;
}) {
  if (!items?.length) return null;
  return (
    <section className={`max-w-5xl mx-auto w-full px-5 pb-16 ${className}`}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
