-- Run this in your Supabase SQL Editor

-- 1. Retailer locations table
CREATE TABLE IF NOT EXISTS retailer_locations (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id         UUID        NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  nickname            TEXT        NOT NULL DEFAULT '',
  shipping_address    TEXT        NOT NULL DEFAULT '',
  license_number      TEXT        NOT NULL DEFAULT '',
  license_expiry_date DATE,
  license_photo_url   TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_retailer_locations_retailer_id
  ON retailer_locations(retailer_id);

-- 2. Storage bucket for license photos (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'retailer-licenses',
  'retailer-licenses',
  true,
  10485760,  -- 10 MB max
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS: authenticated users can upload to their own folder
CREATE POLICY IF NOT EXISTS "Authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'retailer-licenses');

CREATE POLICY IF NOT EXISTS "Public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'retailer-licenses');

CREATE POLICY IF NOT EXISTS "Authenticated delete own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'retailer-licenses');
