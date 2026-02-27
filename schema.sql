-- Avacarto Phase 1 schema (Railway Postgres)
-- Run this in Railway Postgres SQL console or via psql.

-- Single row of editable landing page content
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  announcement_text TEXT NOT NULL DEFAULT 'Pre-launch: Join The Avo Club for early access.',
  hero_headline TEXT NOT NULL DEFAULT 'Avocado Is a Lifestyle.',
  hero_subtext TEXT NOT NULL DEFAULT 'Soft tees, good vibes, and the fruit that started it all. Made-to-order. Limited designs.',
  cta_primary_label TEXT NOT NULL DEFAULT 'Join The Avo Club',
  cta_secondary_label TEXT NOT NULL DEFAULT 'View First Drop',
  first_drop_title TEXT NOT NULL DEFAULT 'First Drop – Avocado Tees',
  first_drop_note TEXT NOT NULL DEFAULT 'Made-to-order. Limited designs. Shipping soon.',
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
  'Pre-launch: Join The Avo Club for early access.',
  'Avocado Is a Lifestyle.',
  'Soft tees, good vibes, and the fruit that started it all. Made-to-order. Limited designs.',
  'Join The Avo Club',
  'View First Drop',
  'First Drop – Avocado Tees',
  'Made-to-order. Limited designs. Shipping soon.',
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

-- Future tables (DO NOT RUN YET – for reference only)
-- users: id, phone_number, role, created_at, etc.
-- otp_verifications: for phone OTP flow
-- products, orders, inventory: for full ecommerce
