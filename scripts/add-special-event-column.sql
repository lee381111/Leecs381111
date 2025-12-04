-- Add isSpecialEvent column to schedules table
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS is_special_event BOOLEAN DEFAULT FALSE;

-- Update existing records to mark them as regular events
UPDATE schedules SET is_special_event = FALSE WHERE is_special_event IS NULL;
