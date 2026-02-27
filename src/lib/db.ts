import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

function getPool(): Pool {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (see .env.example)."
    );
  }
  return new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    pool = getPool();
  }
  return pool;
}

export type SiteSettings = {
  id: number;
  announcement_text: string;
  hero_headline: string;
  hero_subtext: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  first_drop_title: string;
  first_drop_note: string;
  instagram_handle: string;
  contact_email: string;
  updated_at: Date;
};

export type Subscriber = {
  id: number;
  email: string;
  created_at: Date;
};

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, "id" | "updated_at"> = {
  announcement_text: "🥑 PRE-LAUNCH — Join the Avo Club for early access.",
  hero_headline: "Avocado Is a Lifestyle.",
  hero_subtext: "Soft tees. Cute mugs. Limited drops. Good vibes only.",
  cta_primary_label: "Join The Avo Club",
  cta_secondary_label: "See First Drop",
  first_drop_title: "First Drop — Avocado Tees",
  first_drop_note: "Made-to-order. Limited designs. Shipping soon.",
  instagram_handle: "@avacarto",
  contact_email: "hello@avacarto.com",
};
