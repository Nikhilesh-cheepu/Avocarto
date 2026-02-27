const ITEMS = [
  { label: "Tees", icon: "👕" },
  { label: "Mugs", icon: "☕" },
  { label: "Accessories", icon: "🛍️" },
  { label: "Stickers", icon: "✨" },
];

export function WhatsComing() {
  return (
    <section className="border-t border-[var(--card-border)] bg-[var(--background-warm)] px-[var(--block-px)] py-[var(--section-py-mobile)] sm:px-[var(--block-px-desktop)] sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-lg font-semibold text-[var(--foreground)] sm:text-xl">
          What&apos;s Coming
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--shadow-soft)] sm:p-5"
            >
              <span className="text-2xl sm:text-3xl" aria-hidden>
                {item.icon}
              </span>
              <span className="mt-1.5 text-sm font-medium text-[var(--foreground)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
