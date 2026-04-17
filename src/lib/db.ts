import { Pool } from "pg";

function getConnectionString(): string | undefined {
  const privateUrl = process.env.DATABASE_URL;
  const publicUrl = process.env.DATABASE_PUBLIC_URL;

  // Local development cannot resolve Railway private hostnames like *.railway.internal
  if (process.env.NODE_ENV !== "production" && publicUrl) {
    return publicUrl;
  }

  return privateUrl || publicUrl;
}

function getPool(): Pool {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error(
      "Database URL is not set. Configure DATABASE_URL and/or DATABASE_PUBLIC_URL."
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

export type ProductCategory = {
  id: number;
  slug: string;
  name: string;
  sort_order: number;
};

export type Product = {
  id: number;
  category_id: number;
  category_slug: string;
  category_name: string;
  name: string;
  description: string;
  price_inr: number;
  image_url: string | null;
  available_sizes: string[];
  is_active: boolean;
  created_at: Date;
};

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, "id" | "updated_at"> = {
  announcement_text: "🥑 New drops are live now.",
  hero_headline: "Avocado Is a Lifestyle.",
  hero_subtext: "Soft tees. Cute mugs. Premium quality. Good vibes only.",
  cta_primary_label: "Shop Now",
  cta_secondary_label: "Browse Collection",
  first_drop_title: "First Drop — Avocado Tees",
  first_drop_note: "Made-to-order. Limited designs.",
  instagram_handle: "@avacarto",
  contact_email: "hello@avacarto.com",
};

export const PRODUCT_CATEGORY_SLUGS = {
  tshirtPrints: "tshirt-prints",
  cuteToysStuff: "cute-toys-stuff",
} as const;

export function formatInr(priceInr: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInr);
}
