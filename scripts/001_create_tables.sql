-- Firmen (Companies) table
CREATE TABLE IF NOT EXISTS public.firmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  beschreibung TEXT,
  stadt TEXT NOT NULL,
  bundesland TEXT NOT NULL,
  adresse TEXT,
  telefon TEXT,
  email TEXT,
  webseite TEXT,
  bewertung DECIMAL(2,1) DEFAULT 0,
  anzahl_bewertungen INTEGER DEFAULT 0,
  geprueft BOOLEAN DEFAULT false,
  aktiv BOOLEAN DEFAULT true,
  leistungen TEXT[] DEFAULT '{}',
  gruendungsjahr INTEGER,
  mitarbeiter TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table
CREATE TABLE IF NOT EXISTS public.faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frage TEXT NOT NULL,
  antwort TEXT NOT NULL,
  kategorie TEXT NOT NULL,
  sortierung INTEGER DEFAULT 0,
  aktiv BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.kontakt_nachrichten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT,
  betreff TEXT NOT NULL,
  nachricht TEXT NOT NULL,
  gelesen BOOLEAN DEFAULT false,
  beantwortet BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anfragen (Inquiries) table
CREATE TABLE IF NOT EXISTS public.anfragen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firma_id UUID REFERENCES public.firmen(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT,
  projektbeschreibung TEXT NOT NULL,
  adresse TEXT,
  wunschtermin TEXT,
  status TEXT DEFAULT 'neu',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS public.einstellungen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schluessel TEXT UNIQUE NOT NULL,
  wert TEXT,
  beschreibung TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.firmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kontakt_nachrichten ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anfragen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.einstellungen ENABLE ROW LEVEL SECURITY;

-- Public read policies for firmen and faq (everyone can read active items)
CREATE POLICY "Allow public read for active firmen" ON public.firmen
  FOR SELECT USING (aktiv = true);

CREATE POLICY "Allow public read for active faq" ON public.faq
  FOR SELECT USING (aktiv = true);

-- Admin policies (admins can do everything)
-- Using service role for admin operations instead of RLS
CREATE POLICY "Allow service role full access to firmen" ON public.firmen
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to faq" ON public.faq
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to kontakt_nachrichten" ON public.kontakt_nachrichten
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to anfragen" ON public.anfragen
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to einstellungen" ON public.einstellungen
  FOR ALL USING (true) WITH CHECK (true);

-- Public insert policy for contact messages
CREATE POLICY "Allow public insert kontakt_nachrichten" ON public.kontakt_nachrichten
  FOR INSERT WITH CHECK (true);

-- Public insert policy for anfragen
CREATE POLICY "Allow public insert anfragen" ON public.anfragen
  FOR INSERT WITH CHECK (true);

-- Insert default settings
INSERT INTO public.einstellungen (schluessel, wert, beschreibung) VALUES
  ('site_name', 'Gerüstbauer24', 'Name der Website'),
  ('site_description', 'Finden Sie zuverlässige Gerüstbauer in Ihrer Region', 'Beschreibung der Website'),
  ('contact_email', 'info@geruestbauer24.de', 'Kontakt E-Mail'),
  ('contact_phone', '+49 123 456789', 'Kontakt Telefon')
ON CONFLICT (schluessel) DO NOTHING;

-- Insert sample firmen data
INSERT INTO public.firmen (name, beschreibung, stadt, bundesland, telefon, email, bewertung, anzahl_bewertungen, geprueft, leistungen, gruendungsjahr, mitarbeiter) VALUES
  ('Müller Gerüstbau GmbH', 'Professioneller Gerüstbau seit 1985. Wir bieten umfassende Gerüstbaulösungen für Bauprojekte jeder Größe.', 'Berlin', 'Berlin', '+49 30 1234567', 'info@mueller-geruestbau.de', 4.8, 127, true, ARRAY['Fassadengerüst', 'Industriegerüst', 'Eventgerüst', 'Treppentürme'], 1985, '25-50'),
  ('Schmidt & Söhne Gerüstbau', 'Familienunternehmen mit über 40 Jahren Erfahrung im Gerüstbau. Qualität und Sicherheit sind unsere Priorität.', 'München', 'Bayern', '+49 89 9876543', 'kontakt@schmidt-geruestbau.de', 4.9, 89, true, ARRAY['Fassadengerüst', 'Rollgerüst', 'Hängegerüst'], 1982, '10-25'),
  ('Berliner Gerüstbau AG', 'Ihr Partner für Gerüstbau in der Hauptstadt. Modern, zuverlässig und termingerecht.', 'Berlin', 'Berlin', '+49 30 5555555', 'info@berliner-geruestbau.de', 4.6, 203, true, ARRAY['Fassadengerüst', 'Industriegerüst', 'Spezialgerüst'], 1995, '50-100'),
  ('Hamburg Gerüst Service', 'Schnell, flexibel und kompetent - Gerüstbau für Hamburg und Umgebung.', 'Hamburg', 'Hamburg', '+49 40 1112233', 'service@hamburg-geruest.de', 4.7, 156, true, ARRAY['Fassadengerüst', 'Rollgerüst', 'Eventgerüst'], 2001, '25-50'),
  ('Rhein-Main Gerüstbau', 'Professioneller Gerüstbau im Rhein-Main-Gebiet. Von der Planung bis zur Demontage.', 'Frankfurt', 'Hessen', '+49 69 4445566', 'info@rhein-main-geruestbau.de', 4.5, 78, false, ARRAY['Fassadengerüst', 'Industriegerüst'], 2010, '10-25')
ON CONFLICT DO NOTHING;

-- Insert sample FAQ data
INSERT INTO public.faq (frage, antwort, kategorie, sortierung) VALUES
  ('Was kostet ein Gerüst?', 'Die Kosten für ein Gerüst hängen von verschiedenen Faktoren ab: Größe, Höhe, Standzeit und Art des Gerüsts. Im Durchschnitt können Sie mit 8-15 Euro pro Quadratmeter Gerüstfläche pro Monat rechnen.', 'Allgemeine Fragen', 1),
  ('Wie lange dauert der Aufbau?', 'Der Aufbau eines Standard-Fassadengerüsts dauert in der Regel 1-2 Tage, abhängig von der Größe des Gebäudes und den örtlichen Gegebenheiten.', 'Allgemeine Fragen', 2),
  ('Brauche ich eine Genehmigung?', 'Für Gerüste auf öffentlichem Grund (Gehweg, Straße) benötigen Sie eine Sondernutzungserlaubnis. Auf privatem Grund ist in der Regel keine Genehmigung erforderlich.', 'Allgemeine Fragen', 3),
  ('Wie finde ich einen guten Gerüstbauer?', 'Achten Sie auf Zertifizierungen, Versicherungsschutz und Bewertungen. Auf Gerüstbauer24 finden Sie nur geprüfte Unternehmen mit echten Kundenbewertungen.', 'Für Kunden', 4),
  ('Wie kann ich meine Firma eintragen?', 'Registrieren Sie sich auf unserer Plattform und füllen Sie das Firmenprofil aus. Nach einer Prüfung wird Ihr Unternehmen freigeschaltet.', 'Für Unternehmen', 5)
ON CONFLICT DO NOTHING;
