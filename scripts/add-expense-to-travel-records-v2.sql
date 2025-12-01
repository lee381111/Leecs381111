-- Version 2: Add expense column to travel_records table
-- Run this script to enable travel expense tracking

DO $$ 
BEGIN
  -- Check if column already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'travel_records' 
    AND column_name = 'expense'
  ) THEN
    -- Add the column
    ALTER TABLE travel_records ADD COLUMN expense NUMERIC;
    
    -- Add comment
    COMMENT ON COLUMN travel_records.expense IS 'Travel expense amount that auto-syncs to budget transactions';
    
    RAISE NOTICE 'Successfully added expense column to travel_records';
  ELSE
    RAISE NOTICE 'Column expense already exists in travel_records';
  END IF;
END $$;
