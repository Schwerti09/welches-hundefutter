import type { TipCategory } from "./types";
import { diaet } from "./diaet";
import { abnehmen } from "./abnehmen";
import { sportBewegung } from "./sport-bewegung";
import { ernaehrung } from "./ernaehrung";
import { gesundheit } from "./gesundheit";
import { welpen } from "./welpen";
import { seniorHund } from "./senior-hund";
import { allergien } from "./allergien";
import { fellHaut } from "./fell-haut";
import { zaehne } from "./zaehne";
import { barf } from "./barf";
import { verdauung } from "./verdauung";
import { leckerlies } from "./leckerlies";
import { hydration } from "./hydration";

export type { TipCategory, TipEntry, TipLevel, TipArticle } from "./types";
export { TIP_LEVELS } from "./types";

export const TIP_CATEGORIES: TipCategory[] = [
  ernaehrung,
  abnehmen,
  diaet,
  sportBewegung,
  gesundheit,
  welpen,
  seniorHund,
  allergien,
  fellHaut,
  zaehne,
  barf,
  verdauung,
  leckerlies,
  hydration,
];

export const TIP_CATEGORY_BY_SLUG: Record<string, TipCategory> = Object.fromEntries(
  TIP_CATEGORIES.map((c) => [c.slug, c])
);

export const TOTAL_TIPS = TIP_CATEGORIES.reduce((sum, c) => sum + c.tips.length, 0);
