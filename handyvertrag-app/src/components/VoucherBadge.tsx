"use client";

import { useState } from "react";
import { getVoucherForUrl } from "@/data/partners";

interface Props {
  affiliateUrl: string | null | undefined;
  className?: string;
}

/** Renders a copy-to-clipboard voucher chip if the product's shop has an active code. Renders nothing otherwise. */
export default function VoucherBadge({ affiliateUrl, className = "" }: Props) {
  const voucher = getVoucherForUrl(affiliateUrl);
  const [copied, setCopied] = useState(false);

  if (!voucher) return null;

  if (!voucher.code) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ${className}`}>
        🎁 {voucher.discount}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard?.writeText(voucher.code!).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      title={voucher.discount}
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors ${className}`}
    >
      🎁 {copied ? "Kopiert!" : `Code ${voucher.code}`}
    </button>
  );
}
