-- Add owner_id field to firmen table to link firms to authenticated users
ALTER TABLE firmen ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_firmen_owner_id ON firmen(owner_id);

-- Add RLS policy so owners can update their own firms
CREATE POLICY "Allow owners to update own firma"
  ON firmen
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow owners to read their own firma even if not active
CREATE POLICY "Allow owners to read own firma"
  ON firmen
  FOR SELECT
  USING (auth.uid() = owner_id OR (aktiv = true));

-- Allow authenticated users to insert their own firma
CREATE POLICY "Allow authenticated users to insert firma"
  ON firmen
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
