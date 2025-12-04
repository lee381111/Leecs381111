-- Add expense column to travel_records table for storing travel costs
ALTER TABLE travel_records
ADD COLUMN IF NOT EXISTS expense NUMERIC;

-- Add comment to explain the column
COMMENT ON COLUMN travel_records.expense IS 'Travel expense amount that auto-syncs to budget transactions';
