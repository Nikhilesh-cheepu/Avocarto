import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-[38px] z-50 border-b border-[var(--card-border)] bg-[var(--background)]/98 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-[var(--block-px)] sm:px-[var(--block-px-desktop)]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--avo-green-light)] text-[var(--avo-green)] font-bold text-sm shadow-[var(--shadow-soft)]">
            A
          </div>
          <span className="hidden font-semibold text-[var(--foreground)] sm:inline">
            Avacarto
          </span>
        </Link>
      </div>
    </header>
  );
}
