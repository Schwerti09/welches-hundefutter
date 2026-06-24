import { computeCombinedSavings } from "@/data/partners";

interface Props {
  items: { price: number | null | undefined; affiliateUrl: string | null | undefined }[];
}

/** Shows one consolidated savings line when 2+ items in the recommendation have an active voucher. */
export default function SavingsBanner({ items }: Props) {
  const savings = computeCombinedSavings(items);
  if (!savings.worthShowing) return null;

  const totalVouchers = savings.itemsWithExactSavings + savings.itemsWithVagueDiscount;

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3">
      <span className="text-lg">💰</span>
      <p className="text-sm text-emerald-300">
        {savings.euroSavings > 0 ? (
          <>
            Mit den Codes oben sparst du <strong>~{savings.euroSavings.toFixed(2).replace(".", ",")} €</strong>
            {savings.itemsWithVagueDiscount > 0 ? " + weitere Rabatte" : ""}.
          </>
        ) : (
          <>
            {totalVouchers > 1 ? `${totalVouchers} der Empfehlungen oben haben` : "Eine der Empfehlungen oben hat"} einen aktiven Rabattcode.
          </>
        )}
      </p>
    </div>
  );
}
