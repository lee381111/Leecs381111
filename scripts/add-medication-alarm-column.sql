-- Add alarm_enabled column to medications table
ALTER TABLE medications
ADD COLUMN IF NOT EXISTS alarm_enabled BOOLEAN DEFAULT false;

-- Removed time != '' condition as PostgreSQL TIME type cannot be compared to empty strings
-- Update existing medications to have alarm_enabled = true if they have a time set
UPDATE medications
SET alarm_enabled = true
WHERE time IS NOT NULL;
