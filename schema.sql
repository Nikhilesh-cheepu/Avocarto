-- Avacarto Phase 1 schema (Railway Postgres)
-- Run this in Railway Postgres SQL console or via psql.

-- Single row of editable landing page content
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  announcement_text TEXT NOT NULL DEFAULT 'New drops are live now.',
  hero_headline TEXT NOT NULL DEFAULT 'Avocado Is a Lifestyle.',
  hero_subtext TEXT NOT NULL DEFAULT 'Soft tees. Cute mugs. Premium quality. Good vibes only.',
  cta_primary_label TEXT NOT NULL DEFAULT 'Shop Now',
  cta_secondary_label TEXT NOT NULL DEFAULT 'Browse Collection',
  first_drop_title TEXT NOT NULL DEFAULT 'First Drop – Avocado Tees',
  first_drop_note TEXT NOT NULL DEFAULT 'Made-to-order. Limited designs.',
  instagram_handle TEXT NOT NULL DEFAULT '@avacarto',
  contact_email TEXT NOT NULL DEFAULT 'hello@avacarto.com',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure exactly one row
INSERT INTO site_settings (
  announcement_text, hero_headline, hero_subtext,
  cta_primary_label, cta_secondary_label,
  first_drop_title, first_drop_note,
  instagram_handle, contact_email
) SELECT
  'New drops are live now.',
  'Avocado Is a Lifestyle.',
  'Soft tees. Cute mugs. Premium quality. Good vibes only.',
  'Shop Now',
  'Browse Collection',
  'First Drop – Avocado Tees',
  'Made-to-order. Limited designs.',
  '@avacarto',
  'hello@avacarto.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Email subscribers (pre-launch signups)
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at DESC);

-- Ecommerce categories
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO product_categories (slug, name, sort_order)
VALUES
  ('tshirt-prints', 'T-Shirt Prints', 1),
  ('cute-toys-stuff', 'Cute Toys & Stuff', 2)
ON CONFLICT (slug) DO NOTHING;

-- Ecommerce products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_inr INTEGER NOT NULL CHECK (price_inr >= 0),
  image_url TEXT,
  available_sizes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products
ADD COLUMN IF NOT EXISTS available_sizes TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (is_active);

-- Optional starter products
INSERT INTO products (category_id, name, description, price_inr, image_url, is_active)
SELECT c.id, 'Avocado Classic Tee', 'Soft cotton print tee.', 799, '', true
FROM product_categories c
WHERE c.slug = 'tshirt-prints'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Avocado Classic Tee');

INSERT INTO products (category_id, name, description, price_inr, image_url, is_active)
SELECT c.id, 'Avo Plush Mini', 'Cute desk plush toy.', 599, '', true
FROM product_categories c
WHERE c.slug = 'cute-toys-stuff'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Avo Plush Mini');

-- Future add-ons:
-- users: id, phone_number, role, created_at, etc.
-- otp_verifications: for phone OTP flow
-- orders, inventory: for full ecommerce expansion
