-- Create medication_logs table to track when medications are taken
CREATE TABLE IF NOT EXISTS medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_user_id ON medication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_taken_at ON medication_logs(taken_at);
