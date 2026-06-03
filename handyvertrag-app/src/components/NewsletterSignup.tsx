'use client';

import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate subscription
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <Mail className="w-8 h-8" />
        </div>

        <h3 className="text-3xl font-bold text-center mb-2">
          Kostenlose Tipps & Angebote
        </h3>

        <p className="text-center text-blue-100 mb-8">
          Erhalte wöchentliche Tipps zur Schufa-Verbesserung, beste Handyverträge & exklusive Deals – komplett kostenlos!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="email"
            placeholder="Deine Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            {status === 'loading' ? 'Wird abonniert...' : 'Jetzt abonnieren'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-center text-green-200 font-semibold">
            ✅ Erfolg! Bestätigungsemail wurde verschickt.
          </p>
        )}

        {status === 'error' && (
          <p className="text-center text-red-200 font-semibold">
            ❌ Fehler! Bitte gültige Email eingeben.
          </p>
        )}

        <p className="text-center text-sm text-blue-100 mt-6">
          💪 1000+ Menschen verbessern bereits ihre Schufa mit uns!
        </p>
      </div>
    </div>
  );
}
