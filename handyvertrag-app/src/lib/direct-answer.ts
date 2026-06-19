import type { Problem } from "@/data/problems";
import type { Breed } from "@/data/breeds";
import type { Futtertyp } from "@/data/futtertypen";

// Leitet aus den vorhandenen strukturierten Feldern eine knappe, extrahierbare
// Direktantwort ab (für KI-Zitation / AI Overviews). Keine erfundenen Zahlen,
// keine Heilversprechen — nur Synthese aus echten Daten. Die Entität steht in der
// Frage (suchnah, grammatisch sauber), die Antwort ist eine klare Eigenschafts-Liste.

export interface DirectAnswer {
  question: string;
  answer: string;
}

function commaList(items: string[] | undefined, max: number): string {
  return (items ?? []).filter(Boolean).slice(0, max).join(", ");
}

export function problemDirectAnswer(p: Problem): DirectAnswer {
  const crit = commaList(p.recommendedCriteria, 3);
  const avoid = commaList(p.avoidIngredients, 3);
  let answer = crit
    ? `Empfehlenswert ist Futter mit diesen Eigenschaften: ${crit}.`
    : "Empfehlenswert ist gut verträgliches Alleinfutter mit klarer Deklaration.";
  if (avoid) answer += ` Möglichst ohne ${avoid}.`;
  return { question: `Welches Hundefutter bei ${p.name}?`, answer };
}

export function breedDirectAnswer(b: Breed): DirectAnswer {
  let answer = "Empfehlenswert ist ein hochwertiges Alleinfutter mit hohem Fleischanteil";
  if (typeof b.recommendedProteinPercentage === "number" && b.recommendedProteinPercentage > 0) {
    answer += ` und etwa ${b.recommendedProteinPercentage} % Protein`;
  }
  answer += ".";
  const size = String(b.size ?? "").toLowerCase();
  if (size === "gross" || size === "sehrgross") {
    answer += " Bei großen Rassen ist zusätzlich eine Large-Breed-Formel sinnvoll.";
  }
  return { question: `Welches Hundefutter für ${b.name}?`, answer };
}

export function futtertypDirectAnswer(f: Futtertyp): DirectAnswer {
  const pros = commaList(f.pros, 3);
  const answer = pros
    ? `${f.name} bietet vor allem: ${pros}.`
    : `${f.name} ist eine verbreitete Futterform für Hunde.`;
  return { question: `Ist ${f.name} gut für Hunde?`, answer };
}
