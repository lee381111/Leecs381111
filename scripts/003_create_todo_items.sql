-- Create todo_items table for To-Do List section
CREATE TABLE IF NOT EXISTS public.todo_items (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  repeat_type TEXT DEFAULT 'none' CHECK (repeat_type IN ('none', 'daily', 'weekly', 'monthly')),
  alarm_enabled BOOLEAN DEFAULT FALSE,
  alarm_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.todo_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for todo_items
CREATE POLICY "todo_items_select_own" ON public.todo_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "todo_items_insert_own" ON public.todo_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todo_items_update_own" ON public.todo_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "todo_items_delete_own" ON public.todo_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_todo_items_user_id ON public.todo_items(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_items_due_date ON public.todo_items(due_date);
CREATE INDEX IF NOT EXISTS idx_todo_items_completed ON public.todo_items(completed);
