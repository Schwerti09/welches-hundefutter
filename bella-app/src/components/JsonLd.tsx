/**
 * Ein getesteter Weg, JSON-LD auszugeben (Roadmap 4.6).
 *
 * Ersetzt 21 handgerollte `<script type="application/ld+json"
 * dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }} />` — jede davon
 * eine potenzielle XSS-/Kaputt-JSON-Quelle (GSC hatte schon eine).
 *
 * Härtung:
 *  - `<` → `<`  → ein `</script>` in irgendeinem String-Feld kann den
 *    Script-Tag nicht mehr verlassen.
 *  - `undefined`/Funktionen werden von `JSON.stringify` ohnehin entfernt.
 *  - Bei zirkulären Referenzen wirft `JSON.stringify` — laut sein, nicht still.
 *  - `nonce` optional durchgereicht (greift, sobald CSP `strict-dynamic` aus 1.2 steht).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ data, nonce }: { data: unknown; nonce?: string }) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
