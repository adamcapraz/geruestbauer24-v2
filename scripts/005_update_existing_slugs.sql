-- Update existing firmen with missing slugs
-- This script generates URL-friendly slugs for name and stadt fields

-- First, create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    REGEXP_REPLACE(
                      TRIM(input_text),
                      'ä', 'ae', 'g'
                    ),
                    'ö', 'oe', 'g'
                  ),
                  'ü', 'ue', 'g'
                ),
                'ß', 'ss', 'g'
              ),
              'Ä', 'ae', 'g'
            ),
            'Ö', 'oe', 'g'
          ),
          'Ü', 'ue', 'g'
        ),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Update all firmen with missing slugs
UPDATE firmen
SET 
  slug = generate_slug(name),
  stadt_slug = generate_slug(stadt)
WHERE slug IS NULL OR slug = '' OR stadt_slug IS NULL OR stadt_slug = '';

-- Also update any firmen where slug might be set but stadt_slug is not
UPDATE firmen
SET stadt_slug = generate_slug(stadt)
WHERE stadt_slug IS NULL OR stadt_slug = '';
