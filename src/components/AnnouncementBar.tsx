type Props = { text: string };

export function AnnouncementBar({ text }: Props) {
  const displayText = text.trim() || "🥑 PRE-LAUNCH — Join the Avo Club for early access.";
  return (
    <div className="sticky top-0 z-[60] flex items-center justify-between gap-3 bg-[var(--avo-green)] text-white px-[var(--block-px)] py-2 text-xs sm:text-sm font-medium">
      <span className="truncate">{displayText}</span>
      <a
        href="#join"
        className="shrink-0 rounded-[var(--radius-pill)] bg-white/20 px-3 py-1.5 font-medium backdrop-blur-sm transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        Join
      </a>
    </div>
  );
}
