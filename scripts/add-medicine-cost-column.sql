-- Add medicine_cost column to health_records table
ALTER TABLE health_records
ADD COLUMN IF NOT EXISTS medicine_cost NUMERIC;

-- Add comment to explain the column
COMMENT ON COLUMN health_records.medicine_cost IS '약값 (Medicine cost)';
