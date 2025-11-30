-- Create Supabase Storage bucket for note attachments
-- This allows us to store large files (videos, images) separately from the database

-- Create storage bucket for note attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes-attachments', 'notes-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notes-attachments' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'notes-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'notes-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to attachments (for sharing)
CREATE POLICY "Public can view attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'notes-attachments');
