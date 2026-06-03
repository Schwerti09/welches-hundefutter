import Link from "next/link";

const LINKS = {
  Beratung: [
    { label: "HANSI – Schufa Berater", href: "/" },
    { label: "Vertrag trotz Schufa finden", href: "/guides" },
    { label: "Prepaid ohne Schufa", href: "/anbieter/o2-trotz-schufa" },
    { label: "FAQ Handyvertrag & Schufa", href: "/faq" },
    { label: "Vertrag TÜV", href: "/contract-tuev" },
  ],
  Provider: [
    { label: "1&1 trotz Schufa", href: "/anbieter/1und1-trotz-schufa" },
    { label: "freenet trotz Schufa", href: "/anbieter/freenet-trotz-schufa" },
    { label: "congstar trotz Schufa", href: "/anbieter/congstar-trotz-schufa" },
    { label: "otelo trotz Schufa", href: "/anbieter/otelo-trotz-schufa" },
    { label: "MAINGAU trotz Schufa", href: "/anbieter/maingau-trotz-schufa" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Affiliate-Hinweis", href: "/affiliate" },
    { label: "Kontakt", href: "mailto:support@handytrotzschufa.today" },
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <span className="text-white font-black text-sm">H</span>
              </div>
              <span className="font-bold text-lg">handytrotzschufa<span className="text-indigo-400">.today</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Handyvertrag trotz Schufa – HANSI findet deinen Weg. Neutral, kostenlos, ohne Bewertung.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">HANSI ist online</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["1&1", "freenet", "otelo"].map((p) => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{p}</span>
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
            © 2026 handytrotzschufa.today · HANSI Intelligence System · Deutschland
          </p>
          <p className="text-gray-600 text-xs text-center">
            Affiliate-Links mit <code className="text-gray-500">rel=&quot;sponsored&quot;</code> · Preise inkl. MwSt. · keine Gewähr für Aktualität
          </p>
        </div>
      </div>
    </footer>
  );
}
