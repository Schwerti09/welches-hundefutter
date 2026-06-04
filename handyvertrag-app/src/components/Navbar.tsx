"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Futter-Finder", href: "/tools/futter-finder" },
  { label: "Rassen", href: "/rassen" },
  { label: "Allergie", href: "/allergie" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-orange-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-orange-500/40 transition-shadow">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className={`font-bold text-lg transition-colors ${scrolled ? "text-gray-900" : "text-gray-900"}`}>
              welches-hundefutter<span className="text-orange-500">.today</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5"
            >
              🐕 BELLA fragen
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="w-5 space-y-1">
              <span className={`block h-0.5 bg-gray-800 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-gray-800 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-gray-800 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold text-center"
            >
              🐕 BELLA fragen
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
