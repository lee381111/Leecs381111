-- Create a storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow authenticated and anonymous users to upload
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'attachments');

CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'attachments');
