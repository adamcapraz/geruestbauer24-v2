-- Add slug fields for SEO-friendly URLs
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS stadt_slug TEXT;

-- Create unique index on slug for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS firmen_slug_idx ON firmen(slug) WHERE slug IS NOT NULL;

-- Create index on stadt_slug for city-based queries
CREATE INDEX IF NOT EXISTS firmen_stadt_slug_idx ON firmen(stadt_slug);
