import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  getDb,
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type Product,
} from "@/lib/db";
import { Storefront } from "@/components/shop/Storefront";

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
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar text={settings.announcement_text} />
      <Header />
      <main className="flex-1">
        <Storefront products={products} />
      </main>
      <Footer
        instagramHandle={settings.instagram_handle}
        contactEmail={settings.contact_email}
      />
    </div>
  );
}

async function getProducts(): Promise<Product[]> {
  try {
    const db = getDb();
    const result = await db.query<Product>(
      `SELECT
        p.id, p.category_id, c.slug AS category_slug, c.name AS category_name,
        p.name, p.description, p.price_inr, p.image_url, p.available_sizes, p.is_active, p.created_at
      FROM products p
      JOIN product_categories c ON c.id = p.category_id
      WHERE p.is_active = true
      ORDER BY c.sort_order, p.created_at DESC`
    );
    return result.rows;
  } catch {
    return [];
  }
}
