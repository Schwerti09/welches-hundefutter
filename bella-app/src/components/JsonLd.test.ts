import { describe, it, expect } from "vitest";
import { serializeJsonLd } from "./JsonLd";

describe("serializeJsonLd (4.6)", () => {
  it("gültiges JSON, das round-trippt", () => {
    const schema = { "@context": "https://schema.org", "@type": "FAQPage", name: "Test" };
    const out = serializeJsonLd(schema);
    expect(JSON.parse(out.replace(/\\u003c/g, "<"))).toEqual(schema);
  });

  it("escaped `<` → kein </script>-Ausbruch", () => {
    const evil = { name: "Hund</script><script>alert(1)</script>", desc: "a < b" };
    const out = serializeJsonLd(evil);
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<script>");
    // Inhalt bleibt semantisch erhalten
    expect(JSON.parse(out.replace(/\\u003c/g, "<")).name).toBe("Hund</script><script>alert(1)</script>");
  });

  it("Array von Schemas", () => {
    const out = serializeJsonLd([{ "@type": "A" }, { "@type": "B" }]);
    expect(JSON.parse(out)).toHaveLength(2);
  });

  it("undefined-Felder fallen raus", () => {
    const out = serializeJsonLd({ a: 1, b: undefined });
    expect(out).toBe('{"a":1}');
  });

  it("zirkuläre Referenz wirft laut", () => {
    const a: Record<string, unknown> = {};
    a.self = a;
    expect(() => serializeJsonLd(a)).toThrow();
  });
});
