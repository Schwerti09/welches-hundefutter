export type LifeStage = "welpe" | "adult" | "senior";

export interface LifecycleInfo {
  stage: LifeStage;
  ageMonths: number | null;
  nextStage: LifeStage | null;
  nextStageAt: Date | null;
  nextStageName: string | null;
  daysUntilTransition: number | null;
}

function seniorYears(weightKg: number | null): number {
  if (!weightKg || isNaN(weightKg)) return 8;
  if (weightKg < 10) return 10;
  if (weightKg < 25) return 8;
  return 7;
}

export function parseBirthDate(birthOrAge: string): Date | null {
  const s = birthOrAge.trim().toLowerCase().normalize("NFC");
  if (/welpe?/.test(s)) {
    const d = new Date();
    d.setMonth(d.getMonth() - 2);
    return d;
  }
  if (/senior/.test(s)) return null;

  const yMatch = s.match(/(\d+)\s*jahre?/);
  const mMatch = s.match(/(\d+)\s*monate?/);
  const wMatch = s.match(/(\d+)\s*wochen?/);
  if (!yMatch && !mMatch && !wMatch) return null;

  const d = new Date();
  if (yMatch) d.setFullYear(d.getFullYear() - parseInt(yMatch[1]));
  if (mMatch) d.setMonth(d.getMonth() - parseInt(mMatch[1]));
  if (wMatch) d.setDate(d.getDate() - parseInt(wMatch[1]) * 7);
  return d;
}

export function calcLifecycle(
  birthOrAge: string | null | undefined,
  weightKg: number | string | null | undefined,
): LifecycleInfo {
  const wkg = weightKg != null ? parseFloat(String(weightKg)) : null;
  const empty: LifecycleInfo = {
    stage: "adult", ageMonths: null, nextStage: null,
    nextStageAt: null, nextStageName: null, daysUntilTransition: null,
  };
  if (!birthOrAge) return empty;

  const s = birthOrAge.trim().toLowerCase();
  if (/welpe?/.test(s)) {
    return { ...empty, stage: "welpe", nextStage: "adult", nextStageName: "Erwachsener Hund" };
  }
  if (/senior/.test(s)) return { ...empty, stage: "senior" };

  const birthDate = parseBirthDate(birthOrAge);
  if (!birthDate) return empty;

  const now = Date.now();
  const ageMonths = Math.floor((now - birthDate.getTime()) / (30.44 * 864e5));

  if (ageMonths < 12) {
    const adultDate = new Date(birthDate);
    adultDate.setMonth(adultDate.getMonth() + 12);
    const daysUntilTransition = Math.ceil((adultDate.getTime() - now) / 864e5);
    return { stage: "welpe", ageMonths, nextStage: "adult", nextStageAt: adultDate, nextStageName: "Erwachsener Hund", daysUntilTransition };
  }

  const sy = seniorYears(wkg);
  const seniorDate = new Date(birthDate);
  seniorDate.setFullYear(seniorDate.getFullYear() + sy);

  if (now >= seniorDate.getTime()) {
    return { stage: "senior", ageMonths, nextStage: null, nextStageAt: null, nextStageName: null, daysUntilTransition: null };
  }

  const daysUntilTransition = Math.ceil((seniorDate.getTime() - now) / 864e5);
  return { stage: "adult", ageMonths, nextStage: "senior", nextStageAt: seniorDate, nextStageName: "Senior-Hund", daysUntilTransition };
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

export function stageLabelDe(stage: LifeStage): string {
  return stage === "welpe" ? "Welpe" : stage === "senior" ? "Senior" : "Erwachsen";
}
