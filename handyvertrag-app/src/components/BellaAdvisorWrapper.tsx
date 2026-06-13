"use client";

import dynamic from "next/dynamic";
import { useDogInfo } from "@/contexts/DogInfoContext";

const BellaAdvisor = dynamic(() => import("@/components/BellaAdvisor"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-5xl mx-auto h-[520px] flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <div className="text-6xl mb-4 animate-bounce">🐕</div>
        <p className="text-sm">BELLA wird geladen...</p>
      </div>
    </div>
  ),
});

interface BellaAdvisorWrapperProps {
  introMessage?: string;
  pageQuickOptions?: Array<{ label: string; msg: string }>;
}

function buildDogIntro(breedName: string | null, weightKg: number, grams: number): string {
  const dogDesc = breedName ? `${breedName}, ca. ${weightKg} kg` : `ca. ${weightKg} kg`;
  return `Hallo! Ich habe schon gesehen: dein Hund (${dogDesc}) braucht ungefähr ${grams} g Trockenfutter pro Tag. 🐕\n\nJetzt brauche ich nur noch 3 Dinge von dir:\n1. Wie aktiv ist er — ruhig, normal oder sehr aktiv/Sporthund?\n2. Hat er Allergien oder einen empfindlichen Magen?\n3. Was fütterst du aktuell, oder wie viel möchtest du maximal ausgeben?\n\nDann zeige ich dir die besten Treffer aus über 11.000 Sorten.`;
}

export default function BellaAdvisorWrapper({ introMessage, pageQuickOptions }: BellaAdvisorWrapperProps = {}) {
  const { dogInfo } = useDogInfo();
  const activeIntro = introMessage ?? (dogInfo ? buildDogIntro(dogInfo.breedName, dogInfo.weightKg, dogInfo.dailyGrams) : undefined);
  return <BellaAdvisor introMessage={activeIntro} pageQuickOptions={pageQuickOptions} />;
}
