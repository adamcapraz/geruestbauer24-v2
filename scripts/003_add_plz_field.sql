-- Add PLZ (postal code) field to firmen table
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS plz text;
