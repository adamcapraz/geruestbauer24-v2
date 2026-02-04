-- Add Google Places API fields to firmen table
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_bewertung DECIMAL(2,1);
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_anzahl_bewertungen INTEGER DEFAULT 0;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_telefon TEXT;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_webseite TEXT;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_adresse TEXT;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_oeffnungszeiten JSONB;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_fotos JSONB;
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS google_letzte_aktualisierung TIMESTAMPTZ;
