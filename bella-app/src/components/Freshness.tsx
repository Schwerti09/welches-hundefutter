/**
 * Sichtbares Aktualitäts-Signal (Roadmap 4.3) — ein konsistenter Ort für
 * „zuletzt aktualisiert / geprüft am". Für Seiten ohne `AuthorBox`
 * (der Voll-Box-Autorenkasten trägt das Datum schon selbst).
 */
export default function Freshness({
  date,
  label = "Zuletzt aktualisiert",
  className = "",
}: {
  date: string;
  label?: string;
  className?: string;
}) {
  const human = new Date(date).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <p className={`text-xs text-[var(--muted)] ${className}`}>
      {label}: <time dateTime={date}>{human}</time>
    </p>
  );
}
