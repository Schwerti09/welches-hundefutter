import Link from "next/link";
import { REVIEWER } from "@/data/reviewer";

/**
 * Sichtbares "Tiermedizinisch geprüft von..."-Badge.
 * Rendert nichts, solange kein echter Reviewer hinterlegt ist (REVIEWER === null)
 * oder kein reviewedAt-Datum übergeben wird — kein Badge ohne echten Review.
 */
export default function ReviewedBadge({ reviewedAt }: { reviewedAt?: string }) {
  if (!REVIEWER || !reviewedAt) return null;

  const date = new Date(reviewedAt).toLocaleDateString("de-DE", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="card p-4 flex items-center gap-3 text-sm my-6">
      <span aria-hidden>🩺</span>
      <p className="text-[var(--muted)]">
        Tiermedizinisch geprüft von{" "}
        <Link href={REVIEWER.profileUrl} className="text-[var(--honey)] hover:underline font-semibold">
          {REVIEWER.name}
        </Link>{" "}
        ({REVIEWER.title}) · Stand: <time dateTime={reviewedAt}>{date}</time>
      </p>
    </div>
  );
}
