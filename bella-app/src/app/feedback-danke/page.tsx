import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Danke für dein Feedback | BELLA",
  robots: { index: false, follow: false },
};

const OUTCOME_TEXT: Record<string, string> = {
  besser: "Schön zu hören! Danke, dass du dir die Zeit genommen hast.",
  gleich: "Danke für die ehrliche Rückmeldung — manchmal braucht's noch etwas Zeit oder ein anderes Futter.",
  schlechter: "Danke für die ehrliche Antwort. Falls sich etwas verschlechtert hat, sprich bitte mit deinem Tierarzt — wir sind kein Ersatz dafür.",
};

export default async function FeedbackDankePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; outcome?: string }>;
}) {
  const { status, outcome } = await searchParams;
  const message =
    status === "ok" && outcome && OUTCOME_TEXT[outcome]
      ? OUTCOME_TEXT[outcome]
      : status === "invalid"
        ? "Dieser Link ist nicht mehr gültig — vermutlich wurde schon geantwortet."
        : "Danke für deine Rückmeldung.";

  return (
    <div className="min-h-screen flex items-center justify-center text-[var(--ink)] px-5">
      <div className="max-w-md text-center">
        <p className="text-4xl mb-4">🐾</p>
        <h1 className="text-2xl font-extrabold tracking-tight mb-3">Danke!</h1>
        <p className="text-[var(--muted)] leading-relaxed mb-8">{message}</p>
        <Link href="/" className="text-sm text-[var(--honey)] font-semibold">
          Zurück zu welches-hundefutter.today →
        </Link>
      </div>
    </div>
  );
}
