-- Add variants column to menu_products
-- Run this once in your Supabase SQL Editor
-- Each variant: { "size": "3.5g", "sku": "GOV-SKU-001", "price": 12.59 }

ALTER TABLE menu_products
  ADD COLUMN IF NOT EXISTS variants JSONB NOT NULL DEFAULT '[]'::jsonb;
