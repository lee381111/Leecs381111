-- Create radio_stations table
CREATE TABLE IF NOT EXISTS public.radio_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  genre TEXT,
  country TEXT,
  language TEXT,
  favicon TEXT,
  homepage TEXT,
  tags TEXT[],
  bitrate INTEGER,
  codec TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.radio_stations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own radio stations"
  ON public.radio_stations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own radio stations"
  ON public.radio_stations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own radio stations"
  ON public.radio_stations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own radio stations"
  ON public.radio_stations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_radio_stations_user_id ON public.radio_stations(user_id);
CREATE INDEX IF NOT EXISTS idx_radio_stations_is_favorite ON public.radio_stations(user_id, is_favorite);
