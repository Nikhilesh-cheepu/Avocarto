type Props = { text: string };

export function AnnouncementBar({ text }: Props) {
  const displayText = text.trim() || "🥑 New drops are live now.";
  return (
    <div className="sticky top-0 z-[60] bg-[var(--avo-green)] px-[var(--block-px)] py-2 text-center text-xs font-medium text-white sm:text-sm">
      <span className="truncate">{displayText}</span>
    </div>
  );
}
