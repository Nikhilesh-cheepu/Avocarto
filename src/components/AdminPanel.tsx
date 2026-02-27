"use client";

import { useState, useEffect } from "react";

type SiteSettings = {
  announcement_text: string;
  hero_headline: string;
  hero_subtext: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  first_drop_title: string;
  first_drop_note: string;
  instagram_handle: string;
  contact_email: string;
};

type Subscriber = { id: number; email: string; created_at: string };

const FIELDS: { key: keyof SiteSettings; label: string; multiline?: boolean }[] = [
  { key: "announcement_text", label: "Announcement bar text" },
  { key: "hero_headline", label: "Hero headline" },
  { key: "hero_subtext", label: "Hero subtext", multiline: true },
  { key: "cta_primary_label", label: "Primary CTA label" },
  { key: "cta_secondary_label", label: "Secondary CTA label" },
  { key: "first_drop_title", label: "First Drop title" },
  { key: "first_drop_note", label: "First Drop note" },
  { key: "instagram_handle", label: "Instagram handle" },
  { key: "contact_email", label: "Contact email" },
];

const DEFAULT_SETTINGS: SiteSettings = {
  announcement_text: "",
  hero_headline: "",
  hero_subtext: "",
  cta_primary_label: "",
  cta_secondary_label: "",
  first_drop_title: "",
  first_drop_note: "",
  instagram_handle: "",
  contact_email: "",
};

export function AdminPanel() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          announcement_text: data.announcement_text ?? "",
          hero_headline: data.hero_headline ?? "",
          hero_subtext: data.hero_subtext ?? "",
          cta_primary_label: data.cta_primary_label ?? "",
          cta_secondary_label: data.cta_secondary_label ?? "",
          first_drop_title: data.first_drop_title ?? "",
          first_drop_note: data.first_drop_note ?? "",
          instagram_handle: data.instagram_handle ?? "",
          contact_email: data.contact_email ?? "",
        });
      })
      .catch(() => setSaveMessage("error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((r) => r.json())
      .then(setSubscribers)
      .catch(() => {})
      .finally(() => setSubsLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) setSaveMessage("success");
      else setSaveMessage("error");
    } catch {
      setSaveMessage("error");
    } finally {
      setSaving(false);
    }
  }

  function handleExport() {
    window.open("/api/subscribers/export", "_blank");
  }

  if (loading) {
    return (
      <div className="text-stone-500 text-sm">Loading settings…</div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-base font-medium text-stone-800 mb-4">
          Landing page content
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          {FIELDS.map(({ key, label, multiline }) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                {label}
              </label>
              {multiline ? (
                <textarea
                  id={key}
                  value={settings[key]}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[var(--avo-green)] focus:border-transparent"
                />
              ) : (
                <input
                  id={key}
                  type="text"
                  value={settings[key]}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[var(--avo-green)] focus:border-transparent"
                />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--avo-green)] text-white font-medium px-4 py-2 text-sm transition hover:opacity-90 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--avo-green)] focus:ring-offset-2"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saveMessage === "success" && (
              <span className="text-sm text-green-600">Saved.</span>
            )}
            {saveMessage === "error" && (
              <span className="text-sm text-red-600">Save failed.</span>
            )}
          </div>
        </form>
      </section>

      <section className="border-t border-stone-200 pt-10">
        <h2 className="text-base font-medium text-stone-800 mb-4">
          Subscribers
        </h2>
        {subsLoading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : (
          <>
            <p className="text-sm text-stone-600 mb-3">
              {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 mb-4"
            >
              Export CSV
            </button>
            <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
              <ul className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                {subscribers.length === 0 ? (
                  <li className="px-4 py-6 text-sm text-stone-500 text-center">
                    No subscribers yet.
                  </li>
                ) : (
                  subscribers.map((s) => (
                    <li
                      key={s.id}
                      className="px-4 py-2.5 flex justify-between items-center text-sm"
                    >
                      <span className="text-stone-800">{s.email}</span>
                      <span className="text-stone-400 text-xs">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
