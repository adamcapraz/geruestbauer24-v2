-- Add public read policy so server-side fetching works with anon key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'einstellungen' AND policyname = 'Allow public read einstellungen'
  ) THEN
    CREATE POLICY "Allow public read einstellungen"
      ON einstellungen FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END
$$;

-- Delete ALL old keys that don't match the admin component
DELETE FROM einstellungen WHERE schluessel NOT IN (
  'site_title',
  'meta_description',
  'og_image_url',
  'google_analytics_id',
  'google_tag_manager_id',
  'google_search_console_verification',
  'bing_webmaster_verification',
  'schema_org_type',
  'contact_email',
  'contact_phone',
  'contact_address',
  'impressum_firmenname',
  'impressum_adresse',
  'impressum_telefon',
  'impressum_email',
  'impressum_geschaeftsfuehrer',
  'impressum_registergericht',
  'impressum_registernummer',
  'impressum_ust_id',
  'datenschutz_text',
  'cookie_consent_enabled',
  'cookie_consent_text',
  'widerrufsbelehrung_text',
  'google_adsense_id',
  'featured_firma_enabled',
  'featured_firma_id',
  'banner_ads_enabled'
);

-- Insert all keys matching admin component (skip if already exists)
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('site_title', 'Gerüstbauer24 - Gerüstbaufirmen in Deutschland finden', 'Titel der Website'),
  ('meta_description', 'Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen.', 'Meta-Beschreibung für Suchmaschinen'),
  ('og_image_url', '', 'Open Graph Bild-URL für Social Media'),
  ('google_analytics_id', '', 'Google Analytics Measurement ID (z.B. G-XXXXXXXXXX)'),
  ('google_tag_manager_id', '', 'Google Tag Manager Container ID (z.B. GTM-XXXXXXX)'),
  ('google_search_console_verification', '', 'Google Search Console Verifizierungscode'),
  ('bing_webmaster_verification', '', 'Bing Webmaster Verifizierungscode'),
  ('schema_org_type', 'LocalBusiness', 'Schema.org Typ für strukturierte Daten'),
  ('contact_email', 'info@geruestbauer24.eu', 'Kontakt E-Mail-Adresse'),
  ('contact_phone', '+49 1639540595', 'Kontakt Telefonnummer'),
  ('contact_address', '', 'Kontakt Adresse'),
  ('impressum_firmenname', '', 'Firmenname im Impressum'),
  ('impressum_adresse', '', 'Firmenadresse im Impressum'),
  ('impressum_telefon', '', 'Telefonnummer im Impressum'),
  ('impressum_email', '', 'E-Mail im Impressum'),
  ('impressum_geschaeftsfuehrer', '', 'Geschäftsführer'),
  ('impressum_registergericht', '', 'Registergericht'),
  ('impressum_registernummer', '', 'Registernummer (HRB)'),
  ('impressum_ust_id', '', 'USt-IdNr.'),
  ('datenschutz_text', '', 'Zusätzlicher Datenschutztext'),
  ('cookie_consent_enabled', 'false', 'Cookie-Banner aktivieren'),
  ('cookie_consent_text', '', 'Cookie-Banner Text'),
  ('widerrufsbelehrung_text', '', 'Widerrufsbelehrung Text'),
  ('google_adsense_id', '', 'Google AdSense Publisher ID'),
  ('featured_firma_enabled', 'false', 'Gesponserte Firmen aktivieren'),
  ('featured_firma_id', '', 'Gesponserte Firma UUID'),
  ('banner_ads_enabled', 'false', 'Banner-Werbung aktivieren')
ON CONFLICT (schluessel) DO NOTHING;
