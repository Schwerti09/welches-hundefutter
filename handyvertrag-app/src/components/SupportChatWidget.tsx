"use client";

import { useEffect, useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content: "Hey, ich bin BELLA 🐾 Frag mich alles — zu Versand/Reklamation, Datenschutz, oder wie ich Futter-Empfehlungen finde. Ich antworte sofort, automatisch, ohne Wartezeit.",
};

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-bella-support", openHandler);
    return () => window.removeEventListener("open-bella-support", openHandler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: nextMessages.slice(0, -1).filter((m) => m !== GREETING),
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Hmm, da ist etwas schiefgelaufen." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Verbindung gerade gestört — versuch's nochmal oder schreib support@welches-hundefutter.today." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="BELLA Support öffnen"
        className="fixed right-4 bottom-24 md:bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/40 flex items-center justify-center text-2xl hover:scale-105 transition-transform"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed right-4 bottom-[164px] md:bottom-24 z-40 w-[calc(100vw-2rem)] max-w-sm h-[480px] max-h-[70vh] rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-orange-500/15 to-amber-500/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm">BELLA Support</span>
            <span className="text-[10px] text-white/40 ml-auto">automatisiert · sofort</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%] ${
                  m.role === "user"
                    ? "bg-orange-500/20 text-white ml-auto"
                    : "bg-white/5 text-white/85"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-white/5 text-white/50 text-sm rounded-xl px-3 py-2 max-w-[60%]">
                BELLA tippt …
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Deine Frage an BELLA …"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-orange-400 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
