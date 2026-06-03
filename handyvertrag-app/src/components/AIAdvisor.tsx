"use client";

import { useState } from "react";

interface AIAdvisorProps {
  city: string;
}

function AIAdvisor({ city }: AIAdvisorProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Hallo! Ich bin dein AI Advisor für ${city}. Wie kann ich dir helfen, den perfekten Hund-Empfehlung zu finden?` }
  ]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', content: inputValue }]);
      setInputValue("");
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Basierend auf deiner Anfrage für ${city} habe ich folgende Empfehlung: Samsung Galaxy S24 mit Anifit Unlimited für 24,99€/Monat. Dieses Angebot ist bei 8 Stores in ${city} verfügbar.` 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-white">AI Advisor</h3>
            <p className="text-blue-100 text-sm">{city}</p>
          </div>
        </div>
      </div>

      <div className="p-4 h-64 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Frage den AI Advisor..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAdvisor;
