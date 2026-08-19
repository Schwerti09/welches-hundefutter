import Link from "next/link";

// Globaler Header: Marken-Lockup (Pfote + BELLA) links, Kernnavigation rechts.
// Server-Komponente ohne JS → alle Links im initialen HTML (gut für Crawler,
// interne Verlinkung und CWV). Auf Mobil scrollt die Linkzeile horizontal,
// damit jeder Link erreichbar bleibt, ohne ein JS-Menü.
const NAV = [
  { href: "/handwerkerservice", label: "Handwerkerservice" },
  { href: "/mein-hund", label: "Mein Hund 🐾" },
  { href: "/rassen", label: "Rassen" },
  { href: "/tipps", label: "Ratgeber" },
  { href: "/blog", label: "Blog" },
  { href: "/meinungen", label: "Meinungen 🕸️" },
  { href: "/studien", label: "Studien 🔬" },
  { href: "/vergleich", label: "Vergleiche" },
  { href: "/deals", label: "Deals" },
];

function PawMark() {
  return (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
      style={{ background: "linear-gradient(135deg, #f0a73c, #ff8a4c)" }}
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="#1a1205">
        <ellipse cx="16" cy="20.5" rx="5.2" ry="4.3" />
        <circle cx="9.5" cy="13.5" r="2.5" />
        <circle cx="14" cy="10" r="2.6" />
        <circle cx="18.5" cy="10" r="2.6" />
        <circle cx="22.8" cy="13.6" r="2.5" />
      </svg>
    </span>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08080c]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-5">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Marken-Lockup → Startseite */}
          <Link href="/" className="flex items-center gap-2.5 min-w-0" aria-label="welches-hundefutter.today — Startseite">
            <PawMark />
            <span className="flex flex-col leading-none min-w-0">
              <span className="font-extrabold tracking-tight text-[var(--ink)] text-base">BELLA</span>
              <span className="hidden sm:block text-[10px] tracking-wide text-[var(--muted)] truncate">
                welches-hundefutter.today
              </span>
            </span>
          </Link>

          {/* Desktop-Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Hauptnavigation">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--honey)] transition-colors"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/tools/futter-finder" className="btn-primary ml-2 rounded-xl px-4 py-2 text-sm font-semibold">
              Futter-Finder
            </Link>
          </nav>

          {/* Mobil: nur primäre CTA */}
          <Link
            href="/tools/futter-finder"
            className="btn-primary md:!hidden rounded-xl px-3.5 py-2 text-sm font-semibold shrink-0"
          >
            Futter-Finder
          </Link>
        </div>

        {/* Mobile Sekundär-Navigation: horizontal scrollbar, alle Links im HTML */}
        <nav
          className="md:hidden flex items-center gap-4 overflow-x-auto pb-2 -mt-0.5 text-sm no-scrollbar"
          aria-label="Seiten"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap text-[var(--muted)] hover:text-[var(--honey)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
