type Props = {
  headline: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export function Hero({ headline, subtext, ctaPrimary, ctaSecondary }: Props) {
  return (
    <section className="relative overflow-hidden px-[var(--block-px)] py-[var(--section-py-mobile)] sm:px-[var(--block-px-desktop)] sm:py-16">
      {/* Soft avocado blob behind hero */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-40 blur-3xl sm:-top-32 sm:-right-32 sm:h-96 sm:w-96"
        style={{ background: "var(--avo-green-pale)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-30 blur-3xl sm:-left-24 sm:h-64 sm:w-64"
        style={{ background: "var(--avo-green-light)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--avo-pit)]/20 bg-[var(--avo-pit)]/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--avo-pit)]">
          Launching Soon
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:mt-5 sm:text-4xl md:text-5xl">
          {headline}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)] sm:mt-4 sm:text-lg">
          {subtext}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
          <a
            href="#join"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--avo-green)] px-6 font-medium text-white shadow-[var(--shadow-button)] transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--avo-green)] focus:ring-offset-2"
          >
            {ctaPrimary}
          </a>
          <a
            href="#first-drop"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--card-border)] bg-[var(--card-bg)] px-6 font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[var(--avo-pit-light)]/30 hover:bg-[var(--background-warm)] focus:outline-none focus:ring-2 focus:ring-[var(--avo-pit)]/20 focus:ring-offset-2"
          >
            {ctaSecondary}
          </a>
        </div>
        <p className="mt-3 text-xs text-[var(--foreground-soft)]">
          Launch perks + discounts. No spam.
        </p>

        {/* Stat row – pit dots as separators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)] sm:mt-10">
          <span>Made-to-order</span>
          <span className="text-[var(--avo-pit)]" aria-hidden>•</span>
          <span>Limited designs</span>
          <span className="text-[var(--avo-pit)]" aria-hidden>•</span>
          <span>Drop-based releases</span>
        </div>
      </div>
    </section>
  );
}
