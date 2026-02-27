export function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-[var(--card-border)] bg-[var(--card-bg)] px-[var(--block-px)] py-[var(--section-py-mobile)] sm:px-[var(--block-px-desktop)] sm:py-10"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">
          Avocado-core, but premium.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
          Avacarto is cute lifestyle merch inspired by the fruit that started it
          all.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
          Limited drops, made-to-order, and designed to gift.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-[var(--radius-pill)] bg-[var(--avo-green-pale)] px-3 py-1 text-xs font-medium text-[var(--avo-green)]">
            Made-to-order
          </span>
          <span className="rounded-[var(--radius-pill)] bg-[var(--avo-green-pale)] px-3 py-1 text-xs font-medium text-[var(--avo-green)]">
            Limited drops
          </span>
          <span className="rounded-[var(--radius-pill)] bg-[var(--avo-green-pale)] px-3 py-1 text-xs font-medium text-[var(--avo-green)]">
            Gift-ready
          </span>
        </div>
      </div>
    </section>
  );
}
