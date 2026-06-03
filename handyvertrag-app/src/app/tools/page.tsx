import Link from 'next/link';
import { BookOpen, Calculator, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools & Guides – Handy trotz Schufa',
  description: 'Kostenlose Tools, Rechner & Guides für Handyverträge trotz Schufa: Schufa-Score Rechner, Vergleichstool & umfangreiche Guides.',
};

const tools = [
  {
    id: 'guide',
    icon: BookOpen,
    title: 'Vollständiger Guide',
    description: 'Der ultimative Ratgeber für Handyverträge trotz Schufa, negative Bonität und alles rund um Schufa-Auskunft.',
    href: '/guides',
    features: [
      'Was ist die Schufa?',
      'Anbieter-Vergleich',
      'Schritt-für-Schritt Anleitung',
      'Häufige Fragen',
      '5000+ Wörter Content',
    ],
  },
  {
    id: 'calculator',
    icon: Calculator,
    title: 'Schufa-Score Rechner',
    description: 'Berechne kostenlos deinen persönlichen Schufa-Score und erfahre deine realistischen Chancen.',
    href: '/tools/schufa-rechner',
    features: [
      '6 intelligente Fragen',
      'Personalisierte Empfehlung',
      'Beste Anbieter für dich',
      'Nächste Schritte',
      'Kostenlos & anonym',
    ],
  },
  {
    id: 'comparison',
    icon: BarChart3,
    title: 'Vergleich-Tool',
    description: 'Vergleiche 1000+ Handyverträge mit intelligenten Filtern und finde dein perfektes Angebot.',
    href: '/tools/vergleich',
    features: [
      'Echtzeit-Vergleich',
      'Preis-Filter',
      'Datenvolumen-Filter',
      'Schufa-Kulanz anzeigen',
      'Match-Score System',
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Tools & Guides für Handy trotz Schufa
          </h1>
          <p className="text-xl text-gray-600">
            Kostenlose Ressourcen, um die beste Lösung für deine Situation zu finden
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-lg">
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold">{tool.title}</h3>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 mb-6">{tool.description}</p>

                  <div className="space-y-2 mb-8">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-3 font-bold">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-blue-600 group-hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Tool öffnen →
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Warum diese Tools nutzen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Personalisiert</h3>
              <p className="text-gray-700">
                Alle Tools sind speziell auf deine Situation ausgerichtet – ob gute oder schlechte Schufa.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">💯 Kostenlos</h3>
              <p className="text-gray-700">
                100% kostenlos und unverbindlich. Keine versteckten Gebühren oder Überraschungen.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">⚡ Schnell</h3>
              <p className="text-gray-700">
                In 5-10 Minuten weißt du genau, welche Optionen für dich verfügbar sind.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">50.000+</p>
            <p className="text-gray-600">Nutzer geholfen</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">1000+</p>
            <p className="text-gray-600">Handyverträge</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
            <p className="text-gray-600">Erfolgsquote</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">4.8★</p>
            <p className="text-gray-600">Bewertung</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bereit, deinen perfekten Handyvertrag zu finden?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Starte mit dem Schufa-Score Rechner oder dem Vergleich-Tool!
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Zur KI-Beratung →
          </Link>
        </div>
      </div>
    </div>
  );
}
