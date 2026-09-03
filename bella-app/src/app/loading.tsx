import BellaMascot from "@/components/bella/BellaMascot";

// Route-Level-Ladezustand (Roadmap 3.2). Ersetzt den weißen Blitz bei
// Navigationen durch eine gebrandete BELLA-Sequenz.
export default function Loading() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-5 py-24 text-center">
      <BellaMascot pose="sniff" size={104} title="BELLA sucht" />
      <p className="text-sm font-medium text-[var(--muted)]">BELLA schnüffelt sich durch die Sorten …</p>
      <span className="sr-only" role="status">Seite wird geladen</span>
    </main>
  );
}
