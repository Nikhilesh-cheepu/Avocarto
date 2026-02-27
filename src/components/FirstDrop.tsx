type Props = {
  title: string;
  note: string;
};

const PRODUCTS = [
  { name: "Avocado Classic", slug: "classic", desc: "The one that started it all." },
  { name: "Half & Half", slug: "half", desc: "Split personality, full vibe." },
  { name: "Avo Cool", slug: "cool", desc: "Chill cuts, limited run." },
];

export function FirstDrop({ title, note }: Props) {
  return (
    <section
      id="first-drop"
      className="border-t border-[var(--card-border)] bg-[var(--card-bg)] px-[var(--block-px)] py-[var(--section-py-mobile)] sm:px-[var(--block-px-desktop)] sm:py-12"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1.5 text-center text-sm text-[var(--foreground-muted)]">
          {note}
        </p>

        {/* Mobile: horizontal scroll with 1.2 cards visible */}
        <div className="mt-6 overflow-x-auto scrollbar-hide sm:mt-8">
          <div className="flex gap-4 pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            {PRODUCTS.map((p) => (
              <article
                key={p.slug}
                className="min-w-[72%] shrink-0 overflow-hidden rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--background)] shadow-[var(--shadow-soft)] sm:min-w-0"
              >
                <div className="aspect-square w-full bg-[var(--avo-green-pale)] flex items-center justify-center">
                  <span className="text-4xl opacity-60" aria-hidden>🥑</span>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-[var(--foreground)]">
                      {p.name}
                    </h3>
                    <span className="shrink-0 rounded bg-[var(--avo-pit)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--avo-pit)]">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    {p.desc}
                  </p>
                  <a
                    href="#join"
                    className="mt-2 inline-block text-xs font-medium text-[var(--avo-green)] underline-offset-2 hover:underline focus:outline-none focus:underline"
                  >
                    Notify me
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
