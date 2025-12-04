-- Create premium users table to track payment status
CREATE TABLE IF NOT EXISTS premium_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_premium BOOLEAN DEFAULT FALSE,
  payment_id TEXT,
  payment_amount NUMERIC,
  payment_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_premium_users_user_id ON premium_users(user_id);
