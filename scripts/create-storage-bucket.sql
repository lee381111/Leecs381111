-- Create the note-attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-attachments', 'note-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'note-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to read all files
CREATE POLICY "Users can read all files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'note-attachments');

-- Policy: Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'note-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'note-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
