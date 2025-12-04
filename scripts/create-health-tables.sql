-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  blood_sugar DECIMAL(5,1),
  pulse INTEGER,
  weight DECIMAL(5,1),
  temperature DECIMAL(4,1),
  notes TEXT,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,
  time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(date);
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_start_date ON medications(start_date);

-- Enable Row Level Security
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Create policies for health_records
CREATE POLICY "Users can view their own health records or public records"
  ON health_records FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own health records"
  ON health_records FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own health records"
  ON health_records FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own health records"
  ON health_records FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for medications
CREATE POLICY "Users can view their own medications or public medications"
  ON medications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own medications"
  ON medications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own medications"
  ON medications FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own medications"
  ON medications FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);
