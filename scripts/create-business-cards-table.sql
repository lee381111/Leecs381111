-- Create business_cards table for storing business card information
CREATE TABLE IF NOT EXISTS business_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  image_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_business_cards_created_at ON business_cards(created_at DESC);

-- Enable RLS
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own business cards"
  ON business_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business cards"
  ON business_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business cards"
  ON business_cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business cards"
  ON business_cards FOR DELETE
  USING (auth.uid() = user_id);
