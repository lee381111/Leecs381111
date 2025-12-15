CREATE TABLE IF NOT EXISTS medical_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospital', 'clinic', 'pharmacy')),
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE medical_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "medical_contacts_select_own" ON medical_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "medical_contacts_insert_own" ON medical_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "medical_contacts_update_own" ON medical_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "medical_contacts_delete_own" ON medical_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS medical_contacts_user_id_idx ON medical_contacts(user_id);
CREATE INDEX IF NOT EXISTS medical_contacts_type_idx ON medical_contacts(type);
