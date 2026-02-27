type Props = {
  instagramHandle: string;
  contactEmail: string;
};

export function Footer({ instagramHandle, contactEmail }: Props) {
  const instagramUrl = instagramHandle.startsWith("http")
    ? instagramHandle
    : `https://instagram.com/${instagramHandle.replace(/^@/, "")}`;

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card-bg)] px-[var(--block-px)] py-6 sm:px-[var(--block-px-desktop)] sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--avo-green-light)] text-[var(--avo-green)] font-bold text-xs">
              A
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              Avacarto
            </span>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            <span className="mr-1" aria-hidden>🥑</span>
            Avocado Is a Lifestyle.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-muted)] transition hover:text-[var(--foreground)] focus:outline-none focus:text-[var(--foreground)]"
            >
              {instagramHandle}
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[var(--foreground-muted)] transition hover:text-[var(--foreground)] focus:outline-none focus:text-[var(--foreground)]"
            >
              {contactEmail}
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-[var(--foreground-soft)] sm:mt-6">
          © {new Date().getFullYear()} Avacarto. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
