-- Add custom_head_scripts key if not exists
INSERT INTO einstellungen (schluessel, wert, beschreibung)
VALUES (
  'custom_head_scripts',
  '',
  'Benutzerdefinierter HTML/Script-Code der in den <head>-Bereich eingefügt wird (z.B. AdSense, Tracking-Pixel)'
)
ON CONFLICT (schluessel) DO NOTHING;
