import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handy trotz Schufa – Der komplette Guide 2026",
  description: "Alles über Handyverträge trotz Schufa, negativer Bonität & Schufa-Auskunft. Anbieter-Vergleich, Tipps & häufige Fragen.",
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
