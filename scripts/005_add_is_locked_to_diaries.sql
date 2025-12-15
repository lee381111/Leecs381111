-- Add is_locked column to diaries table
ALTER TABLE public.diaries 
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
