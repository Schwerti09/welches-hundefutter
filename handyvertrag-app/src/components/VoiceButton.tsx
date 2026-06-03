"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  onResult: (text: string) => void;
  onListening?: (active: boolean) => void;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

export default function VoiceButton({ onResult, onListening, disabled }: Props) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [volume, setVolume] = useState(0);
  const recRef = useRef<AnyRecognition | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    cancelAnimationFrame(animFrameRef.current);
    setListening(false);
    setVolume(0);
    onListening?.(false);
  }, [onListening]);

  const startListening = useCallback(async () => {
    if (listening) { stopListening(); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;
    try {
      // Volume visualisation via Web Audio API
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setVolume(Math.min(100, avg * 2));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      const rec = new SpeechRec();
      rec.lang = "de-DE";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      recRef.current = rec;

      rec.onstart = () => { setListening(true); onListening?.(true); };
      rec.onend = () => stopListening();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (e: any) => {
        if (e.error === "not-allowed") setPermissionDenied(true);
        stopListening();
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript.trim();
        if (transcript) onResult(transcript);
      };

      rec.start();
    } catch {
      setPermissionDenied(true);
    }
  }, [listening, onResult, onListening, stopListening]);

  if (!supported) return null;

  return (
    <div className="relative">
      <button
        onClick={startListening}
        disabled={disabled}
        title={permissionDenied ? "Mikrofon-Zugriff verweigert" : listening ? "Aufnahme stoppen" : "Spracheingabe starten"}
        aria-label={listening ? "Aufnahme stoppen" : "Spracheingabe"}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed
          ${listening
            ? "bg-red-500/90 shadow-lg shadow-red-500/40"
            : permissionDenied
            ? "bg-white/5 text-white/30 cursor-not-allowed"
            : "bg-white/8 hover:bg-white/15 text-white/60 hover:text-white"
          }`}
      >
        {/* Volume ring while listening */}
        {listening && (
          <div
            className="absolute inset-0 rounded-xl border-2 border-red-400 transition-transform duration-75"
            style={{ transform: `scale(${1 + volume / 400})`, opacity: 0.6 + volume / 400 }}
          />
        )}

        {listening ? (
          /* Stop icon */
          <svg className="w-4 h-4 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          /* Mic icon */
          <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
        )}
      </button>

      {/* Pulsing dot while recording */}
      {listening && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}
