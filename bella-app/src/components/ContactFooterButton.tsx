"use client";

export default function ContactFooterButton({ label, className }: { label: string; className: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-bella-support"))}
      className={className}
    >
      {label}
    </button>
  );
}
