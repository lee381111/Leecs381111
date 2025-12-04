-- Create budget_transactions table for household budget management
CREATE TABLE IF NOT EXISTS budget_transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_budget_transactions_user_id ON budget_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_date ON budget_transactions(date);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_type ON budget_transactions(type);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_category ON budget_transactions(category);

-- Enable Row Level Security
ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own budget transactions"
  ON budget_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget transactions"
  ON budget_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget transactions"
  ON budget_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget transactions"
  ON budget_transactions FOR DELETE
  USING (auth.uid() = user_id);
