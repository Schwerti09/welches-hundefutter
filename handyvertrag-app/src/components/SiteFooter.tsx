import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;   // http(s) oder mailto → <a> statt <Link>
  sponsored?: boolean;  // Affiliate → rel="sponsored", nur Klick-Tracking (kein On-Load-Pixel!)
  hint?: string;        // kleiner Badge, z. B. "Werbung"
};

// Nur Links, die wirklich existieren (geprüft gegen src/app/**). Keine toten /empfehlung-,
// /allergie-, /rassen-Routen mehr. Echte Seiten: Tools, FAQ, Guides, Blog, Deals, Rassen.
const LINKS: Record<string, FooterLink[]> = {
  Beratung: [
    { label: "BELLA – Futter-Beraterin", href: "/" },
    { label: "Futter-Finder & Tools", href: "/tools" },
    { label: "FAQ Hundeernährung", href: "/faq" },
    { label: "Ratgeber & Guides", href: "/guides" },
    { label: "Hundefutter-Blog", href: "/blog" },
  ],
  "Beliebte Rassen": [
    { label: "Labrador Retriever", href: "/rasse/labrador-retriever" },
    { label: "Golden Retriever", href: "/rasse/golden-retriever" },
    { label: "Deutscher Schäferhund", href: "/rasse/deutscher-schaeferhund" },
    { label: "Französische Bulldogge", href: "/rasse/franzoesische-bulldogge" },
    { label: "Dackel", href: "/rasse/dackel" },
    { label: "Chihuahua", href: "/rasse/chihuahua" },
  ],
  Entdecken: [
    { label: "Aktuelle Futter-Deals", href: "/deals" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Affiliate-Hinweis", href: "/affiliate" },
    { label: "DOCTR Care", href: "https://t.adcell.com/p/click?promoId=478872&slotId=66376", external: true, sponsored: true, hint: "Werbung" },
    { label: "Kontakt", href: "mailto:support@welches-hundefutter.today", external: true },
  ],
  Rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
    { label: "Cookie-Einstellungen", href: "/datenschutz#cookies" },
  ],
};

const ITEM_CLS = "text-sm text-gray-400 hover:text-white transition-colors leading-relaxed inline-flex items-center gap-1.5";

function FooterItem({ l }: { l: FooterLink }) {
  if (l.external) {
    const isMail = l.href.startsWith("mailto:");
    return (
      <a
        href={l.href}
        className={ITEM_CLS}
        target={isMail ? undefined : "_blank"}
        rel={l.sponsored ? "sponsored nofollow noopener" : "noopener noreferrer"}
      >
        {l.label}
        {l.hint && (
          <span className="text-[10px] uppercase tracking-wide text-gray-600 border border-gray-700 rounded px-1 py-px">
            {l.hint}
          </span>
        )}
      </a>
    );
  }
  return (
    <Link href={l.href} className={ITEM_CLS}>
      {l.label}
    </Link>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-shadow">
                <span className="text-white font-black text-sm">B</span>
              </div>
              <span className="font-bold text-lg">welches-hundefutter<span className="text-orange-400">.today</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              BELLA findet das passende Hundefutter für deinen Hund – aus über 8.000 Produkten mit
              tagesaktuellen Preisen. Kostenlos, neutral, in 60 Sekunden.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">BELLA ist online</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Anifit", "Wolfsblut", "Futalis", "Terra Canis"].map((p) => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">{p}</span>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm text-white mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <FooterItem l={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>🦴</span> 8.000+ Hundefutter im Vergleich</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>📈</span> Preise täglich aktualisiert</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>⚖️</span> neutral &amp; kostenlos</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © 2026 welches-hundefutter.today · Neutrale Hundefutter-Beratung · Deutschland
            </p>
            <p className="text-gray-600 text-xs text-center md:text-right">
              Affiliate-Links mit <code className="text-gray-500">rel=&quot;sponsored&quot;</code> · Preise inkl. MwSt. · keine Gewähr für Aktualität
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
