import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { FirstDrop } from "@/components/FirstDrop";
import { WhatsComing } from "@/components/WhatsComing";
import { SubscribeSection } from "@/components/SubscribeSection";
import { Footer } from "@/components/Footer";
import { getDb, DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/db";

async function getSettings(): Promise<{
  announcement_text: string;
  hero_headline: string;
  hero_subtext: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  first_drop_title: string;
  first_drop_note: string;
  instagram_handle: string;
  contact_email: string;
}> {
  try {
    const db = getDb();
    const result = await db.query<SiteSettings>(
      "SELECT * FROM site_settings LIMIT 1"
    );
    const row = result.rows[0];
    if (!row) return DEFAULT_SITE_SETTINGS;
    return {
      announcement_text: row.announcement_text,
      hero_headline: row.hero_headline,
      hero_subtext: row.hero_subtext,
      cta_primary_label: row.cta_primary_label,
      cta_secondary_label: row.cta_secondary_label,
      first_drop_title: row.first_drop_title,
      first_drop_note: row.first_drop_note,
      instagram_handle: row.instagram_handle,
      contact_email: row.contact_email,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export default async function Home() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar text={settings.announcement_text} />
      <Header />
      <main className="flex-1">
        <Hero
          headline={settings.hero_headline}
          subtext={settings.hero_subtext}
          ctaPrimary={settings.cta_primary_label}
          ctaSecondary={settings.cta_secondary_label}
        />
        <FirstDrop
          title={settings.first_drop_title}
          note={settings.first_drop_note}
        />
        <WhatsComing />
        <AboutSection />
        <SubscribeSection />
      </main>
      <Footer
        instagramHandle={settings.instagram_handle}
        contactEmail={settings.contact_email}
      />
    </div>
  );
}
