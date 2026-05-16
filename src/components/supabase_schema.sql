CREATE TABLE diabetes_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blood_glucose_mmol NUMERIC NOT NULL,
  insulin_units NUMERIC NOT NULL
);

ALTER TABLE diabetes_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON diabetes_logs FOR
SELECT
  USING (TRUE);

CREATE POLICY "Enable insert for authenticated users only" ON diabetes_logs FOR
INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON diabetes_logs FOR
DELETE
  USING (auth.uid() IS NOT NULL); -- Assuming user will own their logs