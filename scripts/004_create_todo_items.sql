-- Create todo_items table for to-do list functionality
CREATE TABLE IF NOT EXISTS todo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  repeat_type TEXT CHECK (repeat_type IN ('none', 'daily', 'weekly', 'monthly')) DEFAULT 'none',
  alarm_enabled BOOLEAN DEFAULT FALSE,
  alarm_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY todo_items_select_own ON todo_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY todo_items_insert_own ON todo_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY todo_items_update_own ON todo_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY todo_items_delete_own ON todo_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_todo_items_user_id ON todo_items(user_id);
CREATE INDEX idx_todo_items_due_date ON todo_items(due_date);
CREATE INDEX idx_todo_items_completed ON todo_items(completed);
