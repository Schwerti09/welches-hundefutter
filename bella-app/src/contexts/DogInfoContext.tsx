"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface DogInfo {
  breedName: string | null;
  weightKg: number;
  dailyGrams: number;
}

interface DogInfoContextValue {
  dogInfo: DogInfo | null;
  setDogInfo: (info: DogInfo) => void;
}

const DogInfoContext = createContext<DogInfoContextValue>({ dogInfo: null, setDogInfo: () => {} });

export function DogInfoProvider({ children }: { children: ReactNode }) {
  const [dogInfo, setDogInfo] = useState<DogInfo | null>(null);
  return (
    <DogInfoContext.Provider value={{ dogInfo, setDogInfo }}>
      {children}
    </DogInfoContext.Provider>
  );
}

/** Liefert außerhalb eines DogInfoProvider einen no-op-Default (z. B. andere Seiten, die BellaAdvisorWrapper ohne Kosten-Hook einbinden). */
export function useDogInfo() {
  return useContext(DogInfoContext);
}
