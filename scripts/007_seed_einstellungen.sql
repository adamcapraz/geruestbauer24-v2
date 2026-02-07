-- Seed site settings into einstellungen table
-- Uses ON CONFLICT to avoid duplicates on re-run

-- Temel Site Ayarlari
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('site_titel', 'Gerüstbauer in Deutschland finden', 'Haupt-Seitentitel für SEO und Browser-Tab'),
  ('site_beschreibung', 'Finden Sie die besten Gerüstbauer in Ihrer Nähe. Vergleichen Sie Firmen, lesen Sie Bewertungen und holen Sie kostenlose Angebote ein.', 'Meta-Description für Suchmaschinen'),
  ('og_image_url', '', 'URL des Open Graph Bildes für Social Media Sharing')
ON CONFLICT (schluessel) DO NOTHING;

-- SEO & Analytics
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('google_analytics_id', '', 'Google Analytics Tracking-ID (z.B. G-XXXXXXXXXX)'),
  ('google_tag_manager_id', '', 'Google Tag Manager Container-ID (z.B. GTM-XXXXXXX)'),
  ('google_search_console', '', 'Google Search Console Verifizierungscode'),
  ('bing_webmaster', '', 'Bing Webmaster Tools Verifizierungscode'),
  ('schema_org_name', 'Gerüstbauer24', 'Firmenname für Schema.org LocalBusiness Markup'),
  ('schema_org_type', 'LocalBusiness', 'Schema.org Typ (z.B. LocalBusiness, Organization)')
ON CONFLICT (schluessel) DO NOTHING;

-- Kontakt & Footer
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('kontakt_email', 'info@geruestbauer24.de', 'Hauptkontakt E-Mail-Adresse'),
  ('kontakt_telefon', '', 'Kontakt Telefonnummer'),
  ('kontakt_adresse', '', 'Geschäftsadresse')
ON CONFLICT (schluessel) DO NOTHING;

-- Impressum (Almanya zorunlu)
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('impressum_firma', '', 'Firmenname im Impressum'),
  ('impressum_inhaber', '', 'Geschäftsführer / Inhaber'),
  ('impressum_adresse', '', 'Firmenadresse im Impressum'),
  ('impressum_telefon', '', 'Telefonnummer im Impressum'),
  ('impressum_email', '', 'E-Mail im Impressum'),
  ('impressum_handelsregister', '', 'Handelsregisternummer (z.B. HRB 12345)'),
  ('impressum_ust_id', '', 'Umsatzsteuer-Identifikationsnummer'),
  ('impressum_zustaendiges_gericht', '', 'Zuständiges Amtsgericht')
ON CONFLICT (schluessel) DO NOTHING;

-- Datenschutz / GDPR
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('datenschutz_text', '', 'Datenschutzerklärung (DSGVO-konform)'),
  ('cookie_banner_aktiv', 'true', 'Cookie-Consent-Banner aktivieren (true/false)'),
  ('cookie_banner_text', 'Diese Website verwendet Cookies, um Ihnen das beste Erlebnis zu bieten.', 'Text im Cookie-Banner')
ON CONFLICT (schluessel) DO NOTHING;

-- Widerrufsbelehrung
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('widerruf_aktiv', 'false', 'Widerrufsbelehrung anzeigen (true/false)'),
  ('widerruf_text', '', 'Widerrufsbelehrung Text')
ON CONFLICT (schluessel) DO NOTHING;

-- Reklam & Gelir
INSERT INTO einstellungen (schluessel, wert, beschreibung) VALUES
  ('google_adsense_id', '', 'Google AdSense Publisher-ID (z.B. ca-pub-XXXXXXX)'),
  ('sponsorlu_firma_aktiv', 'false', 'Gesponserte Firmen-Hervorhebung aktivieren (true/false)'),
  ('banner_reklam_header', '', 'HTML/Script-Code für Header-Banner'),
  ('banner_reklam_sidebar', '', 'HTML/Script-Code für Sidebar-Banner'),
  ('banner_reklam_footer', '', 'HTML/Script-Code für Footer-Banner')
ON CONFLICT (schluessel) DO NOTHING;
