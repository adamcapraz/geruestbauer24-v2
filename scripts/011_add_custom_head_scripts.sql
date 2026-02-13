-- Add custom_head_scripts setting for injecting scripts into <head> (e.g. Google AdSense)
INSERT INTO einstellungen (schluessel, wert, beschreibung)
VALUES (
  'custom_head_scripts',
  '',
  'Head bölümüne eklenecek özel script kodları (örneğin Google AdSense, Facebook Pixel vb.)'
)
ON CONFLICT (schluessel) DO NOTHING;
