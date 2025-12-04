-- Add alarm_enabled column to medications table
ALTER TABLE medications
ADD COLUMN IF NOT EXISTS alarm_enabled BOOLEAN DEFAULT false;

-- Update existing medications to have alarm_enabled = true if they have a valid time set
UPDATE medications
SET alarm_enabled = true
WHERE time IS NOT NULL;
