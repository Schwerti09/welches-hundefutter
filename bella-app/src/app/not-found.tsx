import Link from "next/link";
import type { Metadata } from "next";
import BellaMascot from "@/components/bella/BellaMascot";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-20">
      <BellaMascot pose="hmm" size={132} title="BELLA schaut ratlos" />
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--honey)]">Fehler 404</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Diese Seite hat BELLA nicht gefunden</h1>
      <p className="mt-3 max-w-md text-[var(--muted)]">
        Vielleicht wurde sie verschoben oder der Link stimmt nicht mehr. BELLA hilft dir trotzdem
        weiter — beim passenden Futter für deinen Hund.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/#bella-advisor" className="btn-primary">
          BELLA fragen — Empfehlung in 60&nbsp;s
        </Link>
        <Link
          href="/"
          className="rounded-xl px-6 py-3 text-sm font-semibold border border-white/15 text-[var(--honey)] hover:bg-white/5 transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
      <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
        <Link href="/rassen" className="hover:text-[var(--ink)] transition-colors">186 Rasse-Profile</Link>
        <Link href="/hundefutter-test" className="hover:text-[var(--ink)] transition-colors">Futter-Test</Link>
        <Link href="/vergleich" className="hover:text-[var(--ink)] transition-colors">Vergleiche</Link>
        <Link href="/tipps" className="hover:text-[var(--ink)] transition-colors">Fütterungs-Tipps</Link>
      </nav>
    </main>
  );
}
