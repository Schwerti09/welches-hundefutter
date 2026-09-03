import Link from "next/link";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Preis-Wecker",
  description: "BELLA gibt dir Bescheid, wenn dein Hundefutter günstiger wird.",
  robots: { index: false, follow: false },
};

const STATES: Record<string, { icon: string; title: string; text: string }> = {
  confirmed: {
    icon: "✅",
    title: "Preis-Wecker bestätigt!",
    text: "Alles klar — BELLA passt jetzt auf den Preis auf und meldet sich, sobald dein Futter echt günstiger wird. Kein Spam, nur echte Tiefpreise.",
  },
  unsubscribed: {
    icon: "👋",
    title: "Du bist abgemeldet",
    text: "Schade, dass du gehst! Deine Preis-Wecker sind deaktiviert und du bekommst keine weiteren E-Mails. Du kannst dich jederzeit wieder anmelden.",
  },
  error: {
    icon: "🤔",
    title: "Link ungültig oder abgelaufen",
    text: "Dieser Bestätigungs- oder Abmelde-Link funktioniert nicht mehr. Starte den Preis-Wecker einfach neu über eine Empfehlung von BELLA.",
  },
};

export default async function PreisWeckerPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const s = STATES[status || ""] || STATES.error;
  return (
    <div className="min-h-screen bg-[#08080c] text-[#f4f1ea] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">{s.icon}</div>
          <h1 className="text-2xl font-bold mb-3">{s.title}</h1>
          <p className="text-gray-400 leading-relaxed mb-8">{s.text}</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
          >
            Zu BELLA
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
