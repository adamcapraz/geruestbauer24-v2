-- Fix: Align einstellungen keys with admin component keys
-- The seed SQL used German keys but admin component uses different keys
-- This migration renames old keys and ensures all required keys exist

-- Rename existing keys to match admin component
UPDATE einstellungen SET schluessel = 'site_title' WHERE schluessel = 'site_titel';
UPDATE einstellungen SET schluessel = 'meta_description' WHERE schluessel = 'site_beschreibung';
UPDATE einstellungen SET schluessel = 'google_analytics_id' WHERE schluessel = 'google_analytics_id';
UPDATE einstellungen SET schluessel = 'google_tag_manager_id' WHERE schluessel = 'google_tag_manager_id';
UPDATE einstellungen SET schluessel = 'google_search_console_verification' WHERE schluessel = 'google_search_console';
UPDATE einstellungen SET schluessel = 'bing_webmaster_verification' WHERE schluessel = 'bing_webmaster';
UPDATE einstellungen SET schluessel = 'contact_email' WHERE schluessel = 'kontakt_email';
UPDATE einstellungen SET schluessel = 'contact_phone' WHERE schluessel = 'kontakt_telefon';
UPDATE einstellungen SET schluessel = 'contact_address' WHERE schluessel = 'kontakt_adresse';
UPDATE einstellungen SET schluessel = 'impressum_firmenname' WHERE schluessel = 'impressum_firma';
UPDATE einstellungen SET schluessel = 'impressum_geschaeftsfuehrer' WHERE schluessel = 'impressum_inhaber';
UPDATE einstellungen SET schluessel = 'impressum_registergericht' WHERE schluessel = 'impressum_zustaendiges_gericht';
UPDATE einstellungen SET schluessel = 'impressum_registernummer' WHERE schluessel = 'impressum_handelsregister';
UPDATE einstellungen SET schluessel = 'datenschutz_text' WHERE schluessel = 'datenschutz_text';
UPDATE einstellungen SET schluessel = 'cookie_consent_enabled' WHERE schluessel = 'cookie_banner_aktiv';
UPDATE einstellungen SET schluessel = 'cookie_consent_text' WHERE schluessel = 'cookie_banner_text';
UPDATE einstellungen SET schluessel = 'widerrufsbelehrung_text' WHERE schluessel = 'widerruf_text';
UPDATE einstellungen SET schluessel = 'featured_firma_enabled' WHERE schluessel = 'sponsorlu_firma_aktiv';
UPDATE einstellungen SET schluessel = 'banner_ads_enabled' WHERE schluessel = 'banner_reklam_header';

-- Delete old keys that are no longer needed
DELETE FROM einstellungen WHERE schluessel IN (
  'widerruf_aktiv', 'banner_reklam_sidebar', 'banner_reklam_footer', 'schema_org_name'
);

-- Insert any missing keys that admin component expects
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('site_title', 'Gerüstbauer24 - Gerüstbaufirmen in Deutschland finden', 'Website-Titel für SEO und Browser-Tab'),
  ('meta_description', 'Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen.', 'Meta-Description für Suchmaschinen'),
  ('og_image_url', '', 'URL des Open Graph Bildes für Social Media'),
  ('google_analytics_id', '', 'Google Analytics Measurement ID (z.B. G-XXXXXXXXXX)'),
  ('google_tag_manager_id', '', 'Google Tag Manager Container-ID (z.B. GTM-XXXXXXX)'),
  ('google_search_console_verification', '', 'Google Search Console Verifizierungscode'),
  ('bing_webmaster_verification', '', 'Bing Webmaster Tools Verifizierungscode'),
  ('schema_org_type', 'LocalBusiness', 'Schema.org Typ'),
  ('contact_email', 'info@geruestbauer24.eu', 'Kontakt E-Mail-Adresse'),
  ('contact_phone', '+49 1639540595', 'Kontakt Telefonnummer'),
  ('contact_address', '', 'Geschäftsadresse'),
  ('impressum_firmenname', '', 'Firmenname im Impressum'),
  ('impressum_adresse', '', 'Firmenadresse im Impressum'),
  ('impressum_telefon', '', 'Telefonnummer im Impressum'),
  ('impressum_email', '', 'E-Mail im Impressum'),
  ('impressum_geschaeftsfuehrer', '', 'Geschäftsführer / Inhaber'),
  ('impressum_registergericht', '', 'Registergericht'),
  ('impressum_registernummer', '', 'Registernummer (HRB)'),
  ('impressum_ust_id', '', 'USt-IdNr.'),
  ('datenschutz_text', '', 'Datenschutzerklärung (DSGVO-konform)'),
  ('cookie_consent_enabled', 'false', 'Cookie-Banner aktiviert (true/false)'),
  ('cookie_consent_text', 'Diese Website verwendet Cookies, um Ihnen das beste Erlebnis zu bieten.', 'Cookie-Banner Text'),
  ('widerrufsbelehrung_text', '', 'Widerrufsbelehrung Text'),
  ('google_adsense_id', '', 'Google AdSense Publisher-ID'),
  ('featured_firma_enabled', 'false', 'Gesponserte Firmen aktivieren'),
  ('featured_firma_id', '', 'ID der gesponserten Firma'),
  ('banner_ads_enabled', 'false', 'Banner-Werbung aktivieren')
ON CONFLICT (schluessel) DO NOTHING;
