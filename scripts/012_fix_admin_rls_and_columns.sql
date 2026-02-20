-- Fix FAQ: code uses 'reihenfolge' but column is 'sortierung'
-- Add 'reihenfolge' as an alias column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'faq' AND column_name = 'reihenfolge'
  ) THEN
    ALTER TABLE public.faq ADD COLUMN reihenfolge integer DEFAULT 0;
    -- Copy existing sortierung values
    UPDATE public.faq SET reihenfolge = sortierung WHERE sortierung IS NOT NULL;
  END IF;
END
$$;

-- Fix Anfragen: add missing columns that admin panel expects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'anfragen' AND column_name = 'nachricht'
  ) THEN
    ALTER TABLE public.anfragen ADD COLUMN nachricht text DEFAULT '';
    -- Copy existing projektbeschreibung values
    UPDATE public.anfragen SET nachricht = projektbeschreibung WHERE projektbeschreibung IS NOT NULL;
  END IF;
END
$$;

-- Add admin RLS policies for authenticated admin users
-- FAQ: Allow admin (authenticated) to read ALL faqs (not just active ones)
CREATE POLICY "Allow admin full read faq" ON public.faq
  FOR SELECT TO authenticated
  USING (true);

-- FAQ: Allow admin to insert
CREATE POLICY "Allow admin insert faq" ON public.faq
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- FAQ: Allow admin to update
CREATE POLICY "Allow admin update faq" ON public.faq
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- FAQ: Allow admin to delete
CREATE POLICY "Allow admin delete faq" ON public.faq
  FOR DELETE TO authenticated
  USING (true);

-- Kontakt Nachrichten: Allow admin (authenticated) to read
CREATE POLICY "Allow admin read kontakt_nachrichten" ON public.kontakt_nachrichten
  FOR SELECT TO authenticated
  USING (true);

-- Kontakt Nachrichten: Allow admin to update (mark as read/answered)
CREATE POLICY "Allow admin update kontakt_nachrichten" ON public.kontakt_nachrichten
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anfragen: Allow admin (authenticated) to read all
CREATE POLICY "Allow admin read anfragen" ON public.anfragen
  FOR SELECT TO authenticated
  USING (true);

-- Anfragen: Allow admin to update (change status)
CREATE POLICY "Allow admin update anfragen" ON public.anfragen
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Firmen: Allow admin (authenticated) to delete
CREATE POLICY "Allow admin delete firmen" ON public.firmen
  FOR DELETE TO authenticated
  USING (true);
