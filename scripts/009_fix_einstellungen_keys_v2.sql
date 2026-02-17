-- First delete old German-named keys that may exist
DELETE FROM einstellungen WHERE schluessel IN (
  'site_titel',
  'kontakt_email',
  'kontakt_telefon',
  'kontakt_adresse',
  'impressum_firma',
  'impressum_inhaber',
  'impressum_adresse',
  'impressum_ust_id',
  'impressum_registergericht',
  'impressum_registernummer',
  'datenschutz_text',
  'werbung_aktiv',
  'adsense_publisher_id',
  'adsense_slot_id'
);

-- Now upsert all correct keys used by admin component
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('site_title', 'Gerüstbauer24 - Gerüstbaufirmen in Deutschland finden', 'Titel der Website'),
  ('site_description', 'Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen.', 'Kurzbeschreibung der Website'),
  ('meta_description', 'Finden Sie zuverlässige Gerüstbauer in Ihrer Region.', 'Meta-Beschreibung für Suchmaschinen'),
  ('og_image_url', '', 'Open Graph Bild-URL'),
  ('google_analytics_id', '', 'Google Analytics Tracking-ID'),
  ('google_tag_manager_id', '', 'Google Tag Manager Container-ID'),
  ('google_search_console_code', '', 'Google Search Console Verifizierungscode'),
  ('contact_email', 'info@geruestbauer24.de', 'Kontakt E-Mail-Adresse'),
  ('contact_phone', '', 'Kontakt Telefonnummer'),
  ('contact_address', '', 'Kontakt Adresse'),
  ('footer_text', '© 2025 Gerüstbauer24. Alle Rechte vorbehalten.', 'Footer-Text'),
  ('impressum_firmenname', 'Gerüstbauer24', 'Firmenname im Impressum'),
  ('impressum_geschaeftsfuehrer', '', 'Geschäftsführer/Inhaber'),
  ('impressum_strasse', '', 'Straße und Hausnummer'),
  ('impressum_plz_ort', '', 'PLZ und Ort'),
  ('impressum_telefon', '', 'Telefonnummer im Impressum'),
  ('impressum_email', '', 'E-Mail im Impressum'),
  ('impressum_ust_idnr', '', 'USt-IdNr.'),
  ('impressum_handelsregister', '', 'Handelsregister und Registernummer'),
  ('datenschutz_verantwortlicher', '', 'Verantwortlicher für Datenschutz'),
  ('datenschutz_email', '', 'Datenschutz-Kontakt E-Mail'),
  ('cookie_hinweis_aktiv', 'true', 'Cookie-Hinweis aktivieren'),
  ('ads_enabled', 'false', 'Werbung aktivieren'),
  ('adsense_client_id', '', 'Google AdSense Publisher-ID'),
  ('adsense_slot_header', '', 'AdSense Slot-ID für Header'),
  ('adsense_slot_sidebar', '', 'AdSense Slot-ID für Sidebar'),
  ('adsense_slot_content', '', 'AdSense Slot-ID für Content')
ON CONFLICT (schluessel) DO NOTHING;
