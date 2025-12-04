-- Add category and attachments columns to schedules table
ALTER TABLE schedules 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '일정',
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
