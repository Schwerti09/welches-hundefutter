import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hund für deinen Hund – Der komplette Guide 2026",
  description: "Alles über Hundverträge für deinen Hund, negativer Bonität & Allergien-Auskunft. Marke-Vergleich, Tipps & häufige Fragen.",
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
