import Link from "next/link";

const LINKS = {
  Beratung: [
    { label: "BELLA – Hundefutter-Beraterin", href: "/" },
    { label: "Hundefutter-Finder", href: "/tools/futter-finder" },
    { label: "Hundefutter bei Allergie", href: "/allergie" },
    { label: "FAQ Hundeernährung", href: "/faq" },
    { label: "Hundefutter nach Rasse", href: "/rassen" },
  ],
  Futtermarken: [
    { label: "Anifit Hundefutter", href: "/empfehlung/anifit-adult" },
    { label: "Wolfsblut Hundefutter", href: "/empfehlung/wolfsblut-wild-duck" },
    { label: "Futalis Hundefutter", href: "/empfehlung/futalis-individuell" },
    { label: "Bellfor Hundefutter", href: "/empfehlung/bellfor-allergiker" },
    { label: "Terra Canis Nassfutter", href: "/empfehlung/terra-canis" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Affiliate-Hinweis", href: "/affiliate" },
    { label: "Kontakt", href: "mailto:support@welches-hundefutter.today" },
  ],
  Rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
    { label: "Cookie-Einstellungen", href: "/datenschutz#cookies" },
  ],
};

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
              BELLA findet das perfekte Hundefutter für deinen Hund. Kostenlos, neutral, in 60 Sekunden.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">BELLA ist online</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Anifit", "Wolfsblut", "Futalis"].map((p) => (
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
                    <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors leading-relaxed">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2026 welches-hundefutter.today · BELLA Intelligence System · Deutschland
          </p>
          <p className="text-gray-600 text-xs text-center">
            Affiliate-Links mit <code className="text-gray-500">rel=&quot;sponsored&quot;</code> · Preise inkl. MwSt. · keine Gewähr für Aktualität
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="text-gray-700 text-xs">Powered by</span>
          <span className="text-xs font-semibold tracking-wide text-gray-500 border border-gray-700 rounded px-2 py-0.5">
            HANSI Decision Intelligence Engine™
          </span>
        </div>
      </div>
    </footer>
  );
}
