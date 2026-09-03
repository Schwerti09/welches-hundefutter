"use client";

import { useState } from "react";
import type { PartnerVoucher } from "@/data/partners";

const CATEGORY_LABEL: Record<PartnerVoucher["category"], string> = {
  ernaehrung: "Futter & Ernährung",
  zubehoer: "Zubehör",
  pflege: "Pflege & Gesundheit",
  sonstiges: "Sonstiges",
};

export default function VoucherCard({ voucher }: { voucher: PartnerVoucher }) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    if (!voucher.code) return;
    navigator.clipboard?.writeText(voucher.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="card card-hover p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-lg">{voucher.shopName}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)]">
            {CATEGORY_LABEL[voucher.category]}
          </span>
        </div>
        {voucher.hasFeed && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 whitespace-nowrap">
            im Katalog
          </span>
        )}
      </div>

      <p className="text-[var(--honey)] font-semibold text-sm">{voucher.discount}</p>
      {voucher.terms && <p className="text-xs text-[var(--muted)] leading-relaxed">{voucher.terms}</p>}

      <div className="mt-auto flex items-center gap-2 pt-2">
        {voucher.code ? (
          <button
            type="button"
            onClick={copyCode}
            className="flex-1 px-3 py-2 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm font-mono font-semibold tracking-wide hover:bg-emerald-500/20 transition-colors"
          >
            {copied ? "✓ Kopiert!" : `${voucher.code} 📋`}
          </button>
        ) : (
          <span className="flex-1 px-3 py-2 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm text-center">
            Kein Code nötig
          </span>
        )}
        <a
          href={voucher.affiliateUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="px-3 py-2 rounded-lg btn-primary text-sm whitespace-nowrap"
        >
          Zum Shop →
        </a>
      </div>
    </div>
  );
}
