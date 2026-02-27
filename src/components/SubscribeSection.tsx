"use client";

import { useState } from "react";

export function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="join"
      className="relative border-t border-[var(--card-border)] bg-[var(--avo-green-pale)]/50 px-[var(--block-px)] py-[var(--section-py-mobile)] sm:px-[var(--block-px-desktop)] sm:py-12"
    >
      <div className="relative mx-auto max-w-md">
        <div className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-medium)] sm:p-8">
          <h2 className="text-center text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
            Join The Avo Club
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--foreground-muted)]">
            Get early access + a launch-day discount.
          </p>

          {status === "success" ? (
            <div className="mt-6 rounded-[var(--radius-sm)] bg-[var(--avo-green-pale)] py-4 px-4 text-center text-sm font-medium text-[var(--avo-green)]">
              You&apos;re in. We&apos;ll only email for drops & launch.
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === "loading"}
                  className="min-h-12 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--background)] px-4 text-[var(--foreground)] placeholder:text-[var(--foreground-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--avo-green)] focus:ring-offset-2 disabled:opacity-70"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="min-h-12 rounded-[var(--radius)] bg-[var(--avo-green)] font-medium text-white shadow-[var(--shadow-button)] transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--avo-green)] focus:ring-offset-2 disabled:opacity-70"
                >
                  {status === "loading" ? "Joining…" : "Get Early Access"}
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-[var(--foreground-soft)]">
                We&apos;ll only email for drops & launch.
              </p>
            </>
          )}

          {status === "error" && message && (
            <p className="mt-3 text-center text-sm text-red-600" role="alert">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
